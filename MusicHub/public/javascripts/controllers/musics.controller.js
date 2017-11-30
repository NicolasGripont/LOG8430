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
        playlistDetailTitle : $("#playlist-detail-name"),
        playlistTracksElement : $(".playlist .tbody-musics"),
        addTrackButton : $("#add-track"),
        deletePlaylistButton : $("#deletePLaylistImage"),
        deletePlaylistModal : $("#modal-remove-playlist"),
        removePlaylistButtonValidate : $("#remove-playlist")
    };

    var _apiImageSources = {
        deezer : "/images/deezer.png",
        spotify : "/images/spotify.png",
    };

    var _selectors = {
        playImageButton : ".img-btn.play",
        plusImageButton : ".img-btn.plus",
        minusImageButton : ".img-btn.minus",
        inputs : "input",
        li : "li",
        playMusicSelector : '.sm2-playlist-bd',
        playlistNameLink : "a.nav-link",
        options : "option"
    };


    /**
     * Show the tracks result tables view.
     *
     * @param tracks  The tracks lists to render.
     * @private
     */
    function _showTracksSearchResultTablesView(tracks) {
        var spotifyElement = _elements.spotifySearchResultElement;
        var deezerElement = _elements.deezerSearchResultElement;

        _elements.playlistDetailElement.hide();
        _elements.searchMusicResultElement.show();

        spotifyElement.empty();
        for(var i = 0; i < tracks.spotify.length; i++) {
            spotifyElement.append(_createTrackSearchResultTableElement(tracks.spotify[i]));
        }

        deezerElement.empty();
        for(var i = 0; i < tracks.deezer.length; i++) {
            deezerElement.append(_createTrackSearchResultTableElement(tracks.deezer[i]));
        }
    }

    /**
     * Creates a table track element.
     *
     * @param track                     The track to use.
     * @returns {*|jQuery|HTMLElement}  A jQuery element.
     * @private
     */
    function _createTrackSearchResultTableElement(track) {
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
            template += track.artists[i].name;
            if(i < track.artists.length -1) {
                template += ", ";
            }
        }
        template += "   </td>" +
            "   <td>" + track.album.name + "</td>" +
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
        var elements = $(_selectors.playMusicSelector);

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
                template += track.artists[i].name;
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

    /**
     * Create a playlist table track line.
     *
     * @param track             Track to put in the table line.
     * @returns {*|HTMLElement} A jQuery element.
     * @private
     */
    function _createTrackPlaylistTableElement(track) {
        var duration = track.duration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        var apiImageSource = _apiImageSources[track.platform];

        var template = "<tr api='" + track.platform + "' id='" + track.id + "'>" +
                       "  <td> ";
        if(apiImageSource)
        {
            template += "     <img class='img-platform' src='" + apiImageSource + "' alt='" + apiImageSource + "'/>";
        }
                        "  </td>";
        template +=     "  <td>";
        if(track.previewUrl) {
            template += "    <img class='img-btn play' src='/images/play.png' alt='/images/play.png'/>";
        }
        template +=     "  </td>" +
                        "  <td> " +
                        "     <img class='img-btn minus' src='/images/minus.png' alt='/images/minus.png'/>" +
                        "  </td>" +
                        "   <td>" + track.title + "</td>" +
                        "   <td>";
        for(var i = 0; i < track.artists.length; i++) {
            template += track.artists[i].name;
            if(i < track.artists.length -1) {
                template += ", ";
            }
        }
        template +=     "   </td>" +
                        "   <td>" + track.album.name + "</td>" +
                        "   <td>" + minutes + ":" + ("0" + seconds).slice(-2) + "</td>" +
                        "</tr>";
        return $(template);
    }

    /**
     * Show the playlist.
     *
     * @param playlist Playlist to show
     * @private
     */
    function _showPlaylistDetail(playlist) {
        var titleElement = _elements.playlistDetailTitle;
        var listMusics = _elements.playlistTracksElement;
        titleElement.empty();
        listMusics.empty();
        if(playlist) {
            titleElement.html(playlist.name);
            for(var i = 0; i < playlist.musics.length; i++) {
                listMusics.append(_createTrackPlaylistTableElement(playlist.musics[i]));
            }
            _elements.playlistDetailElement.show();
            _elements.searchMusicResultElement.hide();
        } else {
            _showToast("Une erreur est survenue.");
        }
    }

    /**
     * Update the add track to playlist modal view
     *
     * @param playlists The playlist whe the user can add tracks
     * @private
     */
    function _updateModalAddMusic(playlists) {
        var selectPlaylist = _elements.playlistNameSelect;
        selectPlaylist.find(_selectors.option).remove();
        if (playlists) {
            playlists.forEach(function(playlist) {
                selectPlaylist.append("<option>" + playlist.name + "</option>");
            });
        }
    }

    /**
     * Link the search track form submit event
     *
     * @private
     */
    function _linkSearchTrackFormSubmitEvent() {
        _elements.searchTrackForm.submit(function () {
            var query = _elements.searchTracksInput.val();
            musicsService.searchTracks(query, _showTracksSearchResultTablesView);
            return false;
        });
    }


    /**
     * Link the play track buttons click event
     *
     * @private
     */
    function _linkBodyPlayImageButtonsClickEvent() {
        _elements.body.on('click',_selectors.playImageButton,function (e) {
            window.sm2BarPlayers[0].actions.stop();
            var tableElement = $(e.target).parent().parent().parent().parent();
            var trElement = $(e.target).parent().parent();
            var trackId = trElement.attr("id");
            var trackApi = trElement.attr("api");

            var callback = function (track) {
                _updateCurrentTrackInPlayer(track);
                if(track) {
                    window.sm2BarPlayers[0].playlistController.refresh();
                    window.sm2BarPlayers[0].actions.play();
                }
            };

            if(tableElement.hasClass("result")) {
                musicsService.findTrackFromSearchResultInSessionStrorage(trackApi, trackId, callback);
            } else {
                musicsService.findTrackFromPlaylistInSessionStrorage(trackApi, trackId, callback);
            }

        });
    }


    /**
     * Link the add track to playlist button click event
     *
     * @private
     */
    function _linkBodyPlusImageButtonsClickEvent() {
        _elements.body.on('click',_selectors.plusImageButton,function (e) {
            var api =  $(this).closest("tr").attr("api");
            var id =  $(this).closest("tr").attr("id");
            if(api && id) {
                musicsService.findTrackFromSearchResultInSessionStrorage(api, id, function(track) {
                    if(track !== null) {
                        currentTrack.id = id;
                        currentTrack.platform = api;
                        musicsService.retrievePlaylists(_updateModalAddMusic);
                        _elements.addMusicModal.modal('show');
                    }
                });
            }
        });
    }

    /**
     * Link the remove track from playlist button click event
     *
     * @private
     */
    function _linkBodyMinusImageButtonsClickEvent() {
        _elements.body.on('click',_selectors.minusImageButton,function (e) {
            var api =  $(this).closest("tr").attr("api");
            var musicId =  $(this).closest("tr").attr("id");
            var playlistName = _elements.playlistDetailTitle[0].innerText;
            if(api && musicId && playlistName) {
                musicsService.deleteMusicFromPlaylist(api, playlistName, musicId, function(error) {
                    if(error) {
                        _showToast(error.message);
                    } else {
                        _showToast("Music deleted.");
                        musicsService.retrievePlaylist(playlistName,_showPlaylistDetail);
                    }
                });
            }
        });
    }


    /**
     * Link the create playlist button click event
     *
     * @private
     */
    function _linkSavePlaylistButtonClickEvent() {
        _elements.savePlaylistButton.click(function(event) {
            var playlistName = _elements.playlistNameInput.val();
            musicsService.createPlaylist(playlistName,function (error) {
                if(error) {
                    _elements.createPlaylistDangerAlert.empty();
                    return _elements.createPlaylistDangerAlert.append(error.message).fadeIn(1000);
                }
                _elements.createPlaylistModal.modal('hide');
                _showToast("Playlist créée.");
                _addPlaylistInNavPlaylistsView(playlistName);

            })
        });
    }


    /**
     * Link the add music to playlist button click event
     *
     * @private
     */
    function _linkAddTrackButtonClickEvent() {
        _elements.addTrackButton.click(function(event) {
            var playlistName = _elements.playlistNameSelect.val();
            if(currentTrack.id && currentTrack.platform) {
                musicsService.addMusicToPlaylist(playlistName, currentTrack, function(error) {
                    if(error) {
                        _elements.addMusicDangerAlert.empty();
                        return _elements.addMusicDangerAlert.append(error.message).fadeIn(1000);
                    }
                    _elements.addMusicModal.modal('hide');
                    _showToast("Musique ajoutée à la playlist " + playlistName + ".");
                    currentTrack = {};
                });
            }
        });
    }

    /**
     * Link the validate remove playlist button click event
     *
     * @private
     */
    function _linkRemovePlaylistButtonValidateClickEvent() {
        _elements.removePlaylistButtonValidate.click(function(event) {
            var playlistName = _elements.playlistDetailTitle[0].innerText;
            musicsService.deletePlaylist(playlistName, function(error) {
                if(error) {
                    _showToast(error.message);
                } else {
                    //TODO voir avec autre vue
                    _elements.playlistDetailElement.hide();
                    _elements.searchMusicResultElement.show();
                    _elements.deletePlaylistModal.modal('hide');
                    _showToast("Playlist deleted with success.");
                    musicsService.retrievePlaylists(_updateNavPlaylistsView);
                }
            })
        });
    }


    /**
     * Link the create playlist modal hide event
     *
     * @private
     */
    function _linkCreatePlaylistModalHideEvent() {
        _elements.createPlaylistModal.on('hidden.bs.modal', function () {
            _elements.createPlaylistDangerAlert.hide().html("");
            _elements.createPlaylistSuccessAlert.hide().html("");
            $(this).find(_selectors.inputs).val('').end();
        });
    }

    /**
     * Link the create playlist modal show event
     *
     * @private
     */
    function _linkCreatePlaylistModalShowEvent() {
        _elements.createPlaylistModal.on('shown.bs.modal', function() {
            _elements.playlistNameInput.focus();
        })
    }

    /**
     * Link the add music to playlist modal hide event
     *
     * @private
     */
    function _linkAddMusicModalHideEvent() {
        _elements.addMusicModal.on('hidden.bs.modal', function () {
            _elements.createPlaylistDangerAlert.hide().html("");
            _elements.createPlaylistSuccessAlert.hide().html("");
            $(this).find(_selectors.inputs).val('').end();
        });
    }


    /**
     * Link the add music to playlist modal show event
     *
     * @private
     */
    function _linkAddMusicModalShowEvent() {
        _elements.addMusicModal.on('shown.bs.modal', function() {
            _elements.playlistNameSelect.focus();
        });
    }


    /**
     * Link the create playlist form submit event
     *
     * @private
     */
    function _linkcreatePlaylistFormSubmitEvent() {
        _elements.createPlaylistForm.submit(function (event) {
            event.preventDefault();
            _elements.savePlaylistButton.click();
        });
    }


    /**
     * Link the show playlist by clicking on the name event
     *
     * @private
     */
    function _linkNavPlaylistsElementClickEvent() {
        _elements.navPlaylistsElement.on("click", _selectors.li, function() {
            var playlistName = $(this).children(_selectors.playlistNameLink).html();
            musicsService.retrievePlaylist(playlistName,_showPlaylistDetail);
        });
    }


    /**
     * Link the show playlist by clicking on the name event
     *
     * @private
     */
    function _linkDeletePlaylistButtonClickEvent() {
        _elements.deletePlaylistButton.click(function () {
            _elements.deletePlaylistModal.modal('show');
        });
    }

    /**
     * Init the View
     *
     * @private
     */
    function _initView() {
        musicsService.retrievePlaylists(_updateNavPlaylistsView);
        _elements.playlistDetailElement.hide();
    }

    /**
     * Init Player
     *
     * @private
     */
    function _initPlayer() {
        soundManager.setup({
            html5PollingInterval: 50,
            preferFlash: false
        });
    }

    /**
     * Init controller
     * @private
     */
    function _init() {
        _linkSearchTrackFormSubmitEvent();
        _linkBodyPlayImageButtonsClickEvent();
        _linkBodyPlusImageButtonsClickEvent();
        _linkBodyMinusImageButtonsClickEvent();
        _linkSavePlaylistButtonClickEvent();
        _linkAddTrackButtonClickEvent();
        _linkRemovePlaylistButtonValidateClickEvent();
        _linkCreatePlaylistModalHideEvent();
        _linkCreatePlaylistModalShowEvent();
        _linkAddMusicModalHideEvent();
        _linkAddMusicModalShowEvent();
        _linkcreatePlaylistFormSubmitEvent();
        _linkNavPlaylistsElementClickEvent();
        _linkDeletePlaylistButtonClickEvent();
        _initView();
        _initPlayer();
    }

    _init();

})(jQuery, musicHub.musicsService);
