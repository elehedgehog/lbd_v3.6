<template>
	<div>
		<div>
			<mt-header title="基础信息" class="lbd-head-normal" v-if="pageType">
		    	<mt-button icon="back" @click="back" slot="left"></mt-button>
			</mt-header>
		</div>
		<div :class="['content',{'on': !pageType}]">
			<div class="progress">
				<div class="progress-top"></div>
				<div class="progress-line">
					<span class="gray"></span>
					<span class="orange" :style="{ width: progressWidth+ 'rem' }"><i :style="{ left: pointleft+ 'rem' }"><i></i></i></span>
				</div>
				<div class="progress-bottom">已完成{{this.nowPercent}}%</div>
			</div>
		

			<div class="list information">
				<div class="quota-item quota-title">该信息将作为您的实名凭证,请确保真实</div>
				<div class="quota-item">
					<span>姓名</span>
					<span><input type="text" v-model="userName" placeholder="请输入真实姓名"/></span>
				</div>
				<div class="quota-item ">
					<span>身份证</span>
					<span><input type="text" v-model="userIdCardNum" placeholder="请输入真实身份证号"/></span>
				</div>
				<div class="quota-item ">
					<label>借款用途</label>
					<span id="loadReason">日常消费</span>
					<!--<select class="selected" id="loadReason" v-model="loadReason">
						<option value="">请选择</option>
						<option value="日常消费">日常消费</option>
						<option value="家庭装修">家庭装修</option>
						<option value="旅游度假">旅游度假</option>
						<option value="教育培训">教育培训</option>
						<option value="健康医疗">健康医疗</option>
					</select>
					<img src="../assets/img/fdddds@2x.png"/>-->
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="button" v-if="showSubmitBtn" @click="beforeSubmitAuthenticationMessageIntercept">下一步</div>
			<div class="button disableClick" v-if="showNoNextStep">下一步</div>
			<div class="buttom-text"><i class="buttom-text-icon"></i>智能加密,实时保证您的信息安全</div>
		</div>
	</div>
</template>

