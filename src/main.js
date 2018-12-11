import Vue from 'vue'
import ElementUI from 'element-ui'
import httpPlugin from '@/common/js/http'
import store from './vuex/store'
import Vuex from 'vuex'
import './styles/reset.less'
import '@/styles/common.less'
import '@/assets/theme/index.css'
import '@/assets/fonts/iconfont/iconfont.css'
import VueClipboard from 'vue-clipboard2'
import util from "./common/js/util.js"; 
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import 'babel-polyfill'
import VueMoment from 'vue-moment'
 
Vue.use(VueMoment)



Vue.config.productionTip=false;
Vue.use(VueClipboard)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(httpPlugin)



//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes,
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = util.getCookie("gTicket");
    if (cval != null)
      document.cookie =
        "gTicket =" + cval + ";expires=" + exp.toGMTString();
  }
  let gTicket ="";
  var reg = new RegExp('(^| )' + 'gTicket' + '=([^;]*)(;|$)');
  var arr = document.cookie.match(reg)
  if (arr) {
    gTicket = arr[2]
  }
  if (!gTicket && to.path != '/') {
    next({ path: '/' })
  } else {
    next()
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

