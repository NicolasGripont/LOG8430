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
            for(var i = 0; i < tracks.deezer.length; i++) {
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



    // soundManager.setup({
    //     // url: '/path/to/swf-files/',
    //     // flashVersion: 9, // optional: shiny features (default = 8)
    //     // optional: ignore Flash where possible, use 100% HTML5 mode
    //     preferFlash: false,
    //     onready: function() {
    //         // Ready to use; soundManager.createSound() etc. can now be called.
    //         var mySound = soundManager.createSound({
    //             id: 'Comme prévu - Ninho',
    //             url: 'http://e-cdn-preview-7.deezer.com/stream/79e6f771ff55d4eb832d3217083428cc-3.mp3',
    //             autoLoad: true,
    //             autoPlay: false,
    //             onload: function() {
    //                 alert('The sound '+this.id+' loaded!');
    //             },
    //             volume: 50
    //         });
    //         mySound.play();
    //     }
    // });



    var Player;
    var players = [];
    var playerSelector = '.sm2-bar-ui';
    var playerOptions;
    var utils;

    playerOptions = {
        // useful when multiple players are in use, or other SM2 sounds are active etc.
        stopOtherSounds: true,
        // CSS class to let the browser load the URL directly e.g., <a href="foo.mp3" class="sm2-exclude">download foo.mp3</a>
        excludeClass: 'sm2-exclude'
    };

    soundManager.setup({
        // trade-off: higher UI responsiveness (play/progress bar), but may use more CPU.
        html5PollingInterval: 50,
        preferFlash: false
    });

    soundManager.onready(function() {

        // var nodes, i, j;
        //
        // nodes = utils.dom.getAll(playerSelector);
        //
        // if (nodes && nodes.length) {
        //     for (i = 0, j = nodes.length; i < j; i++) {
        //         players.push(new Player(nodes[i]));
        //     }
        // }
        $('#sm2-playlist-bd').append('http://e-cdn-preview-7.deezer.com/stream/79e6f771ff55d4eb832d3217083428cc-3.mp3');
        window.sm2BarPlayers[0].playlistController.refresh();
    });


})();