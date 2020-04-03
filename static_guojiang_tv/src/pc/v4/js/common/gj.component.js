/**
 * @usage   : guojiang common js
 * @author  : Smy
 * @email   : morie@guojiang.tv
 * @date    : 2015-08-24
 */
define(function (require, exports, module) {
    return function (jquery) {
        (function ($) {
            // placeholder
            $.fn.gjPlaceHolder = function (opt) { // options 经常用这个表示有许多个参数。
                var defaults = {
                    fontSize: '18px',
                    lineHeight: '',
                    height: '18px',
                    placeHolderColor: '#aaa',
                    top: 0,
                    left: 0,
                    inputTextColor: '#000',
                    content: '',
                    align: 'left'
                }

                var opt = $.extend({}, defaults, opt)
                return this.each(function () {
                    var spanHtml = $('<span class="gj_place_holder" style="position: absolute;top: 0;left: 0;vertical-align: middle;cursor: text;"></span>')

                    var _this = $(this)

                    var offset = _this.offset()

                    var _top = offset.top

                    var _left = offset.left

                    var relParent = opt.relParent || document.body
                    spanHtml.css({
                        'position': 'absolute',
                        'vertical-align': 'middle',
                        'top': ((relParent == document.body) ? opt.top + _top : opt.top) + 'px',
                        'left': ((relParent == document.body) ? opt.left + _left : opt.left) + 'px',
                        'font-size': opt.fontSize,
                        'line-height': opt.lineHeight != '' ? ope.lineHeight : _this.height() + 'px',
                        'height': _this.height(),
                        'color': opt.placeHolderColor,
                        'width': _this.width(),
                        'padding-left': '10px',
                        'text-align': opt.align
                    }).html(opt.content).click(function () {
                        $(this).hide()
                        var val_input = $(this).siblings('input').length != 0 ? 'input' : 'textarea'
                        $(this).siblings(val_input).focus()
                    })
                    if ($(relParent).find('.gj_place_holder')) {
                        $(relParent).find('.gj_place_holder').remove()
                    }
                    $(relParent).append(spanHtml)
                    _this.css({
                        'color': opt.inputTextColor
                    }).focus(function () {
                        spanHtml.hide()
                    }).blur(function () {
                        function showPlaceholder () {
                            _this.siblings('.gj_place_holder').show()
                        }

                        if (!_this.val()) {
                            showPlaceholder()
                        } else {
                            // 兼容发送消息这种blur后input有内容，点击发送后才会清空内容，这时才显示placeholder
                            setTimeout(function () {
                                if (!_this.val()) {
                                    showPlaceholder()
                                }
                            }, 300)
                        }
                    }).on('input', function () {
                        if (_this.val()) {
                            spanHtml.hide()
                        }
                    })
                    if (relParent == document.body) { // 相对于body定位的才需要监听resize事件
                        $(window).resize(function () {
                            offset = _this.offset(),
                            _top = offset.top,
                            _left = offset.left
                            spanHtml.css({
                                'top': opt.top + _top + 'px',
                                'left': opt.left + _left + 'px'
                            })
                        })
                    }
                    if (_this.val()) {
                        spanHtml.hide()
                    }
                })
            }

            /*
             *多图片滑动浏览
             *usage:
             *  html:
             *     <div class="slide_img_wrap clearfix">
             *           <a href="javascript:;" class="prev_img_btn" data-able="true" ></a>
             *           <a href="javascript:;" class="next_img_btn " data-able="true"></a>
             *           <div class="slide_img_contain">
             *               <ul class="slide_img_ul clearfix">
             *                   <li></li>
             *               </ul>
             *               <!--可选，用于图片轮播显示页码, 样式自己定义-->
             *               <ul class="slide_point clearfix">
             *                   <li class="active"></li>
             *                   <li></li>
             *               </ul>
             *           </div>
             *     </div>
             *  js:
             *      $('.slide_img_wrap').exchangeImg({
             *           visibleNum : 4,
             *           singleDomWidth: 225,
             *           slideDomNum: 4,
             *           autoPlay: false,
             *           speed: 3000
             *       });
             */
            $.fn.exchangeImg = function (opt) {
                var defaults = {
                    visibleNum: '',
                    singleDomWidth: '',
                    slideDomNum: '',
                    autoPlay: false, // 用于轮播，是否自动轮播
                    speed: 3000 // 用于轮播，间隔时间
                }

                var opt = $.extend({}, defaults, opt)

                return this.each(function () {
                    var imgUl = $(this).find('.slide_img_ul')

                    var pointUl = $(this).find('.slide_point')

                    var point_dom = pointUl.find('li')

                    var next_img_btn = $(this).find('.next_img_btn')

                    var prev_img_btn = $(this).find('.prev_img_btn')

                    if (opt.autoPlay) {
                        // 克隆第一个元素插到最后
                        var cloneDom = imgUl.find('li').eq(0).clone()
                        imgUl.append(cloneDom)
                    }

                    var num = opt.visibleNum

                    var singleDomWidth = opt.singleDomWidth

                    var slideWidth = opt.slideDomNum * singleDomWidth

                    var slideIndex = 0
                    // 初始轮播的页码

                    var childList = imgUl.children()

                    var len = childList.length

                    var totalLen = childList.length * singleDomWidth

                    var visib_width = num * singleDomWidth

                    if (len <= num && !opt.autoPlay) {
                        next_img_btn.css('visibility', 'hidden')
                        prev_img_btn.css('visibility', 'hidden')
                    }

                    imgUl.css('width', totalLen)

                    // 轮播
                    if (opt.autoPlay) {
                        setTimeout(play, opt.speed)
                        function play () {
                            goNext()
                            setTimeout(play, opt.speed)
                        }
                    }

                    var slideFlag = false
                    function goNext () {
                        if (slideFlag) return

                        slideFlag = true
                        slideIndex++
                        slideIndex = slideIndex >= len ? len - 1 : slideIndex

                        // 原点控制条
                        if (slideIndex == len - 1) {
                            setPointIndex(0)
                        } else {
                            setPointIndex(slideIndex)
                        }

                        imgUl.animate({
                            left: '-' + singleDomWidth * slideIndex + 'px'
                        }, function () {
                            slideFlag = false

                            if (slideIndex == len - 1) {
                                imgUl.css('left', 0)
                                slideIndex = 0
                            }
                        })
                    }

                    function goPrev () {
                        if (slideFlag) return

                        slideFlag = true
                        if (slideIndex == 0) {
                            imgUl.css('left', '-' + singleDomWidth * (len - 1) + 'px')
                            slideIndex = len - 1
                        } else {
                            slideIndex--
                        }

                        // 原点控制条
                        setPointIndex(slideIndex)

                        imgUl.animate({
                            left: '-' + singleDomWidth * slideIndex + 'px'
                        }, function () {
                            slideFlag = false

                            if (slideIndex == 0) {
                                imgUl.css('left', '-' + singleDomWidth * (len - 1) + 'px')
                                slideIndex = len - 1
                            }
                        })
                    }

                    function goIndex (index) {
                        imgUl.css('left', '-' + singleDomWidth * index + 'px')
                        slideIndex = index
                        setPointIndex(index)
                    }

                    function setPointIndex (index) {
                        pointUl.find('li').removeClass('active')
                        pointUl.find('li').eq(index).addClass('active')
                    }

                    point_dom.click(function () {
                        var _index = $(this).index()
                        goIndex(_index)
                    })

                    next_img_btn.click(function () {
                        var _this = $(this)

                        var able = _this.attr('data-able')

                        if (opt.autoPlay) {
                            goNext()
                            return
                        }

                        if (len < num || imgUl.css('left') == (visib_width - totalLen + 'px')) {
                            return
                        }
                        _this.attr('data-able', 'false')
                        if (able == 'true') {
                            imgUl.animate({
                                left: '-=' + slideWidth + 'px'
                            }, function () {
                                _this.attr('data-able', 'true')
                                if (len < num || parseInt(imgUl.css('left')) <= (visib_width - totalLen)) {
                                    next_img_btn.css('visibility', 'hidden')
                                }
                                if (imgUl.css('left') != '0px') {
                                    prev_img_btn.css('visibility', 'visible')
                                }
                            })
                        }
                    })
                    prev_img_btn.click(function () {
                        var _this = $(this)

                        var able = _this.attr('data-able')

                        if (opt.autoPlay) {
                            goPrev()
                            return
                        }

                        if (imgUl.css('left') == '0px') {
                            return
                        }
                        _this.attr('data-able', 'false')
                        if (able == 'true') {
                            imgUl.animate({
                                left: '+=' + slideWidth + 'px'
                            }, function () {
                                _this.attr('data-able', 'true')
                                if (imgUl.css('left') == '0px') {
                                    prev_img_btn.css('visibility', 'hidden')
                                }
                                if (len != num && imgUl.css('left') != (visib_width - totalLen + 'px')) {
                                    next_img_btn.css('visibility', 'visible')
                                }
                            })
                        }
                    })
                })
            }

            /**
         * regExp test
         */
            $.fn.gjRegExpTest = function (opt) {
                var defaults = {
                    type: '',
                    content: ''
                }

                var opt = $.extend({}, defaults, opt)

                var regExpMap = {
                    'common': /[\s\S]*/, // 匹配任何内容
                    'noChinese': /^[^\u4e00-\u9fa5]{0,}$/, // 非中文
                    'letter': /^[a-zA-Z]+([a-zA-Z]|\s)*$/, // 纯字母
                    'number': /^\d+$/, // 匹配数字
                    'numberLimit10': /^\d{10}$/, // 匹配10位数字
                    'creditMonth': /^(([0][1-9])|([1][0-2]))$/,
                    'creditYear': /^(\d){1,2}$/,
                    'creditCvc': /^(\d){3,4}$/,
                    'creditNumberUSA': /^(\d){5,19}$/,
                    'email': /^\w+([-.]\w+)*@\w+([-]\\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/,
                    'mobile': /^1[0-9]{10}$/, // 指的是中国的手机号码
                    'mobileCN': /^1[0-9]{10}$/, // 中国1开头的10为数字
                    'mobileHK': /^[0-9]{8}$/, // 香港
                    'mobileMacau': /^[0-9]{8}$/, // 澳门
                    'mobileTW': /^[0-9]{9,10}$/, // 台湾
                    'password': /^[a-zA-Z0-9]{6,22}$/,
                    'registPassword': /^[0-9a-zA-Z_]{6,22}$/, // 验证由数字、26个英文字母或者下划线组成的密码
                    'telephone': /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/,
                    'date': /^\d{4}-\d{2}-\d{2}$/, // 简单日期格式判断  1990-12-12
                    'hour': /^(1|0)[0-9]|2[0-3]$/, // 小时格式判断        24小时制
                    'minute': /^[0-5][0-9]$/ // 分钟格式判断
                }

                var regExpErrMap = {
                    'email': '邮箱格式错误',
                    'mobile': '手机格式错误',
                    'letter': '请输入英文字母',
                    'noChinese': '此处不允许输入中文',
                    'number': '请输入正确数字',
                    'numberLimit10': '请输入正确的10位数字',
                    'creditMonth': '请输入2位的月数',
                    'creditYear': '请输入2位的年数',
                    'creditCvc': '请输入正确的验证码',
                    'creditNumberUSA': '请输入正确的卡号',
                    'mobileCN': '手机格式错误(中国)',
                    'mobileHK': '手机格式错误(香港)',
                    'mobileMacau': '手机格式错误(澳门)',
                    'mobileTW': '手机格式错误(台湾)',
                    'telephone': '座机格式错误',
                    'password': '密码长度必须为6-22位',
                    'registPassword': '密码格式错误',
                    'date': '请选择日期',
                    'hour': '请输入正确的小时',
                    'minute': '请输入正确的分钟'
                }

                return {code: regExpMap[opt.type].test(opt.content), msg: regExpErrMap[opt.type]}
            }
            /*
        * 滚动监听，电梯导航
        * usage:
        * html:
        *   <ul class="wq_scroll_nav">
        *        <li class="active wq_scroll_navbar">
        *        </li>
        *        <li class="wq_scroll_navbar">
        *        </li>
        *        <li class="wq_scroll_navbar">
        *        </li>
        *    </ul>
        *    另对各个滚动的内容块加类：wq_scroll_part
        * js:
        *     require('component')($);//共享给jquery
        *     $('.wq_scroll_nav').wqScrollSpy();
         */
            $.fn.wqScrollSpy = function (options) {
                var defaults = {
                    wq_scroll_nav: '', // 对浮动导航整体设置class
                    wq_scroll_navbar: '', // 对导航标签设置class
                    wq_scroll_part: '', // 对滚动的每个内容块设置class
                    ActiveControlClass: '', // 导航块选中时的样式
                    beforeScrollArea: '', // 未到达滚动区域时，浮动导航执行的函数,例:beforeScrollArea:function(){ $('.wq_scroll_nav').hide(); },
                    scrollToArea: '', // 到达滚动区域时，浮动导航执行的函数
                    scrollOutArea: '', // 离开滚动区域时，滚动导航执行的函数，默认隐藏
                    whenInArea_call: '' // 当在滚动区域滚动时的回调函数
                }

                var opts = $.extend({}, $.fn.wqScrollSpy.defaults, options)

                var wq_scroll_nav = opts.wq_scroll_nav ? opts.wq_scroll_nav : 'wq_scroll_nav'

                var wq_scroll_navbar = opts.wq_scroll_navbar ? opts.wq_scroll_navbar : 'wq_scroll_navbar'

                var wq_scroll_part = opts.wq_scroll_part ? opts.wq_scroll_part : 'wq_scroll_part'

                var ActiveControlClass = opts.ActiveControlClass ? opts.ActiveControlClass : 'active'

                var beforeScrollArea = opts.beforeScrollArea

                var scrollToArea = opts.scrollToArea

                var scrollOutArea = opts.scrollOutArea

                var whenInArea_call = opts.whenInArea_call

                var ishide = opts.ishide

                var doc_H = $(document).height()

                var win_H = $(window).height()

                var wq_scroll_part_H = 0

                var every_part_top = new Array()

                var every_navbar = new Array()

                $('.' + wq_scroll_part).each(function () {
                    wq_scroll_part_H += $(this).height()
                })

                // 导航如需要隐藏或其他样式，刚加载页面时隐藏导航或执行其他样式
                function changeScrollpartStatus () {
                    var _scrollT = $(window).scrollTop()

                    var scrollpartTop = $('.' + wq_scroll_part).eq(0).offset().top
                    if (_scrollT < scrollpartTop && beforeScrollArea && typeof beforeScrollArea === 'function') {
                        beforeScrollArea()
                    }
                    if (_scrollT > scrollpartTop && _scrollT < wq_scroll_part_H + $('.' + wq_scroll_part).offset().top && scrollToArea && typeof scrollToArea === 'function') {
                        scrollToArea()
                    }
                }

                function scrollPartEvent () {
                    var scrollT = $(window).scrollTop()
                    $('.' + wq_scroll_part).each(function (i) {
                        every_part_top[i] = $(this).offset().top
                        every_navbar[i] = $('.' + wq_scroll_navbar).eq(i)

                        // 判断当前页面位置，并执行相应函数
                        changeScrollpartStatus()

                        // 设置导航标签active样式
                        if (scrollT >= every_part_top[i]) {
                            $('.' + wq_scroll_navbar).removeClass(ActiveControlClass)
                            every_navbar[i].addClass(ActiveControlClass)
                        }

                        // 判断滚动区域的最后一部分执行函数
                        var wq_scroll_part_L = $('.' + wq_scroll_part).length

                        if (i == (wq_scroll_part_L - 1)) {
                            var last_part_offset_top = every_part_top[i]

                            var last_part_H = $(this).height()

                            var wq_scroll_nav_H = $('.' + wq_scroll_nav).height()

                            if (scrollT > (last_part_offset_top + last_part_H - wq_scroll_nav_H)) {
                                if (scrollOutArea && typeof scrollOutArea === 'function') {
                                    scrollOutArea()
                                }
                            }
                        }
                    })
                }
                $(window).on('scroll', function () {
                    scrollPartEvent()
                    if (whenInArea_call && typeof whenInArea_call === 'function') {
                        whenInArea_call()
                    }
                })
                $('.' + wq_scroll_navbar).click(function () {
                    $('.' + wq_scroll_navbar).removeClass(ActiveControlClass)
                    $(this).addClass(ActiveControlClass)
                })

                changeScrollpartStatus()

                return this
            }

            /**
         * 时间倒计时
         * 时分秒的dom的class名字需要命名为: cdt_h, cdt_m, cdt_i
         * @Author   smy
         * @DateTime 2017-05-19T16:03:30+0800
         * @param    {[type]}                 options 传入倒计时时间，单位秒；以及倒计时结束后的回调函数
         */
            $.fn.timeCountDown = function (options) {
                var defaults = {
                    time: 0,
                    hClass: '.cdt_h', // 时分秒对应的dom class
                    mClass: '.cdt_m',
                    iClass: '.cdt_i',
                    callback: function () {}
                }
                var opt = $.extend({}, defaults, options)

                var time = opt.time

                return this.each(function () {
                    var timer = setInterval(function () {
                        var day = 0

                        var hour = 0

                        var minute = 0

                        var second = 0// 时间默认值
                        if (time > 0) {
                            day = Math.floor(time / (60 * 60 * 24))
                            hour = Math.floor(time / (60 * 60)) - (day * 24)
                            minute = Math.floor(time / 60) - (day * 24 * 60) - (hour * 60)
                            second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
                        } else {
                            opt.callback()
                            clearInterval(timer)
                        }

                        // if (day <= 9) day = '0' + day;
                        hour = parseInt(hour) + parseInt(day * 24)
                        if (hour <= 9) {
                            hour = '0' + hour
                        }
                        if (minute <= 9) minute = '0' + minute
                        if (second <= 9) second = '0' + second
                        $(opt.hClass).html(hour)
                        $(opt.mClass).html(minute)
                        $(opt.iClass).html(second)
                        // $('.sp_i').html(second);
                        time--
                    }, 1000)
                })
            }
        })(jquery)
    }
})
