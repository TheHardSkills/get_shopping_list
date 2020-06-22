const listBttn = document.getElementById('showListBttn');

const temporaryDiv = document.createElement('div');
document.body.className = "preloaderGif";

fetch('http://localhost:3000/getList', { //todo: relative path
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
    .then(response => response.json())
    .then(allListItems => {
        allListItems.map(oneListItem => {
            document.body.className = "body";
            let p = document.getElementsByClassName("listItemsData");
            let divForItem = document.createElement('div');
            let divForProductOption = document.createElement('div');

            let pForItem = document.createElement('p');
            let br = document.createElement('br');

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

            varus.id = "varus" + oneListItem.numb;
            ashan.id = "ashan" + oneListItem.numb;
            metro.id = "metro" + oneListItem.numb;

            divForProductOption.className = "divForOneProductOption ";
            let productOptionsDiv = divForProductOption.id = "productOptions" + oneListItem.numb;

            varus.type = "button";
            let varusValue = varus.value = "varus";
            varus.id = "varusStore";
            varus.visibility = "hidden";
            varus.onclick = () => { getNameOfTheStore(varusValue, itemId, productOptionsDiv) };

            ashan.type = "button";
            let ashanValue = ashan.value = "ashan";
            ashan.id = "ashanStore";
            ashan.onclick = () => { getNameOfTheStore(ashanValue, itemId, productOptionsDiv) };

            metro.type = "button";
            let metroValue = metro.value = "metro";
            metro.id = "metroStore";
            metro.onclick = () => { getNameOfTheStore(metroValue, itemId, productOptionsDiv) };

            divForItem.className = "divForOneItem";

            divForItem.append(pForItem);
            divForItem.append(varus);
            divForItem.append(ashan);
            divForItem.append(metro);
            divForItem.append(divForProductOption);
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

async function getNameOfTheStore(store, itemId, productOptionsDiv) {
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

    let imgId = 0; //todo: change name
    jsonWithResults.map(oneOfItem => {
        let divForOne = document.getElementById(productOptionsDiv);

        let divForInfoAboutOneItem = document.createElement('div');
        divForInfoAboutOneItem.className = "divForInfoAboutOneItem ";

        let divForInfoAboutOneItemId = divForInfoAboutOneItem.id = "divForInfoAboutOneItem" + imgId;
        divForOne.append(divForInfoAboutOneItem);

        //let divForInfoAboutOneItem = document.getElementById(divForInfoAboutOneItemId);
        let imgOfProduct = document.createElement('img');
        imgOfProduct.className = "imgOfProduct";
        let imgOfProductId = imgOfProduct.id = "imgOfProduct" + imgId;
        divForInfoAboutOneItem.append(imgOfProduct);

        let nameOfProduct = document.createElement('p');
        nameOfProduct.className = "nameOfProduct";
        let nameOfProductId = nameOfProduct.id = "nameOfProduct" + imgId;
        divForInfoAboutOneItem.append(nameOfProduct);

        let priceOfProduct = document.createElement('p');
        priceOfProduct.className = "priceOfProduct";
        let priceOfProductId = priceOfProduct.id = "priceOfProduct" + imgId;
        divForInfoAboutOneItem.append(priceOfProduct);
        divForInfoAboutOneItem.onclick = () => { chooseProduct(divForInfoAboutOneItemId, nameOfProductId) };

        let product = document.getElementById(nameOfProductId);
        product.innerText = oneOfItem.name;
        document.getElementById(priceOfProductId).innerText = oneOfItem.price;
        let img = document.getElementById(imgOfProductId);
        img.src = oneOfItem.imageUrl;
        imgId++;
    });
}

const chooseProduct = (productId, nameOfProductId) => {
    let product = document.getElementById(nameOfProductId).innerText;
    console.log(product);
}
