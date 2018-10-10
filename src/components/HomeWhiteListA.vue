<template>
    <div class="page-box" >
      <div v-show="!showProtocol">
        <!--banner-->
        <div class="banner-box">
          <div class="banner-box-top clear">
            <span @click="closePage"></span>
          </div>
          <div class="banner-box-content">
            您曾成功借款小鹅袋，确认后免审包下款，最快5分钟到账
          </div>
        </div>
        <!--内容-->
        <div class="content-box">
          <!--小鹅袋-->
          <div class="content-box-title">
            <b>小鹅袋</b>
            <span>老客免审包下款</span>
          </div>
          <!--信息列表-->
          <ul class="content-box-list">
            <li>
              <b>放款总额</b>
              <i @click="showDetails">?</i>
              <span>{{loanMoney}}元(到账{{accountMoney}}元)</span>
              <!--<span>{{loanMoney}}元(到账{{loanMoney * 0.8}}元)</span>-->

            </li>
            <li>
              <b>贷款期限</b>
              <span>{{loanTimeLimit}}天</span>
            </li>
            <li>
              <b>到期应还</b>
              <span>{{expireMoney}}元</span>
              <!--<span>{{loanMoney * (1 + 0.1 / 100 * 7)}}元</span>-->
            </li>
            <li>
              <b>姓名</b>
              <span>{{uName}}</span>
            </li>
            <li>
              <b>身份证</b>
              <span>{{uCode}}</span>
            </li>
            <li>
              <b>手机号</b>
              <span>{{uPhone}}</span>
            </li>
          </ul>

        </div>
        <!--选择银行卡-->
        <div class="car-box">
          <div class="car-box-title">
            <p>选择银行卡(仅支持储蓄卡)</p>
          </div>
          <div class="car-box-content"  @click="showCardList">
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
            <span @click="toProtocolPage">我已阅读并同意《个人消费借款及服务合同》</span>
          </p>
          <p>完成绑卡确认后，如审批通过直接放款</p>
          <button
            :disabled="!canSubmit"
            :style="{background:canSubmit?'#FF8900':'#777777'}"
            @click="toReceipt"
          >确认收款</button>

          <p id="text">
            注：部分资金方在审批通过后，会有开户授权的流程，具体可留意短信通知或定期点击APP底部【订单】查看，如该项流程在24小时内尚未完成，则将为您自动切换其他资金方直接放款。
          </p>
          <!--<button @click="goOrderCenter">test</button>-->

        </div>
        <!--问号-->
        <a-popup
          :isShow="popupAInfo.isShow"
          :popupADataInfo="popupADataInfo"
          @closePopup="closeAPopup"
        ></a-popup>
        <!--挽留-->
        <d-Popup
          :isShow="popupDInfo.isShow"
          @closePopup="closeDPopup"
        ></d-Popup>
        <!--银行卡信息-->
        <bank-msg-popup
          :isShow="popupBankMsg.isShow"
          @closeBankPopup="closeBankPopup"
        ></bank-msg-popup>
      </div>

      <div id="viewDiv" v-show="showProtocol">
        <mt-header title="个人消费借款及服务合同" class="lbd-head-normal">
          <mt-button icon="back" slot="left" @click="backHomeWhiteA"></mt-button>
        </mt-header>
        <!--<div id="w">-->

        <!--</div>-->
        <iframe :src="url" frameborder="0"></iframe>
      </div>
    </div>
</template>



