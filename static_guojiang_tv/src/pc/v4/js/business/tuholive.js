'use strict'

// import Vue from 'vue'
// import axios from 'axios'
// import user from 'user'
// import layer from 'layer'; // desc: 弹出层插件

import '../../css/business/tuholive.less'

// new Vue({
//     el: '#app',
//     data: {},
//     mounted: function () {
//     },
//     methods: {
//     }
// })

var timer = null

function scrollTo (targetClass) {
    var target = document.querySelector(targetClass)
    var html = document.documentElement

    timer && cancelAnimationFrame(timer)

    function animateSTO (y) {
        var gap = Math.abs(html.scrollTop - y)
        var step = Math.max(gap / 20, 10)
        if (gap < 10) {
            step = gap
        }
        if (html.scrollTop < y) {
            step *= 1
        } else {
            step *= -1
        }

        if (Math.abs(html.scrollTop - y) < 1 ||
            (Math.abs(html.scrollTop - (html.offsetHeight - html.clientHeight)) <= 1 && step > 0) ||
            (html.scrollTop <= 0 && step < 0)) {
            return
        }

        html.scrollTop += step

        timer = requestAnimationFrame(() => {
            animateSTO(y)
        })
    }

    timer = requestAnimationFrame(() => {
        animateSTO(target.offsetTop)
    })
}

function init () {
    [].forEach.call(document.querySelectorAll('.header .btns .xg-btn'), btn => {
        btn.addEventListener('click', () => {
            var target = btn.getAttribute('data-target')
            target && scrollTo(btn.getAttribute('data-target'))
        })
    })
}

window.onload = function () {
    init()
}
