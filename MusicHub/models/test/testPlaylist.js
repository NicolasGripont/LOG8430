var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var Playlist = require('../playlist');
var DbPlaylist = require('../../models_db/modelSingleton').DbPlaylist;

describe('Playlist Model', function() {
	
	var playlist;
	var name = "name";
	var user = "user";
	var musics = [{name:"musique"}];
	var stub = [];
	
	beforeEach(function() {
	    // runs before each test in this block
		//on initialise une playlist
    	playlist = new Playlist(name,user,musics);
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
            assert.equal(name,playlist.name);
            assert.equal(user,playlist.user);
            assert.equal(musics,playlist.musics);
        });
    });
    
    describe('method save', function() {
    	
        it('should return and error when the playlist exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	var retour = [playlist];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.user}).callsArgWith(1,null,retour);
        	playlist.save(function(err) {
        		chai.expect({message:"The playlist already exist"}).to.deep.equal(err);
        		done();
        	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.user}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	playlist.save(function(err) {
        		assert.equal(stub[1].called,true);
        		chai.expect({error:"error"}).to.deep.equal(err);
        		done();
        	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.user}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	playlist.save(function(err) {
        		assert.equal(stub[1].called,true);
        		chai.expect({error:"error"}).to.deep.equal(err);
        		done();
        	});
        });
    });
});