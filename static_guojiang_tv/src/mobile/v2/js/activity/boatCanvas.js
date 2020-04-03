define(function (require, exports) {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')

    var moveCanvas = document.getElementById('move-canvas')
    var ctxMoveCanvas = moveCanvas.getContext('2d')
    ctx.translate(0, 80)
    ctxMoveCanvas.translate(0, 80)

    var runner = []
    var runway = [] // 各个线段的节点集合
    var distance = 0 // 已经移动的距离
    var sumLineDistance = 0 // 当前作用的线段及以前经过的线段的长度和
    var sumMoney = 0
    var currentLineMoney = 0 //
    var rateLine = [] // 各个线段(5段) 克拉/长度 的比率
    var rateIndex = 0
    var finallyX = 0 // 终点
    var finallyY = 0 // 终点

    var headAvator
    var headLongAvator
    var xheadAvator
    var xheadLongAvator
    var dogGif = []
    var dogGifBack = []
    var directAvator = true

    var avatorPosition = {x: 0, y: 0} // 上一个头像坐标位置
    var avatorPositionLock = true

    var pointArr = [] // 每个头像的圆点的xy坐标

    exports.init = function (runnerArr) {
        initSprite()
        generateRunner(runnerArr)
        drawImage()
        canvasClick()
    }

    function initSprite () {
        headAvator = new Image()
        headAvator.src = '../../'
        xheadAvator = new Image()
        xheadAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/xhead.png'
        headLongAvator = new Image()
        headLongAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/head.png'
        xheadLongAvator = new Image()
        xheadLongAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/xhead.png'

        var avatorMove0 = new Image()
        avatorMove0.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c1.png'
        dogGif[0] = avatorMove0
        var avatorMove1 = new Image()
        avatorMove1.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c1.png'
        dogGif[1] = avatorMove1
        var avatorMove2 = new Image()
        avatorMove2.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c1.png'
        dogGif[2] = avatorMove2

        var avatorMove0 = new Image()
        avatorMove0.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c2.png'
        dogGifBack[0] = avatorMove0
        var avatorMove1 = new Image()
        avatorMove1.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c2.png'
        dogGifBack[1] = avatorMove1
        var avatorMove2 = new Image()
        avatorMove2.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/c2.png'
        dogGifBack[2] = avatorMove2
    }

    /**
     * [drawImage canvas加载背景图]
     */
    function drawImage () {
        var img = new Image()
        img.onload = function () {
            ctx.drawImage(img, 0, 0)
            readyMove()
        }
        img.src = '//static.guojiang.tv/mobile/v2/img/activity/dragonBoat/sd.png'
    }

    /**
     * [readyMove 准备移动并生成数据]
     */
    function readyMove () {
        runway = generateRoute() // => [x:number,y:number][]
        rateLine = getRateLine(runway) // => number[]
        moveST()
    }

    var unit = 8

    var prevPoint = {} // 上一个坐标
    var currentPoint = {x: 0, y: 0} // 当前坐标

    var lineLength = 0 // 当前段的长度
    var currentLineDistance = 0 // 当前线段移动的距离

    var raf = 0

    /**
     * [jumpPoint 判断当前作用线段]
     */
    function jumpPoint () {
        if (distance < sumLineDistance) return // 如果移动的距离小于已经剪切线段的长度 则return
        // 终点
        if (runway.length === 0) {
            finallyRunner()
            clearTimeTask(raf)
            return
        }
        // 移动至当前线段尾节点
        if (runway[0].length === 0) {
            directAvator = !directAvator
            rateIndex++
            console.log(rateIndex)
            runway.splice(0, 1)
            console.log(runway)
            sumMoney = [0, 51111, 111111, 311111, 511111, 811111][rateIndex]
        }
        sumMoney += currentLineMoney
        prevPoint = currentPoint

        currentPoint = runway[0].splice(0, 1)[0] // => {x:x,y:y}
        if (!prevPoint.x) {
            prevPoint = currentPoint
            ctx.moveTo(prevPoint.x, prevPoint.y)
            return
        }
        lineLength = +Math.sqrt(Math.pow((currentPoint.x - prevPoint.x), 2) + Math.pow((currentPoint.y - prevPoint.y), 2))
        sumLineDistance += lineLength
        currentLineDistance = 0
        currentLineMoney = 0
    }

    /**
     * [moveST 帧操作]
     */
    function moveST () {
        currentLineDistance += unit
        distance += unit
        currentLineMoney = currentLineDistance * rateLine[rateIndex]

        raf = setTimeTask(moveST)
        jumpPoint()
        var diffX = lineLength !== 0 ? currentLineDistance * Math.abs(currentPoint.x - prevPoint.x) / lineLength : 0
        var diffY = lineLength !== 0 ? currentLineDistance * Math.abs(currentPoint.y - prevPoint.y) / lineLength : 0
        var x = prevPoint.x < currentPoint.x ? prevPoint.x + diffX : prevPoint.x - diffX
        var y = prevPoint.y < currentPoint.y ? prevPoint.y + diffY : prevPoint.y - diffY
        finallyX = x
        finallyY = y
        if (calculatError(sumMoney + currentLineMoney)) return
        avatorStop(sumMoney + currentLineMoney, x, y)
        lineTo(x, y)
    }

    function calculatError (num) {
        var space = [0, 51111, 111111, 311111, 511111, 811111]
        return num > space[rateIndex + 1]
    }

    var dogGifIndex = 0
    function lineTo (x, y) {
        ctxMoveCanvas.clearRect(0, 0, 1322, 900)
        if (directAvator) {
            ctxMoveCanvas.drawImage(dogGif[~~(dogGifIndex / 10)], x - (98 / 2), y - (68 / 2), 98, 68)
        } else {
            ctxMoveCanvas.drawImage(dogGifBack[~~(dogGifIndex / 10)], x - (98 / 2), y - (68 / 2), 98, 68)
        }
        dogGifIndex++
        if (dogGifIndex >= 30) dogGifIndex = 0
    }

    function finallyRunner () {
        var len = runner.length
        if (len === 0) return
        while (len) {
            avatorStop(8888888888, finallyX, finallyY)
            len--
        }
    }

    function avatorStop (num, x, y) {
        if (typeof runner[0] !== 'undefined' && runner[0].money <= num) {
            var imgObj = runner.splice(0, 1)[0]
            var img = new Image()
            img.onload = function () {
                ctx.beginPath()
                ctx.save()
                avatorPositionLock = true
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 47, y - 141)
                    ctx.translate(x, y - 83) // 头像的原点
                    pointArr.push({
                        x: x,
                        y: y - 83 + 80,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 73 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -73 / 2, -73 / 2, 73, 73)
                } else {
                    ctx.drawImage(xheadAvator, x - 30, y - 100)
                    ctx.translate(x, y - 70) // 头像的原点
                    pointArr.push({
                        x: x,
                        y: y - 70 + 80,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 56 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -56 / 2, -56 / 2, 56, 56)
                }
                ctx.restore()
                ctx.closePath()

                avatorPosition.x = x
                avatorPosition.y = y
            }
            img.src = imgObj.src
        }
    }

    /**
     * [getRateLine 得到各个节点的比率]
     * @param  {[x:number,y:number][]} wayArr [轨道节点]
     * @return {number[]}        [各个节点的比率]
     */
    function getRateLine (wayArr) {
        var result = []
        var money = [51111, 60000, 200000, 200000, 300000]
        for (var i = 0, len = wayArr.length; i < len; i++) {
            var distance = 0
            for (var j = 0, jLen = wayArr[i].length; j < jLen; j++) {
                if (j === 0) continue
                var temp = Math.sqrt(Math.pow(wayArr[i][j]['x'] - wayArr[i][j - 1]['x'], 2) + Math.pow(wayArr[i][j]['y'] - wayArr[i][j - 1]['y'], 2))
                distance += temp
            }
            result.push(money[i] / distance) // => 单位距离的克拉
        }
        return result // => 单位距离的克拉数组集
    }

    /**
     * [generateRunner 得到主播的信息数组]
     */
    var raceIndex = 0
    function generateRunner (runnerArr) {
        for (var i = 1; i <= 5; i++) {
            var len = runnerArr[i].length
            runnerArr[i].forEach(function (value, index) {
                runner.push({
                    src: value['head_pic_1'],
                    rid: value['rid'],
                    mid: value['mid'],
                    money: value['num'],
                    top: ++raceIndex
                })
            })
        }
        console.log(runner)
    }

    /**
     * [generateRoute 得到路径点数组]
     * @returns {[x:number,y:number][]} [轨道的坐标点]
     */
    function generateRoute () {
        var runway0 = [{'x': 246, 'y': 135}, {'x': 395, 'y': 143}, {'x': 522, 'y': 147}, {'x': 603, 'y': 147}, {'x': 723, 'y': 139}, {'x': 846, 'y': 124}, {'x': 931, 'y': 122}, {'x': 990, 'y': 141}, {'x': 1014, 'y': 163}, {'x': 1021, 'y': 188}]

        var runway1 = [{'x': 1015, 'y': 218}, {'x': 994, 'y': 241}, {'x': 954, 'y': 265}, {'x': 899, 'y': 279}, {'x': 829, 'y': 285}, {'x': 715, 'y': 288}, {'x': 533, 'y': 275}, {'x': 384, 'y': 267}, {'x': 328, 'y': 268}, {'x': 262, 'y': 274}, {'x': 212, 'y': 291}, {'x': 198, 'y': 308}, {'x': 197, 'y': 325}]

        var runway2 = [{'x': 198, 'y': 359}, {'x': 236, 'y': 391}, {'x': 297, 'y': 407}, {'x': 372, 'y': 410}, {'x': 475, 'y': 412}, {'x': 593, 'y': 402}, {'x': 769, 'y': 387}, {'x': 919, 'y': 376}, {'x': 1007, 'y': 375}, {'x': 1067, 'y': 382}, {'x': 1120, 'y': 402}, {'x': 1137, 'y': 422}, {'x': 1140, 'y': 441}]

        var runway3 = [{'x': 1129, 'y': 477}, {'x': 1095, 'y': 501}, {'x': 1047, 'y': 513}, {'x': 988, 'y': 525}, {'x': 870, 'y': 531}, {'x': 728, 'y': 528}, {'x': 582, 'y': 515}, {'x': 496, 'y': 511}, {'x': 421, 'y': 512}, {'x': 358, 'y': 510}, {'x': 300, 'y': 520}, {'x': 263, 'y': 536}, {'x': 239, 'y': 559}, {'x': 231, 'y': 582}]

        var runway4 = [{'x': 241, 'y': 624}, {'x': 272, 'y': 652}, {'x': 326, 'y': 673}, {'x': 387, 'y': 688}, {'x': 463, 'y': 698}, {'x': 576, 'y': 702}, {'x': 705, 'y': 699}, {'x': 805, 'y': 690}, {'x': 917, 'y': 673}, {'x': 997, 'y': 660}, {'x': 1086, 'y': 635}]

        return [runway0, runway1, runway2, runway3, runway4]
    }

    function canvasClick () {
        var canvas = document.querySelector('#move-canvas')
        canvas.addEventListener('click', function (event) {
            var clientX = event.clientX
            var clientY = event.clientY
            var obj = canvas.getBoundingClientRect()
            var offsetX = clientX - obj.left
            var offsetY = clientY - obj.top
            console.log(offsetY)
            goRoom(offsetX, offsetY)
        })
    }

    function goRoom (x, y) {
        var len = pointArr.length
        for (var i = len; i > 0; i--) {
            if (x < pointArr[i - 1]['x'] + 28 && x > pointArr[i - 1]['x'] - 28 && y < pointArr[i - 1]['y'] + 28 && y > pointArr[i - 1]['y'] - 28) {
                window.open('/' + pointArr[i - 1]['mid'])
                break
            }
        }
    }

    var setTimeTask = (function () {
        return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function (callback) {
                  setTimeout(callback, 1000 / 60)
              }
    })()

    var clearTimeTask = (function () {
        return window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.clearTimeout
    })()
})
