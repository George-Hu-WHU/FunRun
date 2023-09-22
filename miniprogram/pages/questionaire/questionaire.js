// questionaire.js
var app = getApp()
app.globalData.openid
const { envList } = require('../../envList.js');


Page({
  data:{
    gender:"",
    age:"",
    kg:"",
    cm:"",
    healthy_condition:"",
    rate:"",
    object:"",
    experience:"",
    genders:[{val:"男"},{val:"女"}],
    ages:[{val:"18岁以下"},{val:"18~30岁"},{val:"30~45岁"},{val:"45岁以上"},],
    weight:[{val:"50kg以下"},{val:"50~60kg"},{val:"60~70kg"},{val:"70kg以上"},],
    hight:[{val:"160cm以下"},{val:"160~170cm"},{val:"170~180cm"},{val:"180cm以上"},],
    healthy_conditions:[{val:"健康状态良好"},{val:"健康状态轻微问题"},{val:"健康状态严重问题"}],
    runrate:[{val:"1次"},{val:"2次"},{val:"3次"},{val:"4次或更多"},],
    objects:[{val:"减肥"},{val:"提高耐力"},{val:"增强肌肉力量"},{val:"改善心肺健康"},{val:"其他"}],
    experiences:[{val:"完全没有经验"},{val:"有少量经验，但不常跑步"},{val:"经常跑步，有一定经验"},{val:"超级跑者，经验丰富"}],
  },
  
  formsubmit:function(e){
    this.setData({
      gender:e.detail.value.gender,
      age:e.detail.value.age,
      kg:e.detail.value.kg,
      cm:e.detail.value.cm,
      healthy_condition:e.detail.value.healthy_condition,
      rate:e.detail.value.rate,
      object:e.detail.value.object,
      experience:e.detail.value.experience
    })

    if (e.detail.value.gender.length == 0 || e.detail.value.age.length == 0 || e.detail.value.kg.length == 0 || e.detail.value.cm.length == 0 || e.detail.value.healthy_condition.length == 0 || e.detail.value.rate.length == 0 || e.detail.value.object.length == 0 || e.detail.value.experience.length == 0 ) {
      wx.showToast({
        title: '请完成全部选择',
        icon: 'loading',
        duration: 1000})
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }

      else{
        const db = wx.cloud.database()
        db.collection('questionaire_data').where({_openid:app.globalData.openid}).get({    
          success: formsubmit => {
            db.collection('questionaire_data').where({_openid:app.globalData.openid}).update({
              data: {
                gender:e.detail.value.gender,
                age:e.detail.value.age,
                kg:e.detail.value.kg,
                cm:e.detail.value.cm,
                healthy_condition:e.detail.value.healthy_condition,
                rate:e.detail.value.rate,
                object:e.detail.value.object,
                experience:e.detail.value.experience
                },
                success: formsubmit => {
                  wx.showToast({
                    title: '提交成功',
                    duration: 1000
                  })
                  console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '提交失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
            })
          },
          fail: formsubmit => {
            db.collection('questionaire_data').add({
              data: {
                gender:e.detail.value.gender,
                age:e.detail.value.age,
                kg:e.detail.value.kg,
                cm:e.detail.value.cm,
                healthy_condition:e.detail.value.healthy_condition,
                rate:e.detail.value.rate,
                object:e.detail.value.object,
                experience:e.detail.value.experience
              },
              success: formsubmit => {
                wx.showToast({
                  title: '提交成功',
                  duration: 1000
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '提交失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
              })
          }
        })
      }
  },


  formreset:function(e){
  this.setData({
    gender:"",
    age:"",
    kg:"",
    cm:"",
    healthy_condition:"",
    rate:"",
    object:"",
    experience:"",
  })
  }
  })