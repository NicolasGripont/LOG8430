var assert = require('assert');
var User = require('../user');
var sinon = require('sinon');

describe('User Model', function() {
    describe('constructor', function() {
        it('should have the correct attributes', function() {
            var email = "test@test.com";
            var password = "password";
            var user = new User(email, password);
            assert.equal(email, user.email);
            assert.equal(password, user.password);
        });
    });

    describe('login', function() {
        it('should login properly', function() {
            // TODO
        });
    });
});