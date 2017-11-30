var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var PlaylistController = require('../../controllers/playlist-controller');
chai.use(chaiHttp);


describe('Route playlist', function() {
	var server;
	var stub = [];
	
	beforeEach(function() {
	    // runs before each test in this block
		stub.push(sinon.stub(mongoose,"connect"));
		stub.push(sinon.stub(MongoDBStore.prototype,"on"));
		stub[0].callsArgWith(2,null);
		stub[1].callsArgWith(1,null);
    	server = require('../../bin/www');
	});
	
	afterEach(function() {
	    // runs after each test in this block
		for(var i=0;i<stub.length;i++) {
			stub[i].restore();
		}
		stub = [];
		server.close();
	});
	
    describe('create', function() {
        it('should call controller', function(done) {
        	stub.push(sinon.stub(PlaylistController.prototype,"createPlaylist"));
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[2].called).to.deep.equal(true);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	chai.request('http://localhost:3000').get('/playlist/create');
        });
    });
});
