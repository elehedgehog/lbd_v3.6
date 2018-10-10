import { webInfo } from './WebInfo.js'
import { mobileManager } from '../utils/WebInfo.js'
console.log( webInfo)

import {
  getBankNameOfCode,
  getBankCodeOfName,
  getBankCardLastCode
} from './bankFilter.js'

// let webInfo = webInfo
// let webInfo = {
// 	reqApplicationType : "webHtml",
// 	reqApplicationVersion : "1.0",
// 	osName : navigator.platform,
// 	osVersion : navigator.appName,
// 	appDownChannel : "web",
//   mobileModel : navigator.userAgent,
//   packageName: navigator.packageName,
//   versionName: navigator.versionName,
// };

// let host = "http://119.23.148.208:8084/appServer";//打包外侧 host+ip
// let host = "https://app.lbdfun.com/appServer";
let host = "/appServer";//本地测试
// let host = "http://120.25.200.154:8801/appServer";//本地测试


// let host = "http://192.168.1.165:8082/appServer"
export default{
	/**
	 * 返回host
	 * @return {[type]} [description]
	 */
  host,
  webInfo,

  /**
   * 银行名转代号
   * @param '农业银行'
   * @return 'ABC'
   */
  getBankNameOfCode,

  /**
   * 代号转银行名
   * @param 'ABC'
   * @return '农业银行'
   */
  getBankCodeOfName,

  /**
   * 返回银行卡后4位
   */
  getBankCardLastCode,

	/**
	 * 获取webinfo对象
	 * @return {[type]} [description]
	 */
	getWebInfoObj(){
		return webInfo;
	},

	/**
	 * 返回webinfo 的url字符串
	 * @return {[type]} [description]
	 */
	getWebInfoUrl(){
		let param = "";
		for(var key in webInfo){
			param += ("&"+key+'='+webInfo[key]);
		}
		return param;
	},


	/**
	 * 格式化日期
	 * @param  {[type]} _date [description]
	 * @return {[type]}       [description]
	 */
	fomatDate(_date){
		_date = _date.split(/[- : \/]/);
		if(_date && new Date(_date[0], _date[1]-1, _date[2], _date[3], _date[4], _date[5]) != "Invalid Date"){
		    var date = new Date(_date[0], _date[1]-1, _date[2], _date[3], _date[4], _date[5]);
		    return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
		}else{
			return "-";
		}
	}
}
