<template>
    <Base-right class="question-create"
    :isUpdate="false"
    :title="title">
        <template slot-scope="props">
            <el-form :style="'overflow: auto; height:' + props.maxHeight + 'px'"
            :model="formData"
            size="small">
                <el-row>
                    <el-col
                    :span="8">
                        <el-form-item label="版本:" label-width="70px">
                            <el-select @change="changeGet('version')" v-model="formData.versions_id" placeholder="请选择版本">
                                <el-option
                                v-for="(item,index) in versionData"
                                :key="index"
                                :label="item.versions"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="年级:" label-width="70px">
                            <el-select @change="changeGet('grade')" v-model="formData.class_id" placeholder="请选择年级">
                                <el-option
                                v-for="(item,index) in gradeData"
                                :key="index"
                                :label="item.class"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="科目:" label-width="70px">
                            <el-select @change="changeGet('subject')" v-model="formData.subject_id" placeholder="请选择科目">
                                <el-option
                                v-for="(item,index) in sujectData"
                                :key="index"
                                :label="item.subject"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col
                    :span="8">
                        <el-form-item label="章:" label-width="70px">
                            <el-select @change="changeGet('chapter')" v-model="formData.chapter_id" placeholder="请选择章节">
                                <el-option
                                v-for="(item,index) in chapterData"
                                :key="index"
                                :label="item.chapter"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="节:" label-width="70px">
                            <el-select @change="changeGet('unit')" v-model="formData.node_id" placeholder="请选择章节">
                                <el-option
                                v-for="(item,index) in nodeData"
                                :key="index"
                                :label="item.chapter"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="题类:" label-width="70px">
                            <el-select @change="changeGet('questionClass')" v-model="formData.questionClass" placeholder="请选择题类">
                                <el-option
                                v-for="(value, key) in QUESTION_CLASS"
                                :key="key"
                                :label="value"
                                :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col
                    :span="8">
                        <el-form-item label="题型:" label-width="70px">
                            <el-select @change="changeGet('type')" v-model="formData.category_id" placeholder="请选择题型">
                                <el-option
                                v-for="(item,index) in typeData"
                                :key="index"
                                :label="item.title"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="难度:" label-width="70px">
                            <el-select @change="changeGet('easy_type')" v-model="formData.easy_type" placeholder="请选择难度">
                                <el-option
                                v-for="(item,index) in difficultyData"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="题目描述:">
                    <script id="editorDescribe" type="text/plain" style="width:800px;height:200px;"></script>
                </el-form-item>
                <div
                v-show="formData.questionClass === QUESTION_CLASS_1">
                    <el-form-item label="答案:">
                        <script id="editorResult" type="text/plain" style="width:800px;height:200px;"></script>
                    </el-form-item>                
                </div>
                <div
                v-show="formData.questionClass === QUESTION_CLASS_2">
                    <el-form-item label="正确答案:">
                        <el-checkbox-group v-model="answerGroup">
                            <el-checkbox 
                            :key="item"
                            v-for="item in activeAnswerList"
                            :label="item">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>  
                </div>

                <el-button class="confirm" @click="back" style="color: #fff;">返回</el-button>
                <el-button type="primary"
                @click="handleSubmit">确定</el-button>
            </el-form>
        </template>
    </Base-right>
</template>

<script>
// 没有区分学校、年级、教师的req的url
import BaseRight from '@/components/BaseRight/BaseRight'
import config from '@/config'

