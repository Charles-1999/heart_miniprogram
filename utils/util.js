function formatTimeStamp(timeStamp) {
  let arrTimestamp = (timeStamp + '').split('') // 拆分成每一个数字
  for(let i = 0; i < 13; i++) {
    if(!arrTimestamp[i])  arrTimestamp[i] = '0'
  }
  return Number(arrTimestamp.join(''))
}

const formatTime = (timeStamp, format='Y-M-D h:m:s') => {
  var timeStamp = formatTimeStamp(new Date(timeStamp).getTime())
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(timeStamp);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  format = format.replace('/', '-');
  format = format.replace('/', '-');
  return format;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime
}
