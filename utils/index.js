"use strict"

var queryBuilder = require('./query-builder');
var responseBuilder = require('./response-builder');
var logger = require('./logger');
var misc = require('./misc');

const COLORS = {
    GREEN: '\x1b[32m%s\x1b[0m',
    RED: '\x1b[31m%s\x1b[0m',
    BLUE: '\x1b[34m%s\x1b[0m'
}

module.exports = {
    queryBuilder,
    responseBuilder,
    logger,
    misc,
    COLORS
}