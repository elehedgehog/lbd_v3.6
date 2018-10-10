<template>
  <div>
    <mt-header title="借款" class="lbd-head-normal">
	    	<!-- <mt-button icon="back" @click="back" slot="left"></mt-button> -->
        <!-- <mt-button icon="message" slot="right"></mt-button> -->
        <img  slot="right" v-if="false" @click="toMessageCenter" class="imgInfor" src="../assets/img/Order/message.png"/>
	   		<img  slot="right" v-if="true" @click="toMessageCenter" class="imgInfor" src="../assets/img/Order/messageNo.png"/>
		</mt-header>
    <div class="miss-header">
      <div class="miss-header-top">
        <p class="loan-des">
          <span class="loan-des-one">一键贷款</span>
          <router-link :to="{ name: 'ProductDetail',params:{pageType: true}}" tag="span" class="loan-des-pro">产品说明</router-link>
        </p>
        <template v-if="checkPop">  <!--审核中头部-->
          <p class="loan-most">最高可借额度(元)</p>
          <p class="loan-money">{{ applyAmount }}</p>
          <p class="loan-slogan">我们将在<span class="loan-time">30分钟</span>内为您审批放款，请耐心等待</p>
        </template>
        <template v-if="checkSucessPop">  <!--审核完成头部-->
          <p class="loan-most">可借额度(元)</p>
          <p class="loan-money">{{ repayPrincipal }}</p>
          <p  class="loan-day">（还剩<span class="loan-time">{{ countDown }}</span>关闭放款入口）</p>
          <p class="loan-slogan">我们将在<span class="loan-time">30分钟</span>内为您审批放款，请耐心等待</p>
        </template>

      </div>
    </div>

    <div class="check-ing" v-if="checkPop">        <!--审核中 内容部分-->
      <div class="loan-refuse-title"><span class="title-text">常见问题</span></div>
			<div class="loan-refuse-list">
           <ul>
				        <li :class="[{'mui-active': authenticationPop}]" @click="authenticationPop=!authenticationPop">
				            <a><span>申请借款需要做哪些认证？</span></a>
				            <div v-if="authenticationPop">
				                <p>用户注册之后，需要完成信息认证才可以申请借款。其中，认证信息有：个人信息、手机运营商、信用卡（邮箱）、工作单位、紧急联系人等信息。信息越完善，审批通过率和信用额度就越高。</p>
				            </div>
				        </li>
				         <li :class="[{'mui-active': auditPop}]"  @click="auditPop=!auditPop">
				            <a><span>提交申请后，多久我可以收到审核结果？</span></a>
				            <div v-if="auditPop">
				                <p>审核结果会在提交申请后24小时内以短信的形式发送至申请手机，如遇周末或节假日顺延。您未能及时接听审批人员来电也会影响审核进度，请留意来电并耐心等待审核结果。</p>
				            </div>
				        </li>
				         <li :class="[{ 'mui-active': accountPop }]" @click="accountPop=!accountPop">
				            <a><span>放款多久到账？</span></a>
				            <div v-if="accountPop">
				                <p>若您的借款申请已经审核通过，在您点击“确认借款”按钮后，工作日正常1小时内放款到账， 最晚下一个工作日早上到账。具体到账时间以收款银行到账通知为准。</p>
				            </div>
				        </li>
				    </ul>
			</div>
    </div>

    <div class="check-success miss-header-bottom" align="center" v-if="checkSucessPop" >      <!--审核完成  内容部分-->
      <button @click="toBindCard()">绑卡拿钱</button>
    </div>
    <div class="miss-requirement">
      <!-- <p class="total-loan">累计放款</p>
      <p class="total-number">
        <span>410</span>亿<span>8888</span>万<span>8888</span>元
      </p> -->
      <p class="total-condition">申请条件：借款人需22—55周岁，非在校生</p>
    </div>


  </div>
