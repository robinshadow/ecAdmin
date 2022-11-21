<template>
    <div>
        <el-form label-width="80px">
            <el-form-item label="SPU名称">
                {{ spu.spuName }}
            </el-form-item>

            <el-form-item label="SKU名称">
                <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>

            <el-form-item label="价格(元)">
                <el-input placeholder="请输入价格" type="number" v-model="skuInfo.price"></el-input>
            </el-form-item>

            <el-form-item label="重量(kg)">
                <el-input placeholder="请输入重量" v-model="skuInfo.weight"></el-input>
            </el-form-item>

            <el-form-item label="规格描述">
                <el-input placeholder="请输入规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>

            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValId">
                            <el-option :label="attrVal.valueName" :value="`${attr.id}:${attrVal.id}`"
                                v-for="attrVal in attr.attrValueList" :key="attrVal.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValId">
                            <el-option :label="saleAttrVal.saleAttrValueName"
                                :value="`${saleAttr.id}:${saleAttrVal.id}`"
                                v-for="saleAttrVal in saleAttr.spuSaleAttrValueList" :key="saleAttrVal.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="图片列表">
                <el-table :data="spuImgList" @selection-change="handleSelectionChange" border>
                    <el-table-column width="80px" type="selection"></el-table-column>

                    <el-table-column label="图片">
                        <template v-slot="{ row }">
                            <img :src="row.imgUrl" width="80px" height="80px">
                        </template>
                    </el-table-column>

                    <el-table-column label="名称" prop="imgName"></el-table-column>

                    <el-table-column label="操作">
                        <template v-slot="{ row }">
                            <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefault(row)">
                                设置默认
                            </el-button>
                            <el-button size="mini" disabled v-else>默认</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            spuImgList: [],     //存储图片信息
            saleAttrList: [],   //存储销售属性信息
            attrInfoList: [],   //存储平台属性信息
            spu: {},            //存储spu信息
            imgList: [],       //收集图片数据
            //收集SKU数据
            skuInfo: {
                //父组件数据
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                //双向绑定
                price: 0,
                skuName: '',
                weight: '',
                skuDesc: '',     //规格描述
                skuAttrValueList: [
                    /* {
                        "attrId": 0,
                        "valueId": 0,
                    } */
                ],
                //默认图片
                skuDefaultImg: '',
                //图片列表
                skuImageList: [
                    /* {
                        "id": 0,
                        "imgName": "string",
                        "imgUrl": "string",
                        "isDefault": "string",
                        "skuId": 0,
                        "spuImgId": 0
                    } */
                ],
                //销售属性
                skuSaleAttrValueList: [
                    /* {
                        "id": 0,
                        "saleAttrId": 0,
                        "saleAttrName": "string",
                        "saleAttrValueId": 0,
                        "saleAttrValueName": "string",
                        "skuId": 0,
                        "spuId": 0
                    } */
                ],
            }
        }
    },
    methods: {
        //获取SkuForm数据
        async initSkuData(category1Id, category2Id, spu) {
            //收集数据
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.tmId = spu.tmId
            this.skuInfo.spuId = spu.id
            this.spu = spu
            //获取图片数据
            let spuImgList = await this.$API.spu.reqSpuImgList(spu.id)
            if (spuImgList.code === 200) {
                //给图片数据加上isDefault属性，便于默认按钮的切换
                let list = spuImgList.data
                list.forEach(item => {
                    item.isDefault = 0
                })
                this.spuImgList = list
            }
            //获取销售属性数据
            let saleAttrList = await this.$API.spu.reqSaleAttrList(spu.id)
            if (saleAttrList.code === 200) {
                this.saleAttrList = saleAttrList.data
            }
            //获取平台属性数据
            let attrInfoList = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.id)
            if (attrInfoList.code === 200) {
                this.attrInfoList = attrInfoList.data
            }
        },
        //图片列表复选框事件,获取选中图片的信息
        handleSelectionChange(selection) {
            this.imgList = selection
        },
        //设置默认按钮回调
        changeDefault(row) {
            this.spuImgList.forEach(item => {
                item.isDefault = 0
            })
            row.isDefault = 1
            //收集默认图片
            this.skuInfo.skuDefaultImg = row.imgUrl
        },
        //取消按钮回调
        cancel() {
            this.$emit('SkuFormChangeScene', 0)
            //清除数据
            Object.assign(this._data, this.$options.data())
        },
        //保存按钮回调
        async save() {
            //整理平台属性数据
            this.attrInfoList.forEach((item) => {
                if (item.attrIdAndValId) {
                    //切割数据
                    const [attrId, valueId] = item.attrIdAndValId.split(':')
                    this.skuInfo.skuAttrValueList.push({ attrId, valueId })
                }
            })
            //整理销售属性数据
            this.skuInfo.skuSaleAttrValueList = this.saleAttrList.reduce((pre, item) => {
                if (item.attrIdAndValId) {
                    const [saleAttrId, saleAttrValueId] = item.attrIdAndValId.split(':')
                    pre.push({ saleAttrId, saleAttrValueId })
                }
                return pre
            }, [])
            //整理图片数据
            this.skuInfo.skuImageList = this.imgList.map(item => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })
            //发请求
            let result = await this.$API.spu.reqAddSku(this.skuInfo)
            if (result.code === 200) {
                this.$message.success('添加成功')
                //通知父组件切换场景并清除数据
                this.cancel()
            }
        }
    }
}
</script>