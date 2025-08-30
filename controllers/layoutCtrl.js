//管理员新建布局初始化接口
const {insertLayout, queryLayoutInfo, delLayout, updateLayout} = require("../models/layoutModel");
module.exports.initLayout = async (req, res) => {
    const {room, row, col} = req.body;
    console.log(room, row, col);
    if (!room || row <= 0 || col <= 0) {
        return res.cc('参数错误！');
    }

    const values = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            values.push([room, i, j])
        }
    }
    try {
        const result = await insertLayout([values]);
        if (result.affectedRows > 0) {
            res.send({
                status: 0,
                message: '布局初始化成功！',
                affectedRows: result.affectedRows
            });
        } else {
            res.cc('布局初始化失败！');
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.cc('该房间的平面图已存在，请勿重复添加！');
        } else {
            res.cc(error);
        }

    }
}
//获取布局信息
module.exports.getLayout = async (req, res) => {
    const {room} = req.query;
    if (!room) {
        return res.cc('参数错误！');
    }
    try {
        const layoutInfo = await queryLayoutInfo(room);
        if (layoutInfo.length > 0) {
            res.send({
                status: 0,
                message: '获取布局信息成功！',
                data: layoutInfo
            });
        } else {
            res.cc('获取布局信息失败！');
        }
    } catch (error) {
        res.cc(error);
    }
}
//删除布局
module.exports.deleteLayout = async (req, res) => {
    const {room} = req.body;
    console.log(room)
    if (!room) {
        return res.cc('参数错误！');
    }
    try {
        const result = await delLayout(room);
        if (result.affectedRows > 0) {
            res.send({
                status: 0,
                message: '删除布局成功！',
                affectedRows: result.affectedRows
            });
        } else {
            res.cc('删除布局失败！');
        }
    } catch (error) {
        res.cc(error);
    }
}
//更新布局
module.exports.updateLayout = async (req, res) => {
    const updates = req.body //数组结构
    console.log(req.body)
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.cc('参数错误！');
    }
    try {
        await Promise.all(
            updates.map(cell =>
                updateLayout(cell.room, cell.row, cell.col, cell.type, cell.label, cell.bg_img)
            )
        )
        if (updates.length > 0) {
            res.send({
                status: 0,
                message: '更新布局成功！',
                affectedRows: updates.length
            });
        }
    } catch (err) {
        res.cc(err)
    }
}