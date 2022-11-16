import request from '@/utils/request'

//获取品牌管理数据
export const reqTradeMarkList = (page, limit) => {
    return request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
}

//新增或更新品牌
export const reqAddOrUpdateTradeMark = (data) => {
    if (data.id) {
        //更新品牌
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data })
    } else {
        //新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data })
    }
}

//删除品牌
export const reqDeleteTradeMark = (id) => {
    return request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
}
