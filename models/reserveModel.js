const db = require('../config/db')
//添加预约记录
module.exports.addReservation = (reserveInfo) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO reservation (user_id, seat_id, date, start_time_id, end_time_id, status)
                     VALUES (?, ?, ?, ?, ?, ?)`
        db.query(sql, reserveInfo, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//判断是否有时间冲突
module.exports.checkTimeConflict = (seat_id, date, startTimeId, endTimeId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservation
                     WHERE seat_id = ?
                       AND date = ?
                       AND status IN (0
                         , 1
                         , 2)
                       AND (start_time_id
                         < ?
                        OR end_time_id
                         > ?)`;
        db.query(sql, [seat_id, date, endTimeId, startTimeId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//查询预约记录
module.exports.queryUserReserve = (user_id, statuses) => {
    return new Promise((resolve, reject) => {
        const statusPlaceholders = statuses.map(() => '?').join(', ')
        const sql = `SELECT *
                     FROM reservation
                     WHERE user_id = ?
                       AND status IN (${statusPlaceholders})`
        const params = [user_id, ...statuses]

        db.query(sql, params, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

//查询时间段是否已被预约
module.exports.queryTimeReserve = (type, seatId, date, timeId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM reservation
                     WHERE seat_id = ? AND date = ? AND ${type}_time_id = ?`
        db.query(sql, [seatId, date, timeId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//查询预约时间ID
module.exports.queryReserveTimeID = (time) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id
                     FROM time
                     WHERE time = ? `
        db.query(sql, [time], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//通过时间id查询时间段
module.exports.queryTimeById = (timeId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM time
                     WHERE id = ?`
        db.query(sql, [timeId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//通过座位编号查找房间号和座位号
module.exports.querySeatRoom = (seatId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM seat
                     WHERE id = ?`
        db.query(sql, [seatId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//通过房间号查找区域和楼层
module.exports.queryRoomAreaFloor = (room) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM area
                     WHERE room = ?`
        db.query(sql, [room], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//更新预约状态
module.exports.updateReserve = (userId, content, statusList) => {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(content)
        const values = Object.values(content)
        const setClause = keys.map(key => `\`${key}\` = ?`).join(', ')
        const status = statusList.map(() => '?').join(', ')
        const sql = `UPDATE reservation
                     SET ${setClause}
                     WHERE user_id = ?
                       AND status IN (${status})`
        db.query(sql, [...values, userId, ...statusList], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

//根据房间号查找对应房间规则信息
module.exports.queryRoomRule = (room) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                     FROM rule
                     WHERE area_id = (SELECT id FROM area WHERE room = ?)`
        db.query(sql, [room], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//同步更新座位状态
module.exports.updateSeatStatus = (seatId, status) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE seat
                     SET status = ?
                     WHERE id = ?`
        db.query(sql, [status, seatId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
//获取预约信息
module.exports.selectReserve = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT r.id,r.user_id,r.seat_id,r.date,t_start.time AS start_time,t_end.time AS end_time,r.status FROM reservation r JOIN time t_start ON r.start_time_id = t_start.id JOIN time t_end ON r.end_time_id = t_end.id; '
        db.query(sql, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}