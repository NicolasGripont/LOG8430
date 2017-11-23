class Music {
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

module.exports = Music;