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
    if (res.data.length == 0){
      users.add({
        data: {
          _openid: wxContext.OPENID,
          avatarName: event.avatarName,
          fileID: event.fileID
        }
      })
    } else {
      users.where({
        _openid: wxContext.OPENID
      }).update({
        data: {
          avatarName: event.avatarName,
          fileID: event.fileID
        }
      })
    }
  })
}