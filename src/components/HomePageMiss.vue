<template>
  <div class="">
		<mt-header title="借款" class="lbd-head-normal">
	    	<!-- <mt-button icon="back" @click="back" slot="left"></mt-button> -->
        <!-- <mt-button icon="message" slot="right"></mt-button> -->
        <img  slot="right" v-if="false" @click="toMessageCenter" class="imgInfor" src="../assets/img/Order/message.png"/>
	   		<img  slot="right" v-if="true" @click="toMessageCenter" class="imgInfor" src="../assets/img/Order/messageNo.png"/>
		</mt-header>

    <div class="miss-top">
      <div class="banner" @click="toAuthenticationPage">
          <mt-swipe :auto="5000">
            <mt-swipe-item>
              <img class="banner-img" src="static/img/xed_banner1.png">
            </mt-swipe-item>
            <mt-swipe-item>
              <img class="banner-img" src="static/img/xed_banner2.png">
            </mt-swipe-item>
            <mt-swipe-item>
              <img class="banner-img" src="static/img/xed_banner3.png">
            </mt-swipe-item>
          </mt-swipe>
      </div>

        <div class="notice">
          <em></em>
          <div class="messageList-border">
            <ul class="messageList" :class="{animate: animate}">
              <li v-for="(item, index) in messageList" :key="index"> {{ item.borrowDate}}，{{ item.phone}}，{{ item.username}} {{ item.borrowMoney}}
              </li>
            </ul>
          </div>

        </div>
        <div class="content-border">
          <div class="content">
            <!-- <p class="content-title">小鹅袋 <span>5秒到账 老客额度翻倍 随借随还~</span></p> -->
            <p class="content-title">小鹅袋 <span>独家口子，秒批放款，老客包下款~</span></p>
            <p class="content-money">
              <span>1500</span>
              <span>借款额度(元)</span>
            </p>
            <p class="content-date">
              <span>7天</span>
              <span>借款期限</span>
            </p>
          </div>
        </div>

      <div class="button" align="center">
          <button @click="toAuthenticationPage">马上拿钱</button>
      </div>
    </div>

    <div class="miss-bottom">
      <p class="loan-list-header">
        <span>极速贷款</span>
        <span @click="allProduct">全部产品</span>
      </p>
      <ul class="loan-list-detail">
          <li class="OrderOne" v-for="(item,index) in ColumnList" :key="index"><!--非资方产品-->
            <div class="top">
              <img :src="item.logo">
              <span class="bag">{{ item.name }}</span>
              <i></i>
            </div>
            <div class="bottom">
              <span class="bottom-span left">
                <p class="up">{{ item.quota }}</p>
                <p class="down">预估额度(元)</p>
              </span>
              <span class="bottom-span center">
                <p class="up-out"><span class="up">{{ item.applyCount }}</span>人在申请</p>
                <p class="down">{{  item.periodsScope }}</p>
              </span>
              <span class="bottom-span right">
                <button class="btnAddData" @click="toHomePage(item)">立即申请</button>
              </span>
            </div>
            <div class="tail">{{ item.remark }}</div>
          </li>
           <li class="OrderOne" >      <!--乐宝袋-->
            <div class="top">
              <img src="../assets/img/Order/kouDai.png">
              <span class="bag">乐宝口袋</span>
              <i></i>
            </div>
            <div class="bottom">
              <span class="bottom-span">
                <p class="up">3000-4000</p>
                <p class="down">预估额度(元)</p>
              </span>
              <span class="bottom-span">
                <p class="up-out"><span class="up">8726</span>人在申请</p>
                <p class="down">期限范围：12期</p>
              </span>
              <span class="bottom-span">
                <button class="btnAddData full">名额已满</button>
              </span>
            </div>
            <div class="tail"></div>
          </li>
      </ul>
    </div>

    <div class="userB-shade" v-if="shadeBPop">      <!--B类用户-->
      <div class="userB-shade-content" align="center">
        <div class="shade-content-img">
          <em></em>
          <button @click="toQuickLoanIndex">马上拿钱</button>
        </div>
      </div>
      <!-- <div class="close-btn" @click="shadeBPop=!shadeBPop"><i></i></div> -->
      <div class="close-btn" @click="shadeBPopBtn"><i></i></div>
    </div>
	</div>
