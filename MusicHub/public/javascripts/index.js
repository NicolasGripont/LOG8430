(function() {
    $("form").submit(function () {
        var query = $("#search-input").val();

        $.ajax({
            url: "/connector/search/" + query,
            type: "GET"
        }).done(function (tracks) {
            $(".tbody-musics").empty();
            for(var i = 0; i < tracks.length; i++) {
                $(".tbody-musics").append(createTrackLine(tracks[i]));
            }

        }).fail(function (error) {

        })

        return false;
    })

    function createTrackLine(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var lign = "<tr>"+
                   "  <td>";

        switch (track.platform) {
            case "spotify" :
                lign += "<img class='platform' src='/images/spotify.png' alt='/images/spotify.png'>"
                break;
            case "deezer" :
                lign += "<img class='platform' src='/images/deezer.png' alt='/images/deezer.png'>"
                break;
        }

        lign += "</td>" +
                "   <td>" + track.title + "</td>" +
                "   <td>";
        for(var i = 0; i < track.artists.length; i++) {
             lign += track.artists[i];
             if(i < track.artists.length -1) {
                 lign += ", ";
             }
        }
        lign += "   </td>" +
                "   <td>" + track.album + "</td>" +
                "   <td>" + minutes + ":" + ("0" + seconds).slice(-2) + "</td>" +
                "</tr>";
        return lign;
    }

})();