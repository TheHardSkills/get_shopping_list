const googleshoppinglist = require('google-shopping-list');
const express = require('express');
const accessSettings = require('./public/settings.js');

const app = express();
app.use(express.static('./public'));

app.get("/getList", function (request, response) {
    let exportSettings = {
        email: accessSettings.email,
        password: accessSettings.password
    };

    googleshoppinglist.getList(exportSettings).then(result => {
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
});


app.listen(3000, "127.0.0.1", function () {
    console.log("Server started listening for requests on port 3000");
});