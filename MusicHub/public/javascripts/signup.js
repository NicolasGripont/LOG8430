$(function() {
    function sendAJAXRequest(emailFilled, passwordFilled) {
        $.ajax({
            url: "/user/signup",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email: emailFilled,
                password: passwordFilled
            })
        })
        .done(function (json) {
            if (json && json.error) {
                $(".alert-danger").append(json.error).fadeIn(1000);
            }
            else {
                $(".alert-success").append("Inscription réussie.").fadeIn(1000);
                setTimeout(function(){
                    window.location.replace("/views/signin");
                }, 3000);
            }
        })
        .fail(function (xhr, status, errorThrown) {
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    }

    $('form').submit(function (event) {
        event.preventDefault();
        $(".alert").hide().html("");
        var passwordFilled = $("#inputPassword").val();
        var repasswordFilled = $("#reInputPassword").val();
        var emailFilled = $("#inputEmail").val();

        if(passwordFilled !== repasswordFilled) {
            $(".alert-danger").append("Les mots de passent doivent être identiques.").fadeIn(1000);
        } else {
            sendAJAXRequest(emailFilled, passwordFilled);
        }
    })
});