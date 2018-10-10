
var webInfo={};
webInfo.reqApplicationType="webHtml";
webInfo.reqApplicationVersion="1.0";
webInfo.osName=navigator.platform;
webInfo.osVersion=navigator.appName;
webInfo.appDownChannel="web";
webInfo.mobileModel=navigator.userAgent;
webInfo.packageName="";
webInfo.versionName="";

//当内嵌在App里面的时候，使用App获取的参数，加载的时候自动完成
try{
	if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
		var info=window.javaScriptFunction.getDeviceInfo();
		if(info!=null||info!=""){
      var obj=JSON.parse(info);
      webInfo.reqApplicationType=obj.reqApplicationType
      webInfo.reqApplicationVersion=obj.reqApplicationVersion
			webInfo.osName=obj.osName;
			webInfo.osVersion=obj.appName;
			webInfo.mobileModel=obj.mobileModel;
			webInfo.packageName=obj.packageName;
      webInfo.versionName=obj.versionName;
      webInfo.appDownChannel=obj.appDownChannel
		}
	} else if (u.indexOf('iPhone') > -1) {
		//调用ios本地api
		bridge.callHandler('sendAppPublicParamBridge',
				function callback(response) {
			if(response!=null||response!=""){
				var obj=JSON.parse(response);
				webInfo.osName=obj.osName;
				webInfo.osVersion=obj.appName;
				webInfo.mobileModel=obj.mobileModel;
				webInfo.packageName=obj.packageName;
				webInfo.versionName=obj.versionName;
			}
		});
	}
}catch(err){

}


//百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?59145e98f3aa769fb64caaeb06d106e5";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();


function GetQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):"";
  }

function getToken(){
	/*var token=AppWebBaseData.getToken()
	if(token!=null&&token!=""){
		return token;
	}*/
    return GetQueryString("token");
  }
//传入json类型的数据，返回成用&拼接的字符串
function getParams(jsondata){
	var params = "";
	 for(var key in jsondata){
		 params += key+"="+ jsondata[key]+"&"
	 }
	 return params;
}


