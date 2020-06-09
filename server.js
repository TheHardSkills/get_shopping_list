const googleshoppinglist = require('./google-shopping-list/index');
const express = require('express');
const accessSettings = require('./public/settings.js');

//Creating a server and displaying list items

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


app.listen(3000, "127.0.0.1", function () {
    console.log("Server started listening for requests on port 3000");
});

/***********************************************************************************/

/*
//Testing a method to remove items from a list

async function res() {
    let exportSettings = {
        email: accessSettings.email,
        password: accessSettings.password
    };

    const creedsResult1 = await googleshoppinglist.openShoppingList(exportSettings);
    const creedsResult2 = await googleshoppinglist.openShoppingList(exportSettings);

    const listRes = async function () {
        let shoppingListItems = [];
        await googleshoppinglist.getList(creedsResult1).then(result => {
            let countsOfKey = 1;
            let itemsArr = [];
            result.map(function (num) {
                let numb = countsOfKey;
                let name = num;
                countsOfKey++;
                itemsArr.push({ numb, name });
                shoppingListItems.push(num);
            });
        });
        return shoppingListItems;
    };

    const resultItems = await listRes();
    let arrayOfItemsToBeRemoved = ["Манго", "Молоко"];
    await googleshoppinglist.deleteListItems(creedsResult2, resultItems, arrayOfItemsToBeRemoved).then(result => {
        if (result === true) {
            console.log('Checked items are removed from the list');
        }
        else {
            console.log("Error deleting list items");
        }
    });
};
res();
*/


