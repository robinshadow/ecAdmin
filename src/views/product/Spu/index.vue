<template>
    <div>
        <el-card style="margin:20px 0">
            <CategorySelector @getCategory="getCategory" :show="scene != 0" />
        </el-card>

        <el-card>
            <!-- 底部 展示SPU -->
            <div v-show="scene == 0">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
                <el-table border :data="records" style="margin:10px 0" v-loading="mainLoading">
                    <el-table-column label="序号" type="index" align="center" width="80px">
                    </el-table-column>

                    <el-table-column label="SPU名称" prop="spuName">

                    </el-table-column>

                    <el-table-column label="SPU描述" prop="description">
                    </el-table-column>

                    <el-table-column label="操作">
                        <template v-slot="{ row }">

                            <el-button type="success" icon="el-icon-plus" size="mini" title="添加Sku"
                                @click="addSku(row)"></el-button>

                            <el-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu"
                                @click="updateSpu(row)"></el-button>

                            <el-button type="info" icon="el-icon-info" size="mini" title="查看当前SPU的全部SKU"
                                @click="viewSku(row)"></el-button>


                            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" slot="reference"
                                    style="margin:0 10px">
                                </el-button>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页器 -->
                <el-pagination style="text-align: center;margin-top: 10px;" :current-page="page"
                    :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->, sizes,total"
                    :total="total" v-show="total > 0" :pager-count="5" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>

            <!-- 添加或修改SPU -->
            <SpuForm v-show="scene == 1" @SpuFormChangeScene="SpuFormChangeScene" ref="spu" />

            <!-- 添加SKU -->
            <SkuForm v-show="scene == 2" @SkuFormChangeScene="SkuFormChangeScene" ref="sku" />

        </el-card>
        <!-- SKU列表信息对话框 -->
        <el-dialog :title='`${spu.spuName}的SKU列表`' :visible.sync="dialogTableVisible" :before-close="closeDialog">
            <el-table :data="skuList" border v-loading="loading">
                <el-table-column label="名称" prop="skuName"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="默认图片">
                    <template v-slot="{ row }">
                        <img :src="row.skuDefaultImg" width="100px" height="100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
    name: 'Spu',
    components: {
        SpuForm,
        SkuForm
    },
    data() {
        return {
            //SPU主表格loading动画
            mainLoading: false,
            //三级分类id
            category1Id: '',
            category2Id: '',
            category3Id: '',
            page: 1, //分页器当前页数
            limit: 3, //分页器每页显示的条数
            records: [], //存储spu列表
            total: 0, //数据总条数
            scene: 0, //场景值,控制底部三个div的显示隐藏，0:展示SPU,1:添加或修改SPU,2:添加SKU
            dialogTableVisible: false, //控制SKU列表信息对话框显示与隐藏
            spu: {},  //存储当前点击的spu信息
            skuList: [],//存储当前点击的spu的sku列表信息
            loading: true,//加载中
        }
    },
    methods: {
        //把子组件分类id传递给父组件(自定义事件)
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
                this.getSpuList()
            }
        },
        //获取spu列表
        async getSpuList() {
            this.mainLoading = true
            const { page, limit, category3Id } = this
            let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
            if (result.code === 200) {
                this.total = result.data.total
                this.records = result.data.records
                //隐藏loading动画
                this.mainLoading = false
            }
        },
        //分页器页码发生变化时的回调
        handleCurrentChange(page) {
            this.page = page
            this.getSpuList()
        },
        //分页器每页显示条数发生变化时的回调
        handleSizeChange(limit) {
            this.limit = limit
            this.getSpuList()
        },
        //添加spu
        addSpu() {
            this.scene = 1
            //通知子组件发请求，并传递3id
            this.$refs.spu.addSpuData(this.category3Id)
        },
        //修改spu
        updateSpu(row) {
            this.scene = 1
            //获取子组件SpuForm，并调用子组件的方法发请求
            this.$refs.spu.initSpuData(row)
        },
        //SpuForm组件中取消按钮的自定义事件，用于切换场景值
        SpuFormChangeScene({ scene, flag }) {
            this.scene = scene
            if (flag == 'add') {
                this.page = 1
                this.getSpuList()
            } else {
                this.getSpuList()
            }
            this.getSpuList()
        },
        //删除spu
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id)
            if (result.code === 200) {
                this.$message.success('删除成功')
                if (this.records.length > 1) {
                    this.getSpuList()
                } else {
                    this.page = this.page - 1
                    this.getSpuList()
                }
            }
        },
        //添加sku
        addSku(row) {
            //切换场景
            this.scene = 2
            //获取子组件SkuForm，并调用子组件的方法发请求
            this.$refs.sku.initSkuData(this.category1Id, this.category2Id, row)
        },
        //SkuForm组件中取消按钮的自定义事件，用于切换场景值
        SkuFormChangeScene(scene) {
            this.scene = scene
        },
        //查看sku
        async viewSku(row) {
            //显示表格对话框
            this.dialogTableVisible = true
            //保存当前点击的spu信息
            this.spu = row
            //获取sku列表数据
            let result = await this.$API.spu.reqSkuList(row.id)
            if (result.code === 200) {
                this.skuList = result.data
                //关闭加载中
                this.loading = false
            }
        },
        //关闭对话框回调
        closeDialog(done) {
            this.loading = true
            this.skuList = []
            done()
        },
    }
}
</script>
