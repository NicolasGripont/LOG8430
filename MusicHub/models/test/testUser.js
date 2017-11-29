var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var DbUser = require('../../models_db/modelSingleton').DbUser;
var User = require('../user');

describe('User Model', function() {
	
	var email = "test@test.com";
    var password = "password";
    var user;
	var stub = [];
	
	beforeEach(function() {
	    // runs before each test in this block
		//on initialise une playlist
		user = new User(email, password);
	});
	
	afterEach(function() {
	    // runs after each test in this block
		for(var i=0;i<stub.length;i++) {
			stub[i].restore();
		}
		stub = [];
	});
	
	
    describe('constructor', function() {
        it('should have the correct attributes', function() {
            assert.equal(email, user.email);
            assert.equal(password, user.password);
        });
    });

    describe('method login', function() {
        it('should login properly', function(done) {
        	stub.push(sinon.stub(DbUser,"find"));
        	var retour = [user];
        	stub[0].withArgs({email:user.email, password:user.password}).callsArgWith(1,null,retour);
        	user.logIn(function(err,value) {
        		chai.expect(null).to.deep.equal(err);
        		chai.expect(true).to.deep.equal(value);
        		done();
        	});
        });
        
        it('should return an error when request to db return an error', function(done) {
        	stub.push(sinon.stub(DbUser,"find"));
        	var retour = [user];
        	stub[0].withArgs({email:user.email, password:user.password}).callsArgWith(1,{error:"error"});
        	user.logIn(function(err,value) {
        		chai.expect({error:"error"}).to.deep.equal(err);
        		done();
        	});
        });
        
        it('should not login when user does not exist', function(done) {
        	stub.push(sinon.stub(DbUser,"find"));
        	var retour = [];
        	stub[0].withArgs({email:user.email, password:user.password}).callsArgWith(1,null,retour);
        	user.logIn(function(err,value) {
        		chai.expect(null).to.deep.equal(err);
        		chai.expect(false).to.deep.equal(value);
        		done();
        	});
        });
    });
    
    describe('method save', function() {
        it('should not return an error', function(done) {
        	stub.push(sinon.stub(DbUser.prototype,"save"));
        	var newuser = new DbUser({email:user.email, password:user.password});
        	stub.push(sinon.stub(DbUser.prototype,"constructor"));
        	stub[0].callsArgWith(0,null);
        	stub[1].withArgs({email:user.email, password:user.password}).returns(newuser);
        	user.save(function(err) {
        		chai.expect(null).to.deep.equal(err);
        		chai.expect(newuser.email).to.deep.equal(user.email);
        		chai.expect(newuser.password).to.deep.equal(user.password);
        		done();
        	});
        });
        
        it('should return an error when request to db return an error', function(done) {
        	stub.push(sinon.stub(DbUser.prototype,"save"));
        	stub[0].callsArgWith(0,{error:"error"});
        	user.save(function(err) {
        		chai.expect({error:"error"}).to.deep.equal(err);
        		done();
        	});
        });
    });
    
});