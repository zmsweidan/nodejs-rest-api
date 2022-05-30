
"use strict";

var mongoose = require('mongoose');
var SCHEMA_OPTIONS = require('./common').SCHEMA_OPTIONS;

const MODEL_NAME = "Role"
const COLLECTION_NAME = "role";

var Role = new mongoose.Schema(
    {
        roleId: { type: String, required: true, index: {unique: true} },
        appId: { type: String, required: true },
        roleType: { type: String, required: true },
        descriptionEN: { type: String, required: false },
        descriptionFR: { type: String, required: false },
        creationDate: { type: Date, default: Date.now, required: false },
    },
    SCHEMA_OPTIONS.Document
);

var db = (process.env.MOCHA == 0) ? require('../db/connection').getDb(process.env.PRIMARY_DB) : mongoose;
var Model = db.model(MODEL_NAME, Role, COLLECTION_NAME);

module.exports = {
    Model,
    MODEL_NAME,
    COLLECTION_NAME
}; 