<template>
    <div class="base-detail">
        <el-card class="box-card">
            <div slot="header">
                <span>{{title1}}</span>
            </div>
            <slot name="item1"></slot>
        </el-card>

        <el-card class="box-card">
            <div slot="header">
                <span>{{title2}}</span>
            </div>
            <slot name="item2"></slot>
        </el-card>

        <el-card class="box-card">
            <div slot="header">
                <span>{{title3}}</span>
            </div>
            <slot name="item3"></slot>
        </el-card>
    </div>
</template>

<script>

export default {
    props: {
        model: Object,
        title1: String,
        title2: String,
        title3: String,
    },
    data () {
        return {}
    },
}
</script>

<style lang="less">
.base-detail {
    // width: 1064px !important;
    .box-card {
        width: 100%;
    }
    .el-card__header {
        background-color: #41cac0;
        color: #fff;
    }
}
</style>

