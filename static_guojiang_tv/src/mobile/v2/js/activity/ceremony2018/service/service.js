import axios from 'axios'

function errHandler (res) {
    if (res.status === 200) {
        return res.data
    } else {
        console.error(res.msg)
        throw new Error(res.msg)
    }
}

function statusHandler (data) {
    if (data.errno === 0) {
        return data.data
    } else {
        console.error(data.msg)
        throw new Error(data.msg)
    }
}

// 年度活动 页面初始化信息
export function getInit () {
    return axios.get('/anniversary/init')
        .then(errHandler).then(statusHandler)
}

// 年度活动 领取助力票
export function getTicket () {
    return axios.get('/anniversary/getTicket')
        .then(errHandler)
}

// 年度活动 预选赛日榜
export function getYXDayRank (date, pageNo) {
    return axios.get('/anniversary/ranks', {
        params: {
            activityId: 1988,
            type: 'date',
            extra: date, // 20181128
            pageNo: pageNo,
            pageSize: 15
        }
    }).then(errHandler)
}

// 年度活动 预选赛主播榜
export function getYXModRank (pageNo) {
    return axios.get('/anniversary/ranks', {
        params: {
            activityId: 1988,
            type: 'mod',
            pageNo: pageNo,
            pageSize: 15
        }
    }).then(errHandler)
}

// 年度活动 用户榜(因为用户榜数据不会变化 全程统计)
function getUserRank (pageNo) {
    return axios.get('/anniversary/ranks', {
        params: {
            activityId: 1988,
            type: 'user',
            pageNo: pageNo,
            pageSize: 15
        }
    }).then(errHandler)
}

// 年度活动 预选赛用户榜
export function getYXUserRank (pageNo) {
    return getUserRank(pageNo)
}

// 年度活动 单项赛报名页面信息
export function getSingleSignInit () {
    return axios.get('/anniversary/init2').then(errHandler)
}

// 年度活动 单项赛报名页面 - 报名
export function signSingle (groupId) {
    return axios.get('/anniversary/vote', {
        params: {
            groupId
        }
    }).then(errHandler)
}

// 年度活动 单项赛赛程
export function singleInit () {
    return axios.get('/anniversary/init3').then(errHandler)
}

// 年度活动 单项赛榜单
export function getSingleRank (stage, path) {
    // [0, 1, 2, 3] -> [1984, 1983, 1982, 1981]
    // [1, 2, 3, 4, 5] -> 赛道
    var ids = [1984, 1983, 1982, 1981]
    var pageS = [20, 10, 7, 4]
    if (!ids[stage] || !pageS[stage]) return Promise.resolve(new Error('[Wrong Params in Service.getSingleRank]'))
    return axios.get('/anniversary/ranks', {
        params: {
            activityId: ids[stage],
            type: 'mod',
            extra: path,
            pageNo: 1,
            pageSize: pageS[stage]
        }
    }).then(errHandler)
}

// 年度活动 总决赛赛程
export function finalInit () {
    return axios.get('/anniversary/init4').then(errHandler)
}

// 年度活动 总决赛榜单
export function getFinalRank (stage) {
    var ids = [1978, 1977]
    var pageS = [5, 3]
    if (!ids[stage] || !pageS[stage]) return Promise.resolve(new Error('[Wrong Params in Service.getFinalRank]'))
    return axios.get('/anniversary/ranks', {
        params: {
            activityId: ids[stage],
            type: 'mod',
            pageNo: 1,
            pageSize: pageS[stage]
        }
    }).then(errHandler)
}
