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
        //-console.log(token);
        let accessToken = token.access.accessToken;
        //console.log(typeof accessToken);
        return accessToken;
    }
    async getRefreshToken() {
        const token = await this.getToken();
        let refreshToken = { 'refreshToken': token.access.refreshToken };

        let resultInText = '';
        let result = {};
        //setInterval(() => {
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

        //return result;
        //},1198);
        //-console.log('result');
        //-console.log(result);
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
        //console.log('selectedStore');
        //console.log(selectedStore);

        let stores = selectedStore.stores;
        let addresses = selectedStore.addresses;
        let url = `https://api.glovoapp.com/v3/stores/${stores}/addresses/${addresses}/search?query=${item}`;
        let encodedUrl = encodeURI(url);
        console.log("encodedUrl");
        console.log(encodedUrl);
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

        request({ //todo: fetch
            url: url,
            method: 'GET',
            headers: refreshAccessToken.headers
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                return null;
            } else {
                let arrOfName = [];
                const resp = response.body; //рассмотреть ответ - bad bad request
                const result = JSON.parse(resp);
                let error = result.error;
                //if error - обновить токен
                const resArr = result.results[0].products;


                resArr.map(nameOfProduct => {
                    arrOfName.push(nameOfProduct.name)
                });
                console.log("arrOfName");
                console.log(arrOfName);
                // app.get("/api/getproductoptiondata", function (req, res) {
                //     res.send(arrOfName);
                // });

            }
        });

    }
}

module.exports = GlovoAPI;