</template>
<script>
  import { Toast, Indicator, MessageBox} from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
  export default {
      data(){
        return{
            authenticationPop: false,
            auditPop: false,
            accountPop: false,
            onReloadPop: false,    //审核

            checkPop: false, //审批中判断
            checkSucessPop: true, //审批通过绑卡中判断
            status: '',
            repayPrincipal: '',
            repayAmount: '',
            orderNo: '',
            borrowOrderCode: '',
            auditDate: '',
            productCode: '',
            channelCode: '',
            token: '',
            type: 'bindCardType',
            applyAmount: '',
            isUpdate: false,

            checkApplyAmount: '',    //审核中URL参数
            checkProductCode: '',
            checkChannelCode: '',
            checkToken: '',

            successRepayPrincipal: '',//审核成功URL参数
            successRepayAmount: '',
            successOrderNo: '',
            successBorrowOrderCode: '',
            successAuditDate: '',
            successProductCode: '',
            successChannelCode: '',
            successToken: '',

        }
      },
      created() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        mobileManager.showBottomBar()  //显示原生底部栏
        mobileManager.clearHomeHistory()  //清首页缓存
      },
      computed: {      //检测数值变化
        countDown () {
          if (!this.auditDate) return '';
          var s2 = new Date()
          var runTime = parseInt((this.auditDate + 7*24*60*60*1000 - s2.getTime()) / 1000)
          var year = Math.floor(runTime / 86400 / 365);
          runTime = runTime % (86400 * 365);
          var month = Math.floor(runTime / 86400 / 30);
          runTime = runTime % (86400 * 30);
          var day = Math.floor(runTime / 86400);
          runTime = runTime % 86400;
          var hour = Math.floor(runTime / 3600);
          runTime = runTime % 3600;
          var minute = Math.floor(runTime / 60);
          runTime = runTime % 60;
          var second = runTime;
          if(day<=0 || hour<=0 || minute<=0){
            this.isUpdate = true
            return '0'+'天' + '0' + '小时'+ '0' + '分'
          } else {
            return day +'天' + hour + '小时'+ minute + '分'
          }
        }
      },
      async mounted(){
        let paramUrl = document.location.href
        //  let paramUrl = 'http://119.23.148.208:8084/appServer/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/OnCheck?applyAmount=4000.00&productCode=LBD_LBB&channelCode=lbdApp&token=151776986161557' //审核中
        //  let paramUrl = 'http://119.23.148.208:8084/appServer/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/OnCheck?repayPrincipal=4000.00&repayAmount=5440.00&orderNo=180704143149730&borrowOrderCode=HLBB20180704655735&auditDate=1530686854000&productCode=LBD_LBB&channelCode=lbdApp&token=151776986161557' //审核成功
        let arr = paramUrl.split('?')
          if (arr[1]) {
            let newArr = arr[1].split('&')
            for(var i=0; i < newArr.length; i++) {
              var item = newArr[i]
              // if (/applyAmount=/.test(item)) {
              //     this.applyAmount = item.split('=')[1];
              //     sessionStorage.applyAmount =  this.applyAmount
              // }
              if (/productCode=/.test(item)) {
                  this.productCode = item.split('=')[1];
                  sessionStorage.productCode =  this.productCode
              }
              if (/channelCode=/.test(item)) {
                  this.channelCode = item.split('=')[1];
                  sessionStorage.channelCode =  this.channelCode
              }
              if (/token=/.test(item)) {
                  this.token = item.split('=')[1];
                  sessionStorage.token =  this.token
              }
              // if (/repayPrincipal=/.test(item)) {
              //     this.repayPrincipal = item.split('=')[1];
              //     sessionStorage.repayPrincipal =  this.repayPrincipal
              // }
              // if (/repayAmount=/.test(item)) {
              //     this.repayAmount = item.split('=')[1];
              //     sessionStorage.repayAmount =  this.repayAmount
              // }
              // if (/orderNo=/.test(item)) {
              //     this.orderNo = item.split('=')[1];
              //     sessionStorage.orderNo =  this.orderNo
              // }
              // if (/borrowOrderCode=/.test(item)) {
              //     this.borrowOrderCode = item.split('=')[1];
              //     sessionStorage.borrowOrderCode =  this.borrowOrderCode
              // }
              // if (/auditDate=/.test(item)) {
              //     this.auditDate = item.split('=')[1] * 1;
              //     if (this.auditDate) {
              //         setInterval(() => {
              //           this.auditDate -= 60*1000;
              //         }, 60*1000)
              //       }
              //     sessionStorage.auditDate =  this.auditDate
              // }
            }
        }
        if(this.token){
          sessionStorage.OnCheckChannelCode = this.channelCode
          sessionStorage.OnCheckToken = this.token
          sessionStorage.OnCheckproductCode = this.productCode
        } else if(this.token==''){
//        this.productCode = sessionStorage.OnCheckProductCode
//        this.channelCode = sessionStorage.OnCheckChannelCode
//        this.token = sessionStorage.OnCheckToken
          this.productCode = sessionStorage.QuickLoanIndexProductCode
          this.channelCode = sessionStorage.QuickLoanIndexChannelCode
          this.token = sessionStorage.QuickLoanIndextToken
        }
        this.getOrderStatusByProductCode()
      },

      methods:{
        back(){
          this.$router.goBack('')
        },
        showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
        },
        toMessageCenter() {   //跳转消息中心
          this.$router.push({ name: 'MessageCenter', params: {}, query:{} })
        },
        toBindCard(){  //跳转子页审批详情
          if(this.isUpdate){           //订单过期时执行
            MessageBox.alert('当前订单已过期，请重新申请订单').then(action => {
                this.cancelApplyOrder()
            })
            return
          }
          let params = {
              repayPrincipal: this.repayPrincipal,
              repayAmount: this.repayAmount,
              orderNo: this.orderNo,
              borrowOrderCode: this.borrowOrderCode,
              auditDate: this.auditDate,
              productCode: this.productCode,
              channelCode: this.channelCode,
              token: this.token,
          }
          sessionStorage.setItem('type',this.type)
          this.$router.push({ name: 'BindCard', params: {type: 'bindCardType',buriedPoint: this.$route.params.buriedPoint}, query: params })
        },
        getOrderStatusByProductCode() {      //乐宝贷App上伪甲方的贷款进度
          let paramsStatus = {
            token: this.token,
            productCode: this.productCode,
            channelCode: this.channelCode,
          }
          Indicator.open({ spinnerType: 'fading-circle' });
          this.$http.post(
            this.lbdUtil.host + '/order/borrowOrder/queryOrderStatusByProductCode',
              this.$qs.stringify(paramsStatus)
            ).then((res) => {
              Indicator.close();
              if(res.data.status =="0000"){
                this.status = res.data.data.status
                if(this.status===1){       //1 审批中
                  this.$route.params.buriedPoint == 'quick' ?  mobileManager.buriedPoint('fastloan_verifying')  :  mobileManager.buriedPoint('one_verifying') //埋点id
                  this.checkPop = true
                  this.checkSucessPop = false
                  this.checkApplyAmount = res.data.data.applyAmount
                  this.checkProductCode = res.data.data.productCode
                  this.checkChannelCode = res.data.data.channelCode
                  this.checkToken = res.data.data.token
                  this.applyAmount = this.checkApplyAmount
                  this.productCode = this.checkProductCode
                  this.channelCode = this.checkChannelCode
                  this.token = this.checkToken
                } else if(this.status===2) {  // 2 审批通过
                  this.$route.params.buriedPoint == 'quick' ?  mobileManager.buriedPoint('fastloan_success_bankcard')  :  mobileManager.buriedPoint('one_success_bandcard') //埋点id
                  this.checkPop = false
                  this.checkSucessPop = true
                  this.successRepayPrincipal = res.data.data.repayPrincipal
                  this.successRepayAmount = res.data.data.repayAmount
                  this.successOrderNo = res.data.data.orderNo
                  this.successBorrowOrderCode = res.data.data.borrowOrderCode
                  this.successAuditDate = res.data.data.auditDate
                  this.successProductCode = res.data.data.productCode
                  this.successChannelCode = res.data.data.channelCode
                  this.successToken = res.data.data.token
                  this.repayPrincipal = this.successRepayPrincipal
                  this.repayAmount = this.successRepayAmount
                  this.orderNo = this.successOrderNo
                  this.borrowOrderCode = this.successBorrowOrderCode
                  this.auditDate = this.successAuditDate
                  if (this.auditDate) {
                    setInterval(() => {
                      this.auditDate -= 60*1000;
                    }, 60*1000)
                  }
                  this.productCode = this.successProductCode
                  this.channelCode = this.successChannelCode
                  this.token = this.successToken
                }
              } else {
                  this.showToast(res.data.msg);
              }
            },(err)=>{
              this.showToast('网络出错');
              Indicator.close();
            });
        },
        cancelApplyOrder() {  //放弃借款
          let params  = this.$route.query;
          let webInfo = this.lbdUtil.getWebInfoUrl();
          this.$http.get(
            this.lbdUtil.host + '/orderApply/cancelApplyOrder?'+ `borrowOrderCode=${params.borrowOrderCode}&token=${params.token}` + webInfo,
            ).then((res) => {
              Indicator.close();
              if(res.data.status==='0000'){
                    this.$router.push({ name: 'HomePageMiss', params: params,}) //从首页进入的绑卡跳转放款中页面
                }
            },(err)=>{
              console.log(err,'请求失败');
          });
        },

      }
  }
