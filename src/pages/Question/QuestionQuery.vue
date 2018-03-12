<template>
    <div class="choose">
        <div class="choose_sub">
            <span class="choose_title">版本：</span>
            <ul class="versionUl">
                <li @click="choosed('version',item.id,index,$event, version_index === index)" 
                :class="setLiCSS('versionLi', version_index === index)" 
                v-for="(item,index) in versionData" 
                :key="index">{{item.versions}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: versionShow }" 
            @click="more('version',$event,0)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>
        <div class="choose_sub">
            <span class="choose_title">年级：</span>
            <ul class="gradeUl">
                <li @click="choosed('grade',item.id,index,$event, grade_index === index)" 
                :class="setLiCSS('gradeLi', grade_index === index)" 
                v-for="(item,index) in gradeData" 
                :key="index">{{item.class}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: gradeShow }" 
            @click="more('grade',$event,1)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>
        <div class="choose_sub">
            <span class="choose_title">科目：</span>
            <ul class="sujectUl">
                <li @click="choosed('suject',item.id,index,$event, suject_index === index)" 
                :class="setLiCSS('sujectLi', suject_index === index)" 
                v-for="(item,index) in sujectData" 
                :key="index">{{item.subject}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: sujectShow }" 
            @click="more('suject',$event,2)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>
        <div class="choose_sub">
            <span class="choose_title">章：</span>
            <ul class="chapterUl">
                <li @click="choosed('chapter',item.id,index,$event, chapter_index === index)" 
                :class="setLiCSS('chapterLi', chapter_index === index)" 
                v-for="(item,index) in chapterData" 
                :key="index">{{item.chapter}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: chapterShow }" 
            @click="more('chapter',$event,3)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>
        <div class="choose_sub">
            <span class="choose_title">节：</span>
            <ul class="nodeUl">
                <li @click="choosed('node',item.id,index,$event, node_index === index)" 
                :class="setLiCSS('nodeLi', node_index === index)" 
                v-for="(item,index) in nodeData" 
                :key="index">{{item.chapter}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: nodeShow }" 
            @click="more('node',$event,4)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>

        <div class="choose_sub">
            <span class="choose_title">题类：</span>
            <ul class="classUl">
                <!-- <li @click="choosed('type',item.id,index,$event, type_index === index)" 
                :class="setLiCSS('typeLi', type_index === index)" 
                v-for="(item,index) in typeData" 
                :key="index">{{item.title}}</li> -->
                <li
                :key="key"
                v-for="(value, key) in QUESTION_CLASS"
                :class="setLiCSS('classLi', String(class_index) === key)"
                @click="choosed('class', key, key, $event, String(class_index) === key)">{{value}}</li>
            </ul>
            <!-- <span class="choose_more" 
            :style="{ display: typeShow }" 
            @click="more('type',$event)">更多<i class="el-icon-arrow-down"></i></span> -->
            <div class="clear"></div>
        </div>

        <div class="choose_sub">
            <span class="choose_title">题型：</span>
            <ul class="typeUl">
                <li @click="choosed('type',item.id,index,$event, type_index === index)" 
                :class="setLiCSS('typeLi', type_index === index)" 
                v-for="(item,index) in typeData" 
                :key="index">{{item.title}}</li>
            </ul>
            <span class="choose_more" 
            :style="{ display: typeShow }" 
            @click="more('type',$event,5)">更多<i class="el-icon-arrow-down"></i></span>
            <div class="clear"></div>
        </div>
        <div class="choose_sub">
            <span class="choose_title">难度：</span>
            <ul class="difficultUl">
                <li @click="choosed('difficult',item.id,index,$event, difficult_index === index)" 
                :class="setLiCSS('difficultLi', difficult_index === index)" 
                v-for="(item,index) in difficultData" 
                :key="index">{{item.name}}</li>
            </ul>
            <!-- <span class="choose_more" 
            :style="{ display: difficultShow }" 
            @click="more('difficult',$event)">更多<i class="el-icon-arrow-down"></i></span> -->
            <div class="clear"></div>
        </div>

    </div>
</template>

<script>
import config from '@/config'