export default {
    props: {
        title: String,
        // 组件模式
        // c 创建 w 修改
        mode: {
            type: String,
            default: 'c'
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            // 传入的数据
            localData: {},
            checkFlag:true,
            //提交数据
            formData: {
                versions_id: '',
                class_id: '',
                subject_id: '',
                chapter_id: '',
                node_id: '',
                question_type: '', // 系统 学校 年级 教师 
                questionClass:'', // 0 主观题 客观题
                category_id: '',
                easy_type: '',
                content: '',
                answer: '',
            },
            queryKeyList: [
                'versions_id',
                'class_id',
                'subject_id',
                'chapter_id',
                'node_id',
                'questionClass',
                'category_id',
                'content',
                'answer',
            ],
            //列表数据
            versionData:[],
            gradeData:[],
            sujectData:[],
            chapterData:[],
            nodeData:[],
            typeData:[],
            difficultyData:[
                {
                    id: '1',
                    name:"简单"
                },
                {
                    id: '2',
                    name:"一般"
                },
                {
                    id: '3',
                    name:"困难"
                }
            ],
            queryDataList: [
                'versionData',
                'gradeData',
                'sujectData',
                'chapterData',
                'nodeData',
                '',
                'typeData',
            ],

            editorDescribe: null,
            editorResult: null,
            
            ueditorToolbarsConfig: [
                [
                    'fullscreen',
                    'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                    'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 
                    'touppercase', 'tolowercase', '|',
                    'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'simpleupload', 'insertimage', '|',
                    'spechars', 'snapscreen', 'wordimage', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                ]
            ],

            QUESTION_CLASS: config.QUESTION_CLASS,
            QUESTION_CLASS_1: config.QUESTION_CLASS_1,
            QUESTION_CLASS_2: config.QUESTION_CLASS_2,
            activeAnswerList: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
            ],

            // 题类为客观题时，使用多选
            answerGroup: [],
        }
    },
    watch: {
        data (newVal) {
            this.initData(newVal)
        }
    },
    components: {
        BaseRight
    },
    mounted () {
        this.formData.question_type = this.$route.params.type
        let t = setInterval(() => {
            if (!UE) {
                return
            }

            this.createEditorDescribe()
            this.createEditorResult() 

            this.initData(this.data)
            clearInterval(t)
        }, 100)

        this.getVersions()
    },
    beforeDestroy () {
        this.editorDescribe.destroy()
        this.editorResult.destroy()
    },
    methods: {
        initData (newVal) {
            if (this.mode === 'w') {
                this.localData = newVal
                const t = () => {
                    if (!this.editorDescribe && !this.editorResult) {
                        setTimeout(() => {
                            t()
                        }, 100)
                    } else {
                        this.setFormData()
                    }
                }
                t()
            }
        },
        setFormData () {
            let data = this.localData

            this.formData.versions_id = data.vid
            this.formData.class_id = data.clid
            this.formData.subject_id = data.sid
            this.formData.chapter_id = data.chid
            this.formData.node_id = data.unitid
            // this.formData.question_type = data.
            this.formData.questionClass = data.is_type
            this.formData.category_id = data.cid
            this.formData.easy_type = data.easy_type
            // this.formData.content = data.content
            // this.formData.answer = data.answer
            
            this.editorDescribe.setContent(this.$tools.transformHTML(data.content || ''))
            if (this.formData.questionClass === this.QUESTION_CLASS_1) {
                // 主观
                this.editorResult.setContent(this.$tools.transformHTML(data.answer || ''))
            } else if (this.formData.questionClass === this.QUESTION_CLASS_2) {
                // 客观
                this.answerGroup = data.answer.split('')
            }

            this.getVersions(true)
        },
        //一进来获取
        //获取版本
        getVersions(hasID=false) {
            this.versionData = []
            this.$nextTick(() => {
                this.$http.get('./Question/getVersions')
                .then(res=>{
                    this.versionData = res.data
                    if (!hasID) {
                        this.formData.versions_id = this.versionData[0].id
                    }
                    this.getClass(hasID)
                })
            })
        },
        //获取年级
        getClass(hasID=false) {
            this.gradeData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getClass', {
                    token:localStorage.jxtoken,
                    versions_id:this.formData.versions_id
                })
                .then(res=>{
                    this.gradeData = res.data
                    if (!hasID) {
                        this.formData.class_id = this.gradeData[0].id
                    }
                    this.getSubject(hasID)
                    
                })
            })
        },
        //获取科目
        getSubject(hasID=false) {
            this.sujectData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getSubject', {
                    token:localStorage.jxtoken,
                    versions_id:this.formData.versions_id,
                    class_id:this.formData.class_id
                })
                .then(res=>{
                    this.sujectData = res.data
                    if (!hasID) {
                        this.formData.subject_id = this.sujectData[0].id
                    }
                    this.getChapter(hasID)
                })
            })
        },
        //获取章
        getChapter(hasID=false) {
            this.chapterData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getChapter', {
                    token:localStorage.jxtoken,
                    versions_id:this.formData.versions_id,
                    class_id:this.formData.class_id,
                    subject_id:this.formData.subject_id,
                })
                .then(res=>{
                    this.chapterData = res.data
                    if (!hasID) {
                        this.formData.chapter_id = this.chapterData[0].id
                    }
                    this.getNodeData(hasID)
                })
            })
        },
        // 获取节
        getNodeData (hasID=false) {
            this.nodeData = []
            this.$nextTick(() => {
                this.$http.post('/Question/getUnit', {
                    token: this.$tools.getToken(),
                    versions_id: this.formData.versions_id,
                    class_id: this.formData.class_id,
                    subject_id: this.formData.subject_id,
                    chapter_id: this.formData.chapter_id,

                    // // 测试
                    // versions_id: this.formData.versions_id,
                    // class_id: 201,
                    // subject_id: 2,
                    // chapter_id: 35,
                })
                .then(res=>{
                    this.nodeData = res.data
                    if (!hasID) {
                        this.formData.node_id = this.nodeData[0].id
                    }
                    this.getCategory(hasID)
                })
            })
        },
        //获题型
        getCategory(hasID=false) {
            this.typeData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getCategory', {
                    token:localStorage.jxtoken,
                    versions_id:this.formData.versions_id,
                    class_id:this.formData.class_id,
                    subject_id:this.formData.subject_id,
                    type:this.formData.questionClass,
                })
                .then(res=>{
                    this.typeData = res.data
                    if (!hasID) {
                        this.formData.category_id = this.typeData[0].id
                    }
                })
            })
        },
        // 重置查询项
        resetQuery (startIndex=0) {
            let arr, arr2;

            startIndex = parseInt(startIndex)
            arr = this.queryDataList.slice(startIndex)
            arr.forEach(key => {
                if (!key) {
                    return
                }
                this[key] = []
            })

            arr2 = this.queryKeyList.slice(startIndex)
            arr2.forEach(key => {
                if (!key) {
                    return
                }
                this.formData[key] = ''
            })
        },
        //下拉选择
        changeGet(name) {
            switch (name) {
                case 'version':
                    this.formData.class_id = ''
                    this.resetQuery(1)                    
                    this.getClass()
                break
                case 'grade':
                    this.formData.subject_id = ''
                    this.resetQuery(2)
                    this.getSubject()
                break
                case 'subject':
                    this.formData.chapter_id = ''
                    this.resetQuery(3)
                    this.getChapter()
                break
                case 'chapter':
                    this.formData.node_id = ''
                    this.resetQuery(4)
                    this.getNodeData()
                break
                case 'unit':
                    // this.formData.category_id = ''
                    this.resetQuery(5)
                    this.getCategory()
                break
                case 'questionClass':
                    // alert('需要传输数据')
                    this.formData.category_id = ''
                    this.resetQuery(6)
                    this.getCategory()
                break
                case 'type':
                break
                case 'easy_type':
                break                
                default: alert('未知状态')
            }
        },
        createEditorDescribe () {
            try {
                this.editorDescribe = UE.getEditor('editorDescribe', {
                    toolbars: this.ueditorToolbarsConfig
                })                               
            } catch (error) {
                this.editorDescribe = null
            }

            // this.editorDescribe.ready(() => {
            //     this.editorDescribe.setContent(this.describe)
            // })
        },
        createEditorResult () {
            try {
                this.editorResult = UE.getEditor('editorResult', {
                    toolbars: this.ueditorToolbarsConfig
                })                               
            } catch (error) {
                this.editorResult = null
            }

            // this.editorResult.ready(() => {
            //     this.editorResult.setContent(this.answer)
            // })
        },
        handleQuestionClassChange (val) {
            if (val == 0 && !this.editorResult) {
                this.createEditorResult()
            }
        },
        handleSubmit () {
            // let answer;
            // if (this.formData.questionClass == 0) {
            //     answer = this.editorResult.getContent()
            // } else {
            //     answer = this.formData.answer
            // }
            // console.log('结果', Object.assign({}, this.formData, {
            //     describe: this.editorDescribe.getContent(),
            //     answer,
            // }))
            if(this.formData.versions_id == "") {
                this.$message.error('请选择版本!');
                return;
            }
            if(this.formData.class_id == "") {
                this.$message.error('请选择年级!');
                return;
            }
            if(this.formData.subject_id == "") {
                this.$message.error('请选择科目!');
                return;
            }
            if(this.formData.chapter_id == "") {
                this.$message.error('请选择章!');
                return;
            }
            if(this.formData.node_id == "") {
                this.$message.error('请选择节!');
                return;
            }
            if(this.formData.questionClass == "") {
                this.$message.error('请选择题类!');
                return;
            }
            if(this.formData.category_id == "") {
                this.$message.error('请选择题型!');
                return;
            }
            if(this.formData.easy_type == "") {
                this.$message.error('请选择难度!');
                return;
            }

            let answer, id
            // 根据题的类型不同切换不同答案
            if (this.formData.questionClass == this.QUESTION_CLASS_2) {
                // answer = this.formData.answer
                answer = this.answerGroup.join('').toUpperCase()
            } else {
                answer = this.editorResult.getContent()
            }
            // 根据mode的不同req id
            if (this.mode === 'c') {
                id = ''
            } else if (this.mode === 'w') {
                alert('后端差接口')
                id = ''
            }
            //提交
            this.$http.post("/Question/save", {
                token: this.$tools.getToken(),
                uid: this.$tools.getUID(),
                school_id: this.$tools.getSchoolID(),
                question_type: this.formData.question_type,
                id, // 修改需要
                versions_id: this.formData.versions_id,
                category_id: this.formData.category_id,
                class_id: this.formData.class_id,
                chapter_id: this.formData.chapter_id,
                subject_id: this.formData.subject_id,
                content: this.editorDescribe.getContent(),
                answer,
                type: this.formData.questionClass,
                easy_type: this.formData.easy_type,
                unitid: this.formData.node_id,
            })
            .then(res => {
                this.$message.success(res.info);
                this.back()
            })
            .catch(res=>{
                this.$message.error(res.info);
            })

        },
        //返回
        back() {
            this.$router.go(-1)
        }
    }
}
</script>

<style>
.question-create .el-form-item__label{
    text-align: center;
}
#editorDescribe, #editorResult {
    margin-top: 50px;
}
</style>
