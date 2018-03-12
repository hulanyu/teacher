<template>
    <div>
        <I-table
        title="排课详情"
        :isUpdate="true"
        :isBack="false"
        @update="init">>
            <template slot="head">
                
                <el-row>
                    <label>课程查看：</label>
                    <el-radio-group v-model="qryForm.qryType" @change="qryTypeChanged">
                        <el-radio :label="1" :disabled="btnType==2">教师课表</el-radio>
                        <el-radio :label="2" :disabled="btnType==2">班级课表</el-radio>
                    </el-radio-group>
                    <el-autocomplete 
                        v-if="qryForm.qryType == 1" 
                        v-model="qryForm.qryTeacherName" 
                        :disabled="btnType==2"
                        :fetch-suggestions="qrySearchTeacherNameAsync"
                        placeholder="教师姓名"
                        @select="qrySearchTeacherNameAsyncSelected">
                    </el-autocomplete>
                    <el-select  v-if="qryForm.qryType == 2" filterable  v-model="qryForm.qryClassId" @change="btnClickForQuery" placeholder="请选择班级" style="width: 202px;" :disabled="btnType==2">
                        <el-option v-for="item in classData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button size="smail" type="primary" class="confirm" @click="btnClickForQuery" :disabled="btnType==2">查 询</el-button>
                    <el-button size="smail" type="primary" @click="btnClickForEditOrSave" v-if="qryForm.qryType==2">{{btnTypeStr}}</el-button>
                    <el-button size="smail" type="primary" v-if="btnType==2" @click="btnClickForEditOrSaveCancel" >取消</el-button>
                    <el-button class="confirm" @click="btnClickForGoBack()" style="color: #fff;position:absolute;top:0;right:0;">返回</el-button>
                </el-row>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :span-method="arraySpanMethod"
                    :data="tableData">
                        <el-table-column prop="time"      label=""></el-table-column>
                        <el-table-column prop="section"   label="节次/课程"></el-table-column>
                        <el-table-column prop="col1"      label="星期一">
                            <template slot-scope="scope">
                                <div v-if="btnType==1">{{scope.row.col1}}</div>
                                <div v-if="btnType==2 && scope.row.col1.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col1.subject_id!=''">
                                    <el-select v-model="scope.row.col1.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col1)">
                                        <el-option v-for="(item,index) in scope.row.col1.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <label v-if="scope.row.col1.subject_id!=''">{{scope.row.col1.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="col2"  label="星期二">
                            <template slot-scope="scope">
                                 <div v-if="btnType==1">{{scope.row.col2}}</div>
                                <div v-if="btnType==2 && scope.row.col2.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col2.subject_id!=''">
                                    <el-select v-model="scope.row.col2.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col2)">
                                        <el-option v-for="(item,index) in scope.row.col2.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                        </el-select>
                                    <label v-if="scope.row.col2.subject_id!=''">{{scope.row.col2.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="col3" label="星期三">
                            <template slot-scope="scope">
                                 <div v-if="btnType==1">{{scope.row.col3}}</div>
                                <div v-if="btnType==2 && scope.row.col3.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col3.subject_id!=''">
                                    <el-select v-model="scope.row.col3.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col3)">
                                        <el-option v-for="(item,index) in scope.row.col3.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                        </el-select>
                                    <label v-if="scope.row.col3.subject_id!=''">{{scope.row.col3.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="col4"  label="星期四">
                            <template slot-scope="scope">
                                 <div v-if="btnType==1">{{scope.row.col4}}</div>
                                <div v-if="btnType==2 && scope.row.col4.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col4.subject_id!=''">
                                    <el-select v-model="scope.row.col4.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col4)">
                                        <el-option v-for="(item,index) in scope.row.col4.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <label v-if="scope.row.col4.subject_id!=''">{{scope.row.col4.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="col5"    label="星期五">
                            <template slot-scope="scope">
                                 <div v-if="btnType==1">{{scope.row.col5}}</div>
                                <div v-if="btnType==2 && scope.row.col5.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col5.subject_id!=''">
                                    <el-select v-model="scope.row.col5.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col5)">
                                        <el-option v-for="(item,index) in scope.row.col5.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <label v-if="scope.row.col5.subject_id!=''">{{scope.row.col5.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="col6"  label="星期六">
                            <template slot-scope="scope">
                                 <div v-if="btnType==1">{{scope.row.col6}}</div>
                                <div v-if="btnType==2 && scope.row.col6.subject_id==''">暂无排课</div>
                                <div v-if="btnType==2 && scope.row.col6.subject_id!=''">
                                    <el-select v-model="scope.row.col6.subject_id"  placeholder="请选择科目" @change="selectChangedForSubjectCol(scope.row.col6)">
                                        <el-option v-for="(item,index) in scope.row.col6.subjectList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <label v-if="scope.row.col6.subject_id!=''">{{scope.row.col6.teacherName}}</label>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
            </template>
        </I-table>
    </div>
</template>
<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    data() {
        return {
            qryFormLabelWidth: '100px',
            btnType:1,              //修改~1~保存~2
            btnTypeStr:"修 改",     //修改~1~保存~2
            courseId:"",            //排课ID
            qryTeacherNameAsync:"", //教师模糊匹配输入值
            qryTeacherNameAsyncData:[], //教师模糊匹配返回数组
            classData:[],           //班级列表下拉
            qryForm: {
                qryType:1,          //课程查看分类，教师课表~1~班级课表~2
                qryTeacherId:"",    //教师ID
                qryTeacherName:'',  //教师姓名
                qryClassId:'',      //班级选择项
            },
            tableData: [],
            tableData:[],
            subjectList:[],
            allColCount:0,
            classCourse_native:[],     //班级课表-原始数据[{id:,subject_id:}]
            classCourse_editd:[],      //班级课表-修改数据[{id:,subject_id:}]
        };
    },
    components: {
        ITable,
        ITableEditor,
    },
    mounted () {
        this.courseId = this.$route.params.id;
        if(this.courseId==""){
            this.$message.error("非法查看当前页面，请从排课记录中进入！");
            return;
        }
        console.log("传过来的ID=" + this.courseId);
        this.init();
    },
    methods: {
        init(){
            //查询当前登录者的教师ID及姓名
            this.qrySearchTeacherNameAsync(localStorage.jxname);
            //获得班级列表
            this.classData = [];
            this.$http.post('/SchoolClass/lists', {
                token: localStorage.jxtoken,
                page_number:1,
                page_size:9999999
            }).then((res) => {
                let classNameList=["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"];
                res.data.row.forEach(e=>{
                    let className = e.grade + "（"+e.class + "）班";
                    className = e.grade  + e.class;
                    //try{className = e.grade + "（"+ classNameList[parseInt(e.class)-1] + "）班";}catch(e){}
                    this.classData.push({label:className,value:e.id});
                });
            })
            .catch(res=>{
                this.$message.error(res.info)
            });

        },
        //模糊匹配 - 教师姓名-列表
        qrySearchTeacherNameAsync(name, cb){
            console.log("querySearchTeacherNameAsync =>" + name);
            this.qryTeacherNameAsync = name;
            this.qryTeacherNameAsyncData = [];
            this.$http.post('/Staff/search', {
                token: localStorage.jxtoken,
                name: this.qryTeacherNameAsync
            },{showLoading:false})
            .then((res) => {
                res.data.forEach(e=>{this.qryTeacherNameAsyncData.push({id:e.id,value:e.name});});
                if(cb){cb(this.qryTeacherNameAsyncData);return;}
                if(this.qryTeacherNameAsyncData.length>0){
                    this.qryForm.qryTeacherId =this.qryTeacherNameAsyncData[0].id;
                    this.qryForm.qryTeacherName =this.qryTeacherNameAsyncData[0].value;
                    this.btnClickForQuery(); 
                }
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //模糊匹配 - 教师姓名 - 选中
        qrySearchTeacherNameAsyncSelected(obj){
            console.log("qrySearchTeacherNameAsyncSelected =>",JSON.stringify(obj));
            this.qryForm.qryTeacherId = obj.id;
            this.qryForm.qryTeacherName = obj.value;
            this.btnClickForQueryByTeacher();
        },
        //切换查询模式
        qryTypeChanged(){
            console.log(this.qryForm.qryType);
            if((this.qryForm.qryType==1 && this.qryForm.qryTeacherId!="") || (this.qryForm.qryType==2 && this.qryForm.qryClassId!=""))
            {
                this.btnClickForQuery();
            }else{
                this.tableData = [];
            }
        },
        //查询
        btnClickForQuery() {
            if(this.qryForm.qryType==1){    //教师课表
                this.btnClickForQueryByTeacher();
            }else if(this.qryForm.qryType==2){  //班级课表
                this.btnClickForQueryByClass();
            }
        },
        //教师课表查询
        btnClickForQueryByTeacher(){
            //调用接口查询数据
            if(this.qryForm.qryTeacherId==""){
                 this.$message.error("请输入教师名称后再执行此操作！");
                 return;
             }
            this.tableData = [];
            this.$http.post('/TimeTable/index', {
                token: localStorage.jxtoken,
                staff_id:this.qryForm.qryTeacherId,
                course_id:this.courseId
            }).then((res) => {
                var node1=[],node2=[],node3=[],node4=[];
                res.data.forEach(row=>{
                    let rowObj = {time:"",section:"",col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",rowspan:1,colspan:1,spanIndex:0};
                    for(let index in row){
                         const colItem = row[index];
                         if(index==1){rowObj.time = colItem.type;rowObj.section = colItem.section;}
                         rowObj["col" + index] = colItem.subject_name + " " +  ((colItem.class==undefined || colItem.class==null)?"":colItem.class);
                    }
                    if(rowObj.time=="早自习")node1.push(rowObj);
                    if(rowObj.time=="上午")node2.push(rowObj);
                    if(rowObj.time=="下午")node3.push(rowObj);
                    if(rowObj.time=="晚自习")node4.push(rowObj);
                });
                for (let k = 0; k < node1.length; k++) {
                        const element = node1[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node1.length;}else{  element.time  = element.section;}
                    }
                for (let k = 0; k < node2.length; k++) {
                    const element = node2[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node2.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node3.length; k++) {
                    const element = node3[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node3.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node4.length; k++) {
                    const element = node4[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node4.length;}else{element.time  = element.section;}
                }
                this.tableData = Array.concat(node1,node2,node3,node4);
                //成功后修改状态
                this.btnType=1;
                this.btnTypeStr="修 改";
            }).catch(res=>{
                this.$message.error(res.info)
            });
        },
        //班级课表查询
        btnClickForQueryByClass(){
             //调用接口查询数据
             if(this.qryForm.qryClassId==""){
                 this.$message.error("请选择班级后再执行此操作！");
                 return;
             }
            this.tableData = [];
            this.$http.post('/TimeTable/index', {
                token:this.$tools.getToken(),
                class_id:this.qryForm.qryClassId,
                course_id:this.courseId     //不设置，默认最新
            }).then((res) => {
                var node1=[],node2=[],node3=[],node4=[];
                res.data.forEach(row=>{
                    let rowObj = {time:"",section:"",col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",rowspan:1,colspan:1,spanIndex:0};
                    for(let index in row){
                        const colItem = row[index];
                        if(index==1){rowObj.time = colItem.type;rowObj.section = colItem.section;}
                        rowObj["col" + index] = colItem.subject_name + " " +  colItem.name
                    }
                    if(rowObj.time=="早自习")node1.push(rowObj);
                    if(rowObj.time=="上午")node2.push(rowObj);
                    if(rowObj.time=="下午")node3.push(rowObj);
                    if(rowObj.time=="晚自习")node4.push(rowObj);
                });
                for (let k = 0; k < node1.length; k++) {
                    const element = node1[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node1.length;}else{  element.time  = element.section;}
                }
                for (let k = 0; k < node2.length; k++) {
                    const element = node2[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node2.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node3.length; k++) {
                    const element = node3[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node3.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node4.length; k++) {
                    const element = node4[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node4.length;}else{element.time  = element.section;}
                }
                this.tableData = Array.concat(this.tableData,node1,node2,node3,node4);
                //成功后修改状态
                this.btnType=1;
                this.btnTypeStr="修 改";
            }).catch(res=>{
                this.$message.error(res.info)
            })
        },
        //班级课表查询 - 编辑
        btnClickForQueryByClassEdit(){
            //获得 科目列表 - 对应教师
            this.subjectList = [];
            this.tableData = [];
            this.classCourse_native = [];
            this.classCourse_editd = [];
            this.$http.post('/Course/getSubjectStaff ', {
                token: localStorage.jxtoken,
                class_id:this.qryForm.qryClassId
            }).then(res=>{
                //this.subjectList.push({label:"暂不排课",value:""});
                res.data.forEach(e=>{
                    this.subjectList.push({label:e.subject_name,value: e.teaching_subject_id,teacherName:e.staff_name});
                });
                //取课表数据
                this.tableData = [];
                this.$http.post('/TimeTable/index', {
                    token:this.$tools.getToken(),
                    class_id:this.qryForm.qryClassId,
                    course_id:this.courseId     //不设置，默认最新
                }).then((res) => {
                    this.allColCount = 0;
                    var node1=[],node2=[],node3=[],node4=[];

                    res.data.forEach(row=>{
                        let rowObj = {time:"",section:"",col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",rowspan:1,colspan:1,spanIndex:0};
                        for (let colIndex in row) {
                            const colItem = row[colIndex];
                            this.classCourse_native.push({id:colItem.id,subject_id:colItem.subject_id});
                            if(colIndex==1){rowObj.time = colItem.type;rowObj.section = colItem.section;}
                            if(colItem.id!="")this.allColCount++;
                            colItem["id"] = colItem.id.toString();
                            colItem["subject_id"] = colItem.subject_id;
                            colItem["subjectList"] = this.subjectList.slice();
                            colItem["teacherName"] = colItem.name;
                            rowObj["col" + colIndex] ={
                                id:colItem.id,
                                subject_id:colItem.subject_id,
                                teacherName:colItem.teacherName,
                                subjectList:colItem.subjectList
                            }
                        }
                        if(rowObj.time=="早自习")node1.push(rowObj);
                        if(rowObj.time=="上午")node2.push(rowObj);
                        if(rowObj.time=="下午")node3.push(rowObj);
                        if(rowObj.time=="晚自习")node4.push(rowObj);
                    });
                    for (let k = 0; k < node1.length; k++) {
                        const element = node1[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node1.length;}else{  element.time  = element.section;}
                    }
                    for (let k = 0; k < node2.length; k++) {
                        const element = node2[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node2.length;}else{element.time  = element.section;}
                    }
                        for (let k = 0; k < node3.length; k++) {
                        const element = node3[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node3.length;}else{element.time  = element.section;}
                    }
                        for (let k = 0; k < node4.length; k++) {
                        const element = node4[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node4.length;}else{element.time  = element.section;}
                    }
                    this.tableData = Array.concat(node1,node2,node3,node4);
                }).catch(res=>{
                    this.$message.error(res.info)
                });
            }).catch(res=>{

            });
        },
        //修改单元格的科目
        selectChangedForSubjectCol(col){
            //判断改变
            this.classCourse_native.forEach(e=>{
                if(e.id==col.id ){
                    if(e.subject_id==col.subject_id){
                        //改成与原来相同的了即 改回去了。 - 从改变列表中移除
                        console.log("改成与原来相同的了即 改回去了。 - 从改变列表中移除");
                        for (let k = 0; k < this.classCourse_editd.length; k++) {
                            const el = this.classCourse_editd[k];
                            if(el.id!=col.id)continue;
                             this.classCourse_editd.splice(k,1);
                            break;
                        }
                    }else{
                        //改变了，加入改变列表
                        console.log("改变了，加入改变列表");
                        this.classCourse_editd.push({id:col.id,subject_id:col.subject_id});
                    }
                    return;
                }
            });
            //通过科目ID获得班级列表绑定到row上
            col.teacherName = "";
            this.subjectList.forEach(e=>{
                if(e.value == col.subject_id){
                    col.teacherName = e.teacherName;
                    return;
                }
            });
        },
        //修改/保存
        btnClickForEditOrSave() {
            if(this.tableData.length<1){
                this.$message.error("没有排课数据，请更换查询条件后再执行此操作！");
                return;
            }
            if(this.btnType==1){
                //进入修改
                this.btnType=2;
                this.btnTypeStr="保 存";
                this.btnClickForQueryByClassEdit();
            }else{
                if(this.classCourse_editd.length<1){
                    this.$message.error("您尚未修改任何排课数据，请修改后再执行此操作！");
                    return;
                }
                console.log("保存修改项,length=" + this.classCourse_editd.length);
                this.$store.commit('startLoad');
                 this.saveOneByOne(0);

                //开始保存第一个,行从0-tableData.length-1,列从1-6
                // this.tableData.forEach(row=>{
                //     for (let k = 1; k < 6; k++) {
                //         let col = row["col" + k];
                //         if(col.id=="")continue;
                //         this.$http.post('/Course/editClassTimeTable', {
                //             token: localStorage.jxtoken,
                //             subject_id:col.subject_id,
                //             id:col.id
                //         },{showLoading:false,showError:false})
                //         .then(res=>{
                //             addCount++;
                //             console.log(addCount +"/" + this.allColCount);
                //             if(addCount>=this.allColCount){
                //                 this.$store.commit('endLoad');
                //                 this.btnClickForEditOrSaveCancel();
                //                 this.$message.success("排课修改成功！");
                //             }
                //         })
                //         .catch(res=>{
                //             this.$store.commit('endLoad');
                //             this.$message.error("排课数据保存失败：" + res.info);
                //             return;
                //         });
                //     }
                // });
            }
        },
        //取消保存
        btnClickForEditOrSaveCancel(){
            this.btnType=1;
            this.btnTypeStr="修 改";
            this.btnClickForQueryByClass();
        },
        //合并行
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if(columnIndex == 0){
                return [row.rowspan,row.colspan];
            }else if(columnIndex==1 && row.spanIndex>0  && row.time == row.section) {
                 return [0,0];
             }
        },
        //返回上一页
        btnClickForGoBack(){
            console.log("btnClickForGoBack");
            this.$router.push({path: "/course-manage-record"});      
        },
        //做个递归，以满足后端接口的单个单元格保存
        saveOneByOne(index){
            let col= null;
            try{
                if(index>this.classCourse_editd.length-1){
                    //结束了 - 提交完了竟然还没报错，就提示成功吧
                    // console.log("结束了 - 提交完了竟然还没报错，就提示成功吧");
                    this.$store.commit('endLoad');
                    this.btnClickForEditOrSaveCancel();
                    this.$message.success("排课修改成功！");
                    return;
                }
                // console.log("正在保存：" + index + "/" + this.classCourse_editd.length);
                col = this.classCourse_editd[index];
                //提交接口
                this.$http.post('/Course/editClassTimeTable', {
                    token: localStorage.jxtoken,
                    subject_id:col.subject_id,
                    id:col.id
                },{showLoading:false,showError:false})
                .then(res=>{
                    let arr = this.getSomeNoticeByCol(col);
                    if(arr.length==3){
                        console.log("保存 => " + arr[0] + " => " + arr[1] + " => " + arr[2] + "==>成功");
                    }
                    //非常丑陋的调用自己
                    this.saveOneByOne(index+1);
                    return;
                })
                .catch(res=>{
                    let arr = this.getSomeNoticeByCol(col);
                    if(arr.length==3){
                        console.log("保存 => " + arr[0] + " => " + arr[1] + " => " + arr[2] + "==>失败");
                    }
                    //失败 - 结束，不再递归
                    this.$store.commit('endLoad');
                    this.$message.error("排课数据保存失败：" + res.info);
                    return;
                });
            }catch(e){
                let arr = this.getSomeNoticeByCol(col);
                if(arr.length==3){
                    console.log("保存 => " + arr[0] + " => " + arr[1] + " => " + arr[2] + "==>失败");
                }
                //失败 - 结束，不再递归
                this.$store.commit('endLoad');
                this.$message.error("排课数据保存失败，请刷新后重试！");
            }
        },
        //获得单元格所属位置
        getSomeNoticeByCol(col){
            if(col==null || col==undefined){
                return [];
            }
            let ctime = "",time="",section="",week="";
            let arr = ["","星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
            this.tableData.forEach(e=>{
                if(e.time!=e.section)ctime=e.time;
                for (let k = 1; k <= 6; k++) {
                    try{
                        if(e["col" + k].id== col.id){
                            //找到了
                            time = ctime;
                            section = e.section;
                            console.log(e["col" + k]);
                            week = arr[k];
                            break;
                        }
                    }catch(e){

                    }
                }
            });
            if(week!="" && time!="" && section!=""){
                return [week,time,section];
            }else{
                return [];
            }
        }
    }
}
</script>
<style scoped lang="less">
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:white;
    }
.el-row {
    font-size: 14px;
    font-family: "SimSun";
    color: #808080;
    margin-bottom: 8px;
    height: 22px;
}
.el-button{
    font-family: "SimSun";
    font-size:15px;
    width:80px;
}
</style>
