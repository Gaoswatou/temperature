import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Mint from "bh-mint-ui2";
import "bh-mint-ui2/lib/style.css";
import Vant from "vant";
import "vant/lib/index.css";
import moment from "moment";
import axios from "axios";
import { Toast } from "vant";

Vue.use(Mint);
Vue.use(Vant);
Vue.use(Toast);

let toast;

axios.defaults.baseURL = "http://127.0.0.1/dtm/";
//请求拦截器
axios.interceptors.request.use(
  function(config) {
    toast = Toast.loading({
      forbidClick: true,
      overlay: true
    });
    // let token = window.localStorage.getItem("token");
    let token = "123";
    if (token) {
      config.headers["X-Access-Token"] = token;
    }
    // toast = Vue.prototype.$toast({
    //   type: "loading",
    //   duration: 0, // 持续展示 toast
    //   forbidClick: true
    // });
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

//响应拦截器
axios.interceptors.response.use(
  function(config) {
    // 对响应数据做点什么
    setTimeout(() => {
      toast.clear();
    }, 800);
    return config;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
