/**
 * @file 
 * Multi-purpose swagger document writer & utlity 
 */
"use strict";

var m2s = require('mongoose-to-swagger');
var editJsonFile = require('edit-json-file');
var fs = require('fs')


/**
 * Builds and writes the entire swagger document based on its individual components 
 */
function writeSwaggerDoc() {
    try {

        // create/overwrite file
        fs.writeFileSync(`${__dirname}/swagger-doc.json`, '{}')

        // read in json components
        let _servers = generateServers();
        let _info = require('./components/info');
        let _paths = require('./components/paths');
        let _parameters = require('./components/parameters');
        let _examples = require('./components/examples');
        let _securitySchemes = require('./components/securitySchemes');

        // add schemas
        let _schemas = require('./components/schemas').static;
        let models = require('./components/schemas').dynamic;
        models.forEach(async model => {
            _schemas[model.name] = generateSchema(model);
        });

        // write to swagger doc
        let swaggerDoc = editJsonFile(`${__dirname}/swagger-doc.json`);

        swaggerDoc.set('openapi', '3.0.2');
        swaggerDoc.set('info', _info);
        swaggerDoc.set('servers', _servers);
        swaggerDoc.set('paths', _paths);
        swaggerDoc.set('components.parameters', _parameters);
        swaggerDoc.set('components.schemas', _schemas);
        swaggerDoc.set('components.securitySchemes', _securitySchemes);
        swaggerDoc.set('components.examples', _examples);
        swaggerDoc.set('security', {Bearer: []} )

        swaggerDoc.save();

        console.log('Sucessfully generated swagger document')

    } catch (error) {
        throw error;
    }
}

/**
 * Generates the 'servers' section of the swagger document
 */
function generateServers() {
    let servers;
    let http = `${process.env.HTTP_SERVER_URI}/api/v${process.env.API_VERSION}`;
    let https = `${process.env.HTTPS_SERVER_URI}/api/v${process.env.API_VERSION}`;
    if (process.env.HTTP_ENABLED == 1 && process.env.HTTPS_ENABLED == 1) {
        servers = [
            { 'url': http },
            { 'url': https }
        ];
    } else if (process.env.HTTPS_ENABLED == 1) {
        servers = [{ 'url': https }];
    } else {
        servers = [{ 'url': http }];
    }
    return servers;
}

/**
 * Converts a mongoose model to a swagger schema
 * @param {{schema:Model,name:string,subDocument:string}} model model component
 */
function generateSchema(model) {

    var swaggerSchema = m2s(model.schema);

    // for sub documents
    if (model.subDocument) {
        swaggerSchema = swaggerSchema.properties[model.subDocument];
        if (swaggerSchema.type == 'array') {
            swaggerSchema.type = 'object';
            swaggerSchema.properties = swaggerSchema.items.properties;
        }
        swaggerSchema.required = [];
    }

    swaggerSchema.required = swaggerSchema.required.length == 0 ? [''] : [...new Set(swaggerSchema.required)]
    delete (swaggerSchema.title);
    
    return swaggerSchema;
}

/*************************** REQUESTS ***************************/

/**
 * generate a swagger request body for any POST, PUT or PATCH 
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 * @param {string} type POST | PUT 
 */
function postBody(item, schema) {
    return {
        description: `Created ${item} object`,
        content: {
            'application/json': {
                schema: {
                    $ref: `#/components/schemas/${schema}`
                }
            }
        },
        required: true
    }
}

/**
 * generate a swagger request body for any POST, PUT or PATCH 
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 * @param {string} type POST | PUT 
 */
function putBody(item, schema) {
    return {
        description: `Updated ${item} object`,
        content: {
            'application/json': {
                schema: {
                    $ref: `#/components/schemas/${schema}`
                }
            }
        },
        required: true
    }
}

/**
 * generate a swagger request body for any POST, PUT or PATCH 
 * @param {string} item item/s to return
 */
function patchBody(item) {
    return {
        description: `Modify ${item} component`,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Patch'
                },
                examples: {
                    'PATCH Data Model': {
                        $ref: '#/components/examples/PATCHDataModel'
                    },
                    'PATCH Replace / Add': {
                        $ref: '#/components/examples/PATCHReplaceAdd'
                    },
                    'PATCH Copy': {
                        $ref: '#/components/examples/PATCHCopy'
                    }
                }
            }
        },
        required: true
    }
}

