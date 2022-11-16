//售卖属性管理模块
import request from '@/utils/request'

//获取一级分类
export const reqGetCategory1List = () => {
    return request({ url: '/admin/product/getCategory1', method: 'get' })
}

//获取二级分类
export const reqGetCategory2List = (category1Id) => {
    return request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
}

//获取三级分类
export const reqGetCategory3List = (category2Id) => {
    return request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
}

//通过三级分类的id获取商品属性
export const reqAttrList = (category1Id, category2Id, category3Id) => {
    return request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}

//添加商品属性
export const reqUpdateAttr = (data) => {
    return request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })
}

//删除商品属性
export const reqDeleteAttr = (attrId) => {
    return request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
}