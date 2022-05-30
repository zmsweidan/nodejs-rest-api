"use strict"

const uuidv1 = require('uuid/v1');

/**
 * Modify response headers
 * @param {Response} response 
 */
function generateHeaders(response) {
    /// GUID Header and clean up leaky headers ///
    var correlationId = uuidv1();
    response.set('X-API-Correlation-Id',correlationId);
    response.removeHeader('X-Powered-By');  
}

/**
 * Create custom HATEOAS links using this format: `[ [href, rel, method ], ... ]`
 * @param {string[][]} inputLinks 
 */
function hateoasLinks(inputLinks) {
    var outputLinks = [];
    inputLinks.forEach(link => {
        outputLinks.push( { 
            href: link[0],
            rel: link[1],
            method: link[2]
        });
    });
    return outputLinks
}

/**
 * Create default single HATEOAS link
 * @param {Request} request 
 */
function hateoasGETLinks(request) {
    return hateoasLinks([ [ `${request.protocol}://${request.get('Host')}${request.originalUrl}`, "self", request.method ] ]);
}

/**
 * Create default single HATEOAS link for PUT, POST or DELETE
 * @param {Request} request 
 * @param {string} collection_name 
 * @param {any} id 
 */
function hateoasUPDATELinks(request, collection_name, id) {
    let post_id = request.method == "POST" ? `/${id}` : "" ;
    return hateoasLinks([
        [ 
            `${request.protocol}://${request.get('Host')}${request.originalUrl}${post_id}`,
            `${collection_name}-${request.method.toLocaleLowerCase()}`,
            request.method 
        ] 
    ]);
}

/**
 * Retrieve pagination details based on the query results
 * @param {*} n number of results
 * @param {*} currentPage current page
 * @param {*} pageSize  page size
 */
function paginationInfo(n, currentPage, pageSize){
    n = parseInt(n);
    currentPage = parseInt(currentPage);
    pageSize = parseInt(pageSize);
    let lastPage = Math.ceil(n/pageSize);
    return {
        results: n,
        size: pageSize,
        pages: {
            current: currentPage,
            previous: currentPage == 1 ? null : currentPage - 1,
            next: currentPage == lastPage ? null : currentPage + 1,
            last: lastPage
        }
    }
}

/**
 * Sends an error response based on the captured error
 * @param {Response} response 
 * @param {Error} error 
 * @param {String} collectionName 
 */
function sendErrorResponse(response, error, collectionName) {
    console.error('\x1b[31m%s\x1b[0m', error);

    let errorObj = Object();
    errorObj.code = error.name;
    errorObj.target = collectionName;

    switch (error.name) {
        case 'ValidationError': // mongoose error
            errorObj.message = error.message; 
            errorObj.details = error.errors; 
            response.status(400); 
            break;
        case 'MongoError': // mongo error
            errorObj.message = error.errmsg;
            if (error.code == 11000) {
                response.status(400);
            } else {
                response.status(500);
            } 
            break;
        default: // other
            errorObj.message = error.message;  
            response.status(500);
    }

    response.send(errorObj);
}

/**
 * Send a HTTP response after a sucessfull operation, if results are null then a 404 response is returned
 * @param {Request} request http request
 * @param {Response} response http response
 * @param {any} results results to send, if null then a 404 is sent
 * @param {number} count result count for paginated query (GET)
 * @param {string} itemName message item e.g. user (POST/PUT)
 * @param {string} id resource/item identifier e.g. _id (POST/PUT)
 * @param {string} collectionName collection name (POST/PUT)
 */
function sendSuccessResponse(request, response, results, count=0, itemName='resource', id='___', collectionName='' ) {

    results = JSON.parse(JSON.stringify(results));
    var links;

    switch(request.method) {

        case 'GET':
            links = hateoasGETLinks(request);
            if (results) {
                if (Array.isArray(results)) {
                    (count)
                    var pagination = paginationInfo(count, request.query.page, request.query.limit);
                    response.status(200).send({ results, links, pagination });   
                } else {
                    results.links = links;
                    response.status(200).send(results);
                }
            } 
            break;

        case 'POST':
            links = hateoasUPDATELinks(request, collectionName, id);
            if (results) {
                results.links = links;
                results.message = `${itemName} ${id} sucessfully created.`
                response.status(201).send(results);
            }
            break;

        case 'PUT':
            links = hateoasUPDATELinks(request, collectionName, id);
            if (results) {
                results.links = links
                results.message = `${itemName} ${id} sucessfully updated.`;
                response.status(200).send(results);
            }
            break;

        case 'DELETE':
            links = hateoasUPDATELinks(request, collectionName, id);
            if (results) {
                response.status(204).send({});
            }
            break;
    }

    // 404 
    if (results == null) {
        response.status(404).send({ message: `${itemName} ${id} not found!`, links });
    }
}

module.exports = { 
    generateHeaders,
    hateoasLinks,
    hateoasGETLinks,
    hateoasUPDATELinks,
    paginationInfo,
    sendSuccessResponse,
    sendErrorResponse
} 
