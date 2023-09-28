/**
 * @file 
 * Initializes the express application which includes authenticaion/authorization, 
 * mapping profiles, swagger and API routes
 */
"use strict";

var express = require('express');
var bodyParser= require('body-parser');
var rateLimit = require('express-rate-limit');
var cors = require('cors');

var auth = require('./auth/auth');
const API_VERSION = process.env.API_VERSION;
const APP_PATH = process.env.APP_PATH;


/**
 * Express Initialization
 */
var app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
express.Router().use(bodyParser.urlencoded({ extended: false }));
express.Router().use(bodyParser.json());


/**
 * Rate limit API requests
 */ 
if (process.env.RATE_LIMITING == 1) {
    const limiter = rateLimit({
        windowMs: 10 * 1000, // rate limit time frame
        max: 20 // requests per windowMs for each IP
    });
       
    // apply to all requests
    app.use(limiter);
}


/*
 * API routes
 */
const BASE_PATH = `${APP_PATH}/api/v${API_VERSION}`;

var authCheck = process.env.AUTHENTICATION == 1 ? auth.authenticateToken : [];
if (process.env.AUTHORIZATION == 1) {
    authCheck = [auth.authenticateToken, auth.authorize];
}

app.use(`${BASE_PATH}/users`, authCheck, require('./controllers/user.controller'));
app.use(`${BASE_PATH}/roles`, authCheck, require('./controllers/role.controller'));
// add more api paths here as nessecary...


/** 
 * Services
 */
if (process.env.SERVICES == 1) {
    require('./services/sample.service')
    // add more services here as nessecary...
}


/*
 * Swagger Config
 */
const SWAGGER_PATH = `${APP_PATH}/swagger`;
if (process.env.SWAGGER == 1) {
    require('./swagger/swagger-writer').writeSwaggerDoc();
    const swaggerDocument = require(`${__dirname}/swagger/swagger-doc.json`);
    const swaggerUi = require('swagger-ui-express');
    app.use(SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}


/**
 * Home/Default page
 */
app.get( APP_PATH, function(req, res){
    if (process.env.SWAGGER == 1) {
        res.redirect(SWAGGER_PATH) 
    } else {
        res.send('site is up!')
    }
});



module.exports = app;
