//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        inputs: '微信',
        result: [],
        userInfo: {}
    },

    onLoad: function () {
        // var that = this
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo){
        //   //更新数据
        //   that.setData({
        //     userInfo:userInfo
        //   })
        // })
    },
    pay:function(e){
        
        wx.requestPayment({
            'timeStamp': '1499497335',
            'nonceStr': 'qqejagkybrh9rxmyfosze71qs49ppcub',
            'package': "prepay_id=wx2017070815022850d11adcb80558793405",
            'signType': "MD5",
            'paySign': "285BCE1F0B93701D927FA5F6CBE10E86",
            success: function (res) {
                console.log(res)
                // success
                wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
                    success: function (res) {
                        wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                        })
                    },
                    fail: function (e) {
                        // fail
                        console.log(e)
                    },
                    complete: function (e) {
                        // complete
                        console.log(e)
                    }
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    }
})
