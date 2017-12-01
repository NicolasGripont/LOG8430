var musicHub = musicHub || {};

/**
 * Controls the "signin" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, connectionService) {
    "use strict";

    var _elements = {
        alertDanger : $(".alert-danger"),
        inputEmail : $("#input-email"),
        inputPassword : $("#input-password"),
        signInForm : $('form')
    };

    /**
     * Updates the signin view.
     *
     * @param error  Json object containing "message" string attribute if error, else null
     * @private
     */
    function _signedIn(error) {
        if(error) {
            _elements.alertDanger.empty();
            _elements.alertDanger.append(error.message).fadeIn(1000);
        } else {
            window.location.replace("/views");
        }
    }

    /**
     * Link view sign in form
     *
     * @private
     */
    function _linkSignInFormSubmitEvent() {
        _elements.signInForm.submit(function (event) {
            event.preventDefault();
            var email = _elements.inputEmail.val();
            var password = _elements.inputPassword.val();
            connectionService.signin(email,password,_signedIn);
        })
    }

    /**
     * Init controller
     *
     * @private
     */
    function _init() {
        _linkSignInFormSubmitEvent();
    }

    _init();


})(jQuery, musicHub.connectionService);
