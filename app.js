//入口文件
const express = require('express')
const cors = require('cors')
const errorHandle = require('./middlewares/errorHandler')
const {expressjwt} = require('express-jwt')
const config = require('./config/jwt')
//引入路由文件
const userRouter = require('./routes/user')
const verifyRouter = require('./routes/verifyCode')
const roomRouter = require('./routes/room')
const seatRouter = require('./routes/seat')
const layoutRouter = require('./routes/layout')
const reserveRouter = require("./routes/reserve");
const studentRouter = require('./routes/student')
const announcementRouter = require('./routes/announcement')
const path = require('path')
require('./middlewares/violationChecker')

const app = express()
//静态资源托管
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))
//err错误处理函数
app.use((req, res, next) => {
    res.cc = (err, httpCode = 200, status = 1) => {
        res.status(httpCode).send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//app.use(expressjwt({secret: config.secretKey, algorithms: ['HS256']}))
// JWT 鉴权中间件（排除登录注册）
app.use(
    expressjwt({secret: config.secretKey, algorithms: ['HS256']})
        .unless({
            path: [
                '/api/user/stu_login',
                '/api/user/stu_register',
                '/api/user/admin_login',
                '/api/user/admin_register',
                '/api/verify/sendCode',
                '/api/verify/verifyCode',
                '/api/user/resetPwd',
                '/api/user/uploadAvatar'
            ]
        })
)
app.use('/api/user', userRouter)
app.use('/api/verify', verifyRouter)
app.use('/api/room', roomRouter)
app.use('/api/seat', seatRouter)
app.use('/api/layout', layoutRouter)
app.use('/api/reserve', reserveRouter)
app.use('/api/student', studentRouter)
app.use('/api/announcement', announcementRouter)
//全局错误处理
app.use(errorHandle)

app.listen(3333, () => {
    console.log('http://43.159.41.42:3333')
})