<script>
	import { MessageBox, Toast, Indicator } from 'mint-ui';
	import {grantManager} from '../utils/grant.js';
	import {mobileManager} from '../utils/WebInfo.js'
	export default{
		name:'Authentication',
		data(){
			return{
				nowPercent:0,
				progressWidth:0,
				pointleft:0,
				quotaNumber:'',
				userName:'',
				userIdCardNum:'',
				academic:'',
				Pageparams : this.$route.params, //上页面传过来的值
				showSubmitBtn: true,
				showNoNextStep:false
			}
		},
		created:function(){
			
//			sessionStorage.QuickLoanIndextToken= '4754255429298367'
//			sessionStorage.QuickLoanIndexChannelCode='lbdApp'
			
			mobileManager.hideBottomBar();
      		mobileManager.buriedPoint('fastloan_realname_auth')  //埋点id
			
			this.getAuthenticationProcess();
			this.getAuthenticationMessage();
			//显示隐藏头部(true为h5 显示头部  false为原生访问，不显示头部)
			if(this.$route.params.pageType){
	          this.pageType = this.$route.params.pageType;
	          sessionStorage.isShowHeader=true;//防止下拉刷新获取不到url的参数
	          console.log(this.pageType)
	        }

			if(sessionStorage.isShowHeader){
				this.pageType=true;
			}
			window.confirmBack=this.confirmBack;
			grantManager.setCurrentPageType(4);
		},
		methods:{
			back(){
		      	//点击返回弹出原生的确认框
				grantManager.showRetainDialog(4);
	        },
	        confirmBack(){
	        	//点击原生确认弹框后原生调该函数执行back
	        	 this.$router.goBack();
	        },

	         //获取进度
			getAuthenticationProcess() {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(this.lbdUtil.host +'/userInfo/authenticationProcess?'+webInfo,{
					params:{
				    	token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode
				  	},
				}).then((res)=>{
					console.log(res)
					if(res.data.status==='0000'){
						this.nowPercent=res.data.data.nowPercent;
						this.progressWidth=6.94444444*(this.nowPercent/100);
						this.pointleft=this.progressWidth==0? 0 : this.progressWidth-0.28;
					}else{
//						this.showToast(res.data.msg);
					}
				},(err)=>{
//					this.showToast('网路出错');
					console.log(err,'请求失败');
				});
			},

			//展示已填写的信息
			getAuthenticationMessage() {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(this.lbdUtil.host +'/user/userOrgInfo/queryUserOrgInfo?'+webInfo,{
					params:{
				    	token: sessionStorage.QuickLoanIndextToken,
				    	channelCode: sessionStorage.QuickLoanIndexChannelCode,
				  	},
				}).then((res)=>{
					console.log(res);
					if(res.data.status==='0000'){
						let dataList = res.data.data;
						if(dataList==null){
							return;
						}
						this.quotaNumber=dataList.applayAmount;
						this.userName=dataList.userName;
						this.userIdCardNum=dataList.userIdcard;
						this.academic=dataList.academic;
					}else{
//						this.showToast(res.data.msg);
					}
				},(err)=>{
					console.log(err,'请求失败');
				});
			},
			
			//前置拦截
			beforeSubmitAuthenticationMessageIntercept() {
				let webInfo=this.lbdUtil.getWebInfoObj();
				let params={
					token: sessionStorage.QuickLoanIndextToken,
					channelCode: sessionStorage.QuickLoanIndexChannelCode,
				}
				let data = this.$qs.stringify(Object.assign(params,webInfo));
				Indicator.open({ spinnerType: 'fading-circle' });
				this.$http.post(this.lbdUtil.host+'/app/webFrame/allPreInterceptingByAppMobileExpress',
					data
			  ).then((res)=>{
					if(res.data.status==='0000'){
						//0不命中
						//1=撞特点库(还款中、在申中),2=PD白名单(A类白名单),3=PD风控白名单(B类白名单) 4=PD分控黑名单

						console.log(res);
						Indicator.close();	
						if(res.data.data==1 || res.data.data==4){
							//按钮置灰
							this.showSubmitBtn=false;
							this.showNoNextStep=true;
							MessageBox.alert('您的资质暂无法申请该产品，可以看看其他产品哦~').then(action => {
								//回到首页
								this.$router.push({ name: 'HomePageMiss', params: this.Pageparams ,query: this.Pageparams});
							});
						}else{
							//没命中就保存信息
							this.submitAuthenticationMessage();
						}
					}else{
						Indicator.close();
//							this.showToast(res.data.msg);
					}
				},(err)=>{
					Indicator.close();
//						this.showToast('网路出错');
				});
			},

			submitAuthenticationMessage() {
				let webInfo = this.lbdUtil.getWebInfoObj();
				let params={
						token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode,
						idCard:this.userIdCardNum,
						applayAmount:'1500',
						loadReason: '日常消费',
						name:this.userName,
						academic:this.academic,
						loadSrc:'5'	//测试用的参数
					}
				let data = this.$qs.stringify(Object.assign(params,webInfo));
				let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(this.userName=='' || this.userName==null){
					this.showToast('请输真实姓名');
				}else if(this.userIdCardNum=='' || this.userIdCardNum==null){
					this.showToast('请输身份证号码');
				}else if(reg.test(this.userIdCardNum) === false){
					this.showToast('请输正确的身份证号码');
				}else{
					Indicator.open({ spinnerType: 'fading-circle' });
					this.$http.post(this.lbdUtil.host+'/user/userOrgInfo/userInfoAuthentication',
						data
					).then((res)=>{
						console.log(res);
						if(res.data.status==='0000'){
							this.showToast('保存成功!');
							//this.$router.goBack();
							//跳入运营商认证页
							let returnPageUrl = encodeURIComponent(this.lbdUtil.host + `/webpage/hybridAppForWeb/lbd_v3.6/dist/index.html#/QuickLoanIndex?1=1&productCode=${sessionStorage.QuickLoanIndexProductCode}&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&token=${sessionStorage.QuickLoanIndextToken}`,"UTF-8")   //运营商参数
				            let urls = this.lbdUtil.host + `/grantUserByTianji/grantUserMobileByTianji?token=${sessionStorage.QuickLoanIndextToken}&productCode=${sessionStorage.QuickLoanIndexProductCode}&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&returnPageUrl=${returnPageUrl}`;
				            let webInfo = this.lbdUtil.getWebInfoUrl();
				            console.log(urls + webInfo);
				            window.location = urls + webInfo;
						}else{
							this.showToast(res.data.msg);
						}
						Indicator.close();
					},(err)=>{
						Indicator.close();
						this.showToast('保存失败,网络出错');
						console.log(err,'请求失败');
					});

					grantManager.setCurrentPageType(0);
				}
			},
			showToast(title) {
				Toast({
				  message: title,
				  position: 'bottom',
				  duration: 2000
				});
			}
		}
	}
