<template>
    <Base-right
    title="查看任务"
    isBack
    @update="init">
        <template slot-scope="props">
            <div
            :style="`overflow: auto; height: ${props.maxHeight}px;`">
                <Base-detail class="create-submit"
                title1="试卷基本信息"
                title2="题块信息"
                title3="小题分数信息">
                    <template slot="item1">
                        <el-table
                        :data="model1"
                        style="width: 100%">
                            <el-table-column
                                prop="name"
                                label="项目名称">
                            </el-table-column>
                            <el-table-column
                                prop="paper_title"
                                label="试卷名称">
                            </el-table-column>
                            <el-table-column
                                prop="subject"
                                label="科目名称">
                            </el-table-column>
                            <el-table-column
                                prop="count1"
                                label="主观题满分">
                            </el-table-column>
                        </el-table>
                    </template>
                    <template slot="item2">
                        <el-table
                        :data="model2"
                        style="width: 100%">
                            <el-table-column
                                prop="number"
                                label="题号">
                            </el-table-column>
                            <el-table-column
                                prop="score"
                                label="分数">
                            </el-table-column>
                            <el-table-column
                                prop="ratio"
                                label="双评比例">
                            </el-table-column>
                            <el-table-column
                                prop="question_count"
                                label="小题数">
                            </el-table-column>
                            <el-table-column
                                prop="read_time"
                                label="最短批阅时间（秒）">
                            </el-table-column>
                        </el-table>
                    </template>
                    <template slot="item3">
                        <el-table
                        :data="model3"
                        style="width: 100%">
                            <el-table-column
                                prop="bNumber"
                                label="大题号">
                            </el-table-column>
                            <el-table-column
                                prop="sNumber"
                                label="小题号">
                            </el-table-column>
                            <el-table-column
                                prop="sScore"
                                label="小题分值">
                            </el-table-column>
                            <el-table-column
                                prop="deviation"
                                label="小题误差阈值">
                            </el-table-column>                
                        </el-table>
                    </template>
                </Base-detail>

                <el-row style="padding: 20px 0;">
                    <el-button class="confirm"
                    @click="$router.go(-1)">返回</el-button>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import BaseDetail from '../BaseDetail'

export default {
    data () {
        return {
            model1: [],
            model2: [],
            model3: [],
            QUESTIONTYPE1: 1, // 客观题
            QUESTIONTYPE2: 2, // 主观题
        }
    },
    components: {
        BaseDetail,
        BaseRight,
    },
    mounted () {
        this.init()
    },
    methods: {
        async init () {
            // 基本信息
            let res1 = await this.$http.post('/Exam/info', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })

            // 大题信息
            let res2 = await this.$http.post('/Exam/bigQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })

            // 小题信息
            let res3 = await this.$http.post('/Exam/smallQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })

            let count0 = 0
            let count1 = 0
            res2.data.forEach(item => {
                count0 += parseInt(item.score)
                // 主观分
                if (parseInt(item.question_type) === this.QUESTIONTYPE2) {
                    count1 += parseInt(item.score)
                }
            })
            this.model1 = [
                {
                    name: res1.data.name,
                    paper_title: res1.data.paper_title,
                    subject: `${res1.data.subject}【试卷满分: ${count0}】`,
                    count1,
                }
            ]
            this.model2 = res2.data.map(item => {
                return {
                    number: item.number,
                    score: item.score,
                    ratio: item.ratio,
                    question_count: item.question_count,
                    read_time: item.read_time,
                }
            })
            this.model3 = []
            for (let key in res3.data) {
                let item = res3.data[String(key)]
                item.child.forEach(item2 => {
                    this.model3.push({
                        bNumber: item.number,
                        sNumber: item2.number,
                        sScore: item2.score,
                        deviation: item2.deviation,
                    })  
                })
            }
        }
    }
}
</script>

<style>
.list-detail {
    width: 100% !important;
}
</style>

