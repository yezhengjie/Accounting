// pages/budget/budget.js
var util = require('../../utils/util.js');
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    budget_remind: false,
    time_remind: util.formatOnlyTime(new Date()),
    // date: util.formatTime(new Date()),
    minHour: 1,
    maxHour: 23,
    show: false,
    budget:0,
    openid: '',
    budgetinfo: null,
    id: '',
    radio: '1',
    status:'hide'
  },


  onChange({ detail }) {
    if (detail == true) {
      this.setData({
        status: '',
      });
    }else{
      this.setData({
        status: 'hide',
      });
    }
    // 需要手动对 budget_remind 状态进行更新
    this.setData({ 
      budget_remind: detail,
    });
    console.log("预算是否提醒：" + detail)
    
  },

  
  onInput(event) {
    console.log('picker发送选择改变，携带值为', event.detail);
    this.setData({
      budget: event.detail
    });
  },

  onCancel(){
    this.setData({ 
      show: false,
      // time_remind: util.formatOnlyTime(new Date())
     });
  },

  // 确认时间
  onConfirm(event){
    console.log(event.detail);
    this.setData({
      time_remind: event.detail,
      show: false
    });
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var value = wx.getStorageSync('openid')
    if (value) {
      obj.setData({
        openid: value
      })
    } else {
      obj.setData({
        openid: app.getOpenid()
      })
    }
    var value = wx.getStorageSync('openid');
    db.collection("budget").where({
      _openid: value
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          budgetinfo: res.data[0],//返回的是一个数组，取第一个
          id: res.data[0]._id,
        })
        if (res.data[0].budget_remind == 'true'){
          this.setData({
            budget_remind:true,
            status:'',
            time_remind: res.data[0].time_remind
          })
        }
      }, fail: err => {
        console.log(err)
      }
    })

    var hour = String((new Date()).getHours());
    var minute = String((new Date()).getMinutes());

    if(hour.length <= 1){
      hour = '0'+hour;
    }
    if (minute.length <= 1) {
      minute = '0' + minute;
    }
    console.log(hour + ":" + minute)

    // const _ = db.command;
    const messages = db.collection('messages')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      .where({
        touser: value,
        done: false,
        // 提醒时间
        // item: _.in(['20:00', '22:00'])
        item: hour+":"+minute
      })
      .get();

      console.log(messages)

  },

  formSubmit: function (e) {
    
    // 参数
    var info = e.detail.value;
    // console.log(info);
    console.log('form发生了submit事件，携带数据为：', JSON.stringify(e.detail.value))
    console.log(info);
    
    if (info.id == '') {//用户第一次设置
      this.add(db, info)  //新增记录
    } else {
      this.update(db, info)  //修改记录
    }
    
  },


  //新增记录
  add: function (db, info) {
    db.collection("budget").add({
      data: {
        budget: Number(info.budget),
        budget_remind: info.budget_remind,
        time_remind: info.time_remind,
      }, success: res => {
        wx.showToast({//显示消息提示框
          title: '保存成功',
          icon: 'success',
        });
      }
    })
  },

  //更新记录
  update: function (db, info) {
    db.collection("budget").doc(info.id).update({
      data: {
        budget: Number(info.budget),
        budget_remind: info.budget_remind,
        time_remind:info.time_remind,
      }, success: res => {
        wx.showToast({//显示消息提示框
          title: '保存成功',
          icon: 'success',
        });
      }
    })
  },

  send: function (e) {
    // 获取预算信息
    console.log(e);
    const item = e.currentTarget.dataset.item;
    const remind = e.currentTarget.dataset.remind;
    //如果每日提醒开启，则告知用户是否允许发送消息
    if (remind){
      wx.requestSubscribeMessage({
        tmplIds: ['Xj5MpaNhJl_w7bllRMYVnJGNUwW0IeSloi_IuKxtKw8'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
        success(res) {
          if (res.errMsg == "requestSubscribeMessage:ok") {
            console.log("授权成功")
            // 这里将订阅的课程信息调用云函数存入云开发数据
            wx.cloud.callFunction({
              name: 'message',
              data: {
                item,
                data: {
                  time1: { value: item },
                  thing3: { value: "记得记账哦！" },
                },
                templateId: 'Xj5MpaNhJl_w7bllRMYVnJGNUwW0IeSloi_IuKxtKw8',
              },
            })
              .then(() => {
                wx.showToast({
                  title: '订阅成功',
                  icon: 'success',
                  duration: 2000,
                });
              })
              .catch((r) => {
                wx.showToast({
                  title: '订阅失败',
                  icon: 'success',
                  duration: 2000,
                });
              });
          }
          // let result = wx.cloud.callFunction({
          //   name: 'message' ,
          // })
          // console.log(result)

        }, fail: err => {
          console.log(err)
        }
      })
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