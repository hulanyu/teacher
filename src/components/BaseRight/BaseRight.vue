<template>
    <div class="base-right">
        <el-card class="box-card">
            <template slot="header">
                <div class="title">
                    <span>{{ title }}</span>
                    <el-button class="update" size="mini" icon="el-icon-refresh"
                    v-if="isUpdate"
                    @click="update"></el-button>

                    <el-button class="back" size="mini"
                    v-if="isBack"
                    @click="back">
                        <img src="/static/imgs/page_back.png" style="height: 100%;">
                    </el-button>
                </div>
            </template>
            <slot
            :maxHeight="maxHeight"></slot>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'BaseRight',
    props: {
        title: {
            type: String,
            default: ''
        },
        isUpdate: {
            type: Boolean,
            default: true,
        },
        isBack: {
            type: Boolean,
            default: false,
        }
    },
    data () {
        return {
            maxHeight: 0,
        }
    },
    mounted () { 
        this.computedHeight()
        this.$tools.htmlResize((result) => {
            if (result.h) {
                this.computedHeight()
            }
        })
    },
    methods: {
        computedHeight () {
            // const baseNode = document.querySelector('.base-right')
            // const titleNode = document.querySelector('.base-right .el-card__header')
            // const bodyNode = document.querySelector('.base-right .el-card__body')

            // const baseHeight = parseInt(getComputedStyle(baseNode).height)
            // const titleHeight = parseInt(getComputedStyle(titleNode).height)
            // const bodyHeight = parseInt(getComputedStyle(bodyNode).paddingTop) * 2

            // this.maxHeight = baseHeight - titleHeight - bodyHeight

            const baseNode = document.querySelector('.base-right')
            const titleNode = document.querySelector('.base-right .el-card__header')
            const bodyNode = document.querySelector('.base-right .el-card__body')

            const baseHeight = parseInt(getComputedStyle(baseNode).height)
            const titleHeight = parseInt(getComputedStyle(titleNode).height)
            const titlePadding = parseInt(getComputedStyle(titleNode).paddingTop) * 2 
            const bodyPadding = parseInt(getComputedStyle(bodyNode).paddingTop) * 2
            this.maxHeight = baseHeight - titleHeight - bodyPadding - 50
            // ie兼容
            let browser = this.$tools.getBrowserInfo()
            if (browser.name === 'ie') {
                this.maxHeight = this.maxHeight - titlePadding
            }
        },
        update () {
            this.$emit('update')
        },
        back () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less">
.base-right {
    height: 100%;
    padding: 16px 18px 0 18px;
}
.box-card {
    height: 100%;
    .title {
        // width: 108px;
        height: 18px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        color: #2a3542;
    }
    .update {
        display: inline-block;
    }
    .back {
        display: inline-block;
        height: 28px;
        padding: 0;
        vertical-align: middle;
        border: none;
        float: right;
    }
}
</style>


