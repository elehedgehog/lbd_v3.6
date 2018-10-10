<template>
	<div class="orderContent" id="">

		<div class="orderList" v-on:click="getDetail" v-for="(item,index) in OrderDataList" :key="index">
			<div class="header">
				<div class="logo">
					<img :src="item.productLogo"/>
				</div>
				<div class="orderNum">
					订单号 : {{item.code}}
				</div>
			</div>
			<div class="content">
				<div class="money">
					<span class="moneyNum">{{item.applyAmount}}</span>
					<span class="moneyText">申请金额(元)</span>
				</div>

				<!--<div class="line"></div>-->

				<div class="tiem">
					<span class="timeNum">{{item.periodTotal}}个月</span>
					<span class="timeText">申请期限</span>
				</div>
			</div>
			<router-link :to="{name : 'OrderDetails',query: { borrowOrderCode:item.code,borrowOrderId:item.id}}">
				<div class="footer">
					<img src="../assets/img/message.png">
					<div class="triangle"></div>
					<div class="msg">{{showAuditStatus(item.auditStatus)}}</div>
					<div class="arrow"></div>
				</div>
			</router-link>
		</div>

	</div>
</template>

<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'OrderApply',
		data(){
			return{
				OrderDataList:[]
			}
		},

		created : function(){
      mobileManager.hideBottomBar()   //隐藏原生底部栏
			this.$http.get('/order/borrowOrder/queryOrderList',{
				params:{
			    	token:'9682996366387399',
			    	pageSize:'10',
			    	pageNum:'1',
			    	osVersion:'v1.1.2',
			    	reqApplicationType:'ios',
			    	reqApplicationVersion:'2.1',
			    	osName:'ios',
			    	mobileModel:'ios',
			    	orderListType:'1',
			    	appDownChannel:'appStore'

			  	},
			}).then((res)=>{
				console.log(res.data.status);
				if(res.data.status==='0000'){
					console.log(res,'请求成功');
					this.OrderDataList=res.data.data.orderList;
				}
			},(err)=>{
				console.log(err,'请求失败');
			});
		},
		methods:{
			showAuditStatus:function(status){
				let Str="";
				if(status=='0'){
					Str='审核中'
				}else if(status=='1'){
					Str='待审核'
				}else if(status=='2'){
					Str='审核不通过'
				}
				return Str;
			},
			getDetail:function(){
				console.log('hahah');
			}
		}
	}
</script>

<style lang="less" scoped>
	@w:75rem;
	.orderContent:first-child{
		margin-top: 15/@w;
	}
	.orderList{
		width: 95%;
		margin: 0 auto;
		border-radius: 10px;
		margin-bottom: 25/@w;
		background-color: #FFFFFF;
	}
	.header{
		width: 100%;
		height: 75/@w;
		/*border-bottom: 1px solid #E4E4E4;*/
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
		clear: both;
		height: 210/@w;
		text-align: center;
		margin-top: 20/@w;

	}
	.line{
		float: left;
		height: 160/@w;
		margin-top: 40/@w;
		border-left: 1px solid #E4E4E4;
	}
	.money,.tiem{
		height: 100%;
		width: 49%;
	}
	.money{
		clear: both;
		float: left;
		border-right: 1px solid #E4E4E4;
	}
	.tiem{
		float: left;
	}
	.moneyNum,.moneyText,.timeNum,.timeText{
		display: block;
	}
	.moneyNum,.timeNum{
		color: #313131;
		font-size: 46/@w;
		margin-top: 20px;
	}
	.timeNum{
		margin-top: 16px;/*左右两边高低不一样 中文和数字的差距*/
	}
	.moneyText,.timeText{
		font-size: 20/@w;
		color: #a0a0a0;
		margin-top: 8px;
	}
	.footer{
		clear: both;
		height: 100/@w;
		margin-top: 10px;
		background-color: #FBC205;
		border-bottom-right-radius:10px;
		border-bottom-left-radius:10px;
		box-shadow: 0px -6px 5px #FFF5D3;
	}
	.footer img{
		float: left;
		width: 50/@w;
		height: 50/@w;
		margin-top: 27/@w;
		margin-left: 30/@w;
	}
	.triangle{
		height: 0px;
		width: 0px;
        border-top:10/@w solid rgba(0,0,0,0);
        border-right:20/@w solid  #FCEBB3;
        border-bottom:10/@w solid rgba(0,0,0,0);
        border-left:10/@w solid  rgba(0,0,0,0);
        float: left;
        margin-top: 40/@w;
        margin-right: -4px;
	}
	.msg{
		float: left;
		height: 50/@w;
		width: 125/@w;
		background-color: #FCEBB3;
		margin-top: 26/@w;
		border-radius: 8px;
		font-size: 26/@w;
		color: #176bd2;
		line-height: 50/@w;
		text-align: center;
	}

	.arrow:after {
		content: " ";
	    display: block;
	    float: right;
	    margin-right: 30/@w;
	    margin-top: 40/@w;
	    height: 10px;
	    width: 10px;
	    height: 20/@w;
	    width: 20/@w;
	    border-width: 2px 2px 0 0;
	    border-color: #FFFFFF;
	    border-style: solid;
	    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);

	}
</style>
