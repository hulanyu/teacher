<template>
    <div class="create-rule">
        <!-- 第一步(取消) -->
        <!-- <el-form class="create-rule-1"
        v-if="type == 0"
        :model="model"
        label-width="150px">
            <el-form-item label="设置评分规则（1）：">
            </el-form-item>
            <el-form-item label="试卷分发方式：">
                <el-select v-model="model.a" placeholder="请选择" style="width: 100%;">
                    <el-option label="随机分发" value="sjff"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="每次分发数量：">
                <el-input v-model="model.a" placeholder=""></el-input>
            </el-form-item>
        </el-form> -->
        <!-- 第二步 -->
        <div class="create-rule-2"
        v-if="type == type1">
            <el-row style="padding: 20px 0;">
                设置评分规则（1）：
            </el-row>
            <el-row>
                <Createrule-table
                :data="rule1Data">
                    <template slot="head">
                        <Createrule-table-column
                        label="序号"
                        width="80"></Createrule-table-column>
                        <Createrule-table-column
                        label="分数"
                        width="135"></Createrule-table-column>
                        <Createrule-table-column class="help"
                        label="双评比例"
                        width="110">
                            双评比例
                            <img src="/static/imgs/help.png">
                            <div class="show-help">
                                请输入0-100，如果输入为1，请采用单评方式
                            </div>
                        </Createrule-table-column>
                        <Createrule-table-column
                        label="小题数"
                        width="165"></Createrule-table-column>
                        <Createrule-table-column
                        label="最短批阅时"
                        width="180"></Createrule-table-column>
                    </template>
                    <template slot="body" slot-scope="props">
                        <td>{{props.row.id}}</td>
                        <td>{{props.row.score}}</td>
                        <td class="rule-table-editor">
                            <div style="margin: 0 10px;">
                                <el-input-number v-model="props.row.ratio" placeholder="请输入内容"
                                :min="0"
                                :max="100"></el-input-number>
                            </div>
                        </td>
                        <td>{{props.row.question_count}}</td>
                        <td class="rule-table-editor">
                            <div style="margin: 0 10px;">
                                <el-input-number v-model="props.row.read_time" placeholder="请输入内容"
                                :min="0"></el-input-number>
                            </div>
                        </td>
                    </template>
                </Createrule-table>
            </el-row>
        </div>
        <!-- 第三步 -->
        <div class="create-rule-3"
        v-if="type == type2">
            <el-row style="padding: 20px 0 40px 0;">小数参数设置：</el-row>
            <Createrule-table
            :data="rule2Data">
                <template slot="head">
                    <Createrule-table-column
                    label="大题号"
                    width="80"></Createrule-table-column>
                    <Createrule-table-column
                    label="小题号"
                    width="150"></Createrule-table-column>
                    <Createrule-table-column
                    label="小题分数"
                    width="135"></Createrule-table-column>
                    <Createrule-table-column
                    label="小题误差阈值"
                    width="170"></Createrule-table-column>
                    <Createrule-table-column
                    label="大题总分"
                    width="160"></Createrule-table-column>
                </template>
                <template slot="body" slot-scope="props">
                    <td
                    v-if="props.row.headInfo"
                    :rowspan="props.row.headInfo.question_count">
                        {{props.row.headInfo.number}}
                    </td>

                    <td>{{props.row.number}}</td>
                    <td>{{props.row.score}}</td>
                    <td class="rule-table-editor">
                        <div style="margin: 0 10px;">
                            <el-input-number v-model="props.row.deviation" placeholder="请输入内容"
                            :min="1"></el-input-number>
                        </div>
                    </td>

                    <td
                    v-if="props.row.headInfo"
                    :rowspan="props.row.headInfo.question_count">
                        {{props.row.headInfo.score}}
                    </td>
                </template>
            </Createrule-table>
        </div>
    </div>
</template>

<script>
import CreateruleTable from './CreateRuleTable'
import CreateruleTableColumn from './CreateRuleTableColumn'

export default {
    props: {
        model1: Object,
        model2: Object,
        type: {
            type: Number,
            default: 0,
        },
        submitStatus: {
            type: Boolean,
            default: false,
        }
    },
    data () {
        return {
            rule1Data: [],
            rule2Data: [],
            type1: 0,
            type2: 1,
        }
    },
    watch: {
        type (val) {
            this.exec()
        },
        submitStatus (val) {
            if (val) {
                if (this.type === this.type1) {
                    this.rule1Callback((success) => {
                        this.$emit('stepsNext', success)
                    })
                } else if (this.type === this.type2) {
                    this.rule2Callback((success) => {
                        this.$emit('stepsNext', success)
                    })
                }
            
                // this.$refs.form.validate((valid) => {
                //     if (valid) {
                //         this.ruleCallback(() => {
                //             // this.stepsNext()
                //             this.$emit('stepsNext')
                //         })
                //     } else {
                //         return false;
                //     }
                // })
            }
        }
    },
    mounted () {
        this.exec()
    },
    components: {
        CreateruleTable,
        CreateruleTableColumn,
    },
    methods: {
        exec () {
            let val = parseInt(this.type)
            // 0 大题
            // 1 小题
            if (val === this.type1) {
                this.getRule1()
            } else if (val === this.type2) {
                this.getRule2()
            }
        },
        getRule1 () {
            this.$http.post('/Exam/bigQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
                // exam_id: 1, // 测试
            })
            .then(res => {
                this.rule1Data = res.data
            })
        },
        getRule2 () {
            this.$http.post('/Exam/smallQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
                // exam_id: 1, // 测试
            })
            .then(res => {
                this.rule2DataNative = res.data
                let arr = []
                // 转换成数组
                for (let key of Object.keys(this.rule2DataNative)) {
                    let value = this.rule2DataNative[String(key)]
                    for (let i = 0, max = value.child.length; i < max; ++i ) {
                        let item = value.child[i]
                        let tObj = Object.assign({}, item)
                        if (i === 0) {
                            tObj['headInfo'] = {
                                "number": value.number,
                                "question_count": value.question_count,
                                "exam_id": value.exam_id,
                                "score": value.score,
                            }
                        }
                        arr.push(tObj)
                    }
                }
                // console.log(1, arr)
                // return
                this.rule2Data = arr
            })
        },
        rule1Callback (callback=()=>{}) {
            let obj = this.rule1Data.map(item => {
                return {
                    id: item.id,
                    number: item.number,
                    read_time: item.read_time,
                    ratio: item.ratio,
                }
            })
            this.$http.post('/Exam/setBigQuestion', {
                token: this.$tools.getToken(),
                question: JSON.stringify(obj),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.$message.success(res.info)
                callback(true)
            })
            .catch(res => {
                callback(false)
            })
        },
        rule2Callback (callback=()=>{}) {
            let headInfo = null
            let obj = this.rule2Data.map(item => {
                if (item.headInfo) {
                    headInfo = item.headInfo
                }
                return {
                    "id": item.id,
                    "big_number": headInfo.number,
                    "small_number": item.number,
                    "deviation": item.deviation,
                }
            })
            // console.log(2, obj)
            // return
            this.$http.post('/Exam/setSmallQuestion', {
                token: this.$tools.getToken(),
                question: JSON.stringify(obj),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.$message.success(res.info)
                callback(true)
            })
            .catch(res => {
                callback(false)
            })
        }
    }
}
</script>

<style lang="less">
.create-rule {
    width: auto !important;
    // margin: 0 auto;
    padding: 30px 0;
    &-1 {
        width: 450px;
        margin: 0 auto;
        padding: 30px 0;
    }
}
</style>

