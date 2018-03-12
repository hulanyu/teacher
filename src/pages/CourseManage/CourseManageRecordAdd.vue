<template>
    <div>
        <I-table
        title="智能排课" 
        class="mytable"
        :isUpdate="true"
        :isBack="false"
        @update="init">
            <template slot="head">
                <el-button class="confirm" @click="btnClickForGoBack()" style="color: #fff;position:absolute;top:0;right:0;">返回</el-button>
                <el-row>
                    <el-col :span="24" class="el-rows-head">排课参数设置</el-col>
                </el-row>
                <el-row style="margin-top:8px;">
                    <label>课程名称</label>
                    <el-input v-model="selForm.name" auto-complete="off"  :autofocus="true" placeholder="请输入课程名称" style="width:150px;"></el-input>
                    <label>排课年级</label>
                    <el-select v-model="selForm.gradeId" filterable default-first-option  placeholder="请选择排课年级" @change="selectChangeForGrade" style="width: 150px;">
                        <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <label>课表时间</label>
                    <el-select v-model="selForm.dateId" filterable default-first-option placeholder="请选择课表时间" @change="selectChangeForGradeTime" style="width: 150px;">
                        <el-option v-for="item in gradeTimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-row>
            </template>
            <template slot="content" slot-scope="props">
                <div
                :style="'overflow: auto; height: ' + props.maxHeight + 'px;'">
                    <el-table
                    border
                    row-class-name="table-row"
                    style="width: 100%;"
                    :data="tableData">
                        <el-table-column  v-for="(item,index) in tableDataBindList" :prop="item.value" :label="item.label" :key="index">
                            <template slot-scope="scope">
                                <div
                                v-if="index === 0"><el-checkbox v-model="scope.row.checkedAll" @change="rowSelectAllOrNo(scope.row)" >{{scope.row.col0}}</el-checkbox></div>
                                <el-checkbox v-model="scope.row.checkedList[index-1]" @change="colSelectChange(scope.row,index-1)" style="width:100%;height:100%;"
                                v-else></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-left: 10px;">
                        <el-row>
                            <div v-for="(item,index) in dayConfigList" v-bind:key="index">
                                <el-checkbox  v-model="item.checked"  ></el-checkbox> 每天 
                                    <el-input v-model="item.nodeCount" auto-complete="off" placeholder="" style="width:182px;margin-top:4px;"></el-input> 节
                                        <el-select placeholder="请选择课程" v-model="item.courseID" style="width:288px;">
                                            <el-option v-for="item in subjectList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select> 课
                                <el-button size="smail" type="primary" class="btnAddMore" v-if="index==0" @click="btnClickForAddDayConfigMore">添加更多</el-button>
                                <el-button size="smail" type="primary" class="btnAddMore remove" v-if="index>0" @click="btnClickForAddDayConfigMoreRemove(index)">删除此项</el-button>
                            </div>
                        </el-row>
                        <el-row>
                            <div v-for="(item,index) in subjectConfigList" v-bind:key="index">
                                <el-checkbox  v-model="item.checked" style="margin-top:4px;"></el-checkbox>　
                                    <el-select placeholder="请选择课程" v-model="item.courseIDBefore" style="margin-top:4px;">
                                        <el-option v-for="item in subjectList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select> 课后不能排 
                                    <el-select placeholder="请选择课程" v-model="item.courseIDAfter" style="width:232px;">
                                        <el-option v-for="item in subjectList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select> 课
                                <el-button size="smail" type="primary" class="btnAddMore" v-if="index==0" @click="btnClickForAddCourseConfigMore">添加更多</el-button>
                                <el-button size="smail" type="primary" class="btnAddMore remove" v-if="index>0" @click="btnClickForAddCourseConfigMoreRemove(index)">删除此项</el-button>
                            </div>
                        </el-row>
                        <el-row>
                            <el-checkbox v-model="checked_courseSubjectConfigList"></el-checkbox> 
                                <el-select placeholder="请选择课程"  v-model="courseSubjectConfigList" multiple style="width:532px;margin-top:4px;">
                                    <el-option v-for="item in subjectList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select> 课不能连排
                                <!-- （多个课程请用;隔开） -->
                                <!-- <el-input v-model="name" auto-complete="off" placeholder="" style="width:218px;"></el-input> 课不能连排（多个课程请用;隔开） -->
                            
                        </el-row>
                        <el-row>
                            <el-checkbox v-model="checked_courseConfigList"></el-checkbox> 连排课程不能安排在 
                                <el-select placeholder="请选择课程" v-model="courseConfigList" multiple style="width:400px;margin-top:4px;">
                                    <el-option-group
                                        v-for="group in courseNodeBindList"
                                        :key="group.label"
                                        :label="group.label">
                                        <el-option v-for="option in group.options"
                                            :key="option.value"
                                            :label="option.label"
                                            :value="option.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select> 节次
                            
                            <!-- （多节请用;隔开） -->
                            <!-- <el-input v-model="name" auto-complete="off" placeholder="" style="width:218px;"></el-input> 节（多节请用;隔开） -->
                        </el-row>
                        <el-row>
                            <el-checkbox  v-model="checked_afternoonSports" style="margin-top:4px;" ></el-checkbox> 下午体育课后节次不排其他课程
                        </el-row>
                        <el-row>
                            <el-button size="smail" type="primary" class="confirm" style="margin-top:10px;" @click="btnClickForSubmit">开 始 排 课</el-button>
                        </el-row>
                    </div>
                </div>
            </template>
        </I-table>
    </div>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
  data() {
    return {
        dialogFormVisible: false,
        formLabelWidth: "100px",
        addImg: "../static/imgs/addBtn.png",
        total:1,        //数据总行数
        pageIndex:1,    //页面序号
        pageSize:10,    //页面大小
        sort:"id",      //排序字段
        order:"desc",   //排序顺序类型
        selForm:{       //查询提交参数对象
            name:"",
            gradeId:"",
            dateId:""
        },
        gradeList:[],               //学校所有年级的列表 {lable:name,value:id}
        gradeTimeList:[],           //当前年级所对应的课表时间列表 {lable:name,value:id}
        subjectList:[],             //科目列表{lable:name,value:id}
        courseNodeList:[],          //节次列表-不含分组
        courseNodeBindList:[],      //节次列表-含分组{lable:name,value:id,options:[{lable:name,value:id}]}
        tableData:[],               //中间表数据
        tableDataBindList:[],       //中间表绑定数据
        dayConfigList:[],           //每天多少节某某课
        subjectConfigList:[],       //某某课后不能排某某课
        courseSubjectConfigList:[], //某某课不能连排
        courseConfigList:[],        //连排不能安排在好多节 多个以;号隔开
        checked_afternoonSports:false,          //下午体育课后节次不能排其它课程
        checked_courseConfigList:false,         //连排不能安排在好多节 勾选
        checked_courseSubjectConfigList:false   //某某课不能连排 - 勾选

    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor,
  },
  mounted() {
    console.log("页面加载完成");
    this.init();
  },
  methods: {
    init() {
        this.selForm.name = "";
        this.selForm.gradeId = "";
        this.selForm.dateId = "";
        this.tableData = [];
        this.dayConfigList=[];
        this.courseConfigList=[];
        this.continuityConfig=[];
        this.checked_afternoonSports = false;
        this.checked_courseConfigList =false;
        this.checked_courseSubjectConfigList = false;
        this.subjectList = [];
        this.dayConfigList=[{nodeCount:1,courseID:null,checked:false}];
        this.subjectConfigList=[{courseIDBefore:null,courseIDAfter:null,checked:false}];
        //调用接口 - 获得排课年级列表
        this.gradeList = [];
        this.$http.post("/SchoolGrade/lists", {
          token:this.$tools.getToken(),
          page_number:this.pageIndex,
          page_size:this.pageSize * 999999,
          sort:this.sort,
          order:this.order
        })
        .then(res => {
            console.log("排课年级：" , res);
            res.data.row.forEach(element=>{this.gradeList.push({label:element.grade,value:element.id});});
            if(this.gradeList.length>0)
            {   
                this.selForm.gradeId = this.gradeList[0].value;
                this.selectChangeForGrade();
            }
        });

        //调用接口 - 获得课表时间列表
        this.gradeTimeList = [];
        this.$http.post("/Course/timeList", {
            token:this.$tools.getToken(),
            page_number:this.pageIndex,
            page_size:this.pageSize * 999999,
            sort:this.sort,
            order:this.order
        })
        .then(res => {
            console.log("课表时间" , res);
            res.data.row.forEach(element=>{this.gradeTimeList.push({label:element.title,value:element.id});});
            if(this.gradeTimeList.length>0)
            {   
                this.selForm.dateId = this.gradeTimeList[0].value;
                this.selectChangeForGradeTime();
            }
        });
    },
    //返回上一页
    btnClickForGoBack(){
        this.$router.push({path: "/course-manage-record"});      
    },
    //年级切换
    selectChangeForGrade(){
        console.log("年级切换=" + this.selForm.gradeId);
        //调用接口
        this.subjectList = [];
        this.tableDataBindList=[];
        this.$http.post("/Course/getSubject", {
            token:this.$tools.getToken(),
            grade_id:this.selForm.gradeId
        })
        .then(res => {
            console.log("排课-根据年级获取科目" , res);
            res.data = res.data || [];
            if(res.data.length<1){
                this.$message.error("未找到对应的教学科目信息，请更换年级或新增对应的教学科目！");
                this.tableData = [];
                return;
            }
            res.data.forEach(e=>{
                this.subjectList.push({label:e.subject_name,value:e.id.toString()});
            });
            this.tableDataBindList = Array.concat({label:"节次/课程",value:"col0"},this.subjectList);
            this.loadTableData();
        });
        
    },
    //课表时间切换
    selectChangeForGradeTime(){
        console.log("selectChangeForGradeTime=" + this.selForm.dateId);
        //通过课表时间ID获得详情 - 课表时间-信息
        //发起请求 - 获得节次
        this.courseNodeList = [];
        this.courseNodeBindList = [];
        this.$http.post("/Course/timeInfo", {
          token:this.$tools.getToken(),
          id:this.selForm.dateId
        })
        .then(res => {
            if(!res.data || !res.data.node || res.data.node.length<1){this.tableData=[];return;}
            //分拆数据，进行对应 node_cate:（1早自习，2上午，3下午，4晚自习）
            var node1=[],node2=[],node3=[],node4=[];
            for (let k = 0; k < res.data.node.length; k++) {
                const item = res.data.node[k];
                if(item.node_cate=="1"){node1.push({label:item.node,value:item.id});}
                if(item.node_cate=="2"){node2.push({label:item.node,value:item.id});}
                if(item.node_cate=="3"){node3.push({label:item.node,value:item.id});}
                if(item.node_cate=="4"){node4.push({label:item.node,value:item.id});}
            }
            this.courseNodeList = Array.concat(node1,node2,node3,node4);
            this.courseNodeBindList.push({label:"早自习",options:node1.slice()});
            this.courseNodeBindList.push({label:"上午",options:node2.slice()});
            this.courseNodeBindList.push({label:"下午",options:node3.slice()});
            this.courseNodeBindList.push({label:"晚自习",options:node4.slice()});
            console.log("courseNodeList=",this.courseNodeList);
            console.log("courseNodeBindList=",this.courseNodeBindList);
            this.loadTableData();
        }).catch(res=>{
            this.$message.error("未找到对应的教学节次信息，请更换课表时间或新增对应的课表时间！");
            this.tableData=[];
        });
    },
    //加载表格数据
    loadTableData(){
        //科目 + 节次 = 表格数据组装
        var data = [];
        console.log(this.courseNodeList);
        console.log("this.subjectList.length=" + this.subjectList.length);
        this.courseNodeList.forEach(e=>{
            let arr = [];
            this.subjectList.forEach(e=>{ arr.push(false);});
            data.push({
                col0:e.label,
                label:e.label,
                value:e.value,
                checkedAll:false,
                checkedList:arr.slice()
            });
        });
        this.tableData = data.slice();
    },
    //添加更多 - 每天
    btnClickForAddDayConfigMore(){
        this.dayConfigList.push({nodeCount:1,courseID:null,checked:false});
    },
    //删除当前选项 - 每天
    btnClickForAddDayConfigMoreRemove(index){
        this.dayConfigList.splice(index,1);
    },
    //添加更多 - 课程连排
    btnClickForAddCourseConfigMore(){
        this.subjectConfigList.push({courseIDBefore:null,courseIDAfter:null,checked:false});
    },
    //删除当前选项 - 课程连排
    btnClickForAddCourseConfigMoreRemove(index){this.subjectConfigList.splice(index,1);},
    //智能排课
    btnClickForSubmit(){
        if(this.selForm.name==""){this.$message.error("请输入课程名称！");return;}
        if(this.selForm.gradeId==""){this.$message.error("请选择排课年级！");return;}
        if(this.selForm.dateId==""){this.$message.error("请选择课表时间！");return;}
        var submitObj = {
            token:localStorage.jxtoken,         //token
            name:this.selForm.name,         	//排课名称
            grade_id:this.selForm.gradeId,        //年级id
            time_id:this.selForm.dateId,         //排课时间id
            time_node:"",       //课节允许的科目
            subject_number:"",  //每天科目排的节数
            no_row:"",          //A科目后不允许排B科目
            no_platoon:"",      //不允许连排的科目
            platoon_no_node:"", //连排科目不允许安排的课节
            sports:0            //体育课后是否允许排课，1允许，0不允许
        };
        //体育课
        submitObj.sports = (this.checked_afternoonSports)?0:1;
        //连排课程不能安排在某某节次
        if(this.checked_courseConfigList)submitObj.platoon_no_node = this.courseConfigList.join(",");
        //某某些课不能连排
        if(this.checked_courseSubjectConfigList)submitObj.no_platoon = this.courseSubjectConfigList.join(",");
        //每天好多节什么课
        var tmpObj = {};
        var k=0;
        for (k = 0; k < this.dayConfigList.length; k++) {
            const element = this.dayConfigList[k];
            if(!element.checked || element.courseID==null || element.courseID==undefined ||element.courseID=="")continue;
            tmpObj[element.courseID] = element.nodeCount;
        }
        submitObj.subject_number = JSON.stringify(tmpObj);
        //某某课后不能排某某课
        tmpObj={};
        //        this.subjectConfigList=[{courseIDBefore:null,courseIDAfter:null,checked:false}];
        for (k = 0; k < this.subjectConfigList.length; k++) {
            const element = this.subjectConfigList[k];
            if(!element.checked || element.courseIDBefore==null || element.courseIDBefore==undefined ||element.courseIDBefore=="")continue;
            if(!element.checked || element.courseIDAfter==null || element.courseIDAfter==undefined ||element.courseIDAfter=="")continue;
            tmpObj[element.courseIDBefore] = element.courseIDAfter;
        }
        submitObj.no_row = JSON.stringify(tmpObj);
        //课节允许的科目
        tmpObj={};
        for (k = 0; k < this.tableData.length; k++) {
            const element = this.tableData[k];
            let key = element.value;
            tmpObj[key] = [];
            for (let kk = 0; kk < element.checkedList.length; kk++) {
                if(!element.checkedList[kk])continue;
                tmpObj[key].push(parseInt(this.subjectList[kk].value));
            }
            // tmpObj[key] = JSON.stringify(tmpObj[key]);
        }
        submitObj.time_node = JSON.stringify(tmpObj);
        //提交form表单，智能排课
        console.log("提交接口数据",JSON.stringify(submitObj));
        this.$http.post("/Course/doCourse",submitObj)
        .then(res => {
            this.$message.success("排课成功，正在转入详情...");
            setTimeout(()=>{
                this.$router.push({ name: 'CourseManageRecordDetail', params: { id: res.data.id }});
            },1500);
        });
    },
    //行全选-全不选
    rowSelectAllOrNo(row){
        for (let k = 0; k < row.checkedList.length; k++) {
            row.checkedList[k] = row.checkedAll;
        }
    },
    //列单选变化
    colSelectChange(row,index){
        if(!row.checkedList[index] && row.checkedAll){
            row.checkedAll = false;
        }else{
            if(row.checkedList.join(",").indexOf("false")!=-1){
                row.checkedAll = false;
            }else{
                row.checkedAll = true;
            }
        }
    }
  }
};
</script>
<style scoped lang="less">
.el-button--text {
  padding: 5px;
  background: #409eff;
  color: white;
}
.el-row {
    font-size: 14px;
    font-family: "SimSun";
    color: #808080;
}
.el-rows-head{
    font-weight: normal;
    color: #666666;
}
.remove{
    background-color: red;
    border-color: red;
}
</style>
