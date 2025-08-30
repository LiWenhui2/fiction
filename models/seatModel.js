//查询座位表
const db = require("../config/db");
const querySeatInfo = (condition) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM seat WHERE ${condition}`
        db.query(sql, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//查询座位布局表
const querySeatLayout = (room, row, col) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM layout WHERE room = ? AND \`row\`= ? AND \`col\`= ?`
        console.log(sql)
        db.query(sql, [room, row, col], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

//插入座位
const insertSeats = (seatsArray) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(seatsArray) || seatsArray.length === 0) {
            return reject(new Error('无座位数据可插入'))
        }
        const sql = 'INSERT INTO seat (room, seat,enable) VALUES ?'
        const values = seatsArray.map(seat => [seat.room, seat.seat, seat.enable])
        db.query(sql, [values], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//更新座位信息
const updateSeatInfo = (ids, updateContent) => {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(updateContent)
        const values = Object.values(updateContent)
        const setClause = keys.map(key => `${key} = ?`).join(', ')
        const sql = `UPDATE seat SET ${setClause} WHERE id IN (${ids.map(()=>'?').join(',')})`
        db.query(sql, [...values, ...ids], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//批量删除座位
const deleteSeat = (ids) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM seat WHERE id IN (${ids.map(()=>'?').join(',')})`
        console.log(sql)
        db.query(sql, ids, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//查询座位房间映射
const getSeatRoomMapping = (ids) => {
    return new Promise((resolve, reject) => {
        const placeholders = ids.map(() => '?').join(', ')
        const sql = `SELECT id, room FROM seat WHERE id IN (${placeholders})`

        db.query(sql, ids, (err, results) => {
            if (err) return reject(err)
            resolve(results) // 返回格式: [{ id: 1, room: 'A101' }, ...]
        })
    })
}

module.exports = {
    querySeatInfo,
    insertSeats,
    updateSeatInfo,
    deleteSeat,
    getSeatRoomMapping,
    querySeatLayout
}