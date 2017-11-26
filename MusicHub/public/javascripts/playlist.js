$(function() {

    function getAllPlaylists() {
        $.ajax({
            url: "/playlist/",
            type: "get",
            dataType: "json"
        })
        .done(function(json) {
            if (json && !json.error) {
                $("ul.nav.nav-pills.flex-column").html("");
                var playlistsHTML = "";
                json.forEach(function(playlist) {
                    playlistsHTML += "<li class='nav-item'>" +
                                     "  <a class='nav-link' href='#'>" + playlist.name + "</a>" +
                                     "</li>";
                });
                $("ul.nav.nav-pills.flex-column").append(playlistsHTML);
            }
        })
    }

    function getPlaylist(nameP) {
        $.ajax({
            url: "/playlist/" + nameP,
            type: "get",
            dataType: "json"
        })
        .done(function(json) {
            if (json && !json.error) {
                alert(json.name);
                /*$("ul.nav.nav-pills.flex-column").html("");
                var playlistsHTML = "";
                json.forEach(function(playlist) {
                    playlistsHTML += "<li class='nav-item'>" +
                        "  <a class='nav-link' href='#'>" + playlist.name + "</a>" +
                        "</li>";
                });
                $("ul.nav.nav-pills.flex-column").append(playlistsHTML);*/
            }
        })
    }

    function afficherPlaylist(e) {
        var name = $(this).children("a.nav-link").html();
        getPlaylist(name);
    }

    getAllPlaylists();

    $("ul.nav.nav-pills.flex-column").on("click", "li", afficherPlaylist);

    $("#save-playlist").click(function(event) {
        var nameFilled = $("#name-playlist").val();
        console.log(nameFilled);
        $(".alert").hide().html("");
        $.ajax({
            url: "/playlist/create",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                name: nameFilled
            })
        })
        .done(function (json) {
            if (json && json.error) {
                $(".alert-danger").append(json.error).fadeIn(1000);
            }
            else {
                $(".alert-success").append("Playlist créée.").fadeIn(1000);
                getAllPlaylists();
                setTimeout(function(){
                    $("[data-dismiss='modal']").click()
                }, 2000);
            }
        })
        .fail(function (xhr, status, errorThrown) {
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        });
    });

    $('#modalPlaylistName').on('hidden.bs.modal', function () {
        $(".alert").hide().html("");
        $(this).find("input").val('').end();
    });

});