/**
 * Represent a Music
 */
class Music {

    /**
     * Constructor
     *
     * @param id          Api id of the music.
     * @param platform    Api name of the music.
     * @param title       Title of the music.
     * @param artists     Artist array of the music.
     * @param album       Album of the music.
     * @param duration    Duration of the music in ms.
     * @param previewUrl  Preview mp3 url of he music.
     */
    constructor(id, platform, title, artists, album, duration, previewUrl) {
        this.id = id;
        this.platform = platform;
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.duration = duration;
        this.previewUrl = previewUrl;
    }
}

/**
 * Export the Music class
 * @type {Music} Model class of a Music
 */
module.exports = Music;