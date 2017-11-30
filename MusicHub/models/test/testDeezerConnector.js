var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var request = require('request');
var Music = require('../music');
var Settings = require('../settings');
var DeezerConnector = require('../deezer-connector');

describe('Deezer Connector Model', function() {

    var deezerConnector;
    var appId = 2;
    var secretKey = "secret";
    var loginUrl = "http://login.com";
    var perms = "perms";
    var tokenUrl = "http://urlToken.com";
    var stub = [];

    beforeEach(function() {
    	// runs before each test in this block
        deezerConnector = new DeezerConnector(appId, secretKey, loginUrl, perms, tokenUrl);
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
            assert.equal(appId, deezerConnector.appId);
            assert.equal(secretKey, deezerConnector.secretKey);
            assert.equal(loginUrl, deezerConnector.loginUrl);
            assert.equal(perms, deezerConnector.perms);
            assert.equal(tokenUrl, deezerConnector.tokenUrl);
        });
    });

    describe('method setSettings', function() {
        it('should have correct attributes after the call', function() {
            var settingsTest = {};
            settingsTest.accessToken = "tokenAccess";
            settingsTest.expires = "expires";
            deezerConnector.setSettings(settingsTest);
            assert.equal(settingsTest.accessToken, deezerConnector.accessToken);
            assert.equal(settingsTest.expires, deezerConnector.expires);
        });
    });

    describe('method formatTracks', function() {
        it('should have correct format', function() {
            var trackToModify1 = {};
            trackToModify1.id = 2;
            trackToModify1.title = "Test";
            trackToModify1.album = {};
            trackToModify1.album.title = "Nom de l'album";
            trackToModify1.artist = {};
            trackToModify1.artist.name = "Nom de l'artiste";
            trackToModify1.duration = 1;
            trackToModify1.preview = "http://preview.com";

            var trackToModify2 = {};
            trackToModify2.id = 3;
            trackToModify2.title = "Test 2";
            trackToModify2.album = {};
            trackToModify2.album.title = "Nom de l'album 2";
            trackToModify2.artist = {};
            trackToModify2.artist.name = "Nom de l'artiste 2";
            trackToModify2.duration = 2;
            trackToModify2.preview = "http://preview2.com";

            var tracks = [
                trackToModify1,
                trackToModify2
            ];

            var resultsExpected = [
                {
                    "id": 2,
                    "platform": 'deezer',
                    "title": 'Test',
                    "artists": [{"name":"Nom de l'artiste"}],
                    "album": { "name": 'Nom de l\'album', "artists": [] },
                    "duration": 1000,
                    "previewUrl": 'http://preview.com'
                },
                {
                    "id": 3,
                    "platform": 'deezer',
                    "title": 'Test 2',
                    "artists": [{"name":"Nom de l'artiste 2"}],
                    "album": { "name": 'Nom de l\'album 2', "artists": [] },
                    "duration": 2000,
                    "previewUrl": 'http://preview2.com'
                }
            ];

            var results = JSON.stringify(deezerConnector.formatTracks(tracks));
            assert.equal(results, JSON.stringify(resultsExpected));
        });
    });
    
    describe('method searchTracks', function() {
        it('should return the correct result', function(done) {
        	stub.push(sinon.stub(request,"get"));
        	var title = "title";
        	var options = {
                url: "http://api.deezer.com/search/track?q=" + title,
                json: true
            };
        	var trackToModify1 = {};
            trackToModify1.id = 2;
            trackToModify1.title = "Test";
            trackToModify1.album = {};
            trackToModify1.album.title = "Nom de l'album";
            trackToModify1.artist = {};
            trackToModify1.artist.name = "Nom de l'artiste";
            trackToModify1.duration = 1;
            trackToModify1.preview = "http://preview.com";
            var result = [{
                "id": 2,
                "platform": 'deezer',
                "title": 'Test',
                "artists": [{"name":"Nom de l'artiste"}],
                "album": { "name": 'Nom de l\'album', "artists": [] },
                "duration": 1000,
                "previewUrl": 'http://preview.com'
            }];
            var retour = {body:{data:[trackToModify1]}};
        	stub[0].withArgs(options).callsArgWith(1,null,retour);
        	var returnedPromise = deezerConnector.searchTracks(title);
        	returnedPromise.then(function(tracks){
        		try {
        			assert.equal(stub[0].called,true);
            		chai.expect(tracks).to.deep.equal(result);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	}).catch(function(err) {
        		//should not pass here
        		done("should not call catch");
        	});
        });
        
        it('should return and error when request fail', function(done) {
        	stub.push(sinon.stub(request,"get"));
        	var title = "title";
        	var options = {
                url: "http://api.deezer.com/search/track?q=" + title,
                json: true
            };
        	stub[0].withArgs(options).callsArgWith(1,{error:'error'});
        	var returnedPromise = deezerConnector.searchTracks(title);
        	returnedPromise.then(function(tracks){
        		//should not pass here
        		done("should not call then");
        	}).catch(function(err) {
        		try {
        			assert.equal(stub[0].called,true);
            		chai.expect(err).to.deep.equal({error:'error'});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
    
    
    describe('method findTrack', function() {
        it('should return the correct result', function(done) {
        	stub.push(sinon.stub(request,"get"));
        	var id = "abcd";
        	var options = {
                url: "http://api.deezer.com/track/" + id,
                json: true
            };
        	var trackToModify1 = {};
            trackToModify1.id = id;
            trackToModify1.title = "Test";
            trackToModify1.album = {};
            trackToModify1.album.title = "Nom de l'album";
            trackToModify1.artist = {};
            trackToModify1.artist.name = "Nom de l'artiste";
            trackToModify1.duration = 1;
            trackToModify1.preview = "http://preview.com";
            var result = {
                "id": id,
                "platform": 'deezer',
                "title": 'Test',
                "artists": [{"name":"Nom de l'artiste"}],
                "album": { "name": 'Nom de l\'album', "artists": [] },
                "duration": 1000,
                "previewUrl": 'http://preview.com'
            };
            var retour = {body:trackToModify1};
        	stub[0].withArgs(options).callsArgWith(1,null,retour);
        	var returnedPromise = deezerConnector.findTrack(id);
        	returnedPromise.then(function(tracks){
        		try {
        			assert.equal(stub[0].called,true);
            		chai.expect(tracks).to.deep.equal(result);
            		done();
        		}catch(err) {
        			done(err);
        		}
        	}).catch(function(err) {
        		//should not pass here
        		done("should not call catch");
        	});
        });
        
        it('should return and error when request fail', function(done) {
        	stub.push(sinon.stub(request,"get"));
        	var id = "abcd";
        	var options = {
        			url: "http://api.deezer.com/track/" + id,
                json: true
            }
        	stub[0].withArgs(options).callsArgWith(1,{error:'error'});
        	var returnedPromise = deezerConnector.findTrack(id);
        	returnedPromise.then(function(tracks){
        		//should not pass here
        		done("should not call then");
        	}).catch(function(err) {
        		try {
        			assert.equal(stub[0].called,true);
            		chai.expect(err).to.deep.equal({error:'error'});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        });
    });
});