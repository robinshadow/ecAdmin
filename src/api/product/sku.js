import request from '@/utils/request'

//获取SPU图片
export const reqSpuImgList = (spuId) => {
    return request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

//获取销售属性列表
export const reqSaleAttrList = (spuId) => {
    return request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
}

//获取平台属性列表
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}