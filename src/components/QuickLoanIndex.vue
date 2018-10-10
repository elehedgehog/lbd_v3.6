<template>
	<div>
		<mt-header title="小鹅袋" v-show="showOrHideReturn">
			<mt-button icon="back" slot="left" @click="back"></mt-button>
		</mt-header>

		<div class="lbdContent">
			<div class="lbdTop">
				<div class="info">
					<div class="loan-des">
						<router-link :to="{ name: 'ProductDetail',params:{pageType:showOrHideReturn}}" tag="span" class="loan-des-pro" @click="product">产品说明</router-link>
					</div>
					<!--<img :src="this.productDetail.productLogo">-->
					<img src="../assets/img/QuickLoan/productLogo.png">
					<div class="productModule">
						<p class="product">小鹅袋</p>
						<div class="loanTerm">
							<span class="Loanoney">申请金额：1500 元</span> 期限: <span class="loanTermValue">7</span>天
						</div>
					</div>
				</div>
			</div>

			<!--<div class="moneyModule">
				<div class="repaymentModule">
					<div class="moneyModuleValue">1040元</div>
					<div class="moneyModuleInfo">还款金额</div>
				</div>
				<div class="accountModule">
					<div class="moneyModuleValue">800元</div>
					<div class="moneyModuleInfo">到账金额</div>
				</div>
			</div>-->

			<div class="identification">
				<!--<p>完成以下资料可贷款</p>-->
				<ul>
					<li class="shiMing" @click="goShiMing">
						<span><img src="../assets/img/QuickLoan/shiMing.png">基本信息</span>
						<a>
							<span v-show="this.isShiMingYZ" class="authenticated">已认证</span>
							<span v-show="this.isShiMingWZ">去认证</span>
							<span v-show="this.isShiMingGQ">已过期</span>
							<img src="../assets/img/homePage/listArrow.png">
						</a>
					</li>

					<li class="yunYingShang" @click="goYunYingShang">
						<span><img src="../assets/img/QuickLoan/yunYingShang.png">运营商</span>
						<a>
							<span v-show="this.isYunYingShengYR" class="authenticated">已认证</span>
							<span v-show="this.isYunYingShengQR">去认证</span>
							<span v-show="this.isYunYingShengLZ">认证中</span>
							<span v-show="this.isYunYingShengLS">认证失败</span>
							<span v-show="this.isYunYingShengGQ">认证过期</span>
							<img src="../assets/img/homePage/listArrow.png">
							<!--<img :style="this.ringArrowYYS" src="../assets/img/homePage/listArrow.png">-->
						</a>
					</li>

					<li class="cardID" @click="goShenFenZheng">
						<span><img src="../assets/img/homePage/cardID.png">身份证</span>
						<a>
							<span v-show="this.isShenFenZhengYZ" class="authenticated">已认证</span>
							<span v-show="this.isShenFenZhengQR">去认证</span>
							<span v-show="this.isShenFenZhengGQ">认证过期</span>
							<img src="../assets/img/homePage/listArrow.png">
						</a>
					</li>

					<!--<li class="xinYongKa" @click="goYouXiang">
				        <span><img src="../assets/img/homePage/xinYongKa.png">信用卡邮箱</span>
				        <a>
				        <span v-show="this.isYouXiangYR" class="authenticated">已认证</span>
	                    <span v-show="this.isYouXiangQR">去认证</span>
	                    <span v-show="this.isYouXiangLZ">认证中</span>
	                    <span v-show="this.isYouXiangLS">认证失败,请重新认证</span>
	                    <span v-show="this.isYouXiangGQ">认证过期，重新认证</span>
				        	<img  :style="this.ringArrowYX"  src="../assets/img/homePage/listArrow.png">
				        </a>
				    </li>-->


					    <!--<li class="yunYingShang" @click="goBuChong">
					        <span><img src="../assets/img/homePage/otherLittle.png">补充信息</span>
					        <a>
					        	<span v-show="this.isBuChongYZ" class="authenticated">已认证</span>
					        	<span v-show="this.isBuChongWZ">去认证</span>
					        	<span v-show="this.isBuChongGQ">过期</span>
					        	<img src="../assets/img/homePage/listArrow.png">
					        </a>
					    </li>-->
				</ul>

			</div>
		</div>
		<!--<button v-if="isShowTX" class="bottomBtn" @click="writeInfo">提交申请</button>-->
		<button v-if="isShowTX" class="bottomBtn" @click="submitSupply">提交申请</button>
		<button v-if="messageNoComplete" class="bottomBtn disableClick" disabled>提交申请</button>
		<button v-if="isShowWF" class="bottomBtn disableClick" disabled>无法申请</button>
		<!--<button v-if="isShowLJ" class="bottomBtn" @click="save">立即申请</button>-->
	</div>
