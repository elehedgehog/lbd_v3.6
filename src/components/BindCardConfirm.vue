<template>
  <div>
    <div v-show="!showProtocol">
      <mt-header title="绑卡确认" class="lbd-head-normal">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
      </mt-header>
      <!--信息列表-->
      <div class="content-box">
        <ul class="content-box-list">
          <li>
            <b>贷款总额</b>
            <i @click="showDetails">?</i>
            <span>{{loanMoney}}元(到账{{accountMoney}}元)</span>
          </li>
          <li>
            <b>期限</b>
            <span>7天</span>
          </li>
          <li>
            <b>总还款金额</b>
            <span>{{expireMoney}}元</span><!-- 1000+(1000*0.001*7) = 1000*(1+0.007)-->
          </li>
        </ul>
      </div>
      <!--选择银行卡-->
      <div class="car-box">
        <div class="car-box-title">
          <p>选择银行卡(仅支持储蓄卡)</p>
        </div>
        <div class="car-box-content" @click="showCardList">
          <div v-show="isSelectCar" class="car-box-content-select">
            <span>请选择/请添加银行卡</span>
          </div>
          <div v-show="!isSelectCar" class="car-box-content-select-done">
            <img :src="carLogoUrl" alt="">
            <span>{{bankName}} ({{cardLastCode}})</span>
            <i></i>
          </div>
        </div>
      </div>

      <!--我已阅读-->
      <div class="button-box">
        <p class="checkbox font_s">
          <label>
            <input type="checkbox" v-model="isRead">
          </label>
          <span @click="toProtocolPage">
          我已阅读并同意《个人消费借款及服务合同》
        </span>
        </p>
        <!--<button @click="test">test</button>-->
        <button
          :disabled="!canSubmit"
          :style="{background:canSubmit?'#FF8900':'#777777'}"
          @click="toBindCard"
        >绑卡确认</button>
        <!--<p>完成绑卡确认后，审批通过将直接放款</p>-->
        <p>完成绑卡确认后，如审批通过直接放款</p>
        <p id="text">
          注：部分资金方在审批通过后，会有开户授权的流程，具体可留意短信通知或定期点击APP底部【订单】查看，如该项流程在24小时内尚未完成，则将为您自动切换其他资金方直接放款。
        </p>
      </div>
      <Popup
        :isShow="popupInfo.isShow"
        :popupADataInfo="popupADataInfo"
        @closePopup="closePopup"
      ></Popup>
      <!--银行卡信息-->
      <bank-msg-popup
        :isShow="popupBankMsg.isShow"
        @closeBankPopup="closeBankPopup"
      ></bank-msg-popup>

    </div>

    <div id="viewDiv" v-show="showProtocol">
      <mt-header title="个人消费借款及服务合同" class="lbd-head-normal">
        <mt-button icon="back" slot="left" @click="backPage"></mt-button>
      </mt-header>
      <!--<div id="w">-->

      <!--</div>-->
      <iframe :src="url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  import Popup from './HomeWhiteListAPopup';
  import bankMsgPopup from './bankMsgPopup';
  import { MessageBox, Indicator, Toast } from 'mint-ui';
  import { grantManager } from '../utils/grant.js'
  import { mobileManager } from '../utils/WebInfo.js'

  export default {
    data() {
      return {
        loanMoney:'1500', //1000
        // accountMoney:'800',
        // expireMoney:'1007',
        isOrder:'',
        url:'',
        isRead:true,
        popupInfo:{
          isShow:false
        },
        popupBankMsg:{
          isShow:false
        },
        isSelectCar:true,
        carLogoName:'CMB',
        token:sessionStorage.getItem('lbdApp-token')||'',
        productCode:sessionStorage.getItem('lbdApp-productCode')||'',
        channelCode:sessionStorage.getItem('lbdApp-channelCode')||'',

        // bankName:sessionStorage.getItem('lbdApp-bankName')||'',
        // cardCode:sessionStorage.getItem('lbdApp-cardCode')||'',
        // bankAddress:sessionStorage.getItem('lbdApp-bankAddress')||'',
        // reservedMobile:sessionStorage.getItem('lbdApp-reservedMobile')||'',
        // userAccountId:sessionStorage.getItem('lbdApp-userAccountId')||'',
        // pageTypes:sessionStorage.getItem('lbdApp-pageTypes')||'', // order 为h5订单中心过来，绑卡分有感 无感
        bankName:'',
        cardCode:'',
        bankAddress:'',
        reservedMobile:'',
        userAccountId:'',
        pageTypes:'',

        cardLastCode:'',
        params: this.$route.query,

        showProtocol:false,
        borrowOrderCode:sessionStorage.getItem('lbdApp-borrowOrderCode')||'',
        borrowCode:sessionStorage.getItem('lbdApp-borrowOrderCode')||'',
        productDetail:{
          jinDanMoney:sessionStorage.getItem('lbdApp-jinDanMoney')||''
        },
        typeContinue:sessionStorage.getItem('lbdApp-typeContinue')||'' // 用于判断是否'继续页面'进入
      }
    },
    computed: {
      popupADataInfo:{
        get(){
          return {
            loanMoney: this.loanMoney,
            accountMoney:this.accountMoney,
            expireMoney: this.expireMoney,
            needPoint:'360',
            gainPoint:'300'
          }
        }
      },
      accountMoney:{
        get(){
          let num = this.loanMoney * 0.8 ;
          num *= Math.pow(10,3);
          num = Math.round(num);
          num /= Math.pow(10,3);
          return num;
        }
      },
      expireMoney:{
        get(){
          let num = this.loanMoney * (1 + 0.1 / 100 * 7 ) ;
          num *= Math.pow(10,3);
          num = Math.round(num);
          num /= Math.pow(10,3);
          return num;
        }
      },
      carLogo:{
        get(){ return this.carLogoName + '.png' },
        set(v){ this.carLogo = v; }
      },
      carLogoUrl:{
        get(){ return require('../assets/img/bank_icon/'+this.carLogo); }
      },
      canSubmit:{
        get(){
          return this.isRead && !this.isSelectCar;
        },
        // set(){ this.canSubmit = this.isRead; }
      }
    },
    components:{ Popup, bankMsgPopup },
    methods: {
      test(){
        console.log('--');
        if(this.typeContinue=='true'){
          mobileManager.ensureToOrder()
        }else{
          console.log(`isOrder:${this.isOrder}`);
          if(this.isOrder === '1'){ // 是订单中，调用前端路由
            mobileManager.showOrHideBottomByOrder(true);   //显示原生底部栏
            this.$router.push({ name: 'Order', params: {}, query: {} });
          }
          else{ // 不是订单中心，调用android方法
            console.log('调原生--');
            mobileManager.showBottomBar();   //显示原生底部栏
            // mobileManager.showOrHideBottomByOrder(true);   //显示原生底部栏
            mobileManager.skipToOrder();  //原生跳订单中心
          }
        }
      },
      //提示
      showToast(msg){
        Toast({
          message: msg,
          position: 'bottom',
          duration: 3000
        });
      },

      // 协议外层
      backPage(){
        this.showProtocol = false
      },
      // 协议页
      toProtocolPage(){
        let url = this.lbdUtil.host + '/userInfo/selectUser?token='+this.token;
        // window.location.href=this.lbdUtil.host + url;
        this.showProtocol = true;
      },
      back(){
        // this.$router.goBack('')
        /*
        this.$router.push({
          name: 'Order',
          params: {
            buriedPoint: 'quick' //埋点传值判断
          },
          query: {
            productCode: this.productCode,
            channelCode: this.channelCode,
            token: this.token,
            applyAmount: this.productDetail.jinDanMoney,
          }
        });
        */
        if(this.typeContinue=='true'){
          console.log(`typeContinue: ${this.typeContinue}`);
          mobileManager.finishActivity();
        }
        else{
          // let isOrder = mobileManager.isOrderCenter();
          console.log(`isOrder:${this.isOrder}`);
          if(this.isOrder === '1'){ // 是订单中，调用前端路由
            mobileManager.showOrHideBottomByOrder(true);   //显示原生底部栏
            this.$router.push({ name: 'Order', params: {}, query: {} });
          }
          else{ // 不是订单中心，调用android方法
            console.log('调原生--');
            mobileManager.showBottomBar();   //显示原生底部栏
            mobileManager.skipToOrder();  //原生跳订单中心
          }
        }
      },
      // 绑卡确认
      toBindCard(){
        // this.showBankPopup();
        // return;

        // mobileManager.buriedPoint('fastloan_apply_immediately') ;//埋点id

        // if(this.pageTypes==='order'){ // 从h5订单中心进来
        //   this.getBindCardOrder();
        // }
        // else{
          this.getBindCard();
        // }


        // this.$router.push({
        //   name: 'Order',
        //   // params: {
        //   //   buriedPoint: 'quick' //埋点传值判断
        //   // },
        //   query: {
        //     productCode: this.productCode,
        //     channelCode: this.channelCode,
        //     token: this.token,
        //     // applyAmount: this.productDetail.jinDanMoney
        //   }
        // });
        // this.$router.push('order')
      },
      // 绑卡接口
      getBindCard( ) {
        Indicator.open({
          spinnerType: 'fading-circle'
        });
        let webInfo = this.lbdUtil.getWebInfoUrl();
        let paramsObj = {
          bankAccount:this.cardCode,
          bankAddress:this.bankAddress,
          bankName:this.bankName,
          borrowOrderCode:this.borrowOrderCode,
          reservedMobile:this.reservedMobile,
          token:this.token,
          userAccountId:this.userAccountId,
        };
        // let url = '/user/userAccount/bindCard?&token=' + this.token + '&userAccountId=' + this.userAccountId + '&borrowCode=' + this.borrowOrderCode;
        let url = '/user/userAccount/bindCard?&token=' + this.token + '&userAccountId=' + this.userAccountId + '&borrowOrderCode=' + this.borrowOrderCode; // 2018.09.13 16:13 欢哥要求把borrowCode 改成borrowOrderCode
        this.$http.get(
          this.lbdUtil.host + url,{}
          // { params:paramsObj }
        ).then((res) => {
          Indicator.close();
          this.bindCardData = res.data.data;
          console.log(res,'绑卡');
          if(res.data.status==='0000'){
            if(this.bindCardData.bindCardUrl) {  //有感绑卡需要跳转H5地址 第三方页面
              // this.$router.push({ name: 'ThirdBandCard', params:{ bindCardData: this.bindCardData.bindCardUrl }, query:{} })
              window.location.href = this.bindCardData.bindCardUrl;
              return ;
            }
            /*
            this.$router.push({
              name: 'Order',
              params: {
                buriedPoint: 'quick' //埋点传值判断
              },
              query: {
                productCode: this.productCode,
                channelCode: this.channelCode,
                token: this.token,
                applyAmount: this.productDetail.jinDanMoney,

              }
            });
            */

            if(this.typeContinue=='true'){
              mobileManager.ensureToOrder()
            }else{
              // let isOrder = mobileManager.isOrderCenter();
              console.log(`getBindCard->isOrder:${this.isOrder}--`);
              if(this.isOrder === '1'){ // 是订单中，调用前端路由
                mobileManager.showOrHideBottomByOrder(true);   //显示原生底部栏
                this.$router.push({ name: 'Order', params: {}, query: {} });
              }
              else{ // 不是订单中心，调用android方法
                console.log('调原生--');
                mobileManager.showBottomBar();   //显示原生底部栏
                // mobileManager.showOrHideBottomByOrder(true);   //显示原生底部栏
                mobileManager.skipToOrder();  //原生跳订单中心
              }
            }
          } else {
            this.showToast(res.data.msg)
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
        });
      },
      // 绑卡接口order
      getBindCardOrder(paramsAll) {
        let webInfo = this.lbdUtil.getWebInfoUrl();
        let paramsObj = {
          bankAccount:this.cardCode,
          bankAddress:this.bankAddress,
          bankName:this.bankName,
          borrowOrderCode:this.borrowOrderCode,
          reservedMobile:this.reservedMobile,
          token:this.token,
          userAccountId:this.userAccountId,
        };
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host + '/user/userAccount/bindCard?'+ webInfo.substr(1),
          { params: paramsObj }
        ).then((res) => {
          Indicator.close();
          this.bindCardData = res.data.data;
          if(res.data.status==='0000'){
            if(this.bindCardData.bindCardUrl) {  //有感绑卡需要跳转H5地址 第三方页面
              // this.$router.push({ name: 'ThirdBandCard', params:{ bindCardData: this.bindCardData.bindCardUrl }, query:{} })
              window.location.href = this.bindCardData.bindCardUrl;
            } else {
              this.getApplyOrder()  //无感绑卡确认绑卡接口
            }
          } else {
            this.showToast(res.data.msg)
          }
        },(err)=>{
          this.showToast('网络出错');
          Indicator.close();
        });
      },
      //无感绑卡确认绑卡接口
      getApplyOrder() {   //无感绑卡确认绑卡接口
        let params  = this.$route.query;
        let webInfo = this.lbdUtil.getWebInfoUrl();
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host + '/orderApply/applyOrder?'+ webInfo.substr(1) + `&borrowOrderCode=${params.borrowOrderCode}&token=${params.token}`,
          {}
        ).then((res) => {
          Indicator.close();
          if(res.data.status==='200003'){
            this.showToast(res.data.msg);
          } else {
            this.showToast('绑卡成功')
            this.$router.push({ name: 'Order', params:{}, query:{} }) //跳转至入口（首页或者订单中心）
          }

        },(err)=>{
          this.showToast('网络出错');
          Indicator.close();
        });
      },

      // 显示详情
      showDetails(){
        this.popupInfo.isShow = true;
      },
      // 关闭popup
      closePopup(res){
        this.popupInfo.isShow = res;
      },
      // 显示银行popup
      showBankPopup(){
        this.setOverflowType("hidden");
        this.popupBankMsg.isShow = true;
      },
      // 银行卡弹窗
      closeBankPopup(type){
        this.setOverflowType("scroll");
        this.popupBankMsg.isShow = false;
        if(type === '1'){
          console.log('点击了立即验证');
          let paramsObj = {
            productCode:this.productCode,
            channelCode:this.channelCode,
            token:this.token,
            pageType:'BindCardConfirm',
            bankName:sessionStorage.getItem('lbdApp-bankName'),
            bankAccount:sessionStorage.getItem('lbdApp-cardCode'),
            reservedMobile:sessionStorage.getItem('lbdApp-reservedMobile'),
          };
          this.$router.push({name:'VerifyCard', params:paramsObj, query:paramsObj});
        }
      },
      // 设置可否滑动
      setOverflowType(type){
        document.documentElement.style.overflow = type;
      },
      // 跳转到卡列表
      showCardList(){
        // this.isSelectCar = !this.isSelectCar;
        let paramsObj = {
          productCode:this.productCode,
          channelCode:this.channelCode,
          token:this.token,
          pageType:'BindCardConfirm',
          borrowOrderCode:this.borrowOrderCode

          /*
          bankName:this.bankName,
          carLogoName:this.carLogoName,
          isSelectCar:this.isSelectCar,
          cardCode:this.cardCode,
          cardLastCode:this.cardLastCode,
          bankAddress:this.bankAddress,
          reservedMobile:this.reservedMobile,
          userAccountId:this.userAccountId
          */
        };
        // if(sessionStorage.pageTypes == 'order') {
        //   this.$router.push({name:'SelectBankCard', params:paramsObj, query:paramsObj});
        // } else {
          this.$router.push({name:'SelectBankCardA', params:paramsObj, query:paramsObj});
        // }
      },
      //获取url信息
      getUrlMsg(){
        let paramUrl = document.location.href;
        let arr = paramUrl.split('?');
        if (arr[1]) {
          let newArr = arr[1].split('&');
          console.log('newArr-----------');
          console.log(newArr);
          for(var i=0; i < newArr.length; i++) {
            var item = newArr[i];
            // productCode
            if (/productCode=/.test(item)) {
              if(item.split('=')[1]) {
                this.productCode = item.split('=')[1];
                sessionStorage.setItem('lbdApp-productCode', this.productCode);
              }
            }else{
              this.productCode = sessionStorage.getItem('lbdApp-productCode');
            }
            // channelCode
            if (/channelCode=/.test(item)) {
              if(item.split('=')[1]) {
                this.channelCode = item.split('=')[1];
                sessionStorage.setItem('lbdApp-channelCode', this.channelCode);
              }
            }else{
              this.channelCode = sessionStorage.getItem('lbdApp-channelCode');
            }
            // token
            if (/token=/.test(item)) {
              if(item.split('=')[1]){
                this.token = item.split('=')[1];
                sessionStorage.setItem('lbdApp-token', this.token);
              }
            }else{
              this.token = sessionStorage.getItem('lbdApp-token');
            }
            // typeContinue
            if (/typeContinue=/.test(item)) {
              if(item.split('=')[1]) {
                this.typeContinue = item.split('=')[1];
                sessionStorage.setItem('lbdApp-typeContinue', this.typeContinue);
              }
            }else{
              this.typeContinue = sessionStorage.getItem('lbdApp-typeContinue');
            }
            // borrowOrderCode
            if (/borrowOrderCode=/.test(item)) {
              if(item.split('=')[1]) {
                this.borrowOrderCode = item.split('=')[1];
                sessionStorage.setItem('lbdApp-borrowOrderCode', this.borrowOrderCode);
              }
            }else{
              this.borrowOrderCode = sessionStorage.getItem('lbdApp-borrowOrderCode');
            }
            // pageType
            if (/pageType=/.test(item)) {
              if(item.split('=')[1]) {
                this.pageType = item.split('=')[1];
                sessionStorage.setItem('lbdApp-pageType', this.pageType);
              }
            }else{
              this.pageType = sessionStorage.getItem('lbdApp-pageType');
            }
            // applayAmount
            if (/applayAmount=/.test(item)) {
              if(item.split('=')[1]) {
                this.productDetail.jinDanMoney = item.split('=')[1];
                sessionStorage.setItem('lbdApp-jinDanMoney', this.productDetail.jinDanMoney);
              }
            }else{
              this.productDetail.jinDanMoney = sessionStorage.getItem('lbdApp-jinDanMoney');
            }

            /*
            if (/bankName=/.test(item)) {
              this.bankName = item.split('=')[1];
            }
            if (/carLogoName=/.test(item)) {
              this.carLogoName = item.split('=')[1];
            }
            if (/isSelectCar=/.test(item)) {
              this.isSelectCar = item.split('=')[1];
            }
            if (/cardCode=/.test(item)) {
              this.cardCode = item.split('=')[1];
            }
            if (/cardLastCode=/.test(item)) {
              this.cardLastCode = item.split('=')[1];
            }
            if (/bankAddress=/.test(item)) {
              this.bankAddress = item.split('=')[1];
            }
            */
          }
        }
        console.log(`sessionStorage:${sessionStorage.getItem('lbdApp-token')}`);
      },
      // 设置选卡信息
      setBankInfo(){
        if(this.$route.params.bankName) {
          this.bankName = this.$route.params.bankName;
          this.carLogoName = this.lbdUtil.getBankNameOfCode(this.bankName);
          this.isSelectCar = false;
          sessionStorage.setItem('lbdApp-bankName', this.bankName);
          sessionStorage.setItem('lbdApp-carLogoName', this.carLogoName);
          sessionStorage.setItem('lbdApp-isSelectCar', this.isSelectCar);
          // console.log(`0-this.isSelectCar:${this.isSelectCar}---${typeof this.isSelectCar}`);
        }
        else{
          this.bankName = sessionStorage.getItem('lbdApp-bankName');
          this.carLogoName = sessionStorage.getItem('lbdApp-carLogoName') || 'CMB';
          this.isSelectCar = (sessionStorage.getItem('lbdApp-isSelectCar') === 'false') && false;

          if(!sessionStorage.getItem('lbdApp-isSelectCar')){
            // 第一次进这个页面sessionStorage为null时，this.isSelectCar = true;
            // console.log(`1-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}---${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
            this.isSelectCar = true;
          }else if(sessionStorage.getItem('lbdApp-isSelectCar')==='false'){
            // 如果进这个页面sessionStorage为'false'时，this.isSelectCar = false;
            // console.log(`2-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}---${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
            this.isSelectCar = false;
          }else{
            console.log(`3-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}--${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
          }

        }
        if(this.$route.params.bankAccount){
          this.cardCode = this.$route.params.bankAccount;
          this.cardLastCode = this.lbdUtil.getBankCardLastCode(this.cardCode);
          sessionStorage.setItem('lbdApp-cardCode', this.cardCode);
          sessionStorage.setItem('lbdApp-cardLastCode', this.cardLastCode);
        }
        else{
          this.cardCode = this.cardCode || sessionStorage.getItem('lbdApp-cardCode');
          this.cardLastCode = this.cardLastCode || sessionStorage.getItem('lbdApp-cardLastCode');
        }
        if(this.$route.params.bankAddress){
          this.bankAddress = this.$route.params.bankAddress;
          sessionStorage.setItem('lbdApp-bankAddress', this.bankAddress);
        }
        else{
          this.bankAddress = this.bankAddress || sessionStorage.getItem('lbdApp-bankAddress');
        }
        if(this.$route.params.reservedMobile){
          this.reservedMobile = this.$route.params.reservedMobile;
          sessionStorage.setItem('lbdApp-reservedMobile', this.reservedMobile);
        }
        else{
          this.reservedMobile = this.reservedMobile || sessionStorage.getItem('lbdApp-reservedMobile');
        }
        if(this.$route.params.userAccountId){
          this.userAccountId = this.$route.params.userAccountId;
          sessionStorage.setItem('lbdApp-userAccountId', this.userAccountId);
        }
        else{
          this.userAccountId = this.userAccountId || sessionStorage.getItem('lbdApp-userAccountId');
        }

        if(this.$route.params.pageTypes){
          this.pageTypes = this.$route.params.pageTypes;
          sessionStorage.setItem('lbdApp-pageTypes', this.pageTypes);
        }
        else{
          this.pageTypes = this.pageTypes || sessionStorage.getItem('lbdApp-pageTypes');
        }



        /*
        if(this.$route.params.bankName) {
          this.bankName = this.$route.params.bankName;
          this.carLogoName = this.lbdUtil.getBankNameOfCode(this.bankName);
          this.isSelectCar = false;
        }
        if(this.$route.params.bankAccount){
          this.cardCode = this.$route.params.bankAccount;
          this.cardLastCode = this.lbdUtil.getBankCardLastCode(this.cardCode);
        }
        if(this.$route.params.bankAddress){
          this.bankAddress = this.$route.params.bankAddress;
        }
        if(this.$route.params.reservedMobile){
          this.reservedMobile = this.$route.params.reservedMobile;
        }
        if(this.$route.params.userAccountId){
          this.userAccountId = this.$route.params.userAccountId;
        }
        */
      },
      // 初始化页面
      setPageInfo(){
        if (this.typeContinue=='true'){}else{
          try{
            this.isOrder = mobileManager.isOrderCenter() || this.isOrder;
            console.log(`pageInfo->isOrder:${this.isOrder}(${typeof this.isOrder})`);
            if(this.isOrder === '1'){ // 是订单中 ，用订单中心隐藏原生底部栏
              mobileManager.showOrHideBottomByOrder(false);   // 隐藏原生底部栏
            }
            else{ // 不是订单中心，默认隐藏原生底部栏
              mobileManager.hideBottomBar();   //隐藏原生底部栏
            }
          }catch(err){
            console.log(err);
            console.log(err.message);
          }
        }
      }
    },
    created() {
      // console.log('query--------------');
      // console.log(this.$route.query);
      // console.log('params--------------');
      // console.log(this.$route.params);
      this.getUrlMsg();
      this.setBankInfo();
    },
    mounted() {
      mobileManager.enableRefresh(false);  //下拉刷新
      if(this.$route.params.pageTypes){
        sessionStorage.setItem('pageTypes', this.$route.params.pageTypes)
      }
      this.url = this.lbdUtil.host + '/userInfo/selectUser?token='+this.token;

      let u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        this.setPageInfo();
      }
      window.iosIsOrderCenter = (res) =>{ //ios
        this.isOrder = res;
        this.setPageInfo();
      }
      // let url = this.lbdUtil.host + '/userInfo/selectUser?token='+this.token;
      // document.getElementById("w").innerHTML = '<object type="text/html" data="'+ url + '" width="100%" height="100%"></object>';
    },
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .content-box{
    background: #ffffff;
    margin-top: 1.65rem;
    &-list{
      li{
        margin-left: .4rem;
        margin-right: .4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        span,i{
          float:right;
        }
      }
      li:not(:first-child){
        border-top: 1px solid #F0F0F0;
      }
      li:first-child{
        /*position: relative;*/
        @iW:0.4rem;
        i{
          font-style: normal;
          width: @iW;
          height: @iW;
          line-height: @iW;
          border-radius: 50%;
          background: #666;
          color: #ffffff;
          text-align: center;
          font-size: .2rem;
          position: relative;
          /*right: .35rem;*/
          top: .38rem;
        }
        span{
          padding-right: .1rem;
        }
      }
    }
  }

  .car-box{
    background: #ffffff;
    margin-top: 5px;
    &-title{
      box-sizing: border-box;
      height: 1rem ;
      padding: .25rem .4rem;
      border-bottom: 1px solid #F0F0F0;
      p{
        border-left: 2px solid #FF9800;
        padding-left: .1rem;
        height: .5rem;
        line-height: .5rem;
      }
    }
    &-content{
      @h:2rem;
      height: @h;
      line-height: @h;
      span{
        color: #26A2FF;
      }
      &-select{
        text-align: center;
      }
      &-select-done{
        @imgW:1.1rem;
        position:relative;
        /*padding: .4rem 0 0 .8rem;*/
        height: @h;
        line-height: @h;

        img{
          width: @imgW;
          height: @imgW;
          position: relative;
          top: .35rem;
          left: .8rem;
        }
        span{
          margin-left: 1rem;
        }
        i{
          position: absolute;
          top: .7rem;
          right: .4rem;
          /*background: #000;*/
          background-image: url("../assets/img/back_left.png");
          width: .5rem;
          height: .5rem;
          background-size: 100%;
        }
      }
    }
  }

  .button-box{
    text-align: center;
    margin-top: 3rem;
    .checkbox{
      color: #1296DB;
    }

    button{
      width: 85%;
      height: 1.1rem;
      background: #FF8900;
      border-radius: 5px;
      color: #ffffff;
      margin-top: 12px;
      font-size: .4rem;
    }
    p{
      margin-top: .3rem;
      font-size: .35rem;
      padding: 0 .6rem;
    }
    p:last-child{text-align: justify;}
  }

  .checkbox input[type="checkbox"] {
    -webkit-appearance: none;  /*清除复选框默认样式*/
    background:url("../assets/img/checkbox_b.png") no-repeat;/*复选框的背景图*/
    width: 15px;
    height: 15px;
    vertical-align: middle;
    outline: none; /*去掉自带的边框*/
    background-size: 100%;
  }
  .checkbox  input[type="checkbox"]:checked {
    -webkit-appearance: none;  /*清除复选框默认样式*/
    background: url("../assets/img/checkbox.png") no-repeat;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    outline: none;
    background-size: 100%;
  }
  .checkbox{
    input{
      position: relative;
      top: -2px;
      left: 2px;
    }
  }

  p{
    margin: 0;
    padding: 0;
  }


  #w{
    /*background: #ffffff;*/
    /*position:fixed;*/
    /*padding-top: 1.1rem;*/
    /*top: 1rem;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*height: 100%;*/
    /*width: 100%;*/
    /*overflow-y: scroll;*/
  }

  iframe{
    background: #ffffff;
    padding-top: 1.1rem;
    position:absolute;
    width: 100%;
    height: 100%;
  }
  #text{
    margin-bottom: .5rem;
  }
</style>
