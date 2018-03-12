<template>
    <div>
        <I-table
        title="系统题库"
        :isUpdate="false"
        class="questionstable">
            <template slot="head">
                <div class="rightBtn">
                    <el-button size="medium" type="success" class="addbtn" @click="showOutQuestionBox = true">导出试题</el-button>
                </div>
                <Question-query
                @change="handleQuestionQueryChange"></Question-query>
            </template>
            <template slot="content" slot-scope="props">
                <div class="contentCover">
                    <div class="noData" v-if="tableData.length == 0">暂无数据</div>
                    <div class="itmes" v-for="(item,index) in tableData" :key="index">
                        <input type="checkbox" class="itmesChose" :checked="item.checked" @click="selectFn(item)">
                        <span class="itmesId">{{item.id}}</span>
                        <div class="itmesContent">
                            <div v-html="computedImageHTML(item.content)"></div>
                            <div v-if="item.id != ''" class="itemsbtns">
                                <el-button size="small " type="primary" @click="showAnser(item)">查看答案</el-button>
                                <el-button size="small " type="danger" @click="showError(item.id)">纠正</el-button>
                            </div>
                            <div v-if="item.isShow">
                                <div v-if="item.id != ''" class="itemsTittle">参考答案：</div>
                                <div class="result"  v-html="item.answer"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 导出试题 -->
                <I-table-editor v-model="showOutQuestionBox" 
                title="导出试题">
                    <template slot="content">
                        <el-row>选择导出位置：</el-row>
                        <el-row class="exportOptions">
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="1">学校题库</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="2">年级题库</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="3">教师题库</el-radio>
                            </el-radio-group>
                        </el-row>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showOutQuestionBox = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="handleOutQuestion">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 纠正 -->
                <I-table-editor v-model="showErrorEditorBox" 
                :title="showErrorEditorBoxTitle">
                    <template slot="content">
                        <div class="error-label">
                            <span style="vertical-align: top;">
                                错误描述：
                            </span>
                        </div>
                        <div class="error-text">
                            <span style="display: inline-block;width: 100%;">
                                <el-input class="error-editor"
                                type="textarea"
                                :rows="8"
                                v-model="describe">
                                </el-input>
                                <p>用简单的语言描述一下错误在哪里</p>
                            </span>
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showErrorEditorBox = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="repair()">确 定</el-button>
                    </template>
                </I-table-editor>
                    
            </template>
            <template slot="foot">
                <I-table-page v-model="page_number"
                :total="total_page"
                @change="pageChange"></I-table-page>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import QuestionQuery from './QuestionQuery'
import config from '@/config'

