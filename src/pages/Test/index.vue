<template>
    <I-table
    title="测试标题"
    :isUpdate="true"
    :isBack="true"
    @update="req">
        <template slot="head">
            <el-input v-model="search" size="smail" placeholder="请输入" style="width:200px;"></el-input>
            <el-button size="smail" type="primary">查询</el-button>
            <el-button size="smail" type="primary"
            @click="showOutQuestionBox = true">弹框</el-button>
        </template>
        <template slot="content" slot-scope="scope">
            <!-- scope.maxHeight 父组件传递给子组件的内容最大高度(可形成滚动条) -->
            <el-table
            border
            row-class-name="table-row"
            :height="scope.maxHeight"
            :data="tableData"
            @sort-change="handleSortChange">
                <el-table-column
                prop="name"
                label="学生名称"></el-table-column>
                <el-table-column
                sortable
                prop="grade"
                label="班级"></el-table-column>
                <el-table-column
                prop="money"
                label="金额"></el-table-column>
                <el-table-column 
                label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <I-table-editor v-model="showOutQuestionBox" 
            title="测试标题">
                <template slot="content">
                    <el-row>测试</el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showOutQuestionBox = false">取 消</el-button>
                    <el-button type="success"
                    @click="showOutQuestionBox = false">确 定</el-button>
                </template>
            </I-table-editor>

        </template>
        <template slot="foot">
            <I-table-page
            :total="total"
            @change="handlePageChange"></I-table-page>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import HTTP from '../../http.js'

export default {
    data() {
        return {
            tableData: [
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                },
            ],
            search: '',
            current: 1,
            total: 1000,
            showOutQuestionBox: false,
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        // this.req()
    },
    methods: {
        req() {
            this.$http.get('/test.php', {
                search: this.search,
                page: this.current
            }, {
                showError: true,
                showLoading: true,
            })
            .then(res => {
                //
            })
        },
        handleSortChange({ column, prop, order }) {
            console.log('handleSortChange', column, prop, order);
        },
        handlePageChange(current) {
            this.current = current
        },
    }
}
</script>

<style scoped>
</style>