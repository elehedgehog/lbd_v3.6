<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
// import { mobileManager } from './utils/WebInfo.js'
export default {
  name: 'App',
  created: function () {
    // mobileManager.tokenTimeOut()  //token过期
    console.log(11)
    // 定义html字体大小， 用于rem单位
    var html = document.documentElement || document.body;
    var hw = document.body.clientWidth || document .documentElement.clientWidth;
    if(hw > 750 ){
      hw = 750;
    }
    html.style.fontSize = hw/10 + 'px';
    window.onresize = function () {
      hw = document.body.clientWidth || document .documentElement.clientWidth;
      if(hw > 750 ){
        hw =750;
      }
      html.style.fontSize = hw/10 + 'px';
    }
  },
  data () {
    return {
      transitionName: 'slide-right'  // 默认动态路由变化为slide-right
    }
  },
  watch: {
    '$route' (to, from) {
    let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
    if(isBack) {
      this.transitionName = 'slide-right'
    } else {
      this.transitionName = 'slide-left'
    }
      this.$router.isBack = false
    }
  },
}
</script>

<style>
*{
  /* 禁止选中文字 */
  /*-webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;*/
  /* a标签灰色阴影 */
  /*-webkit-touch-callout: none;
  -webkit-text-size-adjust: none;
  -webkit-highlight: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);*/
}
body {
  margin: 0;
  background: #f1f3f7;
  font-size: 14px;
}
ol, ul{
  list-style: none;
}
dl, dt, dd, ul, ol{
  margin: 0;
  padding: 0;
}
a{
	text-decoration: none;
  color:#2c3e50;
}
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

.Router {
  position: absolute;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  background: #f1f3f7;
  transition: all .3s ease;
  top: 0;
}

.slide-left-enter,
 .slide-right-leave-active {
  opacity: 1;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100% 0, 0);
}
</style>
