// const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'
import goods from "./components/goods";
import basket from "./components/basket";
import search from "./components/search";

const API_URL = 'http://localhost:3000'
const goods_list = goods.goods;
const basket_list = basket.basket;
const search_input = search.search;

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

function makePOSTRequest(url, data, callback) {
    return new Promise((resolve, reject) => {
        let xhr = (window.XMLHttpRequest) ?
            new XMLHttpRequest() :
            new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(data);
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

    // render() {
    //     return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
    // }
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

    // render() {
    //     return `<div class="basket-item"><h3>${this.goodsItem.product_name}</h3><p>Количество: ${this.count}</p><p>Всего: ${this.total()}</p></div>`;
    // }

}

class BasketList {
    constructor() {
        this.goods = [];
    }

    getBasket() {
        makeGETRequest(`${API_URL}/cartData`).then(
            (response) => {
                let list = response;
                console.log(list);
                list.forEach(item => {
                    this.goods.push(new BasketItem(new GoodsItem(item.product_name, item.price), item.quantity))
                })
                // this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    addGood(Item, count) {
        makePOSTRequest(`${API_URL}/additem`, `{"product_name": "${Item.product_name}", "price": ${Item.price}, "quantity": ${count}}`).then(
            (response) => {
                console.log("TODO addGood")
                let list = response;
                console.log(list);
                this.goods = []
                list.forEach(item => {
                    this.goods.push(new BasketItem(new GoodsItem(item.product_name, item.price), item.quantity))
                })
                //this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    removeGood(productName) {
        makePOSTRequest(`${API_URL}/deleteitem`, `{"product_name": "${productName}"}`).then(
            (response) => {
                console.log("TODO addGood")
                let list = response;
                console.log(list);
                this.goods = []
                list.forEach(item => {
                    this.goods.push(new BasketItem(new GoodsItem(item.product_name, item.price), item.quantity))
                })
                //this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    totalCount() {
        let sum = 0;
        for (let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].count;
        }
        return sum;
    }

    totalSum() {
        let sum = 0;
        for (let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].total();
        }
        return sum;
    }

    // render() {
    //     let listHtml = '';
    //
    //     this.goods.forEach(good => {
    //         const goodItem = new BasketItem(good.goodsItem, good.count);
    //         listHtml += goodItem.render();
    //         console.log(good)
    //     });
    //     // console.log(listHtml)
    //     document.querySelector('.basket-list').innerHTML = listHtml;
    //     // console.log(this.totalSum());
    // }

}

class GoodsList {
    constructor() {
        this.goods = [];
        this.filteredGoods = this.goods;
    }

    filterGoods(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
        // this.render();
    }


    fetchGoods(cb) {
        makeGETRequest(`${API_URL}/catalogData`).then(
            (response) => {
                this.goods = response;
                this.filteredGoods = response;
                // this.render()
            },
            (error) => {
                console.log(error)
            }
        );
    }

    totalSum() {
        let sum = 0;
        for (let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].price;
        }
        return sum;
    }

    // render() {
    //     let listHtml = '';
    //     // console.log(this.goods)
    //     this.filteredGoods.forEach(good => {
    //         const goodItem = new GoodsItem(good.product_name, good.price);
    //         listHtml += goodItem.render();
    //
    //         // console.log(good)
    //     });
    //     // console.log(listHtml)
    //     document.querySelector('.goods-list').innerHTML = listHtml;
    //     // console.log(this.totalSum());
    // }

}

const goodsList = new GoodsList();
const basketList = new BasketList();

const app = new Vue({
    el: "#mainApp",
    data: {
        goods: goodsList,
        basket: basketList,
        isVisibleCart: false
    },
    methods: {
        clickBasket() {
            this.isVisibleCart = !this.isVisibleCart;
            // this.basket.render();
        },
    },
    mounted() {
        this.goods.fetchGoods();
        this.basket.getBasket();
    }
});

console.log(app)