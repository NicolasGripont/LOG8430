$(function() {
    $('form').submit(function (event) {
    	event.preventDefault();
        $.ajax({
            url: "/user/signin",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                email:$("#inputEmail").val(),
                password: $("#inputPassword").val()
            })
        })
        .done(function (json) {
            if(json && json.error) {
                alert(JSON.stringify(json));
            }
            else {
            	window.location.replace("/views");
            }
        })
        .fail(function (xhr, status, errorThrown) {
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    })
});