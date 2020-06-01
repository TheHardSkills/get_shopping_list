const listBttn = document.getElementById('showListBttn');

listBttn.onclick = function () { //todo: es6 ()=>{}
    fetch('http://localhost:3000/getList', { //todo: relative path
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json()) //response reading method
        .then(allListItems => {
            allListItems.map(oneListItem => {
                let div = document.createElement('div');
                div.innerHTML = oneListItem.name;
                document.body.append(div);
                console.log(oneListItem);
            });
        });
}
