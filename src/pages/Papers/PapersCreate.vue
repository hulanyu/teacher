<template>
    <Base-right
    :isUpdate="false"
    :title="title">
        <template slot-scope="props">
            <div >
                <div class="top">
                    <div class="item">
                        <label>考试方式：</label>
                        <el-radio v-model="exam_question_list.exam_type" label="1">闭卷</el-radio>
                        <el-radio v-model="exam_question_list.exam_type" label="2">开卷</el-radio>
                    </div>
                    <div class="item">
                        <label>题头设置：</label>
                        <input type="text" class="inputs title" v-model="exam_question_list.title" disabled>
                        <label> 试题总分：</label>
                        <input type="text" class="inputs" maxlength="3" @change="totalPointChange" v-model="exam_question_list.total_points">
                        <label> 考试时间：</label>
                        <input type="text" class="inputs" maxlength="3" @change="examMinutesChange" v-model="exam_question_list.exam_minutes">
                    </div>
                    <div class="topRight">
                        <el-button type="confirm" class="confirm" @click="back">返回</el-button>
                        <el-button type="confirm" class="confirm" @click="submitFn('pre')">试卷预览</el-button>
                        <el-button type="primary" @click="submitFn('finsh')">完成</el-button>
                    </div>
                </div>
            </div>
            <div class="contentCover" :style="'overflow: auto; height:' + (props.maxHeight - 100) + 'px'">
              <div v-for="(site,indexA) in bigJson" :key="indexA" class="items">	
                <div v-for="(bigli,indexB) in site.content" :key="indexB">
        	          <div class="titleBox" v-if="bigli.smContent[0]">
				              <span class="setTitle"></span>
	        	          <span class="title select"><span>{{bigli.child_question_no|bigtitle}}</span>{{bigli.child_question_title}}</span> 
        	          </div>
        	          <!--为每个题盒子-->
        	          <div v-for="(smallli,indexC) in bigli.smContent" :key="indexC" class="quetions">
	                    <div class="list multiple" @drop="drop($event,smallli.cname,bigli.smContent,indexA,indexB,indexC)" @dragover="dragOver($event)" @dragstart="dragStart($event,smallli.cname,bigli.smContent,indexA,indexB,indexC)" 
                      @mousedown="draggablefn($event)" @mouseup="draggablefn2($event)">         	       	
		                  <div class="left">
                        <input v-if="smallli.point == null" maxlength="5" class="setScore" type="text" placeholder="设分" @change="toScore(indexA,indexB,indexC,$event)" @mousedown="drag1($event)">
		                    <input v-else class="setScore" maxlength="5" :value="smallli.point" type="text" placeholder="设分" @change="toScore(indexA,indexB,indexC,$event)" @mousedown="drag1($event)"><br>
                        <el-button type="primary" class="deleteBtn" @click="toDeleteOne(indexA,indexB,indexC)">删除</el-button><br>
		                  </div>
		                  <div class="detailright">
		                    <div class="subjects">
		                        <p>
		                          <span class="num">{{smallli.number}}、</span>
	                            <span v-html="smallli.content" class="questionTitle"></span>
						                </p>
		                    </div>
		                  </div>
	                  </div>
	                </div> 
                </div> 
              </div> 
            </div>
            <I-table-editor v-model="deleteDialogVisible" 
            title="删除">
                <template slot="content">
                    <div class="outportaddr-group">是否确定删除该试题？</div>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button type="success"
                    @click="deleteconfirm">确 定</el-button>
                </template>
            </I-table-editor>
        </template>
    </Base-right>
    
</template>

