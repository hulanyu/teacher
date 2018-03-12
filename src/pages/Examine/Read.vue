<template>
    <Base-right
    title="阅卷任务"
    @update="req">
        <template slot-scope="props">
            <div class="card-group" 
            :style="'height:' + props.maxHeight + 'px;'">
                <template
                v-if="data.length > 0">
                    <div 
                    :class="item.todo === 0 ? 'card card-selected' : 'card'"
                    v-for="(item, index) in data"
                    :key="index">
                        <div class="card-title">阅读信息</div>
                        <div class="card-body">
                            <p class="card-body-item">
                                <span>阅卷</span>
                                <span>{{item.name}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>年级</span>
                                <span>{{item.grade}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>科目</span>
                                <span>{{item.subject}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>数量</span>
                                <span>{{item.amount}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>分配</span>
                                <span>{{item.total}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>已阅</span>
                                <span>{{item.done}}</span>
                            </p>
                            <p class="card-body-item">
                                <span>未阅</span>
                                <span>{{item.todo}}</span>
                            </p>
                        </div>
                        <div class="card-foot">
                            <router-link style="color: #fff;"
                            v-if="item.todo"
                            :to="{name: 'ExamineReadDetail', params: {id: item.exam_id}}">
                                <el-button class="confirm">
                                    开始阅卷
                                </el-button>
                            </router-link>
                            <el-button
                            v-else>
                                阅卷完毕
                            </el-button>
                        </div>
                    </div>
                </template>
                <template
                v-else>
                    <span style="display: inline-block;height: 100%;width: 1px;vertical-align: middle;"></span>
                    <span style="text-align: center;display: inline-block;width: 99%;font-size: 20px;color: #aaa;">
                        暂无数据
                    </span>
                </template>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

export default {
    data () {
        return {
            data: [],
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.req()
    },
    methods: {
        req() {
            this.$http.post('/Marking/markingTask', {
                token: this.$tools.getToken(),
                type: 0,
            })
            .then(res => {
                this.data = res.data.sort((a, b) => {
                    return a.todo < b.todo
                })
            })
        },
    }
}
</script>

<style lang="less">
.card-title, .card-body {
    padding-left: 20px;
    padding-right: 20px;
}
.card-group {
    overflow: auto;
}
.card {
    width: 205px;
    border: 1px solid #dddddd;
    padding-bottom: 14px;
    border-radius: 8px;
    float: left;
    margin: 10px 10px 0 10px;
    .card-title {
        background-color: #41cac0;
        padding-top: 17px;
        padding-bottom: 15px;
        color: #fff;
        font-size: 12px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .card-body {
        padding-top: 16px;
        padding-bottom: 17px;
        color: #808080;
        .card-body-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
    }
    .card-foot {
        text-align: center;
        button {
            width: 120px;
            height: 36px;
        }
    }
}
.card-selected {
    .card-title {
        background-color: rgba(203,203,203,0.5);
    }
    .card-body {
        color: rgba(128,128,128,0.5);
    }
    .card-foot {
        button {
            background-color: rgba(203,203,203,0.5);
            color: rgba(255,255,255,0.5);
            border: none;
            cursor: not-allowed;
        }
    }
}
</style>

