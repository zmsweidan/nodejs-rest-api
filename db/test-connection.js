var mongoose = require('mongoose');
var async = require('async');
require('custom-env').env(process.env.NODE_ENV);

var state = {
    db: null,
    mode: null,
}

//can create prod uri if needed
exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

let db;
exports.connect = function (mode, done) {
    if (state.db) return done()

    var uri = process.env.CONNECTION_URI;

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(uri, function (err, db) {
        if (err) return done(err)
        state.db = db;
        state.mode = mode
    })

    db = mongoose.connection.useDb(process.env.TEST_DB);
    state.db = db;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function () {
        console.log("\x1b[32m%s\x1b[0m", 'Successful connection to the database');
        done();
    })
}

exports.getDb = function () {
    return state.db
}

exports.drop = async function () {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {  
         await collection.deleteOne(); 
    }
}

exports.fixtures = function (data, done) {
    var db = state.db
    if (!db) {
        return done(new Error('Missing database connection.'))
    }

    var names = Object.keys(data.collections)
    async.each(name, function (name, cb) {
        db.createCollection(name, function (err, collection) {
            if (err) return cb(err)
            collection.insert(data.collections[name], cb)
        })
    }, done)
}

exports.close = function () {
    mongoose.connection.close();
}