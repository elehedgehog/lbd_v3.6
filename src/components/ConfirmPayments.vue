<template>
  <div class="confirmPayments">
		<mt-header title="确认还款" class="lbd-head-normal">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
		<div class="paymentMoney">
			<img class="paymentMoney-icon" src="../assets/img/haihuanjine@2x.png">
			<span class="paymentMoney-text">还款金额:</span>
			<span class="paymentMoney-number">{{ this.repayAmount }} (元)</span>
		</div>
		<div class="paymentWay">
			<div class="paymentWay-text">点击还款方式</div>
			<ul>
				<li @click="toggleReapal">
					<img src="../assets/img/weiying@2x.png" alt="" class="payWayIcon">
					<img src="../assets/img/zhib@2x.png" alt="" class="nextIcon">
        </li>
        <li @click="toggleBaofu">
          <img src="../assets/img/baofu.png" alt="" class="payWayIcon">
          <img src="../assets/img/zhib@2x.png" alt="" class="nextIcon">
        </li>
			</ul>
		</div>
	</div>
</template>
<script>
  import { Toast } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
	export default {
		data(){
			return{
				repaymentAmount: '', //还款金额
				listLatestData: {},
				borrowOrderCode: '',  //借款编号
				repayAmount: '',   //还款金额
			}
		},
		mounted(){

		},
		created() {
      mobileManager.showBottomBar()  //显示原生底部栏
      mobileManager.buriedPoint('order_confrim')  //埋点id

			this.getListLatest()
		},
		methods: {
			back(){
				this.$router.goBack('repayOrder')
			},
			showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
        },
			getListLatest(){
				let params  = this.$route.query;
        let webInfo = this.lbdUtil.getWebInfoUrl();
        console.log(webInfo)
				this.$http.get(
					this.lbdUtil.host +`/payment/repay/listLatest?` + webInfo.substr(1),
					{params}
				).then((res)=>{
					if(res.data.code == "0000"){
						this.listLatestData=res.data;
						this.borrowOrderCode = res.data.data.borrowOrderCode;
						this.repayAmount = res.data.data.repayAmount;
					} else {
						Toast({
                message: res.data.msg,
                position: 'bottom',
            });
					}
					//console.log(res,'请求成功');
				},(err)=>{
					console.log(err,'请求失败');
				})
			},
			toggleReapal() {        //融宝
				var paramObj = this.$route.query;
				paramObj["borrowOrderCode"]  = this.borrowOrderCode;
				paramObj["repayAmount"]  = this.repayAmount;
				this.$router.push({ name: 'ManualPayments', params: Object.assign({ borrowOrderCode: this.borrowOrderCode},{repayAmount: this.repayAmount}), query:paramObj})

      },
      toggleBaofu(){       //宝付
        var paramObj = this.$route.query;
        let webInfo = this.lbdUtil.webInfo
        paramObj["borrowOrderCode"]  = this.borrowOrderCode;
        paramObj["repayAmount"]  = this.repayAmount;
        this.$router.push({ name: 'BfManualPayments', params: Object.assign({}, webInfo, { borrowOrderCode: this.borrowOrderCode, repayAmount: this.repayAmount }), query:paramObj})
      }
		},
	}
</script>
<style lang="less" scoped>
	@w:75rem;
	.confirmPayments{
		.paymentMoney{
			position: relative;
			height: 120/@w;
			line-height: 120/@w;
			width: 100%;
			margin-top: 53px;
			background-color: #fff;
			img.paymentMoney-icon{
				position: absolute;
				top: 40/@w;
				display: inline-block;
				margin-left: 30/@w;
				width: 40/@w;
				height: 40/@w;
			}
			span{
				font-size: 32/@w;
				&.paymentMoney-text{
					margin: 0 20/@w 0;
					color: #646464;
					margin-left: 90/@w;
				}
				&.paymentMoney-number{
					color: #fc5605;
				}
			}
		}
		.paymentWay{
			margin-top: 20/@w;
			padding-left: 30/@w;
			background-color: #fff;
			.paymentWay-text{
				height: 100/@w;
				line-height: 100/@w;
				color: #a0a0a0;
				font-size: 26/@w;
				border-bottom: 1px solid #F3F3F3;
			}
			>ul{
				>li{
					height: 120/@w;
					line-height: 120/@w;
					>img{
						display: inline-block;
						&.payWayIcon{
							width: 201/@w;
							height: 39/@w;
						}
						&.nextIcon{
							float: right;
							width: 17/@w;
							height: 30/@w;
							margin-right: 30/@w;
							margin-top: 45/@w;
						}
					}

				}
			}
		}
	}
</style>


