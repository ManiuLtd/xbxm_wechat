//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        marketid:60,
        marketUniqueCode:'1',
        address:'',//地址
        confirmData:{}, //缓存选择地址，确认后渲染
        myLatitude:'104.18058',//纬度
        myLongitude:'30.56933',//经度
        showAddress:false,//默认地址选择隐藏
        floorLists: [],//楼层
        tabSelect:0,//默认楼层选中
        defaultFla:false,  //缺省值
        pageNum:1,  //分页数
        pageText:'1楼',    //分页楼层文字
        pageCount:2,    //分页总数
        storeLists: [],  //临时缓存商店数据
        addressLists:[], //商场数据
        payBtnFla:false, //禁用
        httpFla:true //请求接口

    },
    onLoad: function () {
        this.position();
        app.onNetworkStatusChange();

        wx.removeStorageSync('gTicket');
    },
    scrollStore:function(e){    //滑动到底部加载下一页
        var _this=this;
        if (_this.data.pageNum <= _this.data.pageCount){
            _this.storeData(_this.data.marketid, _this.data.pageText, _this.data.pageNum)
        }
        
    },
    Confirm:function(e){    //商场选择后点击确认
        var _this = this;
        _this.setData({
            showAddress: false,
            address: _this.data.confirmData.address,
            marketid: _this.data.confirmData.marketid,
            marketUniqueCode: _this.data.confirmData.marketUniqueCode,
            storeLists: [],
            pageNum: 1
        })
        // _this.floorData(20)
        _this.floorData(_this.data.confirmData.marketid)

    },
    addressClick:function(e){   //商场地址选择
        var _this=this;
        var marketid = e.currentTarget.dataset.marketid;
        var marketUniqueCode = e.currentTarget.dataset.marketuniquecode;
        var index = e.currentTarget.dataset.index;
        var address = e.currentTarget.dataset.address;
        var data = { address: address, marketid: marketid, index: index, marketUniqueCode: marketUniqueCode}
        _this.setData({
            // confirmData: data,
            showAddress: false,
            address: address,
            marketid: marketid,
            marketUniqueCode: marketUniqueCode,
            confirmDataIndex: index,
            storeLists: [],
            pageNum: 1
        })
        _this.floorData(marketid)
    },
    floorClick:function(e){ //楼层选择
        var _this=this;
        var index = e.currentTarget.dataset.index;
        var pageText = e.currentTarget.dataset.pagetext;
        _this.setData({ //用于tab的赋值
            tabSelect: index,
            storeLists:[],
            pageNum:1,
            pageText: pageText
        })
        _this.storeData(_this.data.marketid, pageText, _this.data.pageNum);
        
    },
    call:function(e){   //打电话
        var _this=this;
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    payClick: util.throttle(function(e){
        console.log(e.detail.errMsg)
        if (e.detail.errMsg == 'getUserInfo:fail auth deny'){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未授权',
                success: function (res) { }
            })
            return
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        setTimeout(function(){
            wx.hideLoading()
        },15000)
        var storeName=e.target.dataset.name
        var supplierId = e.target.dataset.id;
        var e_this=e;
        wx.setStorageSync('userInfo', e_this.detail.userInfo)
        // wx.setStorageSync('gTicket', e.data.data.gTicket);
        var _this=this;
        wx.request({
            url: app.globalData.ip + 'customer/getUnionId',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { thirdSession: app.globalData.third_session, encryptedData: e.detail.encryptedData, iv: e.detail.iv },
            success: function (e) {
                wx.hideLoading()
                if (e.data.errCode == 0) {
                    if (wx.getStorageSync('gTicket')) {    //判断用户有没有登录
                        wx.navigateTo({
                            url: '../pay/pay?shopId=' + _this.data.marketUniqueCode + '&supplierId=' + e_this.target.dataset.id + '&storename=' + e_this.target.dataset.name + '&shortcut=0'
                        })
                        
                        return
                    } else {
                        wx.navigateTo({
                            url: '../login/login?shopId=' + _this.data.marketUniqueCode + '&supplierId=' + e_this.target.dataset.id + '&storename=' + e_this.target.dataset.name + '&user=0'
                        })
                        return
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
                }
            }
        })
        
 
    },3000),
    more: function (e) {   //弹出商场地址选择
        var _this = this;
        wx.request({
            url: app.globalData.ip + 'market/position',
            data: { type: 1, gTicket: wx.getStorageSync('gTicket') },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
                if (!e.data.errCode) {
                    var marketInfoList = e.data.data.marketInfoList;
                    _this.setData({
                        addressLists: marketInfoList
                    });
                } else if (e.data.errCode == 213) {
                    app.wxlogin();
                    // _this.position();
                }
            }
        })
        this.setData({
            showAddress:true
        })
    },
    close:function(e){
        this.setData({
            showAddress: false
        })
    },
    position: function () {//得到最近距离的门店
        var _this = this;
        var num = [];   
        wx.request({
            url: app.globalData.ip + 'market/position',
            data: { type: 1, gTicket: wx.getStorageSync('gTicket')},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
                if (!e.data.errCode) {
                    var marketInfoList = e.data.data.marketInfoList;
                    _this.setData({
                        addressLists: marketInfoList
                    });
                    // 获得最近商场
                    wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            _this.data.myLatitude = res.latitude;
                            _this.data.myLongitude = res.longitude;
                            _this.setData({
                                myLatitude: _this.data.myLatitude,
                                myLongitude: _this.data.myLongitude
                            })
                            for (var i = 0; i < marketInfoList.length; i++) {
                                var h = getDistance(_this.data.myLatitude.toString(), _this.data.myLongitude.toString(), marketInfoList[i].longtitude.toString(), marketInfoList[i].latitude.toString());
                                num.push(h);
                            }
                            // console.log(num)
                            var min = Math.min.apply(null, num);
                            var index = num.indexOf(min);
                            _this.setData({
                                address: marketInfoList[index].marketName,
                                confirmDataIndex: index,
                                marketid: marketInfoList[index].marketId,
                                marketUniqueCode: marketInfoList[index].marketUniqueCode
                            })

                            // 获取楼层，加载商户
                            _this.floorData(marketInfoList[index].marketId)

                        }, fail:function(res){
                            var index;
                            for (var i = 0; i < marketInfoList.length; i++) {
                                if (marketInfoList[i].marketName.indexOf("龙泉") > -1){
                                    index=i
                                }
                            }
                            _this.setData({
                                address: marketInfoList[index].marketName,
                                confirmData: { index: index },
                                marketid: marketInfoList[index].marketId,
                                marketUniqueCode: marketInfoList[index].marketUniqueCode
                            })

                            // 获取楼层，加载商户
                            _this.floorData(marketInfoList[index].marketId)
                        }
                    })
                } else if (e.data.errCode == 213) {
                    app.wxlogin();
                    // _this.position();
                }
            }
        })
    },
    storeData: function (marketId, floor, pageNum){ //封装商户调用
        var _this=this;
        if (_this.data.httpFla){
            _this.setData({
                httpFla:false
            })
            wx.request({
                url: app.globalData.ip + 'smallprogram/search/adopt/marketId',
                // data: { marketId: marketId, floor: '2楼', pageNum: pageNum, pageSize: 4 },
                data: { marketId: marketId, floor: floor, pageNum: pageNum, pageSize: 4 },
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (e) {
                    console.log(e.data)
                    console.log(_this.data.httpFla)
                    _this.setData({
                        httpFla: true
                    })
                    console.log(_this.data.httpFla)
                    if (!e.data.errCode) {
                        var info = e.data.data.info;
                        var storeLists = _this.data.storeLists.concat(info);
                        _this.setData({
                            pageNum: _this.data.pageNum + 1,
                            storeLists: storeLists,
                            pageCount: e.data.data.pageCount
                        })
                    } else if (e.data.errCode == 213) {
                        app.wxlogin();
                    }
                }
            })
        }

    },
    floorData: function (marketId){
        var _this = this;
        //获取这个商场的楼层
        wx.request({
            url: app.globalData.ip +'market/floor',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { marketId: marketId },
            // data: { marketId: marketInfoList[index].marketId },
            success: function (e) {
                if (!e.data.errCode) {
                    _this.setData({
                        floorLists: e.data.data.floors,
                        pageText:e.data.data.firstFloor,
                        tabSelect:0
                    });
                    //获取最近的商场地址后调用接口获取商场的商店数据 marketInfoList.marketId;
                    _this.storeData(_this.data.marketid, e.data.data.firstFloor, _this.data.pageNum);
                } else if (e.data.errCode == 213) {
                    app.wxlogin();
                }
            }
        })
    }

})


function Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function getDistance(lat1, lng1, lat2, lng2) {
    // console.log(lat1)
    // console.log(lng1)
    // console.log(lat2)
    // console.log(lng2)
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // 地球半径，千米;
    s = Math.round(s * 10000) / 10000; //输出为公里
    s = Math.round(s * 1000) / 1; //单位修改为米,取整
    //s=s.toFixed(4);
    return s;
}

// function getDistance(lat1, lng1, lat2, lng2) {
//     lat1 = lat1 || 0;
//     lng1 = lng1 || 0;
//     lat2 = lat2 || 0;
//     lng2 = lng2 || 0;
//     var rad1 = lat1 * Math.PI / 180.0;
//     var rad2 = lat2 * Math.PI / 180.0;
//     var a = rad1 - rad2;
//     var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
//     var r = 6378137;
//     return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

// }
