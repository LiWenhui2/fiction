const db = require('../config/db')
//添加公告内容
module.exports.publish = (title, content) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO announcement (title, content)
                     VALUES (?, ?)`;
        db.query(sql, [title, content], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    })
}
//获取公告时间
module.exports.getAnnouncementTime = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM announcement
                     WHERE id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}
//删除公告
module.exports.deleteAnnounce = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE
                     FROM announcement
                     WHERE id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    })
}
//获取所有公告
module.exports.getAllAnnouncements = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM announcement
                     ORDER BY create_time DESC`;
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    })
}