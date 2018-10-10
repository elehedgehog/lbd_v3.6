<template>
	<div>
		<div>
			<mt-header title="实名认证" class="lbd-head-normal" v-if="pageType">
		    	<mt-button icon="back" @click="back" slot="left"></mt-button>
			</mt-header>
			<!--<mt-header title="实名认证" class="lbd-head-normal">
		    	<mt-button icon="back" @click="back" slot="left"></mt-button>
			</mt-header>-->
		</div>
		<div :class="['content',{'on': !pageType}]">
		<!--<div class="content">-->
			<div class="progress">
				<div class="progress-top">完成认证最高获得2000额度.</div>
				<div class="progress-line">
					<span class="gray"></span>
					<span class="orange" :style="{ width: progressWidth+ 'rem' }"><i :style="{ left: pointleft+ 'rem' }"><i></i></i></span>
				</div>
				<div class="progress-bottom">已完成{{this.nowPercent}}%</div>
			</div>
			<div class="list quota">
				<div class="quota-item quota-title">选择您期望的额度</div>
				<div class="quota-item">
					<!--<span>借多少?</span>
					<span><input type="number"  v-model="quotaNumber" placeholder="3000-4000"/></span>-->
					<span>借多少?</span>
					<select class="selected" v-model="quotaNumber">
						<option value="">请选择</option>
						<option value="3000">3000</option>
						<option value="3500">3500</option>
						<option value="4000">4000</option>
					</select>
					<img src="../assets/img/fdddds@2x.png"/>
				</div>
				<div class="quota-item ">
					<span>要借多久?</span>
					<span>12期</span>
				</div>
				<div class="quota-item ">
					<label>借款用途</label>
					<select class="selected" id="loadReason" v-model="loadReason">
						<option value="">请选择</option>
						<option value="日常消费">日常消费</option>
						<option value="家庭装修">家庭装修</option>
						<option value="旅游度假">旅游度假</option>
						<option value="教育培训">教育培训</option>
						<option value="健康医疗">健康医疗</option>
					</select>
					<img src="../assets/img/fdddds@2x.png"/>
				</div>
			</div>
			
			<div class="list information">
				<div class="quota-item quota-title">实名认证提交申请将无法修改,请谨慎填写</div>
				<div class="quota-item">
					<span>姓名</span>
					<span><input type="text" v-model="userName" placeholder="请输入真实姓名"/></span>
				</div>
				<div class="quota-item ">
					<span>身份证</span>
					<span><input type="text" v-model="userIdCardNum" placeholder="请输入真实身份证号"/></span>
				</div>
				<div class="quota-item ">
					<span>教育程度</span>
					<select class="selected" v-model="academic" id="education">
						<option value="">请选择</option>
						<option value="高中以下">高中以下</option>
						<option value="大专">大专</option>
						<option value="本科">本科</option>
						<option value="研究生以上">研究生以上</option>
					</select>
					<img src="../assets/img/fdddds@2x.png"/>
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="button" @click="submitAuthenticationMessage">保  存</div>
			<div class="buttom-text"><i class="buttom-text-icon"></i>智能加密,实时保证您的信息安全</div>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import { Indicator } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
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
				loadReason: '',
				userName:'',
				userIdCardNum:'',
				academic:'',
				pageType: false,
				token:'',
				id:''
			}
		},
		created:function(){
			mobileManager.hideBottomBar();
			let paramUrl = document.location.href;
//			let paramUrl = 'http://119.23.148.208:8084/appServer/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/UnionLoginAuthentication?1=1&channelCode=LBD_LBB&token=2517502052286171';
//			let paramUrl = 'http://119.23.148.208:8084/appServer/webpage/hybridAppForWeb/lbd_v3.5/dist/index.html#/UnionLoginAuthentication?token=2520679848850955';
			let arr = paramUrl.split('?')
            if (arr[1]) {
	            let newArr = arr[1].split('&')
	            for(var i=0; i < newArr.length; i++) {
	              var item = newArr[i]
	              
	              if (/token=/.test(item)) {
	                  this.token = item.split('=')[1];
	              }
	              if (/id=/.test(item)) {
	                  this.id = item.split('=')[1];
	              }
	            }
        	 }
            this.getAuthenticationProcess();
//			this.getAuthenticationMessage();
		},
		methods:{
			back(){
	          this.$router.goBack();
	         },
	         
	         //获取进度
			getAuthenticationProcess() {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(this.lbdUtil.host +'/userInfo/authenticationProcess?'+webInfo,{
					params:{	
				    	token: this.token,
						channelCode: 'LBD'
				  	},
				}).then((res)=>{
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
//			getAuthenticationMessage() {
//				let webInfo = this.lbdUtil.getWebInfoUrl();
//				this.$http.get(this.lbdUtil.host +'/user/userOrgInfo/queryUserOrgInfo?'+webInfo,{
//					params:{	
//				    	token: this.token
//				  	},
//				}).then((res)=>{
//					console.log(res);
//					if(res.data.status==='0000'){
//						let dataList = res.data.data;
//						if(dataList==null){
//							return;
//						}
//						this.quotaNumber=dataList.applayAmount;
//						this.loadReason=dataList.loadReason;
//						this.userName=dataList.userName;
//						this.userIdCardNum=dataList.userIdcard;
//						this.academic=dataList.academic;
//					}else{
////						this.showToast(res.data.msg);
//					}
//				},(err)=>{
//					console.log(err,'请求失败');
//				});
//			},
			
			submitAuthenticationMessage() {
				let webInfo = this.lbdUtil.getWebInfoObj();
				let params={
						token: this.token,
						channelCode: 'LBD',
						idCard:this.userIdCardNum,
						applayAmount:this.quotaNumber,
						loadReason: this.loadReason,
						name:this.userName,
						academic:this.academic
					}
				let data = this.$qs.stringify(Object.assign(params,webInfo));
				let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
				if(this.quotaNumber==''){
					this.showToast('请选择额度');
				}else if(this.quotaNumber < 3000 || this.quotaNumber > 4000){
					this.showToast('额度要在3000-4000');
				}else if(this.quotaNumber%1 != 0){
					this.showToast('额度必须是整数');
				}else if(this.loadReason==''){
					this.showToast('请选择借款用途');
				}else if(this.userName==''){
					this.showToast('请输真实姓名');
				}else if(this.userIdCardNum==''){
					this.showToast('请输身份证号码');
				}else if(reg.test(this.userIdCardNum) === false){
					this.showToast('请输正确的身份证号码');
				}else if(this.academic==''){
					this.showToast('请选择教育程度');
				}else{
					Indicator.open({ spinnerType: 'fading-circle' });
					this.$http.post(this.lbdUtil.host+'/user/userOrgInfo/userInfoAuthentication',
						data
					).then((res)=>{
						console.log(res);
						if(res.data.status==='0000'){
							this.showToast('保存成功!');
							this.jonintLogon();
						}else{
							this.showToast(res.data.msg);
						}
						Indicator.close();
					},(err)=>{
						Indicator.close();
						this.showToast('保存失败,网络出错');
						console.log(err,'请求失败');
					});
				}
			},
			jonintLogon(){
				Indicator.open({ spinnerType: 'fading-circle' });
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(this.lbdUtil.host +'/h5/api/product/jonintLogon',{
					params:{	
				    	token:this.token ,
				    	id: this.id
				  	},
				}).then((res)=>{
					console.log(res);
					if(res.data.status==='0000'){
						
						let confirmButtonText='知道了'
						if(res.data.data.is_new_user=='1'){
							//新用户
							if(res.data.data.apply_url){
								window.location.href=res.data.data.apply_url;
							}else{
								let message='您已注册成功，可通过手机自带应用商城下载APP';
								MessageBox.alert(message,{confirmButtonText}).then(action => {
								  
								});
							}
						}
						if(res.data.data.is_new_user=='2'){
							//老用户
							
							if(res.data.data.apply_url){
								window.location.href=res.data.data.apply_url;
							}else{
								let message='您已注册该产品，请直接登录APP查看进度';
								MessageBox.alert(message,{confirmButtonText}).then(action => {
								  
								});
							}
						}
						if(res.data.data.is_new_user=='3'){
							//其他渠道的用户
							let message='您已注册该产品，请直接登录APP查看进度';
							MessageBox.alert(message,{confirmButtonText}).then(action => {
								  
							});
						}
						//第三方接口不通 后台返回的结果
						if(res.data.data.is_new_user=='0'){
							this.showToast('请求超时,稍后再试');
						}
						
					}else{
//						this.showToast(res.data.msg);
					}
					Indicator.close();
				},(err)=>{
					Indicator.close();
					console.log(err,'请求失败');
				});
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
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-tap-highlight-color: transparent; 
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
		margin-top: 100/@w;
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
		.buttom-text{
			margin-top: 34/@w;
			font-size: 25/@w;
			color: #999999;
			text-align: center;
			/*padding-bottom: 100/@w;*/
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