const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_OPTIONS = {
    Document: { versionKey: false },
    Nested: { _id : false, versionKey: false }
};

const BilingualValue = new Schema({
    en: {type: String},
    fr: {type: String}

}, SCHEMA_OPTIONS.Nested );

const StoredCode = new Schema({
    code: { type: String, required: false },
    description: { type: BilingualValue, required: true },
    
}, SCHEMA_OPTIONS.Nested);

const Note = new Schema({
    createdBy: String,
    createdDate: Date,
    comment: String

}, SCHEMA_OPTIONS.Nested );

const ChangeLog = new Schema({
    createdBy: String,
    createdDate: { type: String, default: Date.now },
    changedBy: String,
    changedDate: { type: String, default: Date.now }

}, SCHEMA_OPTIONS.Nested );

module.exports = {
    SCHEMA_OPTIONS,
    BilingualValue,
    StoredCode,
    ChangeLog,
    Note
};