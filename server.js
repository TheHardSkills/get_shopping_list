const googleshoppinglist = require('./google-shopping-list/index');
const express = require('express');
const accessSettings = require('./public/settings.js');
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

const app = express();
app.use(express.static('./public'));

app.get("/getList", function (request, response) {
    let exportSettings = {
        email: accessSettings.email,
        password: accessSettings.password
    };

    async function res1() {
        const creedsResult1 = await googleshoppinglist.openShoppingList(exportSettings);

        googleshoppinglist.getList(creedsResult1).then(result => {
            const countOfItemsInShoppingList = (Object.keys(result)).length;
            console.log(countOfItemsInShoppingList);
            let countsOfKey = 1;
            let itemsArr = [];

            result.map(function (num) {
                let numb = countsOfKey;
                let name = num;
                countsOfKey++;
                console.log(num);
                console.log(typeof num);
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
        res.send(food)
    });
});

/*process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});*/