<script>
  import APopup from './HomeWhiteListAPopup';
  import DPopup from './detainmentPopup';
  import bankMsgPopup from './bankMsgPopup';
  import { MessageBox, Indicator, Toast } from 'mint-ui';
  import { grantManager } from '../utils/grant.js';
  import { mobileManager } from '../utils/WebInfo.js';

  export default {
    data() {
      return {
        overflowType:'scroll',
        isOrder:'',
        url:'',
        isRead:true,

        popupAInfo:{
          isShow:false
        },
        popupDInfo:{
          isShow:false
        },
        popupBankMsg:{
          isShow:false
        },
        isSelectCar:true,
        carLogoName:'CMB',
        loanTimeLimit:'7',
        loanMoney:'1500', //1000
        // accountMoney:'800',
        // expireMoney:'1007',
        uName:'',
        uCode:'',
        uPhone:'',
        token: sessionStorage.getItem('lbdApp-token')||'', // 165402408715223 184857273308981 88888888
        productCode:sessionStorage.getItem('lbdApp-productCode')||'',
        channelCode:sessionStorage.getItem('lbdApp-channelCode')||'',
        bankName:'',
        cardCode:'',
        cardLastCode:'',
        params: this.$route.query,
        is1or4: false,
        loadReason:'',
        productDetail: {
          jinDanMoney:sessionStorage.getItem('lbdApp-jinDanMoney')||''
        },
        showProtocol:false,
        bankAddress:'',
        reservedMobile:'',
        userAccountId:'',
        borrowOrderCode:sessionStorage.getItem('lbdApp-borrowOrderCode')||''
      }
    },
    components: { APopup, DPopup, bankMsgPopup },
    computed: {
      // accountMoney:'800',
      // expireMoney:'1007',
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
          return !this.is1or4 && this.isRead && !this.isSelectCar;
          },
        // set(v){ this.canSubmit = v }
      }
    },
    methods: {
      //提示
      showToast(msg){
        Toast({
          message: msg,
          position: 'bottom',
          duration: 3000
        });
      },
      // 协议外层
      backHomeWhiteA(){
        this.showProtocol = false
      },
      // 协议页
      toProtocolPage(){

        // let url = '/userInfo/selectUser?token=' + this.token;
        // window.location.href=this.lbdUtil.host + url;
        this.showProtocol = true
      },
      // 确认收款
      toReceipt(){
        // this.showBankPopup();
        // return;

        console.log(`是否钩选我已阅读，${this.isRead}`);
        /**
         * 用户借款的三要素前置拦截
         * 按钮显示“无法申请”的条件是isHit == 1（已命中）
         * “立即申请”的条件是1、isHit == 0(未命中);2、五项认证都变成‘已认证’
         * 0=没命中
         * 1=撞特点库(还款中、在申中),
         * 2=PD白名单(A类白名单),
         * 3=PD风控白名单(B类白名单)
         * 4=PD分控黑名单
         */
        let params = this.params;
        let webInfo=this.lbdUtil.getWebInfoObj();
        let queryData={
          token: this.token,
          channelCode: this.channelCode
        };
        // let data = this.$qs.stringify(Object.assign(queryData,webInfo));
        let data = Object.assign(queryData,webInfo);
        let url = '/app/webFrame/allPreInterceptingByAppMobileExpress';
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(this.lbdUtil.host + url,
          {params:data}
        ).then((res)=>{
          Indicator.close();
          console.log(res,'确认收款，请求成功');
          let result = res.data;
          let resObj = result.data;
          if(result.status === '0000'){
            if(res.data.data===1 || res.data.data===4) {
              // 命中 1 or 4 ,铵钮置灰
              // 跳转首页
              this.is1or4 = true;
              MessageBox.alert(
                '您的资质暂无法申请该产品，可以看看其他产品哦~'
              ).then(action => {
                //回到首页
                this.$router.push({
                  name: 'HomePageMiss', params: params ,query: params
                });
              });
              // MessageBox.confirm('是否确认还款?').then(action => {
              //   this.getConfirmPay()
              // })
            }else{
              // 没命中 1 and 4
              this.secondFunc();
            }
          } else {
            this.showToast(res.data.msg);
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
        })
      },
      // 没命中 1 and 4, 走第二个判断
      secondFunc(){
        // 判断 是否拉取的数据包数据已齐全
        // 若不齐全：弹框提示：您的资料不全，可以看看其他产品哦~确认返回，跳转到首页；
        // 若齐全，走第三个判断；


        let params = this.params;
        let webInfo=this.lbdUtil.getWebInfoObj();
        let queryData={
          token: this.token,
          channelCode: this.channelCode,
        };
        // let data = this.$qs.stringify(Object.assign(queryData,webInfo));
        let data = Object.assign(queryData,webInfo);
        console.log(data);
        let url = '/user/userOrgInfo/pdUserIsAuthentication?channelCode=lbdApp';
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(this.lbdUtil.host + url,
          {params:data}
        ).then((res)=> {
          Indicator.close();
          console.log(res, '第二个判断，请求成功');
          let result = res.data;
          let resObj = result.data;
          if (result.status === '0000') {
            console.log('resObj------');
            console.log(resObj);
            if (resObj === 1) {
              // 数据包数据不齐全
              MessageBox.alert(
                '您的资料不全，可以看看其他产品哦~确认返回，跳转到首页~'

              ).then(action => {
                //回到首页
                this.$router.push({
                  name: 'HomePageMiss', params: params, query: params
                });
              });
            } else {
              // 数据包数据齐全
              // 判断 是否授权并且获取到通信录、设备信息
              if(resObj === 2){
                // 未授权未获取
                // 授权通讯录
                console.log('调原生------');
                this.pullContact();
                // this.jinDan();
              }
              else if(resObj === 0){
                // 成功
                this.jinDan();
              }
            }
          } else {
            this.showToast(result.msg);
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
        })
      },
      pullContact() {
        //调起原生的方法 弹出授权通讯(授权成功后  原生调appSubmitOrder方法 去进单)
        grantManager.uploadContacts();
      },
      appSubmitOrder(isSuccess) {
        //原生授权通讯录成功后调的方法(去进单)
        //基础信息->运营商->身份证认证  回来走的进单操作
        if(isSuccess===1){
          this.jinDan();
        }
        else{
          console.log('没受权');
        }
      },
      jinDan() {
        let params = this.params;
        let webInfo= this.lbdUtil.getWebInfoUrl();
        let url = '/user/userOrgInfo/queryUserOrgInfo?';
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host + url + webInfo.substr(1) + '&token=' + this.token +'&channelCode='+ this.channelCode, {

          }
        ).then((res) => {
          Indicator.close();
          let resData = res.data;
          console.log('jinDan----------res');
          console.log(res);
          if(resData.status === '0000') { //已经授权,下一步是提交
            this.productDetail.jinDanMoney = resData.data.applayAmount;
            this.loadReason = resData.data.loadReason;
            this.save();
          } else {
            this.showToast(resData.msg)
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
          console.log(err);
        })

      },
      save() { //提交申请接口
        mobileManager.buriedPoint('fastloan_apply_immediately') //埋点id
        let webInfo= this.lbdUtil.getWebInfoUrl();

        // this.borrowOrderCode='LXED20180903635385';
        // this.getBindCard();
        // return;

        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host +'/orderApply/v3/save?'+webInfo, {
            params:{
              token: this.token,
              channelCode: this.channelCode,
              productCode: this.productCode,
              // applyAmount:this.productDetail.jinDanMoney,
              applyAmount:this.loanMoney,//1500 1000
              loadReason:this.loadReason,
              periodTotal: '1',
              loadSrc:'5',
              orderType:'2',

              bankAccount:this.cardCode,
              userAccountId:this.userAccountId,
              userType: 1 // 2018.09.14 10:17 肖雄要求增加字段
            }
          }
        ).then((res) => {
          Indicator.close();
          let resData = res.data;
          console.log(res,'提交申请接口');

          if(resData.status == '0000') {

            // this.borrowOrderCode = resData.data.borrowOrderCode;

            // this.getBindCard();
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
            this.goOrderCenter();

          } else if(resData.status == '1100') { //未登录
            this.isLoad = false;
          } else {
            this.showToast(resData.msg);
          };

          Indicator.close();
        }, (err) => {
          console.log('save失败：' + err);
          Indicator.close();
        });
      },
      // 跳转订单中心
      goOrderCenter(){
        this.isOrder = mobileManager.isOrderCenter() || this.isOrder;
        console.log(`goOrderCenter->isOrder:${this.isOrder}(${typeof this.isOrder})`);
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
      },

      // 绑卡接口
      getBindCard( ) {   //绑卡接口
        Indicator.open({ spinnerType: 'fading-circle' });
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

        this.$http.get(
          this.lbdUtil.host + '/orderApply/bindCard?'+ webInfo.substr(1),
          { params:paramsObj }
        ).then((res) => {
          Indicator.close();
          this.bindCardData = res.data.data;
          console.log(res,'绑卡');
          if(res.data.status==='0000'){
            if(this.bindCardData.bindCardUrl) {  //有感绑卡需要跳转H5地址 第三方页面
              this.$router.push({ name: 'ThirdBandCard', params:{ bindCardData: this.bindCardData.bindCardUrl }, query:{} })
            } else {
              this.getApplyOrder()  //无感绑卡确认绑卡接口
            }

          } else {
            this.showToast(res.data.msg)
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
          console.log(err);
        });
      },
      //无感绑卡确认绑卡接口
      getApplyOrder() {   //无感绑卡确认绑卡接口
        let params  = this.$route.query;
        let webInfo = this.lbdUtil.getWebInfoUrl();
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(
          this.lbdUtil.host + '/orderApply/applyOrder?'+ webInfo.substr(1) + `&borrowOrderCode=${this.borrowOrderCode}&token=${this.token}`,
          {}
        ).then((res) => {
          Indicator.close();
          if(res.data.status==='200003'){
            this.showToast(res.data.msg);
          } else {
            this.showToast('绑卡成功');
            // if(sessionStorage.type == 'bindCardType'){
            //   params.buriedPoint = this.$route.params.buriedPoint
            //   this.$router.push({ name: 'HomePageLoaning', params: params, query:params }) //从首页进入的绑卡跳转放款中页面
            // } else {
              this.$router.push({ name: 'Order', params:{}, query:{} }) //跳转至入口（首页或者订单中心）
            // }
          }

        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
          console.log(err);
        });
      },
      // 显示详情
      showDetails(){
        this.setOverflowType("hidden");
        this.popupAInfo.isShow = true;
      },
      // 关闭popup
      closeAPopup(res){
        this.setOverflowType("scroll");
        this.popupAInfo.isShow=res;
      },
      // 点击差差弹窗
      closePage(){
        this.setOverflowType("hidden");
        this.popupDInfo.isShow = true;
      },
      // 差差popup
      closeDPopup(res){
        this.setOverflowType("scroll");
        this.popupDInfo.isShow=false;
        let params = this.params;
        if(res === 1) {
          this.$router.push({
            name: 'HomePageMiss', params: params, query: params
          });
        }
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
            pageType:'HomeWhiteListA',
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
      // 获取基本信息
      getBaseInfo(){
        let webInfo = this.lbdUtil.getWebInfoUrl();
        let params  = this.$route.query;
        let token = '';
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.get(this.lbdUtil.host + '/userInfo/selectUserInfo?token='+this.token,// 184857273308981
          {}
        ).then((res)=>{
          Indicator.close();
          console.log(res,'A类白名单，请求成功');
          let result = res.data;
          let resObj = result.data;
          if(result.status === '0000'){
            this.uName = resObj.name;
            this.uCode = resObj.idcard;
            this.uPhone = resObj.mobile;
          } else {
            this.showToast(res.data.msg);
          }
        },(err)=>{
          Indicator.close();
          this.showToast('网络出错');
          console.log(err);
        })
      },
      //获取接口数据
      getTest() {
        let params  = this.$route.query;
        let webInfo = this.lbdUtil.getWebInfoObj();
        let parasObj = this.$qs.stringify(Object.assign(params,webInfo));
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$http.post(
          this.lbdUtil.host + '/order/borrowOrder/queryApplyOrderDetailById',
          parasObj
        ).then((res) => {
          Indicator.close();
          if(res.data.status =="0000"){
            this.applyAmount = res.data.data.applyAmount
            this.auditDate =res.data.data.auditDate
            this.periodTotal = res.data.data.periodTotal
            this.repayAmount = res.data.data.repayAmount
            this.repayPrincipal = res.data.data.repayPrincipal
            this.wecashOrderNo = res.data.data.wecashOrderNo
            this.productCode = res.data.data.productCode
            if (this.auditDate) {
              setInterval(() => {
                this.auditDate -= 60*1000;
              }, 60*1000)
            }
          } else {
            this.showToast(res.data.msg)
          }
        },(err)=>{
          console.log(err,'请求失败');
          Indicator.close();
        });
      },
      // 跳转到卡列表
      showCardList(){
        let paramsObj = {
          productCode:this.productCode,
          channelCode:this.channelCode,
          token:this.token,
          pageType:'HomeWhiteListA',
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
        this.$router.push({name:'SelectBankCardA', params:paramsObj, query:paramsObj});
      },

      //获取url信息
      getUrlMsg(){
        let paramUrl = document.location.href;
        console.log(paramUrl);
        let arr = paramUrl.split('?');
        if (arr[1]) {
          let newArr = arr[1].split('&');
          for(var i=0; i < newArr.length; i++) {
            var item = newArr[i];
            /*
            if (/productCode=/.test(item)) {
              this.productCode = item.split('=')[1];
            }
            if (/channelCode=/.test(item)) {
              this.channelCode = item.split('=')[1];
            }
            if (/token=/.test(item)) {
              if(item.split('=')[1]){
                this.token = item.split('=')[1];
                sessionStorage.setItem('lbdApp-token', this.token);
              }

              console.log(`1-if-this.token:${this.token}`);
            }else{
              this.token = sessionStorage.getItem('lbdApp-token');
              console.log(`2-else-this.token:${this.token}`);
            }
            if (/pageType=/.test(item)) {
              this.pageType = item.split('=')[1];
            }
            */
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
          console.log(`0-this.isSelectCar:${this.isSelectCar}---${typeof this.isSelectCar}`);
        }
        else{
          this.bankName = sessionStorage.getItem('lbdApp-bankName');
          this.carLogoName = sessionStorage.getItem('lbdApp-carLogoName') || 'CMB';
          this.isSelectCar = (sessionStorage.getItem('lbdApp-isSelectCar') === 'false') && false;

          if(!sessionStorage.getItem('lbdApp-isSelectCar')){
            // 第一次进这个页面sessionStorage为null时，this.isSelectCar = true;
            console.log(`1-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}---${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
            this.isSelectCar = true;
          }else if(sessionStorage.getItem('lbdApp-isSelectCar')==='false'){
            // 如果进这个页面sessionStorage为'false'时，this.isSelectCar = false;
            console.log(`2-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}---${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
            this.isSelectCar = false;
          }else{
            console.log(`3-sessionStorage.getItem('lbdApp-isSelectCar'):${sessionStorage.getItem('lbdApp-isSelectCar')}---${typeof sessionStorage.getItem('lbdApp-isSelectCar')}`);
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





        // sessionStorage.setItem('nongxin-terminalId', rId);
        // sessionStorage.getItem('nongxin-seller');


      }
    },
    created() {
      this.getUrlMsg();
      this.getBaseInfo();
      this.setBankInfo();


      console.log('query--------------');
      console.log(this.$route.query);
      console.log('params--------------');
      console.log(this.$route.params);
    },
    mounted() {
      console.log('隐藏原生底部栏-');
      try{ window.scrollTo(0,0); }catch (err){ console.log(err.message); }
      mobileManager.hideBottomBar();   //隐藏原生底部栏
      mobileManager.enableRefresh(false);  //下拉刷新

      this.url = this.lbdUtil.host + '/userInfo/selectUser?token='+this.token;

      window.iosIsOrderCenter = (res) =>{
        this.isOrder = res;
      };
      // let url = this.lbdUtil.host + '/userInfo/selectUser?token='+this.token;
      // document.getElementById("w").innerHTML = '<object type="text/html" data="'+ url + '" width="100%" height="100%"></object>';
    },
    beforeDestroy(){
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @w:75rem;
  .banner-box{
    width: 100%;
    height: 3.5rem;
    background: url("../assets/img/homePage/banner.png") #FFA800;
    padding-top: .2rem;
    background-size: 100%;
    background-repeat: no-repeat;
    &-top{
      margin-right: -.2rem;
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      span{
        float:right;
        width: .6rem;
        height: .6rem;
        /*text-align: center;*/
        background: url(../assets/img/close_a.png) no-repeat;
        -webkit-background-size: 100%;
        background-size: 100%;
        margin-right: .1rem;
      }
    }
    &-content{
      width: 57%;
      /*font-size: .56rem;*/
      font-size:32/@w;
      margin: 0 auto;
      color: #ffffff;
    }
  }

  .content-box{
    background: #ffffff;
    b{ font-weight: 500;}
    &-title{
      padding-left: .4rem;
      height: 1rem;
      line-height: 1rem;
      border-bottom: 1px solid #F0F0F0;
      span{
        color: #999999;
        margin-left: 0.2rem;
      }
    }
    &-list{
      li{
        margin-left: .4rem;
        margin-right: .4rem;
        height: 1rem;
        line-height: 1rem;
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
          display: inline-block;
          vertical-align: center;
          width: @iW;
          height: @iW;
          line-height: @iW;
          border-radius: 50%;
          background: #666;
          color: #ffffff;
          text-align: center;
          font-size: .2rem;
          position: relative;
          /*right: .15rem;*/
          top: .30rem;
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
      &-select{
        text-align: center;
      }
      span{
        color: #26A2FF;
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
    margin-top: .5rem;
    .checkbox{
      color: #1296DB;
    }
    label{

    }
    p{
      margin-top: .1rem;
      font-size: .35rem;
      padding: 0 .6rem;
    }
    p:last-child{
      margin-top: .2rem;
      text-align: justify;
    }
    button{
      width: 85%;
      height: 1.1rem;
      background: #FF8900;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      color: #ffffff;
      margin-top: 12px;
      font-size: .4rem;
    }
  }

  .checkbox input[type="checkbox"] {
    -webkit-appearance: none;  /*清除复选框默认样式*/
    -moz-appearance: none;
    appearance: none;
    background:url("../assets/img/checkbox_b.png") no-repeat;/*复选框的背景图*/
    width: 15px;
    height: 15px;
    vertical-align: middle;
    outline: none; /*去掉自带的边框*/
    -webkit-background-size: 100%;
    background-size: 100%;
  }
  .checkbox  input[type="checkbox"]:checked {
    -webkit-appearance: none;  /*清除复选框默认样式*/
    -moz-appearance: none;
    appearance: none;
    background: url("../assets/img/checkbox.png") no-repeat;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    outline: none;
    -webkit-background-size: 100%;
    background-size: 100%;
  }
  .checkbox{
    input{
      position: relative;
      top: -1px;
      left: 2px;
    }
  }

  .clear:after{
    content:'';
    display: block;
    clear: both;
  }
  p{
    margin: 0;
    padding: 0;
  }

  .t {
    /*position: absolute;*/
    /*min-height: 100vh;*/
    /*box-sizing: border-box;*/
    /*width: 100%;*/
    /*background: #f1f3f7;*/
    /*transition: all .3s ease;*/
    /*top: 0;*/
  }
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 1;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  .page-box{
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*background: #F0F0F0;*/
  }



  #w{
    /*background: #ffffff;*/
    /*position:fixed;*/
    /*top: 1rem;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*height: 100%;*/
    /*width: 100%;*/
    /*overflow-y: scroll;*/
    /*padding-top: .1rem;*/
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
