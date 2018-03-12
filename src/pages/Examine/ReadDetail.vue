<template>
    <Base-right
    title="开始阅卷"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div class="read-detail-box"
            :style="'height: ' + props.maxHeight + 'px;'">
                <el-row class="read-detail-box-top">
                    <div class="read-detail-box-top-right">
                        <el-row class="read-detail-item-title">评卷进度</el-row>
                        <el-row class="status">
                            <el-col class="status-item"
                            :span="12">已评：{{countDone}}</el-col>
                            <el-col
                            :span="12">未评：{{countTodo}}</el-col>
                        </el-row>
                        <div
                        v-if="nowPaperInfo && Object.keys(nowPaperInfo).length">
                            <el-row class="read-detail-item-title">第{{countDone + 1}}题分数</el-row>
                            <el-row>
                                <el-input v-model="score" placeholder="输入分数" size="mini" style="width: 100px;"
                                :min="0"></el-input>
                                &lt;= {{nowPaperInfo.score === void 0 ? '' : nowPaperInfo.score}}分
                            </el-row>
                            <el-row class="result-group">
                                <el-button class="result-group-1" type="primary" size="small"
                                @click="submit">提交</el-button>
                                <el-button class="result-group-2 confirm" size="small"
                                v-if="is_arbit === 1"
                                @click="continueSubmit">申请仲裁</el-button>
                            </el-row>
                        </div>
                    </div>
                    <div class="read-detail-box-top-left">
                        <ul class="left-btn-group">
                            <li class="left-btn"
                            v-for="(item, index) in canvasObj"
                            :key="index"
                            @click="editorBtn(item)">
                                <img 
                                :src="'/static/imgs/' + item.url" alt=""/>
                            </li>
                        </ul>
                        <div class="canvas-group" style="background-color: #ccc;">
                            <div>
                                <canvas 
                                :width="canvasW"
                                :height="canvasH"
                                :id="canvasId"></canvas>
                            </div>
                        </div>
                    </div>
                </el-row>
                <el-row class="read-detail-box-bottom">
                    <div class="read-detail-box-bottom-title">参考答案</div>
                    <div class="read-detail-box-bottom-body"
                    v-if="nowPaperInfo"
                    v-html="nowPaperInfo.answer">
                        <!-- 草树知春不久归 百般红紫斗芳菲 -->
                    </div>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import draw from '../../tools/draw'

