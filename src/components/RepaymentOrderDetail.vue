<template>
	<div>
		<mt-header title="订单详情" class="lbd-head-normal">
	    	<mt-button icon="back" @click="back" slot="left"></mt-button>
		</mt-header>
		<div class="lbd-main" v-if="this.hadLoad == false" style="text-align:center;">
			<div class="lbd-loading-main" style="padding-top:.5rem">{{loadingText}}</div>
		</div>
		<div class="lbd-main" v-if="this.hadLoad == true">
			<div class="lbd-rod-top">
				<div class="lbd-item-top">
					<div class="head-logo"><img :src="orderDetail.productLogo"></div>
					<div class="head-text">订单号:{{orderDetail.code}}
						<img v-if="orderDetail.repayStatus == '1' " src="../assets/img/ROstatus1.png"/>
						<img v-if="orderDetail.repayStatus == '2'" src="../assets/img/ROstatus2.png"/>
					</div>
				</div>
				<div class="lbd-item-center">
					<mt-cell title="还款方式" :to="{name:'AutoRepay',query:this.$route.query}" is-link value="自动代扣"></mt-cell>
				</div>
				<div class="lbd-item-bottom">
					<p>{{orderDetail.repayPrincipal}}</p>
					<p style="color:#CBCBCB;">还款金额（元）</p>
				</div>
				<div class="lbd-swiper">
					<swiper :options="swiperOption" ref="mySwiper" >
					    <swiper-slide v-for="(item,index) in replayPeriodDetail" :key="index" class="lbd-rod-swiper">
							<div :class="'repayStatus-'+item.periodStatus">第{{item.periodNum}}期</div>
					    </swiper-slide>
					</swiper>

				</div>
			</div>
			<div class="lbd-rod-bottom">
				<div class="lbd-item-center">
					<mt-cell title="账单" :to="{name:'RepaymentDetail',query:Object.assign({ isPrepayment: true },this.$route.query)}" is-link value="提前还款">
						<img slot="icon" src="../assets/img/ROdetail.png" width="24" height="24">
					</mt-cell>
				</div>
				<div>
					<div v-for="(item,index) in replayPeriodDetail" :key="index">
						<div class="ROD-cell" v-if="item.periodStatus == 3">
							<div class="cell-left">
								<div><span>{{item.periodNum}}/</span>{{orderDetail.periodTotal}}</div>
							</div>
							<div class="cell-center">
								<p>{{item.periodShouldRepay}}元</p>
								<p>还款日 {{item.periodDate}}</p>
							</div>
							<div class="cell-right" >
								<img src="../assets/img/ROsuccess@2x.png" alt="" />
							</div>
						</div>

						<!-- <router-link :to="{name:'RepaymentDetail',query:Object.assign({ isPrepayment: false},paramsObj)}" class="ROD-cell" v-if="item.periodStatus != 3 "> -->
						<div @click="linkToPayment(item.periodNum)" class="ROD-cell" v-if="item.periodStatus != 3 ">
							<div class="cell-left">
								<div><span>{{item.periodNum}}/</span>{{orderDetail.periodTotal}}</div>
							</div>
							<div class="cell-center">
								<p>{{item.periodShouldRepay}}元</p>
								<p>还款日 {{item.periodDate}}</p>
							</div>
							<div class="cell-right">
								<p><span v-if="item.periodStatus == 2">逾期中</span>我要还款></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	import 'swiper/dist/css/swiper.css'
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'RepaymentOrderDetail',
		components:{
			swiper,
			swiperSlide
		},
		data(){
			return{
				swiperOption: {
				  slidesPerView: 4,
				  spaceBetween: 0,
		          navigation: {
		            /*nextEl: '.swiper-button-next',
		            prevEl: '.swiper-button-prev'*/
		          }
		        },
			    orderDetail:{},
		    	replayPeriodDetail:{},
		    	hadLoad : false,
		    	loadingText:"数据加载中...",
				urlParm :this.$route.query,
				periodNum: 1,
				paramsObj: {}
			};
		},
		methods:{

			back(){
        let params  = this.$route.query;
				this.$router.push({ name: 'Order', params: {}, query: params})  //跳到订单中心
			},
			linkToPayment (key) {
        let params  = this.$route.query;
				this.$router.push({name:'RepaymentDetail', query: Object.assign({ isPrepayment: false }, this.paramsObj, { periodSeq: key })});
				// this.$router.push({name:'Order', query: params });
			}

		},
		mounted(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
      mobileManager.buriedPoint('order_detail')  //埋点id
			let params  = this.$route.query;
			let webInfo = this.lbdUtil.getWebInfoUrl();
		  	this.$http.get(
		  	 	this.lbdUtil.host + '/order/borrowOrder/queryRepayOrderDetailById?'+webInfo.substr(1),
				{params}
				).then((res) => {
					if(res.data.status == "0000"){
						this.orderDetail = res.data.data.orderDetail;
						this.replayPeriodDetail = res.data.data.replayPeriodDetail;
						this.hadLoad = true;
            this.paramsObj = this.$route.query;
					}else{
						this.loadingText = "数据加载失败,请稍后再试..."
					}
				},(err)=>{
					this.loadingText = "数据加载失败,请稍后再试..."
			});
		},
	}

