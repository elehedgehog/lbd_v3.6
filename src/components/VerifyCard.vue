<template>
  <div>
      <mt-header title="验证银行卡" class="lbd-head-normal">
          <mt-button icon="back" slot="left" @click="back"></mt-button>
      </mt-header>
      <div class="mui-content" id="content">
        <div class="inputList">
          <div class="item">
            <label>持卡人姓名</label>
            <span class="idName">{{ encryptName }}</span>
          </div>
          <div class="item">
            <label>身份证号码</label>
            <span class="idCard">{{ encryptIdCard }}</span>
          </div>
          <div class="item detail-input">
            <p>该银行卡用于收款/还款，贷款金额仅支持<span style="color:#FC5605">借记卡</span>转汇款</p>
          </div>
          <div class="item">
            <label>银行卡号</label>
            <span class="idName">{{ query.bankAccount }}</span>
          </div>
          <div class="item">
            <label>手机号</label>
            <input class="inputList-item item-indent" :placeholder="query.reservedMobilehone" type="text" v-model="telephone">
          </div>
          <div class="item bankName-item">
            <label>开户银行</label>
            <span  class="idName" >{{ query.bankName }}</span>
          </div>

        </div>
        <div class="submitBtn" id="submitBtn">
          <span class="submitBtn-text" @click="confirmBtn" v-if="confirmCode">确认</span>
          <span class="submitBtn-text" @click="confirmBindCard" v-else>确认绑卡收款</span>
        </div>
      </div>

      <div class="userB-shade" v-if="codePop">
        <div class="userB-shade-content" align="center">
          <div class="code-top">
            <span>短信验证码</span>

          </div>
          <div class="code-content">短信验证码已经发送到您预留的银行卡手机上，请你输入收到的短信验证码</div>
          <div class="code-btn">
            <input id="phoneCode" placeholder="请输入6位验证码" v-model="phoneCode"/>
					  <span :class="['getCode',{'on': codeWidth }]" @click="getVerificationCode()" id="coundDown">{{ getCodeText }}</span>
          </div>
          <button @click="verificationBtn">确定</button>
        </div>
        <div class="close-border">
          <em class="close-btn" @click="codePop=!codePop"></em>
        </div>
      </div>

    </div>