export default {
    data () {
        return {
            canvas: null,
            canvasCTX: null,
            canvasW: 0,
            canvasH: 0,
            canvasId: (new Date()).getTime(),
            id: 0,
            canvasObj: [
                {
                    url: 'move_btn.png',
                    handle: this.handleMove.bind(this),
                },
                {
                    url: 'big_btn.png',
                    handle: this.handleBig.bind(this),
                },
                {
                    url: 'small_btn.png',
                    handle: this.handleSmall.bind(this),
                },
                {
                    url: 'pen_btn.png',
                    handle: this.handlePen.bind(this),
                },
                {
                    url: 'eraser_btn.png',
                    handle: this.handleEraser.bind(this),
                },
                {
                    url: 'words_btn.png',
                    handle: this.handleWords.bind(this),
                },
                {
                    url: 'removeFont.png',
                    handle: this.handleRemove.bind(this),
                },
                {
                    url: 'withdraw_btn.png',
                    handle: this.handleWithdraw.bind(this),
                },
            ],

            todoPaperList: [],
            staffName: null,
            // answer: null,
            countDone: 0,
            countTodo: 0,
            nowPaperInfo: {},
            nowPaperIndex: 0,
            // 分数
            score: null,
            d: null,
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.id = this.$route.params.id
        this.req(() => {
            this.compcanvas()
            this.d = draw(document.getElementById(this.canvasId))
            this.d.setStatus(this.d._STATUS_MOVE)
        })
    },
    methods: {
        req (callback=()=>{}) {
            this.$http.post('/Marking/markingPaper', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.id,
            })
            .then(res => {
                
                // 测试
                // res.data = {
                //     "rows": [{
                //         "task_id": "1",
                //         "answer_id": "13",
                //         "exam_id": "1",
                //         "picture": "http:\/\/39.108.106.217:8082\/eduPaperService\/paper\/multiMarkingImg.do?loc=Y2xvdWRwYXBlcl9QYXBlclN1Yy8yMDE4MDIyNy9hOWM3NGFhMjc2NjA0MjY5OTU5MjczYjZkZmQ1ODA0NV9wMC5wbmcmeD0xMTUmeT0xMzk4Jnc9MTQ4NSZoPTIzOA==",
                //         "t1": "2",
                //         "t2": "13",
                //         "edit_flag": "0",
                //         "mark_flag": "0",
                //         "marking_time": null,
                //         "marktype": "0",
                //         "score": "3.00",
                //         "point": "0.00",
                //         "read_time": "0",
                //         "sequence": 1,
                //         "answer": "【解答】解：笔尖在纸上移动能写出字，用数学知识解释就是点动成线．<br \/>故答案为：点动成线．"
                //     }, {
                //         "task_id": "2",
                //         "answer_id": "14",
                //         "exam_id": "1",
                //         "picture": "http:\/\/39.108.106.217:8082\/eduPaperService\/paper\/multiMarkingImg.do?loc=Y2xvdWRwYXBlcl9QYXBlclN1Yy8yMDE4MDIyNy9hOWM3NGFhMjc2NjA0MjY5OTU5MjczYjZkZmQ1ODA0NV9wMC5wbmcmeD0xMTQmeT0xNjUwJnc9MTQ4NSZoPTIzOQ==",
                //         "t1": "2",
                //         "t2": "14",
                //         "edit_flag": "0",
                //         "mark_flag": "0",
                //         "marking_time": null,
                //         "marktype": "0",
                //         "score": "3.00",
                //         "point": "0.00",
                //         "read_time": "0",
                //         "sequence": 2,
                //         "answer": "【解答】解：直角三角形绕一条直角边所在的直线旋转一周，可以得到圆锥，能说明面动成体，<br \/>故答案为：面动成体．"
                //     }, {
                //         "task_id": "3",
                //         "answer_id": "15",
                //         "exam_id": "1",
                //         "picture": "http:\/\/39.108.106.217:8082\/eduPaperService\/paper\/multiMarkingImg.do?loc=Y2xvdWRwYXBlcl9QYXBlclN1Yy8yMDE4MDIyNy9hOWM3NGFhMjc2NjA0MjY5OTU5MjczYjZkZmQ1ODA0NV9wMC5wbmcmeD0xNjgwJnk9MjM1Jnc9MTQ3NyZoPTI0MA==",
                //         "t1": "2",
                //         "t2": "15",
                //         "edit_flag": "0",
                //         "mark_flag": "0",
                //         "marking_time": null,
                //         "marktype": "0",
                //         "score": "3.00",
                //         "point": "0.00",
                //         "read_time": "0",
                //         "sequence": 3,
                //         "answer": "【解答】解：从运动的观点看，点动成 线，线动成 面，面动成 体，<br \/>故答案为：线，面，体．"
                //     }],
                //     "staff_name": "小海老师",
                //     "answer_service": "http:\/\/39.108.106.217:8082\/",
                //     "count_done": 0,
                //     "count_todo": 10,
                //     "is_arbit": 0
                // }

                this.todoPaperList = res.data.rows
                this.staffName = res.data.staff_name
                this.countDone = parseInt(res.data.count_done)
                this.countTodo = parseInt(res.data.count_todo)
                this.is_arbit = parseInt(res.data.is_arbit)
                callback()
                this.initNextPaper()
            })
        },
        computedDone (num) {
            this.countDone++    
        },
        computedTodo () {
            this.countTodo--    
        },
        initNextPaper () {
            this.nowPaperInfo = this.todoPaperList[this.nowPaperIndex]
            if (this.nowPaperInfo) {
                this.d.setBackgroundImage(this.nowPaperInfo.picture)
            }
            this.nowPaperIndex++
        },
        updateNextPaper () {
            // if (this.nowPaperIndex > this.countDone) {
            //     this.$message.error('已没有可评试卷')
            //     return
            // }
            if (this.countTodo <= 0) {
                this.$message.error('已没有可评试卷')
                return
            }
            this.initNextPaper()
            this.computedDone()
            this.computedTodo()
        },
        compcanvas () {
            const canvasGroupNode = getComputedStyle(document.getElementsByClassName('canvas-group')[0])
            this.canvasW = parseInt(canvasGroupNode.width) - 50
            this.canvasH = parseInt(canvasGroupNode.height)
        },
        editorBtn (item) {
            item.handle()
        },
        handleMove () {
            this.d.setStatus(this.d._STATUS_MOVE)
        },
        handleBig () {
            this.d.setStatus(this.d._STATUS_BIG)
        },
        handleSmall () {
            this.d.setStatus(this.d._STATUS_SMALL)
        },
        handlePen () {
            this.d.setStatus(this.d._STATUS_DRAW)
        },
        handleEraser () {
            this.d.setStatus(this.d._STATUS_CLEARDRAW)
        },
        handleWords () {
            this.d.setStatus(this.d._STATUS_TEXT)
        },
        handleRemove () {
            this.d.setStatus(this.d._STATUS_CLEARTEXT)
        },
        handleWithdraw () {
            // this.d.setStatus(this.d._STATUS_UPDATE)
            this.$router.go(0)
        },

        submit () {
            if (this.score === null || this.score === void 0) {
                this.$message.error('请填写分数')
                return
            } else if (parseInt(this.score) > parseInt(this.nowPaperInfo.score)) {
                this.$message.error('超出范围')
                return
            }
            this.$http.post('/Marking/savePoint', {
                token: this.$tools.getToken(),
                task_id: this.nowPaperInfo.task_id,
                exam_id: this.$route.params.id,
                answer_id: this.nowPaperInfo.answer_id,
                point: this.score,
            })
            .then(res => {
                this.score = null
                this.$message.success(res.info)
                this.updateNextPaper()
            })
        },
        continueSubmit () {
            this.$http.post('/Marking/applyArbit', {
                token: this.$tools.getToken(),
                task_id: this.nowPaperInfo.task_id,
                exam_id: this.$route.params.id,
                answer_id: this.nowPaperInfo.answer_id,
            })
            .then(res => {
                this.score = null
                this.$message.success(res.info)
                this.updateNextPaper()
            })
        },
    }
}
</script>

