const goods_list = Vue.component('goods-list', {
    props: ['goods', 'basket'],
    template: `
    <div class="goods-list">
      <goods-item v-for="good in goods" :good="good"  :basket="basket" v-bind:key="good.id">
      {{good}}
</goods-item>
    </div>
  `

});

Vue.component('goods-item', {
    props: ['good', 'basket'],
    template: `
    <div class="goods-item">
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}</p>
      <button v-on:click="basket.addGood(good, 1)">Добавить в корзину</button>
    </div>
  `
});

export default {
    goods: goods_list
}
