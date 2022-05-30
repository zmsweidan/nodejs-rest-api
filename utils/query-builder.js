
"use strict"


/**
 * Converts a query sent via an API GET request into parameters in mongo
 * @param {*} query request query params
 * @param {*} defaultFields default fields to retreieve ({} to retrieve all)
 * @param {number} defaultLimit default limit when limit not specified (0 for no limit)
 */
function buildQuery(query, defaultFields, defaultLimit ) {
    query.filter = query.filter ? mongoFilter(query.filter) : {};
    query.fields = query.fields ? mongoFields(query.fields) : defaultFields;
    query.order = query.order ? query.order : {};
    query.limit = query.limit ? parseInt(query.limit) :  defaultLimit;
    query.page = query.page ? parseInt(query.page) : 1;
    query.skip = query.page ? (query.page-1)*query.limit : 0;
    mongoRange(query);
}


/**
 * Converts an API range fillter request to mongo syntax
 */ 
function mongoRange(query) {
    let range = query.range;
    if (query.range) {
        let gte = {};
        let lte = {};
        range = JSON.parse(decodeURIComponent(range));
        switch(range.type) {
            case "number":
                gte[range.field] = { '$gte': Number(range.low) };
                lte[range.field] = { '$lte': Number(range.high) };
                break;
            case "date":
                gte[range.field] = { '$gte': new Date(range.low + " 00:00:00.000") };
                lte[range.field] = { '$lte': new Date(range.high + " 23:59:00.000") };
                break;
            case "datetime":
                gte[range.field] = { '$gte': new Date(range.low) };
                lte[range.field] = { '$lte': new Date(range.high) };
                break;
            default:
                gte[range.field] = { '$gte': range.low };
                lte[range.field] = { '$lte': range.high };
        }
        
        if (!query.filter['$and']) query.filter['$and'] = [];
        query.filter['$and'].push(gte);
        query.filter['$and'].push(lte);
    }
}


/**
 * Converts an API fields filter request to mongo syntax e.g.
 * @param {*} fields 
 */
function mongoFields(fields){
    let mongoFields = {};
    if (!Array.isArray(fields)){
        fields = [fields];
    }
    fields.forEach(fieldName => {
        mongoFields[fieldName] = 1;
    });
    return mongoFields;
}


/**
 * Converts an API filter request to mongo syntax e.g.
 * @param {*} queryFilter 
 */
function mongoFilter(queryFilter) {

    let mongoFilter = {};
    mongoFilter["$and"] = [];
    queryFilter = JSON.parse(decodeURIComponent(queryFilter));

    if (queryFilter.and) {
        if (queryFilter.and.length > 0) {
            let andQuery = mongoFilterArray(queryFilter.and)
            andQuery.forEach( value => {
                mongoFilter["$and"].push(value)
            })
        }
    }

    if (queryFilter.or) {
        if (queryFilter.or.length > 0) {
            mongoFilter["$or"] = mongoFilterArray(queryFilter.or)
            if (mongoFilter["$and"].length == 0) {
                delete(mongoFilter["$and"])
            }
        }
    } 

    return mongoFilter;
}


/**
 * Converts the and/or array inside the filter query to mongo
 * @param {*} fields 
 */
function mongoFilterArray(fields) {
    let itemObject, itemValue;
    let array = [];
    fields.forEach( item => {
        itemObject = {};
        itemValue = {};

        // set default operator (if not set)
        if (!item.operator) {
            item.operator = "$in";
        }

        // bind each value to a regex expression (if explicit=false)
        if (!item.explicit) {
            item.values = item.values.map( value => { 
                let escapedValue = value.replace(/([<>*()?&#])/g, "\\$1"); // replace with escaped characters
                return new RegExp(`${escapedValue}\\w*`, 'i'); 
            });
        }

        itemValue[item.operator] = item.values;
        itemObject[item.field] = itemValue;
        array.push(itemObject);
    })
    return array;
}


/**
 * Generic document array/subdocument aggregation filter
 * @param {*} arrayField array inside the document
 * @param {*} arrayFilter filter to use inside the array
 * @param {*} docFilter optional document match filter
 * @param {*} fields optional field projection
 */
function mongoArrayAggregator(arrayField, arrayFilter, docFilter={}, fields=null ) {
    return [
        { '$match': docFilter },
        ...(fields) ? [{ '$project': fields }] : [], 
        {
            '$unwind': {
                'path': `$${arrayField}`,
                'preserveNullAndEmptyArrays': false
            }
        },
        { '$match': arrayFilter }, 
        {
            '$group': {
                '_id': '$_id',
                [`${arrayField}`]: { '$push': `$${arrayField}` }
            }
        }
    ]
}


/**
 * Generate a single filter item
 * @param {[{field: [string]}]} queryObject 
 * @param {boolean} explicit 
 * @param {boolean} nin
 */
function filterItem(queryObject, explicit=false, nin=false){
    let operator = nin? '$nin' : '$in'
    let item = {}
    let arrayObj = Object.entries(queryObject)[0];
    item.field = arrayObj[0];
    item.values = arrayObj[1];
    item.operator = operator;
    item.explicit = explicit;
    return item;
}


/**
 * Generate a single and / or filter string
 * @param {[any]} filterArray 
 * @param {boolean} or 
 */
function buildFilterString(filterArray, or=false){
    let filter = {}
    let filterType =  or? 'or' : 'and'
    filter[filterType] = [];
    filterArray.forEach( item => { filter[filterType].push(item)})
    return 'filter=' + JSON.stringify(filter);
}


/**
 * Generate a combined and/or filter
 * @param {string} filterStringAnd 
 * @param {string} filterStringOr 
 */
function buildCombinedFilterString( filterStringAnd, filterStringOr) {
    let and = JSON.parse(filterStringAnd.replace('filter=', '')).and;
    let or = JSON.parse(filterStringOr.replace('filter=', '')).or;
    let filter = { and, or }
    return 'filter=' + JSON.stringify(filter)
}


module.exports = {
    buildQuery,
    mongoFilter,
    mongoFields,
    mongoRange,
    mongoArrayAggregator,
}