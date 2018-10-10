<template>
	<div>
		<div>
			<mt-header title="还款详情" class="lbd-head-normal">
		    	<mt-button icon="back" @click="back" slot="left"></mt-button>
			</mt-header>
		</div>
		<div class="lbd-rd-main">
			<div class="lbd-rd-top">
				<mt-cell :title="'还款日期：'+ data.newPeriodDate" :class="'status-'+data.newPeriodStatus" :value="getStatus(data.newPeriodStatus)"></mt-cell>
			</div>
			<div class="lbd-rd-center">
				<mt-cell :title="'本金 ：'+data.principal+'元'" ></mt-cell>
				<mt-cell :title="'服务费 ：'+data.serviceFee+'元'" ></mt-cell>
				<mt-cell :title="'逾期费用 ：'+data.overDueFee+'元'" ></mt-cell>
				<mt-cell :title="'减免费用 ：'+data.annualFee+'元'" ></mt-cell>
				<mt-cell :title="'已还金额 ：'+data.alreadyRepay+'元'" ></mt-cell>
				<mt-cell :title="'待还金额 ：'+data.repayAmount+'元'" ></mt-cell>
			</div>
			<div class="lbd-rod-bottom" v-if="data.newPeriodStatus ==1 || data.newPeriodStatus == 3 ">
				<router-link class="lbd-btn" :to="{name:'ConfirmPayments',query:this.paramsObj}">立即还款</router-link>
			</div>
		</div>
	</div>
</template>
<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'RepaymentOrder',
		data(){
			return {
				data:{
					alreadyRepay:"-",
					annualFee:"-",
					overDueFee:"-",
					principal:"-",
					repayAmount:"-",
					serviceFee:"-",
					newPeriodStatus:"-",
					newPeriodDate:"-",
				},
				paramsObj: {},
				periodSeq: '',     //期数
				isPrepayment: true,
			}
		},
		methods:{
			back(){
				this.$router.goBack('repayOrder')
			},
			getStatus(_status){
				let result = "";
				if(_status == 1){
					result = "还款中";
				}else if(_status == 2){
					result = "已结清";
				}else if(_status == 3){
					result = "逾期中";
				}
				return result;
			},
			getListLatest() {        //提前还款
				let params  = this.$route.query;
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(
						this.lbdUtil.host + '/payment/repay/listLatest?'+webInfo.substr(1),
				{params}
				).then((res) => {
					this.data = res.data.data;
					this.paramsObj = params;
					//this.paramsObj["repayAmount"] = res.data.data.repayAmount;
				},(err)=>{
					console.log(err,'请求失败');
				});
			},
			getListEachRepayDetail() {        //我要还款
				let params  = this.$route.query;
			    console.log(params)
				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(
						this.lbdUtil.host + '/payment/repay/listEachRepayDetail?' + webInfo.substr(1) + `&periodSeq=${this.periodSeq}`,
				{params}
				).then((res) => {
					this.data = res.data.data;
					this.paramsObj = params;
				},(err)=>{
					console.log(err,'请求失败');
				});
			}
		},
		mounted(){
			this.periodSeq =  this.$route.query.periodSeq
			this.isPrepayment =  this.$route.query.isPrepayment;
			if(this.isPrepayment){
				this.getListLatest()
			} else {
				this.getListEachRepayDetail()
			}
		},
		created() {
      mobileManager.hideBottomBar()   //隐藏原生底部栏
      mobileManager.buriedPoint('order_repayment')  //埋点id


		}
	}
</script>
<style lang="less" scoped>
	@w:35rem;
	.lbd-rd-main{
		font-size:16/@w;
		padding-top:53px;
		.lbd-rd-top{
			.mint-cell-value{
				color:#fff;
				border-radius:5px;
				padding:2/@w 5/@w;
			}
			.status-3{
				.mint-cell-value{
					background-color:#D8051E;
				}
			}
			.status-1{
				.mint-cell-value{
					background-color:#FBC205;
				}
			}
			.status-2{
				.mint-cell-value{
					background-color:#6DB700;
				}
			}
		}
		.lbd-rd-center{
			margin-top:8/@w;
			.mint-cell:last-child{
				border-top:1px solid #F1F3F7;
			}
		}
		.lbd-rod-bottom{
			.lbd-btn{
				color:#000;
				width:230/@w;
				height:40/@w;
				border-radius: 10/@w;
				text-align:center;
				display:block;
				margin:30/@w auto;
				background-color:#FBC205;
				line-height:40/@w;
			}
		}
	}
</style>
