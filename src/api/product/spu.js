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

//修改或添加SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
    //修改
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        //添加
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

//删除SPU
export const reqDeleteSpu = (spuId) => {
    return request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
}


//获取销售属性列表
export const reqSaleAttrList = (spuId) => {
    return request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
}

//获取平台属性列表
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}

//添加SKU
export const reqAddSku = (skuInfo) => {
    return request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })
}