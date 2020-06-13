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
            let detailsButton = document.createElement('input');

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

            detailsButton.type = "button";
            detailsButton.value = "Variant";
            detailsButton.onclick = () => { getOptions(itemId) };

            divForItem.className = "divForOneItem";
            divForItem.append(pForItem);
            divForItem.append(detailsButton);
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
    //now just displays the selected items to the console
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

const getOptions = (itemId) => {
    const value = document.getElementById(itemId).innerText;
    console.log(value);
}
