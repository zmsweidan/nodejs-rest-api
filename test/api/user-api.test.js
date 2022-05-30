"use strict"

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let should = chai.should();
var expect = chai.expect;

/*
* /users API
*/
exports = describe('/users API:', () => {

    let User = require('../../models/user').Model;
    const SERVER = process.env.HTTP_SERVER_URI;
    const API_PATH = `/api/v${process.env.API_VERSION}/users`;    

    before((done) => { // pre test set up       
        User.deleteMany({}, (err) => { 
            done();           
        }); 
    });

    /*
    * Test the GET /users route
    */
    describe('GET /users', () => {
        it('Should retrieve all users', (done) => {
            chai.request(SERVER)
                .get(API_PATH)
                .end((err, res) => {
                    //console.log(`\tcalling ${res.request.url}`);
                    expect(res).to.have.status(200);
                    expect(res.body['results']).to.be.an('array');
                    expect(res.body['results'].length).to.be.eql(0);
                    expect(res.body['links']).to.be.an('array');
                    done();
            });
        });
    });

    /*
    * Test the POST /users route
    */
    describe('POST /users', () => {
        let user = {
            username: "api_tester"
        }
        it('Should create a new user', (done) => {
            chai.request(SERVER)
                .post(API_PATH)
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('_id');
                    expect(res.body).to.have.property('username');
                    expect(res.body._id).to.be.a('string').and.to.not.be.null;
                    expect(res.body.username).to.be.eql('api_tester');
                    done();  
            });
        });
    });
    

    /*
    * Test the GET /users/{code} route
    */
    describe('GET /users/{username}', () => {
        it('Should retrieve a single user', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .get(`${API_PATH}/api_tester`)
                .end((err, res) => {;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    expect(res.body).to.have.property('username');
                    expect(res.body._id).to.be.a('string').and.to.not.be.null;
                    expect(res.body.username).to.be.eql('api_tester');
                    done();
            });
        });
        it('Should return a 404 if a user is not found', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .get(`${API_PATH}/new_tester`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.links).to.be.an('array');
                    expect(res.body.message).to.be.a('string');
                    done();
            });
        });
    });

    /*
    * Test the PUT /users/{code} route
    */
    describe('PUT /users/{code}', () => {
        let user = {
            username: "api_tester",
            email: "api@test.com"
        }
        it('Should update a single user', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .put(`${API_PATH}/api_tester`)
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username');
                    expect(res.body).to.have.property('email');
                    expect(res.body.username).to.be.eql('api_tester');
                    expect(res.body.email).to.be.eql('api@test.com');
                    done();
            });
        });
        it('Should return a 404 if a user is not found', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .get(`${API_PATH}/new_tester`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.links).to.be.an('array');
                    expect(res.body.message).to.be.a('string');
                    done();
            });
        });
    });

    /*
    * Test the DELETE /users/{code} route
    */
    describe('DELETE /users/{username}', () => {
        it('Should delete a single user', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .delete(`${API_PATH}/api_tester`)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    expect(res).to.not.contain.any.members;
                    done();
            });
        });
        it('Should return a 404 if a user is not found', (done) => {
            chai.request(process.env.HTTP_SERVER_URI)
                .get(`${API_PATH}/new_tester`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.links).to.be.an('array');
                    expect(res.body.message).to.be.a('string');
                    done();
            });
        });
    });

});

