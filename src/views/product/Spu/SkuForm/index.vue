<template>
    <div>
        <el-form label-width="80px">
            <el-form-item label="SPU名称">
                ????
            </el-form-item>

            <el-form-item label="SKU名称">
                <el-input placeholder="请输入SKU名称"></el-input>
            </el-form-item>

            <el-form-item label="价格(元)">
                <el-input placeholder="请输入价格"></el-input>
            </el-form-item>

            <el-form-item label="重量(kg)">
                <el-input placeholder="请输入重量"></el-input>
            </el-form-item>

            <el-form-item label="规格描述">
                <el-input placeholder="请输入规格描述" type="textarea" rows="4"></el-input>
            </el-form-item>

            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item label="屏幕尺寸">
                        <el-select placeholder="请选择" value="">
                            <option value=""></option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item label="屏幕尺寸">
                        <el-select placeholder="请选择" value="">
                            <option value=""></option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="图片列表">
                <el-table border>
                    <el-table-column width="80px" type="selection"></el-table-column>
                    <el-table-column label="图片"></el-table-column>
                    <el-table-column label="名称"></el-table-column>
                    <el-table-column label="操作"></el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            spuImgList: [],   //存储图片信息
            saleAttrList: [],  //存储销售属性信息
            attrInfoList: [],   //存储平台属性信息
        }
    },
    methods: {
        //获取SkuForm数据
        async initSkuData(category1Id, category2Id, spu) {
            //获取图片数据
            let spuImgList = await this.$API.sku.reqSpuImgList(spu.id)
            if (spuImgList.code === 200) {
                this.spuImgList = spuImgList.data
            }
            //获取销售属性数据
            let saleAttrList = await this.$API.sku.reqSaleAttrList(spu.id)
            if (saleAttrList.code === 200) {
                this.saleAttrList = saleAttrList.data
            }
            //获取平台属性数据
            let attrInfoList = await this.$API.sku.reqBaseAttrList(category1Id, category2Id, spu.id)
            if (attrInfoList.code === 200) {
                this.attrInfoList = attrInfoList.data
            }
        }
    }
}
</script>

<style>

</style>