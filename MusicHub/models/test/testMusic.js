var assert = require('assert');
var Music = require('../music');

describe('Music Model', function() {
    describe('constructor', function() {
        it('should have the correct attributes', function() {
            var id = 2;
            var platform = "deezer";
            var title = "Titre";
            var artists = ["artiste 1", "artiste 2"];
            var album = "Album";
            var duration = 100;
            var previewUrl = "url";
            var music = new Music(id, platform, title, artists, album, duration, previewUrl);
            assert.equal(id, music.id);
            assert.equal(platform, music.platform);
            assert.equal(title, music.title);
            assert.equal(artists, music.artists);
            assert.equal(album, music.album);
            assert.equal(duration, music.duration);
            assert.equal(previewUrl, music.previewUrl);
        });
    });
});