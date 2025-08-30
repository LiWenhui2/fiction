const {findUser} = require("../models/userModel")
const {sendVerifyCode} = require("../utils/sendEmail")
// 创建验证码内存缓存
const codeCache = new Map()
//发送验证码api
const sendCode = async (req, res) => {
    try {
        const table = req.body.role === 'student' ? 'user' : 'admin'
        //生成验证码
        const code = (Math.floor(Math.random() * 900000) + 100000).toString()
        const fieldName = table === 'user' ? 'stu_no' : 'username'
        const fieldValue = table === 'user' ? req.body.stu_no : req.body.username
        const result = await findUser(table, fieldName, fieldValue)
        if (result.length !== 1) return res.cc(table === 'user' ? '学号未注册！' : '管理员账号不存在！', 409)
        //账号存在
        //判断邮箱是否正确
        if (result[0].email !== req.body.email) return res.cc('邮箱不匹配，请检查！')
        //发送验证码
        await sendVerifyCode(req.body.email, code)
        //缓存验证
        const cacheKey = `${fieldName}:${fieldValue}`
        codeCache.set(cacheKey, {code, expires: Date.now() + 5 * 60 * 1000})
        console.log(codeCache + '1111')
        res.send({
            status: 0,
            message: '验证码已发送，请注意查收！'
        })
    } catch (err) {
        console.log(err)
        return res.cc('发送失败！请稍后重试！')

    }
}

//校验验证码
const verifyCode = (req, res) => {
    const key = req.body.role === 'student' ? `stu_no:${req.body.stu_no}` : `username:${req.body.username}`
    const cache = codeCache.get(key);
    if (Date.now() > cache.expires) {
        codeCache.delete(key);
        return res.cc('验证码已过期，请重新获取');
    }
    if (cache.code === req.body.code) {
        return res.cc('验证码正确！', 200, 0);
    } else {
        return res.cc('验证码错误！');
    }
}

module.exports = {
    sendCode,
    verifyCode
}