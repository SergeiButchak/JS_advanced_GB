const basket_list = Vue.component('basket-list', {
    props: ['goods'],
    template: `
    <div class="basket-list">
      <basket-item v-for="good in goods.goods" :good="good" :basket="goods" v-bind:key="good.id"></basket-item>
    </div>
  `
});

Vue.component('basket-item', {
    props: ['good', 'basket'],
    template: `
    <div class="basket-item">
      <h3>{{ good.goodsItem.product_name }}</h3>
      <p>Количество: {{good.count}}</p>
      <p>Всего: {{good.total()}}</p>
      <button v-on:click="basket.removeGood(good.goodsItem.product_name)">Удалить из корзину</button>
    </div>
  `
});

export default {
    basket: basket_list
}
