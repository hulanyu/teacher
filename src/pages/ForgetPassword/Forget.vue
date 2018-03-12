<template>
  <div class="login">
    <div class="header">
        <div class="title">校园教务管理系统平台</div>
        <div class="libs">Campus educational administration system</div>
    </div>
    <div class="smallTitle">
      <span>找回密码</span>
    </div>
    <div class="content">
        <div class="lists">
            <el-input :autofocus="mobilePhoneAutoFocus" placeholder="请输入您的手机号码" v-model="submitForm.phone" 
              :maxlength="mobilePhoneLength"  
              :minlength="mobilePhoneLength">
            </el-input>
            <div class="codecover">
              <input placeholder="请输入验证码" v-model="submitForm.img_code" type="text" class="codeinput">
              <img @click="changeVerifyCodeUrl" :src="verifyCodeBaseUrl" alt="" style="width:50%;">
            </div>
            <el-input placeholder="请输入手机验证码" v-model="submitForm.phone_code" 
              :maxlength="6"  
              :minlength="1">
              <template slot="append">
                <el-button type="primary" class="getCodeBtn" @click="getCodeFn" :disabled="isdisabled">{{getCodeText}}</el-button>
              </template>
            </el-input>
            <el-input placeholder="请输入新密码" type="password" v-model="submitForm.password" >
            </el-input>
            <el-input placeholder="请确认新密码" type="password" v-model="submitForm.repassword" >
            </el-input>
        </div>
        <el-button type="primary" class="submit" @click="btnClickForNextStep">提交</el-button>
        <span class="forget" @click="link">返回登录</span>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      radio: '1',
      input3:'',
      isdisabled:false,
      options: [{
            value: '1',
            label: '教职工'
          }, 
          {
            value: '2',
            label: '学生家长'
          }, 
        ],
        getCodeText:"获取验证码",
        value: '1',
        //手机号码输入自动聚焦
        mobilePhoneAutoFocus:true,
        //手机长度限制
        mobilePhoneLength:11,
        //获取验证码image绑定对象
        verifyCodeBaseUrl:"",
        unique:"",
        //忘记密码提交Form
        submitForm:{
          phone:"15228996545",   //手机号码
          type:"staff",
          phone_code:"",
          password:"",  
          repassword:"",
          img_code:""
        }
    };
  },
  mounted() {
    this.unique = this.$tools.random();
    this.verifyCodeBaseUrl = "http://edu.dev.jxjt.me/Logreg/imgCode?unique="+this.unique;
  },
  methods: {
    btnClickForNextStep() {
      //验证手机号
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      if(!mobile.test(this.submitForm.phone)){
        this.$message.error('请输入合法的手机号码!');
        return;
      }
      if(this.submitForm.phone_code.length!=6){
        this.$message.error('请输入合法的手机验证码!');
        return;
      }
      if(this.submitForm.password.trim() == "" || this.submitForm.password.toString().trim() == "") {
          this.$message.error('请输入新密码!');
          return;
      }
      if(this.submitForm.repassword.trim() == "" || this.submitForm.repassword.toString().trim() == "") {
          this.$message.error('请确定新密码!');
          return;
      }
      if(this.submitForm.password != this.submitForm.repassword) {
          this.$message.error('两次输入的密码不一致!');
          return;
      }
      this.$http.post('/Logreg/resetPassword',{
          phone:this.submitForm.phone,
          type:'staff',
          phone_code:this.submitForm.phone_code,
          password:this.submitForm.password,
          repassword:this.submitForm.repassword
      })
      .then(res => {
        console.log(res)
        this.$message.success(res.info);
        this.$router.push('/login')
      })
      .catch(res=>{
        this.$message.error(res.info);
      })
    },
    link:function() {
        this.$router.push('/login')
    },
    //更新验证码
    changeVerifyCodeUrl(){
      this.verifyCodeBaseUrl = "";
      this.unique = this.$tools.random();
      this.verifyCodeBaseUrl = "http://edu.dev.jxjt.me/Logreg/imgCode?unique="+this.unique;
    },
    //获取手机验证码
    getCodeFn() {
      //验证手机号
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      if(!mobile.test(this.submitForm.phone)){
        this.$message.error('请输入合法的手机号码!');
        return;
      }
      if(this.submitForm.img_code.length!= 4){
        this.$message.error('请输入合法的图片验证码!');
        return;
      }
      this.isdisabled = true
      this.$http.post('/Logreg/sendCode',{
          phone:this.submitForm.phone,
          unique:this.unique,
          type:'staff',
          img_code:this.submitForm.img_code
      })
      .then(res => {
        console.log(res)
        this.$message.success(res.info);
        let time = 60
        let timer = setInterval(()=>{
          if(time > 0) {
            this.isdisabled = true
            this.getCodeText = time + 's'
            time--
          }else {
            clearInterval(timer); 
            this.getCodeText = "获取验证码"
            this.isdisabled = false
          }
          
        },1000)
      })
      .catch(res=>{
        this.isdisabled = false
        this.$message.error(res.info);
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login {
  width: 360px;
  height: 480px;
  position: fixed;
  top: 20%;
  right: 20%;
  border-radius: 5px;
  position: absolute;
  .header {
    height: 100px;
    color: #666666;
    font-size: 36px;
    align-items: center;
    text-align: center;
    border-radius: 5px 5px 0 0;
    .libs {
      font-size: 18px;
      color: #999999;
    }
  }
  .smallTitle {
    text-align: center;
    color: black;
    background: white;
    padding: 20px 0 10px;
    font-size: 22px;
    border-radius: 5px 5px 0 0;
    span {
      padding-bottom: 10px;
      border-bottom: 2px solid #317EEB;
    }
  }
  .content {
    padding-top: 30px;
    padding-bottom: 40px;
    background: white;
    border-radius: 0 0 5px 5px;
    .list {
      display: flex;
      width:80%;
      margin:20px 10%;
      justify-content: space-around;
      .el-select {
        width:100%;
      }
    }
    .lists {
      text-align: center;
      width:80%;
      margin-left: 10%;
      line-height: 55px;
      .getCodeBtn {
        background: #49C9BF;
        border-radius: 0 3px 3px 0;
        color:white;
        width:120px;
      }
    }
  }
  .submit {
    width: 80%;
    margin-left: 10%;
    margin-top: 20px;
    padding:10px;
    border-radius: 3px;
    background: #3593f3;
    border:none;
    color:white;
    font-size: 18px;
    cursor: pointer;
  }
  .forget {
     position: absolute;
     bottom: -80px;
     right: 40%; 
     font-size: 16px;
     color:#3593f3;
     cursor: pointer;
     width: 20%;
     text-align: center;
     display: inline-block;
  }
  .codeImg {
    cursor: pointer;
  }
}
.codecover {
  .codeinput {
    width:47.5%;
    height: 47px;
    vertical-align: text-bottom;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding: 5px;
    padding-left: 10px;
    box-sizing: border-box;
  }
}
</style>
