<!-- 三级联动选择器 -->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" :model="cForm">

            <el-form-item label="一级分类">
                <el-select placeholder="请选择" v-model="cForm.category1Id" @change="get2Id" :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.category2Id" @change="get3Id" :disabled="show">
                    <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelector',
    props: ['show'],
    data() {
        return {
            //一级分类数据
            list1: [],
            //二级分类数据
            list2: [],
            //三级分类数据
            list3: [],
            //收集各级分类的id
            cForm: {
                category1Id: '',
                category2Id: '',
                category3Id: ''
            }
        }
    },
    mounted() {
        //挂载完毕后获取一级分类数据
        this.getCategory1List()
    },
    methods: {
        //初始化获取一级分类数据方法
        async getCategory1List() {
            let result = await this.$API.attr.reqGetCategory1List()
            if (result.code === 200) {
                this.list1 = result.data
            }
        },
        //获取二级分类数据
        async get2Id() {
            //先清除之前的数据
            this.list3 = []
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''
            //通过一级分类id获取二级分类数据
            let result = await this.$API.attr.reqGetCategory2List(this.cForm.category1Id)
            if (result.code === 200) {
                this.list2 = result.data
            }
            //给父组件传1id
            const { category1Id } = this.cForm
            this.$emit('getCategory', { categoryId: category1Id, level: 1 })
        },
        //获取三级分类数据
        async get3Id() {
            //清除数据
            this.list3 = []
            this.cForm.category3Id = ''
            let result = await this.$API.attr.reqGetCategory3List(this.cForm.category2Id)
            if (result.code === 200) {
                this.list3 = result.data
            }
            //给父组件传2id
            const { category2Id } = this.cForm
            this.$emit('getCategory', { categoryId: category2Id, level: 2 })
        },
        //三级分类选择后发送请求
        handler() {
            //给父组件传三个id
            //给父组件传3id
            const { category3Id } = this.cForm
            this.$emit('getCategory', { categoryId: category3Id, level: 3 })
        }
    }
}
</script>

<style>

</style>