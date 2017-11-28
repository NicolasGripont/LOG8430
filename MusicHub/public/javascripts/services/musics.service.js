var musicHub = musicHub || {};

/**
 * Defines a service to retrieve the tracks.
 *
 * @author Nicolas Gripont <nicolas.gripont@polymtl.ca>treille@polymtl.ca>
 */
musicHub.musicsService = (function($) {
    "use strict";

    var self = {};

    /**
     * Gets all products associated with the category and order by the sortingCriteria
     *
     * @param query     The search query, keyword
     * @param callback            Function called when result is gotten. Called with the json object of
     *                            {API_name : [Tracks],...} if success or an empty json objct if fail as parameter.
     */
    self.searchTracks = function (query, callback) {
        $.ajax({
            url: "/connector/search/" + query,
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
     * Gets the track associated with the track ID and api specified.
     *
     * @param api         The api associated with the track to retrieve.
     * @param trackId   The track ID associated with the track to retrieve.
     * @param callback    Function called when result is gotten. Called with the json of track if success or
     *                    null value if fail as parameter.
     */
    self.getTrack = function(api, trackId, callback) {
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
     * Gets the playlists
     *
     * @param callback    Function called when result is gotten. Called with the json array of playlists if success or
     *                    an empty json array if fail as parameter.
     */
    self.getPlaylists = function(callback) {
        $.ajax({
            url: "/playlist/",
            type: "get",
            dataType: "json"
        }).done(function(playlists) {
            return callback(playlists);
        }).fail(function (error) {
            return callback([]);
        })
    }

    /**
     * Gets the playlist associated with the playlist name specified and current connected user.
     *
     * @param playlistName  The playlist name of the playlist to retrieve.
     * @param callback      Function called when result is gotten. Called with the json of the playlist if success or
     *                      null value if fail as parameter.
     */
    self.getPlaylist = function(playlistName, callback) {
        $.ajax({
            url: "/playlist/" + playlistName,
            type: "get",
            dataType: "json"
        }).done(function(playlist) {
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
        $.ajax({
            url: "/playlist/create",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                name: playlistName
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
     * @param music         The music to add, the format is {id:someId, platform:somePlatform}
     * @param callback      Function called when playlist is added or if failed.
     *                      Called with the error json with "message" attribute if fail or null if success as parameter.
     */
    self.addMusicToPlaylist = function(playlistName, music, callback) {
        $.ajax({
            url: "/playlist/music",
            type: "PUT",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                name: playlistName,
                id: music.id,
                platform: music.platform
            })
        })
        .done(function(music) {
            callback(music.error);
        })
        .fail(function (xhr, status, errorThrown) {
            callback({message:"Connection Error."});
        });

    };

    return self;
})(jQuery);
