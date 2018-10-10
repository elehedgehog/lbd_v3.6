import Vue from 'vue'
import Router from 'vue-router'
const MessageCenter = () => import('@/components/MessageCenter.vue')
const Order = () => import('@/components/Order.vue')
const QuickLoanIndex = () => import('@/components/QuickLoanIndex.vue')
const RepaymentDetail = () => import('@/components/RepaymentDetail.vue')
const AutoRepay = () => import('@/components/AutoRepay.vue')
const RepaymentOrderDetail = () => import('@/components/RepaymentOrderDetail.vue')
const OrderDetails = () => import('@/components/OrderDetails.vue')
const BankCard = () => import('@/components/BankCard.vue')
const BindSuccess = () => import('@/components/BindSuccess.vue')
const ManualPayments = () => import('@/components/ManualPayments.vue')
const BfManualPayments = () => import('@/components/BfManualPayments.vue')
const PaymentDetails = () => import('@/components/PaymentDetails.vue')
const ConfirmPayments = () => import('@/components/ConfirmPayments.vue')
const BasicsMessage = () => import('@/components/BasicsMessage.vue')
const ProductDetail = () => import('@/components/ProductDetail.vue')
const SelectBankCardA = () => import('@/components/SelectBankCardA.vue')
const UpdateBandCardInfo = () => import('@/components/UpdateBandCardInfo.vue')
const NoSenseBandCardA = () => import('@/components/NoSenseBandCardA.vue')
const ThirdBandCard = () => import('@/components/ThirdBandCard.vue')
const HomePageMiss = () => import('@/components/HomePageMiss.vue')
const TopSpeedAuthentication = () => import('@/components/TopSpeedAuthentication.vue')
const TopSpeedQuotaSupplyMessage = () => import('@/components/TopSpeedQuotaSupplyMessage.vue')
const LoanContract = () => import('@/components/LoanContract.vue')
const OperatorAuthorization = () => import('@/components/OperatorAuthorization.vue')
const UnionLoginAuthentication = () => import('@/components/UnionLoginAuthentication.vue')
const HomeWhiteListA = () => import('@/components/HomeWhiteListA.vue')
const BindCardConfirm = () => import('@/components/BindCardConfirm.vue')
const testPopup = () => import('@/components/testPopup.vue')
const Exhausting = () => import('@/components/exhausting.vue')
const VerifyCard = () => import('@/components/VerifyCard.vue')
Router.prototype.goBack = function (homeTabSelected) {
  homeTabSelected = homeTabSelected || ''
  this.isBack = true
  window.history.go(-1)
  sessionStorage.setItem('homeTabSelected', homeTabSelected )
}
Vue.use(Router)

