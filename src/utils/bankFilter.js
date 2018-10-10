let bankNameOfCode = {
  '中国银行':'BOC',
  '工商银行':'ICBC',
  '农业银行':'ABC',
  '建设银行':'CCB',
  '邮政储蓄银行':'PSBC',
  '中信银行':'CITIC',
  '光大银行':'CEB',
  '民生银行':'CMBC',
  '平安银行':'PAYH',
  '兴业银行':'CIB',
  '招商银行':'CMB',
  '广发银行':'CGB',
  '华夏银行':'HXB',
  '浦发银行':'SPDB',
  '北京银行':'BCCB',
  '上海银行':'SHBANK',
  '交通银行':'BOCM'
};
let bankCodeOfName = {
  'BOC': '中国银行',
  'ICBC':'工商银行',
  'ABC':'农业银行',
  'CCB':'建设银行',
  'PSBC':'邮政储蓄银行',
  'CITIC':'中信银行',
  'CEB':'光大银行',
  'CMBC':'民生银行',
  'PAYH':'平安银行',
  'CIB':'兴业银行',
  'CMB':'招商银行',
  'CGB':'广发银行',
  'HXB':'华夏银行',
  'SPDB':'浦发银行',
  'BCCB':'北京银行',
  'SHBANK':'上海银行',
  'BOCM':'交通银行'
};
function getBankNameOfCode(name){
  if(name && typeof name === 'string'){
    return bankNameOfCode[name]
  }
}
function getBankCodeOfName(code){
  if(code && typeof code === 'string'){
    return bankCodeOfName[code]
  }
}
function getBankCardLastCode(code){
  if(code && (typeof code === 'string' || typeof code === 'number')){
    code = code + '';
    return code.slice(-4);
  }
}
export {
  getBankNameOfCode,
  getBankCodeOfName,
  getBankCardLastCode
}
