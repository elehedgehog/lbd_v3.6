<template>
  <div>
    <mt-header title="确认还款" class="lbd-head-normal">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div class="hydDetails">
      <p class="hydMoney">
        <span>¥</span>
        <span>{{ this.repayAmountReceive }}</span>
      </p>
      <p class="hydNumber">{{ productName }}借款编号: {{borrowOrderCodeReceive }}</p>
    </div>
    <div class="inputList">
      <!-- <div class="inputItem" >
        <span>收款方</span>
        <span>好又贷股份有限公司</span>
      </div> -->
      <div class="inputItem bankName" @click="selectBank">
        <span>银行名称</span>
        <img v-if="this.bankImgSrc != ''" :src="`static/img/bank_icon/${this.bankImgSrc}.png`" alt="" class="bankImg">
        <span class="bankNameReceive">{{ bankName ?  bankName : '点击选择还款银行卡' }}</span>
        <span class="inputItemMsg" v-if="bankName !== ''"><img src="../assets/img/weqrtyui.png"/></span><span></span>

      </div>
      <div class="inputItem RepaymentAccount" >
        <span>还款账户</span>
        <input type="text" v-model="repaymentAccount" placeholder="请选择还款卡银行号" readonly>
      </div>
      <div class="inputItem" >
        <span>手机号码</span>
        <input type="text" v-model="telephone" pattern="[0-9]*" placeholder="请输入预留手机号码">
      </div>
      <div class="inputItem" >
        <span>验证码</span>
        <input type="text" placeholder="请输入验证码" pattern="[0-9]*" v-model="verificationCode" class="inputCode" maxlength="6">
        <span class="verificationCode">
          <span class="verificationCodeOne" v-if="count<=0"  @click="getVerifyCodeBtn">获取验证码</span>
          <span class="verificationCodeTwo" v-else @click="toggleMsg" >{{ count }}秒后重新获取</span>
        </span>
      </div>
    </div>
    <div @click="immediatelyPay"
         :class="['paymentsButton', {'on': isMessageFilled}]">立即还款</div>
    <mt-popup  v-model="popupVisible"
               popup-transition="popup-fade"
               :closeOnClickModal="false">
      <p>选择还款银行<img @click="popupVisible=false" class="close" src="../assets/img/guanbi@2x.png"></p>
      <ul class="bankList">
        <li v-for="(item,index) of bankCardData"
            :key="index"
            @click="toggleBank(item)"><img :src="`static/img//bank_icon/${item.bankCode}.png`" alt="">{{ item.bankName }}<span class="bankAccount">{{ item.bankAccount }}</span></li>
      </ul>
    </mt-popup>
    <div class="alipay" v-if="alipayPop">
      <div class="alipay-content">
        <p class="alipay-content-title">支付宝还款信息</p>
        <p class="alipay-content-msg text-indent">如出现还款失败等特殊情况，为避免逾期，您可通过支付宝APP的转账功能进行还款操作。</p>
        <p class="alipay-content-msg">支付宝帐号：598869434@qq.com</p>
        <p class="alipay-content-msg">支付宝名称：广东乐普数据科技有限公司</p>
        <p class="alipay-content-msg remark">转账备注：身份证号后8位#姓名</p>
        <p class="alipay-content-msg remark">（例：“12345678#张三”）</p>
        <p class="alipay-content-msg text-indent">如转账信息无误，您的账单我们将会作更新操作，在等待期间您无需承担逾期费用，请您耐心等待。如超过3日仍未更新，请您联系客服：4008-116-669</p>
        <div align="center"><button @click="alipayPop=false">朕已阅</button></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { Popup } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
  export default {
      data(){
        return{
          bankName: '',
          repaymentAccount: '',
          telephone: '',
          verificationCode: '',
          popupVisible: false,
          bankImgSrc: '',
          bankCardData: [],
          transactionNo: '',  //验证码标志
          uniqueCode: '',   //签约唯一码
          count: 0,   //倒计时
          countIntervalHolder: null,
          getVerifyCodeData:[],
          confirmPayData: [],
          userAccountId: '',  //银行id
          repayAmountReceive: '',
          borrowOrderCodeReceive: '',
          getVerifyBoolean: false,
          productCode: '',
          productName: '',
          alipayPop: false,   //失败信息弹框
          isNoClick: true,
        }
      },
      mounted(){
        //console.log(this.$route)
        console.log(this.$route.query)
        let name = this.$route.query.productCode
        if(/LBB/.test(name)) {
          this.productName = '乐宝口袋'
        } else if (/SXD/.test(name)) {
          this.productName = '随薪贷'
        } else if (/HYD/.test(name)) {
          this.productName = '好又贷'
        }
      },
      created() {
        mobileManager.hideBottomBar()   //隐藏原生底部栏
        this.getQueryUserAccountList()
        this.repayAmountReceive = this.$route.query.repayAmount
        this.borrowOrderCodeReceive = this.$route.query.borrowOrderCode
        this.productCode = this.$route.query.productCode
      },
      methods:{
        back(){
            this.$router.goBack('repayOrder');
        },
        showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
        },
        getQueryUserAccountList() {  //获取银行信息
          let webInfo = this.lbdUtil.getWebInfoUrl();
          let params  = this.$route.query;
          this.$http.get(this.lbdUtil.host +'/user/userAccount/queryUserAccountList?' + webInfo.substr(1),
			    {params}
          ).then((res)=>{
            this.bankCardData=res.data.data;
            //console.log(res,'请求成功');
          },(err)=>{
            console.log(err,'请求失败');
          })
        },

        selectBank() {
          this.popupVisible = true
        },
        toggleBank(item){  //选择银行
          this.popupVisible = false
          this.bankName = item.bankName
          this.bankImgSrc = item.bankCode
          this.repaymentAccount = item.bankAccount
          this.userAccountId = item.id
          this.telephone = item.reservedMobile
        },
        getVerifyCodeBtn() {  //获取验证码按钮
          let regular=11 && /^1[3-9]{1}[0-9]{9}$/;
          //let number
         /* if(this.bankName === ''){
              this.showToast('请选择银行');
          }else if(this.repaymentAccount === ''){
              this.showToast('请填写还款账户');
          }else if(this.telephone === ''){
              this.showToast('请填写手机号码');
              return false;
          } else if(!regular.test(this.telephone)){
              this.showToast('手机号码格式不正确');
              return false;
          }*/

          if(this.telephone === ''){
              this.showToast('请填写手机号码');
              return false;
          }else if(!regular.test(this.telephone)){
              this.showToast('手机号码格式不正确');
              return false;
          }else if(this.bankName === ''){
              this.showToast('请选择银行');
              return false;
          } else if(this.repaymentAccount === ''){
              this.showToast('请先选择您的银行卡');
              return false;
          }

          this.count = 60         //60秒倒计时
          this.countIntervalHolder = setInterval(() => {
            this.count -= 1
            if(this.count === 0) {
              clearInterval(this.countIntervalHolder)
              this.countIntervalHolder = null
            }
          }, 1000)
          this.getVerifyCode()

        },
        getVerifyCode(){ //获取验证码
          if(this.telephone === '') {
            this.showToast('请填写手机号码')
            return false;
          }
          let webInfo = this.lbdUtil.getWebInfoUrl();
          let params  = this.$route.query;
          this.$http.get(
          //  this.lbdUtil.host +'/payment/reapalRepay/getVerifyCode?' + webInfo + `&increaseBank=1&reservedMobile=${this.telephone}&userAccountId=${this.userAccountId}&transactionNo=${this.transactionNo}`,
           this.lbdUtil.host +'/payment/bfFastPay/getVerifyCode?' + `increaseBank=1&reservedMobile=${this.telephone}&userAccountId=${this.userAccountId}&transactionNo=${this.transactionNo}` + webInfo ,
          {params}
          ).then((res)=>{
            this.getVerifyCodeData = res.data.data
            if(res.data.status==='0000'){
              this.getVerifyBoolean = true
              //console.log(res,'请求成功');
              console.log(this.getVerifyCodeData.transactionNo);
              this.transactionNo = this.getVerifyCodeData.transactionNo
              this.uniqueCode = this.getVerifyCodeData.uniqueCode
            } else {
               if(res.data.msg){
                 Toast({
                    message: res.data.msg,
                    position: 'bottom',
                  });
                }
              this.alipayPop = true
            }
          },(err)=>{
            console.log(err,'请求失败');
          });
        },
        toggleMsg(){      //60秒内点击
          this.showToast('你的操作过于频繁，请稍候再试')
        },
        immediatelyPay(){     //立即还款按钮
          if(!this.getVerifyBoolean) return  //验证码获取失败
          let regular = 11 && /^1[3-9]{1}[0-9]{9}$/;
          let numberVerifician = /\d{6}/
          if(this.bankName	==''){
            this.showToast('请选择银行卡');
            return false;
          }else if(this.repaymentAccount==''){
            this.showToast('请输入银行卡号');
            return false;
          }
          // else if(isNaN(this.repaymentAccount)){
          //   this.showToast('银行卡格式不正确');
          // }
          else if(this.telephone==''){
            this.showToast('请输入手机号码');
            return false;
          } else if (!regular.test(this.telephone)){
            this.showToast('手机号格式不正确');
            return false;
          } else if (this.verificationCode==''){
            this.showToast('请输入验证码');
            return false;
          } else if (!numberVerifician.test(this.verificationCode)){
            this.showToast('验证码为6位数字');
            return false;
          } else {
            MessageBox.confirm('是否确认还款?').then(action => {
              this.getConfirmPay()
            })
          }
        },
        getConfirmPay(){ //确认还款点击确定之后执行
          let webInfo = this.lbdUtil.getWebInfoUrl();
          let params  = this.$route.query
          let param = {
            smsCode: this.verificationCode,
            uniqueCode: this.uniqueCode,
            transactionNo: this.transactionNo,
            userAccountId: this.userAccountId,
            reservedMobile: this.telephone,
            token: params.token,
            borrowOrderId: params.borrowOrderId,
            repayAmount: params.repayAmount,
          };
          let paramsa  =this.$qs.stringify( Object.assign({}, this.lbdUtil.webInfo, param))
          // this.$http.post(this.lbdUtil.host + `/payment/bfFastPay/confirmPay?transactionNo=${this.transactionNo}&smsCode=${this.verificationCode}&uniqueCode=${this.uniqueCode}`+ webInfo,
          this.$http.post(this.lbdUtil.host + `/payment/bfFastPay/confirmPay`, paramsa)
          .then((res)=>{
             if(res.data.status==='0000'){
                this.confirmPayData=res.data;
                this.transactionNo = this.confirmPayData.data.transactionNo
                let paramsObj = this.$route.query;
                paramsObj["bankName"]=this.bankName;
                paramsObj["transactionNo"]=this.transactionNo;
                paramsObj["uniqueCode"]= this.uniqueCode
                this.$router.push({ name: 'PaymentDetails', params:{ bankName: this.bankName,transactionNo: this.transactionNo,uniqueCode: this.uniqueCode}, query:paramsObj})
             } else {
               if(res.data.msg){
                 Toast({
                    message: res.data.msg,
                    position: 'bottom',
                  });
                }
                this.alipayPop = true
                this.isNoClick = false
             }
            //console.log(res,'请求成功');
          },(err)=>{
            console.log(err,'请求失败');
            this.showToast('还款失败，请稍候再试')
          })
        },

      },
      computed: {
        isMessageFilled() {
          return this.bankName && this.repaymentAccount && this.telephone && this.verificationCode && this.getVerifyBoolean
        }
      }

  }
