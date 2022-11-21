<template>
    <div>
        <el-table border style="margin:10px 0" :data="records" v-loading="loading">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column prop="skuName" label="名称" width="100px"></el-table-column>
            <el-table-column prop="skuDesc" label="描述"></el-table-column>
            <el-table-column label="默认图片" width="110px">
                <template v-slot="{ row }">
                    <img :src="row.skuDefaultImg" width="80px" height="80px">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80px"></el-table-column>
            <el-table-column prop="price" label="价格" width="80px"></el-table-column>
            <el-table-column prop="prop" label="操作">
                <template v-slot="{ row }">
                    <!-- 下架按钮 -->
                    <el-button type="info" size="mini" icon="el-icon-sort-down" v-if="row.isSale == 1" title="下架商品"
                        @click="cancelSale(row)">
                    </el-button>
                    <!-- 上架按钮 -->
                    <el-button type="success" size="mini" icon="el-icon-sort-up" v-else title="上架商品"
                        @click="onSale(row)"></el-button>
                    <!-- 查看详情 -->
                    <el-button type="primary" size="mini" icon="el-icon-info" @click="getSkuInfo(row)"></el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
            layout=" prev, pager, next, jumper,->, sizes,total" :total="total" :pager-count="7"
            style="text-align:center" @current-change="getSkuList" @size-change="handleSizeChange">
        </el-pagination>

        <!-- 抽屉(查看详情) -->
        <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{ skuInfo.skuName }}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{ skuInfo.price }}元</el-col>
            </el-row>

            <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16" class="tag">
                    <el-tag type="success" v-for="tag in skuInfo.skuAttrValueList" :key="tag.id" style="margin:5px 5px">
                        {{ tag.attrName }}-{{ tag.valueName }}
                    </el-tag>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <el-carousel height="30vw">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" style="width: 100%; height: 100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>


        </el-drawer>
    </div>
</template>

<script>
export default {
    name: 'Sku',
    data() {
        return {
            page: 1,   //分页器当前页数
            limit: 10, //分页器每页显示条数
            records: [], //表格数据
            total: 0, //表格数据总条数
            skuInfo: {},  //存储SKU信息
            drawer: false, //控制抽屉显示与隐藏
            loading: true, //控制表格加载动画
        }
    },
    mounted() {
        this.getSkuList()
    },
    methods: {
        //获取SKU列表
        async getSkuList(pages = 1) {
            this.page = pages
            const { page, limit } = this
            let result = await this.$API.sku.reqSkuList(page, limit)
            if (result.code === 200) {
                this.records = result.data.records
                this.total = result.data.total
                //隐藏加载动画
                this.loading = false
            }
        },
        handleSizeChange(limit) {
            this.limit = limit
            this.getSkuList()
        },
        //上架
        onSale(row) {
            this.$confirm('是否上架该商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let result = await this.$API.sku.reqOnSale(row.id)
                if (result.code === 200) {
                    row.isSale = 1
                    this.$message({
                        type: 'success',
                        message: '上架成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消上架'
                });
            });
        },
        //下架
        cancelSale(row) {
            this.$confirm('是否下架该商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let result = await this.$API.sku.reqCancelSale(row.id)
                if (result.code === 200) {
                    row.isSale = 0
                    this.$message({
                        type: 'success',
                        message: '下架成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消下架'
                });
            });
        },
        //获取SKU详情
        async getSkuInfo(row) {
            //展示抽屉
            this.drawer = true
            //获取数据
            let result = await this.$API.sku.reqSkuInfo(row.id)
            if (result.code === 200) {
                this.skuInfo = result.data
            }
        }
    }
}
</script>

<style>
.el-row .el-col-5 {
    font-size: 20px;
    text-align: right;
}

.el-row .el-col-16 {
    font-size: 15px;
    margin-top: 14px;
}

.el-row .tag {
    margin-top: 3px;
}

.el-col {
    margin: 10px 10px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>