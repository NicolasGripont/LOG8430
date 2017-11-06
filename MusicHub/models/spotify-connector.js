var AbstractConnector = require('./abstract-connector');

class SpotifyConnector extends AbstractConnector {

    constructor(){
        super();
    }

    login(req, res) {
    }

    loggedIn(req, res) {
    }

    searchMusics(title) {
    }
}

module.exports = SpotifyConnector;