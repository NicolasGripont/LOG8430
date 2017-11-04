$(function() {
    $('button').click(function () {
        $.ajax({
            url: "/user/signin",
            type: "POST",
            dataType: "json",
            data: {
                email:"admin@admin.com",
                password: "admin"
            }
        })
        .done(function (json) {
            if(json) {
                alert(JSON.stringify(json));
            }
        })
        .fail(function (xhr, status, errorThrown) {
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    })
});