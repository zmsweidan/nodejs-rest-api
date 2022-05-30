"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SCHEMA_OPTIONS = require('../common').SCHEMA_OPTIONS;
const MODEL_NAME = 'Patch';


/**
 * PatchElement contains a patch for a specific field in a (sub-)document.
 */
const PatchElement = new Schema ({
    op: {type: String, required: true, enum: ['add', 'copy', 'replace', 'move', 'remove', 'test']},
    path: {type: String, required: true, match: /^(\/[^/][/\w]+)*/},
    from: {type: String},
    value: {type: String}},
     SCHEMA_OPTIONS.Nested
);

const Patch = new Schema(
    {patch: [PatchElement]},
    SCHEMA_OPTIONS.Nested
);


const Model = mongoose.model(MODEL_NAME, Patch, null, true);

module.exports = {
    Model,
    MODEL_NAME
}; 