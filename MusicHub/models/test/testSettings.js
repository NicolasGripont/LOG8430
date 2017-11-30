var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var DbSettings = require('../../models_db/modelSingleton').DbSettings;
var Settings = require('../settings');

describe('Settings Model', function() {
	
	var stub = [];
	var userEmail = "test@test.com";
	var settings;
	
	beforeEach(function() {
	    // runs before each test in this block
		settings = new Settings(userEmail);
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
            assert.equal(userEmail, settings.userEmail);
        });
    });
    
    describe('method save', function() {
        
        it('should return an error when the db return an error on find', function(done) {
        	var options = {option:"option"};
        	var platform = "spotify";
        	stub.push(sinon.stub(DbSettings,"find"));
        	stub[0].withArgs({userEmail:settings.userEmail}).callsArgWith(1,{error:"error"});
        	settings.save(platform,options,function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the database return an error on save', function(done) {
        	var options = {option:"option"};
        	var platform = "spotify";
        	stub.push(sinon.stub(DbSettings,"find"));
        	stub.push(sinon.stub(DbSettings.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({userEmail:settings.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	settings.save(platform,options,function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not return an error when database is ok and the settings does not exist', function(done) {
        	var options = {option:"option"};
        	var platform = "spotify";
        	stub.push(sinon.stub(DbSettings,"find"));
        	stub.push(sinon.stub(DbSettings.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({userEmail:settings.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,undefined);
        	settings.save(platform,options,function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not return an error when database is ok and the settings exist', function(done) {
        	var options = {option:"option"};
        	var platform = "spotify";
        	var obj = {save:function(){}};
        	stub.push(sinon.stub(DbSettings,"find"));
        	stub.push(sinon.stub(obj,"save"));
        	var retour = [obj];
        	stub[0].withArgs({userEmail:settings.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,undefined);
        	settings.save(platform,options,function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
});