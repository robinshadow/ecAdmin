import request from '@/utils/request'
//获取SPU列表数据
export const reqSpuList = (page, limit, category3Id) => {
    return request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
}

//获取SPU信息
export const reqSpuInfo = (spuId) => {
    return request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
}


//获取品牌信息
export const reqTradeMarkList = () => {
    return request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
}

//获取SPU图片
export const reqSpuImgList = (spuId) => {
    return request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

//获取平台销售属性
export const reqBaseSaleAttrList = () => {
    return request({ url: '/admin/product/baseSaleAttrList', method: 'get' })
}