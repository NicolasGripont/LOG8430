var assert = require('assert');
var SpotifyConnector = require('../spotify-connector');

describe('Spotify Connector Model', function() {
    var spotifyConnector;
    var clientId = 10;
    var clientSecret = "secret";
    var loginUrl = "http://login.com";
    var tokenUrl = "http://token.com";
    var scope = "scope";
    var searchUrl = "http://search.com";

    beforeEach(function() {
        spotifyConnector = new SpotifyConnector(clientId, clientSecret, loginUrl, tokenUrl, scope, searchUrl);
    });

    describe('constructor', function() {
        it('should have the correct attributes', function() {
            assert.equal(clientId, spotifyConnector.clientId);
            assert.equal(clientSecret, spotifyConnector.clientSecret);
            assert.equal(loginUrl, spotifyConnector.loginUrl);
            assert.equal(tokenUrl, spotifyConnector.tokenUrl);
            assert.equal(scope, spotifyConnector.scope);
            assert.equal(searchUrl, spotifyConnector.searchUrl);
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
});