const cron = require('node-cron');
const db = require('../config/db');

cron.schedule('*/1 * * * *', async () => {
    // console.log('[定时任务] 检查超时未签到记录...');
    const sql1 = `
    UPDATE reservation r
    JOIN time t ON r.start_time_id = t.id
    JOIN seat s ON r.seat_id = s.id
    JOIN area a ON s.room = a.room
    JOIN rule ru ON a.id = ru.area_id
    SET r.status = 7,
    s.status = 0
    WHERE r.status = 0
      AND NOW() > TIMESTAMP(r.date, t.time) + INTERVAL ru.check_in_time MINUTE;
  `;
    const sql2 = `
    UPDATE reservation r
    JOIN time t ON r.end_time_id = t.id
    JOIN seat s ON r.seat_id = s.id
    SET r.status = 5,
    s.status = 0
    WHERE r.status =1
      AND NOW() > TIMESTAMP(r.date, t.time);
  `;
    const sql3 = `
    UPDATE reservation r
    JOIN time t ON r.end_time_id = t.id
    JOIN seat s ON r.seat_id = s.id
    SET r.status = 9,
    s.status = 0
    WHERE r.status =2
      AND NOW() > TIMESTAMP(r.date, t.time);
  `;
    try {
        const res1 = await db.query(sql1)
        const res2 = await db.query(sql2)
        const res3 = await db.query(sql3)

        if (res1.affectedRows > 0 || res2.affectedRows > 0) {
            console.log(`[定时任务] 违约处理：未签到 ${res1.affectedRows} 条，未签退 ${res2.affectedRows} 条，已签退（迟到） ${res3.affectedRows} 条`);
        }
    } catch (err) {
        console.error('[定时任务] 执行失败：', err)
    }
})