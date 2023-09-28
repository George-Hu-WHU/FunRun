// pages/plan.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: true,
    success: '',
    text:'161'
  },
  /**
   * 生命周期函数--监听页面加载
   */

   textareaInput(e){
     this.setData({
       textareaValue: e.detail.value
     })
   },

   formSubmit(e){
    console.log(this.data.textareaValue)
    return this.setData({
      modalShow: false,
      success:'上传成功'
    })
   },

  onLoad() {
     //由于this指向的是相对于wx:request()的当前对象，在request全局使用，
    //所以我们必须设置一个相对于当前对象的变量that，将this的值赋给that,
    //才可以在onloud()页面加载（当前对象）中正常运作函数
    let that = this
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

  onShow() {
    let that = this
    const db = wx.cloud.database()
    db.collection('questionaire_data').where({_openid:that.data.openid}).get().then(res =>{
      //获取成功，说明用户此前提交过问卷
      if (res.data.length != 0) {
        console.log('成功',res.data)
      } 
      //获取失败，说明此用户第一次提交问卷，需向数据库新增一条记录
      else {
        wx.showToast({
          title: '请完成全部选择',
          icon: 'loading',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})