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
            let divForProductOptionWraper = document.createElement('div');
            let leftArrow = document.createElement('a');
            let rightArrow = document.createElement('a');

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

            divForProductOptionWraper.className = "slider";

            divForProductOption.className = "divForOneProductOption slider__wrapper";
            let productOptionsDiv = divForProductOption.id = "productOptions" + oneListItem.numb;

            divForItem.className = "divForOneItem";

            let divForItemId = divForItem.id = "divForItem" + oneListItem.numb;
            varus.type = "button";
            let varusValue = varus.value = "varus";
            varus.onclick = () => { getProductOptions(varusValue, itemId, productOptionsDiv, divForItemId) };

            ashan.type = "button";
            let ashanValue = ashan.value = "ashan";
            ashan.onclick = () => { getProductOptions(ashanValue, itemId, productOptionsDiv, divForItemId) };

            metro.type = "button";
            let metroValue = metro.value = "metro";
            metro.onclick = () => { getProductOptions(metroValue, itemId, productOptionsDiv, divForItemId) };

            leftArrow.className = "slider__control slider__control_left";
            leftArrow.href = "#";
            leftArrow.role = "button";

            rightArrow.className = "slider__control slider__control_right slider__control_show";
            rightArrow.href = "#";
            rightArrow.role = "button";

            divForItem.append(pForItem);
            divForItem.append(varus);
            divForItem.append(ashan);
            divForItem.append(metro);
            divForItem.append(divForProductOptionWraper);
            divForProductOptionWraper.append(divForProductOption);
            divForProductOptionWraper.append(leftArrow);
            divForProductOptionWraper.append(rightArrow);
            p[0].append(divForItem);
        });

        let makeAnOrderBlock = document.getElementById("makeAnOrder");

        let p = document.createElement('p');
        let input = document.createElement('input');
        input.type = "submit";
        input.value = "Delete";
        input.id = "deleteBttn";
        input.onclick = deleteFunction;
        makeAnOrderBlock.append(input);

        let orderBttn = document.createElement('input');
        orderBttn.type = "submit";
        orderBttn.value = "Create order";
        orderBttn.id = "orderBttn";
        orderBttn.onclick = createOrder;
        makeAnOrderBlock.append(orderBttn);

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



async function getProductOptions(store, itemId, productOptionsDiv, divForItemId) {
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

    let idCounter = 0;
    jsonWithResults.map(oneOfItem => {
        let divForOne = document.getElementById(productOptionsDiv);

        let divForInfoAboutOneItem = document.createElement('div');
        divForInfoAboutOneItem.className = "divForInfoAboutOneItem slider__item";

        let divForInfoAboutOneItemId = divForInfoAboutOneItem.id = "divForInfoAboutOneItem" + idCounter + "_" + divForItemId;
        divForOne.append(divForInfoAboutOneItem);

        let imgOfProduct = document.createElement('img');
        imgOfProduct.className = "imgOfProduct";
        let imgOfProductId = imgOfProduct.id = "imgOfProduct" + idCounter;
        divForInfoAboutOneItem.append(imgOfProduct);

        let nameOfProduct = document.createElement('p');
        nameOfProduct.className = "nameOfProduct";
        let nameOfProductId = nameOfProduct.id = "nameOfProduct" + idCounter + "_" + divForInfoAboutOneItemId;
        divForInfoAboutOneItem.append(nameOfProduct);

        let priceOfProduct = document.createElement('p');
        priceOfProduct.className = "priceOfProduct";
        let priceOfProductId = priceOfProduct.id = "priceOfProduct" + idCounter;
        divForInfoAboutOneItem.append(priceOfProduct);

        divForInfoAboutOneItem.onclick = () => { chooseProduct(divForInfoAboutOneItemId, nameOfProductId, oneOfItem.id, oneOfItem.price) };

        let product = document.querySelector('#' + productOptionsDiv + ' #' + nameOfProductId);
        product.innerText = oneOfItem.name;
        document.querySelector('#' + productOptionsDiv + ' #' + priceOfProductId).innerText = oneOfItem.price;
        let img = document.querySelector('#' + productOptionsDiv + ' #' + imgOfProductId);
        img.src = oneOfItem.imageUrl;
        idCounter++;
    });

    const multiItemSlider = (function () {
        return function (selector, neededParent) {
            const parent = document.getElementById(neededParent);
            const
                _mainElement = parent.querySelector(selector),
                _sliderWrapper = _mainElement.querySelector('.slider__wrapper'),
                _sliderItems = _mainElement.querySelectorAll('.slider__item'),
                _sliderControls = _mainElement.querySelectorAll('.slider__control'),
                _sliderControlLeft = _mainElement.querySelector('.slider__control_left'),
                _sliderControlRight = _mainElement.querySelector('.slider__control_right'),
                _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
                _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
            let _positionLeftItem = 0,
                _transform = 0;
            const _step = _itemWidth / _wrapperWidth * 100,
                _items = [];
            _sliderItems.forEach(function (item, index) {
                _items.push({ item: item, position: index, transform: 0 });
            });
            const position = {
                getMin: 0,
                getMax: _items.length - 1,
            }
            const _transformItem = function (direction) {
                if (direction === 'right') {
                    if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                        return;
                    }
                    if (!_sliderControlLeft.classList.contains('slider__control_show')) {
                        _sliderControlLeft.classList.add('slider__control_show');
                    }
                    if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                        _sliderControlRight.classList.remove('slider__control_show');
                    }
                    _positionLeftItem++;
                    _transform -= _step;
                }
                if (direction === 'left') {
                    if (_positionLeftItem <= position.getMin) {
                        return;
                    }
                    if (!_sliderControlRight.classList.contains('slider__control_show')) {
                        _sliderControlRight.classList.add('slider__control_show');
                    }
                    if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
                        _sliderControlLeft.classList.remove('slider__control_show');
                    }
                    _positionLeftItem--;
                    _transform += _step;
                }
                _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
            }
            const _controlClick = function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    const direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                    _transformItem(direction);
                }
            };
            const _setUpListeners = function () {
                _sliderControls.forEach(function (item) {
                    item.addEventListener('click', _controlClick);
                });
            }
            _setUpListeners();
            return {
                right: function () {
                    _transformItem('right');
                },
                left: function () {
                    _transformItem('left');
                }
            }
        }
    }());

    multiItemSlider('.slider', divForItemId);
}

