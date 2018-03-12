<template>
  <div class="main">
    <Top @home="change"></Top>
    <div class="content">
      <Left v-if="msg == 0"></Left>
      <Left v-if="msg == 1"></Left>
      <Right></Right>
    </div>
    
  </div>
</template>

<script>
import Top from './Top'
import Right from './Right'
import Left from './Left'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '0'
    }
  },
  methods: {
    change(msg) {
      this.msg = 2
      this.$nextTick(function() {  
          console.log(msg)
          this.msg = msg;
      })
        
    }
  },
  components:{
    Top,
    Right,
    Left,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .main {
    height: 100%;
    .content{
      width: 100%;
      height: 100%;
      position: relative;
      padding-top: 60px;
    }
  }

</style>

