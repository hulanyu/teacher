<template>
    <I-table
    title="添加试题"
    :isUpdate="false"
    class="questionstable">
        <template slot="head">
            <div class="choose">
                	<div class="choose_sub">
                		<span class="choose_title">版本：</span>
                		<ul class="versionUl">
                			<li class="versionLi on">{{papers_version}}</li>
                		</ul>
                	</div>
                    <div class="choose_sub">
                		<span class="choose_title">年级：</span>
                		<ul class="gradeUl">
                			<li class="gradeLi on">{{papers_clname}}</li>
                		</ul>
                	</div>
                    <div class="choose_sub">
                		<span class="choose_title">科目：</span>
                		<ul class="sujectUl">
                			<li class="sujectLi on">{{papers_sname}}</li>
                		</ul>
                	</div>
                    <div class="choose_sub">
                        <span class="choose_title">章：</span>
                        <ul class="chapterUl">
                            <li @click="choosed('chapter',item.id,index,$event, chapter_index === index)" 
                            :class="setLiCSS('chapterLi', chapter_index === index)" 
                            v-for="(item,index) in chapterData" 
                            :key="index">{{item.chapter}}</li>
                        </ul>
                        <span class="choose_more" 
                        :style="{ display: chapterShow }" 
                        @click="more('chapter',$event,0)">更多<i class="el-icon-arrow-down"></i></span>
                        <div class="clear"></div>
                    </div>
                    <div class="choose_sub">
                        <span class="choose_title">节：</span>
                        <ul class="unitUl">
                            <li @click="choosed('node',item.id,index,$event, node_index === index)" 
                            :class="setLiCSS('unitLi', node_index === index)" 
                            v-for="(item,index) in nodeData" 
                            :key="index">{{item.chapter}}</li>
                        </ul>
                        <span class="choose_more" 
                        :style="{ display: nodeShow }" 
                        @click="more('node',$event,1)">更多<i class="el-icon-arrow-down"></i></span>
                        <div class="clear"></div>
                    </div>
                    <div class="choose_sub">
                        <span class="choose_title">题类：</span>
                        <ul class="istypeUl">
                            <li @click="choosed('is_type',item.id,index,$event, is_type_index === index)" 
                            :class="setLiCSS('istypeLi', is_type_index === index)" 
                            v-for="(item,index) in isTypeData" 
                            :key="index">{{item.name}}</li>
                        </ul>
                        <!-- <span class="choose_more" 
                        :style="{ display: typeShow }" 
                        @click="more('type',$event)">更多<i class="el-icon-arrow-down"></i></span> -->
                        <div class="clear"></div>
                    </div>
                    <div class="choose_sub">
                        <span class="choose_title">题型：</span>
                        <ul class="typeUl">
                            <li @click="choosed('type',item.id,index,$event, type_index === index)" 
                            :class="setLiCSS('typeLi', type_index === index)" 
                            v-for="(item,index) in typeData" 
                            :key="index">{{item.title}}</li>
                        </ul>
                        <span class="choose_more" 
                        :style="{ display: typeShow }" 
                        @click="more('type',$event,2)">更多<i class="el-icon-arrow-down"></i></span>
                        <div class="clear"></div>
                    </div>
                    <div class="choose_sub">
                        <span class="choose_title">难度：</span>
                        <ul class="difficultUl">
                            <li @click="choosed('difficult',item.id,index,$event, difficult_index === index)" 
                            :class="setLiCSS('difficultLi', difficult_index === index)" 
                            v-for="(item,index) in difficultData" 
                            :key="index">{{item.name}}</li>
                        </ul>
                        <!-- <span class="choose_more" 
                        :style="{ display: difficultShow }" 
                        @click="more('difficult',$event)">更多<i class="el-icon-arrow-down"></i></span> -->
                        <div class="clear"></div>
                    </div>
                </div>
            <el-button size="smail" type="primary" class="backbtn" @click="backfn">返回</el-button> 
        </template>
        <template slot="content" slot-scope="props">
            <template>
                <div class="contents">
                    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                        <el-tab-pane label="默认题库" name="4">
                        </el-tab-pane>
                        <el-tab-pane label="学校题库" name="1">
                        </el-tab-pane>
                        <el-tab-pane label="年级题库" name="2">
                        </el-tab-pane>
                        <el-tab-pane label="教师题库" name="3">
                        </el-tab-pane>
                    </el-tabs>
                    <div class="contentCover">
                        <div class="noData" v-if="tableData.length == 0">暂无数据</div>
                        <div class="itmes" v-for="(item,index) in tableData" :key="index">
                            <!-- <input type="checkbox" class="itmesChose" :checked="item.checked" @click="selectFn(item)"> -->
                            <span class="itmesId">{{item.id}}：</span>
                            <div class="itmesContent">
                                <div v-html="item.content" class="contentDiv"></div>
                                <div v-if="item.id != ''" class="itemsbtns">
                                    <el-button size="small " type="primary" @click="showAnser(item)">查看答案</el-button>
                                    <el-button size="small" v-if="!item.selected" style="padding:9px 15px;" type="primary" class="btns" @click="addFn(item)">添加</el-button>
                                    <el-button size="small" v-if="item.selected" type="danger" @click="removeFn(item)">移除</el-button>
                                </div>
                                <div v-if="item.isShow">
                                    <div v-if="item.id != ''" class="itemsTittle">参考答案：</div>
                                    <div class="result"  v-html="item.answer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>
        
        <template slot="foot">
            <I-table-page
            :total="total_page"
            @change="handlepageChange"></I-table-page>
            <div class="bottomBar">
                <div class="left">
                    <el-badge :value="bottomData.total" class="item total">
                        <el-button size="small">题目总数</el-button>
                    </el-badge>
                    <el-badge :value="bottomData.objective" class="item">
                        <el-button size="small">客观题</el-button>
                    </el-badge>
                    <el-badge :value="bottomData.subjective" class="item">
                        <el-button size="small">主观题</el-button>
                    </el-badge>
                </div>
                <div class="right">
                    <el-button type="primary" class="btns" @click="resetFn">重置</el-button>
                    <el-button type="primary" @click="confirm">生成试卷</el-button>
                </div>
            </div>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from "@/components/Table/";
