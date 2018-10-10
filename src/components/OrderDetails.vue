<template>
	<div id="">
		<mt-header title="订单详情" class="lbd-head-normal">
	    	<mt-button icon="back" @click="back" slot="left"></mt-button>
		</mt-header>
		<div class="orderDetails">
			<div class="header">
				<div class="logo">
					<img :src="OrderDetailData.productLogo"/>
				</div>
				<div class="orderNum">
					订单号 : {{OrderDetailData.code}}
				</div>
			</div>
			<div class="content">
				<div class="money">
					<span class="moneyNum value">{{OrderDetailData.applyAmount}}</span>
					<span class="moneyText info">申请金额(元)</span>
				</div>

				<div class="line"></div>

				<div class="tiem">
					<span class="timeNum value">{{OrderDetailData.periodTotal}}</span>
					<span class="timeText info">申请期限</span>
				</div>
			</div>
			<div class="progress"><span class="progressText">贷款进度</span></div>

			<div class="progressDescription">
				<span class="descriptionTitle">申请完成 ,等待审核</span>
				<router-link :to="{name : 'BankCard',query: { borrowOrderCode:OrderDetailData.code,borrowOrderId:OrderDetailData.id}}">
					<div class="operation">
						<!--<span class="card">{{OrderProgressData.donging}}<img v-if="OrderProgressData.donging" src="../assets/img/weqrtyui.png"/></span>-->
						<span class="card">{{OrderProgressData.donging}}<img src="../assets/img/weqrtyui.png"/></span>
					</div>
				</router-link>

			</div>

			<div class="progressList">

				<div class="progressItem" v-for="(item,index) in OrderProgressData.stepList" :key="index">
					<div v-if="item.periodStatus==0 && 0<index"  class="progressLine progressLineGray"></div>
					<div v-if="item.periodStatus>0 && 0<index"  class="progressLine progressLineYellow"></div>
					<div class="stateIcon">
						<img v-if="item.periodStatus==0"  src="../assets/img/gray@2x.png"/>
						<img v-if="item.periodStatus==1"  src="../assets/img/ffd@2x.png"/>
						<img v-if="item.periodStatus==2"  src="../assets/img/fs@2x.png"/>
						<img v-if="item.periodStatus==3"  src="../assets/img/no@2x.png"/>
					</div>
					<div class="statedesc">
						<span class="statedescTitle">{{item.periodName}} <i>{{item.periodDes}}</i></span>
						<!--<span class="stateTime">2017/05/02  10:02</span>-->
					</div>

				</div>


			</div>
		</div>
	</div>
</template>

<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'OrderDetails',
		data(){
			return{
//				params:{
//					borrowOrderId:this.$route.query.borrowOrderId,
//					borrowOrderCode:this.$route.query.borrowOrderCode
//				},
				OrderProgressParams:{
					borrowOrderCode:this.$route.query.borrowOrderCode
				},
				OrderDetailData:[],
				OrderProgressData:[]
			}
		},
		created:function(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
			this.GetOrderDetail();
			this.GetOrderProgress();
		},
		methods:{
			back(){
				this.$router.goBack('')
			},
			GetOrderDetail:function(){
				let params  = this.$route.query;
				this.$http.get('/order/borrowOrder/queryApplyOrderDetailById?token=9682996366387399&osVersion=v1.1.2&reqApplicationType=ios&reqApplicationVersion=2.1&osName=ios&mobileModel=ios&appDownChannel=appStore',
					{params}
				).then((res)=>{
					this.OrderDetailData=res.data.data;
					console.log(res,'请求成功00');
				},(err)=>{
					console.log(err,'请求失败');
				})
			},
			GetOrderProgress:function(){
				let params= this.OrderProgressParams;
				console.log(params);
				this.$http.get('/order/borrowOrder/applyOrderProgress?token=9682996366387399&osVersion=v1.1.2&reqApplicationType=ios&reqApplicationVersion=2.1&osName=ios&mobileModel=ios&appDownChannel=appStore',
					{params}
				).then((res)=>{
					this.OrderProgressData=res.data.data;
					console.log(res,'进度请求成功');
				},(err)=>{
					console.log(err,'进度数据请求失败');
				})
			},

		}
	}
