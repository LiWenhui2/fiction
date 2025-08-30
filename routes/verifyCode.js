const express = require('express')
const router = express.Router()
const verifyCodeCtrl = require('../controllers/verifyCodeCtrl')
const {sendCodeRule, checkCodeRule} = require('../middlewares/validate')
const expressJoi = require('@escook/express-joi')
//发送验证码
router.post('/sendCode', expressJoi(sendCodeRule), verifyCodeCtrl.sendCode)
//校验验证码
router.post('/verifyCode', expressJoi(checkCodeRule), verifyCodeCtrl.verifyCode)
module.exports = router