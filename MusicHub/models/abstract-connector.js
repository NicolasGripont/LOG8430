/**
 * Define an Abstract Music Api Connector Class
 * This class defines an abstraction of connector whose purpose is to interact with music api
 */
class AbstractConnector {
    /**
     * Constructor
     */
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

    searchTracks(title) {

    }

    findTrack(id) {

    }


}
/**
 * Created by Nico on 05/11/2017.
 */

module.exports = AbstractConnector;

