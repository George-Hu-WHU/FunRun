// pages/mine/mine.js
const app = getApp()
const users = wx.cloud.database().collection('users')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBarList: app.globalData.tabBarList,
    // Todo: GetUserInfo
    avatarUrl: "../../asset/defaultUser.svg",
    userName: "点击头像登录用户 >"
  },
  login(e){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  tabChange(e) {
    app.tabChange(e);
  },
  bindchooseavatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl,
      userName: "欢迎来到FunRun乐跑 >"
    })
    this.selectComponent("userImage") && this.selectComponent("userImage").refresh()
    this.selectComponent("user") && this.selectComponent("user").refresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        let openid = res.result.openid
        users.where({
          _openid: openid
        }).get().then(res => {
          let length = res.data.length
          if (length !== 1) {
            users.add({
              data: {
                _openid: openid
              }
            }).then(res => {
              console.log(res)
            })
          }
        })
      }
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