</script>

<style scoped lang="less">
	@w:75rem;
	body{
		background-color: #F3F3F3;
	}
	.orderDetails{
		background-color: #F3F3F3;
		margin-top: 53px;
	}
	.header{
		width: 100%;
		height: 75/@w;
		border-bottom: 1px solid #E4E4E4;
		background-color: #FFFFFF;
		.logo{
			float: left;
			img{
				width: 140/@w;
				height: 40/@w;
				margin-top: 20/@w;
				margin-left: 30/@w;
			}
		}

		.orderNum{
			font-size: 28/@w;
			color: #a0a0a0;
			float: right;
			line-height: 75/@w;
			margin-right: 30/@w;
		}
	}
	.content{
		width: 100%;
		height: 230/@w;
		text-align: center;
		position: relative;
		background-color: #FFFFFF;

		span{
			display: block;
		}
		.money{
			width: 50%;
			float: left;
		}
		.line{
			height: 230/@w;
			position: absolute;
			border-left: 1px solid #E4E4E4;
			margin-left: 50%;
		}
		.tiem{
			width:50%;
			float: right;
		}
		.value{
			color: #313131;
			font-size: 46/@w;
			margin-top: 60/@w;
		}
		.info{
			font-size: 20/@w;
			color: #a0a0a0;
			margin-top: 8px;
		}
	}

	.progress{
		width:100%;
		height: 68/@w;
		background-color: #F3F3F3;
		line-height: 68/@w;
	}
	.progressText{
		font-size: 32/@w;
		color: #A0A0A0;
		float: left;
		margin-left: 30/@w;
	}
	.progressDescription{
		width: 100%;
		height: 100/@w;
		background-color: #FFFFFF;
		line-height: 100/@w;
		span{
			display: inline-block;
		}
		.descriptionTitle{
			font-size: 28/@w;
			color: #646464;
			float: left;
			margin-left: 30/@w;
		}
		.operation{
			float: right;
			margin-right: 50/@w;
		}
		.card{
			font-size: 28/@w;
			color: #FC5605;
			img{
				width: 20/@w;
				height: 30/@w;
				vertical-align: middle;
				margin-left: 20/@w;
			}
		}
	}

	.progressList{
		background-color: #FFFFFF;
		margin-top: 2px;
		.progressItem{
			height: 200/@w;
			border: 1px solid #FFFFFF;
			position: relative;
			.stateIcon{
				float: left;
				width: 45/@w;
				height: 45/@w;
				margin-left: 60/@w;
				position: absolute;
				top: 50%;
				margin-top: -23/@w;
				border-radius: 50%;
				/*background-color: #FBC205;*/
				img{
					width:100%;
					height: 100%;
				}
			}
			.statedesc{
				margin-left: 130/@w;
				padding-left: 25/@w;
				margin-top: 65/@w;
				height: 135/@w;
				border-bottom: 1px solid #F3F3F3;
				span{
					display: block;
				}
				.statedescTitle{
					color: #646464;
					font-size: 28/@w;

					display: inline-block;
					margin-top: 12/@w;

					i{
						font-style:normal;
						color: #52900F;
					}
				}
				.stateTime{
					font-size: 22/@w;
					color: #A0A0A0;
				}
			}
			.progressLine{
				position: absolute;
				z-index: 2;
				top:-80/@w;
				left: 81/@w;
				height: 150/@w;
				width: 2/@w;

			}
			.progressLineYellow{
				background-color: #FBC205;
			}
			.progressLineGray{
				background-color: #E1E1E1;
			}

		}
	}
	</style>
