const express = require('express')
const {
    reserve,
    getStuReserve,
    stuCheckIn,
    stuCheckOut,
    getStuHistory,
    cancelReserve, getReserve
} = require("../controllers/reserveCtrl");
const router = express.Router()
//学生预约
router.post('/stuReserve', reserve)
module.exports = router
//学生获取当前预约信息
router.get('/getStuReserve', getStuReserve)
//学生签到
router.patch('/:user_id/checkin', stuCheckIn)
//学生签退
router.patch('/:user_id/checkout', stuCheckOut)
//学生获取全部历史预约信息
router.get('/getStuHistory', getStuHistory)
//取消预约
router.patch('/:user_id/cancel', cancelReserve)
//获取全部预约消息
router.get('/getReserve', getReserve)