let router = new Router({
  routes: [
      {  //首页未命中
        path: '/HomePageMiss',
        name: 'HomePageMiss',
        meta: {
          title: '借款'
        },
        component: HomePageMiss
      },
    {
      path: '/MessageCenter',
      name: 'MessageCenter',
      meta: {
        title: '消息中心'
      },
      component: MessageCenter
    },
    {
      path: '/HomeWhiteListA',
      name: 'HomeWhiteListA',
      meta: {
        title: 'A类白名单'
      },
      component: HomeWhiteListA
    },
    {
      path: '/BindCardConfirm',
      name: 'BindCardConfirm',
      meta: {
        title: '绑卡确认'
      },
      component: BindCardConfirm
    },
    {
      path: '/testPopup',
      name: 'testPopup',
      meta: {
        title: '绑卡确认'
      },
      component: testPopup
    },
    {
      path: '/Order',
      name: 'Order',
      meta: {
        title: '订单中心'
      },
      component: Order
    },
    {
      path: '/QuickLoanIndex',
      name: 'QuickLoanIndex',
      meta: {
        title: ''
      },
      component: QuickLoanIndex
    },
    {
      path: '/AutoRepay',
      name: 'AutoRepay',
      meta: {
        title: '自动代扣'
      },
      component: AutoRepay
    },
    {
      path: '/RepaymentDetail',
      name: 'RepaymentDetail',
      meta: {
        title: '还款详情'
      },
      component: RepaymentDetail
    },
    {
      path: '/RepaymentOrderDetail',
      name: 'RepaymentOrderDetail',
      meta: {
        title: '订单详情'
      },
      component: RepaymentOrderDetail
    },
      {
        path: '/OrderDetails',
        name: 'OrderDetails',
        meta: {
          title: '订单详情'
        },
        component: OrderDetails
      },
      {
        path: '/BankCard',
        name: 'BankCard',
        meta: {
          title: '绑定银行卡'
        },
        component: BankCard
      },
      {
        path: '/BindSuccess',
        name: 'BindSuccess',
        meta: {
          title: '绑卡结果'
        },
        component: BindSuccess
      },
      {     //确认还款
        path: '/ConfirmPayments',
        name: 'ConfirmPayments',
        meta: {
          title: '确认还款'
        },
        component: ConfirmPayments
      },
      {     //确认还款银行卡选择 融宝
        path: '/ManualPayments',
        name: 'ManualPayments',
        meta: {
          title: '确认还款'
        },
        component: ManualPayments
      },
      {     //确认还款银行卡选择   宝付
        path: '/BfManualPayments',
        name: 'BfManualPayments',
        meta: {
          title: '确认还款'
        },
        component: BfManualPayments
      },
      {     //还款信息详情页
        path: '/PaymentDetails',
        name: 'PaymentDetails',
        meta: {
          title: '还款详情'
        },
        component: PaymentDetails
      },
      {     //基本信息认证
        path: '/BasicsMessage',
        name: 'BasicsMessage',
        meta: {
          title: '基本信息认证'
        },
        component: BasicsMessage
      },
      {     //产品详情页
        path: '/ProductDetail',
        name: 'ProductDetail',
        meta: {
          title: '产品说明'
        },
        component: ProductDetail
      },
      {  //选择银行卡A类
        path: '/SelectBankCardA',
        name: 'SelectBankCardA',
        meta: {
          title: '选择银行卡'
        },
        component: SelectBankCardA
      },
      {  //页面进行绑卡
        path: '/UpdateBandCardInfo',
        name: 'UpdateBandCardInfo',
        meta: {
          title: '绑定银行卡'
        },
        component: UpdateBandCardInfo
      },
      {  //新增加银行卡页面、绑卡A类
        path: '/NoSenseBandCardA',
        name: 'NoSenseBandCardA',
        meta: {
          title: '绑定银行卡'
        },
        component: NoSenseBandCardA
      },
      {  //第三方绑卡
        path: '/ThirdBandCard',
        name: 'ThirdBandCard',
        meta: {
          title: '聚合开户'
        },
        component: ThirdBandCard
      },
      {
        path: '/TopSpeedAuthentication',
        name: 'TopSpeedAuthentication',
        meta: {
          title: '基础信息'  //(极速)
        },
        component: TopSpeedAuthentication
      },
      {
        path: '/TopSpeedQuotaSupplyMessage',
        name: 'TopSpeedQuotaSupplyMessage',
        meta: {
          title: '评估额度-补充信息'  //(极速)
        },
        component: TopSpeedQuotaSupplyMessage
      },
      {
        path: '/UnionLoginAuthentication',
        name: 'UnionLoginAuthentication',
        meta: {
          title: '实名认证'  //(联合登录)
        },
        component: UnionLoginAuthentication
      },
      { //借款合同
        path: '/LoanContract',
        name: 'LoanContract',
        meta: {
          title: '借款合同'
        },
        component: LoanContract
      },
      {
        path: '/OperatorAuthorization',
        name: 'OperatorAuthorization',
        meta: {
          title: '运营商认证中(过度页面)'
        },
        component: OperatorAuthorization
      },
      {
        path: '/Exhausting',
        name: 'Exhausting',
        meta: {
          title: ''
        },
        component: Exhausting
      },
      {  //验证银行卡
        path: '/VerifyCard',
        name: 'VerifyCard',
        meta: {
          title: '验证银行卡'
        },
        component: VerifyCard
      },

  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