let arrayOfSelectedItems = [];
const chooseProduct = (productDivId, nameOfProductId, productId, productPrice) => {
    let productName = document.getElementById(nameOfProductId).innerText;
    console.log(productName);
    console.log(productId);

    let element = document.getElementById(productDivId);
    element.style.background = "green";
    let nameAndPriceObj = {};
    nameAndPriceObj.id = productId;
    nameAndPriceObj.price = productPrice;

    arrayOfSelectedItems.push(nameAndPriceObj);
}

const createOrder = () => {

    const calculatePrice = () => {
        let totalAmount = null;
        arrayOfSelectedItems.map(nameAndNameObj => {
            totalAmount += nameAndNameObj.price;
        });
        console.log("totalAmount");
        console.log(Math.round(totalAmount));
        return Math.round(totalAmount);
    }

    const getIdOfProductForOrder = () => {
        let productId = [];
        arrayOfSelectedItems.map(nameAndNameObj => {
            let idAndQuantity = {
                "id": nameAndNameObj.id,
                "quantity": 1
            }
            productId.push(idAndQuantity);
        });
        return productId;
    }

    const generateDataForRequest = () => {
        //todo: address - should be taken from the response of the request
        let address = {
            "label": "ж/м Сокол-1",
            "latitude": 48.413933,
            "longitude": 35.044598,
            "details": "дом 1, корпус 1, подъезд 2, встречу курьера у подъезда",
            "customFields": null
        }
        //todo: paymentMethod - payment type selection 
        //todo: amount - sum + 60 доставка - если с ПК 
        let paymentMethod = {
            "type": "Cash",
            "amount": calculatePrice()
        }
        let products = getIdOfProductForOrder();
        let storeAddressId = 165396;

        let resultObject = {};
        resultObject.agreedToShareData = false;
        resultObject.cityCode = "DNP";
        resultObject.cutleryRequested = null;
        resultObject.legalCheckboxAccepted = false;
        resultObject.origin = "STORES";
        resultObject.paymentMethod = paymentMethod;
        resultObject.points = [{ address: address, type: "DELIVERY" }];
        resultObject.products = products;
        resultObject.scheduledTime = null;
        resultObject.storeAddressId = storeAddressId;
        resultObject.subtype = "PURCHASE";
        resultObject.type = "Order";

        return resultObject;
    }

    async function orderCreator() {
        let requestData = generateDataForRequest();
        console.log('requestData');
        console.log(requestData);

        //- console.log('arrayOfSelectedItems');
        //- console.log(arrayOfSelectedItems);
        //- let orderOptions = await fetch('/api/order', {//api.glovoapp.com/v3/checkouts/order
        //-     method: 'POST',
        //-     headers: {
        //-         'Content-Type': 'application/json',
        //-         'Accept': 'application/json'
        //-     },
        //-     body: JSON.stringify(requestData)//arrayOfSelectedItems
        //- });
        //- let a = await orderOptions.text();
        //- console.log(a);

        //let jsonWithResults = await orderOptions.json();
        // console.log('jsonWithResults');
        //console.log(jsonWithResults);
    }
    orderCreator();

}
