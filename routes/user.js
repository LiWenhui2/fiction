const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/userCtrl')
const {
    stu_loginRule,
    stu_registerRule,
    admin_loginRule,
    admin_registerRule,
    resetPwdRule, updateStuInfoRule
} = require('../middlewares/validate')
const expressJoi = require('@escook/express-joi')
const upload = require("../utils/upload");
//学生登录api
router.post('/stu_login', expressJoi(stu_loginRule), userCtrl.stu_login)
//学生注册api
router.post('/stu_register', expressJoi(stu_registerRule), userCtrl.stu_register)
//管理员登录
router.post('/admin_login', expressJoi(admin_loginRule), userCtrl.admin_login)
//管理员注册
router.post('/admin_register', expressJoi(admin_registerRule), userCtrl.admin_register)
//重置密码
router.post('/resetPwd', expressJoi(resetPwdRule), userCtrl.resetPwd)
//获取学生信息
router.get('/getStuInfo', userCtrl.getStuInfo)
//获取管理员信息
router.get('/getAdminInfo', userCtrl.getAdminInfo)
//更新学生信息
router.post('/updateStuInfo', expressJoi(updateStuInfoRule), userCtrl.updateStuInfo)
//上传头像
router.post('/uploadAvatar', upload.single('avatar'), userCtrl.uploadAvatar)
//获取用户协议
router.get('/getAgreement',userCtrl.getAgreement)
module.exports = router