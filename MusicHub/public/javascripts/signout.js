$(function() {
    $('.deconnexion').click(function (event) {
        $.ajax({
            url: "/user/signout",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
        .done(function (json) {
            if(json && json.error) {
                alert(JSON.stringify(json));
            }
            else {
                window.location.replace("/views/signin");
            }
        })
        .fail(function (xhr, status, errorThrown) {
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    })
});