var musicHub = musicHub || {};

/**
 * Controls the "settings" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, settingsService) {
    "use strict";

    var _elements = {
        spotifyLogin : $('.spotify .login'),
        spotifyLoggedIn : $('.spotify .loggedIn'),
        deezerLogin : $('.deezer .login'),
        deezerLoggedIn : $('.deezer .loggedIn')
    };


    /**
     * Updates the user settings view.
     *
     * @param settings  The user settings to render.
     * @private
     */
    function _updateSettingsView(settings) {
        if(settings && settings.spotify) {
            _elements.spotifyLogin.hide();
            _elements.spotifyLoggedIn.show();
        } else {
            _elements.spotifyLogin.show();
            _elements.spotifyLoggedIn.hide();
        }
        if(settings && settings.deezer) {
            _elements.deezerLogin.hide();
            _elements.deezerLoggedIn.show();
        } else {
            _elements.deezerLogin.show();
            _elements.deezerLoggedIn.hide();
        }
    }

    settingsService.getSettings(_updateSettingsView);

})(jQuery, musicHub.settingsService);
