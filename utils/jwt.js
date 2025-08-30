//生成token字符串
const jwt = require('jsonwebtoken')
const {secretKey, expiresIn} = require('../config/jwt')
const generateToken = (res, payload) => {
    const tokenStr = jwt.sign(payload, secretKey, {expiresIn: expiresIn})
    res.status(200).send({
        status: 0,
        message: '登录成功！',
        token: 'Bearer ' + tokenStr
    })
}

module.exports = {
    generateToken
}


