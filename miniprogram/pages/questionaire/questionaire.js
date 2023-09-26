// questionaire.js
const {
  envList
} = require('../../envList.js');
let openid = '';


Page({
  data: {
    gender: "",
    age: "",
    kg: "",
    cm: "",
    healthy_condition: "",
    rate: "",
    object: "",
    experience: "",
    genders: [{
      val: "男"
    }, {
      val: "女"
    }],
    ages: [
      {name:"18岁以下", val: "18岁以下", checked: true},
      {name:"18~30岁", val: "18~30岁"},
      {name:"30~45岁", val: "30~45岁"},
      {name:"45岁以上", val: "45岁以上"}
    ],
    weight: [{
      val: "40kg以下"
    }, {
      val: "40~60kg"
    }, {
      val: "60~80kg"
    }, {
      val: "80kg以上"
    }, ],
    hight: [{
      val: "160cm以下"
    }, {
      val: "160~170cm"
    }, {
      val: "170~180cm"
    }, {
      val: "180cm以上"
    }, ],
    healthy_conditions: [{
      val: "健康状态良好"
    }, {
      val: "健康状态轻微问题"
    }, {
      val: "健康状态严重问题"
    }],
    runrate: [{
      val: "1次"
    }, {
      val: "2次"
    }, {
      val: "3次"
    }, {
      val: "4次或更多"
    }, ],
    objects: [{
      val: "减肥"
    }, {
      val: "提高耐力"
    }, {
      val: "增强肌肉力量"
    }, {
      val: "改善心肺健康"
    }, {
      val: "其他"
    }],
    experiences: [{
      val: "完全没有经验"
    }, {
      val: "有少量经验，但不常跑步"
    }, {
      val: "经常跑步，有一定经验"
    }, {
      val: "超级跑者，经验丰富"
    }],
  },

  //调用云函数获取openid
  onLoad() {
    //由于this指向的是相对于wx:request()的当前对象，在request全局使用，
    //所以我们必须设置一个相对于当前对象的变量that，将this的值赋给that,
    //才可以在onloud()页面加载（当前对象）中正常运作函数
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 云函数获取结果
      success: function (res) {
        console.log("云函数调用成功！", res)
        //利用相对于当前对象的that抓取数据
        that.setData({
          openid: res.result.openid
        })
      },
      fail: function (error) {
        console.log("云函数调用失败！", error)
      },
    })
  },

  //问卷结果上传数据库
  formsubmit: function (e) {
    this.setData({
      gender: e.detail.value.gender,
      age: e.detail.value.age,
      kg: e.detail.value.kg,
      cm: e.detail.value.cm,
      healthy_condition: e.detail.value.healthy_condition,
      rate: e.detail.value.rate,
      object: e.detail.value.object,
      experience: e.detail.value.experience
    })
    const db = wx.cloud.database()
    //数据存在未选择项，不许提交
    if (e.detail.value.gender.length == 0 || e.detail.value.age.length == 0 || e.detail.value.kg.length == 0 || e.detail.value.cm.length == 0 || e.detail.value.healthy_condition.length == 0 || e.detail.value.rate.length == 0 || e.detail.value.object.length == 0 || e.detail.value.experience.length == 0) {
      wx.showToast({
        title: '请完成全部选择',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
    //准许提交
    else {
      db.collection('questionaire_data').where({
        _openid: openid
      }).get({
        //获取成功，说明用户此前提交过问卷，仅修改提交过的问卷即可 
        success(res) {
          db.collection('questionaire_data').where({
            _openid: openid
          }).update({
            data: {
              gender: e.detail.value.gender,
              age: e.detail.value.age,
              kg: e.detail.value.kg,
              cm: e.detail.value.cm,
              healthy_condition: e.detail.value.healthy_condition,
              rate: e.detail.value.rate,
              object: e.detail.value.object,
              experience: e.detail.value.experience
            },
            success: function (res) {
              wx.showToast({
                title: '提交成功',
                duration: 1000
              })
              console.log('请求成功', res)
            },
            fail(err) {
              wx.showToast({
                icon: 'none',
                title: '提交失败'
              })
              console.log('请求失败', res)
            }
          })
          console.log(res.data)
        },
        //获取失败，说明此用户第一次提交问卷，需向数据库新增一条记录
        fail(res) {
          db.collection('questionaire_data').add({
            data: {
              gender: e.detail.value.gender,
              age: e.detail.value.age,
              kg: e.detail.value.kg,
              cm: e.detail.value.cm,
              healthy_condition: e.detail.value.healthy_condition,
              rate: e.detail.value.rate,
              object: e.detail.value.object,
              experience: e.detail.value.experience
            },
            success(res) {
              wx.showToast({
                itle: '提交成功',
                duration: 1000
              })
              console.log('请求成功', res)
            },
            fail(err) {
              wx.showToast({
                icon: 'none',
                title: '提交失败'
              })
              console.log('请求失败', res)
            }
          })
        }
      })
    }
  },

  //页面重置
  formreset: function (e) {
    this.setData({
      gender: "",
      age: "",
      kg: "",
      cm: "",
      healthy_condition: "",
      rate: "",
      object: "",
      experience: "",
    })
  }

})