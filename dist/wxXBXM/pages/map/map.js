//logs.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var util = require('../../utils/util.js')
var qqmapsdk;
Page({
    data: {
       
        resData: [],
        latitude: 0,//纬度 
        longitude: 0,//经度 
        speed: 0,//速度 
        accuracy: 16,//位置精准度 
        markers: [],
        covers: [], 
        scale:12,
        circles: []
    },

    onLoad: function () {
        qqmapsdk = new QQMapWX({
            key: 'X2FBZ-375WQ-L4D5V-GMX4E-FPRHZ-QZB2O'
        });
        var _this = this;
        

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy

                var markers = [
                    {
                        id: "我的位置",
                        latitude: latitude,
                        longitude: longitude,
                        width: 30,
                        height: 30,
                        iconPath: "/assests/images/my.png",
                        title: "我的位置"
                    }, {
                        id: "华阳",
                        latitude: '30.467485',
                        longitude: '104.181844',
                        // width: 50,
                        // height: 50,
                        // iconPath: "/assests/imgs/my.png",
                        title: "华阳2"
                    }, {
                        id: "龙泉",
                        latitude: '30.567485',
                        longitude: '104.181844',
                        // width: 50,
                        // height: 50,
                        // iconPath: "/assests/imgs/my.png",
                        title: "龙泉2"
                    },
                ]

                // console.log("latitude:" + latitude)
                // console.log("longitude:" + longitude)
                // console.log("speed:" + speed)
                // console.log("accuracy:" + accuracy)
               
                // wx.openLocation({
                //     latitude: latitude,
                //     longitude: longitude,
                //     scale: 28,
                //     complete:function(res){
                //         console.log(res)
                //     }
                // })

                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: markers,
                    circles: [{
                        latitude: res.latitude,
                        longitude: res.longitude,
                        color: '#FF0000DD',
                        fillColor: '#7cb5ec88',
                        radius: 2600,
                        strokeWidth: 1
                    }]

                })
                
            } 
        }) 
        // _this.setData({
        //     longitude: 30.567485,
        //     latitude: 104.181844,
        //     markers: markers,
        //     covers: covers
        // }) 
        

    },

    onShow: function () {
        // 调用接口
        var _this = this;
        // qqmapsdk.search({   //关键字搜索
        //     keyword: '新博新美',
        //     address_format:'short',
        //     page_size: 20,
        //     success: function (res) {
        //         console.log(res);
        // 　　　　var resData = res.data;
        // 　　　　for (var i = 0; i < resData.length; i++) {
        //     　　　　　resData[i]._distance = formatDistance(resData[i]._distance);//转换一下距离的格式
        // 　　　　}
        //     _this.setData({ resData: resData });
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // });

        // qqmapsdk.reverseGeocoder({  //定位搜索
        //     location: {
        //         latitude: 39.984060,
        //         longitude: 116.307520
        //     },
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // });

        var h = getDistance(30.567485, 104.181844, 30.56767, 104.18063);

console.log(h/1000)

        // qqmapsdk.calculateDistance({
        //     mode: 'driving',//步行，驾车为'driving'
        //     to: [{
        //         latitude: 30.567485,
        //         longitude: 104.181844
        //     }, {
        //             latitude: 30.56767,
        //             longitude: 104.18063
        //     }],
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // });



    },
    markertap:function(e){
        console.log(e)
        wx.showActionSheet({
            itemList: [e.markerId],
            success: function (res) {
                console.log(res)
                if (res.tapIndex == 0){
                    wx.navigateTo({
                        url: '../index/index?addres=' + e.markerId,
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        }) 
    }




})

function formatDistance(num) {
    if (num < 1000) {
        return num.toFixed(0) + 'm';
    } else if (num > 1000) {
        return (num / 1000).toFixed(1) + 'km';
    }
}

function getDistance(lat1, lng1, lat2, lng2){
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

}