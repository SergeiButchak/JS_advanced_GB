const search = Vue.component('search-input', {
    props: ['goods'],
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
            this.goods.filterGoods(value);
        }
    }

});

export default {
    search: search
}
