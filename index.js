import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const api = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'qian14';

const productModal = {
    // 當 id 「變動」(使用 change 監聽)時，取得遠端資料，並呈現 Modal
    props: ['id', 'addToCart'],
    data() {
        return {
            modal: {},
            tempProduct: {},
            qty: 1 // 加入購物車預設值訂為 1 
        };
    },
    template: '#userProductModal',
    // 使用 watch 監聽，當 id 變動時，取得遠端特定產品資料，並呈現 Modal
    watch: {
        id() {
            console.log('productModal:', this.id);
            axios
                .get(`${api}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    console.log('單一產品', res.data.product);
                    this.tempProduct = res.data.product;
                    this.modal.show();
                });
        }
    },
    methods: {
        hide() {
            this.modal.hide();
            this.qty = 1;
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
};

const app = createApp({
    data() {
        return {
            products: [],
            productId: '',
        }
    },
    methods: {
        getProducts() {
            axios
                .get(`${api}/api/${apiPath}/products/all`)
                .then(res => {
                    console.log('產品列表', res.data.products);
                    this.products = res.data.products;
                });
        },
        openModal(id) {
            this.productId = id;
            console.log('外層帶 productId:', id);
        },
        addToCart(product_id, qty = 1) { // 當沒有傳入該參數時，會使用預設值
            const data = { //縮寫寫法 (同名時)
                product_id,
                qty
            };
            axios
                .post(`${api}/api/${apiPath}/cart`, { data })
                .then(res => {
                    console.log('加入購物車', res.data);
                    this.$refs.productModal.hide();
                });
        }
    },
    components: {
        productModal,
    },
    mounted() {
        this.getProducts();
    }
});

app.mount('#app');