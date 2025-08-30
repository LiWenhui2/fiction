const bcrypt = require('bcryptjs')
const {hashSync} = require("bcryptjs");
//加密密码--注册、修改时
const hashPassword = (password) => {
    return hashSync(password, 10)
}
//密码验证
const validatePassword = (plainPassword, hashPassword) => {
    return bcrypt.compareSync(plainPassword, hashPassword)
}
module.exports = {
    hashPassword,
    validatePassword
}


