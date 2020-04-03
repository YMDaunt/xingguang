// 服务 - api管理

import axios from 'axios'

/**
 * @typedef {Object} StageTime 活动阶段时间
 * @property {string} id 活动id
 * @property {string} startTime 活动时间
 * @property {string} endTime 活动时间
 * @property {number} stage 所属活动阶段
 */

/**
 * @typedef {Object} InitObj 初始化接口返回的数据
 * @property {boolean} isLogin 用户是否登录
 * @property {number} activityStatus 活动所在阶段 0-未开始 -1-未开始 1-预选赛 2-赛道报名 3-晋级赛-50进20 4-晋级赛-20进10 5-晋级赛-10进7 6-晋级赛-7进3
 * @property {string} startTime 活动开始时间
 * @property {string} endTime 活动结束时间
 * @property {boolean} isMod 用户是否是主播
 * @property {[StageTime]} allActivityTime 各个阶段活动时间
 */

/**
 * @typedef {Object} ModRankItem 主播榜单列表项
 * @property {string} headPic 头像
 * @property {string} nickname 昵称
 * @property {number} score 得分
 * @property {number} id 用户id
 * @property {number} level 等级
 * @property {number} rid 房间id
 * @property {boolean} isPlaying 是否开播
 * @property {boolean} isLoved 是否已关注
 */

/**
 * @typedef {Object} ModRankMeCenter 主播榜单个人中心
 * @property {string|number} rank 榜单排名
 * @property {[Object]} pairInfos 排名详情
 * @property {string} uid 用户id
 * @property {string} headPic 头像
 * @property {string} nickName 昵称
 * @property {number} level 等级
 * @property {number} rid 房间id
 * @property {boolean} isPlaying 是否开播
 */

/**
 * @typedef {Object} ModRank 主播榜
 * @property {[ModRankItem]} ranks 榜单列表
 * @property {ModRankMeCenter} myRank 榜单个人中心
 */

/**
 * @typedef TickInfos 用户助力票领取信息
 * @property {number} first 首次进入直播间状态 [0 - 未进过直播间, 1 - 进入直播间但未领取奖励, 2 - 进入直播间并已领取奖励]
 * @property {number} watch_time 观看时长，单位分钟
 * @property {number} received 已领取助力票次数
 * @property {number} cumulate_total 助力票总数
 * @property {boolean} isAvailableTime 是否在领取期间
 */

/**
 * @typedef TakeTicketStatus 领取助力票结果状态
 * @property {number} recNum 当前已领取次数
 * @property {number} canNum 还可再领取次数
 */

/**
 * @typedef SignPathState
 * @property {number} num 当前的报名人数
 */

/**
 * @typedef ModPathItem 赛道主播详情
 * @property {string} headPic 头像
 * @property {string} nickname 昵称
 * @property {number} id 用户id
 * @property {number} level 用户等级
 * @property {number} rid 房间id
 * @property {boolean} isPlaying 是否正在直播
 * @property {boolean} isLoved 是否关注
 * // @property {number} score 荣耀值
 */

/**
 * @typedef ModPathList 赛道主播列表
 * @property {number} popularityCurrentNum 人气赛道当前报名人数
 * @property {number} entertainmentCurrentNum 娱乐赛道当前报名人数
 * @property {[ModPathItem]} popularity 人气赛道列表
 * @property {[ModPathItem]} entertainment 娱乐赛道列表
 * @property {boolean} canEnroll 是否有报名资格
 * @property {boolean} isEnrolled 是否已报名
 * @property {number} myGroup 我的报名赛道 1 - hot 2 - joy
 * @property {string} headPic 头像
 */

function apiHandler (res) {
    if (res.status === 200) {
        return res.data
    } else {
        console.error('[service.apiHandler]:', res.message)
        throw new Error(res.message)
    }
}

function dataHandler (data) {
    if (data.errno === 0) {
        return data.data
    } else {
        console.error('[service.dataHandler]:', data.msg)
        throw new Error(data.msg)
    }
}

/**
 * 初始化
 * @function
 * @return {Promise<InitObj>}
 */
export function init () {
    return axios.get('/anniversary2019/initInfo').then(apiHandler).then(dataHandler)
}

/**
 * @typedef {Object} RankOptions
 * @property {number} activityId 活动id
 * @property {number} group 赛道
 * @property {string} date 日期
 *
 * @function getModRank 主播榜
 * @param {number} page 当前页
 * @param {RankOptions} options 榜单加载参数选项
 * @return {Promise<ModRank>}
 */
export function getModRank (page, options) {
    // console.debug('[service][getModRank]args:', page, options)
    return axios.get('/anniversary2019/modRanks', {
        params: {
            page,
            pageRows: 15,
            ...options
        }
    }).then(apiHandler).then(dataHandler)
}

/**
 * @function getUserRank 用户榜
 * @return {Promise<ModRank>}
 */
export function getUserRank () {
    return axios.get('/anniversary2019/userTotalRanks', {
        params: {
            page: 1, pageRows: 10
        }
    }).then(apiHandler).then(dataHandler)
}

/**
 * @function getTicketInfos 获取用户助力票领取信息
 * @return {Promise<TickInfos>}
 */
export function getTicketInfos () {
    return axios.get('/anniversary2019/userTickets').then(apiHandler).then(dataHandler)
}

/**
 * @function takeTicket 领取助力票
 * @param {number} type 助力票类型 [1 - 首次进入直播间, 2 - 观看累计]
 * @return {Promise<TakeTicketStatus>}
 */
export function takeTicket (type) {
    return axios.get('/anniversary2019/getTicket', {
        params: { type }
    }).then(apiHandler).then(dataHandler)
}

/**
 * @function signPath 报名赛道
 * @param {number} group 赛道类型 [1 - 人气, 2 - 娱乐]
 * @return {Promise<SignPathState>}
 */
export function signPath (group) {
    return axios.get('/anniversary2019/enroll', {
        params: { group }
    }).then(apiHandler).then(dataHandler)
}

/**
 * @function getSignList 获取赛道主播列表
 * @return {Promise<ModPathList>}
 */
export function getSignList () {
    return axios.get('/anniversary2019/allGroupMod', {
        params: {
            page: 1, pageRows: 50
        }
    }).then(apiHandler).then(dataHandler)
}
