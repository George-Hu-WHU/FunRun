const app = getApp()
Page({
  data: {
    tabBarList: app.globalData.tabBarList
  },
  tabChange(e){
    app.tabChange(e);
  },
  tomap () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  },
})
