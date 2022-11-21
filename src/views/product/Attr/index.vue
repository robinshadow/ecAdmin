<template>
    <div>
        <el-card style="margin:20px 0">
            <CategorySelector @getCategory="getCategory" :show="!isShowTable" />
        </el-card>

        <el-card>
            <div v-show="isShowTable">
                <!-- 添加按钮 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
                </el-button>

                <!-- 展示售卖属性表格 -->
                <el-table border :data="attrList" style="margin:10px 0" v-loading="loading">
                    <el-table-column type="index" label="序号" width="80px" align="center">
                    </el-table-column>

                    <el-table-column prop="attrName" label="属性名称" width="150px">
                    </el-table-column>

                    <el-table-column prop="" label="属性值">
                        <template v-slot="{ row }">
                            <el-tag v-for="attrVal in row.attrValueList" :key="attrVal.id" style="margin:0 10px">
                                {{ attrVal.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="150px">
                        <template v-slot="{ row, $index }">
                            <!-- 修改按钮 -->
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)"
                                style="margin:0 10px">
                            </el-button>
                            <!-- 删除确认气泡框 -->
                            <el-popconfirm :title="`确定删除 '${row.attrName}'?`" @onConfirm="deleteAttr(row, $index)">
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加或修改属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" label-width="80px">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                    <el-button type="primary" size="default" icon="el-icon-plus" @click="addAttrVal"
                        :disabled="!attrInfo.attrName">添加属性值</el-button>
                    <el-button @click="isShowTable = true">取消</el-button>

                    <!-- 添加或修改属性的表格 -->
                    <el-table border style="margin:10px 0" :data="attrInfo.attrValueList">
                        <el-table-column type="index" label="序号" align="center" width="80px">
                        </el-table-column>

                        <el-table-column label="属性值名称">
                            <template v-slot="{ row, $index }">
                                <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                    @blur="toWatch(row)" @keyup.native.enter="toWatch(row)" :ref="$index"></el-input>
                                <span v-else @click="toEdit(row, $index)" style="display:block">
                                    {{ row.valueName }}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template v-slot="{ row, $index }">
                                <el-popconfirm :title="`确定删除 '${row.valueName}'?`" @onConfirm="deleteAttrVal($index)">
                                    <!-- 删除按钮 -->
                                    <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference">
                                    </el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-button type="primary" @click="updateAttr" :disabled="attrInfo.attrValueList.length < 1">保存
                    </el-button>
                    <el-button @click="isShowTable = true">取消</el-button>

                </el-form>
            </div>

        </el-card>
    </div>
</template>

<script>
//引入lodash的深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            //储存商品属性
            attrList: [],
            //控制表格的显示与隐藏
            isShowTable: true,
            //收集新增或修改的属性值
            attrInfo: {
                attrName: '', //属性名
                attrValueList: [],//属性值列表
                categoryId: 0, //三级分类id
                categoryLevel: 3
            },
            //属性值是否重复
            repeat: false,
            //loading动画
            loading: false,
        }
    },
    methods: {
        //发请求获得品牌属性
        async getAttrList() {
            this.loading = true
            const { category1Id, category2Id, category3Id } = this
            let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
            if (result.code === 200) {
                this.attrList = result.data
                this.loading = false
            }
        },
        //自定义事件，拿到子组件三级分类选框的三个id并储存在组件身上
        getCategory({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else {
                this.category3Id = categoryId
                //发请求获得品牌属性
                this.getAttrList()
            }
        },
        //添加属性按钮回调
        addAttr() {
            //控制表格显示隐藏
            this.isShowTable = false
            //清除之前输入的数据
            this.attrInfo = {
                attrName: '', //属性名
                attrValueList: [],
                categoryId: this.category3Id,
                categoryLevel: 3
            }
        },
        //添加属性值按钮回调
        addAttrVal() {
            //不能输入空值，否则无法继续添加
            let isEmpty = this.attrInfo.attrValueList.some((item) => {
                return item.valueName.trim() == ''
            })
            if (isEmpty) {
                this.$message.error('请先填写属性值')
                return
            } else {
                //向数组添加对象
                this.attrInfo.attrValueList.push({
                    attrId: this.attrInfo.id,
                    valueName: '',
                    flag: true //用于操控查看模式或编辑模式
                })
                //input自动获取焦点
                this.$nextTick(() => {
                    this.$refs[this.attrInfo.attrValueList.length - 1].focus()
                })
            }
        },
        //修改属性回调
        editAttr(row) {
            //控制表格显示隐藏
            this.isShowTable = false
            //展示选中的属性以及属性值
            this.attrInfo = cloneDeep(row)
            //修改元素的时候，添加flag(使用$set确保数据是响应式的)
            this.attrInfo.attrValueList.forEach((item) => {
                this.$set(item, 'flag', false)
            })
        },
        //修改模块切换为查看模式
        toWatch(row) {
            //检测属性值是否重复
            let isRepeat = this.attrInfo.attrValueList.some((item) => {
                //排除row本身
                if (row !== item) {
                    return row.valueName.trim() == item.valueName.trim()
                }
            })
            this.repeat = isRepeat
            if (!row.valueName.trim()) {
                this.$message.error('属性值不能为空')
                row.flag = true
                return
            } else if (isRepeat) {
                this.$message.error('属性值不能重复')
                row.flag = true
                return
            } else {
                row.flag = false
            }
        },
        //点击span回调，修改模块切换为编辑模式
        toEdit(row, index) {
            row.flag = true
            //获取input节点，实现自动聚焦(使用$nextTick确保input渲染完成)
            this.$nextTick(() => {
                this.$refs[index].focus()
            })
        },
        //删除属性值回调
        deleteAttrVal(index) {
            this.attrInfo.attrValueList.splice(index, 1)
        },
        //删除整条属性回调
        async deleteAttr(row, index) {
            this.attrList.splice(index, 1)
            let result = await this.$API.attr.reqDeleteAttr(row.id)
            if (result.code === 200) {
                this.$message.success('删除成功')
                //再次获取属性列表
                this.getAttrList()
            } else {
                this.$message.error('删除失败')
            }
        },
        //保存按钮回调 添加或修改属性操作
        async updateAttr() {
            //检测属性值是否有空值
            let isEmpty = this.attrInfo.attrValueList.some((item) => {
                return item.valueName.trim() == ''
            })
            //检测属性名是否为空
            if (!this.attrInfo.attrName.trim()) {
                this.$message.error('属性名不能为空')
                return
            } else if (isEmpty) {
                this.$message.error('属性值不能为空')
                return
            } else if (this.repeat) {
                this.$message.error('属性值不能重复')
                return
            } else {
                try {
                    //整理参数，过滤flag
                    this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
                        delete item.flag
                        return true
                    })
                    //发请求
                    await this.$API.attr.reqUpdateAttr(this.attrInfo)
                    //展示平台属性
                    this.isShowTable = true
                    this.$message.success('操作成功')
                    //再次获取属性列表
                    this.getAttrList()
                } catch (err) {
                    this.$message.error('操作失败')
                }
            }
        }
    }
}
</script>

<style>

</style>