var musicHub = musicHub || {};

/**
 * Controls the "settings" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, settingsService) {
    "use strict";


    /**
     * Updates the user settings view.
     *
     * @param settings  The user settings to render.
     * @private
     */
    function _updateSettingsView(settings) {
        if(settings && settings.spotify) {
            $('.spotify .login').hide();
            $('.spotify .loggedIn').show();
        } else {
            $('.spotify .login').show();
            $('.spotify .loggedIn').hide();
        }
        if(settings && settings.deezer) {
            $('.deezer .login').hide();
            $('.deezer .loggedIn').show();
        } else {
            $('.deezer .login').show();
            $('.deezer .loggedIn').hide();
        }
    }

    settingsService.getSettings(_updateSettingsView);

})(jQuery, musicHub.settingsService);