</script>
<style lang="less" scoped>
@w:72rem;
  .miss-header{
    padding-top: 44px;
    color: #fff;
    &::after{
      content: '';
      clear: both;
    }
  }
  .miss-header-top{
    width: 100%;
    height: 350/@w;
    background: url('~Img/homePageMiss/miss_top.png')no-repeat center / 100% 100%;
    // background-image: url('~Img/homePageMiss/miss_top.png');
    // background-repeat: no-repeat;
    // background-size:100%;
    p{
      margin: 0;
      &.loan-des{
      position: relative;
      padding: 30/@w 0 20/@w 40/@w;
      span{
        display: inline-block;
        &.loan-des-one{
          position: relative;
          height: 40/@w;
          line-height: 40/@w;
          left: 40/@w;
          font-size: 26/@w;
          &:before{
            content: '';
            display: block;
            left: -35/@w;
            top: 5/@w;
            position: absolute;
            width: 28/@w;
            height: 28/@w;
            background-image: url('~Img/homePageMiss/one_loan.png');
            background-repeat: no-repeat;
            background-size:100%;
          }
        }
        &.loan-des-pro{
          position: absolute;
          right: 0;
          top: 20/@w;
          padding: 10/@w 32/@w;;
          font-size: 28/@w;
          border-top-left-radius: 50/@w;
          border-bottom-left-radius: 50/@w;
          background-color: #F9761E;
          text-align: center;
        }
      }
    }
    &.loan-most{
      font-size: 28/@w;
      text-align: center;
    }
    &.loan-money{
      margin: 0;
      font-size: 70/@w;
      text-align: center;
      color: #FEFEFE;
    }
    &.loan-day{
      color: #fff;
      text-align: center;
    }
    &.loan-slogan{
      text-align: center;
      color: #FFDCAB;
    }
    .loan-time{
        color: #FC5905;
        font-weight: bold;
        margin: 0 5/@w;
      }
    }

  }
  .miss-header-bottom{
    padding: 27/@w 0 20/@w 0;
    background-color: #fff;
    button{
      border: none;
      outline: none;
      height: 75/@w;
      line-height: 75/@w;
      width: 400/@w;
      background-color: #FFA800;
      color: #fff;
      border-radius: 10/@w;
      font-size: 32/@w;
    }
  }
  .imgInfor{
    position: absolute;
    top: 15px;
    right: 37/@w;
    width: 44/@w;
  }
  .miss-requirement{
    margin: 30/@w;
    text-align: center;
    color: #999999;
    p{
      margin: 0;
      font-size: 26/@w;
      letter-spacing: 1px;
      &.total-loan{
        position: relative;
        width: 130/@w;
        margin: 0 auto;
        left: 25/@w;
        white-space: nowrap;
        &:before{
          content: '';
          position: absolute;
          left: -25/@w;
          width: 30/@w;
          height: 30/@w;
          background-image: url(../assets/img/homePageMiss/total_lend.png);
          background-repeat: no-repeat;
          background-size:100%;

        }
      }
      &.total-number{
        margin: 10/@w 0;
        >span{
          color: #808080;
          font-weight: bold;
          margin: 0 10/@w;

        }
      }
      &.total-condition{
        font-size: 26/@w;
      }
    }
  }
  .check-ing{
    color: #4D4D4D;
    font-size: 30/@w;
    .loan-refuse-title{
      position: relative;
      height: 80/@w;
      line-height: 80/@w;
      padding: 0 30/@w;
      background-color: #fff;
      &:after{
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #F0F0F0;
      }
    }
    .loan-refuse-list{
      background-color: #fff;
      >ul{
        li{
          position: relative;
          &:after{
            @diff: 60/@w;
            position: absolute;
            bottom: 0;
            left: 0;
            content: '';
            margin: 0 30/@w;
            display: block;
            width: calc(~"100% - @{diff}");
            height: 1px;
            // margin-left: 30/@w;
            background-color: #F0F0F0;
          }
          >a{
            display: inline-block;
            height: 80/@w;
            line-height: 80/@w;
            padding: 0 30/@w;
          }
          p{
            margin: 0;
            font-size: 26/@w;
            padding: 10/@w 30/@w 20/@w;
            background-color: #f1f3f7;
          }
        }

      }
    }
  }
  .miss-header-bottom{
    padding: 27/@w 0 20/@w 0;
    background-color: #fff;
    button{
      border: none;
      outline: none;
      height: 75/@w;
      line-height: 75/@w;
      width: 400/@w;
      background-color: #FFA800;
      color: #fff;
      border-radius: 10/@w;
      font-size: 32/@w;
    }
  }
	// @w:75rem;
  .stateInfo{
    height: 210/@w;
    width: 100%;
    text-align: center;
    line-height: 210/@w;
    font-size: 35/@w;
    background-color: #FBC205;
  }
  .OrderDetail>ul{
    background-color: #FFFFFF !important;
    >li{
      border: none !important;
      >span{
        font-size: 32/@w;
        color: #FC4601;
      }
      >div{
        font-size: 28/@w !important;
        color: #A0A0A0 !important;
        height: 50/@w !important;
        line-height: 50/@w !important;
        margin-top:8/@w !important;
      }
    }
  }

  .question{
    background-color: #FFFFFF;
    color: #8D8E8E;
    .title{
      height: 80/@w;
      position: relative;
      .title-text{
        font-size: 30/@w;
        height: 40/@w;
        line-height: 40/@w;
        position: absolute;
        top: 50%;
        margin-top: -20/@w;
        display: inline-block;
        padding-left: 30/@w;
      }
    }
  }
  .question-list{
    font-size: 80/@w;
    margin-top: 0/@w;
    >ul>li{
      list-style: none;
      height: 80/@w;
    }
  }
  .buttom{
    width: 100%;
    position:absolute;
      bottom:60/@w;
    background-color: #FFFFFF;
    font-size: 28/@w;
    text-align: center;
  }
  .buttomText{
    display: block;
    color:#8D8E8E;
  }
  .phoneNum{
    display: block;
    margin-top: 10/@w;
    color: #0579BA;
  }

  .lbbImg{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
  }
  .lbbImg>img{
    position: relative;
    width: 700/@w;
    height: 600/@w;
    left: 50%;
    margin-left: -350/@w;
    margin-top: 80/@w;
  }
  .OrderDetailList{
    margin: 0 1%;
    >li{
      float: left;
      width: 23.3%;
      padding: 5%;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span{
        font-size: 33/@w;
        color: #FC4601;
      }
      div{
        margin-top: 10/@w;
        color: #A0A0A0;
      }
    }
  }
  .Router{
    background-color: #fff;
  }

  .question{
    background-color: #FFFFFF;
    color: #8D8E8E;
  }
  .buttom{
    width: 100%;
    position:absolute;
      bottom:60/@w;
    background-color: #FFFFFF;
    font-size: 28/@w;
    text-align: center;
  }
  .buttomText{
    display: block;
    color:#8D8E8E;
  }
  .phoneNum{
    display: block;
    margin-top: 10/@w;
    color: #0579BA;
  }

  .lbbImg{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
  }
  .lbbImg>img{
    position: relative;
    width: 700/@w;
    height: 600/@w;
    left: 50%;
    margin-left: -350/@w;
    margin-top: 80/@w;
  }

.mui-table-view {
    position: relative;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background-color: #fff;
}
.loading{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0,0,0,.3);
  color:#8f8f94;
}
.onCheck-popup{
  position: absolute;
  width: 70%;
  height: 360/@w;
  z-index: 1000;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
  display: inline-block;
  background: #fff;
  text-align: center;
  border-radius: 10/@w;
  padding-top: 30/@w;
  &.reload{
    height: 340/@w;
  }
}


</style>
