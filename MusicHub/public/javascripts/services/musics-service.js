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

    self.getPlaylists = function(callback) {
        $.ajax({
            url: "/playlist/",
            type: "get",
            dataType: "json"
        }).done(function(json) {
            if(json.error) {
                return callback([]);
            }
            return callback(json);
        }).fail(function (error) {
            return callback([]);
        })
    }

    self.getPlaylist = function(playlistName, callback) {
        $.ajax({
            url: "/playlist/" + playlistName,
            type: "get",
            dataType: "json"
        }).done(function(json) {
            if(json.error) {
                return callback(null);
            }
            return callback(json);
        }).fail(function(error) {
            return callback(null);
        })
    }

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
        .done(function (json) {
            callback(json.error);
        })
        .fail(function (xhr, status, errorThrown) {
            callback({message:"Connection Error."});
        });
    }

    return self;
})(jQuery);
