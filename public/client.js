const listBttn = document.getElementById('showListBttn');

const temporaryDiv = document.createElement('div');
document.body.className = "preloaderGif";

fetch('http://localhost:3000/getList', { //todo: relative path
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
    .then(response => response.json()) //response reading method
    .then(allListItems => {
        allListItems.map(oneListItem => {
            document.body.className = "body";
            let p = document.getElementsByClassName("listItemsData");
            let divForItem = document.createElement('div');
            let pForItem = document.createElement('p');
            let br = document.createElement('br');
            /*let detailsButton = document.createElement('input');*/

            let varus = document.createElement('input');
            let ashan = document.createElement('input');
            let metro = document.createElement('input');

            let input = document.createElement('input');
            input.type = "checkbox";
            input.value = oneListItem.name;
            input.className = "itemWithCheckbox";
            input.id = "getOptionsBttn";

            pForItem.className = "oneItemTest";
            pForItem.innerHTML = oneListItem.name;
            const itemId = pForItem.id = 'item' + oneListItem.numb;
            pForItem.append(input);
            pForItem.append(br);

            /*detailsButton.type = "button";
            detailsButton.value = "Variant";*/

            // let divId = divForItem.id = "divForOneItem" + oneListItem.numb;
            let varusId = varus.id = "varus" + oneListItem.numb;
            let ashanId = ashan.id = "ashan" + oneListItem.numb;
            let metroId = metro.id = "metro" + oneListItem.numb;

            /*detailsButton.onclick = () => { getOptions(itemId) };*/


            varus.type = "button";
            let varusValue = varus.value = "varus";
            varus.id = "varusStore";
            varus.visibility = "hidden";
            varus.onclick = () => { getNameOfTheStore(varusValue, itemId) };



            ashan.type = "button";
            let ashanValue = ashan.value = "ashan";
            ashan.id = "ashanStore";
            ashan.onclick = () => { getNameOfTheStore(ashanValue, itemId) };


            metro.type = "button";
            let metroValue = metro.value = "metro";
            metro.id = "metroStore";
            metro.onclick = () => { getNameOfTheStore(metroValue, itemId) };


            divForItem.className = "divForOneItem";

            divForItem.append(pForItem);
            /*divForItem.append(detailsButton);*/

            divForItem.append(varus);
            divForItem.append(ashan);
            divForItem.append(metro);

            p[0].append(divForItem);
        });
        let p = document.createElement('p');
        let input = document.createElement('input');
        input.type = "submit";
        input.value = "Delete";
        input.id = "deleteBttn";
        input.onclick = deleteFunction;
        p.append(input);
        document.body.append(p);
    });

const deleteFunction = () => {
    let checkedValue = [];
    const inputElements = document.getElementsByClassName('itemWithCheckbox');
    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].checked) {
            checkedValue.push(inputElements[i].value);
        }
    }
    console.log("checkedValue");
    console.log(checkedValue);
};

async function getNameOfTheStore (store, itemId){
    const value = document.getElementById(itemId).innerText;
    console.log(value);
    console.log(store);

    let itemOptions = await fetch(`/api/searchItems?store=${store}&seachWord=${value}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    let jsonWithResults = await itemOptions.json();
    console.log(jsonWithResults);
}

/*const getOptions = (itemId) => {
    const value = document.getElementById(itemId).innerText;
    console.log(value);
}*/