</script>
<style lang="less" scoped>
  @w:75rem;
  .alipay{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0,0,0,.3);
    .alipay-content{
      p{
        margin: 0;
        padding: 0;
      }
      position: absolute;
      width: 65%;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      padding: 40/@w 40/@w;
      .alipay-content-title{
        color: #D9462A;
        text-align: center;
        font-size: 32/@w;
        margin-bottom: 20/@w;
      }
      .alipay-content-msg{
        margin-bottom: 10/@w;
        font-size: 30/@w;
        &.remark{
          color: #D9462A;
        }
        &.text-indent{
          text-indent: 2em;
        }
      }
      button{
        margin-top: 40/@w;
        height: 60/@w;
        line-height: 60/@w;
        width: 240/@w;
        border-radius: 200/@w;
        color: #fff;
        font-size: 28/@w;
        border: none;
        outline: none;
        background-color: #FBC205;
      }
    }
  }
  .hydDetails{
    height: 200/@w;
    width: 100%;
    text-align: center;
		margin-top: 44px;
    color: #461b0b;
    background-color: #FBC205;
    p{
      margin: 0;
      &.hydNumber{
        padding-top: 10px;
        font-size: 28/@w;
      }
      &.hydMoney{
        padding-top: 20px;
        font-size: 50/@w;
        >span:nth-child(1){
          font-size: 26/@w;
          margin-right: -4px;
        }
      }
    }
  }
  .inputList{
		background-color: #FFFFFF;
		.inputItem{
			height: 100/@w;
			width: 100%;
			line-height: 100/@w;
			font-size: 32/@w;
			color: #646464;
			border-bottom: 1px solid #F3F3F3;
			span{
        &:nth-child(1){
          margin-left: 30/@w;
          width: 180/@w;
          display: inline-block;
        }
        &.bankNameReceive{
          font-size: 30/@w;
		    	color: #646464;
        }
			}
			input{
        height: 100/@w;
        width: 290/@w;
				border: none;
				outline:none;
				font-size: 30/@w;
        color:#949494;
        background: transparent;
        -webkit-user-select:auto;
        &.inputCode{
          width: 250/@w;
        }
      }
      .verificationCode{
        float: right;
        display: inline-block;
        margin-top: 20/@w;
        margin-right: 20/@w;
        height: 63/@w;
        line-height: 63/@w;
        width: 200/@w;
        text-align: center;
        border: 1px solid #E8E7E7;
        color: #646464;
        >span{
          margin: 0;
          &.verificationCodeOne{
            font-size: 30/@w;
          }
          &.verificationCodeTwo{
            font-size: 25/@w;
            white-space: nowrap;
          }
        }
      }
			.inputItemMsg{
				float: right;
				color: #949494;
				img{
					width: 20/@w;
					height: 30/@w;
					vertical-align: middle;
					margin-left: 20/@w;
					margin-right: 35/@w;
				}
			}
			.selectBank{
				display: inline-block;
				margin-left: 165/@w;
      }
      &.RepaymentAccount{
        span:nth-child(2){
          color: #A2A2A2;
        }
      }
      .bankImg{
        position: relative;
        height: 50/@w;
        width: 50/@w;
        top: 15/@w;
      }
		}
  }
  .paymentsButton{
		height: 80/@w;
		width: 80%;
		font-size: 32/@w;
		color: #fff;
		margin: 0 auto;
		background-color: #bfbfbf;
		border-radius: 30/@w;
		margin-top: 70/@w;
		text-align: center;
		line-height: 80/@w;
    text-decoration: none;
    &.on{
      background-color: #FBC205;
      color: #646464;
    }
  }
  .mint-popup{
    width: 85%;
    max-height: 85%;
    padding-bottom: 50/@w;
    overflow: hidden;
    border-radius: 10/@w;
    p{
      height: 100/@w;
      line-height: 100/@w;
      margin: 0;
      color: #646464;
      text-align: center;
			font-size: 32/@w;
      border-bottom: 1px solid #F3F3F3;
    }
    span{
      float: right;
      margin-right: 30/@w;
      display: inline-block;
			font-size: 50/@w;
			color: #646464;
    }
  }
  .close{
    float: right;
    width: 40/@w;
    display: inline-block;
    margin-right: 30/@w;
    margin-top: 35/@w;
    display: inline-block;
    background: url(../assets/img/guanbi@2x.png)no-repeat 0 0/100% 100%;
  }
  .bankList{
    width: 100%;
    max-height: 800/@w;
    overflow-y: auto;
    li{
      width: 100%;
      height: 100/@w;
			line-height: 100/@w;
			font-size: 32/@w;
			color: #646464;
      border-bottom: 1px solid #F3F3F3;
      img{
        position: relative;
        height: 50/@w;
        width: 50/@w;
        margin-right: 20/@w;
        margin-left: 30/@w;
        top: 15/@w;
      }
      .bankAccount{
        font-size: 30/@w;
      }
    }
  }
  .bankList::-webkit-scrollbar-thumb {
      background: #ccc;
  }
  .bankList::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10/@w;     /*高宽分别对应横竖滚动条的尺寸*/
  }
  .clearfix:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
  }
  	input::-webkit-input-placeholder {
		color: #c8c8c8;
	}
	input:-moz-placeholder {
		color: #c8c8c8;
	}
	input::-moz-placeholder {
		color: #c8c8c8;
	}
	input:-ms-input-placeholder {
		color: #c8c8c8;
	}
</style>


