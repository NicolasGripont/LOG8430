var musicHub = musicHub || {};

/**
 * Controls the "signout" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";


    /**
     * Updates the view after signout button clicked
     *
     * @param error  Json object containing "message" string attribute if error, else null
     * @private
     */
    function _signedOut(error) {
        if(!error) {
            window.location.replace("/views");
        }
    }

    /**
     * Link view sign out button
     */
    $('.deconnexion').click(function (event) {
        event.preventDefault();
        connectionService.signout(_signedOut);
    })

})(jQuery, musicHub.connectionService);
