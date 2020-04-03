import '../../css/family/rule.less'
import '../component/gj.scroxt.js'

import axios from 'axios'

var arr = []
axios.get('/family/GetRuleBroadCast')
    .then(
        (res) => {
            let data = res.data
            if (data.errno == 0) {
                if (data.data.length != 0) {
                    // init()
                    arr = data.data.slice(0, 51)
                    initScroll(arr)
                }
            }
        },
        (err) => {
            alert(err)
        }
    )

function initScroll (data) {
    new scroxt.Horizontal({
        target: '.h_notice',
        data,
        speed: -10
    })
}

let scrollWrap = document.querySelector('.h_scroll_wrap')

let scrollNum = 1
function init () {
    let scrollWrap = document.querySelector('.h_scroll_wrap')
    scrollWrap.innerHTML = `<p>${arr[0]}</p><p>${arr[1]}</p>`

    setTimeout(function () {
        ani()
    }, 1500)
}
function beginRun () {
    // 每条信息停留时间
    setTimeout(function () {
        run()
    }, 1500)
}

function run () {
    scrollNum++

    // 创建新数据
    let new_dom = document.createElement('p')
    new_dom.innerHTML = arr[scrollNum]

    // 重置transform位置：
    scrollWrap.style.transform = 'translateY(0%)'
    scrollWrap.style.WebkitTransform = 'translateY(0%)'

    // 删除第一条数据
    scrollWrap.children[0].parentNode.removeChild(scrollWrap.children[0])
    // 加入新数据
    scrollWrap.appendChild(new_dom)

    if (scrollNum < arr.length - 1) {
        ani()
    } else {
        // 轮播
        scrollNum = 1
        init()
    }
}

function ani () {
    let num = 0
    loop()

    function loop () {
        num += 2
        var aniframe
        if (num <= 50) {
            scrollWrap.style.transform = `translateY(-${num}%)`
            scrollWrap.style.WebkitTransform = `translateY(-${num}%)`

            aniframe = requestAnimationFrame(loop)
        } else {
            cancelAnimationFrame(aniframe)
            beginRun()
        }
    }
}
