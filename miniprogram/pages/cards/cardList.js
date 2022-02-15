// pages/cards/cardList.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var obj = this;
    // wx.request({
    //   url: app.globalData.apiurl + 'mbook/getlist', //仅为示例，并非真实的接口地址
    //   data: { user: app.globalData.openid },
    //   header: { 'content-type': 'application/json' },
    //   success: function (res) {
    //     console.log(res.data);
    //     obj.setData({
    //       list: res.data.message
    //     })
    //   }
    // });
    const db = wx.cloud.database();
    var value = wx.getStorageSync('openid');
    // console.log(value)
    db.collection("cards").where({
      _openid: value
    }).get({
      success:res=>{
        console.log(res)
        this.setData({
          list: res.data
        })
      },fail:err=>{
        console.log(err);
      }
    });
  },

  //添加账户
  addCard: function () {
    wx.navigateTo({
      url: '/pages/cards/cardItem'
    });
  },

  // 卡片详情
  carddetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/cards/addCard?id=' + e.currentTarget.dataset.id + "&carditem=" + e.currentTarget.dataset.carditem
    });
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画
    var obj = this;
    // wx.request({
    //   url: app.siteInfo.apiurl + 'mbook/getlist', //仅为示例，并非真实的接口地址
    //   data: { user: app.globalData.openid },
    //   header: { 'content-type': 'application/json' },
    //   success: function (res) {
    //     console.log(res.data);
    //     obj.setData({
    //       list: res.data.message
    //     });
    //     // 隐藏导航栏加载框  
    //     wx.hideNavigationBarLoading();
    //     // 停止下拉动作  
    //     wx.stopPullDownRefresh();
    //   }
    // });
    const db = wx.cloud.database();
    db.collection("cards").get({
      success: res => {
        this.setData({
          list: res.data
        })
      }, fail: err => {
        console.log(err);
      }
    });
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
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