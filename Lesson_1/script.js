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
        makeGETRequest(`${API_URL}/getBasket.json`).then(
            (response) => {
                let list = response.contents;
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
        makeGETRequest(`${API_URL}/catalogData.json`).then(
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

Vue.component('goods-list', {
    props: ['goods'],
    template: `
    <div class="goods-list">
      <goods-item v-for="good in goods" :good="good" v-bind:key="good.id">
      {{good}}
</goods-item>
    </div>
  `

});

Vue.component('goods-item', {
    props: ['good'],
    template: `
    <div class="goods-item">
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}</p>
    </div>
  `
});

Vue.component('basket-list', {
    props: ['goods'],
    template: `
    <div class="basket-list">
      <basket-item v-for="good in goods" :good="good" v-bind:key="good.id"></basket-item>
    </div>
  `
});

Vue.component('basket-item', {
    props: ['good'],
    template: `
    <div class="basket-item">
      <h3>{{ good.goodsItem.product_name }}</h3>
      <p>Количество: {{good.count}}</p>
      <p>Всего: {{good.total()}}</p>
    </div>
  `
});

Vue.component('search-input', {
    data() {
        return {
            searchLine: ''
        }
    },
    template: `
        <span class="search">
            <input class="search-input" type="text" v-model="searchLine">
            <button class="search-button" @click="clickSearch">Искать</button>
        </span>
    `,
    methods: {
        clickSearch() {
            const value = this.searchLine;
            goodsList.filterGoods(value);
        }
    }

});

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