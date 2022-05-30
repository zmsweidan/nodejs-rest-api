"use strict"

var router = require('express').Router();

var User = require("../models/user").Model;
var Utils = require('../utils');

const COLLECTION_NAME = require("../models/user").COLLECTION_NAME;


/**
 * Get all users (with optional query)
 */
router.get('/', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        // build query from request
        var query = request.query || {};
        Utils.queryBuilder.buildQuery(query, {}, 0); 

        // add custom filters here...
        if (query.active) {
            let activeValue = (query.active == 'true') ? true : false;
            if (!query.filter['$and']) query.filter['$and'] = [];
            query.filter['$and'].push( {'active': activeValue } );
        }

        // mongo query
        var results = await User.find(query.filter, query.fields).sort(query.order).limit(query.limit).skip(query.skip).exec();
        var count = await User.countDocuments(query.filter).exec();

        // send results
        Utils.responseBuilder.sendSuccessResponse(request, response, results, count);

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally  {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    }
});


/**
 * Create a user
 */
router.post('/', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        var user = new User(request.body);
        var results = await user.save();

        Utils.responseBuilder.sendSuccessResponse(
            request, response, results, null,
            'user', request.body.username, COLLECTION_NAME
        );

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


/**
 * Get a user by username
 */
router.get('/:username', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {
        
        var results = await User.findOne({ username: request.params.username })
            .populate('roles') // User.roles field
            .exec();

        Utils.responseBuilder.sendSuccessResponse(
            request, response, results, null,
            'user', request.params.username, COLLECTION_NAME
        );

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally  {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


/**
 * Update a user by username
 */
router.put('/:username', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        var results = await User.findOneAndUpdate( 
            { username: request.params.username },
            { $set: request.body },
            { runValidators: true, new: true }
        ).exec();

        Utils.responseBuilder.sendSuccessResponse(
            request, response, results, null,
            'user', request.params.username, COLLECTION_NAME
        );

    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


/**
 * Delete a user by username
 */
router.delete('/:username', async (request, response) => {
    Utils.responseBuilder.generateHeaders(response);
    try {

        var results = await User.deleteOne({ username: request.params.username }).exec();

        Utils.responseBuilder.sendSuccessResponse(
            request, response, results, null,
            'user', request.params.username, COLLECTION_NAME
        );
        
    } catch (error) {
        Utils.responseBuilder.sendErrorResponse(response, error, COLLECTION_NAME);
    } finally {
        Utils.logger.apiLog(request, response, COLLECTION_NAME);
    };
});


module.exports = router;