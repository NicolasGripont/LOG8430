var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var User = require('../../models/user');
var UserController = require('../user-controller');


describe('User-controller', function() {
	
	var req;
	var res;
    var controller;
    var email = "admin@admin.com";
    var pass = "123456";
	var stub = [];
	
	beforeEach(function() {
	    // runs before each test in this block
		//on initialise une playlist
		controller = new UserController();
		res = {status:function(val){return this;},json:function(val){return this;}};
		req = {body:{email:email,password:pass},session:{destroy:function(){}}};
	});
	
	afterEach(function() {
	    // runs after each test in this block
		for(var i=0;i<stub.length;i++) {
			stub[i].restore();
		}
		stub = [];
	});
	
	
	describe('method createUser', function() {
        it('should create the user', function(done) {
        	stub.push(sinon.stub(User.prototype,"save"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,null);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(200);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"OK"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.createUser(req,res);
        });
        
        it('should send a bad parameter when a bad email is given', function(done) {
        	stub.push(sinon.stub(User.prototype,"save"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	req.body.email = "";
        	stub[0].callsArgWith(0,null);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(false);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Bad Email or password."});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.createUser(req,res);
        });
        
        it('should send a bad parameter when a bad password is given', function(done) {
        	stub.push(sinon.stub(User.prototype,"save"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	req.body.password = "";
        	stub[0].callsArgWith(0,null);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(false);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Bad Email or password."});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.createUser(req,res);
        });
        
        it('should send a Email is already used when the databse send an error', function(done) {
        	stub.push(sinon.stub(User.prototype,"save"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,{error:"error"});
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Email is already used by another user."});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.createUser(req,res);
        });
    });
	
	describe('method logIn', function() {
		
        it('should logIn the user', function(done) {
        	stub.push(sinon.stub(User.prototype,"logIn"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,null,true);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(200);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"OK"});
        			chai.expect(req.session.email).to.deep.equal(email);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logIn(req,res);
        });
        
        it('should send a bad parameter when a bad email is given', function(done) {
        	stub.push(sinon.stub(User.prototype,"logIn"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	req.body.email = "";
        	stub[0].callsArgWith(0,null,true);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(false);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Bad email or password."});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logIn(req,res);
        });
        
        it('should send a bad parameter when a bad password is given', function(done) {
        	stub.push(sinon.stub(User.prototype,"logIn"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	req.body.password = "";
        	stub[0].callsArgWith(0,null,true);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(false);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Bad email or password."});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logIn(req,res);
        });
        
        it('should send a Email is already used when the databse send an error', function(done) {
        	stub.push(sinon.stub(User.prototype,"logIn"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,{error:"error"});
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(500);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Connection to database failed"});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logIn(req,res);
        });
        
        it('should send a message bad email when user is not found in db', function(done) {
        	stub.push(sinon.stub(User.prototype,"logIn"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,null,false);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Bad email or password."});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logIn(req,res);
        });
	});
	
	
	describe('method logOut', function() {
		
        it('should logOut the user', function(done) {
        	stub.push(sinon.stub(req.session,"destroy"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,null);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(200);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"OK"});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logOut(req,res);
        });
        
        it('should logOut the user', function(done) {
        	stub.push(sinon.stub(req.session,"destroy"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,{error:"error"});
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(400);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"Sign out error."});
        			chai.expect(req.session.email).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.logOut(req,res);
        });
	});
});