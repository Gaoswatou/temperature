import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Mint from "bh-mint-ui2";
import "bh-mint-ui2/lib/style.css";
import Vant from "vant";
import "vant/lib/index.css";
import moment from "moment-timezone";
import axios from "axios";
import { Toast } from "vant";

// 将时区设置成亚洲上海
moment.tz.setDefault("Asia/Shanghai");
Vue.use(Mint);
Vue.use(Vant);
Vue.use(Toast);

let toast;

// axios.defaults.baseURL = "https://micro-app.xmmc.edu.cn/dtm/";
// axios.defaults.baseURL = "https://micro-app-test.xmmc.edu.cn/dtm/";
axios.defaults.baseURL = "http://localhost:8080/dtm/";
//请求拦截器
axios.interceptors.request.use(
  function(config) {
    if (config.showLoad) {
      toast = Toast.loading({
        forbidClick: true,
        overlay: true
      });
    }

    let token = window.localStorage.getItem("token");
    if (token && config.url.indexOf("mLogin") === -1) {
      config.headers["X-Access-Token"] = token;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

//响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    toast && toast.clear();
    if (res.data.code == "200") {
      return res.data.result;
    } else {
      Toast.fail(res.data.message);
      return Promise.reject(res.data.message);
    }
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
