// questionaire.js

Page({
  data: {
    genders: [{
      val: "男"
    }, {
      val: "女"
    }],
    ages: [{
        val: "18岁以下",
      },
      {
        val: "18~30岁"
      },
      {
        val: "30~45岁"
      },
      {
        val: "45岁以上"
      }
    ],
    weight: [{
        val: "40kg以下"
      }, {
        val: "40~60kg"
      },
      {
        val: "60~80kg"
      }, {
        val: "80kg以上"
      },
    ],
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

  ratioChange(e) {
    this.setData({
      [e.currentTarget.id]: e.detail.value
    })
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
    const db = wx.cloud.database()
    const [age, cm, experience, gender, healthy_condition, kg, object, rate] = [this.data.age, this.data.cm, this.data.experience,
      this.data.gender, this.data.healthy_condition,
      this.data.kg, this.data.object, this.data.rate
    ]
    //数据存在未选择项，不许提交
    if (!(age || cm || experience || gender || healthy_condition || kg || object || rate)) {
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
      let openid = this.data.openid
      db.collection('questionaire_data').where({
        _openid: openid
      }).get().then(res => {
        //获取成功，说明用户此前提交过问卷，仅修改提交过的问卷即可
        if (res.data.length != 0) {
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
            fail: function (res) {
              wx.showToast({
                icon: 'none',
                title: '提交失败'
              })
              console.log('请求失败', res)
            }
          })
        } else {
          //获取失败，说明此用户第一次提交问卷，需向数据库新增一条记录
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
            success: function (res) {
              wx.showToast({
                itle: '提交成功',
                duration: 1000
              })
              console.log('请求成功', res)
            },
            fail: function (res) {
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
      gender: undefined,
      age: undefined,
      kg: undefined,
      cm: undefined,
      healthy_condition: undefined,
      rate: undefined,
      object: undefined,
      experience: undefined
    })
  }
})