export default {
    data () {
        return {
            versionShow:'none',
            gradeShow:'none',
            sujectShow:'none',
            chapterShow:'none',
            nodeShow:'none',
            typeShow:'none',
            difficultShow:'none',

            versionHeight:'none',
            gradeHeight:'none',
            sujectHeight:'none',
            chapterHeight:'none',
            nodeHeight:'none',
            typeHeight:'none',
            difficultyHeight:'none',

            defaultIndexList: {
                'version_index':0,
                'grade_index':0,
                'suject_index':0,
                'chapter_index':0,
                'node_index': 0,            
                'class_index': 1,
                'type_index':0,
                'difficult_index': 0,
            },
            version_index:0,
            grade_index:0,
            suject_index:0,
            chapter_index:0,
            node_index: 0,            
            class_index: 1,
            type_index:0,
            difficult_index: 0,

            queryIndexList: [
                'version_index',
                'grade_index',
                'suject_index',
                'chapter_index',
                'node_index',
                'class_index',
                'type_index',
                'difficult_index',
            ],

            divWidth:0,
            //列表数据
            versionData:[],
            gradeData:[],
            sujectData:[],
            chapterData:[],
            nodeData:[],
            typeData:[],
            difficultData:[
                {
                    id:1,
                    name:"简单"
                },
                {
                    id:2,
                    name:"一般"
                },
                {
                    id:3,
                    name:"困难"
                }
            ],

            queryDataList: [
                'versionData',
                'gradeData',
                'sujectData',
                'chapterData',
                'nodeData',
                'typeData',
            ],
            //请求数据
            versions_id: null,
            grade_id: null,
            subject_id: null,
            chapter_id: null,
            type_id: null,
            node_id:  null,
            class_id: 1,
            difficult_id:  1,
            // easy_type:1,
            // book:1,

            // versions_id_first:'',
            // grade_id_first:'',
            // subject_id_first:'',
            // chapter_first:'',
            // node_first: '',
            // type_first:'',

            //是否是第一次进来
            flagCheck:true,
            
            QUESTION_CLASS: config.QUESTION_CLASS,
            
            versionFlag:true,
            gradeFlag:true,
            sujectFlag:true,
            nodeFlag:true,
            chapterFlag:true,
            typeFlag:true,

        }
    },
    mounted () {
        this.getVersions()
    },
    methods: {
        setLiCSS (baseClass, isSelect=false) {
            return isSelect ? `${baseClass} on` : baseClass
        },
        // 重置查询项
        resetQuery (startIndex=0) {
            let arr1, arr2;

            startIndex = parseInt(startIndex)
            arr1 = this.queryIndexList.slice(startIndex)
            arr1.forEach(key => {
                this[key] = this.defaultIndexList[key]
            })
            arr2 = this.queryDataList.slice(startIndex)
            arr2.forEach(key => {
                this[key] = []
            })
        },
        //选择所在年级和所在班级
        choosed(name, val, index, e, isSelect) {
            if (isSelect) {
                return
            }
            index = parseInt(index)
                            console.log(123, name, val)

            switch (name) {
                case 'version':
                    this.versions_id = val
                    //重置加载选中
                    this.version_index = index
                    this.resetQuery(1)
                    this.getClass()
                break
                case 'grade':
                    this.grade_id = val
                    //重置加载选中
                    this.grade_index = index
                    this.resetQuery(2)
                    //重置查询数据
                    this.getSubject()
                break
                case 'suject':
                    this.subject_id = val
                    //重置加载选中
                    this.suject_index = index
                    this.resetQuery(3)
                    //重置查询数据
                    this.getChapter()
                break
                case 'chapter':
                    this.chapter_id = val
                    //重置加载选中
                    this.chapter_index = index
                    this.resetQuery(4)
                    // //重置查询数据
                    this.getNodeData()
                break
                case 'node':
                    this.node_id = val
                    this.node_index = index
                    this.resetQuery(5)
                    this.getCategory()
                break
                case 'class':
                    this.class_id = val
                    this.class_index = index
                    this.resetQuery(6)
                    this.getCategory()
                break
                case 'type':
                    this.type_id = val
                    this.type_index = index
                    this.resetQuery(7)
                    this.change()
                break
                case 'difficult':
                    this.difficult_id = val
                    this.difficult_index = index
                    this.change()
                break
                default: alert('未知状态')
            }
        },
        //更多
        // more(message,e){
        //     //console.log(message);
        //     let flag = this[message + 'Flag']
        //     let height = this[message + 'Height']
        //     if(this[message + 'Flag']) {
        //         e.target.parentElement.style.height = this[message + 'Height'];
        //         e.target.innerHTML = '收起<i class="el-icon-arrow-up">';
        //         this[message + 'Flag'] = false;
        //     }else {
        //         e.target.parentElement.style.height = "36px";
        //         e.target.innerHTML = '更多<i class="el-icon-arrow-down">';
        //         this[message + 'Flag'] = true;
        //     }
        // },
        more(message, e,index) {
            // console.log('message',message);  
            let height = this[message + "Height"];
            if (this[message + "Flag"]) {
                document.querySelectorAll('.choose_more')[index].parentElement.style.height = this[message + "Height"];
                document.querySelectorAll('.choose_more')[index].innerHTML = '收起<i class="el-icon-arrow-up">';
                this[message + "Flag"] = false;
            } else {
                document.querySelectorAll('.choose_more')[index].parentElement.style.height = "36px";
                document.querySelectorAll('.choose_more')[index].innerHTML = '更多<i class="el-icon-arrow-down">';
                this[message + "Flag"] = true;
            }
        },

        //获取宽度
        getWidth(ul,li) {
            //年级
            var gradeUlWidth = document.querySelector(ul).clientWidth;
            let gradeLiWidth = 0
        	for(let i=0;i<document.querySelectorAll(li).length;i++) {
                gradeLiWidth = gradeLiWidth + document.querySelectorAll(li)[i].clientWidth
            }
            let number = Math.ceil(gradeLiWidth/gradeUlWidth)
            let height = Math.ceil(gradeLiWidth/gradeUlWidth)*32+'px'
            if(number > 1) {
                if(ul == ".versionUl") {
                    this.versionShow = 'block'
                    this.versionHeight = height
                }
                if(ul == ".gradeUl") {
                    this.gradeShow = 'block'
                    this.gradeHeight = height
                }
                if(ul == ".sujectUl") {
                    this.sujectShow = 'block'
                    this.sujectHeight = height
                }
                if(ul == ".chapterUl") {
                    this.chapterShow = 'block'
                    this.chapterHeight = height
                }
                if(ul == ".nodeUl") {
                    this.nodeShow = 'block'
                    this.nodeHeight = height
                }
                if(ul == ".typeUl") {
                    this.typeShow = 'block'
                    this.typeHeight = height
                }
                if(ul == ".difficultUl") {
                    this.difficultShow = 'block'
                    this.difficultyHeight = height
                }
            }
        },

        //获取版本
        getVersions() {
            this.versionData = []
            this.$nextTick(() => {
                this.$http.get('./Question/getVersions')
                .then(res=>{
                    this.versionData = res.data
                    this.$nextTick(function(){
                        this.getWidth('.versionUl','.versionLi')
                    });
                    //获取第一个id
                    // this.versions_id_first = this.versionData[0].id
                    //第一次进来请求
                    // if(this.flagCheck) {
                        this.versions_id = this.versionData[0].id
                        this.getClass()
                    // }
                })
            })
        },
        //获取年级
        getClass() {
            this.gradeData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getClass', {
                    token:localStorage.jxtoken,
                    versions_id:this.versions_id
                })
                .then(res=>{
                    // console.log(res);
                    this.gradeData = res.data
                    this.$nextTick(function(){
                        this.getWidth('.gradeUl','.gradeLi')
                    });
                    //获取第一个id
                    // this.grade_id_first = this.gradeData[0].id
                    //第一次进来请求
                    // if(this.flagCheck) {
                        this.grade_id = this.gradeData[0].id
                        this.getSubject()
                    // }
                })
            })
        },
        //获取科目
        getSubject() {
            this.sujectData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getSubject', {
                    token:localStorage.jxtoken,
                    versions_id:this.versions_id,
                    class_id:this.grade_id
                })
                .then(res=>{
                    // console.log(res);
                    this.sujectData = res.data
                    this.$nextTick(function(){
                        this.getWidth('.sujectUl','.sujectLi')
                    });
                    //获取第一个
                    // this.subject_id_first = this.sujectData[0].id
                    //第一次进来请求
                    // if(this.flagCheck) {
                        this.subject_id = this.sujectData[0].id
                        this.getChapter()
                    // }
                })
            })
        },
        //获取章
        getChapter() {
            this.chapterData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getChapter', {
                    token:localStorage.jxtoken,
                    versions_id:this.versions_id,
                    class_id:this.grade_id,
                    subject_id:this.subject_id,
                    // book:this.book
                })
                .then(res=>{
                    // console.log(res);
                    this.chapterData = res.data
                    this.$nextTick(function(){
                        this.getWidth('.chapterUl','.chapterLi')
                    });
                    //获取第一个
                    // this.chapter_first = this.chapterData[0].id
                    //第一次进入请求
                    // if(this.flagCheck) {
                        this.chapter_id = this.chapterData[0].id
                        this.getNodeData()
                    // }
                })
            })
        },
        // 获取节
        getNodeData () {
            this.nodeData = []
            this.$nextTick(() => {
                this.$http.post('/Question/getUnit', {
                    token: this.$tools.getToken(),
                    versions_id: this.versions_id,
                    class_id: this.grade_id,
                    subject_id: this.subject_id,
                    chapter_id: this.chapter_id,

                    // // 测试
                    // versions_id: this.versions_id,
                    // class_id: 201,
                    // subject_id: 2,
                    // chapter_id: 35,
                })
                .then(res=>{
                    // console.log(res);
                    this.nodeData = res.data
                    this.$nextTick(function(){
                        this.getWidth('.nodeUl','.nodeLi')
                    });
                    //获取第一个
                    // this.node_first = this.nodeData[0].id
                    //第一次进入请求
                    // if(this.flagCheck) {
                        this.node_id = this.nodeData[0].id
                        this.getCategory()
                    // }
                })
            })
        },
        //获题型
        getCategory() {
            this.typeData = []
            this.$nextTick(() => {
                this.$http.post('./Question/getCategory', {
                    token:localStorage.jxtoken,
                    versions_id:this.versions_id,
                    class_id:this.grade_id,
                    subject_id:this.subject_id,
                    type:this.class_id
                })
                .then(res=>{
                    // console.log(res);
                    this.typeData = res.data
                    this.type_id = this.typeData[0].id
                    //获取第一个id
                    this.$nextTick(function(){
                        this.getWidth('.typeUl','.typeLi')
                        //第一次进入
                        // if(this.flagCheck) {
                            this.change()
                            // this.flagCheck = false
                        // }  
                    })
                })
            })
        },

        change () {
            this.$emit('change', {
                versions_id:this.versions_id,
                grade_id:this.grade_id,
                subject_id:this.subject_id,
                chapter_id:this.chapter_id,
                type_id:this.type_id,
                node_id: this.node_id,
                difficult_id: this.difficult_id,
                // is_type: this.class_id,
            })
        }
    }
}
</script>

<style lang="less">
.choose {
    width: 100%;
    font-size: 13px;
    border:1px solid #ddd;
    border-radius: 4px;
    margin-top: 50px;
    padding-left: 13px;
    padding-right: 20px;
    .choose_sub {
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        border-bottom: 1px dashed #ddd;
        .choose_title,ul,ul>li {
            float: left;
        }
        .choose_title {
            display: block;
            width: 70px;
            text-align: right;
            margin-right:48px;
        }
        ul { 
            width:70%;
            height: 36px;
            li {
                height: 24px;
                line-height: 24px;
                margin-top:6px;
                padding:0 12px;
                box-sizing: border-box;
                text-align: center;
                cursor: pointer;
                .el-icon-close {
                    margin-left: 10px;
                    visibility: hidden;
                }
            }
        }
        .choose_more {
            float:right;
            font-size: 12px;
            cursor: default;
            cursor: pointer;
        }
        .clear {
            clear: both;
        }
    }
    .choose_last {
        border-bottom: none;
    }
    .on {
        background:#41cac0;
        color: #fff;
        border-radius: 4px;
    }
}
</style>
