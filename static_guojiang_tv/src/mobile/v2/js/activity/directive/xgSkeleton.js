/**
 * @file xgSkeleton.js
 * @description 骨架屏Vue指令
 * @author mrzjd
 * @date 2018/9/19
 *
 * **************** Usage ****************
 * import 'xgSkeleton.js'
 *
 * *** sample in template ***
    <div :class="" :key="index" :skt-state="skeletonState" v-skt="#eee">
        <div class="avatar">
            <span class="cowns"></span>
            <img :src="item.headPic" :alt="item.uname" need-skt>
            <span class="vip" v-show="item.isVip"></span>
        </div>
        <span class="uname" need-skt>{{ item.uname }}</span>
        <div class="info" need-skt>
            <span class="total">{{ item.score }}</span>
            <span class="label">USD</span>
        </div>
        <div :class="['btn-follow', item.followed ? 'active' : '']" need-skt></div>
    </div>
 *
 * *** 用法点 ***
 *
 * 1. 当一个dom结构需要骨架屏占屏时
 * --> v-skt="'#eee'" // 占屏元素背景色 默认'#eee'
 * --> :skt-state="state" // 占屏状态 true 显示骨架 false 显示原元素
 *
 * 2. 内部元素需要指定哪些部分需要占屏
 * --> need-skt // 不需要值 不存在该属性则该元素不占屏
 *
 * 3. skt-list="7"
 * --> 该属性用于骨架屏的ul列表渲染(不在li上使用是因为 骨架屏的显示数量不应与列表数量相同，而是首屏加载时的数量)
 * --> 值用于显示列表item的数量
 * --> ul 初始化占屏元素数量应该为1 并根据第一个li创建value个列表
 *
 * 4. Attention 注意点
 * --> 需要手动控制骨架屏的显隐状态
 * --> 当元素为一个list列表时，初始化占屏元素应该为1
 *
 * *** 原理 ***
 *
 * 1. clone 当前元素结构 并复制为SkeletonNode到该元素后的位置上
 * 2. 隐藏 原Node 显示SkeletonNode
 * 3. walk Skeleton 遍历节点 寻找 need-skt 的元素并reset该元素的样式
 * 4. 通过state控制显示隐藏
 *
 * *****************************************
 */

import Vue from 'vue'

if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (fn) {
        Array.prototype.forEach.call(this, fn)
    }
}

let utils = {
    walk (node, opt) {
        if (!node || !opt) return
        node.childNodes.forEach((cNode) => {
            if (cNode.nodeType !== 1) { // 过滤元素节点
                return
            }
            if (cNode.hasAttribute('need-skt')) {
                opt(cNode)
            } else {
                if (cNode.childNodes.length === 0) {
                    cNode.style.display = 'none'
                } else if (cNode.childNodes.length === 1 && cNode.childNodes[0].nodeType !== 1) {
                    cNode.style.display = 'none'
                } else {
                    this.walk(cNode, opt)
                }
            }
        })
    }
}

Vue.directive('skt', {
    // bind () {},
    inserted (el, binding) { // 插入到dom时触发 保证parentNode存在
        var bgColor = binding.value || '#eee'

        var seletonNode = el.cloneNode(true)
        seletonNode.setAttribute('data-skeleton-id', Date.now())

        el.style.display = 'none'
        seletonNode.style.display = 'none'
        seletonNode.className += ' xg-skeleton'
        el.parentNode.insertBefore(seletonNode, el)

        if (el.hasAttribute('skt-list')) {
            var liLen = el.getAttribute('skt-list')
            // 1. 取第一个li遍历生成节点数
            var liHtml = el.childNodes[0].cloneNode(true)

            seletonNode.innerHTML = ''

            for (let i = 0; i < liLen; i++) {
                let target = liHtml.cloneNode(true)
                utils.walk(target, walkOpt)
                seletonNode.appendChild(target)
            }
        } else {
            utils.walk(seletonNode, walkOpt)
        }

        function walkOpt (cnode) {
            cnode.innerHTML = ''
            cnode.style.background = bgColor
            cnode.style.borderRadius = '6px'
            cnode.style.position = 'static'
            cnode.style.border = 'none'

            if (cnode.tagName.toLowerCase() === 'img') {
                var span = document.createElement('div')
                span.style.width = '100%'
                span.style.height = '100%'
                span.style.borderRadius = '50%'
                span.style.background = bgColor
                span.style.position = 'relative'

                cnode.parentNode.replaceChild(span, cnode)
            }
        }
    },
    update (el, binding, vnode) { // 当前vnode更新之后
        if (vnode.data.attrs['skt-state']) {
            el.parentNode.querySelectorAll('.xg-skeleton').forEach((node) => {
                node.style.display = ''
            })
            el.style.display = 'none'
        } else {
            el.parentNode.querySelectorAll('.xg-skeleton').forEach((node) => {
                node.style.display = 'none'
            })
            el.style.display = ''
        }
    }
    // componentUpdated () {},
    // unbind () {}
})
