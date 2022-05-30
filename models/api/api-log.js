
"use strict";

var mongoose = require('mongoose');

const DB_NAME = (process.env.MOCHA == 0) ? process.env.LOG_DB : process.env.TEST_DB;
const COLLECTION_NAME = "apiLogs";
const MODEL_NAME = "APILog"

var SCHEMA_OPTIONS = require('../common').SCHEMA_OPTIONS;

var APILog = new mongoose.Schema(
    {
        level: {type : String, required:true },
        httpRequest: { type: String, required: true },
        httpMethod: { type: String, required: true },
        responseStatus: {type: Number, required: true },
        date: { type: String, default: Date.now, required: true }, 
        ip: { type: String, required: false },
        user: {type:String, required: false},
        application: {type:String, required: false},
        collectionQueried: { type: String, required:true },
        correlationId: {type : String, required: true }
    },
    SCHEMA_OPTIONS.Document
);

// assign to mongoose connection
var db = (process.env.MOCHA == 0) ? require('../../db/connection').getDb(DB_NAME) : mongoose;
var Model = db.model(MODEL_NAME, APILog, COLLECTION_NAME);

module.exports = {
    Model,
    MODEL_NAME,
    COLLECTION_NAME
}; 