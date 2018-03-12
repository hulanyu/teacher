export default {
  // BASEURL: 'http://edu.dev.jxjt.me',
  BASEURL: window.req_api, //数据来源static/config.js
  IMGURL: "http://image.jxjt.me", //试题图片url
  // 考试科目-类型
  EXAM_STATUS: {
    "0": "未启动",
    "1": "等待分配任务",
    "2": "等待阅卷",
    "3": "阅卷中",
    "4": "成绩补录中",
    "5": "完成"
  },
  // 教师权限分类
  POWER_MAP: {
    "1": "阅卷教师",
    "2": "仲裁教师"
  },
  // 试题-题类
  QUESTION_CLASS: {
    "2": "主观题",
    "1": "客观题"
  },
  QUESTION_CLASS_1: "1",
  QUESTION_CLASS_2: "2",
  // 考试管理-科目列表-生成答题卡-试题样式列表
  PSTYLELIST: {
    "1": "A4",
    "2": "A3双栏",
    "3": "A3三栏"
  },
  // 生成答题卡
  // 1,粘贴二维码，0,生成二维码
  QRCODE_TYPE1: 1,
  QRCODE_TYPE0: 0
};
