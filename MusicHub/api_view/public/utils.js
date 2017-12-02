var musicHub = musicHub || {};

/**
 * Defines a service to manage the connection.
 *
 */
musicHub.utils = (function($) {
    "use strict";

    var self = {};

    /**
     * Get the parameter from the div params corresponding to the selector
     * @param selector  Correspond to the attribute wanted
     * @returns         The value of the attribute
     */
    self.getParameter = function(selector) {
        var divParams = $('#params');
        if(divParams) {
            return divParams.attr(selector);
        }
    };

    return self;
})(jQuery);
