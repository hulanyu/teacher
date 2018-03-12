<template>
  <div class="top" :style="{'z-index':zindex}">
      <div class="topcover" :style="{'display':isshow}"></div>
        <div class="title">
          <span @click="linkHome">{{school_name}}</span>
        </div>
        <div class="right">
          <img src="" alt="">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">修改密码</el-dropdown-item>
              <el-dropdown-item command="b">意见反馈</el-dropdown-item>
              <el-dropdown-item command="c">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      
      <!-- 退出 -->
      <el-dialog
        title="退出"
        :visible.sync="dialogFormVisible"
        width="30%"
        :before-close="handleClose"
        style="z-index:4000;"
        custom-class="outd"
        >
        <div class="centerShow">
          <span>是否确定退出</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="outcolose">取 消</el-button>
          <el-button type="primary" @click="outconfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改密码 -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogFormVisiblePassWord"
        width="30%"
        :before-close="handleClose"
        style="z-index:4000;"
        custom-class="outd"
        >
        <div class="item">
          <label>旧密码：</label>
          <input type="password" placeholder="请输入旧密码" v-model="old">
        </div>
        <div class="item">
          <label>新密码：</label>
          <input type="password" placeholder="请输入新密码" v-model="password">
        </div>
        <div class="item">
          <label>确认密码：</label>
          <input type="password" placeholder="请确认新密码" v-model="repassword">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="outcolose">取 消</el-button>
          <el-button type="primary" @click="changeConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 已经反馈 -->
      <el-dialog
        title="意见反馈"
        :visible.sync="dialogFormVisibleMsg"
        width="30%"
        :before-close="handleClose"
        :data="uploadData"
        style="z-index:4000;"
        custom-class="outd"
        >
        <div class="msg">
          <div class="title">
            <p>您好，欢迎提出宝贵的建议或意见</p> 
            <p>您留下的每个字都将被用来改善我们的服务</p> 
          </div>
          <div class="content">
            <label>反馈内容：</label>
            <textarea placeholder="最多输入200个字" maxlength="200" v-model="content" cols="30" rows="5"></textarea>
          </div>
          <div class="upload">
            <label>上传图片:<span class="markedWord">（最多上传4张图片）</span></label>
            <el-upload
              class="upload-demo"
              :name="upload_file"
              :accept="accept"
              :show-file-list="isShowlist"
              :action="uploadAction"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList2"
              :on-success="successfn"
              :on-error="errorfn"
              :limit=4
              :data="datas"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="outcolose">取 消</el-button>
          <el-button type="primary" @click="suggestConfirm">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import Top from './Top'
