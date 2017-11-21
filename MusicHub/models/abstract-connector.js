/**
 * Created by Nico on 05/11/2017.
 */

class AbstractConnector {
    constructor(){
    }

    login(req, res, redirectUri) {
    }

    loggedIn(req, res, successCallback, errorCallback) {
    }

    logout(req, res, successCallback, errorCallback) {
    }

    setSettings(settings) {

    }

    searchMusics(title) {
    }
}

module.exports = AbstractConnector;

