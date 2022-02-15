// pages/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: ""
  },

  // onGotUserInfo: function (e) {
  //   var obj = this;
  //   var userband = wx.getStorageSync('userband');// 从本地缓存中同步获取指定 key 的内容
  //   if (!userband) {
  //     var userinfo = e.detail.userInfo;// 微信自己内部的请求,e就是这个请求的返回值
  //     app.globalData.userInfo = userinfo;//全局对象userInfo
  //     obj.setData({
  //       userimg: userinfo.avatarUrl,//赋值用户头像
  //       nickname: userinfo.nickName//用户昵称
  //     })
  //     wx.request({
  //       url: '/mbook/userband?openid=' + app.globalData.openid,
  //       data: userinfo,
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         console.log(res);
  //         wx.setStorageSync('userband', true);//将数据存储在本地缓存中指定的 key 
  //       }
  //     })
  //   }
  // },

  bindGetUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})