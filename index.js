import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const api = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'qian14';

const productModal = {
    // 當 id 「變動」(使用 change 監聽)時，取得遠端資料，並呈現 Modal
    props: ['id', 'addToCart', 'openModal'],
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
            // console.log('productModal:', this.id);
            if(this.id) {
               axios
                .get(`${api}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    // console.log('單一產品', res.data.product);
                    this.tempProduct = res.data.product;
                    this.modal.show();
                }); 
            }
            
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
        // 監聽 DOM，當 Modal 關閉時，要做...
        this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
            // console.log("Modal 被關閉了");
            this.openModal(''); //改 ID
        })
    }
};

const app = createApp({
    data() {
        return {
            products: [],
            productId: '',
            cart: '',
            loadingItem: ''
        }
    },
    methods: {
        // 取得產品列表
        getProducts() {
            axios
                .get(`${api}/api/${apiPath}/products/all`)
                .then(res => {
                    // console.log('產品列表', res.data.products);
                    this.products = res.data.products;
                });
        },
        // 產品細節 modal
        openModal(id) {
            this.productId = id;
            // console.log('外層帶 productId:', id);
        },
        // 加入購物車
        addToCart(product_id, qty = 1) { // 當沒有傳入該參數時，會使用預設值
            const data = { //縮寫寫法 (同名時)
                product_id,
                qty
            };
            axios
                .post(`${api}/api/${apiPath}/cart`, { data })
                .then(res => {
                    alert("成功加入購物車～")
                    // console.log('加入購物車', res.data);
                    this.$refs.productModal.hide();
                    this.getCarts();
                });
        },
        // 修改購物車
        updateCartItem(item) { //購物車 id、產品的 id
            const data = {
                product_id: item.product.id,
                qty: item.qty
            };
            // console.log(data, item.id);
            this.loadingItem = item.id
            axios
                .put(`${api}/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    // console.log('更新購物車', res.data);
                    alert(res.data.message);
                    this.getCarts();
                    this.loadingItem = '';
                });
        },
        // 刪除購物車項目
        deleteCartItem(item) {
            axios
                .delete(`${api}/api/${apiPath}/cart/${item.id}`)
                .then(res => {
                    // console.log('刪除購物車', res.data);
                    alert(res.data.message);
                    this.getCarts();
                    this.loadingItem = ''
                });
        },
        // 刪除所有購物車項目
        deleteCarts(item){
            axios
                .delete(`${api}/api/${apiPath}/carts`)
                .then(res => {
                    // console.log('刪除購物車', res.data);
                    alert(res.data.message);
                    this.getCarts();
                });
        },
        // 取得購物車列表
        getCarts() {
            axios
                .get(`${api}/api/${apiPath}/cart`)
                .then(res => {
                    // console.log('購物車', res.data.data);
                    this.cart = res.data.data;
                });
        }
    },
    components: {
        productModal,
    },
    mounted() {
        this.getProducts();
        this.getCarts();
    }
});

app.mount('#app');