</template>
<script>
  import { Toast, MessageBox, Indicator} from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
 	import {grantManager} from '../utils/grant.js'
  export default{
		name:'HomePageMiss',
		data(){
			return{
        status: 0,
        type: '',
        oneLoan: {},
        quickLoan: {},
        oneLoanMaxAmount: '',
        productCode: '',
        channelCode : sessionStorage.QuickLoanIndexChannelCode || '',
        token: sessionStorage.QuickLoanIndextToken || '',
        nowGrantStep: '', //当前需要进行的授权
        nowGrantStepDetails: {
          1: '实名认证',
          2: '身份证认证',
          3: '运营商认证',
          4: '信用卡邮箱认证',
          5: '补充信息认证',
        },
        nowGrantStatus: '',  //	当前认证项的状态
        nowGrantStatusDetails:{
          3: '失败',
          4: '信息过期',
        },
        isLoginStatus: '',
        appParams: {},
        productName: '',
        productSupermarketId: '',

        animate: false,
        messageList: [],
        shadeBPop: false, //url传递的值true显示B类首页
        idB: '',
        ColumnList: [],
        isScroll: 'scroll',
			}
    },
    created() {
      //原生访问的方法
      window.afterAuth=this.afterAuth;
      window.nativeToQuickLoan = this.nativeToQuickLoan;


      this.characterCarousel()
      mobileManager.clearHomeHistory()  //清首页缓存
      mobileManager.enableRefresh(false)  //下拉刷新
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      mobileManager.showBottomBar()  //显示原生底部栏
      let paramUrl = document.location.href
      let arr = paramUrl.split('?')
      if (arr[1]) {
        let newArr = arr[1].split('&')
        for(var i=0; i < newArr.length; i++) {
          var item = newArr[i]
          // if (/productCode=/.test(item)) {
          //     this.productCode = item.split('=')[1];
          // }
          if (/channelCode=/.test(item)) {
              this.channelCode = item.split('=')[1];
          }
          if (/token=/.test(item)) {
              this.token = item.split('=')[1];
          }
          if (/id=/.test(item)) {
              this.idB = item.split('=')[1];
          }
          if (/shadeBPop=/.test(item)) {
              this.shadeBPop = item.split('=')[1];
              this.isScroll = 'hidden'
          }
        }
      }
      if(this.token){
        sessionStorage.QuickLoanIndexChannelCode = this.channelCode
        sessionStorage.QuickLoanIndextToken = this.token
        // sessionStorage.productCode = this.productCode
      } else {
        // this.productCode = sessionStorage.QuickLoanIndexProductCode
        this.channelCode = sessionStorage.QuickLoanIndexChannelCode
        this.token = sessionStorage.QuickLoanIndextToken
      }


    },

    mounted() {
      document.documentElement.style.overflow = this.isScroll;

      window.loginOut = this.loginOut

      setInterval(this.scroll, 2000);
      this.getIndexColumn()
    },
		methods:{
			back(){
				this.$router.goBack('')
      },
      shadeBPopBtn() {  //关闭B类页面按钮
        this.shadeBPop = false
        //关闭层的时间别忘了在加上这句：
        document.documentElement.style.overflow = "scroll";

      },
      nativeToQuickLoan() {  //原生调用登录后执行的按钮进去产品首页
        if(this.shadeBPop){
          //在调用显示层时加上这句js代码就可以了：
          this.toQuickLoanIndex()
        } else {
          this.toAuthenticationPage()
        }

      },
      characterCarousel(){  //文字轮播
        let webInfo = this.lbdUtil.getWebInfoUrl();
        this.$http.get(
          this.lbdUtil.host + `/app/home/characterCarousel`,
          ).then((res) => {
            // this.messageList = res.data
            if(res.data.status =="0000"){
              this.messageList = res.data.data
            } else {
              this.showToast(res.data.msg)
            }
          },(err)=>{
            this.showToast('网络出错');
					});
      },
      product(){
        mobileManager.buriedPoint('one_product_manual')  //埋点id
      },
      afterAuth() {
	    	mobileManager.hideBottomBar();
	    },

      showToast:function(msg){
          Toast({
            message: msg,
            position: 'bottom',
            duration: 3000
          });
      },

      loginOut(){  //退出登录
        this.isLoginStatus !='1234'
       },
      async isLogin() { //用户是否登录接口
        let webInfo = this.lbdUtil.getWebInfoUrl();
        Indicator.open({ spinnerType: 'fading-circle' });
        if(!this.token) this.token = sessionStorage.QuickLoanIndextToken
        let url = this.lbdUtil.host + '/user/webUserLogin/isLogin?'+ `token=${sessionStorage.QuickLoanIndextToken}` + webInfo
        let res
        try {
          res = await this.$http.get(url);
        }
        catch (e) {
          this.showToast('网络出错');
          Indicator.close();// 加载不到逻辑
        }
        Indicator.close();  //加载后执行
        this.isLoginStatus = res.data.status
        console.log( '登录状态isLoginStatus:' + res.data.status)
      },
      toMessageCenter() {   //跳转消息中心
        this.$router.push({ name: 'MessageCenter', params: {token: this.token }, query:{} })
      },


      async toHomePage(item){   //跳转小额贷产品首页
        // let webInfo = this.lbdUtil.getWebInfoUrl();
        // window.location.href = this.lbdUtil.host + `/product/h5/detail?id=${id}&token=${sessionStorage.QuickLoanIndextToken || ''}&moblie=''` + webInfo//token没有值的时候传空值
        mobileManager.openProductDetail(item.id, item.name)  //原生跳转资方详情页
        // let params = {
        //   id: id,
        //   token: sessionStorage.QuickLoanIndextToken,
        //   productCode: sessionStorage.QuickLoanIndexProductCode,
        //   channelCode: sessionStorage.QuickLoanIndexChannelCode,
        // }
        // this.$router.push({name:'Exhausting', params: params, query:{pageType: 0, id: id} })

        },
      clickRecord(productName,productSupermarketId){   //申请人数接口
        let webInfo = this.lbdUtil.getWebInfoUrl();
          Indicator.open({ spinnerType: 'fading-circle' });
          this.$http.get(
          this.lbdUtil.host + `/product/clickRecord?productName=${productName}&productSupermarketId=${productSupermarketId }&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&token=${sessionStorage.QuickLoanIndextToken}` + webInfo,
          ).then((res) => {
             Indicator.close();
            if(res.data.status =="0000"){
            } else {
              // this.showToast(res.data.msg)
            }
          },(err)=>{
            this.showToast('网络出错');
            Indicator.close();
					});
      },
      getAuthenticationProcess(){  //用戶授权进度
        let webInfo = this.lbdUtil.getWebInfoUrl();
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host + '/userInfo/authenticationProcess?'+ `channelCode=${sessionStorage.QuickLoanIndexChannelCode}&token=${sessionStorage.QuickLoanIndextToken}` + webInfo,
          ).then((res) => {
             Indicator.close();
            if(res.data.status =="0000"){
              this.nowGrantStep = res.data.data.nowGrantStep
              this.nowGrantStatus = res.data.data.nowGrantStatus
              // this.authenticationPageJudge()
            } else {
              this.showToast(res.data.msg)
            }
          },(err)=>{
            this.showToast('网络出错');
            Indicator.close();
					});
      },
      async toAuthenticationPage(){  //马上拿钱按钮 进入认证页面
        mobileManager.buriedPoint('one_take_money_immediately')  //埋点id
        await this.isLogin()
        if(this.isLoginStatus !== '0000') {
          mobileManager.startLoginActivity(1)//跳转app登录
          return
        }
        if(sessionStorage.QuickLoanIndextToken){
          this.clickRecord(this.productName, this.productSupermarketId)
        }
        this.$router.push({ name: 'QuickLoanIndex', params: {id: this.productSupermarketId, productCode: sessionStorage.QuickLoanIndexProductCode, channelCode: sessionStorage.QuickLoanIndexChannelCode, token: sessionStorage.QuickLoanIndextToken, type: 'homePageMiss'}, query:{id: this.productSupermarketId} })

      },

      allProduct(){ //全部产品跳转
        mobileManager.startWecashActivity()
      },
      scroll () {
        this.animate = true;
        setTimeout(() => {
          this.messageList.push(this.messageList[0]);
          this.messageList.shift();
          this.animate = false;
        }, 1500);
      },

      toQuickLoanIndex() {  //B类马上拿钱跳转极速贷产品首页
         this.$router.push({ name: 'QuickLoanIndex', params: {id:  this.productSupermarketId, productCode: sessionStorage.QuickLoanIndexProductCode, channelCode: sessionStorage.QuickLoanIndexChannelCode, token: sessionStorage.QuickLoanIndextToken, type: 'homePageMiss'}, query:{id: this.productSupermarketId} })
      },

      getIndexColumn() {   //产品非资方列表接口
          this.$http.get(
          // this.lbdUtil.host + `/product/getMoreByProductType?firstLogin=0&appDownChannel=PP&reqApplicationType=LBD&mobileModel=MIMAX&versionCode=40&userId=&token=&osName=android&osVersion=7.0&tokenUserId=&reqApplicationVersion=40&pageSize=100`,
          this.lbdUtil.host + `/product/getMoreByProductType?productType=1&reqApplicationType=LBD&versionCode=41&reqMobile=17725886534&token=${sessionStorage.QuickLoanIndextToken}&pageNumber=1&pageSize=100&firstLogin=0&appDownChannel=PP&mobileModel=MIMAX&osName=android&osVersion=7.0&tokenUserId=1811408478975050&reqApplicationVersion=41`
          ).then((res) => {
            if(res.data.status =="0000"){
              this.ColumnList = res.data.data
              console.log(this.ColumnList)
            } else {
              this.showToast(res.data.msg)
            }
          },(err)=>{
            this.showToast('网络出错');
					});
      }

    }
  }

