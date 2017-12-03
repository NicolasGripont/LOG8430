/**
 * Define the Deezer Music API Connector Parameters Class
 * This class defines the parameters to create a DeezerConnector
 */
class DeezerConnectorParams {

    constructor(){
        this._appId = undefined;
        this._secretKey = undefined;
        this._loginUrl = undefined;
        this._perms = undefined;
        this._tokenUrl = undefined;
    }

    /**
     * Getter of the Deezer Application ID on http://developers.deezer.com/myapps
     *
     * @returns {*} Deezer Application ID on http://developers.deezer.com/myapps
     */
    get appId() {
        return this._appId;
    }

    /**
     * Setter of the Deezer Application ID on http://developers.deezer.com/myapps
     *
     * @param The Deezer Application ID on http://developers.deezer.com/myapps
     */
    set appId(value) {
        this._appId = value;
    }

    /**
     * Getter of the Deezer Secret Key on http://developers.deezer.com/myapps
     *
     * @returns {*} The Deezer Secret Key on http://developers.deezer.com/myapps
     */
    get secretKey() {
        return this._secretKey;
    }

    /**
     * Setter of the Deezer Secret Key on http://developers.deezer.com/myapps
     *
     * @param The Deezer Secret Key on http://developers.deezer.com/myapps
     */
    set secretKey(value) {
        this._secretKey = value;
    }

    /**
     * Getter of the Deezer api login url
     *
     * @returns {*} The Deezer api login url
     */
    get loginUrl() {
        return this._loginUrl;
    }

    /**
     * Setter of the Deezer api login url
     *
     * @param The Deezer api login url
     */
    set loginUrl(value) {
        this._loginUrl = value;
    }

    /**
     * Getter of the Deezer Permissions asked to the user
     *
     * @param The Deezer Permissions asked to the user
     */
    get perms() {
        return this._perms;
    }

    /**
     * Setter of the Deezer Permissions asked to the user
     *
     * @returns {*} The Deezer Permissions asked to the user
     */
    set perms(value) {
        this._perms = value;
    }

    /**
     * Getter of the Deezer api token url
     *
     * @param The Deezer api token url
     */
    get tokenUrl() {
        return this._tokenUrl;
    }

    /**
     * Setter of the Deezer api token url
     *
     * @returns {*} The Deezer api token url
     */
    set tokenUrl(value) {
        this._tokenUrl = value;
    }

}

/**
 * Export the DeezerConnectorParams class
 * @type {DeezerConnectorParams} Model class of DeezerConnectorParams
 */
module.exports = DeezerConnectorParams;