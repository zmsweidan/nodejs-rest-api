/**
 * @file 
 * Initialize the default mongoose connection and adds dbs as needed
 */
"use strict"

const winCA = require('win-ca/api');
const assert = require("assert");
var mongoose = require('mongoose');

let _connection;
let _db, _logdb // add dbs as needed

/**
 * Initializes the default mongoose connection
 * @param {*} callback 
 */
function initConnection(callback) {
    
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true)
    
    if (process.env.MONGO_SSL == 1) {

        var CertificateList = [];
        // Fetch all certificates in PEM format
        winCA({
            format: winCA.der2.pem,
            store: [process.env.CERTIFICATE_STORE],
            ondata: crt => {
                CertificateList.push(crt);
            }
        });

        var options = {
            ssl: true,
            sslValidate: true,
            sslCA: CertificateList
        }

    } else {
        var options = {}
    }

    mongoose.connect(process.env.CONNECTION_URI, options);
    
    _connection = mongoose.connection;
    _connection.on('error', console.error.bind(console, 'connection error:'));
    _connection.once('open', function() {
        console.log(`Created connection pool to ${process.env.CONNECTION_HOST} with db user '${process.env.CONNECTION_USER}'`);
        return callback(null, _connection);
    });
    
    _db = _connection.useDb(process.env.PRIMARY_DB);
    _logdb = _connection.useDb(process.env.LOG_DB);
    
}

/**
 * Returns a db specific mongoose connection
 * @param {string} connectionName 
 */
function getDb(connectionName){
    assert.ok(_connection, "Error: connection has not been initialized yet!");
    switch (connectionName) {
        case process.env.PRIMARY_DB: return _db;
        case process.env.LOG_DB: return _logdb
        default: return _db;
   }
}

module.exports = {
    initConnection,
    getDb
};
