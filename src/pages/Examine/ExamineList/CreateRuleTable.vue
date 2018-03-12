<template>
    <div>
        <table class="rule-table" border="1">
            <thead>
                <tr>
                    <!-- <td width="80px">序号</td>
                    <td width="150px">起始题号</td>
                    <td width="150px">终止题号</td>
                    <td width="135px">分数</td>
                    <td width="300px" class="help">
                        给分步长/给分点
                        <img src="/static/imgs/help.png">
                        <div class="show-help">
                            按步长给分，请输入单个数字，按起分点给分请输入数字并用（，）隔开
                        </div>
                    </td>
                    <td width="110px" class="help">
                        双评比例
                        <img src="/static/imgs/help.png">
                        <div class="show-help">
                            请输入0-100，如果输入为1，请采用单评方式
                        </div>
                    </td>
                    <td width="170px">误差阈值</td>
                    <td width="160px">误差判断到小题</td>
                    <td width="165px">小题数</td>
                    <td width="180px">最短批阅时</td> -->
                    <slot name="head"></slot>
                </tr>
            </thead>
            <tbody>
                <template
                v-for="(item, index) in data">
                    <tr style="height: 10px;"
                    :key="index"
                    v-if="index % 2"></tr>
                    <tr
                    :key="index"
                    v-else>
                        <slot name="body"
                        :row="item"></slot>
                    </tr>
                </template>
            </tbody>
        </table>
        <template
        v-if="!data.length">
            <div class="rule-table-empty">暂无数据</div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>

<style lang="less">
.rule-table {
    width: 100%;
    min-width: 1250px;
    text-align: center;
    thead {
        height: 30px;
        td {
            padding: 10px 0;
        }
    }
    tbody {
        tr {
            height: 80px;
            line-height: 80px;
            margin-top: 5px;
            border: 1px solid #d6d6d6;
            td {
                background-color: #f4f8fe;
            }                
            td + td {
                border-left: 1px solid #d6d6d6;
            }
        }
    }
    .show-help {
        width: 310px;
        border: 1px solid #ffe6cc;
        background-color: #fff5d5;
        border-radius: 8px;
        padding: 5px 15px;
        text-align: left;
        color: #808080;
        line-height: 150%;
        position: absolute;
        top: -60px;
        left: -40px;
        display: none;
    }
    .help {
        position: relative;
        img {
            vertical-align: middle;
        }
    }
    .help:hover .show-help {
        display: block;
    }
}
.rule-table-empty {
    font-size: 16px;
    color: #999;
    text-align: center;
    padding: 10px 0;
}
</style>
