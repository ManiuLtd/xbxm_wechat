//自动计算scale比例
var scale = 1 / (1242 / window.screen.width);
document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale='+scale+', minimum-scale='+scale+', maximum-scale='+scale+', user-scalable=no');
//获取页面传过来的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}

var api = 'https://trade.uselect.com.cn/youxuan-coupon/'
// var api = 'https://tianjunfeng.w3.luyouxia.net/'

$('.main').on('click','.submitLogin',function(){
    $.ajax({
        url:api+"webChatSubs/checkIn",
        type:"post",
        data:{mobile:$('.inputPhone').val(),checkNum:$('.inputCode').val()},
        success: function(data){
            if(!data.errCode){
                dialog('登录成功！');
                storage.gTicket=data.data.gTicket;
                $('.login').hide();
                $('.getCoupon').show();
                $('body').css('background','#FF7623');
            }else{
                dialog('短信验证码错误',1);
            }
        }
    })
})



function dialog(text,imgFla,hideFla){
    if(imgFla){
        $('.message img').hide();
        $('.message .text').css({'height':'200px','line-height':'200px'});
    }else{
        $('.message img').show();
    }
    $('.message').show().find('.text').text(text);
    if(!hideFla){
      setTimeout(function(){
          $('.message').hide().find('.text').text('');
      },3000)
    }

}

function checkTime(i){
    if(i<10){
        i = "0" + i;
    }
    return i;
}
function codeCountDown(currentTime){
    var _this=this;
    interval=setInterval(function(){
        currentTime--;
        $('.codeBtn').text('重新获取('+currentTime+')秒').attr('disabled',true)

        if (currentTime<=0){
            clearInterval(interval);
            $('.codeBtn').text('重新获取').attr('disabled',false)
        }
    },1000)
}
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
