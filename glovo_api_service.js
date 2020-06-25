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
        result = await JSON.parse(resultInText);
        return result;

    }

    async getAffordableStores() {
        let nowDate = new Date();
        let timestamp = nowDate.getTime();

        let refreshAccessToken = await this.accessTokenRefresher();
        let authorization = await refreshAccessToken.accessToken;


        let fetchResult = await fetch('https://api.glovoapp.com/v3/stores?category=GROCERIES_UA', {
            headers: {
                'glovo-location-city-code': 'DNP', //todo: get field from glovo
                'glovo-language-code': 'ru',
                'glovo-delivery-location-latitude': 'latitude',//todo: your latitude
                'glovo-delivery-location-longitude': 'longitude',//todo: your longitude
                'glovo-delivery-location-timestamp': timestamp,
                'glovo-delivery-location-accuracy': '0'
            }
        });
        let storeInformation = [];
        let jsonWithResults = await fetchResult.json();
        jsonWithResults.map(storeInformationObject => {
            let obj = {};
            obj.id = storeInformationObject.id;
            obj.name = storeInformationObject.name;
            obj.addressId = storeInformationObject.addressId;
            storeInformation.push(obj);
        });
        return storeInformation;
    }

    async generateUrl(shop, item) {
        let availability = await this.getAffordableStores();

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
        let url = await this.generateUrl(shop, item);

        let refreshAccessToken = await this.accessTokenRefresher(); //todo: refresh after 19 min

        let fetchResult = await fetch(url, {
            headers: refreshAccessToken.headers
        });
        let jsonWithResults = await fetchResult.json();

        //todo: consider the answer - bad request
        //todo: if error - refresh token

        const resArr = jsonWithResults.results[0].products;
        let arrWithInfo = [];
        resArr.map(nameOfProduct => {
            let objOfNameAndImg = {};
            objOfNameAndImg.name = nameOfProduct.name;
            objOfNameAndImg.imageUrl = nameOfProduct.imageUrl;
            objOfNameAndImg.id = nameOfProduct.id;
            objOfNameAndImg.price = nameOfProduct.price;
            arrWithInfo.push(objOfNameAndImg);
        });
        return arrWithInfo;
    }
}

module.exports = GlovoAPI;