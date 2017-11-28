var assert = require('assert');
var DeezerConnector = require('../deezer-connector');

describe('Deezer Connector Model', function() {

    var deezerConnector;
    var appId = 2;
    var secretKey = "secret";
    var loginUrl = "http://login.com";
    var perms = "perms";
    var tokenUrl = "http://urlToken.com";

    beforeEach(function() {
        deezerConnector = new DeezerConnector(appId, secretKey, loginUrl, perms, tokenUrl);
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

    describe('setSettings', function() {
        it('should have correct attributes after the call', function() {
            var settingsTest = {};
            settingsTest.accessToken = "tokenAccess";
            settingsTest.expires = "expires";
            deezerConnector.setSettings(settingsTest);
            assert.equal(settingsTest.accessToken, deezerConnector.accessToken);
            assert.equal(settingsTest.expires, deezerConnector.expires);
        });
    });

    describe('formatTracks', function() {
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
});