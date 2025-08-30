const express = require('express')
const {publishAnnouncement, deleteAnnouncement, getAnnouncement} = require("../controllers/announcementCtrl");
const router = express.Router()
// 发布公告
router.post('/publish', publishAnnouncement)
// 删除公告
router.delete('/delete/:id', deleteAnnouncement)
// 获取公告内容
router.get('/getAnnouncement', getAnnouncement)
module.exports = router