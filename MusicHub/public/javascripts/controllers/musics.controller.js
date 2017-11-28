var musicHub = musicHub || {};

/**
 * Controls the "mucics" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, musicsService) {
    "use strict";


    /**
     * Updates the tracks result tables view.
     *
     * @param tracks  The tracks lists to render.
     * @private
     */
    function _updateTrackTablesView(tracks) {
        var spotifyElement = $(".spotify .tbody-musics");
        var deezerElement = $(".deezer .tbody-musics");

        spotifyElement.empty();
        for(var i = 0; i < tracks.spotify.length; i++) {
            spotifyElement.append(_createTrackTableElement(tracks.spotify[i]));
        }

        deezerElement.empty();
        for(var i = 0; i < tracks.deezer.length; i++) {
            deezerElement.append(_createTrackTableElement(tracks.deezer[i]));
        }
    }

    /**
     * Creates a table track element.
     *
     * @param track                     The track to use.
     * @returns {*|jQuery|HTMLElement}  A jQuery element.
     * @private
     */
    function _createTrackTableElement(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var template = "<tr api='" + track.platform + "' id='" + track.id + "'>" +
            "   <td>";
        if(track.previewUrl) {
            template += "       <img class='img-btn play' src='/images/play.png' alt='/images/play.png'/>";
        }
        template += "   </td>" +
                    "   <td>" +
                    "       <img class='img-btn plus' src='/images/plus.png' alt='/images/plus.png'/>" +
                    "   </td>" +
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
            "</tr>";
        return $(template);
    }

    function _updateCurrentTrackInPlayer(track){
        var elements = $('.sm2-playlist-bd');
        elements.each(function (i, element) {
            $(element).empty();
            $(element).append(_createPlayerTrackElement(track));
        })
    }

    /**
     * Creates a track player element.
     *
     * @param track                     The track to use.
     * @returns {*|jQuery|HTMLElement}  A jQuery element.
     * @private
     */
    function _createPlayerTrackElement(track) {
        var template = ""
        if(track) {
            template += "<li selected>" +
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
        } else {
            template += "<li selected>" +
                        "  <b> No Sound </b>";
                        "</li>";
        }
        return $(template);
    }

    function _updateNavPlaylistsView(playlists) {
        var navPlaylistsElement = $("ul.nav.nav-pills.flex-column");
        navPlaylistsElement.empty();
        if (playlists) {
            playlists.forEach(function(playlist) {
                navPlaylistsElement.append(_createNavPlaylistElement(playlist.name));
            });
        }
    }

    function _addPlaylistInNavPlaylistsView(playlistName) {
        var navPlaylistsElement = $("ul.nav.nav-pills.flex-column");
        navPlaylistsElement.append(_createNavPlaylistElement(playlistName));
    }

    function _createNavPlaylistElement(playlistName) {
        var template = "<li class='nav-item'>" +
            "  <a class='nav-link' href='#'>" + playlistName + "</a>" +
            "</li>";
        return $(template);
    }

    function _showToast(message) {
        var dialog = $("#toast");
        dialog.html(message);
        dialog.addClass("show");
        setTimeout(function(){ dialog.removeClass("show"); }, 3000);
    }

    /**
     * Links events
     */
    $("#search-tracks-form").submit(function () {
        var query = $("#search-tracks-input").val();
        musicsService.searchTracks(query, _updateTrackTablesView);
        return false;
    });


    $('body').on('click','.img-btn.play',function (e) {
        window.sm2BarPlayers[0].actions.stop();
        var trackElement = $(e.target).parent().parent();
        var trackId = trackElement.attr("id");
        var trackApi = trackElement.attr("api");
        musicsService.getTrack(trackApi, trackId, function (track) {
            _updateCurrentTrackInPlayer(track);
            if(track) {
                window.sm2BarPlayers[0].playlistController.refresh();
                window.sm2BarPlayers[0].actions.play();
            }
        })
    });

    $('body').on('click','.img-btn.plus',function (e) {
        alert("Plus");
    });

    $("#save-playlist").click(function(event) {
        var playlistName = $("#playlist-name").val();
        musicsService.createPlaylist(playlistName,function (error) {
            if(error) {
                return $(".alert-danger").append(error.message).fadeIn(1000);
            }
            $("#modal-create-playlist").modal('hide');
            _showToast("Playlist créée.");
            _addPlaylistInNavPlaylistsView(playlistName);

        })
    });

    $('#modal-create-playlist').on('hidden.bs.modal', function () {
        //TODO RESET MODAL
        $("#modal-create-playlist .alert").hide().html("");
        $(this).find("input").val('').end();
    });

    $('#modal-create-playlist').on('shown.bs.modal', function() {
        $("#playlist-name").focus();
    })

    $('#playlist-name').keypress(function(event) {
        var keycode = event.keyCode || event.which;
        if(keycode == '13') {
            $("#save-playlist").click();
        }
    })

    /**
     * Init View :
     */
    musicsService.getPlaylists(_updateNavPlaylistsView);


    /**
     * Init Player
     */
    soundManager.setup({
        html5PollingInterval: 50,
        preferFlash: false
    });



})(jQuery, musicHub.musicsService);
