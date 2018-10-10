<template>
  <div>
      <mt-header title="聚合开户" class="lbd-head-normal">
          <mt-button icon="back" slot="left" @click="back"></mt-button>
      </mt-header>
      <div class="NewPage" id="NewPage">
        <iframe id="iframe" :src="bindCardUrl"></iframe>
        <!-- <iframe id="iframe" src="https://www.baidu.com/?tn=94855285_hao_pg"></iframe> -->
      </div>
  </div>
</template>
<script>
  import { mobileManager } from '../utils/WebInfo.js'
   export default {
      data(){
        return{
          bindCardUrl: '',

        }
      },
      created(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
      },
      mounted(){
        this.bindCardUrl = this.$route.params.bindCardData
      },
       methods:{
         back(){
           if(sessionStorage.type){
             mobileManager.refreshHomeUrl()//原生控制首页
           }
          //  this.$router.goBack('Order')
          let params  = this.$route.query;
          this.$router.push({ name: 'Order', params: {}, query: params})
         }
       }
  }
</script>
<style lang="less" scoped>
	@w:75rem;
  .NewPage{
    width: 100%;
    position: absolute;
    top: 44px;
    min-height: calc(~"100% - 44px");
    /* padding-top: 44px; */
    height: 100%;
    box-sizing: border-box;
  }
  iframe{
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    // padding-top: 40/@w;
  }
  .Router{
    display: flex;
    flex-direction: row;
    background: #fff;
  }
</style>

