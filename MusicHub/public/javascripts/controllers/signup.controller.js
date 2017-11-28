var musicHub = musicHub || {};

/**
 * Controls the "signup" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";

    var _elements = {
        alertDanger : $(".alert-danger"),
        alertSuccess : $(".alert-success"),
        inputEmail : $("#input-email"),
        inputPassword : $("#input-password"),
        inputRePassword : $("#input-re-password")
    };

    /**
     * Updates the signup view.
     *
     * @param error  Json object containing "message" string attribute if error, else null
     * @private
     */
    function _signedUp(error) {
        if (error) {
            _elements.alertDanger.empty();
            _elements.alertDanger.append(error.message).fadeIn(1000);
        }
        else {
            _elements.alertSuccess.empty();
            _elements.alertDanger.hide();
            _elements.alertSuccess.append("Successful registration.").fadeIn(1000);
            setTimeout(function(){
                window.location.replace("/views/signin");
            }, 1000);
        }
    }


    /**
     * Link view sign up form
     */
    $('form').submit(function (event) {
        event.preventDefault();
        var email = _elements.inputEmail.val();
        var password = _elements.inputPassword.val();
        var rePassword = _elements.inputRePassword.val();
        if(password !== rePassword) {
            _elements.alertDanger.empty();
            _elements.alertDanger.append("The passwords have to be the same.").fadeIn(1000);
        } else {
            connectionService.signup(email, password, _signedUp);
        }
    })

})(jQuery, musicHub.connectionService);
