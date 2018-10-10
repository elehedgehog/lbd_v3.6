<template>
  <div>
      <mt-header title="选择银行卡" class="lbd-head-normal">
          <mt-button icon="back" slot="left" @click="back"></mt-button>
      </mt-header>
      <div class="selectBank-content" id="content">
        <div class="seletTitle">以下是您绑定的借记卡信息,请选择：</div>
        <div class="bankCardList">

          <div class="bankCardList-input-group">
            <div id="bankCardList" class="bankCardList">
              <ul>
                <li v-for="item in bankCardList" :key="item.id">
                  <span class="bankImg">
                    <img :src="`static/img/bank_icon/${item.bankCode}.png`" alt="">
                  </span>

                  <label>{{ item.bankName +'('+item.bankAccount+')' }}</label>
                  <span :class="['radioImg',{'on':item.id === radioCheck}]" @click="selectBankBtn(item)"><i></i></span>
                </li>

                <li @click="bindCardBtn">
                  <span class="bankImg"><img src="../assets/img/bankCard.png" alt=""></span>
                  <label>绑定银行卡</label>
                  <span class="rightIcon">
                    <img src="../assets/img/fdddds@2x.png">
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="submitBtn">
            <div class="submitBtn-text"  @click="confirmBandCard" v-if="isHaveBank">确认</div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
   import { Toast,Indicator } from 'mint-ui';
   import { mobileManager } from '../utils/WebInfo.js'
   export default {
      data(){
        return{
          radioCheck: '',
          bankCardList: [],
          bindCardData:{},
          bindCardType: '',
          isHaveBank: true,
          bankName: {},
          bankMsg: {},
          paramsAll: {},
          paramsAddObj: {},
        }
      },

      created() {
        mobileManager.hideBottomBar()   //隐藏原生底部栏
        mobileManager.enableRefresh(false)  //下拉刷新
        if(this.$route.params.pageType) {
           sessionStorage.setItem('pageType', this.$route.params.pageType)
        }
        this.$route.params.buriedPoint == 'quick' ?  mobileManager.buriedPoint('fastloan_band_cards')  :  mobileManager.buriedPoint('one_bank_cards') //埋点id

      },

      async mounted(){
        await this.getUserAccountList()
        let params  = this.$route.query;
        this.bindCardType = this.$route.params.type

      },

      methods:{
        back(){
          if(sessionStorage.pageType == 'HomeWhiteListA'){     //////////////////////跳转A类首页
            this.$router.push({ name: 'HomeWhiteListA',  params: this.paramsAll, query:this.$route.params })

          } else {
            this.$router.push({ name: 'BindCardConfirm',  params: this.paramsAll, query:this.$route.params })    //////////////////////跳转绑卡确认页面
          }
        },
        showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
        },
        selectBankBtn(key){   //选择银行

          this.radioCheck = this.radioCheck === key.id ? '' : key.id
        },

        getUserAccountList() {   //查询用户所有有效的银行卡列表数据
          let params  = this.$route.query;
          let webInfo = this.lbdUtil.getWebInfoObj();
          let parasObj = this.$qs.stringify(Object.assign(params,webInfo))
          Indicator.open({ spinnerType: 'fading-circle' });
          this.$http.post(
            this.lbdUtil.host + '/user/userAccount/queryUserAccountList',
            parasObj
            ).then((res) => {
              Indicator.close();
               if(res.data.status =="0000"){
                  this.bankCardList = res.data.data
                  if(sessionStorage.selectedId) {
                    this.radioCheck = sessionStorage.selectedId * 1  // *1字符串转为数字
                  } else {
                    this.radioCheck = this.bankCardList[0].id
                  }
                } else {
                  if(this.bankCardList) { //数据为空时
                    // this.showToast(res.data.msg)
                    this.isHaveBank = false
                  }
                }
            },(err)=>{
              this.showToast('网络出错');
              Indicator.close();
            });
        },


        confirmBandCard(){     //确认按钮
          if(!this.radioCheck){
            this.showToast('请选择银行卡')
            return
          }

          let params  = this.$route.query;
          let bankSelected = this.bankCardList.find(el => el.id === this.radioCheck);  //选中的银行
          if(bankSelected.id){
            sessionStorage.setItem('selectedId', bankSelected.id)
          }
          this.bankMsg = bankSelected
          let paramsTwo = {
            bankAccount: bankSelected.bankAccount,
            bankAddress: bankSelected.bankBranch,
            bankName: bankSelected.bankName,
            borrowOrderCode: bankSelected.borrowOrderCode,
            reservedMobile: bankSelected.reservedMobile,
            userAccountId:  bankSelected.id,
          }
          let paramsAdd = {
            bankAccount: bankSelected.bankAccount,
            bankAddress: bankSelected.bankBranch,
            bankName: bankSelected.bankName,
            borrowOrderCode: bankSelected.borrowOrderCode,
            reservedMobile: bankSelected.reservedMobile,
            userAccountId:  bankSelected.id,
            productCode:this.productCode,
            channelCode:this.channelCode,
            token:this.token,
            pageType:'HomeWhiteListA',
          }
          this.paramsAll =  Object.assign(paramsTwo, this.$route.query)
          this.paramsAddObj = paramsAdd
          // if(!bankSelected.bankBranch || !bankSelected.reservedMobile) {
          //   this.bankMsg.buriedPoint = this.$route.params.buriedPoint
          //   this.bankMsg.pageType = this.$route.params.pageType


          //   this.$router.push({ name: 'NoSenseBandCardA',  params: this.bankMsg, query: this.paramsAll })
          // } else {
            // 绑卡接口 判断有感 无感
            // this.getBindCard(paramsAll)
            this.getBindCard()
          // }
        },

        bindCardBtn(){     //绑定银行卡按钮 添加新银行卡
          let params  = this.$route.query;
          let type = this.$route.params
          type.buriedPoint = this.$route.params.buriedPoint
          this.bankMsg.pageType = this.$route.params.pageType
          let paramsAll =  Object.assign(type, this.bankMsg)
          this.$router.push({ name: 'NoSenseBandCardA', params: paramsAll, query: params })
        },

        getBindCard() {
          if(sessionStorage.pageType == 'HomeWhiteListA'){     //////////////////////跳转A类首页
          console.log(this.paramsThree)
            this.$router.push({ name: 'HomeWhiteListA',  params: this.paramsAddObj, query: this.$route.params})

          } else {
            this.$router.push({ name: 'BindCardConfirm',  params: this.paramsAddObj, query: this.$route.params})    //////////////////////跳转绑卡确认页面
          }
        },



      }
  }
