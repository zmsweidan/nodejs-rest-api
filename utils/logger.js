"use strict"

var requestIp = require('request-ip');
var APILog = require('../models/api/api-log').Model;
var auth = require('../auth/auth');
var timeStamp = require('../utils/misc').timeStamp

const LOG_DEBUG = 'DEBUG';
const LOG_INFO = 'INFO';
const LOG_WARN = 'WARN';
const LOG_ERROR = 'ERROR';
const LOG_FATAL = 'FATAL';


/**
 * Gets the log level based on the status code
 * @param {Number} code status code
 */
function getLogLevel(code){
    switch (code) {
        case 0: case null:
            return LOG_DEBUG;
        case 200 : case 201 : case 204: case 304:
            return LOG_INFO;
        case 404: 
            return LOG_WARN;
        case 500:
            return LOG_FATAL;
        default:
            return LOG_ERROR;
    }
}

/**
 * Logs http requests to the API to a collection in the database
 * @param {Request} request request from the client
 * @param {Response} response response of the API
 * @param {String} collectionQueried collection/s applicable to request
 */
async function apiLog(request, response, collectionQueried) {
    if (process.env.API_LOG == 1) {
        //if (audit.httpMethod == 'GET' && (audit.responseStatus == 200 || audit.responseStatus == 404)) return;
        if (response.statusCode == 304) response.status(200);
        try {
            
            var audit = new APILog();
            
            audit.level = getLogLevel(response.statusCode);
            audit.httpRequest = `${request.protocol}://${request.hostname}${request.originalUrl}`;
            audit.httpMethod = request.method;
            audit.responseStatus = response.statusCode;

            let ipAddress = requestIp.getClientIp(request);
            if (ipAddress) audit.ip = ipAddress;

            let user = await auth.getUserData(request);
            audit.user = user.username;
            audit.application = user.application;

            audit.date = timeStamp(new Date(), false);
            audit.collectionQueried = collectionQueried;
            audit.correlationId = response.get('X-API-Correlation-Id');
    
            audit.save();
    
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', error);
        }
    }

}

/**
 * Returns an audit node for a document prior to it being created
 * @param {Request} request request from the client
 */
async function createLog(request){
    let audit = {};
    audit.createdBy = await auth.getUsername(request);
    audit.createdDate = timeStamp(new Date());
    return audit; 
}

/**
 * Returns an audit node for an existing document before being updated
 * @param {*} model mongoose collection to be updated
 * @param {Request} request request from the client
 * @param {string} _id document id (default search)
 * @param {*} filter document filter (alternative search)
 */
async function updateLog(model, request, _id, filter=null) {
    if (!filter) {
        filter = { '_id': _id }
    }
    let document = await model.findOne(filter, {audit: 1} )
    if (document) {
        let audit = (document.audit) ? JSON.parse(JSON.stringify(document.audit)) : {};
        audit.changedBy = await auth.getUsername(request);
        audit.changedDate = timeStamp(new Date());
        return audit;
    } else {
        return null;
    }
}

module.exports = {
    getLogLevel,
    apiLog,
    createLog,
    updateLog,
};

