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

    render() {
        return `<div class="basket-item"><h3>${this.goodsItem.product_name}</h3><p>Количество: ${this.count}</p><p>Всего: ${this.total()}</p></div>`;
    }

}

class BasketList {
    constructor() {
        this.goods = [];
    }

    getBasket() {
        makeGETRequest(`${API_URL}/getBasket.json`).then(
            (response) => {
                let list = response.contents;
                list.forEach(item => {
                    this.goods.push(new BasketItem(new GoodsItem(item.product_name, item.price), item.quantity))
                })
                this.render()
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

    render() {
        let listHtml = '';

        this.goods.forEach(good => {
            const goodItem = new BasketItem(good.goodsItem, good.count);
            listHtml += goodItem.render();
            console.log(good)
        });
        console.log(listHtml)
        document.querySelector('.basket-list').innerHTML = listHtml;
        // console.log(this.totalSum());
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
        for (let i = 0; i < this.goods.length; i++) {
            sum += this.goods[i].price;
        }
        return sum;
    }

    render(filter = '') {
        let listHtml = '';
        let filter_pattern = new RegExp(filter, 'i');
        console.log(this.goods)
        this.goods.forEach(good => {
            if (filter.length === 0 || good.product_name.search(filter_pattern) >= 0) {
                const goodItem = new GoodsItem(good.product_name, good.price);
                listHtml += goodItem.render();
            }
            // console.log(good)
        });
        console.log(listHtml)
        document.querySelector('.goods-list').innerHTML = listHtml;
        // console.log(this.totalSum());
    }

}

const goodsList = new GoodsList();
const basketList = new BasketList();

const app = new Vue({
    el: "#mainApp",
    data: {
        searchLine: '',
        goods: goodsList,
        basket: basketList,
        isVisibleCart: false
    },
    methods: {
        clickBasket() {
            this.isVisibleCart = !this.isVisibleCart;
            // if (this.isVisibleCart){
            //     setTimeout(this.basket.render()
            //     , (1000));
            //     }
            console.log(this.isVisibleCart);
        },
        searchGood() {
            this.goods.render(this.searchLine)
        }
    },
    mounted() {
        console.log(this.searchLine);
        this.goods.fetchGoods();
        this.basket.getBasket();
    }
});

console.log(app)