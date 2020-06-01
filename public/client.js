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
            let div = document.createElement('div');
            div.className = "oneItem";
            div.innerHTML = oneListItem.numb;
            div.innerHTML += " " + oneListItem.name;
            document.body.append(div);
        });
    });
