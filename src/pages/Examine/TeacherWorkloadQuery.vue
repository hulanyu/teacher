<template>
    <I-table
    title="教师工作量"
    @update="req">
        <template slot="head">
            <span style="color: #9e9e9e;font-size: 16px;">
                考试项目
                <el-select v-model="project" placeholder="请选择"
                @change="handleSelectProject">
                    <el-option
                    v-for="item in projectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span style="color: #9e9e9e;font-size: 16px;">
                考试科目
                <el-select v-model="subject" placeholder="请选择"
                @change="handleSelectSubject">
                    <el-option
                    v-for="item in subjectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <el-button class="confirm" style="float: right;"
            @click="toQueryChart">
                查看统计图
            </el-button>
        </template>
        <template slot="content" slot-scope="props">
            <el-table
            border
            :data="data"
            :height="props.maxHeight"
            row-class-name="table-row"
            @sort-change="handleSortChange">
                <el-table-column
                sortable
                prop="teacher_name"
                label="教师姓名">
                </el-table-column>
                <el-table-column
                sortable
                prop="teacher_no"
                label="工号">
                </el-table-column>
                <el-table-column
                sortable
                prop="teacher_type"
                label="老师权限">
                </el-table-column>
                <el-table-column
                sortable
                prop="count"
                label="评阅分数">
                </el-table-column>
            </el-table>
        </template>
        <!-- <template slot="foot">
            <I-table-page
            :total="total"
            @change="handlepageChange"></I-table-page>
        </template> -->
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data () {
        return {
            data: [],
            // total: 1000,
            // current: 1,
            subject: null,
            subjectOptions: [],
            sort: '',
            order: '',
            project: null,
            projectOptions: [],
        }
    },
    components: {
        ITable,
    },
    mounted () {
        const storage = this.getStorage()
        if (storage) {
            console.log(111)
            this.subject = storage.subject
            this.project = storage.project
            this.getSubject()
            this.req()
        }
        this.getProject()
    },
    methods: {
        req() {
            if (this.subject === null) {
                this.$message.warning('请选择科目')
                return
            }
            let obj = {
                exam_id: this.subject,
                token: this.$tools.getToken(),
            }
            if (this.sort) {
                obj['sort'] = this.sort
            }
            if (this.order) {
                obj['order'] = this.order
            }
            this.$http.post('/Marking/teacherWorkload', obj)
            .then(res => {
                this.data = res.data
            })
        },
        getSubject () {
            this.$http.post('/Exam/lists', {
                token: this.$tools.getToken(),
                page_size: 99999,
                project_id: this.project,
            })
            .then(res => {
                this.subjectOptions = res.data.row.map(item => {
                    return {
                        value: parseInt(item.id),
                        label: item.subject,
                    }
                })
            })
        },
        // handlepageChange(current) {
        //     this.current = current
        // },
        handleSortChange({ column, prop, order }) {
            // console.log('handleSortChange', column, prop, order);
            this.sort = prop
            this.order = order === 'ascending' ? 'asc' : ''
            this.req()
        },
        handleSelectSubject () {
            this.req()
        },
        toQueryChart () {
            if (this.subject === null) {
                this.$message.warning('请选择科目')
                return
            }
            this.setStorage()
            this.$router.push({
                name: 'ExamineQueryChart',
                params: {
                    subject_id: this.subject,
                }
            })
        },
        handleSelectProject () {
            this.subject = null
            this.subjectOptions = []
            this.data = []
            this.getSubject()
        },
        getProject () {
            this.$http.post('/ExamProject/lists', {
                token: this.$tools.getToken(),
                page_size: 999999,
            })
            .then(res => {
                this.projectOptions = res.data.row.map(item => {
                    return {
                        value: parseInt(item.id),
                        label: item.name,
                    }
                })
            })
        },
        setStorage () {
            sessionStorage.setItem('TeacherWorkloadQuery', JSON.stringify({
                project: this.project, 
                subject: this.subject,
            }))
        },
        getStorage () {
            const data = sessionStorage.getItem('TeacherWorkloadQuery')
            if (!data) {
                return ''
            }
            return JSON.parse(data)
        },
    }
}
</script>
