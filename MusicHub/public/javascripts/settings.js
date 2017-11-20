(function() {
    $.ajax({
        url: "/connector/settings",
        type: "GET"
    }).done(function (setting) {
        if(setting && setting.spotify) {
            $('.spotify .login').hide();
            $('.spotify .loggedIn').show();
        } else {
            $('.spotify .login').show();
            $('.spotify .loggedIn').hide();
        }
        if(setting && setting.deezer) {
            $('.deezer .login').hide();
            $('.deezer .loggedIn').show();
        } else {
            $('.deezer .login').show();
            $('.deezer .loggedIn').hide();
        }
    }).fail(function (error) {
        $('.container').append(error);
        // $('#login').show();
        // $('#loggedin').hide();
    })

})();