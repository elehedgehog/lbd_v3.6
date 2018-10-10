<template>
  <div class="loan-mask" v-show="isShow">
    <div class="loan-mask-popup">

      <h3>亲，还差一步就完成一哦~</h3>
      <h3>确认要放弃吗？</h3>
      <div class="btn-box">
        <button @click="closePopup">再考虑一下</button>
        <button @click="closeConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props:{
      isShow:false
    },
    computed: {},
    methods: {
      closePopup(){
        // console.log('点击了再考虑一下');
        this.$emit('closePopup',0);
      },
      closeConfirm(){
        // console.log('点击了确认');
        this.$emit('closePopup',1);
      }
    },
    created() {
    },
    mounted() {
    },
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

  .loan-mask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    background-color: rgba(0,0,0,.1);
  }
  .loan-mask-popup{
    position: absolute;
    width: 85%;
    /*min-height: 46%;*/

    top: 50%;
    left: 50%;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -o-border-radius: 5px;
    -ms--radius: 5px;
    background-size: 100% 100%;
    padding: 1.4rem .5rem .2rem;
    background: #ffffff url("../assets/img/detinmentPopupBg.png") no-repeat;
    background-size:100%;
  }
  h3{
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    font-size:.5rem;
    color: #ffffff;
    padding: 0;
    margin: 0 auto;
    text-align: center;
  }
  .btn-box{
    width: 80%;
    margin: 2.8rem auto .2rem;
    button{
      width: 100%;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      height: 1rem;
      background: #FFA800;
      color: #ffffff;
      font-size:.45rem;
    }
    button:last-child{
      background-color: transparent;
      color: #999999;
      margin-top: .2rem;
    }
  }
</style>
