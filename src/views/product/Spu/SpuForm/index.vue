<!-- 添加或修改SPU -->
<template>
    <div>
        <el-form ref="form" label-width="80px" :model="spuInfo">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spuInfo.spuName"></el-input>
            </el-form-item>

            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
                    <el-option :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <el-input type="textarea" rows="4" placeholder="请输入SPU描述" v-model="spuInfo.description"></el-input>
            </el-form-item>

            <!-- 上传图片 -->
            <el-form-item label="SPU图片">
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess"
                    :file-list='spuImgList'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="attrId">
                    <el-option value="unSelect.id" v-for="unSelect in unSelectSaleAttr" :key="unSelect.id"
                        :label="unSelect.name">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" style="margin:0 10px" :disabled="!attrId">添加销售属性
                </el-button>

                <!-- 展示当前SPU的销售属性 -->
                <el-table border style="margin:10px 0" :data="spuInfo.spuSaleAttrList">
                    <el-table-column label="序号" type="index" width="80px" align="center">
                    </el-table-column>

                    <el-table-column label="属性名" prop="saleAttrName">
                    </el-table-column>

                    <el-table-column label="属性值名称列表">
                        <!-- tag标签 -->
                        <!-- @close="handleClose(tag)" -->
                        <template v-slot="{ row }">
                            <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable
                                :disable-transitions="false">
                                {{ tag.saleAttrValueName }}
                            </el-tag>

                            <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" size="small">
                            </el-input>

                            <!-- @click="showInput" -->
                            <el-button v-else class="button-new-tag" size="small">+添加
                            </el-button>
                        </template>

                    </el-table-column>

                    <el-table-column label="操作">
                        <template v-slot="{ row }">
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button @click="$emit('changeScene', 0)">取消</el-button>

            </el-form-item>

        </el-form>

    </div>
</template>

<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            // 上传图片相关属性
            dialogImageUrl: '',
            dialogVisible: false,
            // 保存SPU信息
            spuInfo: {
                //三级分类id
                category3Id: 0,
                //描述
                description: '',
                //SPU图片信息
                spuImageList: [
                    /* {
                        "id": 0,
                        "imgName": "string",
                        "imgUrl": "string",
                        "spuId": 0
                    } */
                ],
                //SPU名称
                spuName: '',
                //品牌id
                tmId: 0,
                //销售属性信息
                spuSaleAttrList: [
                    /*              {
                                     baseSaleAttrId: 0,
                                     id: 0,
                                     saleAttrName: '',
                                     spuId: 0,
                                     spuSaleAttrValueList: [
                                         {
                                             baseSaleAttrId: 0,
                                             id: 0,
                                             isChecked:'',
                                             saleAttrName: '',
                                             saleAttrValueName: '',
                                             spuId: 0
                                         }
                                     ]
                                 } */
                ],

            },
            tradeMarkList: [],  //保存品牌列表
            spuImgList: [],        //保存SPU图片
            saleAttr: [],     //保存销售属性
            attrId: '',     //收集未选择的销售属性id
        }
    },
    methods: {
        //照片墙删除图片
        handleRemove(file, fileList) {
            this.spuImgList = fileList
        },
        //照片墙图片预览
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //照片墙图片上传成功回调
        handleSuccess(response, file, fileList) {
            this.spuImgList = fileList
        },
        //初始化SpuForm数据
        async initSpuData(spu) {
            //获取SPU信息
            let spuInfo = await this.$API.spu.reqSpuInfo(spu.id)
            if (spuInfo.code === 200) {
                this.spuInfo = spuInfo.data
            }
            //获取品牌信息
            let tradeMarkList = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkList.code === 200) {
                this.tradeMarkList = tradeMarkList.data
            }
            //获取SPU图片
            let spuImgList = await this.$API.spu.reqSpuImgList(spu.id)
            if (spuImgList.code === 200) {
                //处理图片数据，契合el-upload组件的file-list属性
                let imgArr = spuImgList.data
                imgArr.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                })
                this.spuImgList = imgArr
            }
            //获取平台所有销售属性
            let saleAttr = await this.$API.spu.reqBaseSaleAttrList()
            if (saleAttr.code === 200) {
                this.saleAttr = saleAttr.data
            }
        },

    },
    computed: {
        //计算出还未选择的销售属性
        unSelectSaleAttr() {
            let newArr = this.saleAttr.filter((item) => {
                return this.spuInfo.spuSaleAttrList.every((saleAttr) => {
                    return item.name != saleAttr.saleAttrName
                })
            })
            return newArr
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>