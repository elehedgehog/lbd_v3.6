<template>
  <div class="container" ref='container'>

      <!-- <mt-header v-bind:title="data.productName" >
        <mt-button icon="back" @click="back" slot="left" ></mt-button>
        <mt-button slot="right" class="share" @click="share" ></mt-button>
      </mt-header> -->

    	<!-- <mt-header v-bind:title="data.productName" >
	    	<mt-button icon="back" @click="back" slot="left" ></mt-button>
        <i>
          
        </i>
	  	</mt-header> -->
      <div class="panel">
        <div class="header">
          <div class="logo">
            <img v-bind:src="data.productLogo"/>
          </div>
          <div class="title">
            <span class="font30 color31">{{data.productName}}</span>
            <span class="colora0 font26 textoverflowhide">{{data.remark}}</span>
            <span class="colorfc font26">申请人数 {{data.applyCount}}人</span>
          </div>
          
          <span class="share" @click="share" ></span>
        </div>
        
        <div class="conditions colora0 font24">
          <div>
            <div><i class="iocn iocn1"></i>额度范围：{{data.quota}}</div>
            <div><i class="iocn iocn2"></i>期限范围：{{data.periodsScope}}</div>
          </div>
          <div>
            <div><i class="iocn iocn3"></i>参考利率：{{data.consultRate}}</div>
            <div><i class="iocn iocn4"></i>最快放款时间：{{data.loanTime}}</div>
          </div>
        </div>

        

      </div>
      <div class="content">
        <div class="first color31 font30">贷款条件</div>
        <div class="last colora0 font26">
          <div v-for="(item, index) in data.applyConditions" :key="index">{{item}}</div>
        </div>
        <div class="type colorfc font34">还款方式：{{data.paymentMethod}}</div>
        <button class="borrowing color31 font34" @click="borrowing">立即借款</button>
      </div>
      



      <div v-show="downloadFlag" class="downloadLdb">
        <div class="downloadBox clearfix">
          <div class="left logo">
            <img v-bind:src="download" alt="">
          </div>
          <div class="left">
            <div class="slogan">乐宝袋 - 随时借，轻松还
              <br>能借到更多钱的贷款超市</div>
          </div>
          <div class="left">
            <button type="button" class="downloadBtn" @click="downloadApp">立即下载</button>
          </div>
          <div class="closeBtn" @click="downloadFlag = false">×</div>
        </div>
      </div>
      

      <!-- 更多推荐 -->
      <div class="moreProduct" v-bind:class="{marginB150:downloadFlag}">
        <div class="hot">
          <p>更多热门产品</p>
          <ul>
            <li v-for="(item, index) in hotproduct" :key="index"  @click="details(item.id)">
              <img v-bind:src="item.logo" alt="">
              <p>{{item.quota}}</p>
            </li>
          </ul>
        </div>

        <div class="hot">
          <p>更多适合你的产品</p>
          <ul>
            <li v-for="(item, index) in Suitable" :key="index" @click="details(item.id)">
              <img v-bind:src="item.logo" alt="">
              <p>{{item.quota}}</p>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>
<script>

