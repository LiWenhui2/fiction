const db = require('../config/db')
//查询
const findUser = (table, fieldName, fieldValue) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from ${table} where ${fieldName} = ?`
        db.query(sql, [fieldValue], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
// 插入
const insertUser = (table, insertContent) => {
    return new Promise((resolve, reject) => {
        const sql = `insert into ${table} set ?`
        db.query(sql, [insertContent], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
// 更新
const updateUser = (table, updateContent, fieldName, fieldValue) => {
    return new Promise((resolve, reject) => {
        const sql = `update ${table} set ? where ${fieldName} = ?`
        db.query(sql, [updateContent, fieldValue], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
module.exports = {
    findUser,
    insertUser,
    updateUser
}