</script>

<style scoped lang="less">
	@w:72rem;
	.content{
		padding-top: 51px;
		&.on{
	      padding-top: 0px!important;
	    }
		background-color: #F0F0F0;
		.progress{
			height: 160/@w;
			background: #FFFFFF;
			font-size:28/@w;
			padding-left: 37/@w;
			margin-bottom:20/@w;
			.progress-top{
				color: #EE5F11;
				padding-top:20/@w;
			}
			.progress-line{
				margin-top:20/@w;
				margin-bottom:15/@w;
				height: 18/@w;
				position: relative;
				span{
					display: block;
					height: 18/@w;
					width: 500/@w;
					border-radius: 9/@w;
					position: absolute;
				}
				.gray{

					background: #F0F0F0;
				}
				.orange{
					width: 250/@w;
					background: #FFA800;
					i{
						display: inline-block;
						position: absolute;
						left: 230/@w;
						height: 32/@w;
						width: 32/@w;
						line-height: 32/@w;
						background: #FFA800;
						float: right;
						margin-top: -7/@w;
						border-radius: 50%;
						i{
							display: inline-block;
							position: absolute;
							height: 16/@w;
							width: 16/@w;
							background: #FFFFFF;
							border-radius: 50%;
							top: 50%;
							left: 50%;
							margin-top:-8/@w;
							margin-left:-8/@w;
						}
					}
				}
			}
			.progress-bottom{
				clear: both;
				overflow: auto;
			}
		}
		.list{
			background-color: #FFFFFF;
			.quota-item{
				position: relative;
				height: 80/@w;
				line-height: 80/@w;
				font-size: 28/@w;
				color: #4D4D4D;
				padding-left: 37/@w;
				border-bottom: 1px solid #F0F0F0;
				box-sizing: border-box;
				overflow: hidden;
				span:last-child{
					display: inline-block;
					/*height:64/@w;*/
					height: 75/@w;
					/*height: 100%;*/
					position: absolute;
					right:39/@w;
					top: 50%;
					margin-top: -40/@w;
					box-sizing: border-box;
					overflow: hidden;
					input{
						text-align: right;
						/*height: 100%;*/
						height: 75/@w;
						font-size: 28/@w;
						border: none;
						outline:0;
						box-sizing: border-box;
					}
					input::-webkit-input-placeholder{
						color: #B0B0B0 !important;
					}
				}
				select{
					position: absolute;
					height:70/@w;
				    line-height: 70/@w;
				    width: 40%;
				    right:39/@w;
					top: 50%;
					right: 0;
					margin-top: -35/@w;
					margin-right: 65/@w;
				    font-size: 28/@w;
				    margin-bottom: 0 !important;
				    padding-right: 0 !important;
				    direction: rtl;
				    color: #646464;
				    border: 0!important;
			        background-color: #fff;
			        color: #646464;
			        align-items: center;
			        white-space: pre;
			        -moz-appearance: none;
			        -webkit-appearance:none;
			        appearance:none;
			        outline: none;
				}
				img{
					position: absolute;
			        right: 0;
			        top: 50%;
			        margin-top: -18/@w;
			        width: 20/@w;
			        height: 36/@w;
			        margin-right: 40/@w;
				}
			}
			.quota-title{
				background: #FAFAFA;
				line-height: 70/@w;
			}
		}
		.information{
			margin-top: 20/@w;
		}
	}

	.bottom{
		margin-top: 160/@w;
		.button{
			margin: 0 auto;
			width: 400/@w;
			height: 80/@w;
			background: #FFA800;
			font-size: 40/@w;
			color: #FFFFFF;
			border-radius: 10/@w;
			text-align: center;
			line-height: 80/@w;
		}
		.disableClick{
			background-color: #BBBBBB;
		}
		.buttom-text{
			margin-top: 250/@w;
			margin-bottom: 50/@w;
			font-size: 25/@w;
			color: #999999;
			text-align: center;
			/*margin-bottom: 150/@w;*/
			.buttom-text-icon{
				display: inline-block;
				width: 30/@w;
				height: 38/@w;
				background-image: url(../assets/img/safe.png);
				background-size: 100%;
				vertical-align:middle;
				margin-right: 8/@w;
			}
		}
	}
</style>
