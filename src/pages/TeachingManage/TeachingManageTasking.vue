<template>
    <div>
        <I-table
        title="教学任务分配"
        :isUpdate="false">
            <template slot="head">
                <el-select v-model="subjectItem" placeholder="科目" style="width: 150px;"
                @change="handleSelectSubject">
                    <el-option 
                    :label="item.subject_name" 
                    :value="JSON.stringify(item)"
                    :key="index"
                    v-for="(item, index) in subjectList"></el-option>
                </el-select>
                <el-select v-model="grade" placeholder="年级" style="width: 150px;"
                @change="handleSelectGrade">
                    <el-option 
                    :label="value.class" 
                    :value="value.id"
                    :key="key"
                    v-for="(value, key) in gradeList"></el-option>
                </el-select>
                <el-input v-model="name" size="smail" placeholder="教师姓名" style="width:150px;"></el-input>
                <el-button size="smail" type="primary" class="confirm"
                @click="search">查询</el-button>
                <el-button size="smail" type="primary" @click="showTaskingBox">分配任务</el-button>
            </template>
            <template slot="content" slot-scope="props">
                <el-table
                border
                style="width: 100%"
                row-class-name="table-row"
                :height="props.maxHeight"
                :data="tableData"
                @sort-change="sortChange">
                    <!-- <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column> -->
                    <el-table-column
                    prop="name"
                    label="教师"></el-table-column>
                    <el-table-column
                    label="科目">
                        <template slot-scope="scope">
                            {{subjectItem ? JSON.parse(subjectItem).subject_name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="grade_name"
                    label="年级"></el-table-column>
                    <el-table-column
                    prop="class_name"
                    label="班级"></el-table-column>
                    <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" @click="deletefn(scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisibleTasking" 
                width="600px"
                title="分配教学任务">
                    <template slot="content">
                        <div class="item">
                            <label class="titles">教师姓名：</label>
                            <el-autocomplete
                            v-model="addForm.name"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入教师姓名"
                            @select="(item) => {handleClassSelect.call(this, item, 'addForm')}"
                            ></el-autocomplete>
                        </div>
                        <div class="item">
                            <label class="titles">电话：</label>
                            <el-input v-model="addForm.phone" placeholder="请选择教师" disabled></el-input>
                        </div>
                        <div class="item">
                            <div style="padding-bottom: 5px;"
                            :key="index"
                            v-for="(item, index) in addForm.gradeAndClassList">
                                <label class="titles">{{index === 0 ? '班级：' : ''}}</label>
                                <el-select v-model="item.grade" placeholder="年级"
                                @change="(value) => {handleClassList.call(this, value, item.grade)}">
                                    <el-option 
                                    :label="value.class" 
                                    :value="value.id"
                                    :key="key"
                                    v-for="(value, key) in gradeList"></el-option>
                                </el-select>
                                <el-select v-model="item.class" placeholder="班级">
                                    <el-option
                                    v-for="(i, index) in getClassListById(item.grade)"
                                    :key="index"
                                    :label="i.class || '空'"
                                    :value="i.id">
                                    </el-option>
                                </el-select>
                                <el-button type="primary" class="el-icon-plus"
                                v-if="index === 0"
                                @click="addGradeAndClassList('addForm')"></el-button>
                                <el-button type="danger" class="el-icon-minus"
                                v-if="index !== 0"
                                @click="removeGradeAndClassList('addForm', index)"></el-button>
                            </div>
                            <!-- <el-select v-model="addForm.grade" placeholder="年级"
                            @change="(value) => {handleClassList.call(this, value, addForm.grade)}">
                                <el-option 
                                :label="value.class" 
                                :value="value.id"
                                :key="key"
                                v-for="(value, key) in gradeList"></el-option>
                            </el-select>
                            <el-select v-model="addForm.class" placeholder="班级">
                                <el-option
                                v-for="(item, index) in getClassListById(addForm.grade)"
                                :key="index"
                                :label="item.class || '空'"
                                :value="item.id">
                                </el-option>
                            </el-select> -->
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button @click="handleTaskingClose">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="handleTaskingSubmit">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 修改 -->
                <I-table-editor v-model="dialogFormVisibleEditor" 
                title="编辑教学任务">
                    <template slot="content">
                        <div class="item">
                            <label class="titles">教师姓名：</label>
                            <el-autocomplete
                            v-model="editorForm.name"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入教师姓名"
                            @select="(item) => {handleClassSelect.call(this, item, 'editorForm')}"
                            ></el-autocomplete>
                        </div>
                        <div class="item">
                            <label class="titles">电话：</label>
                            <el-input v-model="editorForm.phone" placeholder="请选择教师" disabled></el-input>
                        </div>
                        <div class="item">
                            <div style="padding-bottom: 5px;"
                            :key="index"
                            v-for="(item, index) in editorForm.gradeAndClassList">
                                <label class="titles">{{index === 0 ? '班级：' : ''}}</label>
                                <el-select v-model="item.grade" placeholder="年级"
                                @change="(value) => {handleClassList.call(this, value, item.grade)}">
                                    <el-option 
                                    :label="value.class" 
                                    :value="value.id"
                                    :key="key"
                                    v-for="(value, key) in gradeList"></el-option>
                                </el-select>
                                <el-select v-model="item.class" placeholder="班级">
                                    <el-option
                                    v-for="(i, index) in getClassListById(editorForm.grade)"
                                    :key="index"
                                    :label="i.class || '空'"
                                    :value="i.id">
                                    </el-option>
                                </el-select>
                                <!-- <el-button type="primary" class="el-icon-plus"
                                @click="addGradeAndClassList('editorForm')"></el-button> -->
                            </div>

                            <!-- <el-select v-model="editorForm.grade" placeholder="年级"
                            @change="(value) => {handleClassList.call(this, editorForm.grade)}">
                                <el-option 
                                :label="value.class" 
                                :value="value.id"
                                :key="key"
                                v-for="(value, key) in gradeList"></el-option>
                            </el-select>
                            <el-select v-model="editorForm.class" placeholder="班级">
                                <el-option
                                v-for="(item, index) in getClassListById(editorForm.grade)"
                                :key="index"
                                :label="item.class || '空'"
                                :value="item.id">
                                </el-option>
                            </el-select> -->
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button @click="handleTaskedClose">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="handleTaskedSubmit">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="deleteDialogVisible" 
                title="删除">
                    <template slot="content">
                        <span>是否确定删除？</span>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="handleDelete">确 定</el-button>
                    </template>
                </I-table-editor>

            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    data() {
        return {
            dialogFormVisibleEditor: false,
            deleteDialogVisible:false,
            dialogFormVisibleTasking:false,
            formLabelWidth: '100px',
            addImg:'../static/imgs/addBtn.png',
            // form: {
            //     name: '',
            //     region: '',
            //     date1: '',
            //     date2: '',
            //     delivery: false,
            //     type: [],
            //     resource: '',
            //     desc: ''
            // },
            // 默认
            getDefaultForm: () => {
                return {
                    name: null,
                    phone: null,
                    // grade: null,
                    // class: null,
                    gradeAndClassList: [
                        {
                            grade: null,
                            class: null,
                        }
                    ],
                }
            },
            // 分配教学任务
            addForm : {
                name: null,
                phone: null,
                // grade: null,
                // class: null,
                gradeAndClassList: [
                    {
                        grade: null,
                        class: null,
                    }
                ],
            },
            // 编辑教学任务
            editorForm: {
                name: null,
                phone: null,
                // grade: null,
                // class: null,
                gradeAndClassList: [
                    {
                        grade: null,
                        class: null,
                    }
                ]
            },
            tableData: [],
            row: {},
            grade: null,
            gradeList: [],
            subject_id: null,
            subjectItem: null,
            subjectList: [],
            // classList: [],

            classListMap: {},

            name: null,
            teach: {},
            nowStatusName: '',
        };
    },
    components: {
        ITable,
        // ITablePage,
        ITableEditor,
    },
    mounted () {
        this.getSubject()
        // setInterval(() => {
        //     console.log(this.classListMap[this.addForm.grade])
        // }, 1000)
    },
    methods: {
        req() {
            if((this.subject_id|| "") ==""){
                this.$message.error("请选择科目后再执行此操作！");
                return;
            }
            this.tableData = [];
            this.$nextTick(() => {
                this.$http.post('/Teaching/allocationLists', {
                    token: this.$tools.getToken(),
                    school_id: this.$tools.getSchoolID(),
                    grade_id: this.grade,
                    subject_id: this.subject_id,
                    name: this.name,
                })
                .then((res) => {
                    this.tableData = res.data
                });
            })
        },
        getClassListById (id) {
            return this.classListMap[id] || []
        },
        getGrade () {
            this.$http.post('/Teaching/getGradeBySubject', {
                token: this.$tools.getToken(),
                school_id: this.$tools.getSchoolID(),
                teaching_subject_id: this.subject_id,
            })
            .then(res => {
                this.gradeList = res.data;
                //add by xing.wei 2018-02-05  default to select  first option for search data
                if(this.gradeList.length>0){
                    this.grade = this.gradeList[0].id;
                    this.search();
                }
            })
        },
        getSubject () {
            this.$http.post('/Teaching/lists', {
                token: this.$tools.getToken(),
                school_id: this.$tools.getSchoolID(),
            })
            .then(res => {
                this.subjectList = res.data
            })
        },
        handleSelectSubject (val) {
            if (!val) {
                return
            }
            console.log(111, val)
            // 重置
            this.tableData = []
            this.grade = null
            this.gradeList = []
            this.name = null

            this.subject_id = JSON.parse(val).subject_id
            this.getGrade()
        },
        handleSelectGrade (val) {
            if (!val) {
                return
            }
            this.name = null
            this.tableData = []
        },
        sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        //删除
        deletefn (row) {
            this.row = row
            this.deleteDialogVisible = true
            this.req()
        },
        // 删除确认
        handleDelete() {
            this.$http.post('/Teaching/deleteAllocation', {
                token: this.$tools.getToken(),
                school_id: this.$tools.getSchoolID(),
                id_str: this.row.id,
            })
            .then(res => {
                this.deleteDialogVisible = false

                this.req()
            })
        },
        //编辑
        handleClick(row) {
            this.row = row
            this.dialogFormVisibleEditor = true
            this.nowStatusName = 'editorForm'

            this.handleClassList(this.row.grade_id)
            Object.assign(this.editorForm, {
                name: row.name,
                phone: row.modify_time,
                grade: String(row.grade_id),
                class: row.class_id,
                gradeAndClassList: [
                    {
                        class: this.row.class_id,
                        grade: this.row.grade_id,
                    }
                ],
            })
            this.handleClassSelect({
                id: this.row.staff_id,
                name: this.row.name,
                phone: this.row.modify_time,
                value: this.row.name,
            }, 'editorForm')
        },
        // 根据年级id获取所有班级
        handleClassList (grade_id) {
            this.$http.post('/Teaching/getClassByGradeId', {
                token: this.$tools.getToken(),
                school_id: this.$tools.getSchoolID(),
                grade_id,
            })
            .then(res => {
                // this.classList = res.data
                this.$set(this.classListMap, String(grade_id), res.data)
            })
        },
        querySearchAsync (qs, callback) {
            // console.log(123, this.nowStatusName.name)
            if (qs === '') {
                return callback([])
            }
            this.$http.post('/Teaching/getPhoneByTeacherName', {
                token: this.$tools.getToken(),
                name: qs,
            }, {
                showLoading: false,
            })
            .then(res => {
                // if (res.data.length === 0) {
                //     this[this.nowStatusName].name = ''
                // }
                callback(res.data.map(item => {
                    return {
                        id: item.id,
                        phone: item.phone,
                        name: item.name,
                        value: item.name,
                    }
                }))
            })
            .catch(res => {
                callback([])
            })
        },
        handleClassSelect (item, key) {
            this.teach = item
            this.$set(this[key], 'phone', item.phone)
        },
        // 显示新建
        showTaskingBox () {
            if (!this.subject_id) {
                this.$message.error('请选择科目')
                return
            }

            this.dialogFormVisibleTasking = true
            this.nowStatusName = 'addForm'
        },
        handleTaskingClose () {
            this.addForm = this.getDefaultForm()
            this.teach = {}
            this.dialogFormVisibleTasking = false
        },
        // type 0 添加 1 修改
        handleBaseSubmit (data, type, callback) {
            let sub = async () => {
                try {
                    let res
                    for (let item of data.gradeAndClassList) {
                        if (
                            (item.grade === null || item.grade === void 0) &&
                            (item.class === null || item.class === void 0)
                        ) {
                            continue
                        }
                        res = await this.$http.post('/Teaching/saveAllocation', {
                            token: this.$tools.getToken(),
                            uid: this.$tools.getUserID(),
                            school_id: this.$tools.getSchoolID(),
                            staff_id: this.teach.id,
                            teaching_subject_id: this.subject_id,
                            grade_id: item.grade,
                            class_id: item.class,
                            id: type === 0 ? '' : this.row.id,
                        }, {
                            showError: false,
                        })
                    }
                    this.$message.success(res.info || '成功')
                    Object.assign(data, this.getDefaultForm())
                    this.teach = {}
                    // this.dialogFormVisibleTasking = false
                    callback()
                    this.req()
                } catch (err) {
                    console.log(1111, err);
                    this.$message.error(err.info || '失败')
                }
            }
            sub()
        },
        handleTaskingSubmit () {
            this.handleBaseSubmit(this.addForm, 0, () => {
                this.dialogFormVisibleTasking = false
            })
        },
        handleTaskedSubmit () {
            this.handleBaseSubmit(this.editorForm, 1, () => {
                this.dialogFormVisibleEditor = false
            })
        },
        handleTaskedClose () {
            this.editorForm = this.getDefaultForm()
            this.teach = {}
            this.dialogFormVisibleEditor = false
        },
        search () {
            this.tableData = []
            this.$nextTick(() => {
                this.req()
            })
        },
        addGradeAndClassList (name) {
            this[name].gradeAndClassList.push(this.getDefaultForm().gradeAndClassList[0])
        },
        removeGradeAndClassList (name, index) {
            this[name].gradeAndClassList.splice(index, 1)
        },
    }
}
</script>
<style scoped lang="less">
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:white;
    }
    .el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
    	color:#fff;
    }
    .item {
        margin-bottom: 20px;
        .el-input,.el-select {
            width: 160px;
        }
        .titles {
            width: 70px;
            display: inline-block;
            text-align: right;
        }
    }
    
</style>
