/*
 * Method to remove list items
 * Testing a method to remove items from a list
 * (from server.js)
 * for correct work need to add connections
 */

/*

//

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


