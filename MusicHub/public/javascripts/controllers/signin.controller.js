var musicHub = musicHub || {};

/**
 * Controls the "signin" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";


    /**
     * Updates the signin view.
     *
     * @param error  Json object containing "message" string attribute if error, else null
     * @private
     */
    function _signedIn(error) {
        if(error) {
            var alertDangerElement = $(".alert-danger");
            alertDangerElement.empty();
            alertDangerElement.append(error.message).fadeIn(1000);
        } else {
            window.location.replace("/views");
        }
    }

    $('form').submit(function (event) {
        event.preventDefault();
        var email = $("#input-email").val();
        var password = $("#input-password").val();
        connectionService.signin(email,password,_signedIn);
    })

})(jQuery, musicHub.connectionService);
