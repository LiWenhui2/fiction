const joi = require('joi')
//学号验证：非空字符串、数字5-20、必填
const stu_no = joi.string().trim().pattern(/^\d{5,12}$/).required().messages({
    'string.empty': '学号不能为空',
    'string.pattern.base': '学号只能由5-12位数字组成',
    'any.required': '学号是必填项'
})
//密码验证：字符串、长度在 6 到 20 位之间、至少包含一个英文字母和数字、必填
const password = joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/).required().messages({
    'string.empty': '密码不能为空',
    'string.pattern.base': '密码必须包含字母和数字，长度6-20位',
    'any.required': '密码是必填项'
})
//用户名验证:非空字符串、长度2-20、必填
const username = joi.string().trim().min(2).max(20).required().messages({
    'string.base': '用户名格式不正确',
    'string.empty': '用户名不能为空',
    'string.min': '用户名不能少于2个字符',
    'string.max': '用户名不能超过20个字符',
    'any.required': '用户名是必填项'
})
//邮箱验证：邮件格式、必填
const email = joi.string().email().required().messages({
    'string.email': '请输入合法的邮箱地址',
    'any.required': '邮箱是必填项'
})
//联系方式（手机）验证:合法的11位手机号
const contact = joi.string().optional().pattern(/^1[3-9]\d{9}$/).messages({
    'string.pattern.base': '请输入合法的11位手机号'
})
//头像验证:base64格式
const avatar = joi.string().dataUri().messages({
    'string.dataUri': '头像必须是合法的 base64 图像格式'
})
//验证码校验：6位数字
const code = joi.string().pattern(/^\d{6}$/).required().messages({
    'string.empty': '验证码不能为空',
    'string.pattern.base': '验证码必须是6位数字',
    'any.required': '验证码是必填项'
})
//登录访问角色
const role = joi.string().valid('student', 'admin').required().messages({
    'string.empty': '访问者不能为空',
    'any.only': '访问者只能是 student 或 admin',
    'any.required': '访问者是必填项'
})
//可选的学号或用户名
const optionalStuNo = joi.string().trim().pattern(/^\d{5,12}$/).messages({
    'string.empty': '学号不能为空',
    'string.pattern.base': '学号只能由5-12位数字组成'
})
const optionalUsername = joi.string().trim().min(2).max(20).messages({
    'string.base': '用户名格式不正确',
    'string.empty': '用户名不能为空',
    'string.min': '用户名不能少于2个字符',
    'string.max': '用户名不能超过20个字符'
})
//定义验证登录规则对象
module.exports.stu_loginRule = {
    body: {
        stu_no,
        password
    }
}
//定义验证注册规则对象
module.exports.stu_registerRule = {
    body: {
        username,
        stu_no,
        password,
        email,
        contact,
        avatar
    }
}
//定义管理员注册规则对象
module.exports.admin_registerRule = {
    body: {
        username,
        password,
        email
    }
}
//定义管理员登录规则对象
module.exports.admin_loginRule = {
    body: {
        username,
        password
    }
}
//定义发送验证码到邮箱规则对象
module.exports.sendCodeRule = {
    body: {
        role,
        stu_no: optionalStuNo,
        username: optionalUsername,
        email
    }
}
//定义验证码检查规则对象
module.exports.checkCodeRule = {
    body: {
        role,
        code,
        stu_no: optionalStuNo,
        username: optionalUsername
    }
}
//定义学生用户更新密码规则对象
module.exports.stu_updatePwdRule = {
    body: {
        stu_no,
        password
    }
}
//定义管理员用户更新密码规则对象
module.exports.resetPwdRule = {
    body: {
        role,
        stu_no: optionalStuNo,
        username: optionalUsername,
        password
    }
}
//定义更新学生信息规则对象
module.exports.updateStuInfoRule = {
    body: {
        username,
        email,
        contact
    }
}

//自习室相关验证规则
const ids = joi.array().items(joi.number().integer()).required().min(1).messages({
    'array.base': 'ids必须是数组',
    'any.required': 'ids是必填项',
    'array.min': '需要删除的数据不能为空'
})
const area = joi.string().trim().messages({
    'string.empty': '区域不能为空',
})
const floor = joi.string().trim().messages({
    'string.empty': '楼层不能为空',
})
const room = joi.string().trim().messages({
    'string.empty': '自习室不能为空',
})
const seatCount = joi.number().integer().min(0).messages({
    'number.base': '座位数必须是整数',
    'number.min': '座位数不能小于0',
})
const enable = joi.number()
    .valid(0, 1)
    .messages({
        'any.only': '状态只能是启用（1）或禁用（0）',
        'number.base': '状态必须为数字类型',
    })
const start = joi.string().messages({
    'string.empty': '开始时间不能为空'
})
const end = joi.string().messages({
    'string.empty': '结束时间不能为空'
})

//定义批量删除自习室规则对象
module.exports.deleteRoomRule = {
    body: {
        ids
    }
}
//定义编辑自习室规则对象
module.exports.editRoomRule = {
    body: {
        ids,
        area,
        floor,
        room,
        seatCount,
        enable,
        start,
        end
    }
}