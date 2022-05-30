"use strict";

require('mongoose-type-email');
var mongoose = require('mongoose');
var SCHEMA_OPTIONS = require('./common').SCHEMA_OPTIONS;

const MODEL_NAME = "User";
const COLLECTION_NAME = "user";

var User = new mongoose.Schema(
    {
        username: { type: String, required: true, index: {unique: true} },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        email:  { type: mongoose.SchemaTypes.Email, required: false, index: {unique: true, sparse: true} },
        active: { type: Boolean, required: false },
        lastLogin: { type: Date, default: Date.now, required: false },
        roles: [{ type: mongoose.Schema.Types.ObjectId, ref: require('./role').MODEL_NAME, required: false }],
    },
    SCHEMA_OPTIONS.Document
);

var db = (process.env.MOCHA == 0) ? require('../db/connection').getDb(process.env.PRIMARY_DB) : mongoose;
var Model = db.model(MODEL_NAME, User, COLLECTION_NAME);

module.exports = {
    Model,
    MODEL_NAME,
    COLLECTION_NAME
}; 

