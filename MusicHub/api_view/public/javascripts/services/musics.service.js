var musicHub = musicHub || {};
/**
 * Defines a service to retrieve the tracks.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.musicsService = (function($, utils) {
    "use strict";

    var self = {};

    /**
     * Gets all products associated with the category and order by the sortingCriteria
     *
     * @param query     The search query, keyword
     * @param callback  Function called when result is gotten. Called with the json object of
     *                  \{API_name : \[Tracks\],...\} if success or an empty json objct if fail as parameter.
     */
    self.searchTracks = function (query, callback) {
        var host = utils.getParameter("connector-host");
        var port = utils.getParameter("connector-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/connector/search/" + query,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            type: "GET"
        }).done(function (tracks) {
            sessionStorage.setItem("tracks", JSON.stringify(tracks));
            return callback(tracks);
        }).fail(function (error) {
            return callback({})
        })
        return false;
    }

    /**
     * Finds the track associated with the track ID and api specified from 'tracks' stored in sessionStorage.
     *
     * @param api         The api associated with the track to retrieve.
     * @param trackId     The track ID associated with the track to retrieve.
     * @param callback    Function called when result is gotten. Called with the json of track if success or
     *                    null value if fail as parameter.
     */
    self.findTrackFromSearchResultInSessionStrorage = function(api, trackId, callback) {
        var tracks = JSON.parse(sessionStorage.getItem("tracks"));
        if(tracks) {
            var apiTracks = tracks[api];
            if(apiTracks) {
                for(var i = 0; i < apiTracks.length; i++) {
                    if(apiTracks[i].id == trackId) {
                        return callback(apiTracks[i]);
                    }
                }
            }
        }
        return callback(null);
    };

    /**
     * Finds the track associated with the track ID and api specified from 'playlist' stored in sessionStorage.
     *
     * @param api         The api associated with the track to retrieve.
     * @param trackId     The track ID associated with the track to retrieve.
     * @param callback    Function called when result is gotten. Called with the json of track if success or
     *                    null value if fail as parameter.
     */
    self.findTrackFromPlaylistInSessionStrorage = function(api, trackId, callback) {
        var playlist = JSON.parse(sessionStorage.getItem("playlist"));
        if(playlist) {
            var musics = playlist.musics;
            for(var i = 0; i < musics.length; i++) {
                if(musics[i].id == trackId && musics[i].platform === api) {
                    return callback(musics[i]);
                }
            }
        }
        return callback(null);
    };


    /**
     * Retrieves the playlists associated with the current connected user.
     *
     * @param callback    Function called when result is gotten. Called with the json array of playlists if success or
     *                    an empty json array if fail as parameter.
     */
    self.retrievePlaylists = function(callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            type: "get",
            dataType: "json"
        }).done(function(playlists) {
            return callback(playlists);
        }).fail(function (error) {
            return callback([]);
        })
    }

    /**
     * Retrieves the playlist associated with the playlist name specified and current connected user.
     *
     * @param playlistName  The playlist name of the playlist to retrieve.
     * @param callback      Function called when result is gotten. Called with the json of the playlist if success or
     *                      null value if fail as parameter.
     */
    self.retrievePlaylist = function(playlistName, callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/" + playlistName,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            type: "get",
            dataType: "json"
        }).done(function(playlist) {
            sessionStorage.setItem("playlist",JSON.stringify(playlist));
            return callback(playlist);
        }).fail(function(error) {
            return callback(null);
        })
    }

    /**
     * Create a playlist associated with the playlist name specified and current connected user.
     *
     * @param playlistName  The playlist name of the playlist to create.
     * @param callback      Function called when playlist is created or if failed.
     *                      Called with the error json with "message" attribute if fail or null if success as parameter.
     */
    self.createPlaylist = function(playlistName, callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/create",
            type: "POST",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                playlistName: playlistName
            })
        })
        .done(function (success) {
            return callback(null);
        })
        .fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message: "Server Error."});
        });
    };

    /**
     * Add a music to the playlist associated to the name.
     *
     * @param playlistName  The playlist name of the playlist where the music will be added
     * @param music         The music to add, the format is \{id:someId, platform:somePlatform\}
     * @param callback      Function called when playlist is added or if failed.
     *                      Called with the error json with "message" attribute if fail or null if success as parameter.
     */
    self.addMusicToPlaylist = function(playlistName, music, callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/music",
            type: "PUT",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                playlistName: playlistName,
                musicId: music.id,
                musicPlatform: music.platform
            })
        })
        .done(function(music) {
            callback(music.error);
        })
        .fail(function (xhr, status, errorThrown) {
            callback({message:"Connection Error."});
        });

    };


    /**
     * Delete a music from the playlist associated with playlistName
     * @param musicPlatform    Platform/   Api name of the music to delete
     * @param playlistName     Playlist name of the music to delete
     * @param musicId          Id of the music to delete
     * @param callback         Function called when music is removed or if failed. Called with the error json
     *                         with "message" attribute if fail or null if success as parameter.
     */
    self.deleteMusicFromPlaylist = function(musicPlatform, playlistName, musicId, callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/music",
            type: "Delete",
            dataType: "json",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                playlistName: playlistName,
                musicId: musicId,
                musicPlatform: musicPlatform
            })
        })
        .done(function(success) {
            callback(null);
        })
        .fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message: "Server Error."});
        });

    };

    /**
     * Delete the playlist associated with playlistName
     * @param playlistName  Playlist name to delete
     * @param callback      Function called when playlist is removed or if failed.
     *                      Called with the error json with "message" attribute if fail or null if success as parameter.
     */
    self.deletePlaylist = function(playlistName, callback) {
        var host = utils.getParameter("playlist-host");
        var port = utils.getParameter("playlist-port");
        $.ajax({
            url: "http://" + host + ":" + port + "/playlist/delete",
            type: "Delete",
            dataType: "json",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {"Access-Control-Allow-Origin": "*"},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                playlistName: playlistName,
            })
        })
        .done(function(success) {
            callback(null);
        })
        .fail(function (error) {
            if(error.responseJSON.message) {
                return callback(error.responseJSON);
            }
            return callback({message: "Server Error."});
        });

    };

    return self;
})(jQuery, musicHub.utils);
