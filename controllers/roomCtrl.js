const {selectInfo, insertArea, deleteRooms, disableRooms, editRooms} = require('../models/roomModel')
const {updateRule, updateRulesByAreaIds, insertRule, selectRule} = require("../models/ruleModel");
//获取区域自习室列表
const getArea = async (req, res) => {
    try {
        const areaResult = await selectInfo('area', '1=1')
        res.send({
            status: 0,
            message: '获取区域列表成功！',
            data: areaResult.map(item => item.area)
        })
    } catch (err) {
        res.cc(err)
    }
}
//查询指定区域楼层列表
const getFloor = async (req, res) => {
    try {
        const floorResult = await selectInfo('floor', `area='${req.query.area}' order by floor asc`)
        // console.log(floorResult)
        res.send({
            status: 0,
            message: '获取区域楼层列表成功！',
            data: floorResult.map(item => item.floor)
        })
    } catch (err) {
        res.cc(err)
    }
}
//获取楼层自习室列表
const getRoom = async (req, res) => {
    try {
        const roomResult = await selectInfo('room', `area='${req.query.area}' AND floor='${req.query.floor}'`)
        res.send({
            status: 0,
            message: '获取楼层自习室列表成功！',
            data: roomResult.map(item => item.room)
        })
    } catch (err) {
        res.cc(err)
    }
}
//查询自习室全部信息
const getRoomInfo = async (req, res) => {
    try {
        let condition = '1=1'
        const {area, floor, room} = req.query
        if (area) condition += ` AND area='${area}'`
        if (floor) condition += ` AND floor='${floor}'`
        if (room) condition += ` AND room='${room}'`
        const roomInfoResult = await selectInfo('*', condition)
        res.send({
            status: 0,
            message: '查询自习室信息成功！',
            data: roomInfoResult
        })
    } catch (err) {
        res.cc(err)
    }
}
//添加自习室
const addRoom = async (req, res) => {
    const insertData = {}
    try {
        Object.entries((req.body)).forEach(([key, value]) => {
            if (value !== '') {
                insertData[key] = value
            }
        })
        const insertResult = await insertArea(insertData)
        if (insertResult.affectedRows !== 1) return res.cc('添加失败，请重试！')
        const areaId = insertResult.insertId
        const insertRuleResult = await insertRule({
            area_id: areaId,
            day: 3,
            check_in_time: 20
        })
        if (insertRuleResult.affectedRows !== 1) return res.cc('添加自习室规则失败，请重试！')
        return res.send({
            status: 0,
            message: '添加自习室成功！'
        })
    } catch (err) {
        res.cc(err)
    }
}
//删除自习室
const deleteRoom = async (req, res) => {
    try {
        const {ids} = req.body
        const deleteResult = await deleteRooms(ids)
        if (deleteResult.affectedRows !== ids.length) return res.cc('删除失败！')
        if (deleteResult.affectedRows === 0) return res.cc('未找到要删除的数据！')
        res.send({
            status: 0,
            message: '删除成功！',
            deleted: `删除成功！影响${deleteResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//禁用自习室
const disableRoom = async (req, res) => {
    try {
        const {ids} = req.body
        const disableResult = await disableRooms(ids, 0)
        res.send({
            status: 0,
            message: '禁用成功！',
            disabled: `禁用成功，影响${disableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//启用自习室
const enableRoom = async (req, res) => {
    try {
        const {ids} = req.body
        const enableResult = await disableRooms(ids, 1)
        res.send({
            status: 0,
            message: '启用成功！',
            enabled: `启用成功！影响${enableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//编辑自习室信息
const editRoom = async (req, res) => {
    try {
        console.log(req.body)
        let updateContent = {}
        const {ids, area, floor, room, enable, start, end} = req.body
        const fields = {area, floor, room, enable, start, end}
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                updateContent[key] = value
            }
        })
        const editResult = await editRooms(ids, updateContent)
        res.send({
            status: 0,
            message: '编辑成功！',
            edited: `编辑成功！影响${editResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//自习室规则配置
const setRoomRule = async (req, res) => {
    try {
        console.log(req.body)
        const {ids, day, check_in_time} = req.body
        if (!ids || ids.length === 0) return res.cc('参数为空！')
        const updateContent = {day: Number(day), check_in_time: check_in_time}
        const updateResult = await updateRulesByAreaIds(ids, updateContent)
        if (updateResult.affectedRows !== ids.length) return res.cc('设置失败，请重试！')
        res.send({
            status: 0,
            message: '设置自习室规则成功！',
            updated: `设置成功！影响${updateResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//获取自习室规则
const getRoomRule = async (req, res) => {
    try {
        const {id} = req.query
        if (!id || id.length === 0) return res.cc('参数为空！')
        const rules = await selectRule(id)
        if (rules.length === 0) return res.cc('未找到自习室规则！')
        res.send({
            status: 0,
            message: '获取自习室规则成功！',
            data: rules
        })
    } catch (err) {
        res.cc(err)
    }
}
module.exports = {
    getArea,
    getFloor,
    getRoom,
    addRoom,
    getRoomInfo,
    deleteRoom,
    disableRoom,
    enableRoom,
    editRoom,
    setRoomRule,
    getRoomRule
}
//获取区域楼层列表
