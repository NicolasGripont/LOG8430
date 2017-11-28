var musicHub = musicHub || {};

/**
 * Defines a service to manage the connection.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.connectionService = (function($) {
    "use strict";

    var self = {};

    /**TODO
     * Gets the track associated with the track ID and api specified.
     * @param api         The api associated with the track to retrieve.
     * @param trackId   The track ID associated with the track to retrieve.
     * @param callback    Function called when result is gotten. Called with the json of track if success or
     *                    null value if fail as parameter.
     */
    self.signin = function(email, password, callback) {
        $.ajax({
            url: "/user/signin",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email: email,
                password: password
            })
        }).done(function (json) {
            if(json && json.error) {
                return callback(json.error);
            }
            return callback(null);
        }).fail(function (xhr, status, errorThrown) {
            return callback({message : "Connection Error."});
        });
    };

    self.signup = function(email, password, callback) {
        $.ajax({
            url: "/user/signup",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email: email,
                password: password
            })
        }).done(function (json) {
            if(json && json.error) {
                return callback(json.error);
            }
            return callback(null);
        }).fail(function (xhr, status, errorThrown) {
            return callback({message : "Connection Error."});
        });
    };

    self.signout = function(callback) {
        $.ajax({
            url: "/user/signout",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (json) {
            if(json && json.error) {
                return callback(json.error);
            }
            return callback(null);
        }).fail(function (xhr, status, errorThrown) {
            return callback({message : "Connection Error."});
        });
    };

    return self;
})(jQuery);
