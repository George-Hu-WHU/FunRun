// pages/indexTest/indexTest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [
    ],
    list:[],
    // 数据列表加载中
    listDataLoading: false,
    // 瀑布流加载中
    waterfallLoading: false,
    // 数据加载完毕
    loaded: false,
    id: 1,

    indicatorDots: true, //小点，根据图的数量自动增加小点
    autoplay: true, //是否自动轮播
    interval: 3000, //轮播组件间隔时间
    duration: 1000, //轮播组件滑动时间
    activeIndex: 0,
    previous_margin: "20rpx",
    next_margin: "20rpx",
    imageWidth: 0,
    imageHeight: 0
  },

  switchCard: function(e) {
    let current = e.detail.current;
    this.setData({ activeIndex: current });
  },

  imageSize: function(e){
    var that = this
    let $width = e.detail.width
    let $height = e.detail.height
    let ratio = $width/$height

    let viewHeight = 370
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
   this.update()
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

  // 加载更多
  loadMore() {
    // console.log('loadMore')
    let { list } = this.data
    let more = this.getMockData()
    list = [...list, ...more]
    this.setData({ list })
  },

  // 刷新新瀑布流
  update() {
    this.data.id = 1
    // 重置瀑布流组件
    this.setData({ loaded: false })
    this.selectComponent('#waterfall').reset()
    let list = this.getMockData()
    this.setData({ list })
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  onLoadingChange(e) {
    this.setData({
      waterfallLoading: e.detail
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
    this.update()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

    /**
   * 获取模拟数据
   */
  getMockData() {
    let { id, listDataLoading, loaded } = this.data
    if (listDataLoading || loaded) return []
    this.setData({ listDataLoading: true })
    let list = []
    const imgWidth = 300
    for (let i = 0; i < 10; i++) {
      let mockText = this.getMockText()
      let imgHeight = parseInt(Math.random() * 5 + 1) * 100
      list.push({
        id,
        text: mockText,
        imgUrl: `https://via.placeholder.com/${imgWidth}x${imgHeight}.jpeg/07c160/fff?text=${id}(${imgWidth}x${imgHeight})`,
        // imgUrl: `https://iph.href.lu/${imgWidth}x${imgHeight}?fg=ffffff&bg=07c160&text=我是图片${id}(${imgWidth}x${imgHeight})`,
        // imgUrl: `http://placekitten.com/${imgWidth}/${imgHeight}`,
      })
      this.data.id = ++id
    }
    this.setData({ listDataLoading: false })
    if (id > 30) {
      this.setData({ loaded: true })
    }
    return list
  },

  // 模拟不同长度文字
  getMockText() {
    const a = parseInt(Math.random() * 5 + 1) * 10
    const b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
    let c = "";
    for (let i = 0; a > i; i++) {
      let d = Math.random() * b.length
      d = Math.floor(d)
      c += b.charAt(d);
    }
    return c
  }
})