export default {
    data() {
        return {
            //弹框
            showOutQuestionBox: false,
            showErrorEditorBox:false,
            showErrorEditorBoxTitle: '',
            //纠错
            describe:"",
            errorId:'',
            //导出
            selectData:[],
            position:"1",

            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            ids:[],//删除
            //搜索参数
            number:"",
            page_number:1,
            page_size:10,
            total_page:0,
          	//编辑添加参数
            formInline: {
                id:"",
                name:"",
                gender:"",
                nation:"",
                grade:"",
                class_name:"",
                class_number:"",
                dorm_number:"",
                parent_name:"",
                phone:"",
                address:"",
                balance:""
            },
            //获取的数据
            tableData: [],

            versions_id: null,
            grade_id: null,
            subject_id: null,
            chapter_id: null,
            type_id: null,
            node_id: null,
            difficult_id: null,
        };
    },
    methods: {
        //一进来就请求
        req() {
        this.$http
            .post("/Question/lists", {
                page_size:this.page_size,
                page_number:this.page_number,
                vid:this.versions_id,
                classes:this.grade_id,
                subject:this.subject_id,
                chid:this.chapter_id,
                unitid:this.node_id,
                q_type:this.type_id,
                easy_type:this.difficult_id,
                // book:this.book,
                // // 问题
                // is_type:1,
                question_type:4,
                uid:localStorage.jxid,
                school_id:localStorage.jxschool_id,
                token:localStorage.jxtoken,
            })
            .then(res => {
            // if(this.page_number > 1) {
            //     if(!res.data) {
            //         this.page_number = this.page_number - 1
            //         this.req()
            //     }
            // }
                this.initRes(res.data.data)
            })
            // 测试
            // .catch(res => {
            //     let temp = {
            //         "status": 1,
            //         "info": "success",
            //         "data": {
            //             "rows": [
            //                 {
            //                     "id": "20",
            //                     "old_question_positon": "0",
            //                     "old_question_id": "0",
            //                     "question_type": "1",
            //                     "school_id": "1",
            //                     "grade_id": "0",
            //                     "teacher_id": "1",
            //                     "kid": "0",
            //                     "cid": "2",
            //                     "chid": "1",
            //                     "clid": "9",
            //                     "sid": "1",
            //                     "vid": "1",
            //                     "yid": "0",
            //                     "content": "&lt;p&gt;&lt;span style=&quot;color: rgb(51, 51, 51); font-family: Simsun;&quot;&gt;中国古典诗中有不少描写景物注重形似的好诗，但中国传统美学思想却更加崇尚画意与深远的境界相结合的诗，崇尚有神韵的诗，而不是崇尚单纯形似的诗。王维的《终南别业》诗中有画，而又在画的背后隐蔽着一种悠然、空寂的境界。陶渊明的《饮酒》：“采菊东篱下，悠然见南山山。气日夕佳，飞鸟相与还。”表面上是一首描写田园山水的单纯写景的诗，但仅仅这样来看待这首诗，则显然未能真正领略其诗意。这几句诗在描写“人境”的现实田园景物时，却隐蔽着语言文字所未说出的超现实的情趣和理想境界，正所谓“象外之象，景外之景”。__________________________?&lt;/span&gt;&lt;/p&gt;",
            //                     "answer": "&lt;p&gt;&lt;span style=&quot;color: rgb(51, 51, 51); font-family: Simsun;&quot;&gt;象外之象，景外之景&lt;/span&gt;&lt;/p&gt;",
            //                     "is_status": "1",
            //                     "is_type": "2",
            //                     "create_datetime": "1515814710",
            //                     "easy_type": "容易",
            //                     "fix_times": "2",
            //                     "book": "1",
            //                     "clname": "九年级",
            //                     "sname": "语文",
            //                     "cname": "填空题",
            //                     "chname": "第一章",
            //                     "vname": "人教版",
            //                     "content_decode": "中国古典诗中有不少描写景物注重形似的好诗，但中国传统美学思想..."
            //                 },
            //                 {
            //                     "id": "19",
            //                     "old_question_positon": "0",
            //                     "old_question_id": "0",
            //                     "question_type": "1",
            //                     "school_id": "1",
            //                     "grade_id": "0",
            //                     "teacher_id": "1",
            //                     "kid": "0",
            //                     "cid": "2",
            //                     "chid": "1",
            //                     "clid": "9",
            //                     "sid": "1",
            //                     "vid": "1",
            //                     "yid": "0",
            //                     "content": "&lt;p&gt;&lt;span style=&quot;color: rgb(51, 51, 51); font-family: Simsun;&quot;&gt;君子知礼好礼，以礼来处理人与自身、他人、社会的关系。《论语》中以君子衣食住用等方面的礼节来表明君子好礼的品质。日常生活中，对祭祀礼仪的推崇与尊重最能表现君子好礼的品质。在周礼几近消亡时，孔子的弟子问他是否可以结束一些祭祀仪式了，孔子表现得十分不舍。他难以割舍的不是礼的具体形式，而是礼所包含的精神导向作用。这不仅是对长幼有序、尊卑有法的留恋，更是对礼制下稳定、和谐的社会秩序的不舍。____________________________?&lt;/span&gt;&lt;/p&gt;",
            //                     "answer": "&lt;p&gt;&lt;span style=&quot;color: rgb(51, 51, 51); font-family: Simsun;&quot;&gt;和谐的社会秩序的不舍&lt;/span&gt;&lt;/p&gt;",
            //                     "is_status": "1",
            //                     "is_type": "2",
            //                     "create_datetime": "1515814675",
            //                     "easy_type": "容易",
            //                     "fix_times": "2",
            //                     "book": "1",
            //                     "clname": "九年级",
            //                     "sname": "语文",
            //                     "cname": "填空题",
            //                     "chname": "第一章",
            //                     "vname": "人教版",
            //                     "content_decode": "君子知礼好礼，以礼来处理人与自身、他人、社会的关系。《论语》..."
            //                 }
            //             ],
            //             "page": {
            //                 "total": "20",
            //                 "pageSize": "2"
            //             }
            //         }
            //     }
            //     this.initRes(temp.data)
                
            // })
            
        },
        initRes (data) {
            this.total_page = parseInt(data.page.total)
            this.tableData = data.rows.map(item => {
                return Object.assign({}, item, {
                    // content: this.$tools.transformHTML(item.content),
                    content: item.content,
                    answer: this.$tools.transformHTML(item.answer),
                })
            })
            //添加全选
            this.tableData.unshift({
                id: "",
                content: '全选',
                result: '',
                isShow:false,
                checked:false
            })
            //添加属性
            for(let i=0;i<this.tableData.length;i++) {
                this.tableData[i].isShow = false;
            }

            //选哪个 哪个变色
            // this.$nextTick(function(){
            //     for(let i=0;i<document.querySelectorAll('.difficultyLi').length;i++) {
            //         document.querySelectorAll('.difficultyLi')[i].className = 'difficultyLi';
            //     }
            //     document.querySelectorAll('.difficultyLi')[this.easy_type-1].className = 'difficultyLi on'
            // });
        },
        //显示答案
        showAnser(item) {
            item.isShow = !item.isShow;
            let temp = this.tableData
            this.tableData = []
            this.tableData = temp
        },

        pageChange(current) {
            this.page_number = current
            this.req()
        },
        changeFun(val) {
            this.multipleSelection = val;
            // console.log(this.multipleSelection)
        },
        //新增
        addbtn() {
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //选择
        selectFn(val) {
            val.checked=!val.checked;
            if(val.id > 0) {return;}
                for(let i=1;i<this.tableData.length;i++) {
                    this.tableData[i].checked = val.checked;
            }
        },
        //确定导出
        handleOutQuestion() {
            this.selectData = []
            for(let i=1;i<this.tableData.length;i++) {
                if(this.tableData[i].checked) {
                    this.selectData.push(this.tableData[i].id)
                }
            }
            console.log(this.selectData.join(','))
            if(this.selectData.length == 0) {
                this.$message.error("您未选择任何试题")
                this.showOutQuestionBox = false
                return;
            }
            this.$http.post('/Question/export',{
                token: this.$tools.getToken(),
                uid: this.$tools.getUID(),
                school_id: this.$tools.getSchoolID(),
                position:this.position,
                old_position:1,
                qids:this.selectData.join(',')
            })
            .then(res => {
                this.showOutQuestionBox = false
                this.$message.success(res.info);
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //显示错误弹框
        showError(val) {
            this.errorId = val
            this.showErrorEditorBox = true
        },
        //确认提交错误
        repair() {
            if(this.describe.trim() == "" || this.describe.toString().trim() == "") {
                this.$message.error('请输入内容!');
                return;
            }
            this.$http.post('/Question/repair',{
                token: this.$tools.getToken(),
                uid: this.$tools.getUserID(),
                school_id: this.$tools.getSchoolID(),
                describe:this.describe,
                id:this.errorId
            })
            .then(res => {
                this.$message.success(res.info);
                this.showErrorEditorBox = false
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        // 查询项变化
        handleQuestionQueryChange (obj) {
            this.versions_id = obj.versions_id
            this.grade_id = obj.grade_id
            this.subject_id = obj.subject_id
            this.chapter_id = obj.chapter_id
            this.type_id = obj.type_id
            this.node_id = obj.node_id
            this.difficult_id = obj.difficult_id

            this.page_number = 1
            this.total_page = 0
            this.tableData = []
            this.$nextTick(() => {
                this.req()
            })
        },
        computedImageHTML (HTML) {
            return HTML.replace(/src="\//ig, 'src="' + config.IMGURL + '/')
        },
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
        QuestionQuery,
    }
}
</script>
<style lang="less">
@import url('./system.less');
</style>
