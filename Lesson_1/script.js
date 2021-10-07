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

class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
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

    addGood(GoodsItem, count) {
        this.goods.add(new BasketItem(GoodsItem, count));
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

    fetchGoods() {
        this.goods = [
            {title: 'Shirt', price: 150},
            {title: 'Socks', price: 50},
            {title: 'Jacket', price: 350},
            {title: 'Shoes', price: 250},
        ];
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
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
        // console.log(this.totalSum());
    }

}

const list = new GoodsList();
list.fetchGoods();
list.render();