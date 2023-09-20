// pages/indexTest/indexTest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [

    ],
    indicatorDots: true, //小点，根据图的数量自动增加小点
    autoplay: true, //是否自动轮播
    interval: 3000, //轮播组件间隔时间
    duration: 1000, //轮播组件滑动时间
    activeIndex: 0,
    previous_margin: "50rpx",
    next_margin: "50rpx",
    imageWidth: 0,
    imageHeight: 0
  },

  switchCard: function(e) {
    let current = e.detail.current;
    this.setData({ activeIndex: current });
  },

  imageSize: function(e){
    var that = this
    let $width = e.detail.$width
    let $height = e.detail.$height
    let ratio = $width/$height

    let viewHeight = 211
    let viewWidth = viewHeight*ratio
    that.setData({
      imageWidth: viewWidth,
      imageHeight: viewHeight
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   wx.showLoading({
     title: '加载中....',
   })
   this.loadRotateImage()
  },

  loadRotateImage: function(){
    let tmp = [
      "https://th.bing.com/th/id/R.72775cc8aa917dbd5e4353ddf43b7835?rik=n0Bswvn%2fdxB%2f4g&riu=http%3a%2f%2fpic.ntimg.cn%2ffile%2f20190911%2f10779984_143401754081_2.jpg&ehk=%2bvmQc5NpTSx%2ffaIejhiRbuHQWct7iVp2jj7jh22RMfY%3d&risl=&pid=ImgRaw&r=0",
      "https://img.alicdn.com/imgextra/i4/262595263/O1CN01mIUFEt1okV5yIITnt_!!262595263.jpg",
      "https://img.51miz.com/Element/00/59/58/36/3a13070c_E595836_ae870f0e.jpg"
    ]
    this.setData({
      imageUrls: tmp
    })
    wx.hideLoading()

    // 创建数据库后请求数据
    // var that = this
    // wx.request({
    //   url: tmp,
    //   data: {},
    //   header:{
    //     'contenet-type': 'application/json'
    //   },
    //   success(res){
    //     console.log(res.data)
    //     that.setData({
    //       imageUrls: res.data
    //     })
    //     wx.hideLoading()
    //   }
    // })
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