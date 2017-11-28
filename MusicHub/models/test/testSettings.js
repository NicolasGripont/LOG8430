var assert = require('assert');
var Settings = require('../settings');

describe('Settings Model', function() {
    describe('constructor', function() {
        it('should have the correct attributes', function() {
            var userEmail = "test@test.com";
            var settings = new Settings(userEmail);
            assert.equal(userEmail, settings.userEmail);
        });
    });
});