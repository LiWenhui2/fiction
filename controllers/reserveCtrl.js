const moment = require('moment-timezone')
const {
    queryUserReserve,
    addReservation,
    queryReserveTimeID, querySeatRoom, queryRoomAreaFloor, queryTimeById, queryRoomRule,
    updateSeatStatus, updateReserve, checkTimeConflict, selectReserve
} = require("../models/reserveModel");
const getDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
// 学生预约接口
module.exports.reserve = async (req, res) => {
    console.log(req.body);
    const {user_id, seat_id, date, startTime, endTime} = req.body;
    if (!user_id || !seat_id || !date || !startTime || !endTime) {
        return res.cc('参数错误！');
    }
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const now = new Date();
    // 合法性校验
    const nowMinus30min = new Date(now.getTime() - 30 * 60 * 1000);
    if (startDateTime < nowMinus30min || startDateTime >= endDateTime) {
        return res.cc('预约时间不合法！');
    }
    try {
        // 检查用户是否已存在预约
        const reservation = await queryUserReserve(user_id, [0, 1, 2]);
        if (reservation.length > 0) {
            return res.cc('已有其他预约，不能重复预约！');
        }
        //检查该时间段是否已被预约
        const conflictRes = await checkTimeConflict(reservation[0]?.seat_id, reservation[0]?.date, reservation[0]?.start_time_id, reservation[0]?.end_time_id);
        const startTimeIdRes = await queryReserveTimeID(startTime);
        const startTimeId = Number(startTimeIdRes[0].id);
        const endTimeIdRes = await queryReserveTimeID(endTime);
        const endTimeId = Number(endTimeIdRes[0].id);
        if (conflictRes.length > 0) {
            return res.cc('该时间段已被预约，请选择其他时间！');
        }
        // 添加预约
        const result = await addReservation([user_id, seat_id, date, startTimeId, endTimeId, 0]);
        if (result.affectedRows > 0) {
            const updateResult = await updateSeatStatus(seat_id, 1);
            if (updateResult.affectedRows !== 1) {
                return res.cc('更新座位状态失败，请重试！');
            }
            res.send({
                status: 0,
                message: '预约成功！',
                data: {
                    seat_id,
                    date,
                    start_time_id: startTimeId,
                    end_time_id: endTimeId,
                }
            });
        } else {
            res.cc('预约失败，请重试！');
        }
    } catch (error) {
        res.cc(error);
    }
}
//获取学生预约记录
module.exports.getStuReserve = async (req, res) => {
    const {user_id} = req.query;
    if (!user_id) {
        return res.cc('参数错误！');
    }
    try {
        const reservations = await queryUserReserve(Number(user_id), [0, 1, 2]);
        if (reservations.length > 0) {
            const seat_id = reservations[0].seat_id;
            //通过座位编号查找房间号和座位号
            const seatRoom = await querySeatRoom(seat_id);
            console.log(seatRoom);
            //通过房间号查找区域和楼层
            const areaFloor = await queryRoomAreaFloor(seatRoom[0].room);
            //通过时间id查询时间段
            const startTime = await queryTimeById(reservations[0].start_time_id);
            const endTime = await queryTimeById(reservations[0].end_time_id);
            res.send({
                status: 0,
                message: '获取预约记录成功！',
                data: {
                    area: areaFloor[0].area,
                    floor: areaFloor[0].floor,
                    room: seatRoom[0].room,
                    seat: seatRoom[0].seat,
                    date: reservations[0].date instanceof Date
                        ? reservations[0].date.toLocaleDateString('zh-CN').replaceAll('/', '-')
                        : reservations[0].date,
                    time: `${startTime[0].time.slice(0, 5)} - ${endTime[0].time.slice(0, 5)}`,
                    status: reservations[0].status
                }
            });
        } else {
            res.send({
                status: 0,
                message: '当前无预约！',
                data: {}
            });
        }
    } catch (error) {
        res.cc(error);
    }
}
//学生签到
module.exports.stuCheckIn = async (req, res) => {
    const user_id = req.params.user_id;
    console.log(user_id);
    if (!user_id) {
        return res.cc('参数错误！');
    }
    try {
        //查询用户预约记录
        const reservations = await queryUserReserve(Number(user_id), [0, 1, 2]);
        //通过id查询对应时间段
        const checkedInTimeRes = await queryTimeById(reservations[0].start_time_id);
        //通过座位编号查找所在房间号
        const room = await querySeatRoom(reservations[0].seat_id);
        //通过房间查询对应规则
        const rules = await queryRoomRule(room[0].room);
        //判断是否在可签到范围之内
        const dateStr = getDate(reservations[0].date);
        const checkInTime = `${dateStr}T${checkedInTimeRes[0].time}`
        const diff = new Date(checkInTime) - new Date();
        const status = diff < 0 ? 2 : 1
        console.log(status)
        if (diff > rules[0].check_in_time * 60 * 1000) {
            return res.cc('未到签到时间！无法签到！');
        } else {
            const updateResult = await updateReserve(user_id, {status: status, check_in_time: new Date()}, [0]);
            console.log(updateResult.affectedRows)
            if (updateResult.affectedRows === 1) {
                res.send({
                    status: 0,
                    message: '签到成功！',
                    date: {
                        status: status
                    }
                });
            } else {
                res.cc('您已签过到了！');
            }
        }
    } catch (error) {
        res.cc(error);
    }
}
//学生签退
module.exports.stuCheckOut = async (req, res) => {
    const user_id = req.params.user_id;
    if (!user_id) return res.cc('参数错误！');
    try {
        //查询用户预约记录
        const reservations = await queryUserReserve(user_id, [1, 2])
        //通过id查询对应时间段
        const checkedOutTimeRes = await queryTimeById(reservations[0]?.end_time_id);
        //通过座位编号查找所在房间号
        const room = await querySeatRoom(reservations[0]?.seat_id);
        //通过房间查询对应规则
        const rules = await queryRoomRule(room[0]?.room);
        //判断是否已签到
        console.log(reservations[0]?.status)
        if (reservations[0].status !== 1 && reservations[0]?.status !== 2)
            return res.cc('暂无签到记录，无法签退！');
        const dateStr = getDate(reservations[0].date);
        const checkOutTime = `${dateStr}T${checkedOutTimeRes[0].time}`
        const diff = new Date(checkOutTime) - new Date();
        let status, message
        console.log(diff)
        console.log(rules[0].check_in_time * 60 * 1000)
        if (diff > rules[0].check_in_time * 60 * 1000) {
            if (reservations[0].status === 2) {
                status = 8
                message = '签退成功！(迟到+早退！)'
            }
            if (reservations[0].status === 1) {
                status = 3
                message = '签退成功！(早退！)'
            }
        } else if (diff < 0) {
            if (reservations[0].status === 2) {
                status = 9
                message = '系统已自动签退！(迟到+未签退！)'
            }
            if (reservations[0].status === 1) {
                status = 5
                message = '系统已自动签退！(未签退！)'
            }
        } else {
            if (reservations[0].status === 2) {
                status = 2
                message = '签退成功！(迟到！)'
            } else {
                status = 4
                message = '签退成功！(已签退！)'
            }
        }
        const updateResult = await updateReserve(user_id,
            {status: status, check_out_time: new Date()}, [1, 2]);
        const updateSeatResult = await updateSeatStatus(reservations[0].seat_id, 0);
        if (updateSeatResult.affectedRows !== 1)
            return res.cc('更新座位状态失败，请重试！');
        if (updateResult.affectedRows === 1) {
            res.send({
                status: 0, message: message,
                date: {status: status}
            })
        } else
            res.cc('签退失败，请重试！');
    } catch (error) {
        res.cc(error);
    }
}
//学生获取历史预约记录
module.exports.getStuHistory = async (req, res) => {
    const {user_id} = req.query;
    if (!user_id) {
        return res.cc('参数错误！');
    }
    try {
        const reservations = await queryUserReserve(Number(user_id), [3, 4, 5, 6, 7, 8, 9]);
        if (reservations.length > 0) {
            const data = await Promise.all(reservations.map(async (reservation) => {
                const seatRoom = await querySeatRoom(reservation.seat_id);
                const areaFloor = await queryRoomAreaFloor(seatRoom[0].room);
                const startTime = await queryTimeById(reservation.start_time_id);
                const endTime = await queryTimeById(reservation.end_time_id);
                return {
                    area: areaFloor[0].area,
                    floor: areaFloor[0].floor,
                    room: seatRoom[0].room,
                    seat: seatRoom[0].seat,
                    date: reservation.date instanceof Date
                        ? reservation.date.toLocaleDateString('zh-CN').replaceAll('/', '-')
                        : reservation.date,
                    time: `${startTime[0].time.slice(0, 5)} - ${endTime[0].time.slice(0, 5)}`,
                    status: reservation.status,
                    check_in_time: reservation.check_in_time
                        ? moment(reservation.check_in_time).tz('Asia/Shanghai').format('YYYY-M-D HH:mm:ss')
                        : null,
                    check_out_time: reservation.check_out_time
                        ? moment(reservation.check_out_time).tz('Asia/Shanghai').format('YYYY-M-D HH:mm:ss')
                        : null
                }
            }))
            res.send({
                status: 0,
                message: '获取历史预约记录成功！',
                data
            })


        } else {
            res.send({
                status: 0,
                message: '暂无历史预约记录！',
                data: []
            });
        }
    } catch (error) {
        res.cc(error);
    }
}
//取消预约
module.exports.cancelReserve = async (req, res) => {
    const user_id = req.params.user_id;
    if (!user_id) {
        return res.cc('参数错误！');
    }
    try {
        //查询用户预约记录
        const reservations = await queryUserReserve(Number(user_id), [0]);
        if (reservations.length === 0) {
            return res.cc('无预约记录，无法取消！');
        }
        const seatId = reservations[0].seat_id;
        //更新预约状态为已取消
        const updateResult = await updateReserve(user_id, {status: 6}, [0]);
        const updateSeatResult = await updateSeatStatus(seatId, 0);
        if (updateSeatResult.affectedRows !== 1) {
            return res.cc('更新座位状态失败，请重试！');
        }
        if (updateResult.affectedRows === 1) {
            res.send({
                status: 0,
                message: '取消预约成功！',
            });
        } else {
            res.cc('取消预约失败，请重试！');
        }
    } catch (error) {
        res.cc(error);
    }
}
module.exports.getReserve = async (req, res) => {
    try {
        const reserve = await selectReserve()
        if (reserve.length > 0) {
            res.send({
                status: 0,
                message: '获取预约信息成功！',
                data: reserve.map(item => ({
                    ...item,
                    date: item.date instanceof Date
                        ? item.date.toLocaleDateString('zh-CN').replaceAll('/', '-')
                        : item.date,
                    start_time: item.start_time.slice(0, 5),
                    end_time: item.end_time.slice(0, 5)
                }))
            })
        }
    } catch (err) {
        res.cc(err)
    }
}