var musicHub = musicHub || {};

/**
 * Defines a service to manage the connection.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.connectionService = (function($, utils) {
    "use strict";

    var self = {};

    /**
     * Connect the client and create a session for the user email/password.
     * @param email       Email of the user to connect.
     * @param password    Passaword of the user to connect.
     * @param callback    Function called when the user is signed in or if fail.
     *                    Called with the error fail or null if success as parameter.
     */
    self.signin = function(email, password, callback) {
        var host = utils.getParameter("connection-host");
        var port = utils.getParameter("connection-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/user/signin",
            type: "POST",
            dataType: "json",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email: email,
                password: password
            })
        }).done(function (success) {
            return callback(null);
        }).fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message : "Server error."});
        });
    };

    /**
     * Create a client account for the user email/password.
     * @param email       Email of the user to connect.
     * @param password    Passaword of the user to connect.
     * @param callback    Function called when the user account is created or if fail.
     *                    Called with the error fail or null if success as parameter.
     */
    self.signup = function(email, password, callback) {
        var host = utils.getParameter("connection-host");
        var port = utils.getParameter("connection-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/user/signup",
            type: "POST",
            dataType: "json",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email: email,
                password: password
            })
        }).done(function (success) {
            return callback(null);
        }).fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message : "Server error."});
        });
    };

    /**
     * Disconnect the client and delete the session.
     * @param callback    Function called when the user is signed out.
     *                    Called with the error if fail or null if success as parameter.
     */
    self.signout = function(callback) {
        var connectionHost = utils.getParameter("connection-host");
        var connectionPort = utils.getParameter("connection-port");
        $.ajax({
            url: "http://" + connectionHost + ":" + connectionPort + "/user/signout",
            type: "GET",
            dataType: "json",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            contentType: "application/json; charset=utf-8"
        }).done(function (success) {
            sessionStorage.clear();
            return callback(null);
        }).fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message : "Server error."});
        });
    };

    return self;
})(jQuery, musicHub.utils);