</template>
<script>
  import { Toast, Indicator } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
   export default {
      data(){
        return{
          maskBankPop: false,
          provincePop: false,
          cityPop: false,
          bankAccount: '',  //银行账户
          telephone: '', //手机
          bankName: '', //开户行
          bindCardData: '',
          ProvinceList: {},
          queryCityList: {},
          selectedProvinceId: '',  //选中的省ID
          query: {},
          encryptName: '',
          encryptIdCard: '',

          codePop: false,
          timer: undefined,
          count: 61,        //60秒倒计时
          getCodeText: '获取验证码',
          confirmCode: true,
          codeWidth: false,
          phoneCode: '',   //手机验证码

          bankMsg: {},
          cityId: null,
          userAccountId: null,
        }
      },
      created() {
        mobileManager.hideBottomBar()   //隐藏原生底部栏
         mobileManager.enableRefresh(false)  //下拉刷新
         if(this.$route.params.pageType) {
           sessionStorage.setItem('pageType', this.$route.params.pageType)
         }

        this.$route.params.buriedPoint == 'quick' ?  mobileManager.buriedPoint('fastloan_band_new_card')  :  mobileManager.buriedPoint('one_bank_new_card') //埋点id
        if(this.$route.params.type){
          this.bindCardType = this.$route.params.type
        } else {
          this.bindCardType = sessionStorage.type
        }
      },

      mounted(){
        this.getQueryUserOrgInfo()
        this.query = this.$route.query;
        let params = this.$route.query;
        params.bankAccount && (this.bankAccount = params.bankAccount);
        params.reservedMobile && (this.telephone = params.reservedMobile);
        params.bankName && (this.bankName = params.bankName);
        if(this.$route.params.token){
          sessionStorage.setItem('token', this.$route.params.token)
        }
      },

      methods:{
        back(){
          if(sessionStorage.pageType == 'HomeWhiteListA'){     //////////////////////跳转A类首页
              this.$router.push({ name: 'HomeWhiteListA',  params: this.bankMsg, query:this.$route.params })

            } else {
              this.$router.push({ name: 'BindCardConfirm',  params:this.bankMsg, query:this.$route.params })    //////////////////////跳转绑卡确认页面
          }
        },
        showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
        },
        toggleBank(key){
          this.bankName = key
          this.maskBankPop=false
        },

        getAddAccountr() {   //绑新卡接口
          let paramsObj = {
            bankAccount: this.bankAccount,
            bankName: this.bankName,
            cityId: this.cityId,
            reservedMobile: this.telephone,
            token: sessionStorage.token,
          }
          this.$http.post(
            this.lbdUtil.host + '/user/userAccount/addAccount.json',
            this.$qs.stringify(paramsObj)
            ).then((res) => {
              console.log(res)
            if(res.data.status==='0000'){
                this.userAccountId = res.data.data.id  //获取新卡id
                console.log(this.userAccountId,'接口获取的id')
                 let params  = this.$route.query;
                  let paramsObj = {    //判断数据是否填充
                    bankAccount:  this.$route.query.bankAccount ? this.$route.query.bankAccount : this.bankAccount,
                    bankName:  this.$route.query.bankName ? this.$route.query.bankName : this.bankName,
                    bankCode:  this.lbdUtil.getBankNameOfCode(this.bankName),
                    borrowOrderCode:  this.$route.query.borrowOrderCode ? this.$route.query.borrowOrderCode : this.borrowOrderCode,
                    reservedMobile:  this.$route.query.reservedMobile ? this.$route.query.reservedMobile : this.telephone,
                    userAccountId:  this.$route.query.userAccountId ? this.$route.query.userAccountId : this.userAccountId,
                    productCode: this.$route.query.productCode,
                    token: sessionStorage.token,
                  }
                  this.bankMsg = paramsObj

                  if(sessionStorage.pageType == 'HomeWhiteListA'){
                    this.$router.push({ name: 'HomeWhiteListA',  params: this.bankMsg, query: this.$route.params})
                  } else {
                    this.$router.push({ name: 'BindCardConfirm',  params: this.bankMsg, query: this.$route.params})
                  }
              } else {
                this.confirmCode = true
                this.showToast(res.data.msg)
              }
            },(err)=>{
            this.showToast('网络出错');
          });
        },
        confirmBindCard(){   //确认绑卡按钮
          let regular=11 && /^1[3-9]{1}[0-9]{9}$/;
          // if(this.telephone === ''){
          //     this.showToast('请填写手机号码');
          //     return false;
          // }else
          if(!regular.test(this.telephone)){
              this.showToast('手机号码格式不正确');
              return false;
          }
          // else if(this.bankName=== ''){
          //   this.showToast('请选择开户行');
          //     return false;
          // }

          let params  = this.$route.query;
        },
        getQueryUserOrgInfo(){   //查询用户组织信息
            let params  = this.$route.query;
            params.channelCode = sessionStorage.QuickLoanIndexChannelCode
            let webInfo = this.lbdUtil.getWebInfoObj();
            let parasObj = this.$qs.stringify(Object.assign(params,webInfo))
            Indicator.open({ spinnerType: 'fading-circle' });
            this.$http.post(
              this.lbdUtil.host + '/user/userOrgInfo/queryUserOrgInfo',
              parasObj
              ).then((res) => {
                Indicator.close();
              if(res.data.status==='0000'){
                  this.encryptName = res.data.data.encryptName
                  this.encryptIdCard = res.data.data.encryptIdCard
                } else {
                   this.showToast(res.data.msg);
                }

              },(err)=>{
              this.showToast('网络出错');
              Indicator.close();
            });
          },

         countDown() {
            var coundDown = document.getElementById('coundDown');
            if (this.count > 1) {
              this.count--;
              this.getCodeText = this.count + 's'
              this.codeWidth = true

            } else {
              clearInterval(this.timer);
              this.timer = undefined;
              this.count = 61;
              this.getCodeText = '获取验证码'
              this.codeWidth = false
            }
          },

          verificationBtn() {   //验证码确定按钮
              let numberVerifician = /\d{6}/
              if (this.verificationCode==''){
                this.showToast('请输入验证码');
                return false;
              } else if (!numberVerifician.test(this.phoneCode)){
                this.showToast('验证码为6位数字');
                return false;
              }
            this.validateCode()
            this.phoneCode = ''

          },

          validateCode() {  //验证 验证码是否正确接口
             this.$http.post(
                this.lbdUtil.host + `/common/validateCode?mobile=${this.telephone}&code=${this.phoneCode}`,
              ).then((res) => {
              if(res.data.status==='0000'){
                  this.getAddAccountr()  //添加银行卡
                  this.codePop = false   //关闭发送验证码窗口
                } else {
                  this.showToast(res.data.msg);
                }
              },(err)=>{
              this.showToast('网络出错');
            });
          },

          getVerificationCode() {    //获取短信验证码按钮
            if (!this.timer) {
              this.countDown();
              this.timer = setInterval(this.countDown, 1000);
              this.sendCode()
            }
          },

          confirmBtn(){
              let regular=11 && /^1[3-9]{1}[0-9]{9}$/;
              let card = /^[a-zA-Z0-9]{7,30}$/  //银行卡正则7-30位字母或数字
              if(this.bankAccount === ''){
                  this.showToast('请填写银行卡号');
                  return false;
              }else if(!card.test(this.bankAccount)){
                  this.showToast('请输入正确的银行卡号');
                  return false;
              }else if(this.telephone === ''){
                  this.showToast('请填写手机号码');
                  return false;
              }else if(!regular.test(this.telephone)){
                  this.showToast('手机号码格式不正确');
                  return false;
              } else if(this.bankName=== ''){
                this.showToast('请选择开户行');
                  return false;
              }
              this.getVerificationCode()
              this.codePop = true  //显示已发送验证码窗口

          },

          sendCode() {  //发送短信验证码接口
              this.$http.post(
                this.lbdUtil.host + `/common/sendCode?mobiles=${this.telephone}`,
              ).then((res) => {
              if(res.data.status==='0000'){
                } else {
                  this.showToast(res.data.msg);
                }
              },(err)=>{
              this.showToast('网络出错');
            });
          }
        },
  }
