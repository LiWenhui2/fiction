const bcrypt = require('../utils/bcrypt')
const {findUser, insertUser, updateUser} = require('../models/userModel')
const {generateToken} = require("../utils/jwt")
const path = require('path')
//学生登录api
const stu_login = async (req, res) => {
    try {
        const stuNoResult = await findUser('user', 'stu_no', req.body.stu_no)
        if (stuNoResult.length !== 1) return res.cc('学号不存在！请先注册！')
        //账号存在
        //判断密码是否正确
        const validateResult = bcrypt.validatePassword(req.body.password, stuNoResult[0].password)
        if (!validateResult) return res.cc('学号或密码错误！')
        //登录成功后生成jwt加密的token字符串并返回结果
        const user = {...stuNoResult[0], password: '', email: '', avatar: '', contact: ''}
        generateToken(res, user)
    } catch (err) {
        res.cc(err)
    }
}
//学生注册api
const stu_register = async (req, res) => {
    try {
        const usernameResult = await findUser('user', 'username', req.body.username)
        console.log(111)
        const stuNoResult = await findUser('user', 'stu_no', req.body.stu_no)
        const emailResult = await findUser('user', 'email', req.body.email)
        if (usernameResult.length > 0) return res.cc('用户名被占用！', 409)
        if (stuNoResult.length > 0) return res.cc('学号已被注册！请登录！', 409)
        if (emailResult.length > 0) return res.cc('邮箱已被注册！请更换邮箱重试！', 409)
        //密码加密
        req.body.password = bcrypt.hashPassword(req.body.password)
        //插入数据
        const insertResult = await insertUser('user', {
            username: req.body.username,
            stu_no: req.body.stu_no,
            password: req.body.password,
            email: req.body.email,
            contact: req.body.contact,
            avatar: req.body.avatar
        })
        if (insertResult.affectedRows !== 1) return res.cc('注册失败!', 500)
        res.status(201).send({
            status: 0,
            message: '注册成功！'
        })
    } catch (err) {
        res.cc(err)
    }
}
//管理员登录api
const admin_login = async (req, res) => {
    try {
        const adNoResult = await findUser('admin', 'username', req.body.username)
        if (adNoResult.length !== 1) return res.cc('管理员不存在！')
        //验证密码是否正确
        const validateResult = bcrypt.validatePassword(req.body.password, adNoResult[0].password)
        if (!validateResult) return res.cc('账号或密码错误！')
        //生成token字符串
        const admin = {...adNoResult[0], password: '', email: ''}
        generateToken(res, admin)
    } catch (err) {
        return res.cc(err)
    }
}
//管理员注册api
const admin_register = async (req, res) => {
    try {
        const adminNoResult = await findUser('admin', 'username', req.body.username)
        const adminEmailResult = await findUser('admin', 'email', req.body.email)
        if (adminNoResult.length > 0) return res.cc('账号已存在！')
        if (adminEmailResult.length > 0) return res.cc('邮箱已被注册!')
        //密码加密
        req.body.password = bcrypt.hashPassword(req.body.password)
        //插入数据库
        const insertResult = await insertUser('admin', {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        if (insertResult.affectedRows !== 1) return res.cc('注册失败', 500)
        res.status(201).send({
            status: 0,
            message: '注册成功！'
        })
    } catch (err) {
        return res.cc(err)
    }
}

//用户更新密码api
const resetPwd = async (req, res) => {
    try {
        const table = req.body.role === 'student' ? 'user' : 'admin'
        const fieldName = table === 'user' ? 'stu_no' : 'username'
        const fieldValue = table === 'user' ? req.body.stu_no : req.body.username
        //密码加密
        req.body.password = bcrypt.hashPassword(req.body.password)
        //更新密码

        const updateResult = await updateUser(table, {password: req.body.password},
            fieldName, fieldValue)
        if (updateResult.affectedRows !== 1) return res.cc('更新失败，请重试！' + updateResult.affectedRows)
        res.send({
            status: 0,
            message: '密码更新成功！'
        })
    } catch (err) {
        return res.cc(err)
    }
}
//获取学生信息api
const getStuInfo = async (req, res) => {
    const result = await findUser('user', 'stu_no', req.auth.stu_no)
    if (result.length !== 1) return res.cc('获取失败！')
    res.send({
        status: 0,
        message: '获取成功！',
        data: {
            id: result[0].id,
            username: result[0].username,
            stu_no: result[0].stu_no,
            email: result[0].email,
            contact: result[0].contact,
            avatar: result[0].avatar
        }
    })
}
//获取管理员信息api
const getAdminInfo = async (req, res) => {
    const result = await findUser('admin', 'username', req.auth.username)
    if (result.length !== 1) return res.cc('获取失败！')
    res.send({
        status: 0,
        message: '获取成功！',
        data: {
            username: result[0].username,
            email: result[0].email
        }
    })
}
//更新学生信息api
const updateStuInfo = async (req, res) => {
    console.log(req.body.username)
    const result = await findUser('user', 'stu_no', req.auth.stu_no)
    if (result.length !== 1) return res.cc('获取失败！')
    //判断是否有修改
    if (req.body.username === result[0].username && req.body.email === result[0].email && req.body.contact === result[0].contact) {
        return res.cc('信息没变，无需修改！')
    }
    //更新数据
    const updateResult = await updateUser('user', {
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
    }, 'stu_no', req.auth.stu_no)
    if (updateResult.affectedRows !== 1) return res.cc('更新失败，请重试！')
    res.send({
        status: 0,
        message: '更新成功！'
    })
}
//上传头像api
const uploadAvatar = async (req, res) => {
    if (!req.file) return res.cc('没有上传文件');
    const filePath = `/uploads/avatars/${req.file.filename}`
    const result = await updateUser('user', {avatar: filePath}, 'stu_no', req.body.stu_no)
    if (result.affectedRows !== 1) return res.cc('头像更新失败，请重试！')
    res.send({
        status: 0,
        message: '上传成功！',
        avatar: filePath
    })
}
module.exports = {
    stu_login,
    stu_register,
    admin_login,
    admin_register,
    resetPwd,
    getStuInfo,
    getAdminInfo,
    updateStuInfo,
    uploadAvatar
}