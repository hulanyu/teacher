<template>
    <I-table
    :title="`${$route.params.title} 查看成绩一览表`"
    @update="req"
    isBack>
        <template slot="content" slot-scope="scope">
            <el-table
            border
            row-class-name="table-row"
            :height="scope.maxHeight"
            :data="tableData"
            @sort-change="handleSortChange">
                <el-table-column
                sortable
                prop="id"
                label="ID"></el-table-column>
                <el-table-column
                prop="name"
                label="姓名"></el-table-column>
                <el-table-column
                prop="grade_alias"
                label="班级"></el-table-column>
                <el-table-column
                sortable
                prop="obje_score"
                label="客观题分数"></el-table-column>
                <el-table-column
                sortable
                prop="subj_score"
                label="主观题分数"></el-table-column>
                <el-table-column
                sortable
                prop="score"
                label="总分"></el-table-column>
                <el-table-column
                sortable
                prop="class_rank"
                label="班级排名"></el-table-column>
                <el-table-column
                sortable
                prop="grade_rank"
                label="年级排名"></el-table-column>
                <el-table-column 
                label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleShowDetailBox(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <I-table-editor v-model="showDetailBox"
            width="340px"
            title="分数详情">
                <template slot="content">
                    <el-table
                    border
                    :data="detailTableData"
                    @sort-change="handleSortChange">
                        <el-table-column
                        prop="number"
                        label="题号"></el-table-column>
                        <el-table-column
                        prop="score"
                        label="分数"></el-table-column>
                    </el-table>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showDetailBox = false">取 消</el-button>
                    <el-button type="success"
                    @click="showDetailBox = false">确 定</el-button>
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
import BaseRight from '@/components/BaseRight/BaseRight'
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data () {
        return {
            tableData: [], // 列表数据
            showDetailBox: false,
            detailTableData: [], // row数据
            row: null,
            current: 1,
            total: 0,
            sort: null,
            order: null,
        }
    },
    components: {
        BaseRight,
        ITable,
        ITableEditor,
        ITablePage,
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            let obj = {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                page_number: this.current,
            }
            if (this.sort) {
                obj['sort'] = this.sort
            } 
            if (this.order) {
                obj['order'] = this.order
            }
            this.$http.post('/ExamScore/lists', obj)
            .then(res => {
                this.tableData = res.data.row
                this.total = parseInt(res.data.page.total)
            })
        },
        handleSortChange({ column, prop, order }) {
            // console.log('handleSortChange', column, prop, order);
            this.sort = prop
            if (order === 'ascending') {
                order = 'asc'
            } else if (order === 'descending') {
                order = 'desc'
            }
            this.order = order
            this.req()
        },
        handleShowDetailBox (row) {
            this.row = row
            this.showDetailBox = true
            this.$http.post('/ExamScore/info', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                students_id: this.row.students_id
            })
            .then(res => {
                let arr = []
                for (let key of Object.keys(res.data)) {
                    let item = res.data[key]
                    arr.push({
                        score: item.point,
                        number: key
                    })
                }
                this.detailTableData = arr
            })
        },
        handlePageChange(current) {
            this.current = current
        },
    }
}
</script>
