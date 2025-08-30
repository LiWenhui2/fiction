const {
    querySeatInfo,
    insertSeats,
    updateSeatInfo,
    deleteSeat,
    getSeatRoomMapping,
    querySeatLayout
} = require("../models/seatModel");
const {updateSeatCount, editRooms} = require("../models/roomModel");

//学生端获取座位信息
module.exports.getSeatInfo = async (req, res) => {
    console.log(req.query)
    try {
        let condition = '1=1'
        const {room, seat} = req.query
        if (room) condition += ` AND room='${room}'`
        if (seat) condition += ` AND seat='${seat}'`
        const seatInfo = await querySeatInfo(condition)
        res.send({
            status: 0,
            message: '获取座位信息成功！',
            data: seatInfo
        })
    } catch (err) {
        res.cc(err)
    }
}
//通过单元格获取座位信息
module.exports.getSeatInfoByCell = async (req, res) => {
    try {
        const {room, col, row} = req.query
        console.log(room, col, row)
        if (!room || !col || !row) return res.cc('参数错误！')
        const seatInfo = await querySeatLayout(room, Number(row), Number(col))
        if (seatInfo.length !== 1) return res.cc('查询失败！')
        res.send({
            status: 0,
            message: '获取座位信息成功！',
            data: seatInfo
        })
    } catch (err) {
        res.cc(err)
    }
}
//新增座位
module.exports.addSeat = async (req, res) => {
    console.log(req.body)
    try {
        const {room, addSeatCount, enable} = req.body
        //查询房间最后一个座位号
        const queryResult = await querySeatInfo(`room='${room}' ORDER BY seat DESC LIMIT 1`)
        const lastSeat = queryResult[0] ? queryResult[0].seat : '000'
        const maxNo = parseInt(lastSeat)

        const insertSeatsData = []
        for (let i = 1; i <= addSeatCount; i++) {
            const newNo = (maxNo + i).toString().padStart(3, '0')
            insertSeatsData.push({room, seat: newNo, enable})
        }
        const insertResult = await insertSeats(insertSeatsData)
        const editResult = await updateSeatCount(room, addSeatCount)
        if (editResult.affectedRows !== 1 || insertResult.affectedRows !== Number(addSeatCount))
            return res.cc('添加座位失败')
        res.send({
            status: 0,
            message: `成功添加 ${addSeatCount} 个座位`
        })
    } catch (err) {
        res.cc(err || '服务器错误')
    }
}
//编辑座位
module.exports.editSeat = async (req, res) => {
    try {
        let updateContent = {}
        const {ids, seat, enable, status} = req.body
        console.log(req.body)
        const fields = {seat, enable, status}
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                updateContent[key] = value
            }
        })
        const editResult = await updateSeatInfo(ids, updateContent)
        res.send({
            status: 0,
            message: '编辑成功！',
            edited: `编辑成功！影响${editResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//禁用座位
module.exports.disableSeat = async (req, res) => {
    try {
        const {ids} = req.body
        const disableResult = await updateSeatInfo(ids, {enable: 0})
        res.send({
            status: 0,
            message: '禁用成功！',
            disabled: `禁用成功，影响${disableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//启用座位
module.exports.enableSeat = async (req, res) => {
    try {
        const {ids} = req.body
        const enableResult = await updateSeatInfo(ids, {enable: 1})
        res.send({
            status: 0,
            message: '启用成功！',
            enabled: `启用成功！影响${enableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//删除座位
module.exports.deleteSeat = async (req, res) => {
    try {
        const {ids} = req.body
        const seatInfoList = await getSeatRoomMapping(ids)
        const roomCountMap = {}
        seatInfoList.forEach(({room}) => {
            roomCountMap[room] = (roomCountMap[room] || 0) + 1
        })
        const deleteResult = await deleteSeat(ids)
        if (deleteResult.affectedRows !== ids.length) return res.cc('删除失败！')
        if (deleteResult.affectedRows === 0) return res.cc('未找到要删除的数据！')
        for (const [room, count] of Object.entries(roomCountMap)) {
            await updateSeatCount(room, -count)
        }
        res.send({
            status: 0,
            message: '删除成功！',
            deleted: `删除成功！影响${deleteResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}