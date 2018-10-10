<template>
	<div>
		<mt-header title="自动代扣" class="lbd-head-normal">
	    	<mt-button icon="back" @click="back" slot="left"></mt-button>
		</mt-header>
		<div class="lbd-ar-main">
			<p class="lbd-ar-top">借款编号 ：{{this.$route.query.borrowOrderCode}}</p>
			<div class="lbd-ar-center">
				<mt-cell :title="bankList.bankName"  :label="bankList.bankCardNo">
					 <img slot="icon"  :src="bankList.bankImageUrl">
				</mt-cell>
			</div>
			<div class="lbd-ar-bottom">
				<p>温情提示：</p>
				<p>1、收款银行卡即为您的还款银行卡，请在每个还款日前存入相应的还款金额，以便银行进行代扣，避免银行卡余额不足导致逾期，产生逾期费用哦；</p>
				<p>2、如不想自动代扣，您也可以进行手动还款；</p>
			</div>
		</div>
	</div>
</template>
<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'AutoRepay',
		data(){
			return {
				bankList :{}
 			}
		},
		methods:{
			back(){
				this.$router.goBack('repayOrder')
			}
		},
		mounted(){
      mobileManager.showBottomBar()  //显示原生底部栏
			let params  = this.$route.query;
		  	let webInfo = this.lbdUtil.getWebInfoUrl();
		  	this.$http.get(
	  	 		this.lbdUtil.host + '/payment/repay/listAutoHoldBanks?'+webInfo,
				{params}
				).then((res) => {
					if(res.data.code =="0000"){
						this.bankList = res.data.data;
					}
				},(err)=>{
					console.log(err,'请求失败');

			});
		}
	}
</script>
<style lang="less" scoped>
	@w:35rem;
	.lbd-ar-main{
		font-size:16/@w;
		padding-top:56px;
		p{
			margin: 0;
			font-size:15/@w;
			color: #9A9A9A;
		}
		.lbd-ar-top{
			height:30/@w;
			line-height: 30/@w;
			padding-left:10/@w;
		}
		.mint-cell-title{
			position: relative;
		}
		.lbd-ar-bottom{
			p{
				font-size:14/@w;
			}
			padding:13/@w 18/@w;
		}
		.mint-cell{
			height: 70/@w;
			img{
				width: 40/@w;
				height:40/@w;
				margin-top: 15/@w;
				padding-bottom: 20/@w;
			}
			.mint-cell-text{
				padding-left: 16/@w;
				font-size:15/@w;
			    vertical-align: super;
			}
			.mint-cell-label{
				position:absolute;
				left:60/@w;
				top:35/@w;
				font-size:12/@w;
			}
		}
	}
</style>
