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

    /**
     * Updates the current track in player.
     *
     * @param track Track to put in player.
     * @private
     */
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

    /**
     * Updates the playlists list in nav menu.
     *
     * @param playlists Playlists to put in the menu.
     * @private
     */
    function _updateNavPlaylistsView(playlists) {
        var navPlaylistsElement = $("ul.nav.nav-pills.flex-column");
        navPlaylistsElement.empty();
        if (playlists) {
            playlists.forEach(function(playlist) {
                navPlaylistsElement.append(_createNavPlaylistElement(playlist.name));
            });
        }
    }

    /**
     * Add a playlist to the playlists list in nav menu.
     *
     * @param playlistName to put in the nav.
     * @private
     */
    function _addPlaylistInNavPlaylistsView(playlistName) {
        var navPlaylistsElement = $("ul.nav.nav-pills.flex-column");
        navPlaylistsElement.append(_createNavPlaylistElement(playlistName));
    }

    /**
     * Create a playlist nav menu element.
     *
     * @param playlistName              Playlist name to put in the nav.
     * @returns {*|jQuery|HTMLElement}  A jQuery element.
     * @private
     */
    function _createNavPlaylistElement(playlistName) {
        var template = "<li class='nav-item'>" +
            "  <a class='nav-link' href='#'>" + playlistName + "</a>" +
            "</li>";
        return $(template);
    }

    /**
     * Show a message on the view.
     *
     * @param message  Message to show
     * @private
     */
    function _showToast(message) {
        var dialog = $("#toast");
        dialog.html(message);
        dialog.addClass("show");
        setTimeout(function(){ dialog.removeClass("show"); }, 3000);
    }

    /**
     * Link the search track form submit event
     */
    $("#search-tracks-form").submit(function () {
        var query = $("#search-tracks-input").val();
        musicsService.searchTracks(query, _updateTrackTablesView);
        return false;
    });

    /**
     * Link the play track buttons click event
     */
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

    /**
     * Link the add track to playlist button click event
     */
    $('body').on('click','.img-btn.plus',function (e) {
        alert("Plus");
    });

    /**
     * Link the create playlist button click event
     */
    $("#save-playlist-button").click(function(event) {
        var playlistName = $("#playlist-name-input").val();
        musicsService.createPlaylist(playlistName,function (error) {
            if(error) {
                return $(".alert-danger").append(error.message).fadeIn(1000);
            }
            $("#modal-create-playlist").modal('hide');
            _showToast("Playlist créée.");
            _addPlaylistInNavPlaylistsView(playlistName);

        })
    });

    /**
     * Link the create playlist modal hide event
     */
    $('#modal-create-playlist').on('hidden.bs.modal', function () {
        $("#modal-create-playlist .alert").hide().html("");
        $(this).find("input").val('').end();
    });

    /**
     * Link the create playlist modal show event
     */
    $('#modal-create-playlist').on('shown.bs.modal', function() {
        $("#playlist-name").focus();
    })

    /**
     * Link the create playlist input keypress event
     */
    $('#playlist-name').keypress(function(event) {
        var keycode = event.keyCode || event.which;
        if(keycode == '13') {
            $("#save-playlist").click();
        }
    })

    /**
     * Init View
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
