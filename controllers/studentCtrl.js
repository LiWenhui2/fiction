const {adminGetStuInfo, disableStuAccounts, enableStuAccounts, deleteStuAccounts} = require("../models/studentModel");
module.exports.getStuAllInfo = async (req, res) => {
    try {
        console.log(11)
        const result = await adminGetStuInfo()
        if (result.length !== 0) {
            res.send({
                status: 0,
                message: '获取学生信息成功',
                data: result.map(stu => ({
                    id: stu.id,
                    username: stu.username,
                    stu_no: stu.stu_no,
                    email: stu.email,
                    contact: stu.contact,
                    status: stu.status,

                }))
            })
        } else return res.cc('暂无学生信息')
    } catch (e) {
        res.cc(e);
    }
}
//禁用学生用户
module.exports.disableStudent = async (req, res) => {
    try {
        const {ids} = req.body
        const disableResult = await disableStuAccounts(ids)
        res.send({
            status: 0,
            message: '禁用成功！',
            disabled: `禁用成功，影响${disableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//启用学生用户
module.exports.enableStudent = async (req, res) => {
    try {
        const {ids} = req.body
        const enableResult = await enableStuAccounts(ids)
        res.send({
            status: 0,
            message: '启用成功！',
            enabled: `启用成功！影响${enableResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}
//删除学生账号
module.exports.deleteStudent = async (req, res) => {
    try {
        const {ids} = req.body
        const deleteResult = await deleteStuAccounts(ids)
        res.send({
            status: 0,
            message: '删除成功！',
            deleted: `删除成功！影响${deleteResult.affectedRows}行数据！`
        })
    } catch (err) {
        res.cc(err)
    }
}