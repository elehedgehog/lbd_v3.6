<template>
	<div id="">
		<mt-header title="绑定银行卡" class="lbd-head-normal">
	    	<mt-button icon="back" @click="back" slot="left"></mt-button>
		</mt-header>
		<div v-show="isShow" class="mask">
		</div>
		<div v-show="isShow" class="bankCardModul">
			<div class="bankListTitle">选择收款 ( 还款  ) 银行</div>
			<div class="bankList">
				<ul @click="getBankName($event)">
					<li><img src="../assets/img/huaxia@2x.png"/>华夏银行</li>
					<li><img src="../assets/img/pingan@2x.png"/>平安银行</li>
					<li><img src="../assets/img/gong@2x.png"/>工商银行</li>
					<li><img src="../assets/img/youzheng@2x.png"/>邮政储蓄银行</li>
					<li><img src="../assets/img/jianshe@2x.png"/>建设银行</li>
					<li><img src="../assets/img/pingan@2x.png"/>平安银行</li>
				</ul>
			</div>
			<div class="closeBtn" v-on:click="showCardList">
					<img src="../assets/img/hthh@2x.png"/>
			</div>
		</div>
		<div class="inputList">
			<div class="inputItem" v-on:click="showCardList">
				<span class="inputItemTitle">银行卡名称</span>
				<span class="selectBank">{{params.bankName	}}</span>
				<span v-if="params.bankName	===''" class="inputItemMesg">选择银行卡<img src="../assets/img/weqrtyui.png"/></span>
			</div>
			<div class="inputItem">
				<span class="inputItemTitle">收款 ( 还款 ) 账户</span>
				<input v-model.trim="params.bankAccount" value="params.bankAccount" placeholder="请填写储蓄卡银行卡号"/>
			</div>
			<div class="inputItem">
				<span class="inputItemTitle">手机号码</span>
				<input v-model.trim="params.reservedMobile" value="params.reservedMobile"  placeholder="请填写银行预留号码"/>
			</div>
		</div>
		<router-link :to="{name : 'BindSuccess'}">
			<div @click="SubmitBankCard" class="submitButton">确认</div>
		</router-link>

	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import { Indicator } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'BankCard',
		data(){
			return{
				isShow:false,
				params:{
					bankName:'',
					reservedMobile:'',
					bankAccount:'',
					borrowOrderCode:this.$route.query.borrowOrderCode
				}
			}
    },
    created(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
    },
		methods:{
			back(){
				this.$router.goBack('')
			},
			showCardList:function(){
				this.isShow=!this.isShow
			},
			showToast:function(msg){
				Toast({
				  message: msg,
				  position:'bottom'
				});
			},
			getBankName:function(event){
				this.params.bankName	=event.target.innerText;
				this.isShow=!this.isShow
				console.log(event.target.innerText);
			},
			SubmitBankCard:function(){
				let regular=11 && /^1[3-9]{1}[0-9]{9}$/;
				if(this.params.bankName	==''){
					this.showToast('请选择银行卡');
				}else if(this.params.bankAccount==''){
					this.showToast('请输入银行卡号');
				}else if(isNaN(this.params.bankAccount)){
					this.showToast('银行卡格式不正确');
				}else if(this.params.reservedMobile==''){
					this.showToast('请输入手机号码');
				}else if(!regular.test(this.params.reservedMobile)){
					this.showToast('手机号格式不正确');
				}else{
					Indicator.open();
					let uploadData=this.params;
					console.log(uploadData);
//					this.$http.get('/orderApply/bindCardByUser?token=9682996366387399&osVersion=v1.1.2&reqApplicationType=ios&reqApplicationVersion=2.1&osName=ios&mobileModel=ios&appDownChannel=appStore',
//						{uploadData}
//					).then((res)=>{
//						this.showToast('绑卡成功');
//						Indicator.close();
//					},(err)=>{
//						this.showToast('失败');
//						Indicator.close();
//					})
				}


			}
		}
	}
</script>
<style scoped lang="less">
	@w:75rem;
	.inputList{
		margin-top: 53px;
		background-color: #FFFFFF;
		.inputItem{
			height: 150/@w;
			width: 100%;
			line-height: 150/@w;
			font-size: 32/@w;
			color: #646464;
			border-bottom: 1px solid #F3F3F3;
			span{
				margin-left: 30/@w;
			}
			input{
				float: right;
				height: 145/@w;
				border: none;
				outline:none;
				font-size: 32/@w;
				color:#949494;

			}
			.inputItemMesg{
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
		}
	}
	.submitButton{
		height: 80/@w;
		width: 80%;
		font-size: 32/@w;
		color: #000000;
		margin: 0 auto;
		background-color: #FBC205;
		border-radius: 30/@w;
		margin-top: 70/@w;
		text-align: center;
		line-height: 80/@w;
		text-decoration: none;
	}

	.mask{
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: #7F7F7F;
		z-index: 1000;
		opacity: 0.5;
	}
	.bankCardModul{
		position: absolute;
		top: 140/@w;
		left: 50%;
		margin-left: -290/@w;
		width: 582/@w;
		height: 770/@w;
		background: #FFFFFF;
		z-index: 2000;
		border-radius: 30/@w;

		.bankListTitle{
			height: 112/@w;
			line-height: 112/@w;
			font-size: 32/@w;
			color: #000000;
			text-align: center;
			border-top-left-radius: 30/@w;
			border-top-right-radius: 30/@w;
			background-color: #FBC205;
		}
		.bankList{
			ul{
				height: 550/@w;
				width: 100%;
				overflow: scroll;
				li{
					height: 108/@w;
					line-height: 108/@w;
					border-bottom: 1px solid #F3F3F3;
					img{
						height: 53/@w;
						width: 52/@w;
						margin-left: 50/@w;
						margin-right: 60/@w;
						vertical-align: middle;
					}
				}
			}
		}
		.closeBtn{
			text-align: center;
			height: 108/@w;
			line-height:108/@w;
			img{
				width: 63/@w;
				height: 63/@w;
				vertical-align: middle;
			}
		}
	}
</style>
