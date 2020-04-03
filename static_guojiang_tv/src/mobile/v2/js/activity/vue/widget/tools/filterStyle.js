/* eslint-disable */
export default function (overridingStyles, bf) {
    const filter = {}
    for (var i in overridingStyles) {
        const value = overridingStyles[i]
        if (/[0-9]/.test(value) && !/[a-zA-Z]/.test(value)) {
            if (Object.prototype.toString.call(value) === '[object Number]') { // 纯数字
                filter[i] = value / bf + 'rem'
            } else { // 数字字符串 'number number'
                const numArr = value.split(/\s+/)
                let str = ''
                numArr.forEach(function (vl) {
                    str += ' ' + vl / bf + 'rem'
                })
                filter[i] = str
            }
        } else { // 字符串
            if (/^fz\(*/.test(value)) {
                filter[i] = value.slice(value.indexOf('(') + 1, value.indexOf(')'))
            } else {
                filter[i] = value
            }
        }
    }
    return filter
}
