<template>
    <Base-right class="examine-listeditor"
    title="新建考试项目"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div
            :style="`overflow: auto; height: ${props.maxHeight}px`">
                <el-row style="width: 450px; margin: 0 auto; padding: 30px 0;">
                    <el-steps :active="active" align-center>
                        <el-step
                        :key="index"
                        v-for="(item, index) in stepsList"
                        :title="item.title">
                            <template slot="icon">
                                <img 
                                :src="computedStepsIcon(index)">
                            </template>
                        </el-step>
                    </el-steps>
                </el-row>
                <el-row>
                    <!-- <template
                    v-if="active === ACTIVE_CREATESUBJECT">
                        <Create-createsubject class="create-item"
                        :model="createsubjectObj"></Create-createsubject>
                    </template> -->
                    <template
                    v-if="active === ACTIVE_PAPER">
                        <create-paper class="create-item"
                        :model.sync="createPaperObj"
                        :submitStatus="submitStatus"
                        @stepsNext="stepsNext"></create-paper>
                    </template>
                    <template
                    v-if="active === ACTIVE_RULE">
                        <Create-rule class="create-item"
                        :type="ruleActive"
                        :submitStatus="submitStatus"
                        :model1="CreateRule1Obj"
                        :model2="CreateRule2Obj"
                        @stepsNext="stepsNext"></Create-rule>
                    </template>
                    <template
                    v-if="active === ACTIVE_SUBMIT">
                        <Create-submit class="create-item"
                        :model="CreateSubmitObj"></Create-submit>
                    </template>
                </el-row>
                <el-row class="create-action" type="flex" justify="center">
                    <el-button class="confirm"
                    v-if="active >= 1"
                    @click="stepsBack">上一步</el-button>
                    <el-button class="confirm"
                    v-if="active < stepsList.length - 1"
                    @click="stageSubmit">下一步</el-button>
                    <el-button style="width: 89px;"
                    type="primary"
                    v-else
                    @click="submit">完成</el-button>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

import CreatePaper from './CreatePaper'
import CreateRule from './CreateRule'
import CreateSubmit from './CreateSubmit'

export default {
    props: {
        
    },
    data () {
        return {
            stepsList: [
                {
                    title: '选择试卷',
                    class: 'examine_paper',
                },
                {
                    title: '设置评分规则',
                    class: 'examine_rule',
                },
                {
                    title: '完成配置',
                    class: 'examine_submit',
                },
            ],
            active: 0,
            // 设置评分规则模块
            ruleActive: 0,
            // ACTIVE_CREATESUBJECT: 0,
            ACTIVE_PAPER: 0,
            ACTIVE_RULE: 1,
            ACTIVE_SUBMIT: 2,
            // // 新建考试项目
            // createsubjectObj: {
            //     subjectName: '',
            //     subjectAlias: '',
            //     subjectLeader: '',
            //     dataTime: '',
            //     count: 0
            // },
            // 选择试卷
            createPaperObj: {
                // paperName: '',
                paperId: null,
                // subject: null,
                subjectId: null,
                // grade: null,
                gradeId: null,
                maxScore: null,
            },
            // 设置评分规则1 大题
            CreateRule1Obj: {},
            // 设置评分规则2 小题
            CreateRule2Obj: {},
            // 完成配置
            CreateSubmitObj: {
                data1: [],
                data2: [],
                data3: [],
            },
            // 表单上下文
            paperCTX: null,
            ruleCTX: null,
            // active到表单的映射
            // CTXMap: {
            //     '0': {
            //         CTX: null,
            //         callback: this.paperCallback.bind(this)
            //     },
            //     '1': {
            //         CTX: null,
            //         callback: this.ruleCallback.bind(this)
            //     },
            // },
            // 提交状态
            submitStatus: false,
        }
    },
    computed: {
        // 判断当前是添加或是修改
        isAdd () {
            return parseInt(this.$route.params.subject_id) ? false : true
        }
    },
    watch: {
        // paperCTX (val) {
        //     try {
        //         this.CTXMap[String(this.active)].CTX = val
        //     } catch (err) {}
        // },
        // ruleCTX (val) {
        //     try {
        //         this.CTXMap[String(this.active)].CTX = val
        //     } catch (error) {}
        // }
    },
    components: {
        BaseRight,
        CreatePaper,
        CreateRule,
        CreateSubmit,
    },
    mounted () {
        // if (!this.isAdd) {
        //     this.getPaperDetail()
        // }
    },
    methods: {
        computedStepsIcon (index) {
            let c = `/static/imgs/${this.stepsList[index].class}`
            if (this.active >= index) {
                c = c + '_suc'
            }
            c = c + '.png'
            return c;
        },
        stepsBack () {
            if (!this.active) {
                return
            }
            this.submitStatus = false
            if (this.active === this.ACTIVE_RULE && this.ruleActive > 0) {
                this.ruleActive--
            } else {
                this.ruleActive = 0
                this.active--
            }
        },
        // 下一步
        // 如果失败回退
        stepsNext (success) {
            console.log(1, this.active >= this.stepsList.length - 1)
            if (this.active >= this.stepsList.length - 1) {
                return
            }
            this.submitStatus = false
            if (!success) {
                return
            }
            if (this.active === this.ACTIVE_RULE && this.ruleActive < 1) {
                this.ruleActive++
            } else {
                this.ruleActive = 0
                this.active++
            }
        },
        stageSubmit () {
            //
            this.submitStatus = true
            // const CTX = this.CTXMap[String(this.active)]
            // if (!CTX) {
            //     return
            // }
            // CTX.CTX.validate((valid) => {
            //     if (valid) {
            //         CTX.callback(() => {
            //             this.stepsNext()
            //         })
            //     } else {
            //         return false;
            //     }
            // })
        },
        submit () {
            this.$router.go(-1)
        },
        // // 试卷提交
        // // subject_id 0 '/Exam/add'
        // // subject_id !0 '/Exam/edit'
        // paperCallback (callback=()=>{}) {
        //     let url
        //     let obj
        //     if (!this.isAdd) {
        //         url = '/Exam/edit'
        //         obj = {
        //             id: this.$route.params.subject_id,
        //             paper_id: this.createPaperObj.paperId
        //         }
        //     } else {
        //         url = '/Exam/add'
        //         obj = {
        //             project_id: this.$route.params.project_id,
        //             paper_id: this.createPaperObj.paperId  
        //         }
        //     }
        //     this.$http.post(url, obj)
        //     .then(res => {
        //         // this.$message.success(Object.assign({}, res.info, {
        //         //     token: this.$tools.getToken()
        //         // }))
        //         this.$message.success(res.info)
        //         if (this.isAdd) {
        //             this.$router.replace({
        //                 name: 'ExamineSubjectCreate',
        //                 params: {
        //                     project_id: this.$route.params.project_id,
        //                     subject_id: res.data.exam_id,
        //                 }
        //             }, () => {
        //                 callback()
        //             })
        //         } else {
        //             callback()
        //         }
        //     })
        // },
    }
}
</script>

<style lang="less">
.examine-listeditor {
    .examine_create {
        background: url('/static/imgs/examine_create.png') no-repeat;
    }
    .create-action button{
        margin: 40px 20px 60px 20px;
    }
    .create-item {
        width: 450px;
        margin: 0 auto;
        padding: 30px 0;
    }
}
</style>

