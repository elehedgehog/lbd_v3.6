<template>
  <div>
    <mt-header title="产品说明" class="lbd-head-normal" v-if="pageType">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div :class="['ldb-head-mian',{'on': !pageType}]">
			<div class="lbd-pd-center">
				<div class="lbd-pd-center-title">
					<p>贷款流程</p>
				</div>
				<div class="lbd-pd-center-value lbd-pd-top">
					<div class="half-before">
            <i></i>
						<p class="before-top">提交申请</p>
						<p class="before-bottom">只需3分钟</p>
					</div>
					<div class="all-before">
            <i></i>
						<p class="before-top">机构审批</p>
						<p class="before-bottom">平均1天</p>
					</div>
					<div class="all-before">
            <i></i>
						<p class="before-top">确认贷款</p>
						<p class="before-bottom">绑卡收款</p>
            <p class="before-bottom">额度7天有效</p>
					</div>
					<div class="half-after">
            <i></i>
						<p class="before-top">放款</p>
						<p class="before-bottom">平均1天</p>
					</div>

				</div>
			</div>
			<div class="lbd-pd-center">
				<div class="lbd-pd-center-title bot">
					<p>费用说明</p>
				</div>
				<div class="lbd-pd-center-value">
					<p>按日计费，日息费率0.1%。</p>
					<p>用户需具备充足诚信积分方可最终放款，可通过购买商品获得。</p>
					<p>举例：借款1500元，期限7天，有300元额度可购买相应商品，到账1200元，到期应还约为1510.5元。（具体以实际还款情况为准）</p>
          <br/>



				</div>
			</div>
			<div class="lbd-pd-center lbd-pd-bottom">
				<div class="lbd-pd-center-title bot">
					<p>还款说明</p>
				</div>
				<div class="lbd-pd-center-value">
					<p>还款方式</p>
          <p>- 银行代扣：还款日当天00:00从绑定银行卡中自动扣款</p>
          <p>- 主动还款</p>
          <p>- 线下还款方式</p>
          <p>支付宝账号：261412140@qq.com</p>
          <p>支付宝名称：广东瑞利信息咨询有限公司</p>
          <p>转账备注：身份证号后8位#姓名（例：12345678#张三）</p>
          <br/>
          <p>提前还款：</p>
          <p>单期提前还款：放款第二天支持提前还款，无息费减免</p>

          <p>逾期策略：</p>
          <p>逾期罚息=借款金额*2%*逾期天数</p>

				</div>
			</div>
			<!-- <div class="lbd-pd-center">
				<div class="lbd-pd-center-title bot">
					<p>常见问题</p>
				</div>
				<div class="lbd-pd-question">
					 <ul class="mui-table-view">
				        <li :class="['mui-table-view-cell','mui-collapse',{'mui-active': authenticationPop}]" @click="authenticationPop=!authenticationPop">
				            <a :class="['mui-navigate-right',{ less: authenticationPop }]"><img src="../assets/img/yue@2x.png"/><span>申请借款需要做哪些认证？</span></a>
				            <div class="mui-collapse-content"  v-if="authenticationPop">
				                <p>用户注册之后，需要完成信息认证才可以申请借款。其中，认证信息有：实名认证、手机运营商、信用卡（邮箱）、工作单位及紧急联系人等信息。信息越完善，审批通过率和信用额度就越高。</p>
				            </div>
				        </li>
				         <li :class="['mui-table-view-cell', 'mui-collapse',{'mui-active': auditPop}]"  @click="auditPop=!auditPop">
				            <a :class="['mui-navigate-right',{ less: auditPop }]"><img src="../assets/img/yue@2x.png"/><span>提交申请后，多久我可以收到审核结果？</span></a>
				            <div class="mui-collapse-content" v-if="auditPop">
				                <p>审核结果会在提交申请后24小时内以短信的形式发送至申请手机，如遇周末或节假日顺延。</p>
				            </div>
				        </li>
				         <li :class="['mui-table-view-cell','mui-collapse',{ 'mui-active': accountPop },{'mui-active': accountPop}]" @click="accountPop=!accountPop">
				            <a :class="['mui-navigate-right',{ less: auditPop }]"><img src="../assets/img/yue@2x.png"/><span>放款多久到账？</span></a>
				            <div class="mui-collapse-content" v-if="accountPop">
				                <p>若您的借款申请已经审核通过，在您点击“绑卡收款”按钮后，工作日正常1小时内放款到账， 最迟下一个工作日早上到账。具体到账时间以收款银行到账通知为准。</p>
				            </div>
				        </li>
                <li :class="['mui-table-view-cell','mui-collapse',{ 'mui-active': emailPop },{'mui-active': emailPop}]" @click="emailPop=!emailPop">
				            <a :class="['mui-navigate-right',{ less: emailPop }]"><img src="../assets/img/yue@2x.png"/><span>如何填写信用卡邮箱？</span></a>
				            <div class="mui-collapse-content" v-if="emailPop">
				                <p>信用卡邮箱是在申请信用卡时用来接收信用卡账单的邮箱，如果您没有账单邮箱，可登录银行手机客户端，在个人资料栏目下选择账单寄送方式，修改为电子账单，或拨打信用卡中心的客服电话通过人工形式进行修改；如果忘记信用卡邮箱，可登录银行手机客户端，在信用卡个人中心查看电子账单地址；如果忘记邮箱密码，用忘记密码功能找回即可。</p>
				            </div>
				       </li>
				    </ul>
				</div>
			</div> -->
		</div>
  </div>

