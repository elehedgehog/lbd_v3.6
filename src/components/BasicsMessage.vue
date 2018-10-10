<template>
  <div>
    <mt-header title="基本信息认证" class="lbd-head-normal">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div class="mui-content" id="content">
			<div class="infoMsg">该信息将作为您的实名凭证,请确保真实</div>
		</div>
		<div class="inputList">
			<div class="item">
				<label>本人姓名</label>
				<input placeholder="请输入姓名" id="PersonName" type="text" v-model="PersonName">
			</div>
			<div class="item">
				<label>本人身份证号码</label>
				<input placeholder="请输入" id="IdCardNum" type="text" v-model="IdCardNum">
			</div>
			<div class="item quota">
				<label>可接受最高还款额度(元)</label>
				<input placeholder="请填写" id="quota" type="text" v-model="quota">
			</div>
			<div class="item">
				<label>教育程度</label>
				<select class="selected" id="education" v-model="education">
					<option value="">请选择</option>
					<option value="高中以下">高中以下</option>
					<option value="大专">大专</option>
					<option value="本科">本科</option>
					<option value="研究生以上">研究生以上</option>
				</select>
				<img src="../assets/img/fdddds@2x.png"/>
			</div>
		</div>
		<div class="submitBtn" ><button id="submitBtn" @click="checkIpnut();" class="submitBtn-text">确认</button></div>
  </div>
</template>
<script>

  import { Toast } from 'mint-ui';
  import { mobileManager } from '../utils/WebInfo.js'
  export default {
      data(){
        return{
          PersonName: '',
          IdCardNum: '',
          quota: '',
          education: '',
        }
      },
      mounted(){
        mobileManager.hideBottomBar()   //隐藏原生底部栏

      },
       methods:{
          back(){
          this.$router.goBack()
          },
          showToast:function(msg){
            Toast({
              message: msg,
              position: 'bottom',
              duration: 3000
            });
          },
          checkIpnut(){
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(!this.PersonName){
              this.showToast('请输入姓名');
            }else if(!this.IdCardNum){
              this.showToast('请输入身份证号码');
            }else if(reg.test(this.IdCardNum) === false){
             this.showToast('身份证格式有误');
            }else if(!this.quota){
              this.showToast('请输入最高还款额度');
            }else if(parseInt(this.quota) <=0 || isNaN(parseInt(this.quota))){
              this.showToast('还款额度输入有误');
            }else if(!this.education){
              this.showToast('请选择学历');
            }else{
            //此处调接口
            //(点击提交按钮设置按钮为不能点击状态)
            mui('#submitBtn')[0].setAttribute("disabled", false);
            //服务器返回提交不成功时设置按钮为可点击状态
            mui('#submitBtn')[0].removeAttribute("disabled");
            }
          }
       }
  }

</script>
<style lang="less" scoped>
  @w:75rem;
  .mui-bar{
    background-color: #FFFFFF !important;
  }
  .infoMsg{
    width: 100%;
    height: 80/@w;
    font-size: 30/@w;
    color: #FFFFFF;
    line-height: 80/@w;
    text-align: center;
    background: #FBC205;
    box-shadow: 1px 1px 10px #ccc;
  }

  .inputList{
    font-size: 32/@w;
    color: #646464;
    background: #FFFFFF;
    margin-top: 10/@w;
  }
  .inputList>.item{
    position: relative;
    width: 100%;
    height: 120/@w;
    line-height: 120/@w;
    border-bottom: 1px solid #F3F3F3;
  }
  .inputList>.item>label{
      display: inline-block;
      margin-left: 30/@w;

  }
  .inputList{
    input{
    float: right;
    width: 60%;
    height: 80/@w;
    line-height: 35/@w;
    padding-left: 0 !important;
    padding-right: 40/@w !important;
    font-size: 32/@w;
    color: #b0b0b0;
    margin-top: 20/@w;
    margin-bottom: 0;
    border: none;
    outline: none;
    text-align: right;
    }
  }
  .quota>input{
    width: 45%;
  }

  .item>.selected{
    float: right;
    width: 40%;
    font-size: 32/@w;
    height: 100%;
    // line-height: 35 !important;
    margin-bottom: 0 !important;
    padding-right: 0 !important;
    margin-right: 85/@w;
    margin-top: 0 !important;
    direction: rtl;
    /*padding: 0 0 0 20px;*/
  }
  .item>.selected>option{
    padding: 0 auto;
  }

  .item{
    select {
      border: 0!important;
      background-color: #fff;
      color: #646464;
      align-items: center;
      white-space: pre;
      // -webkit-rtl-ordering: logical;
      // color: black;
      // background-color: white;
      // cursor: default;
      -moz-appearance: none;
      -webkit-appearance:none;
      appearance:none;

      }

    img{
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -10/@w;
      width: 20/@w;
      height: 36/@w;
      margin-right: 50/@w;
    }
  }
  .submitBtn{
    background-color: #FFFFFF;
    width: 100%;
    padding-top:80/@w;
    margin-bottom: 10/@w;
  }
  .submitBtn-text{
    display: block;
    height: 80/@w;
    width: 80%;
    font-size: 32/@w;
    margin: 0 auto;
    text-align: center;
    line-height: 80/@w;
    background-color: #FBC205;
    border-radius: 30/@w;
    border: none;

  }
  .submitBtn>button{
    padding: 0 0 !important;
  }
  .Router{
    background-color: #fff;
  }

</style>
