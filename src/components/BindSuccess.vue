<template>
	<div class="" id="">
		<mt-header title="绑卡结果" class="lbd-head-normal">
	    	<mt-button icon="back" @click="back" slot="left"></mt-button>
		</mt-header>
		<div class="success">
			<div class="successLogo">
				<img src="../assets/img/fddd@2x.png"/>
			</div>
			<div class="successMsg">绑定银行卡成功</div>
		</div>
		<router-link :to="{name : 'LoanConfirm'}">
			<div class="complete">完成</div>
		</router-link>

		<div class="return">返回订单页面>></div>
	</div>
</template>

<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'BindSuccess',
		data(){
			return{

			}
    },
    created(){
       mobileManager.hideBottomBar()   //隐藏原生底部栏
    },
		methods:{
			back(){
				this.$router.goBack('repayOrder')
			}
		}
	}
</script>

<style scoped lang="less">
	@w:75rem;
	.Router{
		background: #FFFFFF;
	}
	.success{
		width: 100%;
		.successLogo{
			width: 410/@w;
			height: 245/@w;
			margin: 0 auto;
			margin-top:200/@w;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.successMsg{
			font-size: 28/@w;
			color: #A0A0A0;
			height: 30/@w;
			width: 200/@w;
			margin: 0 auto;
			margin-top: 35/@w;
		}

	}
	.complete{
		height: 80/@w;
		width: 80%;
		font-size: 32/@w;
		color: #000000;
		margin: 0 auto;
		background-color: #FBC205;
		border-radius: 30/@w;
		margin-top: 50/@w;
		text-align: center;
		line-height: 80/@w;
		text-decoration: none;
	}
	.return{
		font-size: 24/@w;
		color: #0068B7;
		float: right;
		margin-right: 70/@w;
		margin-top: 30/@w;
	}
</style>
