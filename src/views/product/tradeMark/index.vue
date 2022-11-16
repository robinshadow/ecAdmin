<template>
    <div>
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0" @click="showDialog">添加</el-button>

        <!-- 展示数据的表格 -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column prop="date" label="序号" width="80px" align="center" type="index">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称">
            </el-table-column>
            <el-table-column prop='logoUrl' label="品牌logo" align="center">

                <template v-slot="{ row }">
                    <img :src="row.logoUrl" height="80px">
                </template>

            </el-table-column>

            <el-table-column prop="prop" label="操作" align="center">
                <template v-slot="{ row }">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 分页器 -->
        <el-pagination style="margin-top:20px;text-align:center" :current-page="page"
            @current-change="handleCurrentChange" :page-sizes="[3, 5, 10]" :page-size="limit"
            @size-change="handleSizeChange" layout=" prev, pager, next, jumper, ->,sizes,total" :total="total"
            v-show="total > 0">
        </el-pagination>

        <!-- 修改品牌对话框 -->
        <el-dialog :title="tradeMarkForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">

            <!-- 品牌名称 -->
            <el-form style="width:80%" :model="tradeMarkForm" :rules="rules" ref="ruleForm">

                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tradeMarkForm.tmName"></el-input>
                </el-form-item>

                <!-- 品牌logo -->
                <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
                    <!-- 上传图片 -->
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tradeMarkForm.logoUrl" :src="tradeMarkForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'tradeMark',
    data() {
        return {
            //分页器当前页数
            page: 1,
            //一页展示数据条数
            limit: 3,
            //数据总条数
            total: 0,
            //列表展示的数据
            list: [],
            //对话框显示与隐藏
            dialogFormVisible: false,
            //收集品牌信息表单
            tradeMarkForm: {
                tmName: '',
                logoUrl: ''
            },
            //表单验证规则
            rules: {
                //品牌名称验证规则
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                //品牌logo验证规则
                logoUrl: [
                    { required: true, message: '请上传品牌logo' }
                ],
            }
        }
    },
    mounted() {
        this.getPageList()
    },
    methods: {
        //获取品牌列表数据
        async getPageList() {
            const { page, limit } = this
            let result = await this.$API.trademark.reqTradeMarkList(page, limit)
            if (result.code === 200) {
                //展示数据总条数和列表展示的数据
                this.total = result.data.total
                this.list = result.data.records
            }
        },
        //当前页码发生变化回调
        handleCurrentChange(page) {
            this.page = page
            this.getPageList()
        },
        //每页数据个数发生变化回调
        handleSizeChange(limit) {
            this.limit = limit
            this.getPageList()
        },
        //点击添加按钮回调
        showDialog() {
            //先清除上次可能输入的数据
            this.tradeMarkForm.tmName = ''
            this.tradeMarkForm.logoUrl = ''
            //显示对话框
            this.dialogFormVisible = true
        },
        //修改按钮回调
        updateTradeMark(row) {
            //显示对话框
            this.dialogFormVisible = true
            //展示原数据
            //tradeMarkForm进行了双向绑定，不能用服务器返回的数据直接赋值，否则页面的数据会直接被取代，这里采用扩展运算符
            this.tradeMarkForm = { ...row }
        },
        //图片上传成功回调
        handleAvatarSuccess(res, file) {
            this.tradeMarkForm.logoUrl = res.data
        },
        //图片上传之前
        beforeAvatarUpload(file) {
            const types = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png', 'image/webp'];
            const isImage = types.includes(file.type);
            const isLtSize = file.size / 1024 / 1024 < 2;
            if (!isImage) {
                this.$message.error('上传图片只能是 JPG、JPEG、gif、bmp、PNG、webp 格式!');
                return false;
            }
            if (!isLtSize) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false;
            }
            return true;
        },
        //添加或修改品牌确定按钮
        addOrUpdateTradeMark() {
            this.$refs.ruleForm.validate(async (success) => {
                //通过校验
                if (success) {
                    this.dialogFormVisible = false
                    //发送请求 新增或修改品牌
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tradeMarkForm)
                    if (result.code === 200) {
                        //弹出提示信息
                        this.$message({
                            type: 'success',
                            message: this.tradeMarkForm.id ? '修改品牌成功' : '添加品牌成功'
                        })
                        //更新品牌列表，并跳转页码
                        this.getPageList()
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请输入完整的信息'
                    })
                    return false
                }
            })
        },
        //删除品牌
        deleteTradeMark(row) {
            //确认弹窗
            this.$confirm(`确定删除品牌 '${row.tmName}'?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //删除品牌成功
                let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    //重新获取列表信息并跳转页码(当页数据不足一条跳转到上一页)
                    if (this.list.length > 1) {
                        this.getPageList()
                    } else {
                        this.page = this.page - 1
                        this.getPageList()
                    }
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
