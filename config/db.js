//数据库连接
const mysql = require('mysql')
const db = mysql.createPool({
    host: '43.159.41.42',
    user: 'root',
    password: 'li11223344li',
    database: 'reserve'
})
module.exports = db