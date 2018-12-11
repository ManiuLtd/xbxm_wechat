const app = getApp()
var interval=null;
Page({
    data: {
        
        storeName: '',
        shopId: 1,
        supplierId: 1,
        iphone: '',  //手机号
        code: '',    //验证码
        disabledCode: true,//验证按钮样式和是否禁用
        codeText:'获取验证码',
        currentTime:60,
        user:'',
        subimtFla:true
    },

    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '手机号登录'
        })

        var _this = this;
        // app.gTicketLogin();
        console.log(_this.options.shopId)
        _this.setData({
            shopId: _this.options.shopId,
            supplierId: _this.options.supplierId,
            storeName: _this.options.storename,
            user: parseInt(_this.options.user)
        });
    },
    payBtn:function(){
        var _this=this;
        if (_this.data.user){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未选择商户',
                success: function (res) { }
            })
            return 
        }
        wx.navigateTo({
            url: '../pay/pay?shopId=' + _this.data.shopId + '&supplierId=' + _this.data.supplierId + '&storename=' + _this.data.storeName + '&shortcut=1' +'&oneLogin=1'
        })
    },
    check:function(e){  //验证手机号
        this.setData({
            iphone: e.detail.value
        })
        var phone = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
        var phoneFla = phone.exec(e.detail.value)
        if (phoneFla){
            this.setData({
                disabledCode:false,
                subimtFla: false
            })
        }else{
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
    codeBtn:function(e){   //获取验证码

        var _this=this;
        var fla=true;
        this.setData({
            disabledCode: true
        })
        wx.request({
            url: app.globalData.ip + 'customer/getCheckNum',
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
                    _this.countDown();
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
                    
                } else if (e.data.errCode == 227) {
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
                } else if (e.data.errCode == 228) {
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
                } else if (e.data.errCode == 223) {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '该微信账号已被其他手机号绑定',
                        success: function (res) { 
                            _this.setData({
                                disabledCode: false
                            })
                        }
                    })
                    
                } else {
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
    loginBtn:function(e){   //手机号登录提交
        var _this = this;
        if (!_this.data.iphone){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '手机号不能为空',
                success: function (res) { }
            })
            return false;
        }
        if (!_this.data.code){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '验证码不能为空',
                success: function (res) { }
            })
            return false;
        }
        wx.request({
            url: app.globalData.ip + 'customer/checkIn',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { mobile: _this.data.iphone, checkNum: _this.data.code, thirdSession: app.globalData.third_session },
            success: function (e) {
                console.log(e)
                if (!e.data.errCode) {
                    wx.setStorageSync('gTicket', e.data.data.gTicket);
                    wx.setStorageSync('mobile', e.data.data.mobile);
                    if (_this.data.user) {
                        wx.reLaunch({
                            url: '../user/user'
                        })
                    } else {
                        wx.navigateTo({
                            url: '../pay/pay?shopId=' + _this.data.shopId + '&supplierId=' + _this.data.supplierId + '&storename=' + _this.data.storeName + '&shortcut=0' + '&oneLogin=1'
                        })
                    }

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
                }else{
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
    countDown:function(e){
        var _this=this;
        var currentTime = _this.data.currentTime;
        interval=setInterval(function(){
            currentTime--;
            _this.setData({
                codeText: '重新获取('+currentTime+')秒',
                disabledCode:true
            })
            if (currentTime <= 0){
                clearInterval(interval);
                _this.setData({
                    currentTime:60,
                    codeText:'重新获取',
                    disabledCode:false
                })
            }
        },1000)
    }


})