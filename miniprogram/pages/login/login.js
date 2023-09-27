// pages/login/login.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
  },
  onChooseAvatar(e){
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  submitForm(e){
    const that = this
    this.setData({
      avatarName: e.detail.value.input
    })
    wx.cloud.uploadFile({
      cloudPath: 'avatarUrl/' + this.data.openid,
      filePath: this.data.avatarUrl
    }).then(res => {
      that.setData({
        fileid: res.fileID
      })
    })
    wx.cloud.callFunction({
      name: 'upload',
      data: {
        avatarName: this.data.avatarName,
        fileID: that.data.fileid
      },
    }).then(() => {
      wx.navigateTo({
        url: '/pages/mine/mine',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    const users = wx.cloud.database().collection('users')
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      that.setData({
        openid: res.result.openid
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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