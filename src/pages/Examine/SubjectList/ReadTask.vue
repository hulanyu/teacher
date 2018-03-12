<template>
    <Base-right
    title="查看任务"
    isBack>
        <template slot-scope="props">
            <div
            :style="`overflow: auto; height: ${props.maxHeight}px;`">
                <Base-detail class="list-detail"
                title1="试卷信息"
                title2="评卷信息"
                title3="题块信息">
                    <template slot="item1">
                        <el-table
                        :data="model.data1"
                        style="width: 100%">
                            <el-table-column
                                prop="paper_name"
                                label="试卷名称">
                            </el-table-column>
                            <el-table-column
                                prop="subject"
                                label="科目">
                            </el-table-column>
                            <el-table-column
                                prop="staff_number"
                                label="教师人数">
                            </el-table-column>
                            <el-table-column
                                prop="staff_name"
                                label="教师权限">
                            </el-table-column>
                        </el-table>
                    </template>
                    <template slot="item2">
                        <el-table
                        :data="model.data2"
                        style="width: 100%">
                            <el-table-column
                                prop="name"
                                label="教师姓名">
                            </el-table-column>
                            <el-table-column
                                prop="job_number"
                                label="工号">
                            </el-table-column>
                            <el-table-column
                                prop="power"
                                label="教师权限">
                                <template slot-scope="scope">
                                    {{POWER_MAP[String(scope.row.power)]}}
                                </template>
                            </el-table-column>
                            <el-table-column
                            :key="index"
                            v-for="(item, index) in data2Col"
                            :prop="item.prop"
                            :label="item.label">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row[item.prop]" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <template slot="item3">
                        <el-table
                        :data="model.data3"
                        style="width: 100%">
                            <el-table-column
                                prop="number"
                                label="题号">
                            </el-table-column>
                            <el-table-column
                                prop="count"
                                label="教师人数">
                            </el-table-column>             
                        </el-table>
                    </template>
                </Base-detail>
                <el-row style="padding: 20px 0;">
                    <!-- <el-button class="confirm"
                    @click="$emit('change', false)">上一步</el-button> -->
                    <el-button type="primary"
                    @click="$router.go(-1)">确认</el-button>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import BaseDetail from '../BaseDetail'
import config from '../../../config'

export default {
    data () {
        return {
            model: {
                data1: [],
                data2: [],
                data3: [],
            },
            data2Col: [],
            POWER_MAP: config.POWER_MAP,
            tableColQuestionVar: 'col',
        }
    },
    components: {
        BaseRight,
        BaseDetail,
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            this.$http.post('/ExamTask/info', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.model.data1 = [res.data.exam]
                
                let data2 = []
                for (let key of Object.keys(res.data.question)) {
                    let value = res.data.question[key]
                    // let t = {}
                    // value.question.forEach(item => {
                    //     t[this.tableColQuestionVar + item] = true
                    // })
                    // data2.push(Object.assign({}, value, t))
                    data2.push(value)
                }
                console.log(1, JSON.stringify(data2))
                this.model.data2 = data2
                this.setData2Col()
                this.setData2Question()

                this.model.data3 = res.data.number
            })
        },
        setData2Col () {
            let t = []
            this.model.data2.forEach(item1 => {
                t = t.concat(item1.question)
            })
            this.data2Col = Array.from(new Set(t)).map(item => {
                return {
                    label: `第${item}题`,
                    prop: `${this.tableColQuestionVar}${item}`,
                    value: item
                }
            }).sort((a, b) => {
                return a.value > b.value
            })
        },
        setData2Question () {
            this.model.data2.forEach(item => {
                let t = {}
                for (let colItem of this.data2Col) {
                    if (item.question.indexOf(colItem.value) === -1) {
                        t[this.tableColQuestionVar + colItem.value] = false
                    } else {
                        t[this.tableColQuestionVar + colItem.value] = true
                    }             
                }

                Object.assign(item, t)
                // data2.push(Object.assign({}, value, t))
            })
            console.log(3, JSON.stringify(this.model.data2))
            // for (let key of Object.keys(res.data.question)) {
            //     let value = res.data.question[key]
            //     // let t = {}
            //     // value.question.forEach(item => {
            //     //     t[this.tableColQuestionVar + item] = true
            //     // })
            //     // data2.push(Object.assign({}, value, t))
            //     data2.push(value)
            // }
        },
    }
}
</script>
