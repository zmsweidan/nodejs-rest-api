/**
 * @file 
 * Authentication / Authorization Module
 */
"use strict";

var jwksClient = require('jwks-rsa');
var jwt = require('jsonwebtoken');

let JWKSURI = process.env.JWKSURI;

var client = jwksClient({
    strictSsl: false,
    jwksUri: JWKSURI
});

const DB_USER = process.env.CONNECTION_USER;


/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authorize(req, res, next) {
    return next(new Error('Authorization mechanism not implemented yet!'));
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authenticate(req, res, next) {
    return next(new Error('Authentication mechanism not implemented yet!'));
}


/**
 * Retrieves the user from the request token if authentication is enabled, else the db user is returned
 * @param {Request} request http request
 */
async function getUsername(request) {
    if (process.env.AUTHENTICATION == 1) {
        return await request.res.locals.decodedToken['']
    } else {
        return DB_USER;
    }
}

/**
 * Retrieves user data from the request token if authentication is enabled, else returns static data
 * @param {Request} request http request
 */
async function getUserData(request) {
    if (process.env.AUTHENTICATION == 1) {
        let token = await request.res.locals.decodedToken['']
        return {
            username: token[''],
            firstName: token[''],
            lastName: token[''],
            application: token[''],
        }
    } else {
        return {
            username: 'templateuser',
            firstName: 'test',
            lastName: 'test',
            application: 'generic',
        }
    }
}


module.exports = {
    authenticate,
    authorize,
    getUsername,
    getUserData
};