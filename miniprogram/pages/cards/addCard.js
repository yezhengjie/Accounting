// pages/cards/addCard.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    id: "",
    cardinfo: null,
    cardtype: 0,
    cardimg: 'cards',
    typename: 'none',
    fq_txt: '余额',
    fq_hide: 'none',
    uq_hide: 'none',
    aq_hide: 'none',
    bd_hide: 'none',
    rd_hide: 'none',
    cn_hide: 'none',
    add_hide: 'block',
    update_hide: 'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    var obj = this;
    obj.openid = await app.getOpenid(),
    // console.log(obj.openid)
    obj.setData({
      openid: obj.openid,
      cardtype: options.carditem,
      id: options.id
    });

    if (options.carditem == 1) {//在线支付
      obj.setData({
        fq_txt: '余额',
        aq_hide: 'block',
        cardimg: 'cards_zxzf',
        typename: '在线支付'
      });
    } else if (options.carditem == 2) {//储蓄卡
        obj.setData({
          fq_txt: '余额',
          aq_hide: 'block',
          cn_hide: 'block',
          cardimg: 'cards_cxk',
          typename: '储蓄卡'
        });
    } else if (options.carditem == 3) {//信用卡
        obj.setData({
          fq_txt: '可用额度',
          fq_hide: 'block',
          uq_hide: 'block',
          aq_hide: 'block',
          bd_hide: 'block',
          rd_hide: 'block',
          cn_hide: 'block',
          cardimg: 'cards_xyk',
          typename: '信用卡'
        });
    } else if (options.carditem == 4) { //现金
        obj.setData({
          fq_txt: '余额',
          fq_hide: 'block',
          cardimg: 'cards_xjzh',
          typename: '现金'
        });
    }
    if (options.id != 0) {
      wx.setNavigationBarTitle({
        title: '卡片详情'
      });
      const db = wx.cloud.database();
      db.collection("cards").where({
        _id: options.id
      }).get({
        success: res => {
          this.setData({
            cardinfo: res.data[0],//返回的是一个数组，取第一个
            add_hide: 'none',
            update_hide: 'block'
          })
        }, fail: err => {
          console.log(err)
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加账户'
      })
    }
  },

  // 表单提交
  formSubmit: function (e) {
    var info = e.detail.value;
    var bool = true;
    const db = wx.cloud.database();//打开数据库连接
    wx.showLoading({
      title: '加载中',
    })

    if (info.cardname == "") {
      bool = false;
      wx.showModal({
        title: '提示',
        content: '请输入账户名称',
        showCancel: false  //是否显示取消按钮，默认为 true
      })
    }
    console.log(info.id);
    console.log('form发生了submit事件，携带数据为：', JSON.stringify(e.detail.value))
    
    if (bool) {
      if (info.id == "0") {//id等于空是新增数据
        this.add(db, info)  //新增记录
      } else {
        this.update(db, info)  //修改记录
      }
    } else {
      wx.hideLoading();
    }
  },

  //新增记录
  add : function(db,info){
    db.collection("cards").add({
      data: {
        cardname: info.cardname,
        cardtype: info.cardtype,
        typename: info.typename,
        fixed_quota: info.fixed_quota,
        used_quota: info.used_quota,
        available_quota: info.available_quota,
        bill_date: info.bill_date,
        repayment_date: info.repayment_date,
        card_number: info.card_number,
        remarks: info.remarks,
        abbreviation: info.cardname.substring(0,1)
      }, success: res => {
        wx.hideLoading();
        console.log(res.data);
        wx.showModal({//显示模态弹窗
          title: '提示',
          content: '保存成功',
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            if (res.confirm) {//为 true 时，表示用户点击了确定按钮
              console.log('用户点击确定');
              var num = getCurrentPages().length;//通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
              wx.navigateBack({//关闭当前页面，返回上一页面或多级页面
                delta: num == 3 ? 1 : 2,//返回的页面数，如果 delta 大于现有页面数，则返回到首页。返回到账单列表
                success: function (e) {
                  var page = getCurrentPages().pop();//Removes the last element from an array and returns it
                  if (page == undefined || page == null) return;
                  page.onLoad();
                },
                fail: function (e) {
                  console.log(e);
                }
              })
            }
          },
        })
      }
    });
  },

  //修改记录
  update : function(db,info){
    db.collection("cards").doc(info.id).update({
      data: {
        cardname: info.cardname,
        cardtype: info.cardtype,
        typename: info.typename,
        fixed_quota: info.fixed_quota,
        used_quota: info.used_quota,
        available_quota: info.available_quota,
        bill_date: info.bill_date,
        repayment_date: info.repayment_date,
        card_number: info.card_number,
        remarks: info.remarks,
        abbreviation: info.cardname.substring(0, 1)
      }, success: res => {
        wx.hideLoading();
        console.log(res.data);
        wx.showModal({//显示模态弹窗
          title: '提示',
          content: '修改成功',
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            if (res.confirm) {//为 true 时，表示用户点击了确定按钮
              console.log('用户点击确定');
              var num = getCurrentPages().length;//通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
              wx.navigateBack({//关闭当前页面，返回上一页面或多级页面
                delta: num == 3 ? 1 : 2,//返回的页面数，如果 delta 大于现有页面数，则返回到首页。返回到账单列表
                success: function (e) {
                  var page = getCurrentPages().pop();//Removes the last element from an array and returns it
                  if (page == undefined || page == null) return;
                  page.onLoad();
                },
                fail: function (e) {
                  console.log(e);
                }
              })
            }
          },
        })
      }
    });
  },

  // 删除账户
  delcard: function (e) {
    console.log(e);
    var cardId = e.currentTarget.dataset.cardid;
    console.log(cardId);
    wx.showModal({
      title: '提示',
      content: '您确定要删除账户？',
      success: function (res) {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection("cards").doc(cardId).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  },
                  fail: function (e) {
                    console.log(e);
                  }
                })
              }, 1000);
            }, fail: err => {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
          console.log(cardId)
        } else if (res.cancel) { }
      }
    })
  },



  // bindPickerzhangdanri: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },

  // bindPickerhuikuanri: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },

  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
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