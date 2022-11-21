import request from '@/utils/request'

//获取SKU列表数据
export const reqSkuList = (page, limit) => {
    return request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
}

//SKU上架
export const reqOnSale = (skuId) => {
    return request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
}

//SKU下架
export const reqCancelSale = (skuId) => {
    return request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })
}

//获取SKU详情
export const reqSkuInfo = (skuId) => {
    return request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
}