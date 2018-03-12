<template>
  <div class="login">
    <div class="header">
        <div class="title">校园教务管理系统平台</div>
        <div class="libs">Campus educational administration system</div>
    </div>
    <div class="smallTitle">
      <span>欢迎登录</span>
    </div>
    <div class="content">
        <!-- <div class="list">
            <el-radio v-model="radio" label="1">教职工</el-radio>
            <el-radio v-model="radio" label="2">学生家长</el-radio>
        </div> -->
        <div class="lists">
            <!-- <input class="inputs" type="text" placeholder="手机号码">
            <input class="inputs" type="password" placeholder="密码"> -->
            <el-input placeholder="手机号码" v-model="phone" :maxlength="maxlength">
              <template slot="prepend">
                <img src="../../assets/phone.png" alt="">
              </template>
            </el-input>
            <el-input placeholder="密码" v-model="password">
              <template slot="prepend">
                <img src="../../assets/password.png" alt="">
              </template>
            </el-input>
            <div class="codecover">
              <input type="text" placeholder="请输入验证码" class="codeinput">
              <img @click="changeVerifyCodeUrl" :src="verifyCodeBaseUrl" alt="" style="width:50%;">
            </div>
        </div>
        <el-button type="primary" class="submit" :loading="false" @click="btnClickForNextStep">登录</el-button>
        <span class="forget" @click="link">忘记密码?</span>
    </div>
    
  </div>
</template>

<script>
import config from "@/config";
export default {
  name: "Login",
  data() {
    return {
      maxlength: 11,
      //获取验证码image绑定对象
      verifyCodeBaseUrl: "",
      unique: "",
      phone: "",
      password: 123456,
      code: ""
    };
  },
  mounted() {
    this.unique = this.$tools.random();
    this.verifyCodeBaseUrl =
      config.BASEURL + "/Logreg/imgCode?unique=" + this.unique;
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    link: function() {
      this.$router.push("/forget-password");
    },
    //更新验证码
    changeVerifyCodeUrl() {
      this.verifyCodeBaseUrl = "";
      this.unique = this.$tools.random();
      this.verifyCodeBaseUrl =
        config.BASEURL + "/Logreg/imgCode?unique=" + this.unique;
    },
    btnClickForNextStep() {
      //验证手机号
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      if (!mobile.test(this.phone)) {
        this.$message.error("请输入合法的手机号码!");
        return;
      }
      if (this.password == "") {
        this.$message.error("请输入密码!");
        return;
      }
      this.$http
        .post("/Logreg/login", {
          phone: this.phone,
          password: this.password,
          type: "staff"
        })
        .then(res => {
          sessionStorage.defaultIndex = "";
          this.$message.success(res.info);
          // loginData = JSON.stringify(res.data); //转化为JSON字符串
          // localStorage.setItem("loginData", loginData);
          localStorage.jxid = res.data.id;
          localStorage.jxname = res.data.name;
          localStorage.jxschool_id = res.data.school_id;
          localStorage.jxschool_name = res.data.school_name;
          localStorage.jxtoken = res.data.token;
          this.$router.push("/home");
        })
        .catch(res => {
          this.$message.error(res.info);
        });
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
      border-bottom: 2px solid #317eeb;
    }
  }
  .content {
    padding-top: 30px;
    padding-bottom: 40px;
    background: white;
    border-radius: 0 0 5px 5px;
    .list {
      display: flex;
      width: 80%;
      margin: 20px 10%;
      justify-content: space-around;
      .el-radio__label {
        font-size: 22px;
      }
    }
    .lists {
      text-align: center;
      width: 80%;
      margin-left: 10%;
      line-height: 60px;
    }
  }
  .submit {
    width: 80%;
    margin-left: 10%;
    margin-top: 20px;
    padding: 10px;
    border-radius: 3px;
    background: #3593f3;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
  }
  .forget {
    position: absolute;
    bottom: 15px;
    right: 40%;
    font-size: 16px;
    color: #3593f3;
    cursor: pointer;
    width: 20%;
    text-align: center;
    display: inline-block;
    font-size: 14px;
  }
  .codeImg {
    cursor: pointer;
  }
}
.codecover {
  .codeinput {
    width: 47.5%;
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
