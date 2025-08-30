const express = require('express')
const expressJoi = require('@escook/express-joi')
const {
    getArea,
    getFloor,
    getRoom,
    addRoom,
    getRoomInfo,
    deleteRoom,
    disableRoom,
    enableRoom, editRoom, setRoomRule, getRoomRule
} = require("../controllers/roomCtrl");
const {deleteRoomRule, editRoomRule} = require("../middlewares/validate");
const router = express.Router()
//获取区域列表
router.get('/getArea', getArea)
//获取区域楼层列表
router.get('/getFloor', getFloor)
//获取楼层自习室列表
router.get('/getRoom', getRoom)
//获取自习室全部信息
router.get('/getRoomInfo', getRoomInfo)
//添加自习室
router.post('/addRoom', addRoom)
//删除自习室
router.post('/deleteRoom', expressJoi(deleteRoomRule), deleteRoom)
//禁用自习室
router.post('/disableRoom', expressJoi(deleteRoomRule), disableRoom)
//启用自习室
router.post('/enableRoom', expressJoi(deleteRoomRule), enableRoom)
//编辑自习室信息
router.post('/editRoom', expressJoi(editRoomRule), editRoom)
//自习室规则配置
router.post('/setRoomRule', setRoomRule)
//获取自习室规则
router.get('/getRoomRule', getRoomRule)
module.exports = router