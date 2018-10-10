<template>
  <div class="userB-shade" v-if="isShow">
    <div class="userB-shade-content" align="center">
      <div class="code-top">
        <span>银行卡验证信息已过期</span>
      </div>
      <p>该银行卡验证信息已过期</p>
      <p>请重新验证！</p>
      <button @click="closeBankPopup('1')">立即验证</button>
    </div>
    <div class="close-border">
      <em class="close-btn" @click="closeBankPopup('0')"></em>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bankMsgPopup",
    components: {},
    data() {
      return {
        codePop:true
      }
    },
    props: {
      isShow:false
    },
    computed: {},
    methods: {
      closeBankPopup(type){
        this.$emit('closeBankPopup',type)
      }
    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @w:72rem;
  .userB-shade{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0,0,0,.3);

    .userB-shade-content{
      width: 490/@w;
      height: 390/@w;
      border-radius: 20/@w;
      margin: 60% auto 0;
      background-color: #fff;
      .code-top{
        padding-top: 10/@w;
        margin-bottom: .5rem;
        height: 70/@w;
        line-height: 60/@w;
        font-size: 30/@w;
        background-color: #FFA800;
        color: #fff;
        border-top-left-radius: 20/@w;
        border-top-right-radius: 20/@w;
      }
      .code-content{
        margin: 20/@w 40/@w 0;
        font-size: 26/@w;
        text-align: left;
      }
      p{
        margin: .2rem 0;
      }

      button{
        border: none;
        outline: none;
        height: 64/@w;
        line-height: 64/@w;
        margin-top: 40/@w;
        width: 160/@w;
        background-color: #FFA800;
        color: #fff;
        border-radius: 10/@w;
        font-size: 28/@w;
      }
    }
    .close-border{
      width: 100%;
    }
    .close-btn{
      display: block;
      margin: 20/@w auto 0;
      width:80/@w;
      height: 80/@w;
      background-image: url(../assets/img/delete_card.png);
      background-repeat: no-repeat;
      background-size: 100%;
    }

  }
</style>
