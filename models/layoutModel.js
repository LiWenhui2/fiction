const db = require('../config/db')
//初始化插入数据
const insertLayout = (values) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO layout (room, \`row\`, \`col\`) VALUES ?`
        db.query(sql, values, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//查询布局信息
const queryLayoutInfo = (room) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM layout WHERE room= ?`
        db.query(sql, [room], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//删除布局
const delLayout = (room) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM layout WHERE room= ?`
        db.query(sql, [room], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//更新布局
const updateLayout = (room, row, col, type, label, bg_img) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE layout SET type= ?, label= ? ,bg_img=? WHERE room= ? AND \`row\`= ? AND \`col\`= ?`
        db.query(sql, [type, label, bg_img, room, row, col], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
module.exports = {
    insertLayout,
    queryLayoutInfo,
    delLayout,
    updateLayout
}