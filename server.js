/**
 * @file 
 * initializes the server and database connection(s).
 */
"use strict";

var fs = require('fs');
var http = require('http');
var https = require('https');

// set environment variables
require('custom-env').env(process.env.NODE_ENV);
require('dotenv').config({overwrite: true});
process.env.HTTP_SERVER_URI = `http://${process.env.SERVER}:${process.env.HTTP_PORT}${process.env.APP_PATH}`;
process.env.HTTPS_SERVER_URI = `https://${process.env.SERVER}:${process.env.HTTPS_PORT}${process.env.APP_PATH}`;
process.env.CONNECTION_HOST = process.env.CONNECTION_URI?.split('@')[1]?.split('/')[0];
process.env.CONNECTION_USER = process.env.CONNECTION_URI?.split('://')[1]?.split(':')[0];

// connect to database(s)
if (process.env.MOCHA == 0) {
    require("./db/connection").initConnection(function (err) { if (err) throw err; });
}

// initialise express app
var app = require('./app');

// start server(s)
if (process.env.DEPLOYMENT == 1) { // DEPLOYMENT
    
    app.listen(process.env.PORT, function (err) {
        if (process.env.HTTP_ENABLED == 1) console.log(`listening on - ${process.env.HTTP_SERVER_URI}`);
        if (process.env.HTTPS_ENABLED == 1) console.log(`listening on - ${process.env.HTTPS_SERVER_URI}`);
        if (err) throw err;
    });

} else { // LOCAL

    if (process.env.HTTP_ENABLED == 1) {
        var http_server = http.createServer(app.listen(process.env.HTTP_PORT, function (err) {
            if (err) throw err;
            if (process.env.MOCHA == 0) {
                console.log(`HTTP API - http://localhost:${process.env.HTTP_PORT}${process.env.APP_PATH}/api/v${process.env.API_VERSION}/`
                            + `\n\t   http://localhost:${process.env.HTTP_PORT}${process.env.APP_PATH}/swagger`);
            }
        }));
    }
    if (process.env.HTTPS_ENABLED == 1) {
        var options = {
            key: fs.readFileSync(`./certificates/${process.env.SERVER}.key`),
            cert: fs.readFileSync(`./certificates/${process.env.SERVER}.cert`)
        };
        var https_server = https.createServer(options, app).listen(process.env.HTTPS_PORT, function (err) {
            if (err) throw err;
            if (process.env.MOCHA == 0) {
                console.log(`HTTPS API - https://localhost:${process.env.HTTPS_PORT}/api/v${process.env.API_VERSION}/`
                            + `\n\t    https://localhost:${process.env.HTTPS_PORT}/swagger`);
            }
        });    
    }
}

function close() {
    if (process.env.HTTP_ENABLED == 1)  http_server.close();
    if (process.env.HTTPS_ENABLED == 1)  https_server.close();
}

module.exports = { close }
