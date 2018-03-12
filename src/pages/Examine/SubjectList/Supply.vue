<template>
    <Base-right class="supply"
    title="成绩补录"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div
            :style="`padding-left: 180px;overflow: auto; height: ${props.maxHeight}px;`">
                <el-select v-model="userinfo" placeholder="请选取学生信息" class="select-userinfo">
                    <el-option
                    v-for="(item, index) in userinfoOptions"
                    :key="index"
                    :label="`姓名：${item.name} 班级：${item.grade_alias} 学号：${item.exam_no}`"
                    :value="item.students_id">
                        <el-col
                        :span="8">姓名：{{item.name}}</el-col>
                        <el-col
                        :span="8">班级：{{item.grade_alias}}</el-col>
                        <el-col
                        :span="8">学号：{{item.exam_no}}号</el-col>
                    </el-option>
                </el-select>

                <div class="score-detail-group">
                    <div class="score-detail">
                        <el-row class="score-detail-title">分数详情</el-row>
                        <el-row>
                            <el-form 
                            label-width="75px"
                            :model="formData">
                                <el-form-item 
                                :label="item.label"
                                :key="index"
                                v-for="(item, index) in options">
                                    <template slot-scope="scope">
                                        <img class="score-detail-icon" src="/static/imgs/paper.png"
                                        @click="clickInput(item.detail)">
                                        <el-input-number v-model="formData[item.prop]" placeholder="请输入分数" style="width: 100%;"
                                        :min="0"></el-input-number>
                                    </template>
                                </el-form-item>
                                <!-- <el-form-item label="第2题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item>
                                <el-form-item label="第3题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item>
                                <el-form-item label="第4题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item> -->
                            </el-form>
                        </el-row>
                    </div>
                    <el-row type="flex" class="row-bg" justify="center" style="padding: 20px 0 30px 0;">
                        <el-button type="primary" class="confirm"
                        @click="submit">保存</el-button>
                        <el-button type="primary" style="margin-left: 20px;"
                        @click="formDataToZero">全打0分</el-button>
                    </el-row>
                </div>
            </div>

            <I-table-editor v-model="showBox" 
            :title="`第${row.number}题答案`"
            width="498px">
                <template slot="content">
                    <el-row class="supply-box-item">
                        <el-col class="supply-box-item-label"
                        :span="4">
                            <span>分</span>
                            <span>数：</span>
                        </el-col>
                        <el-col
                        :span="20">
                            <!-- <el-input v-model="row.point" disabled></el-input> -->
                            <div class="el-textarea__inner">{{row.point}}</div>
                        </el-col>
                    </el-row>
                    <el-row class="supply-box-item">
                        <el-col class="supply-box-item-label"
                        :span="4">
                            <span>答</span>
                            <span>案：</span>
                        </el-col>
                        <el-col
                        :span="20">
                            <!-- <el-input v-model="row.answer" placeholder="请输入内容" disabled
                            :rows="8"
                            type="textarea"></el-input> -->
                            <div class="el-textarea__inner" style="min-height: 100px;"
                            v-html="row.answer"></div>
                        </el-col>
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button type="success"
                    @click="showBox = false">确 定</el-button>
                </template>
            </I-table-editor>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import { ITableEditor,} from '@/components/Table/'

export default {
    data () {
        return {
            userinfo: null,
            userinfoOptions: [],
            formData: {},
            data: [], // 试卷信息
            options: [], // table col
            showBox: false,
            row: {}, // data 行数据
            tableColVar: 'col',
        }
    },
    components: {
        BaseRight,
        ITableEditor,
    },
    mounted () {
        this.req()
        this.getPaper()
    },
    methods: {
        // 获取未识别的学生
        req () {
            this.$http.post('/ExamMakeup/unidenStudent', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.userinfoOptions = res.data
                if (res.data.length === 0) {
                    this.$message.error('已经没有需要补录的学生了')
                }
            })
        },
        // 获取试卷信息
        getPaper () {
            this.$http.post('/ExamMakeup/paper', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })
            .then(res => {
                this.data = res.data
                this.setData()                
            })
        },
        clickInput (detail) {
            let t = document.createElement('div')
            t.innerHTML = detail.answer
            this.row = Object.assign({}, detail, {
                answer: t.innerText
            })
            this.showBox = true
        },
        // 根据试卷消息生成form
        setData () {
            this.data.forEach((item, index) => {
                let prop = this.tableColVar + item.number
                this.formData[prop] = 0
                this.options.push({
                    prop,
                    label: `第${item.number}题`,
                    detail: item,
                })
            })
        },
        submit () {
            if (this.userinfo === null) {
                this.$message.error('请选择学生')
                return
            }
            let numberObj = {}
            for (let key of Object.keys(this.formData)) {
                let s = this.formData[key]
                numberObj[key.replace('col', '')] = s
            }
            this.$http.post('/ExamMakeup/makeup', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                students_id: this.userinfo,
                number_point: JSON.stringify(numberObj)
            })
            .then(res => {
                this.$message.success(res.info)
                this.userinfo = null
                this.$nextTick(() => {
                    this.req()
                })
            })
        },
        // 设置到零分
        formDataToZero () {
            let obj = {}
            for (let key of Object.keys(this.formData)) {
                obj[key] = 0
            }
            this.formData = obj
        },
    }
}
</script>

<style lang="less" scoped>
.score-detail {
    padding: 25px;
    border: 1px solid #e2e2e4;
    &-title {
        padding-bottom: 20px;
        font-size: 16px;
        color: #8c8c8c;
    }
    &-icon {
        position: absolute;
        left: -70px;
        top: 11px;
    }
    &-input {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 1;
        outline: 0;
        padding: 0 15px;
        width: 100%;
        vertical-align: middle;
        line-height: 39px;
        color: #ccc;
    }
}
.select-userinfo {
    margin-bottom: 20px;
    border: 1px solid #fff;
}
.select-userinfo, .score-detail-group {
    width: 440px;
}
.supply {
    &-box-item {
        padding-bottom: 20px;
        &-label {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>

