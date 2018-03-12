import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main/Main'
const Login = resolve => require(['@/pages/Login/'],resolve)  //登录
import ForgetPassword from '@/pages/ForgetPassword/'  //登录
import Home from '@/pages/Home/'
import Test from '@/pages/Test/'

//驼峰转连接
let setString = function(s) {
  let n = s.indexOf(':')
  if (n !== -1) {
    --n
    s = s.substring(0, n)
  }
  let sArr = s.split('-')
  for (let i = 0, size = sArr.length; i < size; ++i) {
    sArr[i] = sArr[i][0].toUpperCase() + sArr[i].substring(1)
  }
  return sArr.join('')
}

function setRouter (list) {
  let arr = []
  for (let item of list) {
    const keys = Object.keys(item)
    let obj = {}
    for (let key of keys) {
      if (key !== 'name') {
        obj[key] = item[key]
      }
    }
    if (item['path']) {
      obj['name'] = setString(item['path'])
    }
    arr.push(obj)
  }
  return arr
}

//NotFound
const NotFound = resolve => require(['@/pages/NotFound/'],resolve)   //试卷管理
const White = resolve => require(['@/pages/NotFound/White'],resolve)   //试卷管理
//财务管理
const MoneyManagerUseLog = resolve => require(['@/pages/MoneyManager/UseLog'],resolve) // 消费记录
const MoneyManagerMoney = resolve => require(['@/pages/MoneyManager/Money'],resolve) // 充值退款
const MoneyManagerChart = resolve => require(['@/pages/MoneyManager/Chart'],resolve) // 财务报表
const MonitorData = resolve => require(['@/pages/MonitorData/'],resolve) //监控数据管理

//试卷管理
const Papers = resolve => require(['@/pages/Papers/'],resolve)   //试卷管理
const PapersAdd = resolve => require(['@/pages/Papers/PapersAdd'],resolve)   //添加试题
const PapersCreate = resolve => require(['@/pages/Papers/PapersCreate'],resolve)   //生成试卷
// 试题管理
const QuestionSystem = resolve => require(['@/pages/Question/System'], resolve) // 系统题库
const QuestionSchool = resolve => require(['@/pages/Question/School'], resolve) // 学校题库
const QuestionGrade = resolve => require(['@/pages/Question/Grade'], resolve) // 年级题库
const QuestionTeacher = resolve => require(['@/pages/Question/Teacher'], resolve) // 教师题库
const QuestionCreate = resolve => require(['@/pages/Question/Create'], resolve) // 添加题库
const QuestionAlter = resolve => require(['@/pages/Question/Alter'], resolve) // 修改试题

