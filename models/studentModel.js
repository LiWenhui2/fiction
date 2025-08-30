const db = require('../config/db')
//获取学生信息
module.exports.adminGetStuInfo = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user`
        db.query(sql, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//禁用学生账号
module.exports.disableStuAccounts = (ids) => {
    return new Promise((resolve, reject) => {
        const placeholders = ids.map(() => '?').join(', ')
        const sql = `UPDATE user SET status = 1 WHERE id IN (${placeholders})`
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//启用学生账号
module.exports.enableStuAccounts = (ids) => {
    return new Promise((resolve, reject) => {
        const placeholders = ids.map(() => '?').join(', ')
        const sql = `UPDATE user SET status = 0 WHERE id IN (${placeholders})`
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//删除学生账号
module.exports.deleteStuAccounts = (ids) => {
    return new Promise((resolve, reject) => {
        const placeholders = ids.map(() => '?').join(', ')
        const sql = `DELETE FROM user WHERE id IN (${placeholders})`
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}