</script>
<style lang="less" scoped>
	@w:35rem;
	.lbd-main{
		padding-top:53px;
		p{
			margin:0;
		}
	}

	.lbd-rod-bottom{
		margin-top:10/@w;
		a{
			color:#2c3e50;
		}
		.ROD-cell{

			.cell-right{
				position:relative;
            	p{
					display: flex;
	                align-items: center;
					height:50/@w;
					justify-content: flex-end;
					padding-right: 10/@w;
					span{
						color:#fff;
						padding:1/@w 5/@w;
						background-color:#DA182F;
						border-radius: 5px;
						margin-right: 5px;
					}
            	}
            	/* p::after{
            		content: " ";
				    display: block;
					top:0/@w;
					right:5/@w;
				    position:absolute;
				    margin-right: 0.4rem;
				    margin-top: 0.53333333rem;
				    height: 0.26666667rem;
				    width: 0.26666667rem;
				    border-width: 2px 2px 0 0;
				    border-color: #E7E7E7;
				    border-style: solid;
				    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            	} */
			}
		}

		.ROD-cell{
			height:50/@w;
			padding:5/@w 0;
			border-bottom:1px solid #F1F3F7;
			background-color:#fff;
			display:flex;

			.cell-left{
				flex:1.5;
				text-align:center;
				div{
					height:40/@w;
					width:40/@w;
					line-height:40/@w;
					border:1px solid #FDA57A;
					font-size:12/@w;
					margin:5/@w auto;
					span{
						font-weight: 700;
						font-size:14/@w;
					}
				}
			}
			.cell-center{
				flex:4;
				p{
					height:25/@w;
					line-height:25/@w;
					padding-left:5/@w;
				}
				p:first-child{
					font-size:16/@w;
					line-height:30/@w;
				}
			}
			.cell-right{
				height:50/@w;
				flex:4;
				position:relative;
				img{
					vertical-align:middle;

					width:30/@w;
					height:30/@w;
					float: right;
					margin:10/@w 10/@w;
				}
			}
		}
	}
	.lbd-rod-top{
		.lbd-swiper{
			height:40/@w;
			font-size:13/@w;
			.swiper-slide{
				height:30/@w;
				line-height:35/@w;
			}
			.swiper-slide:last-child div{
				border-top:none;
			}
			.swiper-container{
				padding-left:40/@w;
				.swiper-button-prev, .swiper-button-next{
					background-size: 12px 20px;
				}
			}
			.lbd-rod-swiper{
				div{
					position:relative;
					border-top:2px solid #E5E5E5;
					margin-top:5/@w;
					text-indent: -13/@w;
					&::before{
						content:" ";
						width:9/@w;
						height:9/@w;
						background-color:#E5E5E5;
						border-radius:10/@w;
						position:absolute;
						top:-5/@w;
						left:0;
					}
				}
				div.repayStatus-3::before{
					background-color:#FBC205;
				}
				div.repayStatus-3{
					border-top:2px solid #FBC205;
				}
				div.repayStatus-2::before{
					background-color:#DA182F;
				}
			}
		}
		background-color:#fff;
		.lbd-item-bottom{
			text-align:center;
			border-top: 1px solid #F2F4F7;
			padding:15/@w 0;
			p:first-child{
				font-size:26/@w;
			}
		}

	}
	.lbd-item-top{
		height: 40/@w;
		line-height: 40/@w;
		border-bottom: 1px solid #F2F4F7;
		background-color:#fff;
		padding:0 10/@w;
		.head-logo img{
			max-width: 50/@w;
			max-height: 40/@w;
			vertical-align: middle;
		}
		.head-text{
			float: right;
			font-size: 14/@w;
			color:#B0B0B0;
			img{
				width:60/@w;
				margin-left: 8/@w;
				vertical-align:middle;
			}
		}
		div{
			display: inline-block;
		}
	}
	.lbd-item-center{
		border-bottom:1px solid #F1F3F7;
		span{
			font-size:15/@w;
		}
		.mint-cell{
			background-image:none ;
			background-color:#fff;
		}
		.mint-cell-value{
			color:#FC590B;
		}
	}

</style>