import { Toast, Indicator} from 'mint-ui';
import { mobileManager } from '../utils/WebInfo.js'
export default {
  
  name: "exhausting",
  data() {
    return {
      productid:"",
      isLoginStatus:'',
      phoneType:'',
      params:{},
      data:{},
      getDeviceInfo:{},
      token:'',
      download:'',
      downloadFlag:false,
      Suitable:{},
      hotproduct:{}
    };
  },
  beforeCreate(){
    Indicator.open({ spinnerType: 'fading-circle' });
  },
  created(){    
    
    // 分享页面需下载
    
    if (this.$route.query.share== 'share') {
      this.downloadFlag = true;
    } else {
      this.downloadFlag = false;
    }

    // 获取产品id以及token
    this.download=this.lbdUtil.host+"/webpage/modules/product/img/ic_launcher.png";
    this.token=this.$route.query.token;
    this.productid=this.$route.query.id;
    this.characterCarousel();
    // 更多
    this.more()

    
    let getDeviceInfo=mobileManager.getDeviceInfo();
    this.getDeviceInfo=getDeviceInfo;
    
    
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    // if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
      var u = navigator.userAgent, app = navigator.appVersion;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      isAndroid?this.phoneType='android':this.phoneType='ios'
    // }
  },
  mounted(){
    setTimeout(function(){
      Indicator.close();
    },1000)
  },
  beforeUpdate(){

  },
  updated(){
    Indicator.close();
  },
  methods: {

    // 跳转至借款
    async borrowing(){
      await this.isLogin();
      console.log(this.isLoginStatus)
      if(this.isLoginStatus !== '0000') {
        mobileManager.startLoginActivity(1)//跳转app登录
        return
      }
          // 点击记录
      let msg='productSupermarketId='+this.productid+'&mobile='+this.getDeviceInfo.reqMobile+ '&phoneType='+this.phoneType + '&token='+this.token+'&productName='+ this.productName
      this.$http.get(this.lbdUtil.host +'/product/clickRecord?'+msg);


      let userType = this.data.position
      console.log(this.data.position)
      if(userType!=6){
        var toUrl = this.lbdUtil.host + '/product/h5/toProduct?id=' + this.productid + '&mobile=' + this.getDeviceInfo.reqMobile + '&phoneType='+this.phoneType
        // _this.loadingFlag = true
        location.href = toUrl
      }else {
        //判断是否是否实名认证
        let isAuthenUrl = this.lbdUtil.host+ '/user/userOrgInfo/userIsAuthentication?token='+this.token+'&channelCode=LBD';
        this.$http.get(isAuthenUrl).then((res)=>{
          if(res.data.status=="0000"){
            // console.log('status',res.data.status);
            if(res.data.data.hashBaseInfo==0){
              // console.log('hashBaseInfo',res.data.data.hashBaseInfo);
              location.href= this.lbdUtil.host+'/webpage/hybridAppForWeb/lbd_v3.6/dist/index.html#/UnionLoginAuthentication?token='+this.token+'&id='+this.$route.query.id;  
            }else{
              let jointLogonUrl =this.lbdUtil.host+ '/h5/api/product/jonintLogon?token='+this.token+'&id='+this.$route.query.id;
              this.$http.get(jointLogonUrl).then((res)=>{
                if(res.data.data){
                  if(res.data.data.is_new_user==1){
                    location.href=res.data.data.apply_url;
                  }else if(res.data.data.is_new_user==2){
                    if(res.data.data.apply_url){
                      location.href=res.data.data.apply_url;
                    }else{
                      this.showToast('您已注册该产品，请直接登录APP查看进度');
                    }
                  }else{
                    this.showToast('您已注册该产品，请直接登录APP查看进度');
                  }
                }else{
                  this.showToast(res.data.msg)
                }
              })
            }
          }else{
            this.showToast(res.data.msg+"");
          }
        })
      }
          
        // }
        // Indicator.close();

      // })
      
    },

    

    // 分享
    share(){
      let shareTitle='已有'+this.data.applyCount+'人正在申请'+this.data.productName+'借款，再不快点就抢光啦！';
      let shareContent='额度范围：'+this.data.quota+';期限范围：'+this.data.periodsScope+';参考利率：'+this.data.consultRate+';最快放款时间：'+this.data.loanTime;

      mobileManager.shareCircleFriendsFormH5(shareTitle,shareContent,window.location.href+'&share=share',this.data.productLogo);
      return;
    },
    // 返回或关闭
    // back(){
    //   // this.$router.push({name:'HomePageMiss', params: this.params, query:{} })
    //   let query={
    //     productCode:this.params.productCode,
    //     channelCode:this.params.channelCode,
    //     token:this.token
    //   }
    //   if(this.$route.query.pageType==0){
    //     this.$router.push({name:'HomePageMiss', params: this.params, query:query});
    //   }else{
    //     mobileManager.finishActivity();
    //   }
    //   return;

    // },
    // 获取详情
    characterCarousel(){ 
      // Indicator.open();
      this.$http.get(
        this.lbdUtil.host + `/product/detail?id=`+this.productid,
      ).then((res) => {
        console.log('res',res.data.data)
        this.data=res.data.data;
        document.title=this.data.productName;
        if(this.data.productName!=""){
          mobileManager.onReceivedTitle(this.data.productName);
        }
        
        this.$http.get( this.lbdUtil.host+'/product/clickDetailRecord?id='+this.productid+'&phoneType='+this.phoneType)
      },(err)=>{
        this.showToast('网络出错');
      });
      
      
      return;
    },
    downloadApp(){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') > -1) {
        // 下载ios版本
        location.href = 'https://fir.im/q6vn'
      } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Macintosh') > -1) {
        // 下载Android版本
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.lbdfun.android.app&ckey=CK1376570881946'
      } else if (u.indexOf('Windows Phone') > -1) {
        this.showToast("暂不支持该机型")
      } else {
        this.showToast("暂不支持该设备")
      }
    },
    showToast:function(msg){
      Toast({
        message: msg,
        position: 'bottom',
        duration: 3000
      });
    },
    async isLogin() { //用户是否登录接口
      let webInfo = this.lbdUtil.getWebInfoUrl();
      Indicator.open({ spinnerType: 'fading-circle' });
      
      let url = this.lbdUtil.host + '/user/webUserLogin/isLogin?token='+this.token+ webInfo
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
      console.log( '登录状态isLoginStatus:' +res.data.status)
    },
    
    more(){
      // 更多产品
      this.$http.get(this.lbdUtil.host + "/product/index/list?position=2").then((res)=>{
        console.log('res',res.data.result);
        this.hotproduct=res.data.result;
      })
      // 适合你的产品
      this.$http.get(this.lbdUtil.host + "/product/index/list?position=3").then((res)=>{
        console.log('res',res);
        this.Suitable=res.data.result;
      })
    },
    details(id){
      window.scrollTo(0,0);
      Indicator.open({ spinnerType: 'fading-circle' });
      this.productid=id;
      this.$route.query.id=id;
      let url=location.href.split("id=");
      let index=url[1].indexOf("&");
      if(index>0){
        url=url[0]+'id='+id+url[1].substring(index,url[1].length-1);
      }else{
        url=url[0]+'id='+id;
      }

      window.history.replaceState('',"",url); 
      this.characterCarousel();
      // 更多
      this.more()      
      // window.location.reload();
    }
  }
};
</script>
<style scoped lang="less">


