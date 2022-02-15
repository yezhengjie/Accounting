// pages/bill/addBill.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _openid: '',
    nav_color1: 'nav-active',
    nav_color2: '',
    nav_item: 2,
    nav_icon: '',
    nav_name: '',
    tagid: 0,
    money: '',
    remark: '',
    iconbg: '',
    iconlist: {},
    date: util.formatDate(new Date),
    tag_action_id: 0,
    tag_action_color: "",
    id: '',//流水ID
    sumout: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var _model = options.model;
    if (_model == 1) { // 修改初始化数据
      var _mdetail = JSON.parse(options.mdetail);
      console.log(_mdetail);
      obj.setData({
        id: _mdetail._id,
        nav_item: _mdetail.type,
        nav_color1: _mdetail.type == 1 ? "" : "nav-active",
        nav_color2: _mdetail.type == 1 ? "nav-active" : "",
        money: _mdetail.money,
        remark: _mdetail.remark,
        // cardindex: _mdetail.cardindex
      });
    }

    try {
      var value = wx.getStorageSync('openid')
      if (value) {
        obj.setData({
          _openid: value
        })
      }else {
        obj.setData({
          _openid: app.getOpenid()
        })
      }
    } catch (e) {
      
    }

    var _iconlist = obj.data.nav_item == 2 ? wx.getStorageSync('iconlist_out') : wx.getStorageSync('iconlist_in');
    console.log(_iconlist);
    if (_iconlist) {
      console.log("icon cache get");
      if (_model == 1) { //修改默认数据
        obj.setData({
          iconlist: _iconlist,
          nav_icon: _mdetail.tagimg,
          nav_name: _mdetail.tag,
          tagid: _mdetail.tagid,
          tag_action_id: _mdetail.tagid,
          tag_action_color: _mdetail.iconbg,
        });
      } else {
        obj.setData({
          iconlist: _iconlist,
          nav_icon: _iconlist[0].icon,
          nav_name: _iconlist[0].name,
          tagid: _iconlist[0].id,
          tag_action_id: _iconlist[0].id,
          tag_action_color: _iconlist[0].iconcolor,
        });
      }
    } else {
      console.log("icon url get");
      //支出图标
      db.collection("iconlist_out").get({
        success: res => {
          console.log(res.data[0].RECORDS);
          if (_model == 1) { //修改默认数据
            obj.setData({
              iconlist: res.data[0].RECORDS,
              nav_icon: _mdetail.tagimg,
              nav_name: _mdetail.tag,
              tagid: _mdetail.tagid,
              tag_action_id: _mdetail.tagid,
              tag_action_color: _mdetail.tagbg,
            });
          } else {
            obj.setData({
              iconlist: res.data[0].RECORDS,
              nav_icon: res.data[0].RECORDS[0].icon,
              nav_name: res.data[0].RECORDS[0].name,
              tagid: res.data[0].RECORDS[0].id,
              tag_action_id: res.data[0].RECORDS[0].id,
              tag_action_color: res.data[0].RECORDS[0].iconcolor,
            });
          }
          wx.setStorage({
            key: "iconlist_out",
            data: res.data[0].RECORDS,
            success: function (res) {
              console.log('缓存(iconlist_out)成功')
            }
          });
          
        }, fail: err => {
          console.log(err);
        }
      });
    }
  },

  //选择日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      date: e.detail.value
    })
  },

  // 点击菜单
  jizhangmenu: function (e) {
    var obj = this;
    var item = e.target.dataset.item;
    if (item == 1) {
      obj.setData({
        nav_color1: '',
        nav_color2: 'nav-active',
      })
    } else {
      obj.setData({
        nav_color1: 'nav-active',
        nav_color2: '',
      })
    }

    var item = parseInt(e.currentTarget.dataset.item)
    obj.setData({
      nav_item: item
    })
    console.log(item)

    var _iconlist = item == 2 ? wx.getStorageSync('iconlist_out') : wx.getStorageSync('iconlist_in');
    console.log(_iconlist);
    if (_iconlist) {
      console.log("icon cache get");
      obj.setData({
        iconlist: _iconlist,
        nav_icon: _iconlist[0].icon,
        nav_name: _iconlist[0].name,
        tagid: _iconlist[0].id,
        tag_action_id: _iconlist[0].id,
        tag_action_color: _iconlist[0].iconcolor,
      });
    } else {
      console.log("icon url get");
      //  收入图标
      db.collection("iconlist_in").get({
        success: res => {
          console.log(res.data[0].RECORDS);
          obj.setData({
            iconlist: res.data[0].RECORDS,
            nav_icon: res.data[0].RECORDS[0].icon,
            nav_name: res.data[0].RECORDS[0].name,
            tagid: res.data[0].RECORDS[0].id,
            tag_action_id: res.data[0].RECORDS[0].id,
            tag_action_color: res.data[0].RECORDS[0].iconcolor,
          });
          wx.setStorage({
            key: "iconlist_in",
            data: res.data[0].RECORDS,
            success: function (res) {
              console.log('缓存(iconlist_in)成功')
            }
          });

        }, fail: err => {
          console.log(err);
        }
      });
    }
   
  },

  // tag点击
  clickimgs: function (e) {
    var obj = this;
    console.log(e);

    obj.setData({
      nav_icon: e.currentTarget.dataset.tagicon,
      nav_name: e.currentTarget.dataset.tagname,
      tagid: e.currentTarget.dataset.tagid,
      tag_action_id: e.currentTarget.dataset.tagid,
      tag_action_color: e.currentTarget.dataset.tagcolor,
    });

  },

  // 保存
  formSubmit: function (e) {
    var obj = this;
    // 参数
    var info = e.detail.value;
    console.log(info);
    var bool = true;
    // 按钮属性
    var formid = e.detail.formId;

    console.log(formid);

    if (info.money == "") {
      bool = false;
      wx.showToast({
        title: '请记录金额',
        icon: 'none',
        duration: 2000  //提示的延迟时间
      });
    }

    console.log(info.id);
    console.log('form发生了submit事件，携带数据为：', JSON.stringify(e.detail.value))

    if (bool) {
      if (info.id == "") {//id等于空是新增数据
        this.add(db, info)  //新增记录
      } else {
        this.update(db, info)  //修改记录
      }
    } 
  },

  //新增记录
  add : function(db,info){
    db.collection("bills").add({
      data: {
        type: info.type,
        tag: info.tag,
        tagid: info.tagid,
        tagimg: info.tagimg,
        money: Number(info.money),
        remark: info.remark,
        date: info.date,
        yearmonth: util.formatYearMonth(new Date(info.date)),
        year: util.formatYear(new Date(info.date)),
        time: new Date(info.date),
        iconbg: info.iconbg
      }, success: res => {
        wx.showToast({//显示消息提示框
          title: '保存成功',
          icon: 'success',
        });
        setTimeout(function () {
          wx.switchTab({//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            url: '/pages/bill/bill',
            success: function (e) {
              console.log(e);
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        }, 1000);
      }
    });
  },

  //修改记录
  update : function(db,info){
    db.collection("bills").doc(info.id).update({
      data: {
        type: info.type,
        tag: info.tag,
        tagid: info.tagid,
        tagimg: info.tagimg,
        money: Number(info.money),
        remark: info.remark,
        date: info.date,
        yearmonth: util.formatYearMonth(new Date(info.date)),
        year: util.formatYear(new Date(info.date)),
        time: new Date(info.date),
        iconbg: info.iconbg
      }, success: res => {
        wx.showToast({//显示消息提示框
          title: '修改成功',
          icon: 'success',
        });
        setTimeout(function () {
          wx.switchTab({//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            url: '/pages/bill/bill',
            success: function (e) {
              console.log(e);
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        }, 1000);
      }
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