<template>
    <div class="course-manage-time-record">
        <I-table
        title="课表时间管理"
        :isUpdate="true"
        :isBack="false"
        @update="doSearch">
            <template slot="head">
                <el-button size="smail" type="primary" class="confirm" @click="btnClickForAdd">新 增</el-button>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :data="tableData"
                    @sort-change="sortChange">
                        <el-table-column
                        prop="title"
                        label="标题"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="btnClickForEdit(scope.row)" type="text" size="small">修改</el-button>
                            <el-button @click="btnClickForDelDialog(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisible" title="添加课表时间设置" width="530px">
                    <template slot="content">
                        <el-row>
                            <label>每周：</label>
                            <el-select v-model="addForm.weekCount" placeholder="选择每周上课天数" style="width:120px;">
                                <el-option  v-for="item in baseData.weekList" 
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>　天课　　　　
                            <label>每天：</label>
                            <el-select v-model="addForm.dayCount" @change="daychange" placeholder="选择每天上课数" style="width:120px;">
                                <el-option  v-for="item in baseData.dayList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>　节课
                        </el-row>
                        <el-row>
                            <label>标题：</label>
                            <el-input v-model="addForm.title" auto-complete="off" placeholder="请输入标题" style="width:440px;"></el-input>
                        </el-row>
                        <el-row>
                            <el-table
                                border
                                style="width: 100%;max-height:380px;overflow:auto;"
                                row-class-name="table-row"
                                :data="addForm.dataList"
                                @sort-change="sortChange">
                                <el-table-column label="序号" prop="id" disabled="true"></el-table-column>
                                <el-table-column label="节次名" disabled >
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.namevalue" auto-complete="off" placeholder="请输入节次名"></el-input>
                                         <!-- <el-select placeholder="请选择" v-model="scope.row.namevalue" disabled>
                                            <el-option v-for="item in baseData.courseList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="标记为">
                                    <template slot-scope="scope">
                                         <el-select placeholder="请选择" v-model="scope.row.tagvalue">
                                            <el-option v-for="item in baseData.tagList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button @click="btnClickForDoYes" class="confirm" type="success">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="dialogFormDelVisible" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">您是否确定要删除当前课表时间设置？</div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="dialogFormDelVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="btnClickForDel()">确 定</el-button>
                    </template>
                </I-table-editor>
            </template>
            <template slot="foot">
                <I-table-page
                :total="total"
                @change="pageChange"></I-table-page>
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
        dialogFormDelVisible:false,
        waitForDoJson:null,
        waitForDoType:1,  //新增~1~编辑~2~删除~3
        page_size:10,
        sort:"",
        order:"",
        current: 1,
        total: 1000,
        formLabelWidth: "100px",
      //基础数据
      baseData:{
        //每周节课数
        weekList:[
            {label:"1",value:1},
            {label:"2",value:2},
            {label:"3",value:3},
            {label:"4",value:4},
            {label:"5",value:5},
            {label:"6",value:6},
            {label:"7",value:7},
        ],
        //每天节课数
        dayList:[
            {label:"1",value:1},
            {label:"2",value:2},
            {label:"3",value:3},
            {label:"4",value:4},
            {label:"5",value:5},
            {label:"6",value:6},
            {label:"7",value:7},
            {label:"8",value:8},
            {label:"9",value:9},
            {label:"10",value:10},
            {label:"11",value:11},
            {label:"12",value:12}
        ],
        //节次列表
        courseList:[
            {label:"第一节",value:1},
            {label:"第二节",value:2},
            {label:"第三节",value:3},
            {label:"第四节",value:4},
            {label:"第五节",value:5},
            {label:"第六节",value:6},
            {label:"第七节",value:7},
            {label:"第八节",value:8},
            {label:"第九节",value:9},
            {label:"第十节",value:10},
            {label:"第十一节",value:11},
            {label:"第十二节",value:12},
        ],
        //归属标记列表
        tagList:[
            {label:"早自习",value:1},
            {label:"上午",value:2},
            {label:"下午",value:3},
            {label:"晚自习",value:4}
        ]
      },
      addForm:{
          weekCount:6,
          dayCount:1,
          title:"",
          dataList:[{id:1,namevalue:"第一节",tagvalue:1}]
      },
      tableData: [
        {
          id: 111,
          title: "我是课表时间的标题",
        }
      ],
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor,
  },
  mounted() {
    this.doSearch();
  },
  methods: {
      //初始化数据
      doSearch(){
        this.$http.post("/Course/timeList", {
          token:this.$tools.getToken(),
          page_number: this.current,
          page_size:this.page_size,
          sort:this.sort,
          order:this.order
        })
        .then(res => {
            this.tableData = res.data.row;
            this.total = parseInt(res.data.page.total);
            this.page_size = parseInt(res.data.page.page_size);
            if(this.current>1 && this.tableData.length==0){this.current--;this.doSearch();}
        });
    },
    sortChange({ column, prop, order }) {
      console.log("sortChange", column, prop, order);
    },
    pageChange(current) {
        this.current = current;
        this.doSearch();
    },
    //新增排课时间设置
    btnClickForAdd(){
        this.addForm.dataList = [{id:1,namevalue:"第一节",tagvalue:1}];
        this.addForm.weekCount=6;
        this.addForm.dayCount=1;
        this.addForm.title="";
        this.waitForDoType = 1;
        this.dialogFormVisible = true;
    },
    //修改
    btnClickForEdit(obj) {
        console.log("请求接口-获得当前行的课表时间数据,id=" + obj.id);
         this.$http.post("/Course/timeInfo", {
             token:this.$tools.getToken(),
             id:obj.id
         }).then(res => {
             console.log(res);
            this.addForm.title = res.data.title;
            this.addForm.weekCount = res.data.day_week;
            this.addForm.dataList = [];
            //分拆node - 返回数据变态
            var node1=[],node2=[],node3=[],node4=[];
            for (let k = 0; k < res.data.node.length; k++) {
                const item = res.data.node[k];
                if(item.node_cate=="1"){node1.push({id:1,namevalue:item.node,tagvalue:1});}
                if(item.node_cate=="2"){node2.push({id:1,namevalue:item.node,tagvalue:2});}
                if(item.node_cate=="3"){node3.push({id:1,namevalue:item.node,tagvalue:3});}
                if(item.node_cate=="4"){node4.push({id:1,namevalue:item.node,tagvalue:4});}
            }
            this.addForm.dataList = Array.concat(node1,node2,node3,node4);
            for (let k = 0; k < this.addForm.dataList.length; k++) {this.addForm.dataList[k].id = k+1;}
            this.addForm.dayCount = this.addForm.dataList.length;
            this.waitForDoJson = obj;
            this.waitForDoType = 2;
            this.dialogFormVisible = true;
        });
    },
    //删除-提醒
    btnClickForDelDialog(obj) {
        if(obj==null){this.$message.error("您选择的信息不存在或已被删除，请刷新后重试！");return;}
        this.waitForDoType = 3;
        this.waitForDoJson = obj;
        this.dialogFormDelVisible = true;
    },
    //删除-确定
    btnClickForDel(){
        console.log("我要删除：" + this.waitForDoJson.id);
        this.$http.post("/Course/timeDelete", {
            token:this.$tools.getToken(),
            id:this.waitForDoJson.id
        }).then(res => {
            //回调后
            this.$message.success("恭喜您，删除成功！");
            this.doSearch();
            this.dialogFormDelVisible = false;
            this.waitForDoJson = {};
        });

    },
    //弹出层-确定
    btnClickForDoYes(){
        if(this.waitForDoType==1){this.btnClickForAddYes();return;}
        if(this.waitForDoType==2){this.btnClickForEditYes();return;}
    },
    //添加  - 确定
    btnClickForAddYes(){
        if(this.addForm.title.length<2){
            this.$message.error("请输入标题，至少2个字符！");
            return;
        }
        let submitObj={
            token:this.$tools.getToken(),
            title:this.addForm.title,
            day_week: this.addForm.weekCount,
            node:{"1":[],"2":[],"3":[],"4":[]}
        };
        for (let k = 0; k < this.addForm.dataList.length; k++) {
            const element = this.addForm.dataList[k];
            submitObj.node[element.tagvalue.toString()].push(element.namevalue);
        }
        submitObj.node = JSON.stringify(submitObj.node);
        //调取接口-提交-返回
         this.$http.post("/Course/timeAdd", submitObj)
        .then(res => {
            //回调后
            this. dialogFormVisible= false;
            this.addForm.dataList = [];
            this.addForm.weekCount=6;
            this.addForm.dayCount=1;
            this.addForm.title="";
            this.$message.success("恭喜您，添加成功！");
            this.doSearch();
        });
    },
    //编辑  - 确定
    btnClickForEditYes(){
        if(this.addForm.title.length<2){
            this.$message.error("请输入标题，至少2个字符！");
            return;
        }
        //调取接口-提交-
        let submitObj={
            token:this.$tools.getToken(),
            title:this.addForm.title,
            day_week: this.addForm.weekCount,
            node:{"1":[],"2":[],"3":[],"4":[]},
            id:this.waitForDoJson.id
        };
        for (let k = 0; k < this.addForm.dataList.length; k++) {
            const element = this.addForm.dataList[k];
            submitObj.node[element.tagvalue.toString()].push(element.namevalue);
        }
        submitObj.node = JSON.stringify(submitObj.node);
        //调取接口-提交-返回
         this.$http.post("/Course/timeEdit", submitObj)
        .then(res => {
            this.$message.success("恭喜您，修改成功！");
            this.dialogFormVisible = false;
            this.doSearch();
        });
    },
    //天数改变
    daychange() {
        var maxCount = this.addForm.dayCount;
        var curCount = this.addForm.dataList.length;
        if(curCount<maxCount){  //追加
            for(let k=curCount+1;k<=maxCount;k++) {
                var tagValue = 2;   //默认上午 总共12节， 1-早自习，2-6-上午,7-11-下午， 12-晚自习
                var nameValue = ["第一节","第二节","第三节","第四节","第五节","第六节","第七节","第八节","第九节","第十节","第十一节","第十二节"];
                if(k<=1)tagValue=1;
                if(k>=2 && k<=6)tagValue=2;
                if(k>6 && k<12)tagValue=3;
                if(k>=12)tagValue=4;
                console.log(k,tagValue);
                this.addForm.dataList.push({id:k,namevalue:"",tagvalue:tagValue});
            }
        }else if(curCount>maxCount){  //减少
            this.addForm.dataList.splice(maxCount,curCount-maxCount);
        }
    }
  }
};
</script>
<style lang="less" scoped>
.course-manage-time-record .el-button--text {
  padding: 5px;
  background: #409eff;
  color: #fff;
  font-family:SimSun;
}
.el-button--text:focus, .el-button--text:hover {
	background: #409EFF;
	color:#fff;
}
.course-manage-time-record .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
