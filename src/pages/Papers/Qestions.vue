<template>
    <el-table
    border
    row-class-name="table-row"
    :data="datas"
    @selection-change="handleSelectionChange">
        <el-table-column 
        type="expand">
            <template slot-scope="props">
                <el-row class="expand-item">
                    <el-col
                    :span="1">
                        <span class="expand-item-0"></span>
                    </el-col>
                    <el-col
                    :span="11">
                        <div class="expand-item-title">题目描述</div>
                        <div
                        v-html="props.row.detail"></div>
                    </el-col>
                </el-row>
                <el-row class="expand-item">
                    <el-col
                    :span="1">
                        <span class="expand-item-0"></span>
                    </el-col>
                    <el-col
                    :span="11">
                        <div class="expand-item-title">参考答案</div>
                        <div
                        v-html="props.row.result"></div>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column
        prop="name"
        label="ID"></el-table-column>
        <el-table-column
        prop="grade"
        label="年级"></el-table-column>
        <el-table-column
        prop="money"
        label="科目"></el-table-column>
        <el-table-column
        prop="money"
        label="章节"></el-table-column>
        <el-table-column
        prop="money"
        label="难度"></el-table-column>
        <el-table-column
        prop="money"
        label="组卷次数"></el-table-column>
        <el-table-column
        prop="money"
        label="题目描述"></el-table-column>
        <el-table-column
        prop="money"
        label="添加时间"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                @click="handleEditor(scope.$index, scope.row)">添加</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    props: {
        datas: {
            type: Array
        }
    },
    data() {
        return {
            // tableData: [
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            //     {
            //         id: 111,
            //         name: '黄若曦',
            //         grade: '三年级二班',
            //         money: 1000
            //     },
            // ],
            search: '',
            current: 1,
            total: 1000,
            showOutQuestionBox: false,
        };
    },
    components: {

    },
    mounted () {
        // this.req()
        console.log(this.datas)
    },
    methods: {
        req() {
            this.$http.get('/test', {
                search: this.search,
                page: this.current
            })
            .then((res) => {
                //
            });
        },
        handleSortChange({ column, prop, order }) {
            console.log('handleSortChange', column, prop, order);
        },
        handlePageChange(current) {
            this.current = current
        },
        handleSelectionChange(val) {
            this.selectionRows = val
        },
    }
}
</script>

<style scoped>
</style>