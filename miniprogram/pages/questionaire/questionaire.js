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

    genders: [
      {name:"男", val: "男"},
      {name:"女", val: "女"}
    ],

    ages: [
      {name:"18岁以下", val: "18岁以下"},
      {name:"18~30岁", val: "18~30岁"},
      {name:"30~45岁", val: "30~45岁"},
      {name:"45岁以上", val: "45岁以上"}
    ],

    weight: [
      {name:"40kg以下", val: "40kg以下"}, 
      {name:"40~60kg", val: "40~60kg"}, 
      {name:"60~80kg", val: "60~80kg"}, 
      {name:"80kg以上", val: "80kg以上"}
    ],

    hight: [
      {name:"160cm以下", val: "160cm以下"}, 
      {name:"160~170cm", val: "160~170cm"}, 
      {name:"170~180cm", val: "170~180cm"}, 
      {name:"180cm以上", val: "180cm以上"}
    ],

    healthy_conditions: [
      {name:"健康状态良好", val: "健康状态良好"}, 
      {name:"健康状态轻微问题", val: "健康状态轻微问题"}, 
      {name:"健康状态严重问题", val: "健康状态严重问题"}
    ],

    runrate: [
      {name:"1次", val: "1次"}, 
      {name:"2次", val: "2次"}, 
      {name:"3次", val: "3次"}, 
      {name:"4次或更多", val: "4次或更多"}
    ],

    objects: [
      {name:"减肥", val: "减肥"}, 
      {name:"提高耐力", val: "提高耐力"}, 
      {name:"增强肌肉力量", val: "增强肌肉力量"}, 
      {name:"改善心肺健康", val: "改善心肺健康"}, 
      {name:"其他", val: "其他"}
    ],

    experiences: [
      {name:"完全没有经验", val: "完全没有经验"}, 
      {name:"有少量经验，但不常跑步", val: "有少量经验，但不常跑步"}, 
      {name:"经常跑步，有一定经验", val: "经常跑步，有一定经验"}, 
      {name:"超级跑者，经验丰富", val: "超级跑者，经验丰富"}
    ],
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

  bindage: function (e) {
    const age = e.detail.value;
    this.setData({
      age : age,
    });
  },

  bindgender: function (e) {
    const gender = e.detail.value;
    this.setData({
      gender : gender,
    });
  },

  bindkg: function (e) {
    const kg = e.detail.value;
    this.setData({
      kg : kg,
    });
  },

  bindcm: function (e) {
    const cm = e.detail.value;
    this.setData({
      cm : cm,
    });
  },

  bindhealthy_condition: function (e) {
    const healthy_condition = e.detail.value;
    this.setData({
      healthy_condition : healthy_condition,
    });
  },

  bindrate: function (e) {
    const rate = e.detail.value;
    this.setData({
      rate : rate,
    });
  },

  bindobject: function (e) {
    const object = e.detail.value;
    this.setData({
      object : object,
    });
  },

  bindexperience: function (e) {
    const experience = e.detail.value;
    this.setData({
      experience : experience,
    });
  },

  //问卷结果上传数据库
  submitForm:function(){
    const gender = this.data.gender;
    const age = this.data.age;
    const kg = this.data.kg;
    const cm =  this.data.cm;
    const healthy_condition =  this.data.healthy_condition;
    const rate =  this.data.rate;
    const object = this.data.object;
    const experience = this.data.experience;

    const db = wx.cloud.database()
    //数据存在未选择项，不许提交
    if (gender.length == 0 || age.length == 0 || kg.length == 0 || cm.length == 0 || healthy_condition.length == 0 || rate.length == 0 || object.length == 0 || experience.length == 0) {
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
              gender: gender,
              age: age,
              kg: kg,
              cm: cm,
              healthy_condition: healthy_condition,
              rate: rate,
              object: object,
              experience: experience
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
              gender: gender,
              age: age,
              kg: kg,
              cm: cm,
              healthy_condition: healthy_condition,
              rate: rate,
              object: object,
              experience: experience
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
  formreset:function(e){
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