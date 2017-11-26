var musicHub = musicHub || {};

/**
 * Controls the "mucics" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, musicsService) {
    "use strict";


    /**
     * Updates the tracks searching lists result view.
     *
     * @param products    The tracks lists to render.
     * @private
     */
    function _updateSearchView(tracks) {
        var spotifyElement = $(".spotify .tbody-musics");
        var deezerElement = $(".deezer .tbody-musics");

        spotifyElement.empty();
        for(var i = 0; i < tracks.spotify.length; i++) {
            spotifyElement.append(_createTrackElement(tracks.spotify[i]));
        }

        deezerElement.empty();
        for(var i = 0; i < tracks.deezer.length; i++) {
            deezerElement.append(_createTrackElement(tracks.deezer[i]));
        }
    }

    /**
     * Creates a product element.
     *
     * @param product                   The product to use.
     * @returns {*|jQuery|HTMLElement}  A jQuery element.
     * @private
     */
    function _createTrackElement(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var template = "<tr api='" + track.platform + "' id='" + track.id + "'>" +
            "   <td>";
        if(track.previewUrl) {
            template += "       <img class='img-btn play' src='/images/play.png' alt='/images/play.png'/>";
        }
        template += "   </td>" +
                    "   <td>" + track.title + "</td>" +
                    "   <td>";
        for(var i = 0; i < track.artists.length; i++) {
            template += track.artists[i];
            if(i < track.artists.length -1) {
                template += ", ";
            }
        }
        template += "   </td>" +
            "   <td>" + track.album + "</td>" +
            "   <td>" + minutes + ":" + ("0" + seconds).slice(-2) + "</td>" +
            "   <td>" +
            "       <img class='img-btn plus' src='/images/plus.png' alt='/images/plus.png'/>" +
            "   </td>" +
            "</tr>";
        return $(template);
    }


    /**
     * Player
     */
    soundManager.setup({
        html5PollingInterval: 50,
        preferFlash: false
    });


    /**
     * Links events
     */
    $("#search-tracks-form").submit(function () {
        var query = $("#search-tracks-input").val();
        musicsService.searchTracks(query, _updateSearchView);
        return false;
    });


    $('body').on('click','.img-btn.play',function (e) {
        window.sm2BarPlayers[0].actions.stop();
        var trackElement = $(e.target).parent().parent();
        var trackId = trackElement.attr("id");
        var trackApi = trackElement.attr("api");
        musicsService.getTrack(trackApi, trackId, function (track) {
            if(track) {
                var template = "<li selected>" +
                               "     <a href='" + track.previewUrl + "'>" +
                               "       <b>";
                for(var i = 0; i < track.artists.length; i++) {
                    template += track.artists[i];
                    if(i < track.artists.length -1) {
                        template += ", ";
                    }
                }
                template += "</b>" +
                            "       - " + track.title + "" +
                            "     </a>" +
                            "</li>";
                var elements = $('.sm2-playlist-bd');
                elements.each(function (i, element) {
                    $(element).empty();
                    $(element).append(template);
                })

                window.sm2BarPlayers[0].playlistController.refresh();
                window.sm2BarPlayers[0].actions.play();
            }
        })
    });

    $('body').on('click','.img-btn.plus',function (e) {
        alert("Plus");
    });


})(jQuery, musicHub.musicsService);
