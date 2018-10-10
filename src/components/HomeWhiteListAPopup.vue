<template>
  <div class="loan-mask" v-show="isShow" @click="closePopup">
    <div class="loan-mask-popup">
      <div class="title">放款总额组成</div>
      <p>您需具备{{popupADataInfo.needPoint}}诚信积分方可最终放款，当前诚信积分60，可通过购买商品获得{{popupADataInfo.gainPoint}}诚信积分。本次匹配商品为一视觉网站会员6个月（会员账号密码将在放款成功后5个工作日内通过短信发送至您的手机）</p>
      <ul>
        <li>
          <b>一视觉网站会员6个月</b>
          <span>{{popupADataInfo.gainPoint}}元</span>
        </li>
        <li>
          <b>到账金额</b>
          <span>{{popupADataInfo.accountMoney}}元</span>
        </li>
        <li>
          <b>总共</b>
          <span>{{popupADataInfo.loanMoney}}元</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    props:{
      isShow:false,
      popupADataInfo:{
        loanMoney: '',
        accountMoney:'',
        expireMoney: '',
        needPoint:'260',
        gainPoint:'200'
      }
    },
    computed: {},
    methods: {
      closePopup(){
        this.$emit('closePopup',false);
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
    z-index: 9989;
    background-color: rgba(0,0,0,.7);
  }
  .loan-mask-popup{
    position: absolute;
    width: 80%;
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
    /*background: #ffffff;*/
    color: #ffffff;
    padding: 0 .5rem;
    font-size:.38rem;
  }
  .title{
    height: 1.4rem;
    line-height: 1.4rem;
    text-align: center;
    font-size:.5rem;
  }
  p{
    /*font-size: .3rem;*/
    padding: .5rem 0;
    margin: 0;
    border-top: 1px solid #F0F0F0;
  }
  ul{
    padding-bottom: 1rem;
    li{
      height: 1rem;
      padding: .15rem 0;
      line-height: 1rem;
      border-top: 1px solid #ffffff;
      b{font-weight: 500;}
      span{float:right;}
    }
    li:first-child,
    li:last-child{

    }

  }
</style>
