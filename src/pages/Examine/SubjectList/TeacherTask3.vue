<template>
    <I-table
    title="分配教师工作量"
    isBack
    @update="req">
        <template slot="content" slot-scope="scope">
            <div
            :style="`overflow: auto; height: ${scope.maxHeight}px`">
                <el-table
                border
                row-class-name="table-row"
                :data="tableData"
                @sort-change="handleSortChange">
                    <template
                    v-for="(item, index) in colList">
                        <el-table-column
                        v-if="index >= 2"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row[item.prop]"></el-checkbox>
                            </template>
                        </el-table-column>
                        
                        <el-table-column
                        v-else
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"></el-table-column>
                    </template>
                </el-table>

                <el-row style="padding-top: 20px;">
                    <el-button type="info"
                    size="mini"
                    @click="checkedAllList(true)">全选</el-button>
                    <el-button type="info"
                    size="mini"
                    @click="checkedAllList(false)">全部取消</el-button>
                </el-row>
                <el-row style="padding-top: 45px;">
                    <el-button class="confirm"
                    @click="$emit('change', false)">上一步</el-button>
                    <el-button class="confirm"
                    @click="submit">下一步</el-button>
                </el-row>
            </div>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '../../../config.js'

export default {
    data () {
        return {
            tableData: [],
            colList: [
                {
                    label: '教师姓名',
                    prop: 'name',
                },
                {
                    label: '教师权限',
                    prop: 'powerName',
                },
            ],
            questionNumberVar: 'col', // 题号变量前缀
            POWER_MAP: config.POWER_MAP,
            // sort: '',
            // order: '',
        }
    },
    components: {
        ITable,
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            this.tableData = []
            this.colList = [
                {
                    label: '教师姓名',
                    prop: 'name',
                },
                {
                    label: '教师权限',
                    prop: 'powerName',
                },
            ]
            this.getBigQuestion(() => {
                this.getStaffList()
            })
        },
        // 获取当前科目教师列表
        getStaffList () {
            this.$http.post('/ExamTask/staffLists', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.tableData = res.data.row.filter(item => {
                    return parseInt(item.power) === 1
                }).map(item => {
                    let obj = {
                        name: item.name,
                        power: parseInt(item.power),
                        powerName: this.POWER_MAP[String(item.power)],
                        id: parseInt(item.id), // 阅卷教师id
                        staff_id: parseInt(item.staff_id), // 教师id
                    }
                    this.colList.forEach(item => {
                        if (item.prop.indexOf(this.questionNumberVar) !== -1) {
                            obj[item.prop] = false
                        }
                    })
                    return obj
                })
            })
        },
        handleSortChange({ column, prop, order }) {
            console.log('handleSortChange', column, prop, order);
        },
        // 设置table头
        getCol (list) {
            this.colList = this.colList.concat(list)
        },
        // 全选
        checkedAllList (status) {
            this.tableData.forEach((item, index) => {
                for (let key of Object.keys(item)) {
                    if (typeof key === 'string' && key.indexOf(this.questionNumberVar) !== -1) {
                        item[key] = status
                    }
                }
            })
        },
        // 获取主观大题号
        getBigQuestion (callback=()=>{}) {
            this.$http.post('/Exam/bigQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                question_type: 2,
            })
            .then(res => {
                this.getCol(res.data.map(item => {
                    return {
                        label: `第${item.number}题`,
                        prop: `${this.questionNumberVar}${item.number}`,
                    }
                }))
                callback()
            })
        },
        submit () {
            let task = {}
            this.tableData.forEach((item, index) => {
                let questionNumber = []
                for (let key of Object.keys(this.tableData[index])) {
                    if (key.indexOf(this.questionNumberVar) !== -1 && this.tableData[index][key]) {
                        let num = key.substring(this.questionNumberVar.length)
                        questionNumber.push(parseInt(num))
                    }
                }
                task[item.staff_id] = questionNumber
            })
            // console.log(111, task)
            // return
            this.$http.post('/ExamTask/setTask', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                task: JSON.stringify(task)
            })
            .then(res => {
                this.$message.success(res.info)
                this.$emit('change', true)
            })
        }
    }
}
</script>

<style scoped lang='less'>
.check-box {
    // color: #818181;
    padding: 5px;
    border-radius: 3px;
    &-checked {
        background-color: #f0f0f0;
    }
}
</style>
