<template>
  <div class="right">
    <el-row class="right-body">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </el-row>
    <el-row class="copyright">
        <el-col>
            系统开发：京县网络科技有限公司   授权使用：丽江市宁蒗中学   应急电话：0888-8888281（周一至周五 9:00-17:00） / 0888-8888713（24小时）
        </el-col>
    </el-row>
    <div class="loading"
    v-show="showLoading">
        <el-button icon="el-icon-loading"></el-button>
    </div>
  </div>
</template>

<script>
import Test from '@/pages/Test'

export default {
	name: 'HelloWorld',
	data () {
		return {}
    },
    computed: {
        showLoading () {
            return this.$store.state.loading
        }
    },
	components: {
		Test,
    },
}
</script>

<style scoped lang="less">
.right {
    height: 100%;
    width:100%;
    padding-left: 210px;
    overflow-x: auto;
    position: relative;
    min-height: 600px;
}
.copyright {
    font-family: SimSun;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    color: #808080;
    // margin-left: 18px;
    margin: 0 auto;
    padding: 25px 0 0 18px;
    // position: absolute;
	// left: 209px;
	// right: 0;
	// height: 56px;
    // bottom: 0;
    position: absolute;
    bottom: 10px;
}
.router-fade-enter-active, .router-fade-leave-active {
    transition: opacity,transform .3s;
}
.router-fade-enter, .router-fade-leave-active {
    opacity: 0;
    transform:translateX(20px);
}
.right-body {
	// position: absolute;
	// left: 209px;
	// top: 0;
	// right: 0;
	// bottom: 70px;
    // min-width: 700px;
    padding-bottom: 50px;
    height: 100%;
}
.right-body>* {
    height: 99%;
    border: 1px solid #f3f3f4;
}
.loading {
    display:  flex;
    position:  absolute;
    top: 0;
    right:  0;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .5);
    z-index:  9999;
    justify-content: center;
    align-items:  center;
    button {
        width: 80px;
        height: 60px;
        border: none;
        font-size: 30px;
    }
}
</style>