</template>
<script>
  import { mobileManager } from '../utils/WebInfo.js'
  export default {
      data(){
        return{
          authenticationPop: false,
          auditPop: false,
          accountPop: false,
          emailPop: false,
          pageType: '',
        }
      },
      created() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        mobileManager.hideBottomBar()   //隐藏原生底部栏
        //显示隐藏头部(true为h5 显示头部  false为原生访问，不显示头部)
        if(this.$route.params.pageType){
              this.pageType = this.$route.params.pageType;
              sessionStorage.isShowHeader=true;//防止下拉刷新获取不到url的参数
            }

        if(sessionStorage.isShowHeader){
          this.pageType=true;
        }
      },
      mounted(){

      },

       methods:{
         back(){
           this.$router.goBack(-1)
         },

       }
  }

</script>
<style lang="less" scoped>
  @w:75rem;
  .ldb-head-mian{
    padding-top: 46px;
    &.on{
      padding-top: 0px!important;
    }
  }
  .before-top{
    color: #333;
    font-size: 30/@w!important;
  }
  .before-bottom{
    font-size: 24/@w!important;

  }
  p{
    margin: 0;
    padding: 0;
    color: #8f8f94;
  }
  .lbd-pd-center{
			background-color: #fff;
		}
		.lbd-pd-center-title{
			height: 70/@w;
			margin:0 5%;
			padding-top: 20/@w;
			border-bottom: 1px solid #ccc ;
    }
    // .lbd-pd-center-title.bot{
    //   margin-top: 20/@w;
    // }
		.lbd-pd-center-title>p{
			font-size: 32/@w;
			color:#000;
			text-indent: 10/@w;
			height: 50/@w;
			line-height: 50/@w;
			border-left:3px solid #FBC511 ;
		}
		.lbd-pd-bottom>.lbd-pd-center-value>p{
			color: #000;
		}
		.lbd-pd-center-value{
			padding: 15/@w 5%;
    }
    .mui-navigate-right{
      display: inline-block;
    }
    .mui-navigate-right{
      >span{
        position: absolute;
        top: 20/@w;
        left: 120/@w;
        font-size: 30/@w;
      }
      >img {
        position: absolute;
        left: 60/@w;
        top: 20/@w;
        width: 40/@w;
        margin-right: 10/@w;
      }
    }
		.lbd-pd-question>.mui-navigate-right>img{
			width:100/@w;
			margin-right: 10/@w;
		}
		.lbd-pd-top{
			display: flex;
			height: 180/@w;
		}
		.lbd-pd-top>div{
			flex: 1;
			text-align: center;
			height: 130/@w;
      position: relative;
      i{
        position: absolute;
        display:inline-block;
        width: 25/@w;
        height: 25/@w;
        background-color: #FBC205;
        border-radius: 80/@w;
        position: absolute;
        bottom: -10/@w;
        left: 50%;

      }
      &.all-before{
         &:after{
          position: absolute;
			    content: " ";
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background-color: #FBC205;
        }
      }

      &.half-before{
        &:after{
          position: absolute;
			    content: " ";
          bottom: 0;
          height: 2px;
          width: 50%;
          left: 50%;
          background-color: #FBC205;
        }
      }
      &.half-after{
         &:after{
          position: absolute;
			    content: " ";
          bottom: 0;
          height: 2px;
          width: 50%;
          right: 50%;
          background-color: #FBC205;
      }
      }
    }
    // .lbd-pd-top>div::after{
		// 	    position: absolute;
		// 	    content: " ";
    //       bottom: 0;
    //       height: 2px;
    //       width: 100%;
    //       background-color: #FBC205;
		// }
		// .lbd-pd-top>div::after{
		// 	content: " ";
		// 	width: 25/@w;
		// 	height: 25/@w;
		// 	background-color: #FBC205;
		// 	border-radius: 80/@w;
		// 	position: absolute;
		// 	bottom: -17/@w;
		// 	left: 50%;
		// }
		.lbd-pd-top>div>p{
			font-size:25/@w;
		}
		.lbd-pd-top>div>p:nth-child(2){
			color:#000000 !important;
			font-size: 27/@w;
			font-weight: 600;
    }
    .mui-table-view-cell>a:not(.mui-btn) {
    position: relative;
    display: block;
    overflow: hidden;
    /*margin: -11/@w -15/@w;*/
    /*padding: inherit;*/
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
    height: 80/@w;
  }
  .mui-navigate-right:after, .mui-push-right:after {
    right: 15/@w;
    content: '\e583';
  }
  .mui-navigate-right:after, .mui-push-left:after, .mui-push-right:after {
      font-family: Muiicons;
      font-size: inherit;
      line-height: 1;
      position: absolute;
      top: 50%;
      display: inline-block;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      text-decoration: none;
      color: #bbb;
      -webkit-font-smoothing: antialiased;
  }
  .mui-table-view-cell {
    position: relative;
    // padding: 12/@w 30/@w;
  }
  .mui-table-view-cell:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
.mui-table-view-cell.mui-collapse.mui-active {
    margin-top: -1px;
}
.mui-table-view-cell.mui-active {
    background-color: #eee;
}
.mui-table-view-cell.mui-collapse>.mui-navigate-right:after{
    display: inline-block;
    right:60/@w;
    width: 32/@w;
    height: 32/@w;
    content: '';
    background-image: url(../assets/img/more.png);
    background-repeat: no-repeat;
    background-size: 100%;
}
.mui-table-view-cell.mui-collapse>.mui-navigate-right.less:after{
    background-image: url(../assets/img/less.png);
}

.mui-table-view-cell.mui-collapse>.mui-collapse-content{
    position: relative;
    overflow: hidden;
    // margin: 11/@w -15/@w -11/@w;
    padding: 8/@w 30/@w;
    background: #fff;
}
.mui-table-view-cell::after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 30/@w;
    height: 1px;
    content: '';
    background-color: #c8c7cc;
}
.mui-table-view-cell.mui-active {
    background-color: #eee!important;
}


</style>