</script>
<style scoped lang="less">
  @w:72rem;

  .miss-bottom{
    margin-top: 20/@w;
    background-color: #fff;
    &::before{
      display:block;
      content:"clear";
      height:0;
      clear:both;
      overflow:hidden;
      visibility:hidden;
    }
    &::after{
      display:block;
      content:"clear";
      height:0;
      clear:both;
      overflow:hidden;
      visibility:hidden;
    }
    .loan-list-header{
      margin: 0 30/@w;
      height: 80/@w;
      line-height: 80/@w;
      background-color: #fff;
      span{
        display: inline-block;
        &:nth-child(1){
          position: relative;
          left: 20/@w;
          font-size: 30/@w;
          color: #4d4d4d;
          &:before{
            position: absolute;
            top: 23/@w;
            left: -20/@w;
            content: '';
            display: block;
            height: 35/@w;
            width: 5/@w;
            background-color: #FBC205;
          }
        }
        &:nth-child(2){
          float: right;
          font-size: 26/@w;
          color: #57BDFD;
        }
      }

    }
  }
  .userB-shade{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1010;
      background-color: rgba(0,0,0,.3);
      .close-btn{
        width: 60/@w;
        margin: 150/@w auto 0;
        i{
          display: inline-block;
          width: 60/@w;
          height: 60/@w;
          border-radius: 60/@w;
          text-align: center;
          background-image: url('~Img/delete_homepage.png');
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .userB-shade-content{
        width: 500/@w;
        height: 400/@w;
        border-radius: 20/@w;
        margin: 50% auto 0;
        background-color: #fff;
        .shade-content-img{
          height: 525/@w;
          background-color: #fff;
          border-radius: 12/@w;
        }
        em{
          display: block;
          width: 500/@w;
          height:390/@w;
          background-image: url('../../static/img/backgroundB.png');
          background-repeat: no-repeat;
          background-size: 100%;
          border-top-left-radius: 12/@w;
          border-top-right-radius: 12/@w;
          overflow: hidden;
        }
        button{
          margin-top: 40/@w;
          border: none;
          outline: none;
          height: 60/@w;
          line-height: 60/@w;
          width: 200/@w;
          background-color: #FFA800;
          color: #fff;
          border-radius: 10/@w;
          font-size: 28/@w;
        }
      }
    }

  .imgInfor{
    position: absolute;
    top: 15px;
    right: 37/@w;
    width: 44/@w;
  }
  .OrderOne{
    background: #fff;
    border-top: solid 10/@w #F0F0F0;
    letter-spacing: 1px;
    .top{
      position: relative;
      height: 80/@w;
      line-height: 80/@w;
      margin: 0 30/@w;
      border-bottom: 1px solid #F0F0F0;
      img{
        float: left;
        width: 40/@w;
        height: 40/@w;
        margin: 20/@w 15/@w 0 12/@w;
      }
      span{
        display: inline-block;
        &.bag{
          float: left;
          width: 180/@w;
          font-size: 30/@w;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.time{
          float: left;
          color: #ABABAB;
        }
        &.spanData{
          float: right;
          color: lightsalmon;
        }
      }
      i{
        position: absolute;
        top: 0;
        left: 210/@w;
        display: inline-block;
        width: 30/@w;
        height: 40/@w;
        background-image: url('~Img/homePageMiss/new_icon1.png');
        background-repeat: no-repeat;
        background-size:100%;
      }
    }
    .bottom{
      height: 140/@w;
      margin: 0 30/@w;
      justify-content: space-around;
      text-align: center;
      border-bottom: 1px solid #F0F0F0;
      .bottom-span{
        display: inline-block;
        float:left;
        width: 33.3%;
        &.left{
          width: 29.3%;
        }
        &.center{
          width: 40.3%;
        }
        &.right{
          display: inline-block;
          width: 30.3%;
          margin: a auto;
        }

      }
      p.up-out{
        margin-top: 20/@w;
        margin-bottom: 0;
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .up{
        margin-top: 20/@w;
        font-family:Microsoft YaHei;
        font-size: 30/@w;
        color: #FC5605;
        margin-bottom: 0;
        text-align: center;
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .down{
        width:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 10/@w;
        font-family:Microsoft YaHei;
        font-size: 26/@w;
        color: #999999;
        text-align: center;
      }

      .btnAddData{
        width: 138/@w;
        height: 60/@w;
        background-color: #FFA800;
        border-radius: 16/@w;
        border: none;
        margin: 40/@w auto;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.full{
          background-color: #999999;
        }
      }
    }
    .tail{
      @margin:60/@w;
      width: calc(~"100% - @{margin}");
      margin: 0 30/@w;
      height: 70/@w;
      line-height: 70/@w;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #A0A0A0;
    }

  }
  .miss-top{
    margin-top: 50px;
    &::after{
      content: '';
      clear: both;
    }
    .banner{
      height: 290/@w;
      background-color: #fff;
      .banner-img{
        width: 100%;
        height: 290/@w;

      }
    }
    .notice{
      line-height:100/@w;
      background-color: #FFC75A;
      color: #fff;
      em{
        float: left;
        display: inline-block;
        margin-left: 40/@w;
        margin-top: 10/@w;
        width: 40/@w;
        height: 36/@w;
        background: url('~Img/homePage/message.png')no-repeat center / 100% 100%;
      }
      .messageList-border{

        // @cap: 80/@w;
        // width: calc(~"100% - @{cap}");
        height: 60/@w;
        overflow: hidden;
        margin: 15/@w 0;
      }
      ul{
        float: left;
        margin-left: 20/@w;
        height: 500/@w;

        &.animate {
          transition: all 1.5s;
          margin-top: -60/@w;
        }

        li{
          // width: 100%;
          height: 60/@w;
          line-height: 60/@w;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

      }

    }
    .content-border{
      width: 100%;
      background-color: #fff;
      margin: 0 auto;
      padding-top:20/@w;
    }
    .content{
      position: relative;
      width: 90%;
      margin: 0 auto;
      height: 320/@w;
      background: url('~Img/homePage/background.png')no-repeat center / 100% 100%;
      color: #fff;

      .content-title{
        position: relative;
        height: 60/@w;
        line-height: 60/@w;
        font-weight: bold;
        padding-top: 10/@w;
        margin: 0 10/@w;
        font-size: 26/@w;
        text-indent: 1em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        >span{
          font-weight: 1!important;
        }
        &:after{
          position: absolute;
          content: '';
          height: 1px;
          width: 100%;
          bottom: 0;
          left: 0;
          background-color: #FFCE16;
        }
      }
      .content-money{
        position: absolute;
        top: 80/@w;
        left: 40/@w;
        float: left;
        width:200/@w;
        text-align: left;
        >span{
          margin-left: 40/@w;
          display: block;
          &:nth-child(1){
            font-size: 52/@w;
            height: 80/@w;
            line-height: 80/@w;
          }
          &:nth-child(2){
            font-size: 26/@w;
            height: 40/@w;
            line-height: 40/@w;
          }
        }
      }
      .content-date{
        position: absolute;
        top: 80/@w;
        right: 40/@w;
        float: left;
        width: 200/@w;
        height: 80/@w;
        line-height: 80/@w;
        text-align: center;
        color: #fff;
        margin-left: 30%;
        >span{
          margin-right: 100/@w;
          display: block;
          &:nth-child(1){
            font-size: 32/@w;
            height: 80/@w;
            line-height: 80/@w;
          }
          &:nth-child(2){
            font-size: 24/@w;
            height: 40/@w;
            line-height: 40/@w;
          }
        }
      }

    }

    .button{
      padding: 27/@w 0 20/@w 0;
      background-color: #fff;
      button{
        border: none;
        outline: none;
        height: 70/@w;
        line-height: 70/@w;
        width: 400/@w;
        background-color: #FFA800;
        color: #fff;
        border-radius: 10/@w;
        font-size: 32/@w;
      }
    }

  }

</style>
