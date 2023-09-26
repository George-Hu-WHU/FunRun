// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const users = cloud.database().collection('users')
  return await users.where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    console.log(res)
  })
  // return await users.add({
  //   _openid: wxContext.OPENID,
  //   avatarName: event.avatarName
  // }).then(res => {
  //   console.log(res)
  // })
}