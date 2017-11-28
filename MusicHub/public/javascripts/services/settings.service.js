var musicHub = musicHub || {};

/**
 * Defines a service to retrieve the user settings.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.settingsService = (function($) {
    "use strict";

    var self = {};

    /**
     * Gets the user settings
     * @param callback    Function called when result is gotten. Called with the json of settings if success or
     *                    null value if fail as parameter.
     */
    self.getSettings = function(callback) {
        $.ajax({
            url: "/connector/settings",
            type: "GET"
        }).done(function (setting) {
            return callback(setting);
        }).fail(function (error) {
            return callback(null);
        })
    };


    return self;
})(jQuery);