</script>
<style lang="less" scoped>
	@w:75rem;
  .seletTitle{
    font-size: 32/@w;
    color: #686868;
    height: 100/@w;
    line-height: 100/@w;
    text-align: center;
    margin-top: 20/@w;
    background-color: #FFFFFF;
  }
  .bankCardList{
    margin-top: 20/@w;
    font-size: 17/@w;
    color: #555555;
    background-color: #FFFFFF;
    min-height: calc(~"100% - 60px");
    >ul{
      >li{
        position: relative;
        height: 120/@w;
        line-height: 120/@w;
        >span.bankImg{
            float: left;
            display: inline;
            width: 13%;
          >img{
            float: left;
            width: 60/@w;
            height: 60/@w;
            margin-left: 60/@w;
            margin-top: 30/@w;
          }
        }
        >label{
          float: left;
          width: 60%;
          margin-left: 40/@w;
          font-size: 32/@w;
        }
        >span.radioImg{
          float: right;
          width: 10%;
          margin-right: 40/@w;
          height: 120/@w;
          >i{
            margin-top: 40/@w;
            display: inline-block;
            width: 42/@w;
            height: 42/@w;
            border: 1px solid #EC7B28;
            border-radius: 100/@w;
            box-sizing: border-box;
          }
          &.on{
            >i{
              background-image: url(../assets/img/bank_radio2.png);
              background-repeat:no-repeat;
              background-size: 100%;
              border: none;
            }
          }
        }
        >span.rightIcon{
          float: right;
          display: block;
          float: right;
          width: 5%;
          margin-right: 60/@w;
          >img{
            height: 40/@w;
            width: 30/@w;
            padding: 0 0;
            margin-top: 40/@w;
          }
        }
        &:after{
          position: absolute;
          right: 0;
          bottom: 0;
          left: 40/@w;;
          height: 1px;
          content: '';
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
          background-color: #c8c7cc;
        }
      }
    }

  }
  .bankCardList-input-group{
    position: relative;
    padding: 0;
    border: 0;
    background-color: #fff;
     &:before{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }
    &:after{
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }
  }
  .submitBtn{
    background-color: #FFFFFF;
    width: 100%;
    margin-top: 150/@w;
    height: 150/@w;
  }
  .submitBtn-text{
    display: block;
    height: 80/@w;
    width: 80%;
    font-size: 32/@w;
    margin: 0 auto 60/@w;
    text-align: center;
    line-height: 80/@w;
    background-color: #FFA800;;
    border-radius:10/@w;
    color: #fff;
  }
  .selectBank-content{
    width: 100%;
    padding-top: 44px;
  }
  .mint-header{
    box-shadow: 0 1px 6px #ccc;
  }
  .bind-bank-card{
    height: 100/@w;
  }
  .Router{
    display: flex;
  }
</style>
