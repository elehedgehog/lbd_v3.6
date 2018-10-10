<template>
	<div>
		<mt-header title="消息中心" >
	    	<mt-button icon="back" @click="back" slot="left" ></mt-button>
	    	<mt-button slot="right" class="readed">全部已读</mt-button>
		</mt-header>

		<div class="messageContent">
			<mt-navbar v-model="selected">
			  <mt-tab-item id="1" class="gongGao" @click="notice">公告</mt-tab-item>
			  <mt-tab-item id="2" class="tiXing" @click="remind">消息提醒</mt-tab-item>
			</mt-navbar>

			<!-- tab-container -->
			<mt-tab-container v-model="selected">
			  <mt-tab-container-item id="1">

				<div v-for="(each, idx) in messageTip" :key="idx" v-if="each.msgType === 1">
					<p class="pTitel"><span class="title">{{each.title}}</span><span class="time">{{timeStamp(each.createdAt)}}</span></p>
					<p class="content">{{each.content}}</p>
			  </div>


				<p style="text-align:center; padding-top:20px;" v-if="!isShow(1)">
						<span>暂无消息</span>
					</p>

			  </mt-tab-container-item>
			  <mt-tab-container-item id="2">

			    <div v-for="(each, idx) in messageTip" :key="idx" v-if="each.msgType === 2">
			    	<p class="pTitel"><span class="title">{{each.title}}</span><span class="time">{{timeStamp(each.createdAt)}}</span></p>
			    	<p class="content">{{each.content}}</p>
			    </div>

					<p style="text-align:center; padding-top:20px;" v-if="!isShow(2)">
						<span >暂无消息</span>
					</p>


			  </mt-tab-container-item>
			</mt-tab-container>
			<!-- <div class="noMessage">暂无消息</div> -->
		</div>

	</div>
</template>

<script>
  import { mobileManager } from '../utils/WebInfo.js'
	export default{
		name:'messageCenter',
		data(){
			return {
				selected:"1",
				bankList :{},
				messageTip: []
 			}
		},
		watch: {
			selected(val){


				let tixingTip = document.querySelector('.tiXingTip'),
						gongGaoTip = document.querySelector('.gongGaoTip');
				if(val === '2' && tixingTip) {
					tixingTip.parentNode.removeChild(tixingTip);
				}else if(val === '1' && gongGaoTip){
					gongGaoTip.parentNode.removeChild(gongGaoTip);
				}else {
					;
				}

			}
		},


		methods:{
			back(){
				this.$router.goBack('')
      		},
      notice(){
        mobileManager.buriedPoint('msg_bulletin')
      },
      remind(){
		mobileManager.buriedPoint('msg_remind')



	},
	isShow(val){
		//返回该数据长度
		return this.messageTip.filter((each) =>each.msgType === val).length;
	},
	timeStamp(val) {
		//返回时间戳
		let Year  = new Date(val).getFullYear(),
				Month = new Date(val).getMonth() +1,
				date  = new Date(val).getDate();
		return Year + '-' + Month + '-' + date;
	},
	createPoint(val){
		document.querySelector(`.${val}`).style.position = 'relative';
		let span = document.createElement('span');
		span.className = `${val}Tip`;
		span.style = 'width: 10px; height: 10px; background: #f00; position: absolute; border-radius: 50%; right: 50px; top: 10px;'
		document.querySelector(`.${val}`).appendChild(span);
	}
    },
    created() {
      mobileManager.hideBottomBar()   //隐藏原生底部栏
      mobileManager.enableRefresh(false)  //下拉刷新
			this.$http.get(
						this.lbdUtil.host + `/app/message/listAppMessageForMobile?token=${this.$route.params.token}`
						// this.lbdUtil.host + `/app/message/listAppMessageForMobile?token=413747992727641`
            ).then((res)=> {

							this.messageTip = res.data.data;



				if(!(localStorage.messageTip === JSON.stringify(this.messageTip))) {
					// 如果当前选中的是1,且2有数据,则2显示红点,反之
					(this.selected === '1' && this.isShow(2)) ? this.createPoint('tiXing') : (this.selected === '2' && this.isShow(1)) ? this.createPoint('gongGao') : '';
				}


			})
    },

	beforeRouteLeave (to, from, next) {
		localStorage.messageTip = JSON.stringify(this.messageTip);
		next();
	}
	}
</script>
<style lang="less" scoped>

@w:60rem;
.mint-navbar{
	padding-top: 25px;
	.mint-button-text{
	font-family:Microsoft YaHei;
	font-size: 22px;
	color: #ffffff;
}
}
.readed{
  font-size: 14px;
}
.messageContent{
	margin-top:30px;
	.gongGao{
		font-family:Microsoft YaHei;
		font-size: 24/@w;
  }
  .is-selected{
		color: #FFA800!important;


  }
	.tiXing{
		font-family:Microsoft YaHei;
		font-size: 24/@w;
		color: #999999;
	}


	.mint-tab-container{
		margin: 0 37/@w 0 37/@w;
	    .mint-tab-container-item{
	    	 div{
		    	margin-top: 15/@w;
				  background-image: url('../assets/img/messageCenter/bk.png');
			  	background-repeat: no-repeat;
			  	position: relative;
			  	padding: 5/@w 0;
			  	p{
			  		padding: 0 31/@w;
			  	}
			  	.pTitel{
			  		display: flex;
			  		justify-content: space-between;
			  		.title{
						font-family:Microsoft YaHei;
						font-size: 28/@w;
						color: #4D4D4D;
					}
					.time{
						font-family:Microsoft YaHei;
						font-size: 18/@w;
						color: #999999;
					}
			  	}
				.tontent{
					font-family:Microsoft YaHei;
					font-size: 22/@w;
					color: #4D4D4D;
				}

	    	 }

	    }
	}




}

.noMessage{
	margin-top:50/@w;
	text-align:center;
}

</style>