</script>
<style lang="less" scoped>
  @w:75rem;
  .mui-content{
    width: 100%;
    padding-top: 44px;
  }
  .title{
    width: 100%;
    height: 80/@w;
    font-size: 30/@w;
    color: #FFFFFF;
    line-height: 80/@w;
    text-align: center;
    background: #FBC205;
  }
  .inputList{
    font-size: 30/@w;
    color: #646464;
    background: #FFFFFF;
    margin-top: 10/@w;
    // min-height: calc(~"100% - 44px");
  }
  .inputList .item{
    width: 100%;
    height: 110/@w;
    line-height: 110/@w;
    border-bottom: 1px solid #F3F3F3;
    .idName{
      float: right;
      margin-right: 85/@w;
      color: #999999;
      &.bankOpen{

      margin-right: 0;
      }
    }
    .idCard{
      float: right;
      margin-right: 85/@w;
    }
    .item-indent{
      float: right;
      margin-right: 85/@w;
      text-align: right;
    }
    .item-indent-bank{
      text-align: right;
    }
    &.detail-input{
      height: 100/@w;
      line-height: 50/@w;
      border-top: 20/@w solid #F0F0F0;
      font-size: 26/@w;
      >p{
        margin-left: 40/@w;
      }

    }
  }
  .inputList .item label{
    float: left;
    width: 27%;
    display: inline-block;
    margin-left: 40/@w;
  }
  .inputList input.inputList-item{
    float: right;
    width: 50%;
    margin-top: 15/@w;
    height: 80/@w;
    font-size: 32/@w;
    color: #646464;
    margin-bottom: 0;
    border: none;
    outline: none;
    background: none;
  }
  .bankName-input{
    border: none;
    outline: none;
    font-size: 0.42666667rem;
    color: #757575;
    background: none;
  }
  .bankName-item img{
    float: right;
    // height: 40/@w;
    width: 34/@w;
    margin-top: 42/@w;
    margin-right: 85/@w;
  }
  .bankName-item .bankName{
    display: inline-block;
    width: 50%;

  }
  .bankName-openAcount{
     display: inline-block;
      width: 50%;
  }
  .bankAddress label{
    display: inline-block;
    float: left;
  }
  .province-city{
    float: right;
    width: 65%;
  }
  .province-inner,.city-inner{
    float: left;
  }
  .bankAddress .province,.city{
    float: left;
    input.province-input{
      width: 100/@w;
      padding: 0 10/@w;
      border: none;
      outline: none;
      font-size: 30/@w;
      color: #646464;
      background: none;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    input.province-input-city{
      width: 160/@w;
    }
  }
  .city{
    margin-right: 85/@w;
    float: right;
  }
  .bankAddress .province img ,.city img{
    float: left;
    width: 34/@w;
    margin-top: 42/@w;
  }


  .submitBtn{
    width: 100%;
    padding-top: 80/@w;
    height: 100/@w;
  }
  .submitBtn-text{
    display: block;
    height: 80/@w;
    width: 80%;
    font-size: 32/@w;
    margin: 0 auto;
    text-align: center;
    line-height: 80/@w;
    background-color: #FFA800;;
    border-radius:10/@w;
    color: #fff;
  }


  .mask{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #7F7F7F;
    z-index: 1000;
    opacity: 0.5;
  }
  .bankCardModul{
    position: absolute;
    top: 170/@w;
    left: 50%;
    margin-left: -302/@w;;
    width: 600/@w;
    height: 790/@w;
    background: #FFFFFF;
    z-index: 200;
    border-radius: 40/@w;
    z-index: 1000;
  }
  .bankCardModul .bankListTitle{
    height: 90/@w;
    line-height: 90/@w;
    font-size: 35/@w;
    color: #000000;
    text-align: center;
    border-top-left-radius: 40/@w;
    border-top-right-radius: 40/@w;
    background-color: #FBC205;
  }
  .bankCardModul .bankList ul{
    height: 600/@w;
    width: 100%;
    overflow: scroll;
  }
  .bankCardModul .bankList ul li{
    font-size: 32/@w;
    height: 100/@w;
    line-height: 100/@w;
    border-bottom: 1px solid #F3F3F3;

  }
  .bankCardModul .bankList ul li img{
    height: 70/@w;
    width: 69/@w;
    margin-left: 66/@w;
    margin-right: 80/@w;
    vertical-align: middle;
  }
  .bankCardModul .closeBtn{
    text-align: center;
    height: 100/@w;
    /*line-height:1rem;*/

  }
  .bankCardModul .closeBtn img{
    margin-top: 18/@w;
    width: 64/@w;
    height: 64/@w;
    vertical-align: middle;
  }

  .addressModule{
    position: absolute;
    top: 180/@w;
    left: 50%;
    margin-left: -35%;
    width: 70%;
    height: 720/@w;
    background: #FFFFFF;
    z-index: 1000;
    border-radius: 40/@w;
  }
  .addressModule ul{
    height: 640/@w;
    width: 100%;
    overflow: scroll;
  }

  .addressModule li{
    list-style: none;
    height: 80/@w;
    line-height: 80/@w;
    text-align: center;
    border-bottom: 1px solid #F3F3F3;
  }
  .addressModule .closeBtn{
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    height: 80/@w;

  }
  .addressModule .closeBtn img{
    margin-top: 8/@w;
    width: 64/@w;
    height: 64/@w;
    vertical-align: middle;
  }

  input::-webkit-input-placeholder{
      color:#999999;
      font-size: 30/@w;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:#999999;
      font-size: 30/@w;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color:#999999;
      font-size: 30/@w;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color:#999999;
      font-size: 30/@w;
  }
  input:disabled {
    color: #999999!important;
    opacity: 1;
    -webkit-opacity: 1;
    -webkit-text-fill-color: #999999!important;
  }

  .userB-shade{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 999;
      background-color: rgba(0,0,0,.3);

      .userB-shade-content{
        width: 520/@w;
        height: 400/@w;
        border-radius: 20/@w;
        margin: 60% auto 0;
        background-color: #fff;
        .code-top{
          padding-top: 10/@w;
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
        .code-btn{
          height: 80/@w;
          margin-top: 20/@w;
          input{
            height: 60/@w;
            line-height: 60/@w;
            width: 250/@w;
            float: left;
            margin-left: 40/@w;
            border: none;
            outline: none;
            font-size: 26/@w;
            text-align: center;
            background-color: #F0F0F0;
            border-radius: 10/@w;
          }
          &:after{
            content: '';
            clear: both;
          }
        }
        input::-webkit-input-placeholder{
          font-size: 26/@w;
          color: #999999;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
          font-size: 26/@w;
          color: #999999;
        }
        input:-o-placeholder{    /* Mozilla Firefox 4 to 18 */
          font-size: 26/@w;
          color: #999999;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
          font-size: 26/@w;
          color: #999999;
        }
        input:disabled::placeholder{
          color: #999999;
          -webkit-text-fill-color:#999999;
        }
        input:disabled{
          color:#999999;
        }
        //IE8-
        input[disabled]{
            color:#999999;
        }
        button{
          border: none;
          outline: none;
          height: 60/@w;
          line-height: 60/@w;
          margin-top: 20/@w;
          width: 150/@w;
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
        background-image: url(~Img/delete_card.png);
        background-repeat: no-repeat;
        background-size: 100%;
      }

    }

    .getCode{
      float: right;
      height: 50/@w;
      line-height:  50/@w;
      width: 150/@w!important;
      display: inline-block;
      background-color: #C72D2D;
      color: #EF9B9B!important;
      margin-top: 10/@w!important;
      margin-right: 40/@w!important;
      font-size: 24/@w!important;
      text-align: center;
      border-radius: 10/@w;
  }
  .getCode.on{
      width: 80/@w!important;
  }
</style>
