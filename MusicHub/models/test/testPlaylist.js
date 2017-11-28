var assert = require('assert');
var Playlist = require('../playlist');

describe('Playlist Model', function() {
    describe('constructor', function() {
        it('should have the correct attributes', function() {
        	var name = "name";
        	var user = "user";
        	var musics = [{name:"musique"},{name:"musique2"}];
        	var playlist = new Playlist(name,user,musics);
            assert.equal(name,playlist.name);
            assert.equal(user,playlist.user);
            assert.equal(musics,playlist.musics);
        });
    });
});