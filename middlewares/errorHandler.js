const joi = require('joi')
const errorHandle = (err, req, res, next) => {
    console.error(err)
    if (err instanceof joi.ValidationError) return res.cc(err, 400)
    if (err.name === 'UnauthorizedError') return res.cc('无效的 token！', 400)
    console.log(err)
    res.cc('未知错误！')
}
module.exports = errorHandle