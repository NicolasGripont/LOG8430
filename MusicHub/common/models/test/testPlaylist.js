var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var Playlist = require('../playlist');
var DbPlaylist = require('../../models_db/modelSingleton').DbPlaylist;
var Music = require('../modelsSingleton').Music;

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
            assert.equal(user,playlist.userEmail);
            assert.equal(musics,playlist.musics);
        });
    });
    
    describe('method save', function() {
    	
        it('should return an error when the playlist exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	var retour = [playlist];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	playlist.save(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({message:"The playlist already exist"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	playlist.save(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	playlist.save(function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not return an error when database is ok and the playlist does not exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist.prototype,"save"));
        	var retour = [];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,undefined);
        	playlist.save(function(err) {
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
    
    describe('method remove', function() {
    	
    	it('should not return an error when database is ok and the playlist exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist,"remove"));
        	var retour = [playlist];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,undefined);
        	playlist.remove(function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal(undefined);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    	
    	it('should return an error when the playlist does not exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	var retour = [];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	playlist.remove(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({message:"The playlist doesn't exist"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    	
    	it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	playlist.remove(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(DbPlaylist,"remove"));
        	var retour = [playlist];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	playlist.remove(function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
    });
    	
    describe('method findAllPlaylists', function() {
    	
    	it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	playlist.findAllPlaylists(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    	
    	it('should return a playlist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({userEmail:playlist.userEmail}).callsArgWith(1,null,playlist);
        	playlist.findAllPlaylists(function(err,pl) {
        		try {
        			chai.expect(err).to.deep.equal(null);
            		chai.expect(pl).to.deep.equal(playlist);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
    
    describe('method findPlaylist', function() {
    	
    	it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	playlist.findPlaylist(function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    	
    	it('should return a playlist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,playlist);
        	playlist.findPlaylist(function(err,pl) {
        		try {
        			chai.expect(err).to.deep.equal(null);
            		chai.expect(pl).to.deep.equal(playlist);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
    
    describe('method addMusic', function() {
    	
    	it('should return an error when the playlist does not exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	var retour = [];
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	playlist.addMusic(music, function(err) {
        		try {
        			chai.expect(err).to.deep.equal({message:"The playlist doesn't exist"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.addMusic(music, function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	var obj = {musics:[],save:function(){}};
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(obj,"save"));
        	var retour = [obj];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.addMusic(music, function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not return an error when database is ok and the playlist exist', function(done) {
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	var obj = {musics:[],save:function(){}};
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(obj,"save"));
        	var retour = [obj];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,undefined);
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.addMusic(music, function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal(undefined);
            		chai.expect(obj.musics).to.deep.equal([music]);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
    
    
	describe('method deleteMusic', function() {
		
    	it('should return an error when the playlist does not exist', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	var retour = [];
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	playlist.deleteMusic(music, function(err) {
        		try {
        			chai.expect(err).to.deep.equal({message:"The playlist doesn't exist"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the db return an error on find', function(done) {
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,{error:"error"});
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.deleteMusic(music, function(err) {
        		try {
        			chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should return an error when the music is not in the playlist', function(done) {
	    	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
	    	var otherMusic = new Music("1234", "spotify", "", [], {}, 0, "");
	    	var obj = {musics:[otherMusic],save:function(){}};
	    	stub.push(sinon.stub(DbPlaylist,"find"));
	    	var retour = [obj];
	    	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
	    	playlist.deleteMusic(music, function(err) {
	    		try {
	    			chai.expect(err).to.deep.equal({message:"The music is not in the playlist"});
		    		done();
        		}catch(err) {
        			done(err);
        		}
	    	});
        });
        
        it('should return an error when the database return an error', function(done) {
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	var obj = {musics:[music],save:function(){}};
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(obj,"save"));
        	var retour = [obj];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,{error:"error"});
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.deleteMusic(music, function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal({error:"error"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
        
        it('should not return an error when database is ok and the playlist exist', function(done) {
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	var obj = {musics:[music],save:function(){}};
        	stub.push(sinon.stub(DbPlaylist,"find"));
        	stub.push(sinon.stub(obj,"save"));
        	var retour = [obj];
        	stub[0].withArgs({name:playlist.name, userEmail:playlist.userEmail}).callsArgWith(1,null,retour);
        	stub[1].callsArgWith(0,undefined);
        	var music = new Music("abcd", "spotify", "", [], {}, 0, "");
        	playlist.deleteMusic(music, function(err) {
        		try {
        			assert.equal(stub[1].called,true);
            		chai.expect(err).to.deep.equal(undefined);
            		chai.expect(obj.musics).to.deep.equal([]);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
	
	
	
});