//app.js
App({
    onLaunch: function () { //全局触发一次
        var _this=this;
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
                    // 提示
                    // wx.showToast({
                    //     title: '成功',
                    //     icon:'success',
                    //     duration:2000,
                    //     mask:false,
                    //     success:function(e){
                    //         console.log(e)
                    //     }
                    // })


        // // 查看是否授权
        wx.getSetting({
            success: function (res) {
                // console.log(res)
                if (!res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            wx.getLocation();
                        }
                    })
                }
            }
        })


        if (!_this.globalData.third_session){
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: _this.globalData.ip + 'customer/code2openid',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: { code: res.code},
                            success: function (e) {
                                _this.globalData.third_session = e.data.data.third_session;
                                _this.globalData.isRegisted = e.data.data.isRegisted;

                            }
                        })
                        // _this.code2openid(res.code, wx.getStorageSync('gTicket'))
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            }); 
        }


    },
    globalData: {
        userInfo: null,
        code:'',
        // ip:'https://trade.uselect.com.cn/youxuan-coupon/',
        ip:'http://tang920411.w3.luyouxia.net/',
        // ip:'http://tianjunfeng.w3.luyouxia.net/',
        // ip:'https://pro.uselect.com.cn/youxuan-coupon/',
        third_session:'',   //识别用户opendip
        isRegisted:false,   //有没有登录那个接口
    },
    onNetworkStatusChange:function(){
        wx.onNetworkStatusChange(function (res) {
            if (res.networkType == "none") {
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none',
                    duration: 3000,
                    success: function (e) {
                    }
                })
            }
        })
    },
    code2openid: function (code, gTicket){ //op登录状态码
        var _this=this;
        wx.request({
            url: _this.globalData.ip + 'customer/code2openid',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { code: code},
            success: function (e) {
                console.log(e)
                _this.globalData.third_session = e.data.data.third_session;
                console.log(_this.globalData.third_session)
                _this.globalData.isRegisted = e.data.data.isRegisted;
                // wx.showToast({
                //     title: 'session过期，请重试',
                //     icon: 'none',
                //     duration: 2000,
                //     mask: false,
                //     success: function (e) {
                        
                //     }
                // })
            }
        })
    },
    wxlogin:function(fun){   //失效重登
        var _this=this;
        wx.request({
            url: _this.globalData.ip + 'customer/wxlogin',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { thirdSession: _this.globalData.third_session },
            success: function (e) {
                if (!e.data.errCode){
                    var gTicket = e.data.data.gTicket;
                    wx.setStorageSync('gTicket', gTicket);
                    // wx.showToast({
                    //     title: 'gTicket失效！请重试',
                    //     icon: 'none',
                    //     duration: 2000,
                    //     mask: false,
                    //     success: function (e) {

                    //     }
                    // })
                } else if (e.data.errCode==102){
                    wx.login({
                        success: function (res) {
                            if (res.code) {
                                _this.code2openid(res.code, wx.getStorageSync('gTicket'))
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                    }); 
                }
                
            }
        })
    },
    gTicketLogin(){
        wx.navigateTo({
            url: '../login/login'
        })
    },
    formatDate:function (now) {
        var year= now.getYear();
        var month= now.getMonth() + 1;
        var date= now.getDate();
        var hour= now.getHours();
        var minute= now.getMinutes();
        var second= now.getSeconds();
        return "20"+ year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
})