</template>
<script>
	import { MessageBox, Toast, Indicator } from 'mint-ui';
	import { grantManager } from '../utils/grant.js'
	import { mobileManager } from '../utils/WebInfo.js'

	export default {
		name: 'HomePage',
		data() {
			return {
				productDetail: {
					productName: '',
					consultRate: '1.6~3.3%',
					quota: '',
					periodsScope: '',
					minAmount: 0,
					maxAmount: 0,
					currSelectedAmount: 0,
					productCode: '',
					productLogo: '',
					applyCondition: '',
					jinDanMoney: ''

				},
				urlTypeValue: '',
				isLoad: true,
				isShiMingYZ: false,
				isShiMingWZ: false,
				isShiMingGQ: false,

				isShenFenZhengYZ: false,
				isShenFenZhengQR: false,
				isShenFenZhengGQ: false,

				isYunYingShengYR: false,
				isYunYingShengQR: false,
				isYunYingShengLZ: false,
				isYunYingShengLS: false,
				isYunYingShengGQ: false,

				isYouXiangYR: false,
				isYouXiangQR: false,
				isYouXiangLZ: false,
				isYouXiangLS: false,
				isYouXiangGQ: false,

				isBuChongYZ: false,
				isBuChongWZ: false,
				isBuChongGQ: false,

				isGray: '',
				HomePageMissSendQuery: this.$route.query,
				HomePageMissSendParams: this.$route.params,
				webInfo: this.lbdUtil.getWebInfoUrl(),
				selectedAmount: '最高可借7000元',
				isShowTX: true,
				isShowWF: false,
				isShowLJ: false,
				messageNoComplete: false,
				ringArrowYYS: '',
				ringArrowYX: '',
				showOrHideReturn: true,

				nativeId: '',
				applyConditions: [], //申请条件
				range: [], //借款额度范围
				loanRate: '', //贷款利率
				loadReason: '', //借款理由

			}
		},
		async created() {
			mobileManager.enableRefresh(true)

//			sessionStorage.QuickLoanIndextToken= '431966237585631'
//			sessionStorage.QuickLoanIndexChannelCode='lbdApp'
//			sessionStorage.QuickLoanIndexProductCode='LBD_XED'

			mobileManager.buriedPoint('fastloan_detail') //埋点id
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			await this.getH5UserIntegrity(); //在这里判断按钮状态，认证状态
//			mobileManager.extremeLoan();
			window.refreshJSDPage = this.refreshJSDIndexPage;//身份证认证完成调的方法  重新请求认证进度
			window.authIdCardWithContact = this.authIdCardWithContact;
			window.appSubmitOrder = this.appSubmitOrder;
		},
		mounted() {
			mobileManager.hideBottomBar(); //隐藏原生底部栏
//			this.jinDan();
			let paramUrl = document.location.href
			let arr = paramUrl.split('?')
			if(arr[1]) {
				let newArr = arr[1].split('&')
				for(var i = 0; i < newArr.length; i++) {
					var item = newArr[i]
					if(/id=/.test(item)) {
						this.nativeId = item.split('=')[1];
						sessionStorage.setItem('nativeId', this.nativeId)
					}
					if(/token=/.test(item)) {
						sessionStorage.QuickLoanIndextToken=item.split('=')[1];
					}
					if(/productCode=/.test(item)) {
						sessionStorage.QuickLoanIndexProductCode=item.split('=')[1];
						this.productDetail.productCode=item.split('=')[1];
					}
					if(/channelCode=/.test(item)) {
						sessionStorage.QuickLoanIndexChannelCode=item.split('=')[1];
					}
					if(this.nativeId) {
						this.getProductDetail(this.nativeId);
					} else {
						if(sessionStorage.QuickLoanIndexId) {
							this.getProductDetail(sessionStorage.QuickLoanIndexId);
						} else {
							this.getProductDetail(sessionStorage.nativeId);
						}
					}
				}
			}

		},
		methods: {
			refreshJSDIndexPage() {
				this.getH5UserIntegrity();
			},
			authIdCardWithContact(isSuccess) {
				//原生身份证认证完后调用的方法(前端进行页面分发跳转)
				//isSuccess=0表示已提交身份证认证但没提交通讯录 isSuccess=1两者已提交成功

				//显示已认证状态
				this.isShenFenZhengYZ = true;
				this.isShenFenZhengQR = false;
				this.isShenFenZhengGQ = false;
				this.afterAuthIdCardWithContact(isSuccess);
//				if(isSuccess==0){
//					//身份证认证步骤里通讯录没授权  回到这样页面就弹授权
//					this.pullContact();
//
//				}else if(isSuccess==1){
//					//身份证和通讯录都提交了(判断运营商是否已认证 否就跳运营商 已认证就下单去绑卡页面)
//					this.afterAuthIdCardWithContact();
//				}
			},
			back() {
				// mobileManager.refreshHomeUrl()//原生控制首页
//				mobileManager.goBack() //原生返回上一级
				this.$router.push({ name: 'HomePageMiss', params: this.HomePageMissSendParams ,query: this.HomePageMissSendParams});
			},
			product() {
				mobileManager.buriedPoint('fastloan_product_manual') //埋点id
			},
			//计算还款金额
			loanCaculate(val) {
				let num = val * (1 + 0.0066 * 12) //2500*（1+0.66%*12）
				this.loanRate = Math.floor(num * 100) / 100
			},
			//从首页进入改页面时，获取路由中的id，调用下面的接口，获得数据
			//http://119.23.148.208:8084/appServer/product/detail?id=1&reqApplicationType=11&reqApplicationVersion=2&osName=22&osVersion=1.0&appDownChannel=3.3&mobileModel=3.3
			async getProductDetail(id) {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				await this.$http.get(
					this.lbdUtil.host + '/product/detail?'+webInfo,{
					params:{
						token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode,
				    	productCode: sessionStorage.QuickLoanIndexProductCode,
				    	id: id,
				    	reqApplicationType: 11
					},
				}).then((res) => {
					let resData = res.data;
					console.log(resData)
					if(resData.status == '0000') {
						this.productDetail.productCode = resData.data.productCode;
						this.productDetail.productName = resData.data.productName;
						window.document.title = this.productDetail.productName;
						this.productDetail.consultRate = resData.data.consultRate; //税率
						this.productDetail.quota = resData.data.quota; //借款额度范围
						this.productDetail.periodsScope = resData.data.periodsScope; //期限
						this.productDetail.productLogo = resData.data.productLogo;
						this.productDetail.currSelectedAmount = this.selectedAmount;
						//当后台数据库中有<br/>之类的html标签时，换行显示
						let condetion = resData.data.applyCondition;
						if(condetion == '') {
							this.productDetail.applyCondition = '暂无';
						} else { //
							this.productDetail.applyCondition = resData.data.applyConditions;
						};
						this.applyConditions = this.productDetail.applyCondition; //申请条件
						this.productDetail.maxAmount = resData.data.maxAmount; //默认显示最大金额
						this.productDetail.minAmount = resData.data.minAmount;
						let max = this.productDetail.maxAmount; //60000
						let min = this.productDetail.minAmount; //500
						let arr = [];
						let num = min >= 500 ? min : 500;
						if(min < 500) {
							arr.push(min);
						}
						while(num <= max) {
							arr.push(num);
							num += 500;
						}
						this.range = arr;
						this.loanCaculate(this.productDetail.maxAmount)
					} else {
						if(resData.data != null) {
							//this.showToast(resData.data.msg);
						};
					};
				}, (err) => {
					console.log('goYouXiang失败：' + err);
				});

			},
			showToast: function(msg) {
				Toast({
					message: msg,
					position: 'bottom',
					duration: 2000
				});
			},

			selectAmountF() {
				this.productDetail.currSelectedAmount = this.selectedAmount;
				this.loanCaculate(this.productDetail.currSelectedAmount)
			},
			//用户信息完整性接口
			async getH5UserIntegrity() {
				let webInfo = this.lbdUtil.getWebInfoUrl();
				await this.$http.get(
					this.lbdUtil.host + '/userInfo/getH5UserIntegrity?' + webInfo,{
					 params:{
						token: sessionStorage.QuickLoanIndextToken,
						channelCode: sessionStorage.QuickLoanIndexChannelCode,
					},
				}).then((res) => {
					console.log(res)
					let resData = res.data;
					if(resData.status == '0000') {

						if(resData.data.userBaseInfoGrant == 1) { //已经实名认证
							this.isShiMingYZ = true;
							this.isShiMingWZ = false;
							this.isShiMingGQ = false;
						};
						if(resData.data.userBaseInfoGrant == 0) {
							this.isShiMingYZ = false;
							this.isShiMingWZ = true;
							this.isShiMingGQ = false;
						};
						if(resData.data.userBaseInfoGrant == 4) {
							this.isShiMingYZ = false;
							this.isShiMingWZ = false;
							this.isShiMingGQ = true;
						};
						if(resData.data.isLivingGrant == 1) { //已经身份认证
							this.isShenFenZhengYZ = true;
							this.isShenFenZhengQR = false;
							this.isShenFenZhengGQ = false;

						};
						if(resData.data.isLivingGrant == 0) {
							this.isShenFenZhengYZ = false;
							this.isShenFenZhengQR = true;
							this.isShenFenZhengGQ = false;
						};
						if(resData.data.isLivingGrant == 4) { //等于4的情况
							this.isShenFenZhengYZ = false;
							this.isShenFenZhengQR = false;
							this.isShenFenZhengGQ = true;
						};

						if(resData.data.hasOperatorInfo == 1) { //已经运营商认证
							this.isYunYingShengYR = true;
							this.isYunYingShengQR = false;
							this.isYunYingShengLZ = false;
							this.isYunYingShengLS = false;
							this.isYunYingShengGQ = false;
							this.ringArrowYYS = 'filter=alpha(opacity:0);-moz-opacity:0;opacity:0;';

						};
						if(resData.data.hasOperatorInfo == 0) {
							this.isYunYingShengYR = false;
							this.isYunYingShengQR = true;
							this.isYunYingShengLZ = false;
							this.isYunYingShengLS = false;
							this.isYunYingShengGQ = false;
							this.ringArrowYYS = '';
						};
						if(resData.data.hasOperatorInfo == 2) {
							this.isYunYingShengYR = false;
							this.isYunYingShengQR = false;
							this.isYunYingShengLZ = true;
							this.isYunYingShengLS = false;
							this.isYunYingShengGQ = false;
							this.ringArrowYYS = 'filter=alpha(opacity:0);-moz-opacity:0;opacity:0;';
						};
						if(resData.data.hasOperatorInfo == 3) {
							this.isYunYingShengYR = false;
							this.isYunYingShengQR = false;
							this.isYunYingShengLZ = false;
							this.isYunYingShengLS = true;
							this.isYunYingShengGQ = false;
							this.ringArrowYYS = '';
						};
						if(resData.data.hasOperatorInfo == 4) {
							this.isYunYingShengYR = false;
							this.isYunYingShengQR = false;
							this.isYunYingShengLZ = false;
							this.isYunYingShengLS = false;
							this.isYunYingShengGQ = true;
							this.ringArrowYYS = '';
						};

						if(resData.data.hasEmailInfo == 1) { //已经邮箱认证
							this.isYouXiangYR = true;
							this.isYouXiangQR = false;
							this.isYouXiangLZ = false;
							this.isYouXiangLS = false;
							this.isYouXiangGQ = false;
							this.ringArrowYX = 'filter=alpha(opacity:0);-moz-opacity:0;opacity:0;';

						};
						if(resData.data.hasEmailInfo == 0) {
							this.isYouXiangYR = false;
							this.isYouXiangQR = true;
							this.isYouXiangLZ = false;
							this.isYouXiangLS = false;
							this.isYouXiangGQ = false;
							this.ringArrowYX = '';
						};
						if(resData.data.hasEmailInfo == 2) {
							this.isYouXiangYR = false;
							this.isYouXiangQR = false;
							this.isYouXiangLZ = true;
							this.isYouXiangLS = false;
							this.isYouXiangGQ = false;
							this.ringArrowYX = 'filter=alpha(opacity:0);-moz-opacity:0;opacity:0;';
						};
						if(resData.data.hasEmailInfo == 3) {
							this.isYouXiangYR = false;
							this.isYouXiangQR = false;
							this.isYouXiangLZ = false;
							this.isYouXiangLS = true;
							this.isYouXiangGQ = false;
							this.ringArrowYX = '';
						};
						if(resData.data.hasEmailInfo == 4) {
							this.isYouXiangYR = false;
							this.isYouXiangQR = false;
							this.isYouXiangLZ = false;
							this.isYouXiangLS = false;
							this.isYouXiangGQ = true;
							this.ringArrowYX = '';
						};

						if(resData.data.userSupplyInfo == 1) { //已经补充信息认证
							this.isBuChongYZ = true;
							this.isBuChongWZ = false;
							this.isBuChongGQ = false;
						};
						if(resData.data.userSupplyInfo == 0) {
							this.isBuChongYZ = false;
							this.isBuChongWZ = true;
							this.isBuChongGQ = false;
						};
						if(resData.data.userSupplyInfo == 4) {
							this.isBuChongYZ = false;
							this.isBuChongWZ = false;
							this.isBuChongGQ = true;
						};


						if(resData.data.userBaseInfoGrant != 1 || resData.data.isLivingGrant !=1 || resData.data.hasOperatorInfo !=1){
							//全部‘已认证’就显示立即申请

							this.isShowTX = false;
							this.messageNoComplete = true;
							this.isShowLJ = false;
						}

//						if(resData.data.userBaseInfoGrant == 1 && resData.data.isLivingGrant == 1 && resData.data.hasOperatorInfo == 1 && resData.data.hasEmailInfo == 1 && resData.data.userSupplyInfo == 1) {
//							//全部‘已认证’就显示立即申请
//							this.isShowTX = false;
//							this.isShowWF = false;
//							this.isShowLJ = true;
//						};

						//window.location.reload();
						//再调用一个接口，判断是否命中
						//用户借款的三要素前置拦截
						//按钮显示“无法申请”的条件是isHit == 1（已命中）
						//“立即申请”的条件是1、isHit == 0(未命中);2、五项认证都变成‘已认证’
						//剩下的情况是"填写资料"的条件
//						this.$http.get(
//							this.lbdUtil.host + '/userInfo/allPreIntercepting?' + webInfo.substr(1) + '&token=' + sessionStorage.QuickLoanIndextToken + '&channelCode=' + sessionStorage.QuickLoanIndexChannelCode, {
//								params
//							}
//						).then((res) => {
//							let resData = res.data;
//							if(resData.status == "0000") {
//								if(resData.data.hashUser == 1) {
//
//									if(resData.data.isHit == 1) {
//										//有命中就显示‘无法申请’
//										this.isShowTX = false;
//										this.messageNoComplete = false;
//										this.isShowWF = true;
//										this.isShowLJ = false;
//										//window.location.reload();
//									};
//									//window.location.reload();
//								} else {
//									//mui("#submitBtn")[0].innerHTML='提交申请';
//								}
//							} else {
//								//mui("#submitBtn")[0].innerHTML='提交申请';
//							}
//						}, (err) => {
//							console.log('allPreIntercepting失败：' + err);
//						});
					}; //end if

					if(resData.status == '1100') { //未登录,所有认证项显示为“去认证”
						this.isLoad = false;

						this.isShiMingYZ = false;
						this.isShiMingWZ = true;
						this.isShiMingGQ = false;

						this.isShenFenZhengYZ = false;
						this.isShenFenZhengQR = true;
						this.isShenFenZhengGQ = false;

						this.isYunYingShengYR = false;
						this.isYunYingShengQR = true;
						this.isYunYingShengLZ = false;
						this.isYunYingShengLS = false;
						this.isYunYingShengGQ = false;

						this.isYouXiangYR = false;
						this.isYouXiangQR = true;
						this.isYouXiangLZ = false;
						this.isYouXiangLS = false;
						this.isYouXiangGQ = false;
						this.ringArrowYX = '';

						this.isBuChongYZ = false;
						this.isBuChongWZ = true;
						this.isBuChongGQ = false;

					};

			}, (err) => {
					console.log('getH5UserIntegrity失败：' + err);
				});
			},
			goShiMing() {
				if(this.isLoad == false) {
					mobileManager.startLoginActivity() //跳转app首页
				} else {
					this.$router.push({
						name: 'TopSpeedAuthentication',
						params: {
							token: sessionStorage.QuickLoanIndextToken,
							productCode: this.productDetail.productCode,
							channelCode: sessionStorage.QuickLoanIndexChannelCode,
							pageType: this.showOrHideReturn
						},
						query: {
							token: sessionStorage.QuickLoanIndextToken,
							productCode: this.productDetail.productCode,
							channelCode: sessionStorage.QuickLoanIndexChannelCode,
							pageType: this.showOrHideReturn
						}
					});
				}
			},
			goShenFenZheng() {
				if(this.isLoad == false) {
					mobileManager.startLoginActivity();

				} else {

					if(this.isShiMingYZ == false ) { //没有进行实名认证，就提示先进行实名认证
						this.showToast('请先认证基础信息');
						return;
					};
					grantManager.checkIdCard(4);
				}
			},
			goYunYingShang() {
				if(this.isLoad == false) {
					mobileManager.startLoginActivity() //跳转app首页
				} else {
					mobileManager.buriedPoint('fastloan_infomation_auth') //埋点id
					if(this.isShiMingYZ == true) {
						if(this.isYunYingShengYR == true) {
							this.showToast('已认证...');
							return;
						};
						if(this.isYunYingShengLZ == true) {
							this.showToast('正在认证中...');
							return;
						}
						let webInfo = this.webInfo;
						// let returnPageUrl=encodeURIComponent(this.lbdUtil.host+'/webpage/hybridAppForWeb/lbd_v3.6/dist/index.html#/QuickLoanIndex?1=1&channelCode=lbdApp&productCode=LBD_LBB'+'&token='+sessionStorage.QuickLoanIndextToken+'&id='+sessionStorage.QuickLoanIndexId+'&type='+this.urlTypeValue,"UTF-8");
						let returnPageUrl

						returnPageUrl = encodeURIComponent(this.lbdUtil.host + `/webpage/hybridAppForWeb/lbd_v3.6/dist/index.html#/QuickLoanIndex?1=1&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&productCode=LBD_XED&token=${sessionStorage.QuickLoanIndextToken}&id=${sessionStorage.QuickLoanIndexId}`, "UTF-8")

						let url = this.lbdUtil.host + '/grantUserByTianji/grantUserMobileByTianji?' + webInfo.substr(1) + '&token=' + sessionStorage.QuickLoanIndextToken + '&channelCode=' + sessionStorage.QuickLoanIndexChannelCode + '&productCode=' + this.productDetail.productCode + '&returnPageUrl=' + returnPageUrl;
						console.log(url);
						window.location.href = url;

					} else {
						this.showToast('请先认证基础信息');
					};

				}
			},
			//go 邮箱
			goYouXiang() {
				if(this.isLoad == false) {
					mobileManager.startLoginActivity() //跳转app首页
				} else {
					mobileManager.buriedPoint('fastloan_email_auth') //埋点id
					if(this.isShiMingYZ == true && this.isShenFenZhengYZ == true) {
						if(this.isYouXiangYR == true) {
							return;
						};
						if(this.isYouXiangLZ == true) {
							return;
						}
						let webInfo = this.webInfo;
						this.$http.get(
							this.lbdUtil.host + '/grantUserByTianji/saveCreditSDKInfo?' + webInfo.substr(1) + '&token=' + sessionStorage.QuickLoanIndextToken + '&channelCode=' + sessionStorage.QuickLoanIndexChannelCode + '&productCode=' + this.productDetail.productCode, {

							}
						).then((res) => {
							let resData = res.data;
							if(resData.status == '0000') { //已经授权,下一步是提交
								let idCard = resData.data.idCard;
								let mobile = resData.data.mobile;
								let name = resData.data.name;
								let taskId = resData.data.outUniqueId;
								mobileManager.applyParams('ec', mobile, idCard, name, taskId, 2);
							} else {
								this.showToast(resData.data.msg)
							};
						}, (err) => {
							console.log('goYouXiang失败：' + err);
						});

					} else {
						this.showToast('请先完成实名认证或身份认证');
					};

				}
			},

			goBuChong() {
				if(this.isLoad == false) {
					mobileManager.startLoginActivity() //跳转app首页
				} else {
					if(this.isShiMingYZ == true) {
						this.$router.push({
							name: 'TopSpeedQuotaSupplyMessage',
							params:this.HomePageMissSendParams,
							query:this.HomePageMissSendQuery
//							params: {
//								productCode: this.productDetail.productCode,
//								pageType: this.showOrHideReturn
//							},
//							: {
//								productCode: this.productDetail.productCode,
//								pageType: this.showOrHideReturn
//							}
						})

					} else {
						this.showToast('请先认证基础信息');
					};
				}

			},


			afterAuthIdCardWithContact(isSuccess) {
				//原生身份证认证后回到这个页面进行分发下一步跳转
				let webInfo=this.lbdUtil.getWebInfoObj();
				let params={
					token: sessionStorage.QuickLoanIndextToken,
					channelCode: sessionStorage.QuickLoanIndexChannelCode
				}
				let data = this.$qs.stringify(Object.assign(params,webInfo));
				Indicator.open({ spinnerType: 'fading-circle' });
				this.$http.post(this.lbdUtil.host+'/userInfo/authenticationProcess',
					data
			    ).then((res)=>{
			    	Indicator.close();
					if(res.data.status==='0000'){

						if(res.data.data.nowGrantStep==3){
							//邮箱未认证 跳转到运营商认证页
							let returnPageUrl = encodeURIComponent(this.lbdUtil.host + `/webpage/hybridAppForWeb/lbd_v3.6/dist/index.html#/QuickLoanIndex?1=1&productCode=LBD_XED&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&token=${sessionStorage.QuickLoanIndextToken}`,"UTF-8")   //运营商参数
				            let urls = this.lbdUtil.host + `/grantUserByTianji/grantUserMobileByTianji?token=${sessionStorage.QuickLoanIndextToken}&productCode=${sessionStorage.QuickLoanIndexProductCode}&channelCode=${sessionStorage.QuickLoanIndexChannelCode}&returnPageUrl=${returnPageUrl}`;
				            let webInfo = this.lbdUtil.getWebInfoUrl();
				            window.location = urls + webInfo;
						}else{
							//身份证认证完回到这个页面后  如果其他都认证了  就调起下单流程
							//isSuccess=0表示已提交身份证认证但没提交通讯录 isSuccess=1两者已提交成功
							//走到这里说明基础信息页面已经校验过书否命中前置拦截
							if(isSuccess==0){
								//先提交通讯录再进单
								this.pullContact();
							}else if(isSuccess==1){
								//已提交通讯录直接进单
								this.jinDan();
							}

						}

					}else{
//						this.showToast(res.data.msg);
					}

				},(err)=>{
					Indicator.close();
//					this.showToast('网络出错');
				});
			},

			//提交申请(点击提交申按钮请触发)
			submitSupply() {
				Indicator.open({ spinnerType: 'fading-circle' });
				//用户借款的三要素前置拦截
				//按钮显示“无法申请”的条件是isHit == 1（已命中）
				//“立即申请”的条件是1、isHit == 0(未命中);2、五项认证都变成‘已认证’
				//0=没命中 1=撞特点库(还款中、在申中),2=PD白名单(A类白名单),3=PD风控白名单(B类白名单) 4=PD分控黑名单
				let webInfo=this.lbdUtil.getWebInfoObj();
				let queryData={
					token: sessionStorage.QuickLoanIndextToken,
					channelCode: sessionStorage.QuickLoanIndexChannelCode,
				}
				let data = this.$qs.stringify(Object.assign(queryData,webInfo));
				this.$http.post(this.lbdUtil.host+'/app/webFrame/allPreInterceptingByAppMobileExpress',
					data
				).then((res) => {
					Indicator.close();
					console.log(res);
					if(res.data.status == "0000") {
						if(res.data.data==1 || res.data.data==4) {
							console.log('命中')
							//有命中就显示‘无法申请’
							this.isShowTX = false;
							this.messageNoComplete = false;
							this.isShowWF = true;
							this.isShowLJ = false;
							MessageBox.alert('您的资质暂无法申请该产品，可以看看其他产品哦~').then(action => {
							//回到首页
							this.$router.push({ name: 'HomePageMiss', params: this.HomePageMissSendParams ,query: this.HomePageMissSendQuery});
							});
						}else{
							//resData.data.isHit == 0
							//没命中  授权通讯录(每次都要授权)
							console.log('没命中')
							this.pullContact();
						};

					} else {
					}
				}, (err) => {
					Indicator.close();
					console.log('allPreIntercepting失败：' + err);
				});
			},

			pullContact() {
				//调起原生的方法 弹出授权通讯(授权成功后  原生调appSubmitOrder方法 去进单)
				grantManager.uploadContacts();
			},

			appSubmitOrder(isSuccess) {
				//原生授权通讯录成功后调的方法(去进单)
				//基础信息->运营商->身份证认证  回来走的进单操作
				if(isSuccess==1){
					this.jinDan();
				}
				//isSuccess==0终止  用户可以点击 ‘提交申请’按钮手动授权通讯录早提交订单

			},


			//保存订单前获取入参的参数
			jinDan() {
				Indicator.open({ spinnerType: 'fading-circle' });
				let webInfo = this.webInfo;
				this.$http.get(
					this.lbdUtil.host + '/user/userOrgInfo/queryUserOrgInfo?' + webInfo.substr(1) + '&token=' + sessionStorage.QuickLoanIndextToken+'&channelCode='+sessionStorage.QuickLoanIndexChannelCode, {

					}
				).then((res) => {
					Indicator.close();
					let resData = res.data;
					console.log(res);
					if(resData.status == '0000') { //已经授权,下一步是提交
						this.productDetail.jinDanMoney = resData.data.applayAmount;
						this.loadReason = resData.data.loadReason;
						this.save();
					} else {
						//this.showToast(resData.msg)
					};

				}, (err) => {
					Indicator.close();
					console.log('进单获取金额失败：' + err);
				});

			},

			save() { //提交申请接口
				mobileManager.buriedPoint('fastloan_apply_immediately') //埋点id
				//调用app别人的接口时，先判断是否为空，如果为空也会提示未定义的
				//token,channelCode,productCode从路由中获取，地址栏的url字符串中有
				Indicator.open({
					spinnerType: 'fading-circle'
				});

				if(this.productDetail.currSelectedAmount == 0) {
					this.productDetail.currSelectedAmount = this.productDetail.maxAmount;
				}

				let webInfo = this.lbdUtil.getWebInfoUrl();
				this.$http.get(this.lbdUtil.host +'/orderApply/v3/save?'+webInfo,{
					params:{
					token: sessionStorage.QuickLoanIndextToken,
					channelCode: sessionStorage.QuickLoanIndexChannelCode,
			    	productCode: 'LBD_XED',
				    applyAmount:'1500',
				    loadReason:this.loadReason,
				    periodTotal: '1',
				    loadSrc:'5',
				    orderType:'2'
				  	},
				}
				).then((res) => {
					let resData = res.data;
					console.log(resData);
					if(resData.status == '0000') {
						this.$router.push({
							name: 'BindCardConfirm',
							params: {
								buriedPoint: 'quick' //埋点传值判断
							},
							query: {
								productCode: this.productDetail.productCode,
								channelCode: sessionStorage.QuickLoanIndexChannelCode,
								token: sessionStorage.QuickLoanIndextToken,
								applyAmount: this.productDetail.jinDanMoney,
								borrowOrderCode : resData.data.borrowOrderCode
							}
						});
					} else if(resData.status == '1100') { //未登录
						this.isLoad = false;
					} else {
						this.showToast(resData.msg);
					};
					Indicator.close();
				}, (err) => {
					console.log('save失败：' + err);
					Indicator.close();
				});


			}
		},

	}
