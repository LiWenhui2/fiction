const db = require('../config/db')
const updateRulesByAreaIds = (areaIds, updateContent) => {
    return new Promise((resolve, reject) => {
        const defaultValues = {
            day: 0,
            check_in_time: 20
        }
        const finalContent = {
            day: updateContent.day !== undefined ? updateContent.day : defaultValues.day,
            check_in_time: updateContent.check_in_time !== undefined ? updateContent.check_in_time : defaultValues.check_in_time
        }

        const keys = Object.keys(finalContent)
        const values = Object.values(finalContent)
        const setClause = keys.map(key => `${key} = ?`).join(', ')

        const sql = `UPDATE rule SET ${setClause} WHERE area_id IN (${areaIds.map(() => '?').join(',')})`
        db.query(sql, [...values, ...areaIds], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
const insertRule = (insertContent) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rule SET ?'
        db.query(sql, insertContent, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}
const selectRule = (areaId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM rule WHERE area_id = ?`
        db.query(sql, [areaId], (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

module.exports = {
    updateRulesByAreaIds,
    insertRule,
    selectRule
}