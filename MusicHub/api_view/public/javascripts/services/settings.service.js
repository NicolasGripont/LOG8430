var musicHub = musicHub || {};

/**
 * Defines a service to retrieve the user settings.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.settingsService = (function($, utils) {
    "use strict";

    var self = {};

    /**
     * Retrieves the user settings
     * @param callback    Function called when result is gotten. Called with the json of settings if success or
     *                    null value if fail as parameter.
     */
    self.retrieveSettings = function(callback) {
        var host = utils.getParameter("connector-host");
        var port = utils.getParameter("connector-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/connector/settings",
            type: "GET"
        }).done(function (setting) {
            return callback(setting);
        }).fail(function (error) {
            return callback(null);
        })
    };


    return self;
})(jQuery, musicHub.utils);
