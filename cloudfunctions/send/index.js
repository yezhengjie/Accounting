// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wechatcloud-nxq31',
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 从云开发数据库中查询等待发送的消息列表
    
    var hour = String((new Date()).getHours());
    var minute = String((new Date()).getMinutes());

    if (hour.length <= 1) {
      hour = '0' + hour;
    }
    if (minute.length <= 1) {
      minute = '0' + minute;
    }
    console.log(hour + ":" + minute)

    const messages = await db
      .collection('messages')
      .where({
        done: false,
        item: hour + ":" + minute
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }















  // try {
  //   // 从云开数据库中查询等待发送的消息列表
  //   const messages = await db
  //     .collection('messages')
  //     .where({
  //       done: false,
  //       // 课程开始时间前半小时之内
  //       startTime: _.lte(new Date().getTime() + 30 * 60 * 1000),
  //     })
  //     .get();

  //   // 循环消息列表
  //   const sendPromises = messages.data.map(async message => {
  //     try {
  //       // 发送订阅消息
  //       await cloud.openapi.subscribeMessage.send({
  //         touser: message.touser,
  //         page: message.page,
  //         data: message.data,
  //         templateId: message.templateId,
  //       });
  //       // 发送成功后将消息的状态改为已发送
  //       return db
  //         .collection('messages')
  //         .doc(message._id)
  //         .update({
  //           data: {
  //             done: true,
  //           },
  //         });
  //     } catch (e) {
  //       return e;
  //     }
  //   });

  //   return Promise.all(sendPromises);
  // } catch (err) {
  //   console.log(err);
  //   return err;
  // }
}