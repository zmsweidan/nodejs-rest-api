
const DROP_COLLECTIONS = false;

var server = require('../server');
var db = require('../db/test-connection');

if (process.env.MOCHA == 1) {

    before(function(done) {
        db.connect(db.MODE_TEST, done);
    })

    // add tests here
    require('./schema/user-schema.test');
    require('./api/user-api.test');

    after(function(done){ 
        if(DROP_COLLECTIONS == true){
            db.drop(function(err) {
                if (err) return done(err)    
            })
        }
        db.close();
        server.close();
        done();
    })

} else {
    console.log("\x1b[41m%s\x1b[0m","Mocha Testing Disabled, please enable in the environment file");
}