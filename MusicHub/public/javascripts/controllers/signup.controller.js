var musicHub = musicHub || {};

/**
 * Controls the "signup" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";


    /**
     * Updates the signup view.
     *
     * @param error  Json object containing "message" string attribute if error, else null
     * @private
     */
    function _signedUp(error) {
        var alertDangerElement = $(".alert-danger");
        var alertSuccessElement = $(".alert-success");
        if (error) {
            alertDangerElement.empty();
            alertDangerElement.append(error.message).fadeIn(1000);
        }
        else {
            alertSuccessElement.empty();
            alertDangerElement.hide();
            alertSuccessElement.append("Successful registration.").fadeIn(1000);
            setTimeout(function(){
                window.location.replace("/views/signin");
            }, 1000);
        }
    }

    //TODO créer un fichier messages

    $('form').submit(function (event) {
        event.preventDefault();
        var alertDangerElement = $(".alert-danger");
        var email = $("#input-email").val();
        var password = $("#input-password").val();
        var rePassword = $("#input-re-password").val();
        if(password !== rePassword) {
            alertDangerElement.empty();
            alertDangerElement.append("The passwords have to be the same.").fadeIn(1000);
        } else {
            connectionService.signup(email, password, _signedUp);
        }
    })

})(jQuery, musicHub.connectionService);
