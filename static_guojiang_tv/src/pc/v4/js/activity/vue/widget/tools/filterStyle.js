/* eslint-disable */
export default function (overridingStyles, bf) {
    const filter = {}
    for (var i in overridingStyles) {
        const value = overridingStyles[i]
        if (/[0-9]/.test(value) && !/[a-zA-Z]/.test(value)) { // => 数字或者数字字符串
            if (Object.prototype.toString.call(value) === '[object Number]') { // => 数字
                filter[i] = eval(value + '/' + bf) + 'px'
            } else { // => 数字字符串
                const numArr = value.split(/\s+/)
                let str = ''
                numArr.forEach(function (vl) {
                    str += ' ' + eval(vl + '/' + bf) + 'px'
                })
                filter[i] = str
            }
        } else {
            if (/^fz\(*/.test(value)) { // =>'fz()'
                filter[i] = value.slice(value.indexOf('(') + 1, value.indexOf(')'))
            } else { // =>'*'
                filter[i] = value
            }
        }
    }
    return filter
}