<script>
import { ITableEditor,} from "@/components/Table/";
import BaseRight from "@/components/BaseRight/BaseRight";
export default {
  data() {
    return {
      bigJson:JSON.parse(localStorage.getItem("bigJson")),
      typeClone: null,
      //拖拽时按下的初始div
      startDiv: null,
      //拖拽时结束的div
      endDiv: null,
      //拖动时的初始下标
      startIndex: null,
      //拖动时的结束下标
      endIndex: "",
      linshi: "",
      //删除
      placeA:'',
      placeB:'',
      placeC:'',
      deleteDialogVisible: false,
      papers_id: localStorage.papers_id,
      exam_question_list: [],
      radio: "1",
      input: "1",
      tableData: [
        {
          id: 111,
          name: "黄若曦",
          grade: "三年级二班",
          money: 1000
        }
      ],
      search: "",
      current: 1,
      total: 1000,
      showOutQuestionBox: false,
      title: "生成试卷",
      //试卷信息测试数据
      resData: {}
    };
  },
  components: {
    BaseRight,
    ITableEditor,
  },
  mounted() {
    // this.req()
    this.getPaperQustionLists();
  },
  methods: {
    //获取当前试卷信息
    getPaperQustionLists() {
      this.$http
        .post("/ExamPaper/examPaperQustionLists", {
          pid: this.papers_id,
          token: localStorage.jxtoken
        })
        .then(res => {
          // console.log(res);
          this.exam_question_list = res.data.exam_question_list[0];
          this.exam_question_list.total_points = parseInt(
            this.exam_question_list.total_points
          );
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    req() {
      this.$http
        .get("/test", {
          search: this.search,
          page: this.current
        })
        .then(res => {
          //
        });
    },
    //删除
    toDeleteOne(indexA,indexB,indexC){
      this.placeA = indexA;
      this.placeB = indexB;
      this.placeC = indexC;
      // console.log('placec',indexC)
      this.deleteDialogVisible = true
		},
    //确定删除时调用函数
		deleteconfirm(){
			//添加删除参数
      var getData = JSON.parse(localStorage.getItem("getData")) || {};
      // console.log('placec',this.placeC)
			if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type == 4 || !this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type) {
				if(getData.selected[0].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id) != -1) {
					getData.selected[0].splice(getData.selected[0].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id), 1);  
				}
			}
			if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type == 1) {
				if(getData.selected[1].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id) != -1) {
					getData.selected[1].splice(getData.selected[1].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id), 1);  
				}
			}
			if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type == 2) {
				if(getData.selected[2].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id) != -1) {
					getData.selected[2].splice(getData.selected[2].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id), 1);  
				}
			}
			if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type == 3) {
				if(getData.selected[2].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id) != -1) {
					getData.selected[3].splice(getData.selected[3].indexOf(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id), 1);  
				}
			}
			//取消一道题
			if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].is_type == 1) {
				getData.objective = getData.objective - 1;
			}else {
				getData.subjective = getData.subjective - 1;
			}
			//题目总数
			getData.total = getData.objective + getData.subjective;
			getData = JSON.stringify(getData);
      localStorage.setItem("getData", getData);

			//删除本地question
			var questions  = JSON.parse(localStorage.getItem("questions")) || [];
			for(var z=0;z<questions.length;z++) {
				if(this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].id == questions[z].id && this.bigJson[this.placeA].content[this.placeB].smContent[this.placeC].question_type == questions[z].question_type) {
					questions.splice(z, 1);
				}
			}
			questions = JSON.stringify(questions);
      localStorage.setItem("questions", questions); 

		   	this.bigJson[this.placeA].content[this.placeB].smContent.splice(this.placeC,1);
			if(this.bigJson[this.placeA].content[this.placeB].smContent.length == 0) {
				this.bigJson[this.placeA].content[this.placeB].smContent = [];
				this.bigJson[this.placeA].content[this.placeB].child_question_no = "";
				this.bigJson[this.placeA].content[this.placeB].child_question_title= "";
			}
			var arrs = 0;
			for(var i=0;i<this.bigJson[this.placeA].content.length;i++) {
				if(this.bigJson[this.placeA].content[i] != []) {
					if(this.bigJson[this.placeA].content[i].smContent.length > 0){
						arrs = arrs + 1;
					}
				}
			}
			if(arrs == 0) {
				this.bigJson[this.placeA].content = [];
				this.bigJson[this.placeA].parent_question_no = "";
				this.bigJson[this.placeA].parent_question_title = "";
      }
      this.deleteDialogVisible = false
      // console.log(this.bigJson)
      this.bigJson = this.sortNum(this.bigJson)
      this.bigJson = JSON.stringify(this.bigJson);
      localStorage.setItem("bigJson", this.bigJson);
      this.bigJson = JSON.parse(this.bigJson)
		},
    //修改总分
    totalPointChange() {
      if (
        this.exam_question_list.total_points > 300 ||
        isNaN(this.exam_question_list.total_points) ||
        !!!this.exam_question_list.total_points ||
        this.exam_question_list.total_points <= 0
      ) {
        this.exam_question_list.total_points = "";
        this.$message.error("分数应为1-300之间的数字");
        return false;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.exam_question_list.total_points)) {
        this.exam_question_list.total_points = "";
        this.$message.error("试题总分应为整数");
        return false;
      }
    },
    //修改考试时间
    examMinutesChange() {
      if (
        this.exam_question_list.exam_minutes > 250 ||
        isNaN(this.exam_question_list.exam_minutes) ||
        !!!this.exam_question_list.exam_minutes ||
        this.exam_question_list.exam_minutes <= 0
      ) {
        this.exam_question_list.exam_minutes = "";
        this.$message.error("考试时间应为1-250之间的数字");
        return false;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.exam_question_list.exam_minutes)) {
        this.exam_question_list.exam_minutes = "";
        this.$message.error("考试时间应为整数");
        return false;
      }
    },
    handleSortChange({ column, prop, order }) {
      // console.log("handleSortChange", column, prop, order);
    },
    handlePageChange(current) {
      this.current = current;
    },
    //返回
    back: function() {
      history.go(-1);
    },
    //确定提交
    submitFn(val) {
      if (
        this.exam_question_list.total_points > 300 ||
        isNaN(this.exam_question_list.total_points) ||
        !!!this.exam_question_list.total_points ||
        this.exam_question_list.total_points <= 0
      ) {
        this.exam_question_list.total_points = "";
        this.$message.error("分数应为1-300之间的数字");
        return false;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.exam_question_list.total_points)) {
        this.exam_question_list.total_points = "";
        this.$message.error("试题总分应为整数");
        return false;
      }
      if (
        this.exam_question_list.exam_minutes > 250 ||
        isNaN(this.exam_question_list.exam_minutes) ||
        !!!this.exam_question_list.exam_minutes ||
        this.exam_question_list.exam_minutes <= 0
      ) {
        this.exam_question_list.exam_minutes = "";
        this.$message.error("考试时间应为1-250之间的数字");
        return false;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.exam_question_list.exam_minutes)) {
        this.exam_question_list.exam_minutes = "";
        this.$message.error("考试时间应为整数");
        return false;
      }
      //小题分数
      //看是否在总分范围内
      var totalScore = this.exam_question_list.total_points;
      totalScore = parseFloat(totalScore);
      var totalScore2 = 0;
      for (var d = 0; d < document.querySelectorAll(".setScore").length; d++) {
        var smallScore2 =  document.querySelectorAll(".setScore")[d].value 
        if (smallScore2) {
          smallScore2 = parseFloat(smallScore2);
          totalScore2 += smallScore2;
        }else {
          this.$message.error("请填写每道小题分数");
          return false;
        }
      }
      if (totalScore2 != totalScore) {
        this.$message.error("小题分数总和不等于试题总分");
        return false;
      }
      //提交
      if(val == 'finsh') {
        this.$http.post('/ExamPaper/savePaperContent',{
          paper_id:localStorage.papers_id,
          is_new:localStorage.is_new,
          paper_title:this.exam_question_list.title,
          total_points:this.exam_question_list.total_points,
          exam_type:this.exam_question_list.exam_type,
          exam_minutes:this.exam_question_list.exam_minutes,
          paper_data:localStorage.getData,
          // paper_data:JSON.parse(localStorage.getItem("getData")),
          // exam_question_info:JSON.parse(localStorage.getItem("bigJson")),
          exam_question_info:localStorage.bigJson,
          token:localStorage.jxtoken
        })
        .then(res=>{
          this.$message.error(res.info);
          history.go(-2)
        })
        .catch(res=>{
          this.$message.error(res.info);
        })
      }
      //预览
      if(val == 'pre') {
        window.open('./static/paper/Question_previewPaperA4.html?paper_id='+localStorage.papers_id+"&open_type=1")
      }
      
    },

    //拖拽
    dragStart: function(ev, type, arr, indexA, indexB, indexC) {
      this.startIndex = indexC;
      this.divdom = ev.currentTarget;
      this.divdom.style.backgroundColor = "#DDDDDD";
      this.typeClone = type;
      this.startDiv = this.divdom;
      this.linshi = this.divdom.innerHTML;
    },
    dragOver: function(ev) {
      ev.currentTarget.style.backgroundColor = "white";
      ev.preventDefault();
    },
    drop: function(ev, type, arr, indexA, indexB, indexC) {
      this.endIndex = indexC;
      //     如果开始拖动和结束拖动位置题型不一致则清空
      this.divdom = ev.currentTarget;
      if (this.typeClone != type) {
        this.typeClone = null;
        this.startDiv = null;
        this.endDiv = null;
        this.startIndex = null;
        this.endIndex = null;
        //  		清空剪切板
        ev.dataTransfer.clearData();
        return false;
      }
      if (this.startDiv != this.endDiv) {
        var arrM = this.bigJson[indexA].content[indexB].smContent[
          this.startIndex
        ];
        //试题标号
        var numbers1 = this.bigJson[indexA].content[indexB].smContent[this.startIndex].number
        var numbers2 = this.bigJson[indexA].content[indexB].smContent[this.endIndex].number

        this.bigJson[indexA].content[indexB].smContent[this.startIndex] = this.bigJson[indexA].content[indexB].smContent[this.endIndex];

        this.bigJson[indexA].content[indexB].smContent[this.endIndex] = arrM;

        this.bigJson[indexA].content[indexB].smContent[this.startIndex].number = numbers1
        this.bigJson[indexA].content[indexB].smContent[this.endIndex].number = numbers2
        
        // var a = this.divdom.getElementsByClassName("num")[0].innerHTML;
        // var b = this.startDiv.getElementsByClassName("num")[0].innerHTML;
        this.startDiv.innerHTML = this.divdom.innerHTML;
        this.divdom.innerHTML = this.linshi;
        // this.divdom.getElementsByClassName("num")[0].innerHTML = a;
        // this.startDiv.getElementsByClassName("num")[0].innerHTML = b;
        // sortNum(bigJson.data);
        this.bigJson = JSON.stringify(this.bigJson);
        localStorage.setItem("bigJson", this.bigJson);
        this.bigJson = JSON.parse(this.bigJson)
        // console.log('bigjson:',this.bigJson)
        // history.go(0)
        this.$router.push('/white')
        this.$message.error("第"+numbers1+"题与第"+numbers2+"题交换成功");
      }
      this.startDiv = null;
      this.endDiv = null;
      this.startIndex = null;
      this.endIndex = null;
    },
    draggablefn: function(event) {
      var el = event.currentTarget;
      el.setAttribute("draggable", true);
    },
    draggablefn2: function(event) {
      var el = event.currentTarget;
      el.setAttribute("draggable", false);
    },
    //分数设置
    toScore: function(indexA, indexB, indexC, event) {
      var smallScore = event.currentTarget.value;
      //console.log(smallScore);
      if (
        !!!smallScore ||
        isNaN(smallScore) ||
        smallScore <= 0 ||
        smallScore >= 200
      ) {
        this.$message.error("请输入数字(1-199)")
        this.bigJson[indexA].content[indexB].smContent[indexC].point = ""
        //event.currentTarget.value == ""
        return false;
      }
      if (!/^(\d+\.\d{1,1}|\d+)$/.test(smallScore)) {
        this.$message.error("小题分数最多输入一位小数");
        this.bigJson[indexA].content[indexB].smContent[indexC].point = ""
        event.currentTarget.value = ""
        return false;
      }
      //看是否在总分范围内
      var totalScore = this.exam_question_list.total_points;
      totalScore = parseFloat(totalScore);
      var totalScore2 = 0;
      for (var d = 0; d < document.querySelectorAll(".setScore").length; d++) {
        var smallScore2 =  document.querySelectorAll(".setScore")[d].value 
        if (smallScore2) {
          smallScore2 = parseFloat(smallScore2);
          totalScore2 += smallScore2;
        }
      }
      if (totalScore2 > totalScore) {
        this.$message.error("超出总分范围");
        this.bigJson[indexA].content[indexB].smContent[indexC].point = ""
        //event.currentTarget.value == ""
        return false;
      }
      this.bigJson[indexA].content[indexB].smContent[indexC].point = smallScore;
      // console.log(this.bigJson)
      this.bigJson = JSON.stringify(this.bigJson);
      localStorage.setItem("bigJson", this.bigJson);
      this.bigJson = JSON.parse(this.bigJson)
    },
    drag1: function(event) {
      event.stopPropagation();
    },
    //试题标题no
    sortNum(testdata) {
      var arr = [];
      //转换小题号
      var childno = 1;
      var number = 1;
      var parentArr = [];
      for(var k=0;k<testdata.length;k++) {
          parentArr.push(testdata[k].parent_question_no);
        arr[k] = [];
        for(var l=0;l<testdata[k].content.length;l++) {
          arr[k].push(testdata[k].content[l].child_question_no);
        }
      
        var n = 1;
        for(var i=0;i<arr[k].length;i++) {
          if(arr[k][i] != "") {
            arr[k][i] = n;
            n = n + 1;
          }
        }
          
        for(var m=0;m<testdata[k].content.length;m++) {
          testdata[k].content[m].child_question_no = arr[k][m];
          if(testdata[k].content[m].child_question_no != "") {
            testdata[k].content[m].child_question_no = childno;
            childno++;
          }
          for(var z=0;z<testdata[k].content[m].smContent.length;z++) {
              testdata[k].content[m].smContent[z].child_question_no = childno;
              console.log("testnumber",testdata[k].content[m].smContent[z].number)
              testdata[k].content[m].smContent[z].number = number;
              number++;
            }
        }
      }
      //转换大题号
      var o = 1;
      for(var p=0;p<parentArr.length;p++) {
        if(parentArr[p] != "") {
          parentArr[p] = o;
          o = o + 1;
        }
      }
      for(var q=0;q<testdata.length;q++) {
        testdata[q].parent_question_no = parentArr[q];
      }
      //console.log(testData);
      return testdata;
    }
  },
  filters: {
    bigtitle(value) {
      var val = "";
      if (value == 1) {
        val = "一、";
      } else if (value == 2) {
        val = "二、 ";
      } else if (value == 3) {
        val = "三、";
      } else if (value == 4) {
        val = "四、";
      } else if (value == 5) {
        val = "五、";
      } else if (value == 6) {
        val = "六、";
      } else if (value == 7) {
        val = "七、";
      } else if (value == 8) {
        val = "八、";
      } else if (value == 9) {
        val = "九、";
      } else if (value == 10) {
        val = "十、";
      } else if (value == 11) {
        val = "十一、";
      } else if (value == 12) {
        val = "十二、";
      } else if (value == 13) {
        val = "十三、";
      } else if (value == 14) {
        val = "十四、";
      } else if (value == 15) {
        val = "十五、";
      } else if (value == 16) {
        val = "十六、";
      }
      return val;
    }
  }
};
</script>

