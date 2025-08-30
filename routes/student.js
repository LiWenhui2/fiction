const express = require('express')
const {getStuAllInfo, disableStudent, enableStudent, deleteStudent} = require("../controllers/studentCtrl");
const router = express.Router()
//管理员获取全部学生信息
router.get('/getAllStuInfo', getStuAllInfo)
module.exports = router
//禁用学生账号
router.post('/disableStu', disableStudent)
//启用学生账号
router.post('/enableStu', enableStudent)
//删除学生账号
router.delete('/deleteStu', deleteStudent)