import config from "@/config";

export default {
  data() {
    return {
      chapterShow: "none",
      nodeShow: "none",
      typeShow: "none",
      difficultShow: "none",

      chapterHeight: "none",
      nodeHeight: "none",
      typeHeight: "none",
      difficultyHeight: "none",

      chapter_index: 0,
      node_index: 0,
      type_index: 0,
      difficult_index: 0,
      is_type_index: 0,

      queryIndexList: [
        "chapter_index",
        "node_index",
        "type_index",
        "difficult_index",
        "is_type_index"
      ],
      //请求数据
      chapter_id: null,
      type_id: null,
      node_id: null,
      is_type: 1,
      easy_type: 1,

      //试卷信息
      exam_question_list: [],
      //一进页面就有
      papers_id: localStorage.papers_id,
      papers_version: "",
      papers_clname: localStorage.papers_clname,
      papers_sname: localStorage.papers_sname,
      //请求的试题数据
      vid: localStorage.papers_versions_id,
      classes: localStorage.papers_clid,
      subject: localStorage.papers_sid,

      tableData: [], //渲染table数据
      activeName2: "4", //选项卡
      question_type: 4, //题库类型
      chapterShow: "none",
      unitShow: "none",
      typeShow: "none",
      difficultyShow: "none",

      chapterHeight: "none",
      nodeHeight: "none",
      typeHeight: "none",
      difficultyHeight: "none",
      //是否是第一次进来
      flagCheck: true,

      divWidth: 0,
      //列表数据
      chapterData: [],
      nodeData: [],
      typeData: [],
      isTypeData: [
        {
          id: 1,
          name: "客观"
        },
        {
          id: 2,
          name: "主观"
        }
      ],
      difficultData: [
        {
          id: 1,
          name: "容易"
        },
        {
          id: 2,
          name: "普通"
        },
        {
          id: 3,
          name: "困难"
        }
      ],
      //第一个数据
      chid_first: "",
      unit_first: "",
      type_first: "",

      formLabelWidth: "100px",
      //搜索参数
      number: "",
      page_number: 1,
      page_size: 10,
      total_page: 0,
      //底部数据
      bottomData: {
        total: 0,
        objective: 0,
        subjective: 0
      },
      chapterFlag: true,
      nodeFlag: true
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor
  },
  mounted() {
    //一进来就调用
    this.getPaperQustionLists();
  },
  methods: {
    //选项卡
    handleClick(tab, event) {
      // console.log(tab, event);
      this.question_type = tab.name;
      //   this.chapter_id = this.chid_first;
      //   this.node_id = this.node_first;
      //   this.type = this.type_first;
      //   this.easy_type = 1;
      this.total_page = 0;
      this.req();
    },
    //获取当前试卷信息
    getPaperQustionLists() {
      this.$http
        .post("/ExamPaper/examPaperQustionLists", {
          pid: this.papers_id,
          token: localStorage.token
        })
        .then(res => {
          //console.log(res);
          this.exam_question_list = res.data.exam_question_list[0];
          //提取出选择的试题
          if (this.exam_question_list.exam_question_info != null) {
            localStorage.setItem("is_new", 1);
            //this.exam_question_list.exam_question_info = this.exam_question_list.exam_question_info.replace(/&quot;/g,"\"");
            this.exam_question_list.exam_question_info = JSON.parse(
              this.exam_question_list.exam_question_info
            );
            var questionslist = [];
            for (
              var i = 0;
              i < this.exam_question_list.exam_question_info.length;
              i++
            ) {
              for (
                var j = 0;
                j <
                this.exam_question_list.exam_question_info[i].content.length;
                j++
              ) {
                for (
                  var k = 0;
                  k <
                  this.exam_question_list.exam_question_info[i].content[j]
                    .smContent.length;
                  k++
                ) {
                  if (
                    this.exam_question_list.exam_question_info[i].content[j]
                      .smContent[k]
                  ) {
                    this.exam_question_list.exam_question_info[i].content[
                      j
                    ].smContent[k].added = 1;
                    this.exam_question_list.exam_question_info[i].content[
                      j
                    ].smContent[k] = this.exam_question_list.exam_question_info[
                      i
                    ].content[j].smContent[k];
                    questionslist.push(
                      this.exam_question_list.exam_question_info[i].content[j]
                        .smContent[k]
                    );
                  }
                }
              }
            }
            // console.log('qestions:',questionslist);
            if (localStorage.add_questions == 1) {
              questionslist = JSON.stringify(questionslist);
              localStorage.setItem("questions", questionslist);
              //之前选择的总数和id
              if (
                this.exam_question_list.paper_data != null &&
                this.exam_question_list.paper_data != ""
              ) {
                this.exam_question_list.paper_data = this.exam_question_list.paper_data.replace(
                  /&quot;/g,
                  '"'
                );
                this.exam_question_list.paper_data = JSON.parse(
                  this.exam_question_list.paper_data
                );
                localStorage.setItem(
                  "getData",
                  JSON.stringify(this.exam_question_list.paper_data)
                );
              }
              localStorage.add_questions = 2;
            }
          } else {
            localStorage.setItem("is_new", 2);
          }
          this.getVersions();
          this.req();
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //请求试题
    req() {
      this.tableData = [];
      this.$http
        .post("/Question/lists", {
          page_size: this.page_size,
          page_number: this.page_number,
          vid: this.vid,
          classes: this.classes,
          subject: this.subject,
          chid: this.chapter_id,
          unitid: this.node_id,
          q_type: this.type,
          easy_type: this.easy_type,
          question_type: this.question_type,
          uid: localStorage.jxid,
          school_id: localStorage.jxschool_id,
          token: localStorage.jxtoken
        })
        .then(res => {
          // console.log(res);
          if (this.page_number > 1) {
            if (!res.data) {
              this.page_number = this.page_number - 1;
              this.req();
            }
          }
          this.total_page = parseInt(res.data.data.page.total);
          this.tableData = res.data.data.rows;
          //添加全选
          //添加属性  添加移除状态
          let getData = JSON.parse(localStorage.getItem("getData")) || {};
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isShow = false;
            this.tableData[i].content = this.tableData[i].content.replace(
              /src="/g,
              'src="' + config.IMGURL
            );
            this.tableData[i].answer = this.tableData[i].answer.replace(
              /src="/g,
              'src="' + config.IMGURL
            );
            // console.log('content',this.tableData[i].content)
            if (getData.selected) {
              if (this.question_type == 4) {
                //默认题库
                if (getData.selected[0].indexOf(this.tableData[i].id) != -1) {
                  this.tableData[i].selected = true;
                }
              }
              if (this.question_type == 1) {
                //学校题库
                if (getData.selected[1].indexOf(this.tableData[i].id) != -1) {
                  this.tableData[i].selected = true;
                }
              }
              if (this.question_type == 2) {
                //年级题库
                if (getData.selected[2].indexOf(this.tableData[i].id) != -1) {
                  this.tableData[i].selected = true;
                }
              }
              if (this.question_type == 3) {
                //教师题库
                if (getData.selected[3].indexOf(this.tableData[i].id) != -1) {
                  this.tableData[i].selected = true;
                }
              }
            }
          }
          if (getData.total) {
            this.bottomData.total = getData.total;
          }
          if (getData.subjective) {
            this.bottomData.subjective = getData.subjective;
          }
          if (getData.objective) {
            this.bottomData.objective = getData.objective;
          }
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //显示答案
    showAnser(item) {
      item.isShow = !item.isShow;
      let temp = this.tableData;
      this.tableData = [];
      this.tableData = temp;
    },
    //获取版本
    getVersions() {
      this.$http
        .get("./Question/getVersions")
        .then(res => {
          // console.log("res", res);
          for (let i = 0; i < res.data.length; i++) {
            if (this.vid == res.data[i].id) {
              this.papers_version = res.data[i].versions;
            }
          }
          if (this.flagCheck) {
            this.getChapter();
          }
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //获取章
    getChapter() {
      this.$http
        .post("./Question/getChapter", {
          token: localStorage.jxtoken,
          versions_id: this.vid,
          class_id: this.classes,
          subject_id: this.subject
        })
        .then(res => {
          // console.log(res);
          this.chapterData = res.data;
          this.$nextTick(function() {
            this.getWidth(".chapterUl", ".chapterLi");
          });
          //获取第一个
          this.chid_first = this.chapterData[0].id;
          //第一次进入请求
          if (this.flagCheck) {
            this.chapter_id = this.chapterData[0].id;
            this.getNodeData();
          }
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //获取节
    getNodeData(val) {
      this.$http
        .post("./Question/getUnit", {
          token: localStorage.jxtoken,
          versions_id: this.vid,
          class_id: this.classes,
          subject_id: this.subject,
          chapter_id: this.chapter_id
        })
        .then(res => {
          // console.log(res);
          this.nodeData = res.data;
          this.$nextTick(function() {
            this.getWidth(".unitUl", ".unitLi");
          });
          //获取第一个
          this.node_id = this.nodeData[0].id;
          this.node_first = this.nodeData[0].id;
          this.getCategory();
        })
        .catch(res => {
          this.$message.error(res.info);
          this.getCategory();
        });
    },
    //获题型
    getCategory() {
      this.$http
        .post("./Question/getCategory", {
          token: localStorage.jxtoken,
          versions_id: this.vid,
          class_id: this.classes,
          subject_id: this.subject,
          type: this.is_type
        })
        .then(res => {
          // console.log(res);
          this.typeData = res.data;
          //获取第一个id
          this.$nextTick(function() {
            this.getWidth(".typeUl", ".typeLi");
            //第一次进入
            if (this.flagCheck) {
              this.flagCheck = false;
            }
          });
          //获取第一个
          this.type = this.typeData[0].id;
          this.type_first = this.typeData[0].id;
          this.req();
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //重置
    setLiCSS(baseClass, isSelect = false) {
      return isSelect ? `${baseClass} on` : baseClass;
    },
    // 重置查询项
    resetQuery(startIndex = 0) {
      startIndex = parseInt(startIndex);
      let arr = this.queryIndexList.slice(startIndex);
      arr.forEach(key => {
        this[key] = 0;
      });
    },
    choosed(name, val, index, e, isSelect) {
      if (isSelect) {
        return;
      }
      index = parseInt(index);
      if (name == "chapter") {
        this.chapter_id = val;
        //重置加载选中
        this.chapter_index = index;
        this.resetQuery(4);
        this.node_index = 0;
        this.is_type = 1;
        this.is_type_index = 0;
        this.type_index = 0;
        this.difficult_index = 0;
        this.easy_type = 1;
        this.resetQuery(6);
        this.getNodeData();
      } else if (name === "node") {
        this.node_index = index;
        this.node_id = val;
        this.is_type = 1;
        this.is_type_index = 0;
        this.type_index = 0;
        this.difficult_index = 0;
        this.easy_type = 1;
        this.resetQuery(6);
        this.getCategory();
      } else if (name === "is_type") {
        this.is_type_index = index;
        this.is_type = val;
        this.type_index = 0;
        this.difficult_index = 0;
        this.easy_type = 1;
        this.resetQuery(5);
        this.getCategory();
      } else if (name == "type") {
        this.type = val;
        this.type_index = index;
        this.difficult_index = 0;
        this.easy_type = 1;
        this.resetQuery(6);
        this.req();
      } else if (name == "difficult") {
        this.easy_type = val;
        this.difficult_index = index;
        this.resetQuery(7);
        this.req();
      }
      // console.log("name:" + name);
    },
    //更多
    more(message, e, index) {
      // console.log('message',message);
      let height = this[message + "Height"];
      if (this[message + "Flag"]) {
        document.querySelectorAll(".choose_more")[
          index
        ].parentElement.style.height = this[message + "Height"];
        document.querySelectorAll(".choose_more")[index].innerHTML =
          '收起<i class="el-icon-arrow-up">';
        this[message + "Flag"] = false;
      } else {
        document.querySelectorAll(".choose_more")[
          index
        ].parentElement.style.height =
          "36px";
        document.querySelectorAll(".choose_more")[index].innerHTML =
          '更多<i class="el-icon-arrow-down">';
        this[message + "Flag"] = true;
      }
    },
    //获取宽度
    getWidth(ul, li) {
      //年级
      var gradeUlWidth = document.querySelector(".chapterUl").clientWidth;
      let gradeLiWidth = 0;
      for (let i = 0; i < document.querySelectorAll(li).length; i++) {
        gradeLiWidth =
          gradeLiWidth + document.querySelectorAll(li)[i].clientWidth;
      }
      let number = Math.ceil(gradeLiWidth / gradeUlWidth);
      let height = Math.ceil(gradeLiWidth / gradeUlWidth) * 32 + "px";
      if (number > 1) {
        if (ul == ".chapterUl") {
          this.chapterShow = "block";
          this.chapterHeight = height;
        }
        if (ul == ".unitUl") {
          this.nodeShow = "block";
          this.nodeHeight = height;
        }
        if (ul == ".typeUl") {
          this.typeShow = "block";
          this.typeHeight = height;
        }
      }
    },
    //添加试题
    addFn(val) {
      // console.log(val);
      //试题列表
      let questions = JSON.parse(localStorage.getItem("questions")) || [];
      //试卷信息
      let getData = JSON.parse(localStorage.getItem("getData")) || {};
      //如果大于50道题
      if (questions.length >= 50) {
        this.$message.error("每套试卷最多选择50道题");
        return;
      }
      //添加试题到本地
      questions.push(val);
      questions = JSON.stringify(questions);
      localStorage.setItem("questions", questions);
      //添加试题信息到试卷信息 0、默认题库 1、学校题库2、年级题库3、教师题库
      if (!getData.selected) {
        getData.selected = [];
        getData.selected[0] = [];
        getData.selected[1] = [];
        getData.selected[2] = [];
        getData.selected[3] = [];
      }
      if (!getData.objective) {
        //1客观
        getData.objective = 0;
      }
      if (!getData.subjective) {
        //2主观
        getData.subjective = 0;
      }
      if (val.is_type == 1) {
        this.bottomData.objective = this.bottomData.objective + 1;
      }
      if (val.is_type == 2) {
        this.bottomData.subjective = this.bottomData.subjective + 1;
      }
      this.bottomData.total =
        this.bottomData.objective + this.bottomData.subjective;
      getData.objective = this.bottomData.objective;
      getData.subjective = this.bottomData.subjective;
      getData.total = this.bottomData.total;

      if (this.question_type == 4) {
        if (getData.selected[0].indexOf(val.id) == -1) {
          getData.selected[0].push(val.id);
        }
      } else if (this.question_type == 1) {
        if (getData.selected[1].indexOf(val.id) == -1) {
          getData.selected[1].push(val.id);
        }
      } else if (this.question_type == 2) {
        if (getData.selected[2].indexOf(val.id) == -1) {
          getData.selected[2].push(val.id);
        }
      } else if (this.question_type == 3) {
        if (getData.selected[3].indexOf(val.id) == -1) {
          getData.selected[3].push(val.id);
        }
      }
      //存入本地
      getData = JSON.stringify(getData);
      localStorage.setItem("getData", getData);
      val.selected = true;
    },
    //移除试题
    removeFn(val) {
      let questions = JSON.parse(localStorage.getItem("questions")) || [];
      if (
        val.question_type == null ||
        val.question_type == undefined ||
        val.question_type == ""
      ) {
        val.question_type = 4;
      }
      //移除一道题
      for (var z = 0; z < questions.length; z++) {
        if (
          val.id == questions[z].id &&
          val.question_type == this.question_type
        ) {
          questions.splice(z, 1);
        }
      }
      questions = JSON.stringify(questions);
      localStorage.setItem("questions", questions);
      //移除试卷里信息
      let getData = JSON.parse(localStorage.getItem("getData")) || {};
      if (!getData.selected) {
        getData.selected = [];
        getData.selected[0] = [];
        getData.selected[1] = [];
        getData.selected[2] = [];
        getData.selected[3] = [];
      }
      if (!getData.objective) {
        //1客观
        getData.objective = 0;
      }
      if (!getData.subjective) {
        //2主观
        getData.subjective = 0;
      }
      if (val.is_type == 1) {
        this.bottomData.objective = this.bottomData.objective - 1;
      }
      if (val.is_type == 2) {
        this.bottomData.subjective = this.bottomData.subjective - 1;
      }
      this.bottomData.total =
        this.bottomData.objective + this.bottomData.subjective;
      getData.objective = this.bottomData.objective;
      getData.subjective = this.bottomData.subjective;
      getData.total = this.bottomData.total;

      if (this.question_type == 4) {
        let index = getData.selected[0].indexOf(val.id);
        if (index != -1) {
          getData.selected[0].splice(index, 1);
        }
      } else if (this.question_type == 1) {
        let index = getData.selected[1].indexOf(val.id);
        if (index != -1) {
          getData.selected[1].splice(index, 1);
        }
      } else if (this.question_type == 2) {
        let index = getData.selected[2].indexOf(val.id);
        if (index != -1) {
          getData.selected[2].splice(index, 1);
        }
      } else if (this.question_type == 3) {
        let index = getData.selected[3].indexOf(val.id);
        if (index != -1) {
          getData.selected[3].splice(index, 1);
        }
      }
      //存入本地
      getData = JSON.stringify(getData);
      localStorage.setItem("getData", getData);
      val.selected = false;
    },
    //重置
    resetFn() {
      localStorage.removeItem("getData");
      localStorage.removeItem("questions");
      this.bottomData.objective = 0;
      this.bottomData.subjective = 0;
      this.bottomData.total = 0;
      localStorage.add_questions = 1;
      this.getPaperQustionLists();
      //this.req();
    },
    //翻页
    handlepageChange(current) {
      this.page_number = current;
      this.req();
    },

    //生成试卷
    confirm: function() {
      let questions = JSON.parse(localStorage.getItem("questions")) || [];
      questions = JSON.stringify(questions);
      // console.log('question',questions)
      if (questions.length == 0) {
        this.$message.error("未选择任何试题");
        return;
      }
      this.$http
        .post("/Question/questionSort", {
          token: localStorage.jxtoken,
          data: questions
        })
        .then(res => {
          let bigJson = res.data;
          bigJson = JSON.stringify(bigJson);
          localStorage.setItem("bigJson", bigJson);
          this.$router.push("/papers-create");
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //返回
    backfn() {
      //this.$router.push("/papers/"+localStorage.papers_type,params);
      // let ptype = localStorage.papers_type
      // console.log('type',ptype)
      // this.$router.push({path:'papers',params:{type:ptype}});
      history.go(-1);
    },
    //题目展开详情
    handleSelectionChange() {}
  }
};
</script>


<style scoped lang="less">
.expand-item {
  padding: 0px;
}
.expand-item > div {
  padding: 10px;
}
.expand-item-0 {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #41cac0;
  margin-top: 3px;
}
.expand-item-title {
  padding-bottom: 5px;
}
.el-table__expanded-cell,
.el-table__expanded-cell:hover {
  background-color: #e3f7f6 !important;
}
.search {
  background-color: #41cac0;
  border: none;
  padding-left: 60px;
  padding-right: 60px;
}
.bottomBar {
  width: 65%;
  position: relative;
  padding-left: 10px;
}
.bottomBar .right {
  position: absolute;
  bottom: 0;
  right: 10px;
}
.item {
  margin-right: 20px;
  border: none;
}
.item button {
  background-color: #41cac0;
  color: white;
}
.total button {
  background-color: #409eff;
}
.backbtn {
  position: absolute;
  top: 0;
  right: 10px;
}
.choose {
  width: 100%;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 50px;
  padding-left: 13px;
  padding-right: 20px;
  .choose_sub {
    height: 36px;
    line-height: 36px;
    overflow: hidden;
    border-bottom: 1px dashed #ddd;
    .choose_title,
    ul,
    ul > li {
      float: left;
    }
    .choose_title {
      display: block;
      width: 70px;
      text-align: right;
      margin-right: 48px;
    }
    ul {
      width: 70%;
      height: 36px;
      li {
        height: 24px;
        line-height: 24px;
        margin-top: 6px;
        padding: 0 12px;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        .el-icon-close {
          margin-left: 10px;
          visibility: hidden;
        }
      }
    }
    .choose_more {
      float: right;
      font-size: 12px;
      cursor: default;
      cursor: pointer;
    }
    .clear {
      clear: both;
    }
  }
  .choose_last {
    border-bottom: none;
  }
}
.addbtn {
  padding: 11px 21px;
}
.addNFCbtn {
  margin-bottom: 40px;
  width: 120px;
}
.lossNFCbtn {
  width: 120px;
}
.el-dialog {
  border-radius: 8px !important;
  .el-dialog__header {
    border-radius: 8px 8px 0 0;
  }
  .el-dialog__body {
    .NFCbox {
      text-align: center;
    }
  }
}
.radio_gender {
  margin-bottom: 6px;
}
.el-button {
  border: none;
}
.el-button--text {
  padding: 5px;
  background: #409eff;
  color: #fff;
  margin-right: 12px;
  margin-bottom: 10px;
}
.el-button--text:focus,
.el-button--text:hover {
  background: #409eff;
  color: #fff;
}
.el-button--text:nth-child(2),
.el-button--text:nth-child(3),
.el-button--text:nth-child(4) {
  margin-left: 0;
  margin-bottom: 0;
}
.el-button--text:hover {
  background: #409eff;
  color: #fff;
}
.right {
  position: absolute;
  right: 10px;
  top: 0;
}
.on {
  background: #41cac0;
  color: #fff;
  border-radius: 4px;
}
.el-input {
  width: 202px;
}
.addrInput {
  width: 540px;
}
.margin_bottom {
  margin-bottom: 8px;
}
.contentCover {
  overflow: auto;
}
.itmes {
  display: flex;
  justify-content: flex-start;
  border-top: 1px solid #cccccc;
  border-left: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
  padding: 10px 0 10px 10px;
  .itmesChose,
  .itmesId {
    display: inline-block;
    width: 80px;
  }
  .itmesChose {
    width: 15px;
    height: 15px;
  }
  .itmesId {
    text-align: right;
    line-height: 22px;
  }
  .itmesContent {
    padding-top: 5px;
    .itemsbtns {
      margin-top: 10px;
      padding-bottom: 5px;
    }
    .contentDiv {
      display: inline-block;
    }
  }
  .itemsTittle {
    padding-top: 10px;
    padding-bottom: 5px;
    border-top: 1px solid #cccccc;
    font-weight: bold;
  }
}
.itmes:last-child {
  border-bottom: 1px solid #cccccc;
}
.rightBtn {
  position: absolute;
  top: 0px;
  right: 0px;
}
.choose_sub:last-child {
  border-bottom: none;
}
.versionLi {
  display: inline-block;
}
.exportOptions {
  text-align: center;
  .outportaddr-group {
    margin-left: 10px;
  }
}
.error-text textarea {
  resize: none;
}
.noData {
  text-align: center;
  font-size: 40px;
  color: gray;
}
.MathJye table {
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
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
.MathJye table {
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
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
</style>

