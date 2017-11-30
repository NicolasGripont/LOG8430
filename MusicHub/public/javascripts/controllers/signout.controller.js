var musicHub = musicHub || {};

/**
 * Controls the "signout" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";

    var _elements = {
        signOutButton : $('.deconnexion')
    };

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
     *  Link view sign out button
     *
     * @private
     */
    function _linkSignOutButtonClickEvent() {
        _elements.signOutButton.click(function (event) {
            event.preventDefault();
            connectionService.signout(_signedOut);
        })
    }

    /**
     * Init controller
     *
     * @private
     */
    function _init() {
        _linkSignOutButtonClickEvent();
    }

    _init();

})(jQuery, musicHub.connectionService);
