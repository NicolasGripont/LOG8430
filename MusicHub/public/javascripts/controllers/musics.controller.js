var musicHub = musicHub || {};

/**
 * Controls the "mucics" view.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>
 */
(function($, musicsService) {
    "use strict";

    var currentTrack = {};

    var _elements = {
        body : $('body'),
        spotifySearchResultElement : $(".spotify .tbody-musics"),
        deezerSearchResultElement : $(".deezer .tbody-musics"),
        playMusicElement : $('.sm2-playlist-bd'),
        navPlaylistsElement : $("ul.nav.nav-pills.flex-column"),
        toastElement : $("#toast"),
        searchTracksInput : $("#search-tracks-input"),
        searchTrackForm : $("#search-tracks-form"),
        playlistNameInput : $("#playlist-name-input"),
        createPlaylistDangerAlert : $("#modal-create-playlist .alert-danger"),
        createPlaylistSuccessAlert : $("#modal-create-playlist .alert-success"),
        createPlaylistModal : $("#modal-create-playlist"),
        createPlaylistForm : $('#create-playlist-form'),
        savePlaylistButton : $("#save-playlist-button"),
        addMusicModal : $('#modal-add-music'),
        playlistNameSelect : $("#playlist-name-select"),
        playlistDetailElement : $("#playlist-detail"),
        addMusicDangerAlert : $("#modal-add-music .alert-danger"),
        addMusicSuccessAlert : $("#modal-add-music .alert-success"),
        searchMusicResultElement : $("#search-musics"),
        playlistDetailName : $("#playlist-detail-name"),
        playlistDetailTitleElement : $("#playlist-detail h1"),
        playlistTracksElement : $(".playlist .tbody-musics"),
        addTrackButton : $("#add-track")
    }

    var _selectors = {
        playImageButtons : ".img-btn.play",
        plusImageButtons : ".img-btn.plus",
        inputs : "input",
        li : "li"
    }


    /**
     * Updates the tracks result tables view.
     *
     * @param tracks  The tracks lists to render.
     * @private
     */
    function _updateTrackTablesView(tracks) {
        var spotifyElement = _elements.spotifySearchResultElement;
        var deezerElement = _elements.deezerSearchResultElement;

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
        var elements = _elements.playMusicElement;
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
        var navPlaylistsElement = _elements.navPlaylistsElement;
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
        var navPlaylistsElement = _elements.navPlaylistsElement;
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
        var toastElement = _elements.toastElement;
        toastElement.html(message);
        toastElement.addClass("show");
        setTimeout(function(){ toastElement.removeClass("show"); }, 3000);
    }

    function _createTrackTableElementPlaylist(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var imgSrc = "";
        //TODO : ajouter nouvelle plateforme
        if(track.platform === "deezer") {
            imgSrc = "/images/deezer.png";
        } else {
            imgSrc = "/images/spotify.png";
        }

        var template = "<tr api='" + track.platform + "' id='" + track.id + "'>" +
            "   <td> <img class='platform-img' src='" + imgSrc + "'></td>";
        if(track.previewUrl) {
            template += "  <td><img class='img-btn play' src='/images/play.png' alt='/images/play.png'/>";
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
            "</tr>";
        return $(template);
    }

    function _showPlaylistDetail() {
        var name = $(this).children("a.nav-link").html();
        _elements.playlistDetailTitleElement.html(name);
        var listMusics = _elements.playlistTracksElement;
        listMusics.empty();
        musicsService.getPlaylist(name, function(playlist) {
            _elements.playlistDetailName.html(name);
            for(var i = 0; i < playlist.musics.length; i++) {
                listMusics.append(_createTrackTableElementPlaylist(playlist.musics[i]));
            }
            _elements.playlistDetailElement.show();
            _elements.searchMusicResultElement.hide();
        });
    }

    function _updateModalAddMusic(playlists) {
        var selectPlaylist = _elements.playlistNameSelect;
        selectPlaylist.find("option").remove();
        if (playlists) {
            playlists.forEach(function(playlist) {
                selectPlaylist.append("<option>" + playlist.name + "</option>");
            });
        }
    }

    /**
     * Link the search track form submit event
     */
    _elements.searchTrackForm.submit(function () {
        var query = _elements.searchTracksInput.val();
        _elements.playlistDetailElement.hide();
        _elements.searchMusicResultElement.show();
        musicsService.searchTracks(query, _updateTrackTablesView);
        return false;
    });

    /**
     * Link the play track buttons click event
     */
    // TODO
    _elements.body.on('click',_selectors.playImageButtons,function (e) {
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
    _elements.body.on('click',_selectors.plusImageButtons,function (e) {
        var api =  $(this).closest("tr").attr("api");
        var id =  $(this).closest("tr").attr("id");
        if(api && id) {
            musicsService.getTrack(api, id, function(track) {
                if(track !== null) {
                    currentTrack.id = id;
                    currentTrack.platform = api;
                    musicsService.getPlaylists(_updateModalAddMusic);
                    _elements.addMusicModal.modal('show');
                }
            });
        }
    });

    /**
     * Link the create playlist button click event
     */
    _elements.savePlaylistButton.click(function(event) {
        var playlistName = _elements.playlistNameInput.val();
        musicsService.createPlaylist(playlistName,function (error) {
            if(error) {
                return _elements.createPlaylistDangerAlert.append(error.message).fadeIn(1000);
            }
            _elements.createPlaylistModal.modal('hide');
            _showToast("Playlist créée.");
            _addPlaylistInNavPlaylistsView(playlistName);

        })
    });

    /**
     * Link the add music to playlist button click event
     */
   _elements.addTrackButton.click(function(event) {
        var playlistName = _elements.playlistNameSelect.val();
        if(currentTrack.id && currentTrack.platform) {
            musicsService.addMusicToPlaylist(playlistName, currentTrack, function(error) {
                if(error) {
                    return _elements.addMusicDangerAlert.append(error.message).fadeIn(1000);
                }
                _elements.addMusicModal.modal('hide');
                _showToast("Musique ajoutée à la playlist " + playlistName + ".");
                currentTrack = {};
            });
        }
    });

    /**
     * Link the create playlist modal hide event
     */
    _elements.createPlaylistModal.on('hidden.bs.modal', function () {
        _elements.createPlaylistDangerAlert.hide().html("");
        _elements.createPlaylistSuccessAlert.hide().html("");
        $(this).find(_selectors.inputs).val('').end();
    });

    /**
     * Link the create playlist modal show event
     */
    _elements.createPlaylistModal.on('shown.bs.modal', function() {
        _elements.playlistNameInput.focus();
    })

    /**
     * Link the add music to playlist modal hide event
     */
    _elements.addMusicModal.on('hidden.bs.modal', function () {
        _elements.createPlaylistDangerAlert.hide().html("");
        _elements.createPlaylistSuccessAlert.hide().html("");
        $(this).find(_selectors.inputs).val('').end();
    });

    /**
     * Link the add music to playlist modal show event
     */
    _elements.addMusicModal.on('shown.bs.modal', function() {
        _elements.playlistNameSelect.focus();
    });

    /**
     * Link the create playlist form submit event
     */
    _elements.createPlaylistForm.submit(function (event) {
        event.preventDefault();
        _elements.savePlaylistButton.click();
    });

    /**
     * Link the show playlist by clicking on the name event
     */
    _elements.navPlaylistsElement.on("click", _selectors.li, _showPlaylistDetail);


    /**
     * Init View
     */
    musicsService.getPlaylists(_updateNavPlaylistsView);
    _elements.playlistDetailElement.hide();


    /**
     * Init Player
     */
    soundManager.setup({
        html5PollingInterval: 50,
        preferFlash: false
    });



})(jQuery, musicHub.musicsService);