//资产管理
const AssetManage = resolve => require(['@/pages/AssetManage/'], resolve) // 教师题库
// 考试管理
const ExamineTeacherWorkloadQuery = resolve => require(['@/pages/Examine/TeacherWorkloadQuery'], resolve) // 教师工作量查询
const ExamineQueryChart = resolve => require(['@/pages/Examine/QueryChart'], resolve) // 教师工作量查询图标
const ExamineRead = resolve => require(['@/pages/Examine/Read'], resolve) // 阅卷任务 全部
const ExamineReadDetail = resolve => require(['@/pages/Examine/ReadDetail'], resolve) // 阅卷任务详情
const ExamineExamineList = resolve => require(['@/pages/Examine/ExamineList/List'], resolve) // 考试列表
const ExamineListCreate = resolve => require(['@/pages/Examine/ExamineList/CreateSubject'], resolve) // 考试列表-新建考试任务
const ExamineEditorSubject = resolve => require(['@/pages/Examine/ExamineList/EditorSubject'], resolve) // 考试列表-修改
const ExamineReadSubject = resolve => require(['@/pages/Examine/ExamineList/ReadSubject'], resolve) // 考试列表-查看
const ExamineSubjectList = resolve => require(['@/pages/Examine/SubjectList/List'], resolve) // 科目列表
const ExamineSubjectCreate = resolve => require(['@/pages/Examine/SubjectList/Create'], resolve) // 科目列表-创建
const ExamineSupply = resolve => require(['@/pages/Examine/SubjectList/Supply'], resolve) // 科目列表-成绩补录
const ExamineSubjectDetail = resolve => require(['@/pages/Examine/SubjectList/Detail'], resolve) // 科目列表-查看
const ExamineSubjectEditor = resolve => require(['@/pages/Examine/SubjectList/Editor'], resolve) // 科目列表-修改
const ExamineSubjectReadTask = resolve => require(['@/pages/Examine/SubjectList/ReadTask'], resolve) // 科目列表-查看分配任务
const ExamineReadScoreList = resolve => require(['@/pages/Examine/SubjectList/ReadScoreList'], resolve) // 科目列表-查看成绩
const ExamineErrorList = resolve => require(['@/pages/Examine/SubjectList/ErrorList'], resolve) // 科目列表-查看错题 
const ExamineErrorChart = resolve => require(['@/pages/Examine/SubjectList/ErrorChart'], resolve) // 科目列表-查看错题图表
const ExamineTeacherTask = resolve => require(['@/pages/Examine/SubjectList/TeacherTask'], resolve) // 科目列表-分配任务
//教务管理
const TeachingManageItem = resolve => require(['@/pages/TeachingManage/TeachingManageItem'], resolve) // 考试列表
const TeachingManageLists = resolve => require(['@/pages/TeachingManage/TeachingManageLists'], resolve) // 教学科目列表
const TeachingManageTasking = resolve => require(['@/pages/TeachingManage/TeachingManageTasking'], resolve) // 教学任务分配
const TeachingManageProgress = resolve => require(['@/pages/TeachingManage/TeachingManageProgress'], resolve) // 教学进度管理
const TeachingManageCourseware = resolve => require(['@/pages/TeachingManage/TeachingManageCourseware'], resolve) // 课件

//排课管理
const CourseManageRecord = resolve => require(['@/pages/CourseManage/CourseManageRecord'], resolve) // 排课列表
const CourseManageRecordAdd = resolve => require(['@/pages/CourseManage/CourseManageRecordAdd'], resolve) // 排课列表-新增
const CourseManageRecordDetail = resolve => require(['@/pages/CourseManage/CourseManageRecordDetail'], resolve) // 排课列表-详情
const CourseManageTimeRecord = resolve => require(['@/pages/CourseManage/CourseManageTimeRecord'], resolve) // 排课列表-详情
//课表
const Schedule = resolve => require(['@/pages/Schedule/Schedule'], resolve) // 考试列表
//终端管理
const TerminalManageConsumption = resolve => require(['@/pages/TerminalManage/TerminalManageConsumption'], resolve) // 消费终端
const TerminalManageAttendance = resolve => require(['@/pages/TerminalManage/TerminalManageAttendance'], resolve) // 考勤终端

//校园信息管理
const TeachingStaffManage = resolve =>require(['@/pages/CampusInforManage/TeachingStaffManage'],resolve) //教职工管理
const GradeManage = resolve =>require(['@/pages/CampusInforManage/GradeManage'],resolve) //年级管理
const ClassManage = resolve =>require(['@/pages/CampusInforManage/ClassManage'],resolve) //班级管理
const StudentManage = resolve =>require(['@/pages/CampusInforManage/StudentManage'],resolve) //学生管理
const DepartmentManage = resolve =>require(['@/pages/CampusInforManage/DepartmentManage'],resolve) //科室管理
const ClasstimeManage = resolve =>require(['@/pages/CampusInforManage/ClasstimeManage'],resolve) //上课时间管理

