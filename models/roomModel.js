const db = require('../config/db')

//查询area表
const selectInfo = (fieldName, condition) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT ${fieldName} FROM area WHERE ${condition}`
        db.query(sql, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

//插入area表
const insertArea = (insertContent) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO area SET ?'
        db.query(sql, [insertContent], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//批量删除自习室
const deleteRooms = (ids) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM area WHERE id IN (${ids.map(()=>'?').join(',')})`
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//批量禁用/启用自习室
const disableRooms = (ids, enable) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE area SET enable=${enable} WHERE id IN (${ids.map(()=>'?').join(',')})`
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//编辑自习室信息
const editRooms = (ids, updateContent) => {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(updateContent)
        const values = Object.values(updateContent)
        const setClause = keys.map(key => `${key} = ?`).join(', ')
        const sql = `UPDATE area SET ${setClause} WHERE id IN (${ids.map(()=>'?').join(',')})`

        db.query(sql, [...values, ...ids], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//更新座位数
const updateSeatCount = (room, count) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE area SET seatCount=seatCount+${count} WHERE room='${room}'`
        db.query(sql, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
module.exports = {
    selectInfo,
    insertArea,
    deleteRooms,
    disableRooms,
    editRooms,
    updateSeatCount
}