//cookie 管理
var cookieManager={
		ledOrderId:"preOrderid",
		setRootCookie:function (name,value)
		{
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();

		},
		setPathCookie:function (name,value,path)
		{
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();+"path="+path

		},
        getCookie:function (name)
		{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
		}
};
//cookie
var AppWebBaseData={
		key:"app_web_data",
		iosKey:"ios_web_data",//存储，ios返回的全局公共参数
	    initAppWebBaseData:function(requestBaseUrl,channelCode,productCode){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		var awbData={};
		    	awbData.requestBaseUrl=requestBaseUrl;
		    	awbData.channelCode=channelCode;
		    	awbData.productCode=productCode;
		    	//默认全局可以使用
		    	cookieManager.setRootCookie("app_web_data",JSON.stringify(awbData));
	    	}else{
	    		try{
	    			var awbData= JSON.parse(vstr);
			    	awbData.requestBaseUrl=requestBaseUrl;
			    	awbData.channelCode=channelCode;
			    	awbData.productCode=productCode;
			    	//默认全局可以使用
			    	cookieManager.setRootCookie("app_web_data",JSON.stringify(awbData));
	    	      } catch (err) {//如果失败则，认为cookie存储异常，进行覆盖
	    	    	var awbData={};
	  		    	awbData.requestBaseUrl=requestBaseUrl;
	  		    	awbData.channelCode=channelCode;
	  		    	awbData.productCode=productCode;
	  		    	//默认全局可以使用
	  		    	cookieManager.setRootCookie("app_web_data",JSON.stringify(awbData));
	    	    }
	    	}
	    },
	    getAppWebBaseDataObj:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		return JSON.parse(vstr);
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    setLoginInfo:function(token,mobile){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		var awbData={};
	    		awbData.token=token;
	    		awbData.mobile=mobile;
	    		//默认全局可以使用
		    	cookieManager.setRootCookie("app_web_data",JSON.stringify(awbData));
	    	}else{
	    		try{
	    			var baseData= JSON.parse(vstr);
	    			baseData.token=token;
	    			baseData.mobile=mobile;
		    		//默认全局可以使用
			    	cookieManager.setRootCookie("app_web_data",JSON.stringify(baseData));
	    	      } catch (err) {
	    	    	var awbData={};
	  	    		awbData.token=token;
	  	    		awbData.mobile=mobile;
	  	    		//默认全局可以使用
	  		    	cookieManager.setRootCookie("app_web_data",JSON.stringify(awbData));
	    	    }
	    	}
	    },
	    getToken:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		 var obj=JSON.parse(vstr);
	    		 return obj.token;
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    getRequestBaseUrl:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		 var obj=JSON.parse(vstr);
	    		 return obj.requestBaseUrl;
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    getMobile:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		 var obj=JSON.parse(vstr);
	    		 return obj.mobile;
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    getChannelCode:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		 var obj=JSON.parse(vstr);
	    		 return obj.channelCode;
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    getProductCode:function(){
	    	var vstr=cookieManager.getCookie("app_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		 var obj=JSON.parse(vstr);
	    		 return obj.productCode;
	    	} catch (err) {
	    		return null;
	    	}
	    },
	    initIosWebData:function(iosWebData){
	    	var vstr=cookieManager.getCookie("ios_web_data");
	    	if(vstr==null||vstr==""){
		    	//默认全局可以使用
		    	cookieManager.setRootCookie("ios_web_data",iosWebData);

	    	}else{
	    		try{
			    	//默认全局可以使用
			    	cookieManager.setRootCookie("ios_web_data",iosWebData);
	    	      } catch (err) {//如果失败则，认为cookie存储异常，进行覆盖
	    	    	  alert("cookie error")
	    	    }
	    	}
	    },
	    getIosWebBaseDataObj:function(){
	    	var vstr=cookieManager.getCookie("ios_web_data");
	    	if(vstr==null||vstr==""){
	    		return null;
	    	}
	    	try{
	    		return vstr;
	    	} catch (err) {
	    		return null;
	    	}
	    }
}
var mobileManager={
  openProductDetail:function(id, productName){   //打开产品详情
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.openProductDetail(id, productName);
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.openProductDetail(id, productName);
    } else {
      //非安卓和IOS的不处理
    }
  },
  onReceivedTitle:function(name){   //传递title给安卓
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.onReceivedTitle(name);
    } else if (u.indexOf('iPhone') > -1) {

      console.log(name)
      iosManager.onReceivedTitle(name);
    } else {
      //非安卓和IOS的不处理
    }
  },

  shareCircleFriendsFormH5:function(shareTitle,shareContent,url,productLogo){   //分享
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.shareCircleFriendsFormH5(shareTitle,shareContent,url,productLogo);
    } else if (u.indexOf('iPhone') > -1) {
      console.log(shareTitle)
      iosManager.shareCircleFriendsFormH5(shareTitle,shareContent,url,productLogo);
    } else {
      //非安卓和IOS的不处理
    }
  },
  tokenTimeOut:function(){   //token过期
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.tokenTimeOut();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  buriedPoint:function(id){   //埋点
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.buriedPoint(id);
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  goBack:function(){  ////返回上一级
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.goBack();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  clearOrderHistory:function(){   ////清空历时记录
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.clearOrderHistory();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  enableRefresh:function(boolean){   ////关闭下拉刷新
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.enableRefresh(boolean);
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  showOrHideBottomByOrder:function(boolean){  // 是否显示订单中心底部按钮
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.showOrHideBottomByOrder(boolean);
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.showOrHideBottomByOrder(boolean);
    } else {
      //非安卓和IOS的不处理
    }
  },
  skipToOrder:function(){//跳转订单页
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.skipToOrder();
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.skipToOrder();
    } else {
      //非安卓和IOS的不处理
    }
  },
  ensureToOrder:function(){//跳转订单页
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.ensureToOrder();
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.ensureToOrder();
    } else {
      //非安卓和IOS的不处理
    }
  },
  finishActivity:function(){//跳转订单页
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.finishActivity();
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.finishActivity();
    } else {
      //非安卓和IOS的不处理
    }
  },

  clearHomeHistory:function(){  //清缓存
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.clearHomeHistory();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  afterCrawler:function(){   //邮箱认证后调用的

    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.afterCrawler();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  refreshHomeUrl:function(){  ////刷新首页
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.refreshHomeUrl();
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.refreshHomeUrl();
    } else {
      //非安卓和IOS的不处理
    }
  },
  loginOut:function(){  //退出登录
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.loginOut();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  getUserInfo:function(){   //获取用户信息
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.getUserInfo();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
	showContacts:function(index){   //显示联系人对话框
	    var u = navigator.userAgent;
	    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
	      androidManager.showContacts(index);
	    } else if (u.indexOf('iPhone') > -1) {
	    } else {
	      //非安卓和IOS的不处理
	    }
	},
  startWecashActivity:function(){   //跳转至命中
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.startWecashActivity();
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.startWecashActivity();
    } else {
      //非安卓和IOS的不处理
    }
  },

  startLoginActivity:function(key){  //跳转登录页面 马上拿钱传1其他都传0
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.startLoginActivity(key);
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.startLoginActivity();
    } else {
      //非安卓和IOS的不处理
    }
  },
  extremeLoan:function(){  //flag标记产品详情页
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.extremeLoan();
    } else if (u.indexOf('iPhone') > -1) {
    } else {
      //非安卓和IOS的不处理
    }
  },
  hideBottomBar:function(){        //隐藏底部栏
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.hideBottomBar();
      return "Android_app"
    } else if (u.indexOf('iPhone') > -1) {
      // iosManager.hiddenControlBridge();
      iosManager.hideBottomBar();
      return "IPhone_app";
    } else {
      //非安卓和IOS的不处理
    }
  },
  showBottomBar:function(){ //显示底部栏
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.showBottomBar();
      return "Android_app"
    } else if (u.indexOf('iPhone') > -1) {
      // iosManager.showNavBridge("")
      iosManager.showBottomBar("");
      return "IPhone_app";
    } else {
      //非安卓和IOS的不处理
    }
  },//授权，通知App进行sdk授权，数据拉取
  applyParams:function(type,mobile,idcard,name,taskId,index){
    var u = navigator.userAgent;
    try {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        androidManager.applyParams(type,mobile,idcard,name,taskId,index);
        return "Android_app"
      } else if (u.indexOf('iPhone') > -1) {
        //ios
        iosManager.startRDPCrawlerBridge(type,mobile,idcard,name,taskId);
        return "IPhone_app"
      } else {
        //非安卓和IOS的不处理
      }
    } catch (err) {
               //没有方法不处理,异常捕获不阻断页面其他js的正常使用
    }
    return ""
  },
  isOrderCenter:function(){ // 判断是否是订单中心
    var u = navigator.userAgent;
    try{
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        console.log('and--');
        var res = window.javaScriptFunction.isOrderCenter();
        console.log(`--res: ${res} ${typeof res}`);
        return res;
      } else if (u.indexOf('iPhone') > -1) {
        console.log('ios--');
        // return AppWebBaseData.getIosWebBaseDataObj()
        var iosRes=AppWebBaseData.isOrderCenter()//json格式
        console.log(`--iosRes: ${iosRes} ${typeof iosRes}`);
        return iosRes;
      } else {
        //非安卓和IOS的不处理
        console.log('not and not ios--');
      }
    }catch(err){
      console.log('mobileManager.isOrderCenter---');
      console.log(err);
      console.log(err.message);
    }

  },
  getDeviceInfo:function(){//--1
    var u = navigator.userAgent;
    try {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        var info=window.javaScriptFunction.getDeviceInfo();
        return jQuery.parseJSON(info);
      } else if (u.indexOf('iPhone') > -1) {
        var iosWebData=AppWebBaseData.getIosWebBaseDataObj()//json格式
        return jQuery.parseJSON(iosWebData);
      } else {
        //非安卓和IOS的不处理
      }
    } catch (err) {
        //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        //var txt="There was an error on this page.\n\n";
        //txt+="Error description: " + err.message + "\n\n";
        //txt+="Click OK to continue.\n\n";
        //alert(txt);
    }
    return ""
  },

  /**  乐宝口袋 start**/
  //H5登录之后，将token和mobile给App,收到登录成功的信息后更新登录信息
  updateMobileLoginInfo:function(mobile,token){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.updateMobileLoginInfo(mobile,token)
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.loginSuccessUpdateLoginInfoBridge(token, mobile);
    } else {
      //非安卓和IOS的不处理
    }
  },
  //H5登录之后，将token和mobile给App,App收到登录成功的信息后初始化菜单等原生界面
  loginDeal:function(mobile,token){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      androidManager.loginDeal(mobile,token)
    } else if (u.indexOf('iPhone') > -1) {
      iosManager.loginSuccessInitMenuBridge(token, mobile)
    } else {
      //非安卓和IOS的不处理
    }
  },
  appCheck:function(){
    var u = navigator.userAgent;
    try {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        var info=window.javaScriptFunction.getDeviceInfo();
        return "Android_app"
      } else if (u.indexOf('iPhone') > -1) {
        //调用ios本地api
        var iosWebData=AppWebBaseData.getIosWebBaseDataObj()//json格式
        if(iosWebData  == undefined){
          return "";
        }else{
          return "IPhone_app";
        }
      } else {
        //非安卓和IOS的不处理
      }
    } catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        //var txt="There was an error on this page.\n\n";
        //txt+="Error description: " + err.message + "\n\n";
        //txt+="Click OK to continue.\n\n";
        //alert(txt);
    }
    return ""
  },
  loginOutDeal:function(mobile,token){
    var u = navigator.userAgent;
    try {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        androidManager.loginOutDeal(mobile,token)
        return "Android_app"
      } else if (u.indexOf('iPhone') > -1) {
        iosManager.h5LoginOverdueBridge(token, mobile)
        return "IPhone_app"
      } else {
        //非安卓和IOS的不处理
      }
    } catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
    }
    return ""
  },
  initButtonData:function(baseUrl,productCode,channelCode){
    var u = navigator.userAgent;
    try {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        androidManager.initButtonData(baseUrl,productCode,channelCode)
        return "Android_app"
      } else if (u.indexOf('iPhone') > -1) {
        iosManager.initControlBridge(baseUrl, productCode, channelCode)
        return "IPhone_app"
      } else {
        //非安卓和IOS的不处理
      }
    } catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
    }
    return ""
  },
  /**  乐宝口袋 end**/

}
//安卓
var androidManager={
		updateMobileLoginInfo:function(mobile,token){
			try {
				var userInfo={};
				userInfo.mobile=mobile;
				userInfo.token=token;
				window.javaScriptFunction.updateUserInfo(JSON.stringify(userInfo));//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		//登录操作，影响App:显示导航栏，注入App的登录信息
		loginDeal:function(mobile,token){
			try {
				var userInfo={};
				userInfo.mobile=mobile;
				userInfo.token=token;
				window.javaScriptFunction.loginDeal(JSON.stringify(userInfo));//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		//退出操作，影响App:隐藏导航栏，清空App保存的登录信息
		loginOutDeal:function(mobile,token){
			try {
				var userInfo={};
				userInfo.mobile=mobile;
				userInfo.token=token;
				window.javaScriptFunction.loginDeal(JSON.stringify(userInfo));//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		//显示导航栏，设置默认选择项   0.首页，1.订单中心
		showBottomBar:function(){
			try {
				window.javaScriptFunction.showBottomBar();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		//隐藏导航栏，
		hideBottomBar:function(){
			try {
				window.javaScriptFunction.hideBottomBar();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		isShowBottomBar:function(){
			try {
				window.javaScriptFunction.isShowBottomBar();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		initButtonData:function(baseUrl,productCode,channelCode){
			try {
				var initdatas=new Array()
				var homedata={};
				homedata.tab="home";
				/*var reg=new RegExp("^https");
				if(reg.test(baseUrl)){  //如果是https，则换成http
					baseUrl=baseUrl.replace(/https/,"http");
				}*/
				homedata.host=baseUrl+'app/web/loanIndex?channelCode='+channelCode+'&productCode='+productCode;
				homedata.params=new Array();
				initdatas.push(homedata);

				var odata={};
				odata.tab="orderCenter";
				odata.host=baseUrl+'app/web/toOrderHistory?channelCode='+channelCode+'&productCode='+productCode;
				odata.params=new Array();
				initdatas.push(odata);

				window.javaScriptFunction.initButtonData(JSON.stringify(initdatas));//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		//授权，通知App进行sdk授权，数据拉取
		applyParams:function(type,mobile,idcard,name,taskId,index){
			try {
				var userInfo={};
				userInfo.type=type;
				userInfo.mobile=mobile;
				userInfo.idcard=idcard;
				userInfo.name=name;
				userInfo.taskId=taskId;
				userInfo.index=index;
				window.javaScriptFunction.applyParams(JSON.stringify(userInfo));//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},	//授权，通知App进行sdk授权，数据拉取
		startLoginActivity:function(key){
			try {
				window.javaScriptFunction.startLoginActivity(key);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    extremeLoan:function(){  //flag标记产品详情页
			try {
				window.javaScriptFunction.extremeLoan();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    startWecashActivity:function(){  //跳转至命中
			try {
				window.javaScriptFunction.startWecashActivity();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    getUserInfo:function(){   //获取用户信息
			try {
				window.javaScriptFunction.getUserInfo();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    showContacts:function(index){   //显示联系人对话框
			try {
				window.javaScriptFunction.showContacts(index);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    loginOut:function(){  //退出登录
			try {
				window.javaScriptFunction.loginOut();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    refreshHomeUrl:function(){    //刷新首页
			try {
				window.javaScriptFunction.refreshHomeUrl();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    afterCrawler:function(){  //邮箱认证后调用的
			try {
				window.javaScriptFunction.afterCrawler();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    clearHomeHistory:function(){    //清缓存
			try {
				window.javaScriptFunction.clearHomeHistory();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    enableRefresh:function(boolean){  //关闭下拉刷新
			try {
				window.javaScriptFunction.enableRefresh(boolean);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    showOrHideBottomByOrder:function(boolean){  // 是否显示订单中心底部按钮
			try {
				window.javaScriptFunction.showOrHideBottomByOrder(boolean);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    skipToOrder:function(){  //跳转订单页
			try {
				window.javaScriptFunction.skipToOrder();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    ensureToOrder:function(){  //跳转订单页
			try {
				window.javaScriptFunction.ensureToOrder();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    finishActivity:function(){  //跳转订单页
			try {
				window.javaScriptFunction.finishActivity();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    isOrderCenter:function(){  // 判断是否是订单中心
			try {
			  window.javaScriptFunction.isOrderCenter();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        console.log('androidManager.isOrderCenter---');
        console.log(err);
        console.log(err.message);
			}
    },

    clearOrderHistory:function(){    //清空历时记录
			try {
				window.javaScriptFunction.clearOrderHistory();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    goBack:function(){    //返回上一级
			try {
				window.javaScriptFunction.goBack();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    buriedPoint:function(id){    //埋点id
			try {
				window.javaScriptFunction.buriedPoint(id);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    tokenTimeOut:function(){    //token过期
			try {
				window.javaScriptFunction.tokenTimeOut();//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    shareCircleFriendsFormH5:function(shareTitle,shareContent,url,productLogo){    //风向
			try {
				window.javaScriptFunction.shareCircleFriendsFormH5(shareTitle,shareContent,url,productLogo);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },

    onReceivedTitle:function(name){    //传递title给安卓
			try {
				window.javaScriptFunction.onReceivedTitle(name);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    },
    openProductDetail:function(id, productName){  //打开产品详情
      try {
				window.javaScriptFunction.openProductDetail(id, productName);//调用安卓本地api
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
    }
}

//ios
var iosManager={
		 /*这段代码是固定的，必须要放到js中*/
		setupWebViewJavascriptBridge:function (callback) {
		    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		    window.WVJBCallbacks = [callback];
		    var WVJBIframe = document.createElement('iframe');
		    WVJBIframe.style.display = 'none';
		    WVJBIframe.src = 'https://__bridge_loaded__';
		    document.documentElement.appendChild(WVJBIframe);
		    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		},
		//通知ios进行邮箱授权
		startRDPCrawlerBridge:function(type,mobile,idcard,name,taskId){
			var userInfo={};
			userInfo.type=4;
			userInfo.mobile=mobile;
			userInfo.idcard=idcard;
			userInfo.name=name;
			userInfo.taskId=taskId;
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('startRDPCrawlerBridge',userInfo,
				         function callback(response) {
				           //回调
				         })
			   })
		},
		//登录之后，将token和mobile给App,收到登录成功的信息后更新登录信息
		loginSuccessUpdateLoginInfoBridge:function(token,mobile){
			var userInfo={};
			userInfo.type=token;
			userInfo.mobile=mobile;
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('loginSuccessUpdateLoginInfoBridge',userInfo,
				         function callback(response) {
				           //回调

				         })

			   })
		},
		//登录之后，将token和mobile给App,收到登录成功的信息后、初始化菜单等原生界面
		loginSuccessInitMenuBridge:function(token,mobile){
			try {
				var userInfo={};
				userInfo.token=token;
				userInfo.mobile=mobile;
				 /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*///调用ios本地api
				iosManager.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('loginSuccessInitMenuBridge',userInfo,
					         function callback(response) {
					           //回调

					         })

				   })
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}


		},
		//返回app端的公共参数，
		sendAppPublicParamBridge:function(){
        try {
          /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
          iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
            /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
            iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
              bridge.callHandler('sendAppPublicParamBridge',
                  function callback(response) {
                //回调
                AppWebBaseData.initIosWebData(JSON.stringify(response))
              })
            })
          })
        } catch (err) {
          //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //H5登录过期之后，App清空token和mobile的保存
    h5LoginOverdueBridge:function(token,mobile){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('h5LoginOverdueBridge',//调用ios本地api
              function callback(response) {
            //回调
          })

        })
      } catch (err) {
        //没有方法不处理,异常捕获不阻断页面其他js的正常使用
    }
    },
    //初始化组件并显示（导航栏{首页、订单中心}两个按钮；
    initControlBridge:function(baseUrl,productCode,channelCode){
      try {
        var data={};
        data.homeUrl=baseUrl+'app/web/loanIndex?channelCode='+channelCode+'&productCode='+productCode;
        data.orderUrl=baseUrl+'app/web/toOrderHistory?channelCode='+channelCode+'&productCode='+productCode;
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('initControlBridge',data,//调用ios本地api
                  function callback(response) {
                    //回调

                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //隐藏组件
    hiddenControlBridge:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('hiddenControlBridge',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //显示导航栏，设置默认选择项   0.首页，1.订单中心
    showNavBridge:function(homeType){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('showNavBridge',homeType,
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
     //v3.6
    //传递标题
    onReceivedTitle:function(key){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        //window.webkit.messageHandlers.<方法名>.postMessage(<数据>)
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('onReceivedTitle',key,
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //v3.6
    //去登录
    startLoginActivity:function(key){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        //window.webkit.messageHandlers.<方法名>.postMessage(<数据>)
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('startLoginActivity',key,
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //隐藏tabbar
    hideBottomBar:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('hideBottomBar',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //显示tabbar
    showBottomBar:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('showBottomBar',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //跳转首页原生
    startWecashActivity:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('startWecashActivity',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //跳转身份认证
    setCurrentPageType:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('setCurrentPageType',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //上传联系人
    uploadContacts:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('uploadContacts',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
   // 刷新首页
   refreshHomeUrl:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('refreshHomeUrl',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
    //跳转到订单页
    skipToOrder:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('skipToOrder',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },
      //跳转到订单页
    finishActivity:function(){
		  console.log('finishActivity-ios--');
        try {
          /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
          iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
            bridge.callHandler('finishActivity',
                    function callback(response) {
                      //回调
                    })
            })
        } catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        }
      },
    //跳转到订单页
    ensureToOrder:function(){
		  console.log('ensureToOrder-ios--');
        try {
          /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
          iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
            bridge.callHandler('ensureToOrder',
                    function callback(response) {
                      //回调
                    })
            })
        } catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
          console.log(err.message);
        }
      },
    //此页是否是订单页
    isOrderCenter:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('isOrderCenter',
            function callback(response) {
              //回调
            })
          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        console.log(err);
        console.log(err.message);
      }
    },
    //显示认证挽留对话框
    showRetainDialog:function(){
      try {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('showRetainDialog',
                  function callback(response) {
                    //回调
                  })

          })
      } catch (err) {
              //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
    },

    // 订单-隐藏或者显示tabbar
    showOrHideBottomByOrder:function(boolean){
        try {
          iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
            bridge.callHandler('showOrHideBottomByOrder',boolean,
              function callback(response) {
                //回调
              })

          })
        } catch (err) {
          //没有方法不处理,异常捕获不阻断页面其他js的正常使用
        }
    },
    //打开产品详情
    openProductDetail:function(id, productName ){
      try {
        iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
          bridge.callHandler('openProductDetail', {id, productName},
            function callback(response) {
              //回调
            })

        })
      } catch (err) {
        //没有方法不处理,异常捕获不阻断页面其他js的正常使用
      }
  },
   //产品详情分享
   shareCircleFriendsFormH5:function(shareTitle, shareContent,url,productLogo){
    try {
      iosManager.setupWebViewJavascriptBridge(function(bridge) {//调用ios本地api
        bridge.callHandler('shareCircleFriendsFormH5', {shareTitle,shareContent,url,productLogo},
          function callback(response) {
            //回调
          })

      })
    } catch (err) {
      //没有方法不处理,异常捕获不阻断页面其他js的正常使用
    }
  },

  }
//主动从ios端获取公共参数，存入cookie中
//iosManager.sendAppPublicParamBridge();

//静态注册方法，ios调用的js
iosManager.setupWebViewJavascriptBridge(function(bridge) {
	//注册方法：ios主动将公共参数返给我
	bridge.registerHandler('initMobileParams', function(data, responseCallback) {
    responseCallback("OK");
  })
})


export {mobileManager,webInfo}
