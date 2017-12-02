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
        deezerLoggedIn : $('.deezer .loggedIn'),
        connectLinks : $('a.connect')
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

    function _initConnectLink() {
        _elements.connectLinks.click(function (event) {
            var link = $(event.target);
            var api = link.attr('api');
            var action = link.attr('action');
            settingsService.loginOrLogoutOnAPI(api,action);
        })
    }

    /**
     * Init controller
     *
     * @private
     */
    function _init() {
        settingsService.retrieveSettings(_updateSettingsView);
        _initConnectLink();
    }


    _init();

})(jQuery, musicHub.settingsService);
