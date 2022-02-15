// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wechatcloud-nxq31',
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  let _id;
  console.log(event)
  try {
    const { OPENID } = cloud.getWXContext();

    const result = await db.collection('messages').add({
      data: {
        ...event,
        touser: OPENID, // 订阅者的openid
        page: 'index', // 订阅消息卡片点击后会打开小程序的哪个页面
        done: false, // 消息发送状态设置为 false
      },
    });

    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }

}