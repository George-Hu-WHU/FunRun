const app = getApp()

var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
//stoprun
var totalSecond  = 0;
var oriMeters = 0.0;
var data=0;
var dbweightData = "";//数据库中string类型的体重范围
var weightData = 0; // 提取的weight数据  

const windowHeight = wx.getSystemInfoSync().windowHeight
var point = [];
var that2;

//绘制线
function drawline() {
  that2.setData({
    polyline: [{
      points: point,
      colorList: "#297245",
      width: 4,
      dottedLine: false
    }]
  });
}

//new
function getalocation() {
  var lat, lng;
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      lat = res.latitude;
      lng = res.longitude;
      point.push({
        latitude: lat,
        longitude: lng
      });
      console.log(point);
    }
  });
}



/* 毫秒级倒计时 */
function count_down(that) {

  if (starRun == 0) {
    // that.updateTime("0:00:00");
    return;

  }

  if (countTooGetLocation >= 100) {
    var time = date_format(total_micro_second);
    that.updateTime(time);
  }

  if (countTooGetLocation >= 5000) { //1000为1s
    that.getLocation();
    countTooGetLocation = 0;
  }


  setTimeout
  setTimeout(function () {
    countTooGetLocation += 10;
    total_micro_second += 10;
    count_down(that);
  }, 10)
}


// 时间格式化输出，记录跑步需要的时间，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;


  return hr + ":" + min + ":" + sec + " "; //返回时间
}

//计算对应的跑步里程
function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) {
    return d * Math.PI / 180;
  }
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}


//****************************************************************************************
//****************************************************************************************


const db = wx.cloud.database()
Page({
  data: {
    clock: '',
    isLocation: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    meters: 0.00,
    time: "0:00:00",
    dataObj: 0,
    polyline: [],
    weight: 20,
    defaultAnchors: [200, windowHeight * 0.5],
    isRunning: false,
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    isLongpress: 0,
    percentValue: 100
  },

  // getDate(){
  //   db.collection("test1").doc("962d008f650abb270339debe0dc2a3b1").get({
  //   success:res=>{
  //     console.log(res)
  //     this.setData(
  //       {dataObj:res.data
  //       }
  //     )
  //   }
  // })},

  //****************************
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that2 = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that2.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      }
    });
    this.getLocation()
    console.log("onLoad")
    count_down(this);
  },

  onshow: function (res) {
    const db = wx.cloud.database()
    db.collection('questionaire_data').where({
      _openid: app.globalData.openid
    }).get({
      success: function (res) {
        dbweightData = res.data[0].kg;
        console.log('获取成功');
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '请先完成调查问卷'
        })
      }
    })

    if (dbweightData == "40kg以下") {
      weightData = 30;
    } else if (dbweightData == "40~60kg") {
      weightData = 50;
    } else if (dbweightData == "60~80kg") {
      weightData = 70;
    } else {
      weightData = 90;
    }
  },


  //****************************
  openLocation: function () {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          scale: 28, // 缩放比例
        })
      },
    })
  },


  //****************************
  starRun: function () {
    //当点击开始之后再次点击开始
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);
    this.getLocation();

    this.timer = setInterval(repeat, 1000);

    function repeat() {
      console.log('re');
      getalocation();
      drawline();
    }
    this.setData({
      isRunning: 1
    })
  },


  //****************************
  stopRun: function () {
    starRun = 0
    count_down(this);

    console.log('end');
    clearInterval(this.timer);
    this.setData({
      isRunning: 0
    })
  },





  //结束按钮
  stop: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认结束运动？',
      success: function (res) {
        if (res.confirm) {
          starRun = 0;
          total_micro_second = 0 //时间控件
          oriMeters = 0.0 //距离控件
          point = []; //轨迹控件

          that.setData({
            polyline: [],
            meters: " 0.00",
            time: "0:00:00",
            markers: [],
            covers: [],
            isLocation: false,
            latitude: 0,
            longitude: 0,
            timer: 0,
            isRunning: 0,
            isLongpress: 0
            })
          that.updateTime(0)
        }else{
        }
      }
    })
    clearInterval(this.timer);
    this.setData({
      isRunning:0
    })
  },
//****************************
  updateTime:function (time) {

    var data = this.data;
    data.time = time;
    this.data = data;
    this.setData({
      time: time,
    })

  },


  //****************************
  getLocation: function () {
    var that = this
    wx.getLocation({

      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("res----------")
        console.log(res)

        //尝试




        //make datas 
        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
          //iconPath: '/resources/redPoint.png',
        };
        var oriCovers = that.data.covers;

        console.log("oriMeters----------")
        console.log(oriMeters);
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];

        console.log("oriCovers----------")
        console.log(oriCovers, len);

        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;

        if (newMeters < 0.0015) {
          newMeters = 0.0;
        } //距离小于1.5米，值设定并没有移动

        oriMeters = oriMeters + newMeters;
        console.log("newMeters----------")
        console.log(newMeters);


        var meters = new Number(oriMeters);
        // var dataObj=meter*this.data.weight*1.036;
        data= weightData+60*oriMeters*1.036;//卡路里的计算
        var date = new Number(data);
        var showMeters = meters.toFixed(2);
        var showc = date.toFixed(2);
        var showkase=meters.toFixed(2);
        oriCovers.push(newCover);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [],
          covers: oriCovers,
          meters:showMeters,
          dataObj:showc,
          
        });
      },
    })
  },

  onHeightChange(e) {
    // console.log('onHeightChange', e.detail)
    const {
      height,
      maxHeight
    } = e.detail
    const ratio = height / maxHeight
    this.setData({
      height: '100%',
      backgroundImage: `linear-gradient(rgba(224,255,251,${ratio}),rgba(245,245,245, ${ratio}))`,
    })
  },

  onLocation(e) {
    // console.log('onLocation', e.target.dataset)
    const {
      geo
    } = e.target.dataset
    this.setData({
      geo,
    })
  },

  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
})
