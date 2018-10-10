// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import './assets/style/my-mint.css'; // 用户覆盖全局mintui样式

import { Swipe, SwipeItem, Checklist } from 'mint-ui';
import axios from 'axios';//引入文件

import qs from 'qs'
import lbdUtil from './utils/util'
import 'babel-polyfill'
import fastclick from 'fastclick'


Vue.use(MintUI)
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Checklist.name, Checklist);
FastClick.attach(document.body)
Vue.prototype.$http = axios;//将axios挂载到Vue实例中的$ajax上面,在项目中的任何位置通过this.$http使用
axios.defaults.timeout = 10000;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.$qs = qs;
Vue.prototype.lbdUtil = lbdUtil;//自定义工具类
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.prototype.adroideF = function (){
  window.javaScriptFunction.checkIdCard();
}
fastclick.attach(document.body) //初始化FastClick实例。在页面的DOM文档加载完成后


