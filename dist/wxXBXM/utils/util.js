function formatTime(unixtime) {
    var dateTime = new Date(parseInt(unixtime) * 1000)
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var now = new Date();
    var now_new = Date.parse(now.toDateString());  //typescript转换写法  
    var milliseconds = now_new - dateTime;
    var timeSpanStr = year + '.' + checkTime(month) + '.' + checkTime(day);
    // var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    return timeSpanStr;
} 
function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }

    let _lastTime = null

    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
module.exports = {
  formatTime: formatTime,
  throttle: throttle
}

/**
* 将距离格式化
* <1000m时 取整,没有小数点
* >1000m时 单位取km,一位小数点 
*/
function formatDistance(num) {
    　if (num < 1000) {
        　　return num.toFixed(0) + 'm';
    　} else if (num > 1000) {
        　　return (num / 1000).toFixed(1) + 'km';
    　}
}