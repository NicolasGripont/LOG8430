/**
 * Define the Spotify Music API Connector Parameters Class
 * This class defines the parameters to create a SpotifyConnector
 */
class SpotifyConnectorParams {

    constructor(){
        this._clientId = undefined;
        this._clientSecret = undefined;
        this._loginUrl = undefined;
        this._tokenUrl = undefined;
        this._scope = undefined;
    }

    /**
     * Getter of the Client ID of application on https://beta.developer.spotify.com/dashboard/applications
     *
     * @returns {*} The Client ID of application on https://beta.developer.spotify.com/dashboard/applications
     */
    get clientId() {
        return this._clientId;
    }

    /**
     * Setter of the Client ID of application on https://beta.developer.spotify.com/dashboard/applications
     *
     * @param The Client ID of application on https://beta.developer.spotify.com/dashboard/applications
     */
    set clientId(value) {
        this._clientId = value;
    }

    /**
     * Getter of the Client Secret of application on https://beta.developer.spotify.com/dashboard/applications
     *
     * @returns {*} The Client Secret of application on https://beta.developer.spotify.com/dashboard/applications
     */
    get clientSecret() {
        return this._clientSecret;
    }

    /**
     * Setter of the Client Secret of application on https://beta.developer.spotify.com/dashboard/applications
     *
     * @param The Client Secret of application on https://beta.developer.spotify.com/dashboard/applications
     */
    set clientSecret(value) {
        this._clientSecret = value;
    }

    /**
     * Getter of the Spotify API login URL
     *
     * @returns {*} The Spotify API login URL
     */
    get loginUrl() {
        return this._loginUrl;
    }

    /**
     * Setter of the Spotify API login URL
     *
     * @param The Spotify API login URL
     */
    set loginUrl(value) {
        this._loginUrl = value;
    }


    /**
     * Getter of the Spotify API token URL
     *
     * @param The Spotify API token URL
     */
    get tokenUrl() {
        return this._tokenUrl;
    }

    /**
     * Setter of the Spotify API token URL
     *
     * @returns {*} The Spotify API token URL
     */
    set tokenUrl(value) {
        this._tokenUrl = value;
    }


    /**
     * Getter of the Permission asked
     *
     * @param The Permission asked
     */
    get scope() {
        return this._scope;
    }

    /**
     * Setter of the Permission asked
     *
     * @returns {*} The Permission asked
     */
    set scope(value) {
        this._scope = value;
    }
}

/**
 * Export the SpotifyConnectorParams class
 * @type {SpotifyConnectorParams} Model class of SpotifyConnectorParams
 */
module.exports = SpotifyConnectorParams;