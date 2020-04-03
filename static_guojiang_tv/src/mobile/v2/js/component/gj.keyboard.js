import '../../css/component/gj.keyboard.less';

/**
 * 数字键盘
 * @Author   smy
 * @DateTime 2018-01-10T17:23:28+0800
 * @param    {int}                 maxInputLength 可输入的最大长度
 * @param    {string}                 placeholder 弹起键盘默认的数字
 * @param    {int}                 minNum 键盘返回的最小值
 * @param    {int}                 maxNum 键盘返回的最大值
 * @param    {int}                 model 0: 默认，带手动确定按钮； 1：简洁模式，即时输入，仿微信
 * @param    {function}                 yes 点击确定按钮或model为1时实时输入结果的回调函数
 * @param    {function}                 cancel 关闭键盘的回调函数
 */
(function (win, doc) {
    function keyboard (opt) {
        var defaults = {
            maxInputLength: 12,
            placeholder: '0',
            minNum: 0,
            maxNum: -1,
            model: 0,
            yes: function () {},
            cancel: function () {}
        }
        opt = extend(defaults, opt)

        var modelClass = opt.model === 0 ? '' : 'hide'

        var pullDownClass = opt.model === 0 ? 'hide' : ''

        var keyboardClass = opt.model === 0 ? '' : 'pure'
        var html = `<div id="customNumKeyboard" class="${keyboardClass}">
                        <div class="cnk_wrap">
                            <div class="cnk_h clearfix ${modelClass}">
                                <input type="text" name="num" readonly="readonly" class="cnk_num" placeholder="${opt.placeholder}" value="${opt.placeholder}">
                                <div id="submitKeyboard" class="cnk_complete_btn">
                                    完成
                                </div>
                            </div>
                            <p class="cnk_pull_down ${pullDownClass}">﹀</p>
                            <ul class="cnk_k clearfix">
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                                <li>5</li>
                                <li>6</li>
                                <li>7</li>
                                <li>8</li>
                                <li>9</li>
                                <li>清除</li>
                                <li>0</li>
                                <li>
                                    <span>X</span>
                                </li>
                            </ul>
                        </div>
                        <em class="mask ${modelClass}"></em>
                    </div>`
        var dom = document.createElement('div')
        dom.innerHTML = html
        document.body.appendChild(dom.children[0])

        var inputNum = parseInt(opt.placeholder)

        var lis = document.querySelectorAll('.cnk_k li')

        var lisLength = lis.length

        var inputDom = document.querySelector('.cnk_num')

        // 键盘数字输入
        for (var i = 0; i < lisLength; i++) {
            lis[i].index = i
            lis[i].addEventListener('touchstart', function (e) {
                e.preventDefault()
                e.stopPropagation()

                if (this.index != 9 && this.index != 11) {
                    var oldNum = inputDom.value.trim()

                    var oldText = oldNum == '0' ? '' : oldNum
                    // 允许最长输入5位数
                    if (oldText.length <= opt.maxInputLength) {
                        inputNum = parseInt(oldText + this.innerText.trim())

                        setValueReturn()
                    }
                }
            }, {passive: false})
        }

        // 键盘回退
        lis[lisLength - 1].addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()

            var oldNum = String(inputNum)
            if (oldNum.length > 1) {
                inputNum = parseInt(oldNum.substring(0, oldNum.length - 1))
            } else {
                inputNum = 0
            }

            setValueReturn()
        }, {passive: false})

        // 键盘清除
        lis[lisLength - 3].addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()

            inputNum = 0
            setValueReturn()
        }, {passive: false})

        // 取消键盘
        document.querySelector('#customNumKeyboard .mask').addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()

            keyboard.prototype.remove()
            opt.cancel()
        }, {passive: false})

        document.querySelector('#customNumKeyboard .cnk_pull_down').addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()

            keyboard.prototype.remove()
            opt.cancel()
        }, {passive: false})

        // 确定键盘
        document.querySelector('#submitKeyboard').addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()

            keyboard.prototype.remove()
            filterInputNum(inputNum)
            opt.yes(inputNum)
        }, {passive: false})

        function filterInputNum (num) {
            inputNum = num > opt.minNum ? num : opt.minNum
            if (opt.maxNum != -1) {
                inputNum = inputNum <= opt.maxNum ? inputNum : opt.maxNum
            }
        }

        function setValueReturn () {
            if (opt.model !== 0) {
                filterInputNum(inputNum)
                opt.yes(inputNum)
            }
            inputDom.value = inputNum
        }
    }

    keyboard.prototype.remove = function () {
        var customNumKeyboard = document.getElementById('customNumKeyboard')
        customNumKeyboard.parentNode.removeChild(customNumKeyboard)
    }

    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, '')
    }

    /* Object.prototype.extend = function(def, opt){
        for(var key in opt){
            def[key] = opt[key]
        }
        return def
	} */
    Object.defineProperty(Object.prototype, 'extend', {
        value: function (def, opt) {
            for (var key in opt) {
                def[key] = opt[key]
            }
            return def
        },
        writable: true,
        enumerable: false
    })

    window.keyboard = keyboard

    if (typeof define === 'function') {
        define(function () {
            return keyboard
        })
    }
}(window, document))