</script>
<style scoped lang="less">
	@w: 68rem;
	// .Router{
	//   background: #FFFFFF;
	&.loan-des {
		position: relative;
		/*padding: 30/@w 0 20/@w 40/@w;*/
		span {
			display: inline-block;
			&.loan-des-one {
				position: relative;
				height: 40/@w;
				line-height: 40/@w;
				left: 40/@w;
				font-size: 26/@w;
				&:before {
					content: '';
					display: block;
					left: -35/@w;
					top: 5/@w;
					position: absolute;
					width: 28/@w;
					height: 28/@w;
					background-image: url(../assets/img/homePageMiss/one_loan.png);
					background-repeat: no-repeat;
					background-size: 100%;
				}
			}
			&.loan-des-pro {
				position: absolute;
				right: 0;
				top: 20/@w;
				padding: 10/@w 32/@w;
				;
				font-size: 28/@w;
				border-top-left-radius: 50/@w;
				border-bottom-left-radius: 50/@w;
				background-color: #F9761E;
				text-align: center;
				color: #fff;
			}
		}
	}

	&.loan-most {
		font-size: 28/@w;
		text-align: center;
	}

	p {
		margin: 0;
	}

	header {
		background-color: #FFA800;
		/*#FBC205;*/
		box-shadow: none;
		height: 42px;
		text-align: center;
		position: relative;
		padding-top: 32/@w;
		.imgTopArrow {
			position: absolute;
			left: 37/@w;
			width: 12/@w;
			height: 34/@w;
		}
		.imgInfor {
			position: absolute;
			right: 37/@w;
			width: 39/@w;
			height: 36/@w;
		}
		.title {
			// height: 30/@w;
			// line-height: 30/@w;
			font-family: Microsoft YaHei;
			font-size: 36/@w;
			color: #ffffff;
		}
	}

	.lbdContent {
		margin: 0;
		.lbdTop {
			margin: 0;
			background-image: url('../assets/img/QuickLoan/QuickLoanBk.png');
			background-repeat: no-repeat;
			background-size: cover;
			.btn {
				text-align: right;
				a {
					background-color: #F9761E;
					color: #FFFFFF;
					border-bottom-left-radius: 30/@w;
					border-top-left-radius: 30/@w;
					height: 50/@w;
					width: 184/@w;
					border: 0;
					font-family: Microsoft YaHei;
					font-size: 28/@w;
					color: #FFFFFF;
					padding: 10/@w 37/@w;
					line-height: 50/@w;
				}
			}
			.info {
				overflow: auto;
				position: relative;

				img {
					float: left;
					width: 118/@w;
					height: 118/@w;
					margin: 50/@w 30/@w 47/@w 37/@w;
				}
				.productModule {
					position: absolute;
					left: 180/@w;
					margin-top: 50/@w;
					padding-bottom: 50/@w;
					color: #ffffff;
					float: left;
					width: 65%;
					/*height: 118/@w !important;*/
					.product {
						font-family: Microsoft YaHei;
						font-size: 32/@w;
						margin: 0;
						margin-top: 15/@w;
					}
					.rate {
						font-family: Microsoft YaHei;
						font-size: 32/@w;
						margin: 0;
						margin-top: 10/@w;
					}
					.loanTerm {
						float: left;
						font-size: 25/@w;
						margin-top: 10/@w;
						.Loanoney {
							display: inline-block;
							margin-right: 20/@w;
						}
					}
				}
			}
		}
		.moneyModule {
			width: 100%;
			height: 150/@w;
			background-color: #FFFFFF;
			.repaymentModule,
			.accountModule {
				float: left;
				width: 50%;
				text-align: center;
				box-sizing: border-box;
				margin-top: 40/@w;
				font-size: 28/@w;
				.moneyModuleValue {
					color: #FFA800;
				}
				.moneyModuleInfo {
					color: #CDCBCB;
				}
			}
			.repaymentModule {
				border-right: 2px solid #F3F3F3;
			}
			.accountModule {}
		}
		.condition {
			margin-top: 10/@w;
			background-color: #fff;
			.title {
				@diff : 80/@w;
				width : calc(~"100% - @{diff}");
				height: 80/@w;
				line-height: 80/@w;
				font-family: Microsoft YaHei;
				font-size: 28/@w;
				color: #4D4D4D;
				margin: 0 40/@w;
			}
			hr {
				margin: 0;
				height: 1px;
				border: none;
				border-top: 1px solid #F0F0F0;
			}
			.content {
				@diff : 80/@w;
				width : calc(~"100% - @{diff}");
				font-family: Microsoft YaHei;
				font-size: 26/@w;
				color: #999999;
				margin: 0 40/@w;
				padding: 15/@w 0;
			}
		}
		.range {
			background-color: #FEF6E1;
			margin-top: 10/@w;
			// border-top: 15/@w solid #F0F0F0;
			.title {
				height: 60/@w;
				line-height: 60/@w;
				text-align: center;
				font-family: Microsoft YaHei;
				font-size: 26/@w;
				color: #B69555;
			}
			hr {
				margin: 0;
				height: 1px;
				border: none;
				border-top: 1px solid #F0F0F0;
			}
			.details {
				height: 100/@w;
				;
				margin: 30/@w 60/@w 0;
				form {
					position: relative;
					display: inline-block;
					background-color: #fff;
					border: 1px solid #F1EDE4;
					select {
						padding: 0 40/@w 0 20/@w;
						margin-right: 20/@w;
						height: 60/@w;
						font-family: Microsoft YaHei;
						font-size: 28/@w;
						color: #FFA800;
						border-radius: 10/@w;
						appearance: none;
						-moz-appearance: none;
						-webkit-appearance: none;
						outline: none;
						border: none;
						background-color: #fff;
						background: url(../assets/img/QuickLoan/QuickLoanSelectArrow.png) no-repeat right center white;
						background-size: 15px;
					}
				}
				span {
					font-family: Microsoft YaHei;
					font-size: 26/@w;
					color: #B69555;
					float: right;
					margin-top: 20/@w;
				}
			}
			.loanRate {
				height: 50/@w;
				line-height: 30/@w;
				font-size: 24/@w;
				color: #B69555;
				padding-bottom: 20/@w;
				p {
					padding: 0 40/@w;
				}
			}
		}
		.identification {
			background-color: #fff;
			p {
				@diff : 40/@w;
				width: calc(~"100% - @{diff}");
				height: 80/@w;
				line-height: 80/@w;
				font-family: Microsoft YaHei;
				font-size: 26/@w;
				color: #4D4D4D;
				margin-left: 40/@w;
			}
			ul {
				li {
					height: 100/@w;
					line-height: 100/@w;
					border-top: solid 1px #F0F0F0;
					display: flex;
					justify-content: space-between;
					cursor: pointer;
					span {
						font-family: Microsoft YaHei;
						font-size: 28/@w;
						color: #4d4d4d;
						img {
							vertical-align: middle;
							margin: 12/@w 15/@w 18/@w 37/@w;
							width: 46/@w;
							height: 45/@w;
						}
					}
					a {
						vertical-align: middle;
						img {
							vertical-align: middle;
							margin: 16/@w 37/@w 16/@w 35/@w;
							widows: 24px;
							height: 14px;
						}
					}
					.authenticated {
						font-family: Microsoft YaHei;
						font-size: 26/@w;
						color: #FC5605;
					}
				}
			}
		}
	}

	.bottomBtn {
		// position: fixed;
		// bottom: 0;
		margin-top: 100/@w;
		margin-bottom: 50/@w;
		width: 80%;
		margin-left: 10%;
		height: 80/@w;
		background-color: #FFA800;
		font-family: Microsoft YaHei;
		font-size: 32/@w;
		color: #FFFFFF;
		/*width: 100%;*/
		border-radius: 8/@w;
		z-index: 10000;
	}
	.disableClick{
		background-color: #BBBBBB;
	}

	// }
</style>
