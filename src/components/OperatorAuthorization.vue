<template>
	<div class="content">
		<div class="log">
			<img src="../assets/img/success@2x.png"/>
			<i class="cushion"></i>
		</div>
		<div class="info">邮箱认证中</div>
		<div class="button">
			<div class="buttonText" @click="jumpPage">确定</div>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import {mobileManager} from '../utils/WebInfo.js';
	import {grantManager} from '../utils/grant.js';
	export default{
		data(){
			return{
				Pageparams:'',
				token:'',
				type:''
			}
		},
		created:function() {
			this.getParamsFromUrl();
			this.Pageparams={
				token: sessionStorage.QuickLoanIndextToken,
				channelCode: sessionStorage.QuickLoanIndexChannelCode,
				productCode: sessionStorage.QuickLoanIndexProductCode
			}
		},
		methods:{
			getParamsFromUrl(){
				let paramUrl = document.location.href;
//				let paramUrl = 'http://192.168.1.165:8082/appServer/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/OperatorAuthorization?1=1&returnUrl=null&phone=null&packageName=null&versionCode=null&type=1&appDownChannel=null&mobileModel=null&mobileId=null&token=222222&name=null&userId=914081478893860388&notifyUrl=null&idNumber=null&reqApplicationVersion=null&taskId=RC1531460015988_131824&platform=null&osVersion=null&channelCode=null&outUniqueId=null&productCode=null&returnPageUrl=null&versionName=null&reqApplicationType=null&reqMobile=null&session=null&osName=null'
				let arr = paramUrl.split('?')
	            if (arr[1]) {
		            let newArr = arr[1].split('&')
		            for(var i=0; i < newArr.length; i++) {
		              var item = newArr[i]
		              
		              if (/token=/.test(item)) {
		              	console.log(item)
		                  this.token = item.split('=')[1];
		              }
		              if (/type=/.test(item)) {
		                  this.type = item.split('=')[1];
		              }
		
		            }
	        	 }
			},
			jumpPage(){
				//type=2回到上一页
				//type=1调接口判断跳转
				if(this.type==2){
					this.$router.goBack();
				}else if(this.type==1){
					let webInfo=this.lbdUtil.getWebInfoObj();
					let params={
						token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode
					}
					let data = this.$qs.stringify(Object.assign(params,webInfo));	
					Indicator.open({ spinnerType: 'fading-circle' });
					this.$http.post(this.lbdUtil.host+'/userInfo/authenticationProcess',
						data
			   		 ).then((res)=>{
						if(res.data.status==='0000'){
							Indicator.close();
							if((res.data.data.nowGrantStatus==1 || res.data.data.nowGrantStatus==2) && res.data.data.nowGrantStep==0){
								//跳补充信息页
								this.$router.push({ name: 'OnekeyQuotaSupplyMessage', params: this.Pageparams , query: this.Pageparams});
							}
							if(res.data.data.nowGrantStep==2){
								//认证未通过  跳转到原生身份证认证页
								grantManager.checkIdCard(1);
							}
							if(res.data.data.nowGrantStep==3){
								//认证未通过 跳转到运营商认证页
								let returnPageUrl = encodeURIComponent(this.lbdUtil.host + `/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/HomePageMiss?1=1&productCode=${sessionStorage.QuickLoanIndexProductCode}&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&token=${sessionStorage.QuickLoanIndextToken}&type=oneKeyLoan`,"UTF-8")   //运营商参数
					            let urls = this.lbdUtil.host + `/grantUserByTianji/grantUserMobileByTianji?token=${sessionStorage.QuickLoanIndextToken}&productCode=${sessionStorage.QuickLoanIndexProductCode}&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&returnPageUrl=${returnPageUrl}`;
					            let webInfo = this.lbdUtil.getWebInfoUrl();
					            window.location = urls + webInfo;	
							}
							if(res.data.data.nowGrantStep==4){
								//认证未通过 邮箱认证页(原生sdk)
								this.ToEmailSDKAuthentication();
							}
						}else{
							Indicator.close();
						}
					
					},(err)=>{
						Indicator.close();
					});
					
				}
	    		
	    	},
	        //邮箱SDK认证
			ToEmailSDKAuthentication() {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				Indicator.open({ spinnerType: 'fading-circle' });
				this.$http.get(this.lbdUtil.host +'/grantUserByTianji/saveCreditSDKInfo?'+webInfo,{
					params:{	
				    	token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode, 
				    	productCode: sessionStorage.QuickLoanIndexProductCode
				  	},
				}).then((res)=>{
					let resData=res.data;
					if(resData.status=='0000'){//已经授权,下一步是提交
						let idCard=resData.data.idCard;
						let mobile=resData.data.mobile;
						let name=resData.data.name;
						let taskId=resData.data.outUniqueId;
						mobileManager.applyParams('ec',mobile,idCard,name,taskId,1);
					}else{
						
					}
					Indicator.close();
				},(err)=>{
					Indicator.close();
					console.log(err,'请求失败');
				});
			},
		}
	}
</script>

<style scoped lang="less">
	@w:72rem;
	.content{
		height: 100%;
		background: #FFFFFF !important;
	}
	.log{
		margin-top: 200/@w;
		text-align: center;
		img{
			position: relative;
			margin: 0 auto;
			width: 232/@w;
			height: 173/@w;
			z-index: 99;
		}
		.cushion {
		    position: absolute;
		    top: 350/@w;
		    left: 50%;
		    transform: translateX(-50%);
		    width: 3.33333333rem;
		    height: 0.64rem;
		    border-radius: 50%;
		    background: #ccc;
		}
	}
	.info{
		margin-top: 50/@w;
		font-size: 35/@w;
		color: #888888;
		text-align: center;
	}
	.button{
		margin-top: 80/@w;
		width: 100%;
		.buttonText{
			width: 250/@w;
			height: 80/@w;
			font-size: 35/@w;
			color: #FFFFFF;
			text-align: center;
			line-height:80/@w;
			margin: 0 auto;
			background: #CCCCCC;
			border-radius: 8/@w;
		}
	}
</style>