@w: 75rem;
.marginB150{
  margin-bottom: 150/@w;
}
.iocn{
  display: inline-block;
  width: 14/@w;
  height: 14/@w;
  border-radius: 50%;
  margin-top: 14/@w;
  margin-right: 10/@w;
}
.iocn1{
  background: #22ac38;
}
.iocn2{
  background: #fbc205;
}
.iocn3{
  background: #ff0000;
}
.iocn4{
  background: #17b1d2;
}
.colora0{
  color: #a0a0a0;
}
.color31{
  color: #313131;
}
.colorfc{
  color:#fc5605
}
.font34{
  font-size: 34/@w;
}
.font30{
  font-size: 30/@w;
}
.font26{
  font-size: 26/@w;
}
.font24{
  font-size: 24/@w;
}
.textoverflowhide{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.downloadLdb {
  position: fixed;
  height: 150/@w;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);

  .downloadBox {
    position: relative;
    width: 100%;
    margin: 0 auto;
  }
  .logo {
    line-height: 2rem;
    padding: 0 50/@w 0 60/@w;
    float: left;
    img {     
      width: 100/@w;
      vertical-align: middle;
    }
  }
  
  .slogan {
    float: left;
    padding-top: 30/@w;
    padding-right: 50/@w;
    font-size: 26/@w;
    line-height: 40/@w;
    color: #fff;
  }
  .downloadBtn {
    float: left;
    margin: 46/@w auto 0;
    display: block;
    padding: 16/@w 25/@w;
    background: #fbc205;
    border-radius:5px;
    text-align: center;
    font-size: 30/@w;
    color: #313131;
  }
  .closeBtn {
    position: absolute;
    top: 6/@w;
    left: 6/@w;
    width: 60/@w;
    height: 60/@w;
    line-height: 60/@w;
    text-align: center;
    font-size: 30/@w;
    color: #fff;
  }
}


// <img  class="icon-share" src="../assets/img/share.png" alt="">
.share{
  background: url(../assets/img/share1.png) no-repeat center center;
  background-size: 50/@w;
  height: 100/@w;
  width: 100/@w;
}
.panel{
  // margin-top: 100/@w;
  padding:0 28/@w;  
  background: white;
  .header{
    width: 100%;
    padding:24/@w 0;
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    .logo{
      width: 200/@w;
      height: 180/@w;
      text-align: center;
      border-right: 1px solid #e5e5e5;
      // float: left;
      img{
        height: 130/@w;
        width: 130/@w;
        margin-top: 25/@w;
      }
    }
    .title{
      position: relative;
      flex: 1;
      padding:20/@w 0 20/@w 24/@w; 
      span{
        display: block;
        height: 50/@w;
        line-height: 50@w;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 420/@w;
      }
    }
  }
  .conditions{
    padding: 20/@w 0;
    clear: both;
    div{
      display: flex;
      div{
        flex: 1;
        text-align: left;
        height: 44/@w;
        line-height: 44/@w;
      }
    }
  }

  

}
.content{
  padding: 0 28/@w;
  padding-bottom: 70/@w;
  margin-top: 16/@w;
  background: white;
  .first{
    border-bottom: 1px solid #e5e5e5;
    height: 60/@w;
    line-height: 60/@w;
    position: relative;
    text-indent: 20/@w;
    &::before{
      position: absolute;
      content: '';
      width: 0.06666667rem;
      height: 0.37333333rem;
      background: #fbc205;
      top: 0.24rem;
      left: 0;
    }
  }
  .last{
    padding:20/@w 0;
    border-bottom: 1px solid #e5e5e5;
    div{
      padding-bottom: 10/@w;
      line-height:40/@w;
    }
  }
  .type{
    height: 100/@w;
    line-height: 100/@w;
    padding: 20/@w;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 28/@w;
  }
  .borrowing{
    display: block;
    width: 620/@w;
    height: 80/@w;
    background: #fbc205;
    border-radius: 5px;
    margin: auto;
  }
}

// 更多
.moreProduct{
  padding:40/@w 20/@w;
  width: 100%;
  box-sizing: border-box;

  p{
    padding:15/@w 0;
    font-size: 28/@w;
    border-bottom: 1px solid #ccc;
    color: #000;
    // margin: 0 ;
    // margin-bottom: 20/@w;
  }
  ul{
    display: flex;
  }
  li{
    flex: 1;
    text-align: center;
    p{
      border: none;
      padding: 0;
      font-size:24/@w; 
      
    }
  }
  img{
    width: 120/@w;
    height: 120/@w;
  }
}

</style>
