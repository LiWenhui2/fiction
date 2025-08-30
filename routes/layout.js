const express = require('express')
const {initLayout, getLayout, deleteLayout, updateLayout} = require("../controllers/layoutCtrl");
const router = express.Router()
//管理员新建布局初始化接口
router.post('/initLayout', initLayout)
//获取布局信息
router.get('/getLayout', getLayout)
//删除布局
router.post('/deleteLayout', deleteLayout)
//更新布局
router.post('/updateLayout', updateLayout)
module.exports = router