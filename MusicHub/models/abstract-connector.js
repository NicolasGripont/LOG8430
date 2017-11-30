/**
 * Define an Abstract Music API Connector Class
 * This class defines an abstraction of connector whose purpose is to interact with music API
 */
class AbstractConnector {
    /**
     * Constructor
     */
    constructor(){
    }

    /**
     * Log the user on the corresponding Api
     *
     * @param req           Http request
     * @param res           Http response
     * @param redirectUri   Redirect Uri to redirect when the user has logged on the API
     */
    login(req, res, redirectUri) {
    }

    /**
     * Method to use when the user has logged on the API. You should ask API parameters such as token
     * in this method
     *
     * @param req              Http request
     * @param res              Http response
     * @param successCallback  Function called when the connextion is successful.
     *                         Called with the req, res parameter and the json result.
     * @param errorCallback    Function called when the connextion is failed.
     *                         Called with the req, res parameter, the status code and the json result.
     */
    loggedIn(req, res, successCallback, errorCallback) {
    }

    /**
     * Log the user out of the corresponding Api
     *
     * @param req           Http request
     * @param res           Http response
     * @param successCallback  Function called when the log out is successful.
     *                         Called with the req, res parameter and the json result.
     * @param errorCallback    Function called when the log out is failed.
     *                         Called with the req, res parameter, the status code and the json result.
     */
    logout(req, res, successCallback, errorCallback) {
    }

    /**
     * Set the connector settings
     *
     * @param settings Settings to set
     */
    setSettings(settings) {

    }

    /**
     * Search tracks corresponding on the title on the API
     *
     * @param query Query to search (keywords)
     */
    searchTracks(query) {

    }

    /**
     * Format the api json tracks in json Model.Music array
     *
     * @param apiTracks Api json tracks to format
     */
    formatTracks(apiTracks) {

    }

    /**
     * Find track by id on the API
     *
     * @param id Id of the track to find
     */
    findTrack(id) {

    }
}

/**
 * Export the AbstractConnector class
 * @type {AbstractConnector} Model class of AbstractConnector
 */
module.exports = AbstractConnector;

