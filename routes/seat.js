const express = require('express')
const {
    getSeatInfo,
    addSeat,
    editSeat,
    disableSeat,
    enableSeat,
    deleteSeat,
    getSeatInfoByCell
} = require("../controllers/seatCtrl");
const router = express.Router()


//获取座位信息
router.get('/getSeatInfo', getSeatInfo)
//用户点击单元格获取座位信息
router.get('/getSeatInfoByCell', getSeatInfoByCell)
//新增座位
router.post('/addSeat', addSeat)
//编辑座位信息
router.post('/editSeat', editSeat)
//禁用座位
router.post('/disableSeat', disableSeat)
//启用座位
router.post('/enableSeat', enableSeat)
//删除座位
router.post('/deleteSeat', deleteSeat)
module.exports = router