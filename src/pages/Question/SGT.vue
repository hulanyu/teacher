<template>
    <div>
        <I-table
        :title="title"
        :isUpdate="false"
        class="questionstable">
            <template slot="head">
                <div class="rightBtn" v-if="this.question_type != 3">
                    <el-button size="medium" type="primary" @click="addFn">添加试题</el-button>
                    <el-button size="medium" type="success" class="addbtn" @click="showExport">导出试题</el-button>
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
                            <div v-html="item.content"></div>
                            <div v-if="item.id != ''" class="itemsbtns">
                                <el-button size="small " type="primary" @click="showAnser(item)">查看答案</el-button>
                                <el-button size="small" style="padding:10px 16px;" type="primary" class="btns" @click="editFn(item)">编辑</el-button>
                                <el-button size="small " type="danger" @click="deteleShow(item.id)">删除</el-button>
                            </div>
                            <div v-if="item.isShow">
                                <div v-if="item.id != ''" class="itemsTittle">参考答案：</div>
                                <div class="result"  v-html="item.answer"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 学校导出试题 -->
                <I-table-editor v-model="showOutQuestionBox1" 
                title="导出试题">
                    <template slot="content">
                        <el-row>选择导出位置：</el-row>
                        <el-row class="exportOptions">
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
                        @click="showOutQuestionBox1 = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="handleOutQuestion">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 年级试题 -->
                <I-table-editor v-model="showOutQuestionBox2" 
                title="导出试题">
                    <template slot="content">
                        <el-row>选择导出位置：</el-row>
                        <el-row class="exportOptions">
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="3">教师题库</el-radio>
                            </el-radio-group>
                        </el-row>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showOutQuestionBox2 = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="handleOutQuestion">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 纠正 -->
                <I-table-editor v-model="showErrorEditorBox" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">
                           是否确定删除该试题？
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showErrorEditorBox = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="deleteFn()">确 定</el-button>
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

export default {
    props: {
        title: String,
        componentsType: Number,
    },
    data() {
        return {
            question_type:"",
            //弹框
            showOutQuestionBox1: false,
            showOutQuestionBox2: false,
            showErrorEditorBox:false,
            showErrorEditorBoxTitle: '',
            //删除
            deleteId:'',
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
    mounted() {
        //一进来就调用
        // this.getVersions()
        // console.log(this.$route.params.type)
        // this.question_type = this.$route.params.type
        this.question_type = this.componentsType
    },
    methods: {
        //一进来就请求
        req() {
            this.$http.post("/Question/lists", {
                // page_size:this.page_size,
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
                question_type:this.question_type,
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
        },
        // 初始化返回数据
        initRes (data) {
            this.total_page = parseInt(data.page.total)
            this.tableData = data.rows.map(item => {
                return Object.assign({}, item, {
                    content: this.$tools.transformHTML(item.content),
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
            //     for(let i=0;i<document.querySelectorAll('.difficultLi').length;i++) {
            //         document.querySelectorAll('.difficultLi')[i].className = 'difficultLi';
            //     }
            //     document.querySelectorAll('.difficultLi')[this.easy_type-1].className = 'difficultLi on'
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
        //导出
        showExport() {
            if(this.question_type == 1) {
                this.showOutQuestionBox1 = true
                this.position = '2'
            }else if(this.question_type == 2) {
                this.showOutQuestionBox2 = true
                this.position = '3'
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
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
                return;
            }
            this.$http.post('/Question/export',{
                token:localStorage.jxtoken,
                uid:localStorage.jxid,
                school_id:localStorage.jxschool_id,
                position:this.position,
                old_position:this.question_type,
                qids:this.selectData.join(',')
            })
            .then(res => {
                console.log(res)
                this.$message.success(res.info);
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
            })
            .catch(res=>{
                this.$message.error(res.info);
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
            })
        },
        //显示错误弹框
        deteleShow(val) {
            this.deleteId = val
            this.showErrorEditorBox = true
        },
        //确认提交错误
        deleteFn() {
            this.$http.post('/Question/delete',{
                token: this.$tools.getToken(),
                qid:this.deleteId,
                uid: this.$tools.getUID()
            })
            .then(res => {
                console.log(res)
                this.$message.success(res.info);
                this.showErrorEditorBox = false
                this.req()
            })
            .catch(res=>{
                this.$message.error(res.info);
                this.showErrorEditorBox = false
            })
        },
        //添加试题
        addFn() {
            this.$router.push({ name: 'QuestionsCreate', params: { type: this.question_type }});
        },
        //编辑试题
        editFn(val) {
            localStorage.jxquestion = JSON.stringify(val)
            this.$router.push({ 
                name: 'QuestionsAlter',
                params: { 
                    type: this.question_type,
                    id: val.id,
                }
            });
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
        }
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
@import url('./SGT.less');
</style>
