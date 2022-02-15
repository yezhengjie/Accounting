//app.js
var app = getApp()
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'db-05dvv',
        traceUser: true,
      })
    }

    this.globalData = {
     
    }

    // var obj = this;
    // var siteInfo = require("siteinfo.js");
    //登录
    // wx.login({
    //   success: res => {
    //     var _openid = wx.getStorageSync('openid');
    //     if (_openid) {
    //       obj.globalData.openid = _openid;
    //       console.log("缓存获取:" + obj.globalData.openid);
    //       if (obj.openidCallback) {//回调函数
    //         obj.openidCallback(_openid);
    //       }
    //     } else {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       //调用request请求api转换登录凭证  
    //       wx.request({
    //         url: '/user/GetOpenid?code=' + app.globalData.openid,
    //         //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
    //         header: {
    //           'content-type': 'application/json'
    //         },
    //         success: function (res) {
    //           obj.globalData.openid = res.data.openid; //获取openid  
    //           console.log("URL获取:" + obj.globalData.openid);
    //           if (obj.openidCallback) {
    //             obj.openidCallback(res.data.openid);
    //           }
    //           try {
    //             wx.setStorageSync('openid', obj.globalData.openid);
    //           } catch (e) { }
    //         }
    //       })
    //     }
    //   }
    // });


    // 获取授权
    //obj.getUserInfoF();
    //查看是否授权
    // 获取用户信息
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("获取");
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //获取openid：globalData--storage--云函数login
  getOpenid: async function(){
    (this.globalData.openid=this.globalData.openid || wx.getStorageSync('openid')) || wx.setStorageSync('openid', this.globalData.openid = (await wx.cloud.callFunction({name: 'login'})).result.openid)
    return this.globalData.openid
  },


  globalData: {
    userInfo: null,
    // openid: ""
  }
})
