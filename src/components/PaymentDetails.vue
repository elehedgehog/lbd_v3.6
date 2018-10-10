<template>
	<div>
		<mt-header title="还款详情" class="lbd-head-normal">
				<mt-button icon="back" slot="left" @click="back"></mt-button>
		</mt-header>
		<div class="successDeal">
      <p class="">还款请求已提交，请耐心等待处理结果</p>
    </div>
		<div class="componyDetails">
			<p class="deductMoney">
				<span>¥</span>
        <span>{{findPayResultData.tradeAmount}}</span>
			</p>
			<!-- <p>好又贷股份有限公司</p> -->
			<p>{{ productName }}借款编号: {{ findPayResultData.borrowOrderCode }}</p>
		</div>
		<div class="tradingDetails">
			<span>交易时间</span>
			<span>{{ findPayResultData.tradeTime }}</span>
		</div>
		<div class="tradingDetails">
			<span>支付方式</span>
			<span>{{ this.bankNameReceive }}</span>
		</div>
		<div class="tradingDetails">
			<span>交易单号</span>
			<span>{{ findPayResultData.transactionNo }}</span>
		</div>
	</div>

</template>
<script>
  import { Toast } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
	export default {
		data(){
			 return{
				bankNameReceive:'',
				findPayResultData: {},
				transactionNoReceive: '',
				productCode: '',
				productName: '',
			 }
			},
		mounted(){
			let name = this.$route.query.productCode
			if(/LBB/.test(name)) {
				this.productName = '乐宝口袋'
			} else if (/SXD/.test(name)) {
				this.productName = '随薪贷'
			} else if (/HYD/.test(name)) {
				this.productName = '好又贷'
			}
		},
		created(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
      mobileManager.buriedPoint('order_submitted')  //埋点id
			this.getQueryUserAccountList()
      this.productCode = this.$route.query.productCode
			this.bankNameReceive = this.$route.query.bankName
			this.transactionNoReceive =  this.$route.query.transactionNo;

		},
		methods:{
			back(){
        let params  = this.$route.query;
        this.$router.push({ name: 'Order', params: {}, query: params})
				// let param = "";
				// for(var key in this.$route.query){
				// 	param += ("&"+key+'='+this.$route.query[key]);
				// }
				// param = param.substring(1)
        // location.href = this.lbdUtil.host + "/app/webFrame/home?"+param;

			},

			getQueryUserAccountList() {  //获取支付信息
				let params  = this.$route.query;
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(
				this.lbdUtil.host + `/payment/repay/findPayResult?` + webInfo,
				{params}
				).then((res)=>{
					if(res.data.status==='0000'){
            this.findPayResultData=res.data.data;
            mobileManager.clearOrderHistory()  //情况历时记录 返回订单中心
					} else {
						Toast({
							message: res.data.msg,
							position: 'bottom',
						});
					}
				},(err)=>{
					console.log(err,'请求失败');
				})
			},
		},

	}
</script>
<style lang="less" scoped>
  @w:75rem;
	.successDeal{
		height: 285/@w;
		line-height: 200/@w;
    width: 100%;
    text-align: center;
		margin-top: 44px;
		color: #461b0b;
		font-size: 30/@w;
		background-image: url(../assets/img/success.png);
		background-repeat: no-repeat;
		background-size: 100%;
		p{
			padding-top:110/@w;
		}
	}
	.componyDetails{
		color:#747474;
		text-align: center;
		margin-bottom: 20/@w;
		p{
			margin: 0;
			&:nth-child(1){
        margin-top: 20/@w;
        font-size:28/@w;
        >span{
					color: #313131;
					&:nth-child(2){
						font-size: 54/@w;
						margin-right: -4px;
						color:#505050;
					}
				}
			}
			&:nth-child(2){
				margin: 20/@w 0 15/@w;
				font-size: 32/@w;
			}
			&:nth-child(2){
				font-size: 20/@w;
				color:#505050;
			}
		}
	}
	.tradingDetails{
		width: 100%;
		height: 100/@w;
		line-height: 100/@w;
		font-size: 32/@w;
		color: #505050;
		span{
			display: inline;
			&:nth-child(1){
				margin-left: 30/@w;
			}
			&:nth-child(2){
				float: right;
				margin-right: 30/@w;
			}
		}
	}

</style>

