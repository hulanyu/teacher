<template>
  <div class="forgetPassword">
    <Login></Login>
  </div>
</template>

<script>
import Login from './Forget'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    Login
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .forgetPassword {
    width:100%;
    height: 100%;
    background-image: url(../../assets/login.png)
  }

</style>