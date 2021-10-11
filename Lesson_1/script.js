// const goods = [
//     { title: 'Shirt', price: 150 },
//     { title: 'Socks', price: 50 },
//     { title: 'Jacket', price: 350 },
//     { title: 'Shoes', price: 250 },
// ];
//
//
// const $goodsList = document.querySelector('.goods-list');
//
// const renderGoodsItem = ({ title='New good', price = 0 }) => {
//     return `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;
// };
//
// const renderGoodsList = (list = goods) => {
//     let goodsList = list.map(
//             item => renderGoodsItem(item)
//         ).join(' ');
//
//     $goodsList.insertAdjacentHTML('beforeend', goodsList);
// }
//
// renderGoodsList();
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

function makeGETRequest(url, callback) {
    return new Promise((resolve, reject) => {
        let xhr = (window.XMLHttpRequest) ?
            new XMLHttpRequest() :
            new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = () => {
            if (+xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(xhr.statusText)
            }
        }
    });
}

class GoodsItem {
    constructor(product_name, price) {
        this.product_name = product_name;
        this.price = price;
    }

    render() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
    }
}

class BasketItem {
    constructor(GoodsItem, count) {
        this.goodsItem = GoodsItem;
        this.count = count;
    }

    addCount(count) {
        this.count += count;
    }

    removeCount(count) {
        if (this.count > count) {
            this.count -= count;
        } else {
            this.count = 0;
        }
    }

    total() {
        return this.goodsItem.price * this.count;
    }
}

class BasketList {
    constructor() {
        this.goods = [];
    }

    getBasket() {
        makeGETRequest(`${API_URL}/getBasket.json`).then(
            (response) => {
                this.goods = response.contents;
                //this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    addGood(GoodsItem, count) {
        makeGETRequest(`${API_URL}/addToBasket.json`).then(
            (response) => {
                console.log("TODO addGood")
                //this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    removeGood(GoodsItem, count) {
        makeGETRequest(`${API_URL}/deleteFromBasket.json`).then(
            (response) => {
                console.log("TODO removeGood")
                //this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }


    totalCount() {
        let sum = 0;
        for(let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].count;
        }
        return sum;
    }

    totalSum() {
        let sum = 0;
        for(let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].total();
        }
        return sum;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods(cb) {
        makeGETRequest(`${API_URL}/catalogData.json`).then(
            (response) => {
                this.goods = response;
                this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    totalSum() {
        let sum = 0;
        for(let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].price;
        }
        return sum;
    }

    render() {
        let listHtml = '';
        console.log(this.goods)
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price);
            listHtml += goodItem.render();
            console.log(good)
        });
        // console.log(listHtml)
        document.querySelector('.goods-list').innerHTML = listHtml;
        // console.log(this.totalSum());
    }

}

const list = new GoodsList();
list.fetchGoods();