<style scoped lang="less">
.top {
  position: relative;
  height: 100px;
  .item {
    margin-bottom: 20px;
    .inputs {
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 1;
      outline: none;
      padding: 0 15px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 80px;
    }
    .title {
      width: 210px;
    }
  }
  .topRight {
    position: absolute;
    top: 0;
    right: 10px;
  }
}
.contentCover {
  .items {
    .quetions {
      .multiple {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px dashed #eeee;
        .left {
          padding: 0 20px;
          .point {
            display: block;
            width: 80px;
            margin-bottom: 10px;
          }
          .deleteBtn {
            margin-top: 10px;
          }
          .setScore {
            padding:7px;
            width:54px;
            border-radius: 5px;
            border:1px solid gray;
            outline: none;
            text-align: center;
          }
        }
        .detailright {
          display: flex;
          font-size: 15px;
          line-height: 20px;
        }
      }
    }
  }
}
.MathJye table{
border-collapse: collapse;
    margin: 0;
    padding: 0;
    text-align: center;
    vertical-align: middle;
    line-height: normal;
    font-size: inherit;
    _font-size: 100%;
    font-style: normal;
    font-weight: normal;
    border: 0;
    float: none;
    display: inline-block;
    zoom: 0;
}
table.edittable{border-collapse:collapse;text-align:center;margin:2px}table.edittable td,table.edittable th{line-height:30px;padding:5px;white-space:normal;word-break:break-all;border:1px solid #000;vertical-align:middle}table.composition{border-collapse:collapse;text-align:left;margin:2px;width:98%}table.composition td,table.composition th{line-height:30px;white-space:normal;word-break:break-all;border-width:0;vertical-align:middle}table.composition2{border-collapse:collapse;width:auto}table.composition2 td,table.composition2 th{text-align:left;line-height:30px;white-space:normal;word-break:break-all;border:none;border-width:0;vertical-align:middle}
</style>