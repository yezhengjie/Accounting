//获取应用实例
var util = require('../../utils/util.js');
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    list: {},
    yearmonth: util.formatYearMonth(new Date),
    yearmonthstr: util.formatDate(new Date),
    jieyu: 0,
    sumin: 0,
    sumout: 0,
    scrollHeight: 0,
    topHeight: 0,
    reload: "none",
    process: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面初始化");
    var obj = this;
    //获取系统信息。
    wx.getSystemInfo({
      success: function (res) {
        var _topHeight = res.windowHeight * 0.28;
        obj.setData({
          scrollHeight: res.windowHeight - _topHeight,
          topHeight: _topHeight,
        });
      }
    });

    if (app.getOpenid() != ""){
      obj.getPageRequset();
    }
  },

  // 加载数据
  getPageRequset: function () {
    var obj = this;
    console.log(obj.data)
    //初始化数据
    obj.setData({
      sumin: 0,
      sumout: 0,
      jieyu: 0
    })
    // 显示顶部刷新图标  
    // wx.showNavigationBarLoading();
    console.log("加载默认数据");
    var value = wx.getStorageSync('openid');
    // console.log(obj.data.yearmonth)
    db.collection("bills").orderBy('date', 'desc').where({
      _openid: value,
      yearmonth: obj.data.yearmonth,
    }).get({
      success: res => {
        console.log(res.data);
        if (res.data.length == 0) {
          obj.setData({
            reload: "block",
          });
        } else {
          for (var i = 0; i < res.data.length; ++i) {
            if(res.data[i].type == 2){
              obj.setData({
                sumout: obj.data.sumout + res.data[i].money,
              });
            }
            if (res.data[i].type == 1) {
              obj.setData({
                sumin: obj.data.sumin + res.data[i].money,
              });
            }
          }
          obj.setData({
            reload: "none",
            jieyu: obj.data.sumin-obj.data.sumout
          });
        }
        obj.setData({
          list: res.data,
        });
        console.log(list)
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();

      }, fail: err => {
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        obj.setData({
          reload: "block",
        });
        console.log(err);
      }
    });

    db.collection("budget").where({
      _openid: value
    }).get({
      success: res => {
        console.log(res)
        console.log(obj.data.sumout)
        obj.setData({
          process: (100*obj.data.sumout/(res.data[0].budget)).toFixed(0),
        })
      }, fail: err => {
        console.log(err)
      }
    })
  },

  // 选择日期
  sltyearmonth: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      yearmonth: util.formatYearMonth(new Date(e.detail.value))
    });
    this.getPageRequset();
  },

  // 添加
  addwater: function () {
    wx.navigateTo({
      url: '/pages/bill/addBill'
    });
  },

  // 详情
  waterdetail: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/bill/billDetail?id=' + e.currentTarget.dataset.id
    });
  },

  // 重新加载数据
  reloaddata: function (e) {
    var obj = this;
    if (app.globalData.openid != "") {
      obj.getPageRequset();
    } else {
      app.openidCallback = openid => {
        obj.getPageRequset();
      }
    }
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
  // onPullDownRefresh: function () {
  //   // 显示顶部刷新图标  
  //   wx.showNavigationBarLoading();
  //   console.log("下拉");
  //   var obj = this;
  //   obj.getPageRequset();
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var obj = this;
  //   this.setData({
  //     pageIndex: obj.data.pageIndex + 1
  //   });
  //   console.log(obj.data.pageIndex);
  // },

  //滚动到底部触发事件  
  searchScrollLower: function () {
    console.log("到底了!!!");
  },

  //滚动到顶部/左边，会触发 scrolltoupper 事件
  bindscrolltoupper: function () {
    // 显示顶部刷新图标  
    // wx.showNavigationBarLoading();
    console.log("滚动到顶部");
    var obj = this;
    obj.getPageRequset();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})