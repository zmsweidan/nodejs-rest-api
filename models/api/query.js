
"use strict";

var mongoose = require('mongoose');
var SCHEMA_OPTIONS = require('../common').SCHEMA_OPTIONS;

const DB_NAME = (process.env.MOCHA == 0) ? process.env.PRIMARY_DB : process.env.TEST_DB;

var Field = new mongoose.Schema(
    {
        field: {type: String, required: true},
        values: {type: [String], required: true},
        operator: {type: String, enum: ['$in', '$nin'], default: "$in"},
        explicit: {type: Boolean, default: false}
    },
    SCHEMA_OPTIONS.Nested
)

var Filter = new mongoose.Schema(
    {
        and: [Field],
        or: [Field]
    },
    SCHEMA_OPTIONS.Nested
);

var Range = new mongoose.Schema(
    {
        field: {type: String, required: true },
        type: {type: String, required: false, enum: ['number', 'string', 'date'], default: 'string'},
        low: {type: String, required: true },
        high: {type: String, required: true }
    },
    SCHEMA_OPTIONS.Nested
);

// assign to mongoose connection
var db = (process.env.MOCHA == 0) ? require('../../db/connection').getDb(DB_NAME) : mongoose;
var Range = db.model('Range', Range, null, true);
var Filter = db.model('Filter', Filter, null, true);

module.exports = {
    Range,
    Filter
}; 