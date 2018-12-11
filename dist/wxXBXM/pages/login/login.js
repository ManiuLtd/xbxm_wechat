const app = getApp()

Page({
    data: {
        mobileShow:true,
        iphone:'',
        code:'',
        storeName:'',
        shopId: 1,
        supplierId: 1,
        user:''
    },

    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '登录'
        })
        var _this = this;
        // app.gTicketLogin();
        _this.setData({
            shopId: _this.options.shopId,
            supplierId: _this.options.supplierId,
            storeName: _this.options.storename,
            user: parseInt(_this.options.user)
        });
        console.log(_this.data.shopId)
        _this.text();
    },
    text:function(e){
        var _this=this;
        console.log('ss');

    },
    bindGetUserInfo: function (e) { //获取用户信息后的操作
        console.log(e.detail);

    },
    mobileLogin:function(e){    //跳转手机号登录
        var _this=this;
        if (_this.data.user){
            wx.navigateTo({
                url: '../mobileLogin/mobileLogin?shopId=' + _this.data.shopId + '&supplierId=' + _this.data.supplierId + '&storename=' + _this.data.storeName +'&user=1'
            })
        }else{
            wx.navigateTo({
                url: '../mobileLogin/mobileLogin?shopId=' + _this.data.shopId + '&supplierId=' + _this.data.supplierId + '&storename=' + _this.data.storeName + '&user=0'
            })
        }
        
    },
    getPhoneNumber:function (e) {  //获取手机号
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login'){
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: '未授权',
            success: function (res) { }
        })
        return
    }
    var _this=this;
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv
    wx.request({
        url: app.globalData.ip + 'customer/savePhoneNum',
        data: { thirdSession: app.globalData.third_session, encryptedData: encryptedData, iv: iv, gender: 1 },
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (e) {
            console.log(e.data)
            if (!e.data.errCode) {
                var gTicket = e.data.data.gTicket
                var mobile = e.data.data.mobile
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000,
                    mask: false,
                    success: function (e) {
                        wx.setStorageSync('gTicket', gTicket);
                        wx.setStorageSync('mobile', mobile);
                        if (_this.data.user) {
                            wx.reLaunch({
                                url: '../user/user'
                            })
                        } else {
                            wx.navigateTo({
                                url: '../pay/pay?shopId=' + _this.data.shopId + '&supplierId=' + _this.data.supplierId + '&storename=' + _this.data.storeName + '&shortcut=0' + '&oneLogin=1'
                            })
                        }

                        // wx.removeStorageSync('gTicket')
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
            } else if (e.data.errCode == 222) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '该手机号已绑定其他微信账号',
                    success: function (res) { }
                })
            } else if (e.data.errCode == 223) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '该微信账号已被其他手机号绑定',
                    success: function (res) { }
                })
            } else if (e.data.errCode == 224) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '获取手机号失败，请重新授权',
                    success: function (res) {
                        return
                    }
                })
            }else{
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '获取手机号失败，请重新授权',
                    success: function (res) {
                        return
                    }
                })
            }
        },
        fail: function (e) {
            wx.showModal({
                title: '提示',
                content: '请求错误',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    })

        

        
    },

})