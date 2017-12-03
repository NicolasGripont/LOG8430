var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var request = require('request');
var queryString = require('querystring');
var SpotifyConnectorParams = require('../modelsSingleton').SpotifyConnectorParams;
var SpotifyConnector = require('../modelsSingleton').SpotifyConnector;

describe('Spotify Connector Model', function() {
    var spotifyConnector;
    var clientId = 10;
    var clientSecret = "secret";
    var loginUrl = "http://login.com";
    var tokenUrl = "http://token.com";
    var scope = "scope";
    var stub = [];

    beforeEach(function() {
        var spotifyConnectorParams = new SpotifyConnectorParams();
        spotifyConnectorParams.clientId = clientId;
        spotifyConnectorParams.clientSecret = clientSecret;
        spotifyConnectorParams.loginUrl = loginUrl;
        spotifyConnectorParams.tokenUrl = tokenUrl;
        spotifyConnectorParams.scope = scope;
        spotifyConnector = new SpotifyConnector(spotifyConnectorParams);
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
            assert.equal(clientId, spotifyConnector.clientId);
            assert.equal(clientSecret, spotifyConnector.clientSecret);
            assert.equal(loginUrl, spotifyConnector.loginUrl);
            assert.equal(tokenUrl, spotifyConnector.tokenUrl);
            assert.equal(scope, spotifyConnector.scope);
        });
    });

    describe('setSettings', function() {
       it('should have correct attributes after the call', function() {
           var settingsTest = {};
           settingsTest.accessToken = "tokenAccess";
           settingsTest.refreshToken = "refreshToken";
           settingsTest.expires = "expires";
           spotifyConnector.setSettings(settingsTest);
           assert.equal(settingsTest.accessToken, spotifyConnector.accessToken);
           assert.equal(settingsTest.refreshToken, spotifyConnector.refreshToken);
           assert.equal(settingsTest.expires, spotifyConnector.expires);
       });
    });

    describe('formatTracks', function() {
       it('should have correct format', function() {
           var trackToModify1 = {};
           trackToModify1.id = 2;
           trackToModify1.name = "Test";
           trackToModify1.album = {};
           trackToModify1.album.name = "Nom de l'album";
           trackToModify1.artists = [];
           trackToModify1.artists.name = "Nom artiste";
           trackToModify1.duration_ms = 10;
           trackToModify1.preview_url = "http://preview.com";

           var trackToModify2 = {};
           trackToModify2.id = 3;
           trackToModify2.name = "Test 2";
           trackToModify2.album = {};
           trackToModify2.album.name = "Nom de l'album 2";
           trackToModify2.artists = [];
           trackToModify2.artists.name = "Nom artiste 2";
           trackToModify2.duration_ms = 11;
           trackToModify2.preview_url = "http://preview2.com";

           var tracks = [
               trackToModify1,
               trackToModify2
           ];

           var resultsExpected = [
               {
                   "id": 2,
                   "platform": 'spotify',
                   "title": 'Test',
                   "artists": [],
                   "album": { "name": 'Nom de l\'album', "artists": [] },
                   "duration": 10,
                   "previewUrl": 'http://preview.com'
               },
               {
                   "id": 3,
                   "platform": 'spotify',
                   "title": 'Test 2',
                   "artists": [],
                   "album": { "name": 'Nom de l\'album 2', "artists": [] },
                   "duration": 11,
                   "previewUrl": 'http://preview2.com'
               }
           ];

           var results = JSON.stringify(spotifyConnector.formatTracks(tracks));
           assert.equal(results, JSON.stringify(resultsExpected));
       });
    });
    
    describe('method searchTracks', function() {
        it('should return the correct result', function(done) {
        	stub.push(sinon.stub(request,"get"));
        	var title = "title";
        	var options = {
                url: "https://api.spotify.com/v1/search?"+
                    queryString.stringify({q : title, type : "track"}),
                json: true,
                headers: {Authorization: "Bearer "+spotifyConnector.accessToken}
            };
        	var trackToModify1 = {};
            trackToModify1.id = 2;
            trackToModify1.name = "Test";
            trackToModify1.album = {};
            trackToModify1.album.name = "Nom de l'album";
            trackToModify1.artists = [];
            trackToModify1.artists.name = "Nom artiste";
            trackToModify1.duration_ms = 10;
            trackToModify1.preview_url = "http://preview.com";
            var result = [{
                "id": 2,
                "platform": 'spotify',
                "title": 'Test',
                "artists": [],
                "album": { "name": 'Nom de l\'album', "artists": [] },
                "duration": 10,
                "previewUrl": 'http://preview.com'
            }];
            var retour = {body:{tracks:{items:[trackToModify1]}}};
        	stub[0].withArgs(options).callsArgWith(1,null,retour);
        	var returnedPromise = spotifyConnector.searchTracks(title);
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
                url: "https://api.spotify.com/v1/search?"+
                    queryString.stringify({q : title, type : "track"}),
                json: true,
                headers: {Authorization: "Bearer "+spotifyConnector.accessToken}
            };
        	stub[0].withArgs(options).callsArgWith(1,{error:'error'});
        	var returnedPromise = spotifyConnector.searchTracks(title);
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
                url: "https://api.spotify.com/v1/tracks/" + id,
                json: true,
                headers: {Authorization: "Bearer "+spotifyConnector.accessToken}
            };
        	var trackToModify1 = {};
            trackToModify1.id = "abcd";
            trackToModify1.name = "Test";
            trackToModify1.album = {};
            trackToModify1.album.name = "Nom de l'album";
            trackToModify1.artists = [];
            trackToModify1.artists.name = "Nom artiste";
            trackToModify1.duration_ms = 10;
            trackToModify1.preview_url = "http://preview.com";
            var result = {
                "id": id,
                "platform": 'spotify',
                "title": 'Test',
                "artists": [],
                "album": { "name": 'Nom de l\'album', "artists": [] },
                "duration": 10,
                "previewUrl": 'http://preview.com'
            };
            var retour = {body:trackToModify1};
        	stub[0].withArgs(options).callsArgWith(1,null,retour);
        	var returnedPromise = spotifyConnector.findTrack(id);
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
                url: "https://api.spotify.com/v1/tracks/" + id,
                json: true,
                headers: {Authorization: "Bearer "+spotifyConnector.accessToken}
            };
        	stub[0].withArgs(options).callsArgWith(1,{error:'error'});
        	var returnedPromise = spotifyConnector.findTrack(id);
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