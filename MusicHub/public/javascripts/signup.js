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
                alert(JSON.stringify(json));
            }
            else {
                window.location.replace("/view/signin");
                alert("Inscription réussie");
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
        var passwordFilled = $("#inputPassword").val();
        var repasswordFilled = $("#reInputPassword").val();
        var emailFilled = $("#inputEmail").val();

        if(passwordFilled !== repasswordFilled) {
            alert("Les mots de passes doivent être identiques.");
        } else {
            sendAJAXRequest(emailFilled, passwordFilled);
        }
    })
});