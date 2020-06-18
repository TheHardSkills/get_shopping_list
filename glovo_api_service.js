const fetch = require('node-fetch');
const request = require('request'); //todo: delete
const accessSettings = require('./public/settings.js');


class GlovoAPI {
    constructor() { }
    async getToken() {
        const accesses = accessSettings.accesses;

        let response = await fetch('https://api.glovoapp.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'glovo-app-version': '7',
                'glovo-api-version': '13',
                'glovo-device-id': '97548324'
            },
            body: JSON.stringify(accesses)
        });
        let resultInText = await response.text();
        const result = JSON.parse(resultInText);
        return result;
    }
    async getAccessToken() {
        const token = await this.getToken();
        let accessToken = token.access.accessToken;
        return accessToken;
    }
    async getRefreshToken() {
        const token = await this.getToken();
        let refreshToken = { 'refreshToken': token.access.refreshToken };

        let resultInText = '';
        let result = {};
        let response = await fetch('https://api.glovoapp.com/oauth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'glovo-app-version': '7',
                'glovo-api-version': '13',
                'glovo-device-id': '97548324'
            },
            body: JSON.stringify(refreshToken)
        });
        resultInText = await response.text();
        result = JSON.parse(resultInText);
        return result;

    }
    generateUrl(shop, item) {
        let varus = {
            stores: 86583,
            addresses: 165396
        };
        let ashan = {
            stores: 62151,
            addresses: 123547
        };
        let metro = {
            stores: 78931,
            addresses: 152657
        };
        let selectedStore = {};
        if (shop === 'varus') {
            selectedStore.stores = varus.stores;
            selectedStore.addresses = varus.addresses;
        }
        if (shop === 'ashan') {
            selectedStore.stores = ashan.stores;
            selectedStore.addresses = ashan.addresses;
        } if (shop === 'metro') {
            selectedStore.stores = metro.stores;
            selectedStore.addresses = metro.addresses;
        }

        let stores = selectedStore.stores;
        let addresses = selectedStore.addresses;
        let url = `https://api.glovoapp.com/v3/stores/${stores}/addresses/${addresses}/search?query=${item}`;
        let encodedUrl = encodeURI(url);
        return encodedUrl;
    }

    async accessTokenRefresher() {
        const refreshAccessToken = await this.getRefreshToken();
        let authorization = await refreshAccessToken.accessToken;
        let headers = {
            'authorization': authorization,
            'glovo-location-city-code': 'DNP', //todo: get field from glovo
            'glovo-language-code': 'ru'
        }
        return { 'headers': headers };
    }

    async getSearch(shop, item) {
        let url = this.generateUrl(shop, item);

        let refreshAccessToken = await this.accessTokenRefresher(); //todo: refresh after 19 min

        let fetchResult = await fetch(url, {
            headers: refreshAccessToken.headers
        });
        let jsonWithResults = await fetchResult.json();

        //todo: consider the answer - bad request
        //todo: if error - refresh token
        let arrOfName = [];
        const resArr = jsonWithResults.results[0].products;

        resArr.map(nameOfProduct => {
            arrOfName.push(nameOfProduct.name)
        });
        return arrOfName;
    }
}

module.exports = GlovoAPI;