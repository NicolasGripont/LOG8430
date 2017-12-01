var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var DbUser = require('../../models_db/modelSingleton').DbUser;
var User = require('../modelsSingleton').User;

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
        		try {
        			chai.expect(err).to.deep.equal(null);
            		chai.expect(value).to.deep.equal(true);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when request to db return an error', function(done) {
        	stub.push(sinon.stub(DbUser,"find"));
        	var retour = [user];
        	stub[0].withArgs({email:user.email, password:user.password}).callsArgWith(1,{error:"error"});
        	user.logIn(function(err,value) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not login when user does not exist', function(done) {
        	stub.push(sinon.stub(DbUser,"find"));
        	var retour = [];
        	stub[0].withArgs({email:user.email, password:user.password}).callsArgWith(1,null,retour);
        	user.logIn(function(err,value) {
        		try {
        			chai.expect(err).to.deep.equal(null);
            		chai.expect(value).to.deep.equal(false);
            		done();
        		}catch(err) {
        			done(err);
        		}
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
        		try {
        			chai.expect(err).to.deep.equal(null);
            		chai.expect(newuser.email).to.deep.equal(user.email);
            		chai.expect(newuser.password).to.deep.equal(user.password);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when request to db return an error', function(done) {
        	stub.push(sinon.stub(DbUser.prototype,"save"));
        	stub[0].callsArgWith(0,{error:"error"});
        	user.save(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
    
});