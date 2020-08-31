const googleshoppinglist = require('./google-shopping-list/index');
const express = require('express');
const accessSettings = require('./settings.js');
const MongoClient = require('mongodb').MongoClient;
const GlovoAPI = require('./glovo_api_service.js');
const bodyParser = require('body-parser')

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

const glovoAPI = new GlovoAPI();
glovoAPI.loadRefreshTokenWithAutoupdate();

const app = express();
app.use(express.static('./public'));

app.get("/getList", function (request, response) {
    let exportSettings = {
        email: accessSettings.shoppingListCredentials.email,
        password: accessSettings.shoppingListCredentials.password
    };

    async function res1() {
        const creedsResult1 = await googleshoppinglist.openShoppingList(exportSettings);

        googleshoppinglist.getList(creedsResult1).then(result => {
            const countOfItemsInShoppingList = (Object.keys(result)).length;
            let countsOfKey = 1;
            let itemsArr = [];

            result.map(function (num) {
                let numb = countsOfKey;
                let name = num;
                countsOfKey++;
                itemsArr.push({ numb, name });
            });
            const itemsArrInJSON = JSON.stringify(itemsArr);
            response.send(itemsArrInJSON);
        });
    }
    res1();
});

app.get("/deleteList", function (request, response) {
    response.send("Delete it");
});

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("fooddb").collection("food");
    app.listen(3000, function () {
        console.log("Server started listening for requests on port 3000");
    });
});

app.get("/api/food", function (req, res) {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, food) {
        if (err) return console.log(err);
        res.send(food);
    });
});

app.get(`/api/searchItems`, function (req, res) {
    async function getVariants() {
        let shop = req.query.store;
        let searchWord = req.query.seachWord;
        let baseResult = await glovoAPI.getSearch(shop, searchWord);
        res.send(baseResult);
    }
    getVariants();
});
var jsonParser = bodyParser.json()
app.post(`/api/order`, jsonParser, function (req, res) {
    async function getOrder() {
        let someFieldsForCreateOrderRequest = req.body;
        let result = await glovoAPI.sendOrder(someFieldsForCreateOrderRequest);
        res.send(someFieldsForCreateOrderRequest);
    }
    getOrder();
});


/*process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});*/




