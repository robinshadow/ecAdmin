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
                <el-upload action="/dev-api/admin/product/upload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess"
                    :file-list='spuImgList'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="unSelectAttr">
                    <el-option :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectSaleAttr"
                        :key="unSelect.id" :label="unSelect.name">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" style="margin:0 10px" :disabled="!unSelectAttr"
                    @click="addSaleAttr">
                    添加销售属性
                </el-button>

                <!-- 展示当前SPU的销售属性 -->
                <el-table border style="margin:10px 0" :data="spuInfo.spuSaleAttrList">
                    <el-table-column label="序号" type="index" width="80px" align="center">
                    </el-table-column>

                    <el-table-column label="属性名" prop="saleAttrName">
                    </el-table-column>

                    <el-table-column label="属性值名称列表">

                        <!-- tag标签 -->
                        <template v-slot="{ row }">
                            <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable
                                :disable-transitions="false" @close="handleClose(tag, index, row)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>

                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                @blur="handleInputConfirm(row)" @keyup.enter.native="handleInputConfirm"
                                ref="saveTagInput" size="small">
                            </el-input>

                            <!-- @click="showInput" -->
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrVal(row)">
                                +添加
                            </el-button>
                        </template>

                    </el-table-column>

                    <el-table-column label="操作">
                        <template v-slot="{ row, $index }">
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCurrent($index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>

            </el-form-item>

        </el-form>

    </div>
</template>

<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            // 保存SPU信息
            spuInfo: {
                //三级分类id
                category3Id: 0,
                //描述
                description: '',
                //SPU图片信息
                spuImageList: [],
                //SPU名称
                spuName: '',
                //品牌id
                tmId: '',
                //销售属性信息
                spuSaleAttrList: [],
            },
            // 上传图片相关属性
            dialogImageUrl: '',
            dialogVisible: false,
            tradeMarkList: [],  //保存品牌列表
            spuImgList: [],        //保存SPU图片
            saleAttr: [],     //保存销售属性
            unSelectAttr: '',    //收集未选择的需要添加的销售属性 格式：'id:name'
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
        //添加销售属性
        addSaleAttr() {
            //分割unSelectAttr
            const [baseSaleAttrId, saleAttrName] = this.unSelectAttr.split(':')
            //向spuInfo.spuSaleAttrList添加新的销售属性
            let newSaleAttr = {
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList: []
            }
            this.spuInfo.spuSaleAttrList.push(newSaleAttr)
            //清空已选择的销售属性
            this.unSelectAttr = ''
        },
        //添加销售属性值(添加tag标签)
        addSaleAttrVal(row) {
            //向当前正在新增的销售属性添加inputVisible属性，用于控制tag标签的显示
            this.$set(row, 'inputVisible', true)
            //自动聚焦
            this.$nextTick(() => {
                this.$refs.saveTagInput.focus()
            })
            //向当前正在新增的销售属性添加inputValue属性，用于存储tag标签的值
            this.$set(row, 'inputValue', '')
        },
        //tag标签失去焦点
        handleInputConfirm(row) {
            //整理参数并把新的数据加入数组
            const { baseSaleAttrId, inputValue } = row
            //判断是否重复
            let isRepeat = row.spuSaleAttrValueList.some((item) => {
                return item.saleAttrValueName.trim() == inputValue.trim()
            })
            //判断是否为空
            if (!inputValue.trim()) {
                this.$message.error('销售属性值不能为空')
                this.$refs.saveTagInput.focus()
                return
            } else if (isRepeat) {
                this.$message.error('销售属性值不能重复')
                this.$refs.saveTagInput.focus()
                return
            }
            let newSaleAttrVal = {
                baseSaleAttrId,
                saleAttrValueName: inputValue
            }
            row.spuSaleAttrValueList.push(newSaleAttrVal)
            //输入完成隐藏输入框
            row.inputVisible = false
        },
        //删除tag标签
        handleClose(tag, index, row) {
            row.spuSaleAttrValueList.splice(index, 1)
        },
        //删除一行属性
        deleteCurrent($index) {
            this.spuInfo.spuSaleAttrList.splice($index, 1)
        },
        //保存SPU按钮回调
        async addOrUpdateSpu() {
            //SPU名称不能为空
            if (this.spuInfo.spuName.trim() == '') {
                this.$message.error('SPU名称不能为空')
                return
            }
            //品牌不能为空
            else if (this.spuInfo.tmId == '') {
                this.$message.error('品牌不能为空')
                return
            }
            //SPU描述不能为空
            else if (this.spuInfo.description.trim() == '') {
                this.$message.error('SPU描述不能为空')
                return
            }
            //整理照片墙数据,提交给服务器的数据需要imgName和imgUrl两个字段
            this.spuInfo.spuImageList = this.spuImgList.map((item) => {
                return {
                    imgName: item.name,
                    imgUrl: item.imgUrl ? item.imgUrl : item.response.data
                }
            })
            //发请求
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
            if (result.code === 200) {
                this.$message.success('保存成功')
                //回到scene==0,并区分修改和添加
                this.$emit('changeScene', { scene: 0, flag: this.spuInfo.id ? 'update' : 'add' })
            }
            //清除输入的数据
            Object.assign(this._data, this.$options.data())
        },
        //点击添加spu按钮发请求
        async addSpuData(category3Id) {
            //获取3id
            this.spuInfo.category3Id = category3Id
            //获取品牌信息
            let tradeMarkList = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkList.code === 200) {
                this.tradeMarkList = tradeMarkList.data
            }
            //获取平台所有销售属性
            let saleAttr = await this.$API.spu.reqBaseSaleAttrList()
            if (saleAttr.code === 200) {
                this.saleAttr = saleAttr.data
            }
        },
        //取消按钮回调
        cancel() {
            //切换场景
            this.$emit('changeScene', { scene: 0, flag: '' })
            //清除输入的数据
            Object.assign(this._data, this.$options.data())
        }
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