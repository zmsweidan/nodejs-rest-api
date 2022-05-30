"use strict"

var router = require('express').Router();

var Role = require("../models/role").Model;
var Utils = require('../Utils');

const COLLECTION_NAME = require("../models/user").COLLECTION_NAME;


/**
 * Get all roles (with optional query)
 */
router.get('/', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        // build query from request
        var query = request.query || {};
        Utils.queryBuilder.buildQuery(query, {}, 100);

        // mongo query
        var results = await Role.find(query.filter, query.fields).sort(query.order).limit(query.limit).skip(query.skip).exec();
        var count = await Role.countDocuments(query.filter).exec();

        // send results
        Utils.responseBuilder.sendSuccessResponse(request, response, results, count);

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally  {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


/**
 * Get a role by roleId
 */
router.get('/:roleId', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        var results =  await Role.findOne( { roleId: request.params.roleId }).exec();

        Utils.responseBuilder.sendSuccessResponse(
            request, response, results, null,
            'role', request.body.roleId, COLLECTION_NAME
        );

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally  {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


module.exports = router;