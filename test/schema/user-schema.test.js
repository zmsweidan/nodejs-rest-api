

var expect = require('chai').expect;
  
exports = describe('User Schema:', function(){

  var DROP_COLLECTION = true;
  var user = require('../../models/user').Model;

  before(function(done) {
    if (DROP_COLLECTION) {
      user.deleteMany({}, (err) => { 
        done();           
      }); 
    } else {
      done();
    }
  });

  //Add tests in the format below
  describe('Tests that are performing a similar function',function(){
  //Use optional callback function (done) for asynchronous functionality
    it('Should perform this task',function(done){
        //Test goes here
        
        done();
    })
  
    it('Should also perform this task',function(done){
      //Test goes here
  
      done();
    })
  });
  
  describe('Tests that make sure the model is correct',function(){
  
    it('Make sure required fields exist',function(done){
      var tempUser = new user();
  
      tempUser.validate(function(err){
        expect(err.errors.username).to.exist;
        expect(err.errors.password).to.not.exist;
        
        done();
      })  
    })
  })
  
  describe('Tests that check database CRUD functionality',function(done){
  
    it('Should save a new user to the database', function(done) {
      var testUser = user({
        
        username:"cass9907",
        firstName:"Jessica",
        lastName:"Cassidy",
        email:"cass9907@adsd.web",
        password:"password123",
        active:true,
        lastLogin:Date.now(),
        roleId:true,
      });
  
      testUser.save(err => {
        if(err) {
          throw new Error(err); 
          }
        else{ done(); }
        
      });
    });
  
    it('Should retrieve a user from the database',function(done){
        user.find({username: 'cass9907'}, (err, results) => {
        if(err) {throw err;}
        if(results.length === 0) {throw new Error('User not found!');}
        done();
      });
    })
  
    it('Should update a user from the database',function(done){
      
    user.findOneAndUpdate({username:'cass9907'},{email:'cass9907@newDomain.com'}, {useFindAndModify: false}, (err,results)=>{
      if(err){throw new err;}
      if(!results){throw new Error('User not found!')}
      done();
    });
  
    })
  })
  
})
