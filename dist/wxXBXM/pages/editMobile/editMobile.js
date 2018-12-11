const app = getApp()
var interval2 = null;
Page({
    data: {
        newFla:false,
        disabledCode: true,//验证按钮样式和是否禁用
        currentTime:60,
        codeText:'获取验证码',
        iphone: '',  //手机号
        code: '',    //验证码
        subimtFla: true
    },

    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '修改手机号'
        })
        var _this = this;
        console.log(wx.getStorageSync('gTicket'))
        if (!wx.getStorageSync('gTicket')) {    //判断用户有没有登录
            // wx.navigateTo({
            //     url: '../login/login?user=true'
            // })
        }
    },
    loginBtn: function (e) {   //手机号登录提交
        var _this = this;
        if (!_this.data.iphone) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '手机号不能为空',
                success: function (res) { }
            })
            return false;
        }
        if (!_this.data.code) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '验证码不能为空',
                success: function (res) { }
            })
            return false;
        }
        wx.request({
            url: app.globalData.ip + 'customer/changeXcxMobile',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { mobile: _this.data.iphone, checkNum: _this.data.code, gTicket: wx.getStorageSync('gTicket') || ''},
            success: function (e) {
                console.log(e)
                console.log(e.data.errCode)
                if (e.data.errCode == 0) {
                    // wx.setStorageSync('gTicket', e.data.data.gTicket);
                    wx.setStorageSync('gTicket', e.data.data.gTicket);
                    wx.setStorageSync('mobile', e.data.data.mobile);
                    wx.showToast({
                        title: '手机号更改成功!',
                        icon: 'success',
                        duration: 1000,
                        success: function (e) {
                            setTimeout(function(){
                                wx.reLaunch({
                                    url: '../user/user'
                                })
                            },2000)
                        }
                    })
                    
                } else if (e.data.errCode == 102) {
                    wx.login({
                        success: function (res) {
                            if (res.code) {
                                app.code2openid(res.code)
                                
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '手机号或验证码错误',
                        success: function (res) { }
                    })
                    return false;
                }

            }
        })

    },
    codeBtn:function(e){    //获取验证码
        console.log(e);
        var _this=this;
        _this.setData({
            disabledCode: true
        })
        wx.request({
            url: app.globalData.ip + 'customer/getCheckNum1',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { mobile: _this.data.iphone, thirdSession: app.globalData.third_session },
            success: function (e) {
                console.log(e)
                if (!e.data.errCode) {
                    wx.showToast({
                        title: '已发送',
                        icon: 'success',
                        duration: 2000,
                        success: function (e) {
                            
                        }
                    })
                    _this.countDown()
                    _this.setData({
                        subimtFla: false
                    })
                } else if (e.data.errCode == 222) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '该手机号已绑定其他微信账号',
                        success: function (res) {
                            _this.setData({
                                disabledCode: false
                            })
                         }
                    })
                }else if (e.data.errCode == 227) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '获取验证码频繁，请稍后再试',
                        success: function (res) {
                            _this.setData({
                                disabledCode: false
                            })
                        }
                    })
                }else if (e.data.errCode == 228) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '获取验证码超出今日限制，请改天再试',
                        success: function (res) {
                            _this.setData({
                                disabledCode: false
                            })
                        }
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '获取验证码失败，请重试！',
                        success: function (res) {
                            _this.setData({
                                disabledCode: false
                            })
                         }
                    })
                }

            }
        })
    },
    check: function (e) {  //验证手机号
        var phone = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
        var phoneFla = phone.exec(e.detail.value)
        if (phoneFla) {
            this.setData({
                disabledCode: false,
                subimtFla: false,
                iphone: e.detail.value
            })
        } else {
            this.setData({
                disabledCode: true,
                subimtFla: true
            })
        }
    },
    codeNumber: function (e) { //输入验证码失去焦点后
        var _this = this;
        _this.setData({
            code: e.detail.value
        })
    },
    countDown: function (e) {
        var _this = this;
        var currentTime = _this.data.currentTime;
        interval2 = setInterval(function () {
            currentTime--;
            console.log(currentTime)
            _this.setData({
                codeText: '重新获取(' + currentTime + ')秒',
                disabledCode: true
            })
            if (currentTime <= 0) {
                clearInterval(interval2);
                _this.setData({
                    currentTime: 60,
                    codeText: '重新获取',
                    disabledCode: false
                })
            }
        }, 1000)
    },
    returnBtn:function(e){
        wx.reLaunch({
            url: '../user/user'
        })
    }


})