import config from '@/config'
export default {
  name: 'Top',
  data () {
    return {
      school_name:localStorage.jxschool_name,
      name:localStorage.jxname,
      msg: 1,
      dialogFormVisible:false,
      dialogFormVisibleMsg:false,
      dialogFormVisiblePassWord:false,
      zindex:100,
      isshow:"none",
      //修改密码
      old:"",
      password:"",
      repassword:"",
      isShowlist:true,
      //上传图片
      uploadAction:config.BASEURL+"/Common/uploadFile",
      upload_file:"upload_file",
      uploadData:localStorage.jxtoken,
      fileList2:[],
      accept:"image/jpeg,image/jpg,image/png",
      content:"",
      datas:{token:localStorage.jxtoken},
      imgList:[]
    }
  },
  mounted () {
      //this.req()
  },
  methods:{
    // req() {
    //     this.$http.post('/Common/staff', {
    //         token: localStorage.jxtoken,
    //     })
    //     .then((res) => {
    //         console.log(res);
    //     });
    // },
    linkHome() {
      sessionStorage.defaultIndex = ""
      if(this.msg == 0) {
        this.msg = 1;
        this.$emit('home',this.msg);
      }else {
        this.msg = 0;
        this.$emit('home',this.msg);
      }
      
      this.$router.push('/home')
    },
    //选择下拉框
    handleCommand(command) {
      if(command == 'a') { //修改密码
        this.old = "";
        this.password = "";
        this.repassword = "";
        this.zindex = 3023;
        this.isshow = "block";
        this.dialogFormVisiblePassWord = true;
      }
      if(command == 'b') { //意见反馈
        this.zindex = 3023;
        this.isshow = "block";
        this.dialogFormVisibleMsg = true;
      }
      if(command == 'c') { //退出系统
        this.zindex = 3023;
        this.isshow = "block";
        //document.querySelector('.v-modal').style.display = "none";
        this.dialogFormVisible = true;
      }
    },
    // //上传图片
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    //提交修改密码
    changeConfirm() {
      if(this.old.trim() == "" || this.old.toString().trim() == "") {
          this.$message.error('请输入旧密码!');
          return;
      }
      if(this.password.trim() == "" || this.password.toString().trim() == "") {
          this.$message.error('请输入新密码!');
          return;
      }
      if(this.repassword.trim() == "" || this.repassword.toString().trim() == "") {
          this.$message.error('请确定新密码!');
          return;
      }
      if(this.password != this.repassword) {
          this.$message.error('两次输入的新密码不一致!');
          return;
      }
      this.$http.post('/Index/password',{
          old:this.old,
          password:this.password,
          repassword:this.repassword,
          token:localStorage.jxtoken
      })
      .then(res => {
        console.log(res)
        this.$message.success(res.info);
        this.dialogFormVisible = false;
        this.dialogFormVisibleMsg = false;
        this.dialogFormVisiblePassWord = false;
        this.zindex = 100;
        this.isshow = "none";
      })
      .catch(res=>{
        this.$message.error(res.info);
      })
    },
    //上传图片
    handleRemove(file, fileList) {
      //console.log(file, fileList);
      this.imgList = []
      for(let i = 0;i<fileList.length;i++) {
        this.imgList.push(fileList[i].response.data.url);
      }
      console.log(this.imgList);
    },
    handlePreview(file) {
      console.log(file.response);
    },
    //上传成功
    successfn(response, file, fileList) {
      this.imgList = []
      if(response.status == 0) {
        //this.isShowlist = false;
        this.$message.error(response.info);
      }else if(response.status == 1) {
        this.isShowlist = true;
        this.$message.success(response.info);
        for(let i = 0;i<fileList.length;i++) {
          this.imgList.push(fileList[i].response.data.url);
        }
      }
      console.log(this.imgList);
    },
    //上传失败
    errorfn(err, file, fileList) {
      this.$message.error(response.info);
    },
    //意见反馈提交
    suggestConfirm() {
      if(this.content.trim() == "" || this.content.toString().trim() == "") {
          this.$message.error('请输入反馈内容!');
          return;
      }
      this.$http.post('/Index/suggest',{
        token:localStorage.jxtoken,
        content:this.content,
        photoes:this.imgList.join(',')
      })
      .then(res => {
        console.log(res)
        this.$message.success(res.info);
        this.dialogFormVisible = false;
        this.dialogFormVisibleMsg = false;
        this.dialogFormVisiblePassWord = false;
        this.zindex = 100;
        this.isshow = "none";
        this.content = "";
        this.imgList = [];
      })
      .catch(res=>{
        this.$message.error(res.info);
      })
    },
    //弹窗关闭
    handleClose() {
      this.dialogFormVisible = false;
      this.dialogFormVisibleMsg = false;
      this.dialogFormVisiblePassWord = false;
      this.zindex = 100;
      this.isshow = "none";
    },
    //退出关闭
    outcolose() {
      this.dialogFormVisible = false;
      this.dialogFormVisibleMsg = false;
      this.dialogFormVisiblePassWord = false;
      this.zindex = 100;
      this.isshow = "none";
    },
    //退出确定
    outconfirm() {
      localStorage.jxid = "";
      localStorage.jxname = "";
      localStorage.jxschool_id = "";
      localStorage.jxschool_name = "";
      localStorage.jxtoken = "";
      this.$router.push('/login')
    }
  },
  components:{
    ITableEditor,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.top {
  .topcover {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    width:100%;
    height: 100%;
    margin-left: -30px;
  }
  .title {
    span {
      cursor: pointer;
    }
  }
  background: #409EFF;
  color: white;
  line-height: 60px;
  padding-left: 30px;
  font-size: 15px;
  width: 100%;
  position: fixed;
  width: 100%;
  height: 60px;
  .right {
    position: absolute;
    top:0;
    right: 50px;
    .el-dropdown {
      color: white;
      cursor: pointer;
    }
  }
}
.item {
  margin-bottom: 10px;
}
.item label {
  display: inline-block;
  width:100px;
  text-align: right;
}
.item input {
  padding:5px;
  border-radius: 5px;
  border:1px solid #e4e7ed;
  outline: none;
  padding: 5px;
}
.msg {
  .title {
    text-align: center;
    margin-bottom: 20px;
  }
  .content {
    textarea {
      resize: none;
      border-radius: 5px;
      outline: none;
      padding:5px;
      width:98%;
    }
  }
  label {
    margin-bottom: 5px;
    display: inline-block;    
  }
} 
.centerShow {
  text-align: center;
  font-size: 16px;
}
.markedWord {
  font-size: 13px;
  color:gray;
}
</style>