/**
 * generate a path parameter
 * @param {string} name parameter name
 * @param {string} description parameter description
 * @param {*} schema parameter schema
 */
function pathParameter(name, description, schema) {
    return {
        in: 'path',
        name: name,
        description: description,
        schema: schema,
        required: true
    }
}

/**
 * generate query parameter
 * @param {string} name parameter name
 * @param {string} description parameter description
 * @param {*} schema parameter schema
 * @param {*} example optional example value
 */
function queryParameter(name, description, schema, example=undefined) {
    return {
        in: 'query',
        name: name,
        description: description,
        schema: schema,
        example: example,
        required: false
    }
}

/**
 * generate a parameter by reference
 * @param {string} parameter parameter name
 */
function refParameter(parameter) {
    return { $ref: `#/components/parameters/${parameter}` }
}


/*********************** RESPONSES ***************************/

/**
* generate swagger responses for a GET 
* @param {string} item item to return
* @param {string} schema swagger schema name
* @param {string} key key of the results array. By default 'results'
*/
function getManyResponses(items, schema, paginate = true, key = 'results') {
    return {
        '200': {
            description: `successfuly retrieved ${items}`,
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            [key]: {
                                type: 'array',
                                items: { $ref: `#/components/schemas/${schema}` }
                            },
                            pagination: paginate ? 
                                { 
                                    type: 'array', 
                                    items: { $ref: `#/components/schemas/Pagination` } 
                                }
                                : undefined
                        }
                    }
                }
            }
        }
    }
}

/**
 * generate responses for a GET on a single resource
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 */
function getOneResponses(item, schema) {
    return {
        '200': {
            description: `successfully retrieved ${item}`,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${schema}`
                    }
                }
            }
        },
        '404': {
            description: `${item} not found`,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                          message: { type: 'string' },
                          // links: { $ref: `#/components/schemas/Links` } 
                        }
                    }
                }
            }
        }
    }
}

/**
 * generate responses for a POST, PUT or PATCH on a single resource
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 * @param {string} type POST | PUT | PATCH 
 */
function updateResponses(item, schema, type) {
    let action = (type == 'POST') ? 'created' : 'updated';
    let successCode = (type == 'POST') ? '200' : '201';
    return {
        [successCode]: {
            description: `${item} sucessfully ${action}`,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${schema}`
                    }
                }
            }
        },
        '400': {
            description: 'error: bad request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          target: { type: 'string' },
                          message: { type: 'string' },
                          details: { type: 'string' }
                        }
                    }
                }
            }
        },
        '404': {
            description: `${item} not found`,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                          message: { type: 'string' },
                          // links: { $ref: `#/components/schemas/Links` } 
                        }
                    }
                }
            }
        }
    }
}

/**
 * generate swagger responses for a POST request
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 */ 
function postResponses(item, schema) {
    return updateResponses(item, schema, 'POST' );
}

/**
 * generate swagger responses for a PUT request
 * @param {string} item item/s to return
 * @param {string} schema swagger schema name
 */ 
function putResponses(item, schema) {
    return updateResponses(item, schema, 'PUT' );
}

/**
 * generate swagger responses for a PATCH request
 * @param {string} item name of item 
 * @param {string} schema swagger schema name
 */ 
function patchResponses(item, schema) {
    return updateResponses(item, schema, 'PATCH' );
}

/**
 * generate swagger responses for a DELETE request
 * @param {string} item item description
 */
function deleteResponses(item) {
    return { 
        '204': {
            description: `Successfully deleted ${item}`,
            content: {}
        },
        '404': {
            description: `${item} not found`,
            content: {}
        }
    }
}

const PARAM_SCHEMAS = {
    STRING: { type: 'string' },
    NUMBER: { type: 'number' },
    BOOLEAN: { type: 'boolean' },
    DATE: { type: 'date' },
    ARRAY_STRING: { type: 'array', items: { type: 'string' } },
    ARRAY_NUMBER: { type: 'array', items: { type: 'number' } },
    ARRAY_BOOLEAN: { type: 'array', items: { type: 'boolean' } },
    ARRAY_DATE: { type: 'array', items: { type: 'date' } },
}

module.exports = { 
    writeSwaggerDoc,
    requests: {
        pathParameter,
        queryParameter,
        refParameter,
        postBody,
        putBody,
        patchBody,
    },
    responses: {
        getManyResponses,
        getOneResponses,
        postResponses,
        putResponses,
        patchResponses,
        deleteResponses
    },
    PARAM_SCHEMAS
};
