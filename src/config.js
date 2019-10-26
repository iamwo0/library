/* ========================================================
                        小程序配置文件
======================================================== */
// 域名
var host = 'http://47.107.228.1:8080/community/resources/service'

export const service = {
    // 登录接口
  login: `${host}/login/wechat`,
    // 微信注册接口
  register: `${host}/wechat/register`,
    // 注册发短信接口
  host
}

export default {
  service
}
