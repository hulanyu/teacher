<template>
    <I-table
    title="考试项目列表"
    @update="req">
        <template slot="head">
            <el-button type="primary" style="float: right;"
            @click="handleCreate">新建考试项目</el-button>
        </template>
        <template slot="content" slot-scope="props">
            <el-table
            border
            :data="data"
            :height="props.maxHeight"
            row-class-name="table-row">
                <el-table-column
                prop="name"
                label="项目名称">
                    <template slot-scope="scope">
                        <a class="click"
                        @click="toSubjectList(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                prop="staff_name"
                label="项目组长">
                </el-table-column>
                <el-table-column
                prop="date"
                label="考试日期">
                    <template slot-scope="scope">
                        {{scope.row.date}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="create_time"
                label="添加时间">
                    <template slot-scope="scope">
                        {{$tools.formatDate(parseInt(scope.row.create_time))}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                width="400px">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleDetail(scope.row)">查看</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleEditor(scope.row)">修改</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleCreateSubject(scope.row)">添加科目</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="showDeleteBox(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <I-table-editor v-model="showDelete" 
            width="336px"
            title="删除"
            v-if="row">
                <template slot="content">
                    <el-row>你确定删除{{row.name}}</el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showDelete = false">取 消</el-button>
                    <el-button type="success"
                    @click="handleDelete">确 定</el-button>
                </template>
            </I-table-editor>
        </template>
        <template slot="foot">
            <I-table-page
            :total="total"
            @change="handlepageChange"></I-table-page>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data () {
        return {
            data: [],
            total: 0,
            current: 1,
            row: null,
            showDelete: false,
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.req()
    },
    methods: {
        req() {
            this.$http.post('/ExamProject/lists', {
                token: this.$tools.getToken(),
                page_number: this.current
            })
            .then(res => {
                this.data = res.data.row
                this.total = parseInt(res.data.page.total)
            })
        },
        handlepageChange(current) {
            this.current = current
            this.req()
        },
        handleDetail (row) {
            this.$router.push({
                name: 'ExamineReadsubject',
                params: {
                    id: row.id
                }
            })
        },
        handleEditor (row) {
            this.$router.push({
                name: 'ExamineEditorsubject',
                params: {
                    id: row.id
                }
            })
        },
        handleCreateSubject (row) {
            this.$router.push({
                name: 'ExamineSubjectCreate',
                params: {
                    project_id: row.id,
                    subject_id: 0,
                }
            })
        },
        showDeleteBox (row) {
            this.row = row
            this.showDelete = true
        },
        handleDelete () {
            this.showDelete = false
            this.$http.post('/ExamProject/delete', {
                token: this.$tools.getToken(),
                id: this.row.id
            })
            .then(res => {
                this.$message.success(res.info)
                this.req()
            })
        },
        handleCreate () {
            this.$router.push({
                name: 'ExamineListCreate'
            })
        },
        toSubjectList (row) {
            this.$router.push({
                name: 'ExamineSubjectList',
                params: {
                    id: row.id
                }
            })
        },
    }
}
</script>
