(function() {
    $("form").submit(function () {
        var query = $("#search-input").val();

        $.ajax({
            url: "/connector/search/" + query,
            type: "GET"
        }).done(function (tracks) {
            $(".spotify .tbody-musics").empty();
            for(var i = 0; i < tracks.spotify.length; i++) {
                $(".spotify .tbody-musics").append(createTrackLine(tracks.spotify[i]));
            }

            $(".deezer .tbody-musics").empty();
            for(var i = 0; i < tracks.spotify.length; i++) {
                $(".deezer .tbody-musics").append(createTrackLine(tracks.deezer[i]));
            }

        }).fail(function (error) {

        })

        return false;
    })

    // Change the selector if needed
    var $table = $('table.scroll');
    var $bodyCells = $table.find('tbody tr:first').children();
    var colWidth;

    // Adjust the width of thead cells when window resizes
    $(window).resize(function() {
        // Get the tbody columns width array
        colWidth = $bodyCells.map(function() {
            return $(this).width();
        }).get();

        // Set the width of thead columns
        $table.find('thead tr').children().each(function(i, v) {
            $(v).width(colWidth[i]);
        });
    }).resize(); // Trigger resize handler

    function createTrackLine(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var lign = "<tr>" +
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