//宿舍管理
const LogisticsManageDormitory = resolve =>require(['@/pages/LogisticsManage/LogisticsManageDormitory'],resolve) //宿舍管理
const LogisticsManageAttend = resolve =>require(['@/pages/LogisticsManage/LogisticsManageAttend'],resolve) //学生宿舍考勤配置
const LogisticsManageRecordS = resolve =>require(['@/pages/LogisticsManage/LogisticsManageRecordS'],resolve) //学生考勤记录
const LogisticsManageRecordT = resolve =>require(['@/pages/LogisticsManage/LogisticsManageRecordT'],resolve) //教师考勤记录
const LogisticsManageAttendT = resolve =>require(['@/pages/LogisticsManage/LogisticsManageAttendT'],resolve) //教师考勤规则

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: setRouter([
        { path: '', redirect: { name: 'Home' } },
        { name: 'Home', path: 'home', component:Home },
        { name: 'Test', path: 'test', component:Test },
        // 财务管理
        { path: 'moneymanager-uselog', component: MoneyManagerUseLog}, // 消费记录
        { path: 'moneymanager-money', component: MoneyManagerMoney}, // 充值退款
        { path: 'moneymanager-chart', component: MoneyManagerChart}, // 财务表报
        // 监控管理
        { path: 'monitor-data', component: MonitorData}, //监控数据管理
        
        //试卷管理
        { path: 'papers/:type', component: Papers}, //试卷管理
        { path: 'papers-add', component: PapersAdd}, //添加试题
        { path: 'papers-create', component: PapersCreate}, //添加试题
        //试题管理
        { path: 'questions-system', component: QuestionSystem},
        { path: 'questions-school', component: QuestionSchool},
        { path: 'questions-grade', component: QuestionGrade},
        { path: 'questions-teacher', component: QuestionTeacher},
        { path: 'questions-create/:type', component: QuestionCreate},
        { path: 'questions-alter/:type/:id', component: QuestionAlter},
        //资产管理
        { path: 'asset-manage', component: AssetManage},
        // 考试管理
        { path: 'examine-teacher-workload-query', component: ExamineTeacherWorkloadQuery},
        { path: 'examine-query-chart/:subject_id', component: ExamineQueryChart},
        { path: 'examine-read', component: ExamineRead}, // 全部
        { path: 'examine-read-item/:id', component: ExamineRead}, // 单个
        { path: 'examine-read-detail/:id', component: ExamineReadDetail},
        { path: 'examine-examine-list', component: ExamineExamineList},
        { path: 'examine-list-create', component: ExamineListCreate},
        { path: 'examine-editorsubject/:id', component: ExamineEditorSubject},
        { path: 'examine-readsubject/:id', component: ExamineReadSubject},
        { path: 'examine-subject-list/:id', component: ExamineSubjectList},
        { path: 'examine-subject-create/:project_id/:subject_id', component: ExamineSubjectCreate},
        { path: 'examine-supply/:subject_id', component: ExamineSupply},
        { path: 'examine-subject-detail/:project_id/:subject_id', component: ExamineSubjectDetail},
        { path: 'examine-subject-editor/:project_id/:subject_id', component: ExamineSubjectEditor},
        { path: 'examine-subject-read-task/:project_id/:subject_id', component: ExamineSubjectReadTask},
        { path: 'examine-read-score-list/:subject_id/:title', component: ExamineReadScoreList},
        { path: 'examine-error-list/:subject_id/:title', component: ExamineErrorList},
        { path: 'examine-error-chart/:subject_id/:title', component: ExamineErrorChart},
        { path: 'examine-teacher-task/:project_id/:subject_id', component: ExamineTeacherTask},
        //教务管理
        { path: 'teaching-manage-item', component: TeachingManageItem},
        { path: 'teaching-manage-lists', component: TeachingManageLists},
        { path: 'teaching-manage-tasking', component: TeachingManageTasking},
        { path: 'teaching-manage-progress', component: TeachingManageProgress},
        { path: 'teaching-manage-courseware', component: TeachingManageCourseware},
        //排课管理
        { path: 'course-manage-record', component: CourseManageRecord},
        { path: 'course-manage-record-add', component: CourseManageRecordAdd},
        { path: 'course-manage-record-detail', component: CourseManageRecordDetail},
        { path: 'course-manage-time-record', component: CourseManageTimeRecord},
        
        //课表
        { path: 'schedule', component: Schedule},
        //终端管理
        { path: 'terminal-manage-consumption', component: TerminalManageConsumption},
        { path: 'terminal-manage-attendance', component: TerminalManageAttendance},
        
        //校园信息管理
        { path: 'teaching-staff-manage', component: TeachingStaffManage},
        { path: 'grade-manage', component: GradeManage},
        { path: 'class-manage', component: ClassManage},
        { path: 'student-manage', component: StudentManage},
        { path: 'department-manage', component: DepartmentManage},
        { path: 'classtime-manage', component: ClasstimeManage},

        //宿舍管理
        { path: 'logistics-manage-dormitory', component: LogisticsManageDormitory},
        { path: 'logistics-manage-attend', component: LogisticsManageAttend},
        { path: 'logistics-manage-record-s', component: LogisticsManageRecordS},
        { path: 'logistics-manage-record-t', component: LogisticsManageRecordT},
        { path: 'logistics-manage-attend-t', component: LogisticsManageAttendT},

        { path: 'white', component: White},

      ]),
      //内容页面
      // children: [
      //   { path: '', redirect: { name: 'Home' } },
      //   { name: 'Home', path: 'home', component:Home },
      //   { name: 'Test', path: 'test', component:Test },
      //   // 财务管理
      //   { name: 'MoneymanagerUselog', path: 'moneymanager-uselog', component: MoneyManagerUseLog}, // 消费记录
      //   { name: 'MoneyManagerMoney', path: 'moneymanager-money', component: MoneyManagerMoney}, // 充值退款
      //   { name: 'MoneyManagerChart', path: 'moneymanager-chart', component: MoneyManagerChart}, // 财务表报
      //   // 监控管理
      //   { name: 'MonitorData', path: 'monitor-data', component: MonitorData}, //监控数据管理
      //   //试卷管理
      //   { name: 'Papers', path: setString('Papers')+'/:type', component: Papers}, //试卷管理
      //   { name: 'PapersAdd', path: setString('PapersAdd'), component: PapersAdd}, //添加试题
      //   { name: 'PapersCreate', path: setString('PapersCreate'), component: PapersCreate}, //添加试题
      //   //试题管理
      //   { name: 'QuestionSystem', path: setString('QuestionSystem'), component: QuestionSystem},
      //   { name: 'QuestionSchool', path: setString('QuestionSchool'), component: QuestionSchool},
      //   { name: 'QuestionGrade', path: setString('QuestionGrade'), component: QuestionGrade},
      //   { name: 'QuestionTeacher', path: setString('QuestionTeacher'), component: QuestionTeacher},
      //   { name: 'QuestionCreate', path: setString('QuestionCreate'), component: QuestionCreate},
      //   //资产管理
      //   { name: 'AssetManage', path: setString('AssetManage'), component: AssetManage},
      //   // 考试管理
      //   { name: 'ExamineTeacherWorkloadQuery', path: setString('ExamineTeacherWorkloadQuery'), component: ExamineTeacherWorkloadQuery},
      //   { name: 'ExamineQueryChart', path: setString('ExamineQueryChart')+'/:id', component: ExamineQueryChart},
      //   { name: 'ExamineRead', path: setString('ExamineRead'), component: ExamineRead}, // 全部
      //   { name: 'ExamineReadItem', path: setString('ExamineReadItem')+'/:id', component: ExamineRead}, // 单个
      //   { name: 'ExamineReadDetail', path: setString('ExamineReadDetail')+'/:id', component: ExamineReadDetail},
      //   { name: 'ExamineExamineList', path: setString('ExamineExamineList'), component: ExamineExamineList},
      //   { name: 'ExamineListCreate', path: setString('ExamineListCreate'), component: ExamineListCreate},
      //   { name: 'ExamineEditorsubject', path: setString('ExamineEditorsubject')+'/:id', component: ExamineEditorsubject},
      //   { name: 'ExamineReadsubject', path: setString('ExamineReadsubject')+'/:id', component: ExamineReadsubject},
      //   { name: 'ExamineSubjectList', path: setString('ExamineSubjectList')+'/:id', component: ExamineSubjectList},
      //   { name: 'ExamineSubjectCreate', path: setString('ExamineSubjectCreate'), component: ExamineSubjectCreate},
      //   { name: 'ExamineSupply', path: setString('ExamineSupply'), component: ExamineSupply},
      //   { name: 'ExamineSubjectDetail', path: setString('ExamineSubjectDetail')+'/:id', component: ExamineSubjectDetail},
      //   { name: 'ExamineSubjectEditor', path: setString('ExamineSubjectEditor')+'/:id', component: ExamineSubjectEditor},
      //   { name: 'ExamineSubjectReadTask', path: setString('ExamineSubjectReadTask')+'/:id', component: ExamineSubjectReadTask},
      //   { name: 'ExamineReadScoreList', path: setString('ExamineReadScoreList')+'/:id', component: ExamineReadScoreList},
      //   { name: 'ExamineErrorList', path: setString('ExamineErrorList')+'/:id', component: ExamineErrorList},
      //   { name: 'ExamineErrorChart', path: setString('ExamineErrorChart')+'/:id', component: ExamineErrorChart},
      //   { name: 'ExamineTeacherTask', path: setString('ExamineTeacherTask')+'/:id', component: ExamineTeacherTask},
      //   //教务管理
      //   { name: 'TeachingManageItem', path: setString('TeachingManageItem'), component: TeachingManageItem},
      //   { name: 'TeachingManageLists', path: setString('TeachingManageLists'), component: TeachingManageLists},
      //   { name: 'TeachingManageTasking', path: setString('TeachingManageTasking'), component: TeachingManageTasking},
      //   { name: 'TeachingManageProgress', path: setString('TeachingManageProgress'), component: TeachingManageProgress},
      //   { name: 'TeachingManageCourseware', path: setString('TeachingManageCourseware'), component: TeachingManageCourseware},
      //   //排课管理
      //   { name: 'CourseManageRecord', path: setString('CourseManageRecord'), component: CourseManageRecord},
      //   { name: 'CourseManageRecordAdd', path: setString('CourseManageRecordAdd'), component: CourseManageRecordAdd},
      //   { name: 'CourseManageRecordDetail', path: setString('CourseManageRecordDetail'), component: CourseManageRecordDetail},
      //   { name: 'CourseManageTimeRecord', path: setString('CourseManageTimeRecord'), component: CourseManageTimeRecord},
        
      //   //课表
      //   { name: 'Schedule', path: setString('Schedule'), component: Schedule},
      //   //终端管理
      //   { name: 'TerminalManageConsumption', path: setString('TerminalManageConsumption'), component: TerminalManageConsumption},
      //   { name: 'TerminalManageAttendance', path: setString('TerminalManageAttendance'), component: TerminalManageAttendance},
        
      //   //校园信息管理
      //   { name: 'TeachingStaffManage', path: setString('TeachingStaffManage'), component: TeachingStaffManage},
      //   { name: 'GradeManage', path: setString('GradeManage'), component: GradeManage},
      //   { name: 'ClassManage', path: setString('ClassManage'), component: ClassManage},
      //   { name: 'StudentManage', path: setString('StudentManage'), component: StudentManage},
      //   { name: 'DepartmentManage', path: setString('DepartmentManage'), component: DepartmentManage},
      //   { name: 'ClasstimeManage', path: setString('ClasstimeManage'), component: ClasstimeManage},

      //   //宿舍管理
      //   { name: 'LogisticsManageDormitory', path: setString('LogisticsManageDormitory'), component: LogisticsManageDormitory},
      //   { name: 'LogisticsManageAttend', path: setString('LogisticsManageAttend'), component: LogisticsManageAttend},
      //   { name: 'LogisticsManageRecordS', path: setString('LogisticsManageRecordS'), component: LogisticsManageRecordS},
      //   { name: 'LogisticsManageRecordT', path: setString('LogisticsManageRecordT'), component: LogisticsManageRecordT},
      // ]
    },
    //登录页面
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    //忘记密码
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      component: ForgetPassword,
    },
    //NotFound
    { path: '*', component: NotFound }
  ]
})
