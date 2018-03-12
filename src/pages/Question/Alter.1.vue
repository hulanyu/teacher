<template>
    <Base-right class="question-create"
    :isUpdate="false"
    title="添加试题">
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
                                :label="item.unit"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                    :span="8">
                        <el-form-item label="题类:" label-width="70px">
                            <el-select @change="changeGet('questionClass')" v-model="formData.is_type" placeholder="请选择题类">
                                <el-option
                                v-for="(item,index) in questionClassOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col
                    :span="8">
                        <el-form-item label="题型:" label-width="70px">
                            <el-select @change="changeGet('type')" v-model="formData.type" placeholder="请选择题型">
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
                v-show="formData.is_type == 1">
                    <el-form-item label="答案:">
                        <script id="editorResult" type="text/plain" style="width:800px;height:200px;"></script>
                    </el-form-item>                
                </div>
                <div
                v-show="formData.is_type != 1" class="answerCover">
                    <div class="title">答案：</div>
                    <el-checkbox-group v-model="formData.answerList">
                        <el-checkbox label="A"></el-checkbox>
                        <el-checkbox label="B"></el-checkbox>
                        <el-checkbox label="C"></el-checkbox>
                    </el-checkbox-group> 
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

export default {
    data () {
        return {
            //提交数据
            formData: {
                id:"",
                versions_id: '',
                category_id: '0',
                class_id: '',
                chapter_id: '',
                subject_id: '',
                content: '',
                answer: '2',
                answerList: [],
                type: '',
                easy_type: '',
                question_type: this.$route.params.type,
                questionClass:''
            },
            //列表数据
            versionData:[],
            gradeData:[],
            sujectData:[],
            chapterData:[],
            nodeData:[
                {
                    id:1,
                    unit:"第一节"
                }
            ],
            typeData:[],
            difficultyData:[
                {
                    id:1,
                    name:"简单"
                },
                {
                    id:2,
                    name:"一般"
                },
                {
                    id:1,
                    name:"困难"
                }
            ],
            questionClassOptions: [
                {
                    label: '主观题',
                    value: 0
                },
                {
                    label: '客观题',
                    value: 1
                }
            ],
            //请求数据
            getQestionsData:{},
            versions_id:1,
            class_id:1,
            subject_id:1,
            book:1,
            type:1,
            easy_type:1,

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
        }
    },
    components: {
        BaseRight
    },
    mounted () {
        this.getQestionsData = JSON.parse(localStorage.jxquestion)
        console.log("question:"+JSON.parse(localStorage.jxquestion))
        // let t = setInterval(() => {
        //     if (!UE) {
        //         return
        //     }

        //     this.createEditorDescribe()
        //     this.createEditorResult() 
        //     clearInterval(t)
        // }, 500)

        //初始化编辑器
        this.createEditorDescribe()
        this.createEditorResult() 

        this.getVersions()
        this.getClass()
        this.getSubject()
        this.getChapter()
        this.getCategory()
        //请求数据
        this.formData.id = this.getQestionsData.id 
        this.formData.versions_id = this.getQestionsData.vid 
        this.formData.class_id = this.getQestionsData.clid
        this.formData.subject_id = this.getQestionsData.sid
        this.formData.chapter_id = this.getQestionsData.cid
        this.formData.book = this.getQestionsData.book
        this.formData.type = this.getQestionsData.is_type
        this.formData.easy_type = this.getQestionsData.easy_type 
        //如果是选择题
        if(this.getQestionsData.is_type == 1) {
            this.formData.answerList = this.getQestionsData.answer.split('')
        }
        console.log("formData.answer"+this.formData.answer)
        

        
            
    },
    methods: {
        //一进来获取
        //获取版本
        getVersions() {
            this.$http.get('./Question/getVersions')
            .then(res=>{
                console.log(res);
                this.versionData = res.data
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //获取年级
        getClass() {
            this.$http.post('./Question/getClass', {
                token:localStorage.jxtoken,
                versions_id:this.versions_id
            })
            .then(res=>{
                console.log(res);
                this.gradeData = res.data
                
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //获取科目
        getSubject() {
            this.$http.post('./Question/getSubject', {
                token:localStorage.jxtoken,
                versions_id:this.versions_id,
                class_id:this.class_id
            })
            .then(res=>{
                console.log(res);
                this.sujectData = res.data
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //获取章
        getChapter() {
            this.$http.post('./Question/getChapter', {
                token:localStorage.jxtoken,
                versions_id:this.versions_id,
                class_id:this.class_id,
                subject_id:this.subject_id,
                book:this.book
            })
            .then(res=>{
                console.log(res);
                this.chapterData = res.data
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //获题型
        getCategory() {
            this.$http.post('./Question/getCategory', {
                token:localStorage.jxtoken,
                versions_id:this.versions_id,
                class_id:this.class_id,
                subject_id:this.subject_id,
                book:this.book,
                type:this.type
            })
            .then(res=>{
                console.log(res);
                this.typeData = res.data
                //最后渲染
                
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //下拉选择
        changeGet(name) {
            if(name == 'version') {
                this.versions_id = this.formData.versions_id
                console.log("versionid:"+this.formData.versions_id)
                //重新请求数据
                this.getClass()
                this.getSubject()
                this.getChapter()
                this.getCategory()
                //之前的数据清空
                
            }
            if(name == 'grade') {
                this.class_id = this.formData.class_id
                this.getSubject()
                this.getChapter()
                this.getCategory()
            }
            if(name == 'suject') {
                this.subject_id = this.formData.subject_id
                this.getChapter()
                this.getCategory()
            }
            if(name == 'chapter') {
                this.getCategory()
            }
            if(name == 'type') {
                
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

            this.editorDescribe.ready(() => {
                this.editorDescribe.setContent(this.getQestionsData.content)
            })
        },
        createEditorResult () {
            try {
                this.editorResult = UE.getEditor('editorResult', {
                    toolbars: this.ueditorToolbarsConfig
                })                               
            } catch (error) {
                this.editorResult = null
            }

            this.editorResult.ready(() => {
                this.editorResult.setContent(this.getQestionsData.answer)
            })
        },
        handleQuestionClassChange (val) {
            if (val == 0 && !this.editorResult) {
                this.createEditorResult()
            }
        },
        handleSubmit () {
            let answer;
            if (this.formData.is_type == 0) {
                this.formData.answer = this.editorResult.getContent()
            } else {
                this.formData.answer = this.formData.answerList.join(',')
            }
            this.formData.content = this.editorDescribe.getContent()
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
            if(this.formData.unit == "") {
                this.$message.error('请选择节!');
                return;
            }
            if(this.formData.is_type == "") {
                this.$message.error('请选择题类!');
                return;
            }
            if(this.formData.type == "") {
                this.$message.error('请选择题型!');
                return;
            }
            if(this.formData.easy_type == "") {
                this.$message.error('请选择难度!');
                return;
            }
            console.log(this.formData);
            this.formData.school_id = localStorage.jxschool_id
            this.formData.uid = localStorage.jxid
            this.formData.token = localStorage.jxtoken
            //提交
            // this.$http.post("/ExamPaper/save", this.addInfo)
            //     .then(res => {
            //     this.dialogFormVisible = false;
            //     this.$message.success(res.info);
            //     this.req();
            //     })
            //     .catch(res=>{
            //     this.$message.error(res.info);
            //     })

        },
        //返回
        back() {
            history.go(-1)
        }
    }
}
</script>

<style lang="less">
.question-create .el-form-item__label{
    text-align: center;
}
#editorDescribe, #editorResult {
    margin-top: 50px;
}
.answerCover {
    margin:20px 0;
    .title {
        margin: 10px 0;
    }
}
</style>
