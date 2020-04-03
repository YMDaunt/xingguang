import common from '../common/common.js'

require('../../css/activity/goRechargePage1.less')

document.body.addEventListener('click', function () {})

$('.js-gorecharge').click(function () {
    if (common.getPlatformType() === 'pc') {
        location.href = '//www.kuaishouvideo.com/recharge/center'
    } else {
        location.href = '/rechargeApp'
    }
})
