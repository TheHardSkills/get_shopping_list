const fetch = require('node-fetch');
const accessSettings = require('./settings.js');


class GlovoAPI {
    constructor() {
        this.accessToken = undefined;
        this.refreshToken = undefined;
    }

    async loadRefreshTokenWithAutoupdate() {
        let refreshTokenData = await this.getToken();
        this.accessToken = refreshTokenData.access.accessToken;
        this.refreshToken = refreshTokenData.access.refreshToken;

        setInterval(
            async function () { await this.getNewToken() }.bind(this),
            /*refreshTokenData.expiresIn*/1199 * 1000
        );
    }

    async getToken() {
        let accesses = accessSettings.glovoCredentials;
        accesses.grantType = "password";

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
    // async getAccessToken() {
    //     const token = await this.getToken();
    //     let accessToken = token.access.accessToken;
    //     return accessToken;
    // }
    async getNewToken() {
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

        this.accessToken = result.accessToken;
        this.refreshToken = result.refreshToken;
    }

    async getAffordableStores() {
        let nowDate = new Date();
        let timestamp = nowDate.getTime();

        let refreshAccessToken = this.accessToken;

        let fetchResult = await fetch('https://api.glovoapp.com/v3/stores?category=GROCERIES_UA', {
            headers: {
                'glovo-location-city-code': 'DNP', //todo: get field from glovo
                'glovo-language-code': 'ru',
                'glovo-delivery-location-latitude': '48.413933',//todo: ather
                'glovo-delivery-location-longitude': '35.044598',//todo: ather
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

    async getSearch(shop, item) {
        let url = await this.generateUrl(shop, item);

        let fetchResult = await fetch(url, {
            headers: {
                'authorization': this.accessToken,
                'glovo-location-city-code': 'DNP', //todo: get field from glovo
                'glovo-language-code': 'ru'
            }
        });
        let jsonWithResults = await fetchResult.json();

        if (jsonWithResults.error) {
            if (jsonWithResults.error.message) {
                console.log(jsonWithResults.error.message);
            }
            else console.log("Some error from server")
        }

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

    async sendOrder(fieldsToSend) {
        let bodyToSendTheOrder = {
            "points": [
                {
                    "address": fieldsToSend.address,
                    "type": "DELIVERY"
                }
            ],
            "scheduledTime": null,
            "type": "Order",
            "subtype": "PURCHASE",
            "cityCode": "DNP",
            "origin": "STORES",
            "legalCheckboxAccepted": false,
            "agreedToShareData": false,
            "cutleryRequested": null,
            "paymentMethod": fieldsToSend.paymentMethod,
            "products": fieldsToSend.products,
            "storeAddressId": fieldsToSend.storeAddressId
        };
        let res = bodyToSendTheOrder;
        //coordinates and timestamp //24
        /*let response = await fetch('https://api.glovoapp.com/v3/checkouts/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': 123,//this.accessToken,
                'glovo-app-version': '7',
                'glovo-api-version': '13',
                'glovo-device-id': '97548324',
                'Glovo-Delivery-Location-Latitude': fieldsToSend.address.latitude,
                'Glovo-Delivery-Location-Longitude': fieldsToSend.address.longitude,
                'Glovo-Delivery-Location-Timestamp':,
                'Glovo-Language-Code': 'ru',
                'Glovo-Location-City-Code': 'DNP'

            },
            body: JSON.stringify(bodyToSendTheOrder)
        });
        resultInText = await response.text();
        result = await JSON.parse(resultInText);
        */
    }
}

module.exports = GlovoAPI;