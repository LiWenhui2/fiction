const moment = require('moment-timezone')
const {publish, deleteAnnounce, getAnnouncementTime, getAllAnnouncements} = require("../models/announcementModel");
//发布公告
module.exports.publishAnnouncement = async (req, res) => {
    console.log(req.body)
    const {title, content} = req.body;
    if (!title || !content) {
        return res.cc('标题或内容不能为空');
    }
    const result = await publish(title, content);
    console.log(result)
    if (result.affectedRows === 0) {
        return res.cc('公告发布失败，请稍后再试');
    }
    const announcementTime = await getAnnouncementTime(result.insertId);
    res.send({
        status: 0,
        message: '公告发布成功',
        data: {
            title,
            content,
            publish_time: announcementTime[0].create_time
                ? moment(announcementTime[0].create_time).tz('Asia/Shanghai').format('YYYY-M-D HH:mm:ss')
                : null
        }
    })
}
//删除公告
module.exports.deleteAnnouncement = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.cc('参数错误！');
    }
    const result = await deleteAnnounce(id);
    if (result.affectedRows === 0) {
        return res.cc('公告删除失败，请稍后再试');
    }
    res.send({
        status: 0,
        message: '公告删除成功'
    });
}
//获取公告内容
module.exports.getAnnouncement = async (req, res) => {
    try {
        const result = await getAllAnnouncements();
        if (result.length === 0) {
            return res.cc('暂无公告');
        }
        const announcements = result.map(announce => ({
            id: announce.id,
            title: announce.title,
            content: announce.content,
            publish_time: announce.create_time
                ? moment(announce.create_time).tz('Asia/Shanghai').format('YYYY-M-D HH:mm:ss')
                : null
        }));
        res.send({
            status: 0,
            message: '获取公告成功',
            data: announcements
        });
    } catch (error) {
        res.cc(error);
    }
}