import request from '@/utils/request'

//用户登录
export function login(data) {
  return request({
    url: '/acl/index/login',
    method: 'post',
    data
  })
}

//获取用户信息
export function getInfo(token) {
  return request({
    url: '/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//用户退出登录
export function logout() {
  return request({
    url: '/acl/index/logout',
    method: 'post'
  })
}
