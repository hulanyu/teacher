<template>
    <Base-right
    :title="title"
    :isUpdate="false"
    :isBack="true">
        <el-form class="create-subject"
        :model="data"
        label-width="100px">
            <el-form-item label="项目名称：">
                <el-input v-model="data.subjectName" placeholder="请输入项目名称"
                :disabled="comDisabled"></el-input>
            </el-form-item>
            <el-form-item label="项目别名：">
                <el-input v-model="data.subjectAlias" placeholder="什么什么项目"
                :disabled="comDisabled"></el-input>
            </el-form-item>
            <el-form-item label="项目组长：">
                <el-select v-model="data.subjectLeader" placeholder="请选择" style="width: 100%;"
                :disabled="comDisabled">
                    <el-option
                    label="老李"
                    value="laoli">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考试日期：">
                <el-date-picker style="width: 100%;"
                :disabled="comDisabled"
                v-model="data.dataTime"
                type="datetime"
                placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-row>
                <div class="subject-count">
                    <el-form-item label="参考学生：">
                        <el-input v-model="data.count" placeholder="人数" style="width: 80%;"
                        :disabled="comDisabled"></el-input>
                        <span style="display: inline-block;width: 15%;">人</span>
                    </el-form-item>
                </div>
                <div class="subject-file"
                v-if="!comDisabled">
                    <el-button class="confirm" style="float: right;">选择文件</el-button>
                    <div class="temp"><a href="">模板下载</a></div>
                </div>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
                <el-button class="confirm"
                v-if="comDisabled"
                @click="$router.go(-1)">返回</el-button>
                <el-button class="confirm"
                v-else>完成</el-button>
            </el-row>
        </el-form>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

const CREATE = 'create'
const EDITOR = 'editor'
const READ = 'read'

export default {
    props: {
        type: {
            type: String,
            default: READ,
        },
        title: String,
    },
    data () {
        return {
            data: {
                subjectName: '',
                subjectAlias: '',
                subjectLeader: '',
                dataTime: '',
                count: 0,
            }
        }
    },
    computed: {
        comDisabled () {
            return this.type === READ
        }
    },
    components: {
        BaseRight,
    },
}
</script>

<style lang="less">
.subject-count, .subject-file {
    float: left;
}
.subject-count {
    width: 80%;
}
.subject-file {
    width: 20%;
    position: relative;
    .temp {
        position: absolute;
        right: -55px;
        top: 13px;
    }
}
.create-subject {
    width: 500px;
    margin: 0 auto;
    padding: 30px 0;
}
</style>