<style lang="less" scoped>
.read-detail-item-title {
    font-size: 14px;color: #4c4c4c;font-weight: bold;
    padding: 20px 0 20px 0;
}
.read-detail-box {
    border: 1px solid #dddddd;
    &-top {
        height: 63%;
        overflow: hidden;
        &-left {
            margin-right: 250px;
            height: 100%;
        }
        &-right {
            width: 249px;
            border-left: 1px solid #dddddd;
            float: right;
            height: 100%;
            overflow-y: auto;
            padding: 30px 28px;
            position: relative;
            z-index: 50;
            background-color: #fff;
                .title {
                    font-family: SimSun;
                    font-size: 14px;
                    color: #666666;
                }
                // .status {
                //     font-size: 14px;
                //     padding: 20px 0;
                //     &-item {

                //     }
                // }
                .result-group {
                    display: flex;
                    justify-content: center;
                    padding-top: 20px;
                }
        }
    }
    &-bottom {
        height: 37%;
        border-top: 1px solid #dddddd;
        background-color: #f4f8fe;
        padding: 22px 20px;
        overflow-y: auto;
        &-title {
            color: #666666;
        }
        &-body {
            padding: 20px 48px;
	        color: #333333;
        }
    }
}
.left-btn-group {
    width: 60px;
    float: left;
    height: 100%;
    background-color: #a3d6ff;
    padding: 10px 0;
    overflow-y: auto;
    .left-btn {
        margin: 10px auto;
        border-radius: 4px;
        background-color: #fff;
        text-align: center;
        width: 36px;
        height: 36px;
        cursor: pointer;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.canvas-group {
    margin-left: 60px;
    height: 100%;
    canvas {
        // background-color: #fff;
        margin: 0 auto;
        padding: 0; 
    }
}
</style>
