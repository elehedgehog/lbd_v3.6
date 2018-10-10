<template>
	<div style="padding-top:3px;">
		<div :style="{'height':wrapHeight,overflow:'scroll'}">
			<mt-loadmore :top-method="loadTop"  ref="loadmore">
				<ul v-infinite-scroll="loadBottom" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li v-for="(item,index) in items" :key="index" class="lbd-ro-items">
						<router-link :to="{name:'RepaymentOrderDetail',query:{borrowOrderId:item.id,borrowOrderCode:item.code}}">
							<div class="lbd-item-top">
								<div class="head-logo"><img :src="item.productLogo"></div>
								<div class="head-text">订单号:{{item.code}}
									<img v-if="item.repayStatus == '1' " src="../assets/img/ROstatus1.png"/>
									<img v-if="item.repayStatus == '2'" src="../assets/img/ROstatus2.png"/>
								</div>
							</div>
							<div class="lbd-item-center">
								<mt-cell title="还款方式" :to="{name:'AutoRepay',query:{borrowOrderId:item.id,borrowOrderCode:item.code}}" is-link value="自动代扣"></mt-cell>
							</div>
							<div class="lbd-item-bottom">
								<div class="bottom-left" style="border-right:1px solid #F2F4F7;">
									<p class="bottom-text">{{item.applyAmount}}</p>
									<p class="bottom-value">还款金额（元）</p>
								</div>
								<div class="bottom-right">
									<p class="bottom-text">{{item.periodTotal}}个月</p>
									<p class="bottom-value">申请期限</p>
								</div>
								<div class="bottom-bottom" v-if="item.newPeriodStatus != '3'">
									<img v-if="item.newPeriodStatus == '1'" src="../assets/img/ROstatus1-1.png">
									<img v-if="item.newPeriodStatus == '2'" src="../assets/img/ROstatus1-2.png">
									<p :class="{error:item.newPeriodStatus==2}">{{showRepayStatus(item.newPeriodStatus)}} {{item.newPeriodNum}}/{{item.periodTotal}}期,还款日{{item.newPeriodDate}},待还{{item.newPeriodShouldRepay}}元</p>
								</div>
								<div class="bottom-bottom" v-if="item.newPeriodStatus == '3'">
									<img src="../assets/img/ROstatus1-1.png">
									<p>已结清</p>
								</div>
							</div>
						</router-link>
					</li>
				</ul>
			</mt-loadmore>
		</div>
	</div>
</template>

<script>
import { mobileManager } from '../utils/WebInfo.js'
export default {
  name: 'RepaymentOrder',
  data () {
    return {
     	items:[],
     	wrapHeight:'auto',
     	pageConfig:{
     		pageNum : 0,
     		pageSize : 10,
     		pageTotal : 0,
     	}
    }
  },
  methods:{
  	showRepayStatus(status){
  		let Str = "";
  		if(status == 1){
  			Str = "还款中"
  		}else if(status == 3){
			Str = "已结清"
  		}else if(status == 2){
  			Str = "逾期中"
  		}
  		return Str;
  	},
  	loadBottom() {
	  	this.loading = true;

        this.loading = false;
      },
     loadTop() {
      	setTimeout(() => {
			this.$refs.loadmore.onTopLoaded();
      	},1000);
	 }
  },

  mounted(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏

  },
  created: function (){
	let params  = this.pageConfig;
  	params["orderListType"] = 2;
  	let webInfo = this.lbdUtil.getWebInfoUrl();
  	this.$http.get(
  	 		this.lbdUtil.host + '/order/borrowOrder/queryOrderList?token=10453206632526581'+webInfo,
	{params}
	).then((res) => {
		this.items = res.data.data.orderList;
	},(err)=>{
		console.log(err,'请求失败');

	});
  },
}
</script>

<style lang="less" scoped>
	@w :35rem;
	p{
		margin: 0;
	}
	.lbd-ro-items{
		background: #fff;
		margin-top: 10px;
		.lbd-item-top{
			padding:2/@w 12/@w;
			height: 40/@w;
			line-height: 40/@w;
			border-bottom: 1px solid #F2F4F7;
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
			span{
				font-size:15/@w;
			}
			.mint-cell{
				background:none !important;
			}
			.mint-cell-value{
				color:#FC590B;
			}
		}
		.lbd-item-bottom{
			height:135/@w;
			border-top: 1px solid #F2F4F7;
			.bottom-left,
			.bottom-right{
				padding:10/@w 0;
				float:left;
				width: 49.5%;
				height:60/@w;
				text-align: center;
			}
			.bottom-text{
				font-size:28/@w;
			}
			.bottom-value{
				font-size:12/@w;
				color:#ababab;
			}
			.bottom-bottom{
				float: left;
				height:40/@w;
				line-height:40/@w;
				width:100%;
				padding:6/@w 12/@w;
				border-top:1px solid #F2F4F7;
			p{
				display:inline-block;
				color:#646464;
			}
			.error{
				color:#D8051E;
			}
			img{
				width:32/@w;
				vertical-align: middle;
			}
		}
	}
	}
</style>
