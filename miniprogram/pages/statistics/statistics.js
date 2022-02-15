// pages/statistics/statistics.js
const CHARTS = require('../../utils/wxcharts.js'); // 引入wx-charts.js文件
var util = require('../../utils/util.js');
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearmonth: util.formatYearMonth(new Date),
    yearmonthstr: util.formatDate(new Date),
    flag:0  //是否有消费记录,1消费，0未消费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    console.log(obj.data)
    
    var value = wx.getStorageSync('openid');
    // console.log(obj.data.yearmonth)
    db.collection("bills").orderBy('money', 'desc').where({
      _openid: value,
      yearmonth: obj.data.yearmonth,
      type: "2"
    }).limit(4).get({
      success: res => {
        console.log(res);
        console.log(res.data);  
        if(res.data.length==0){
          this.setData({
            flag: 0
          })
        }else{
          this.setData({
            flag: 1
          })
          //动态获取数据
          var series = [];
          for (let i = 0; i < res.data.length; i++) {
            var _tempSeries = {};
            _tempSeries.data = res.data[i].money;
            _tempSeries.name = res.data[i].tag;
            series[i] = _tempSeries;
            console.log(series[i])
          }

          var pieChart = {
            animation: true,
            legend: false,
            canvasId: 'pieGraph', // canvas-id
            type: 'pie', // 图表类型，可选值为pie, line, column, area, ring
            series: series,
            width: 320,// 宽度，单位为px
            height: 300,// 高度，单位为px
            legend: true, // 是否显示图表下方各类别的标识
            dataLabel: true, // 是否在图表中显示数据内容值
          }
          new CHARTS(pieChart)
        }
        
      }, fail: err => {
        console.log(err);
      }
    });
  },

  // 选择日期
  sltyearmonth: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      yearmonth: util.formatYearMonth(new Date(e.detail.value))
    });
    this.onLoad();
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