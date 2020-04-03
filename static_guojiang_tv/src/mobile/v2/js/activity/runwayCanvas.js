import common from '../common/common.js'

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var moveCanvas = document.getElementById('move-canvas')
var ctxMoveCanvas = moveCanvas.getContext('2d')

var scaleRate = 3 // canvas缩放的比率
ctx.translate(0, 50 * scaleRate)
ctxMoveCanvas.translate(0, 50)

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

var screenRate = 320 / 1080 // app的比率

function init (runnerArr) {
    initSprite()
    generateRunner(runnerArr)
    readyMove()
    // drawImage();
    canvasClick()
}

function initSprite () {
    headAvator = new Image()
    headAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/head.png'
    xheadAvator = new Image()
    xheadAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/xhead.png'
    headLongAvator = new Image()
    headLongAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/headlong.png'
    xheadLongAvator = new Image()
    xheadLongAvator.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/xheadlong.png'

    var avatorMove0 = new Image()
    avatorMove0.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog0.png'
    dogGif[0] = avatorMove0
    var avatorMove1 = new Image()
    avatorMove1.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog1.png'
    dogGif[1] = avatorMove1
    var avatorMove2 = new Image()
    avatorMove2.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog2.png'
    dogGif[2] = avatorMove2

    var avatorMove0 = new Image()
    avatorMove0.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog10.png'
    dogGifBack[0] = avatorMove0
    var avatorMove1 = new Image()
    avatorMove1.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog11.png'
    dogGifBack[1] = avatorMove1
    var avatorMove2 = new Image()
    avatorMove2.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/dog12.png'
    dogGifBack[2] = avatorMove2
}

/**
 * [drawImage canvas加载背景图]
 */
function drawImage () {
    var img = new Image()
    img.onload = function () {
        ctx.drawImage(img, 0, 0, 320, 378)
    }
    img.src = '//static.guojiang.tv/mobile/v2/img/activity/singleDog/runway.png'
}

/**
 * [readyMove 准备移动并生成数据]
 */
function readyMove () {
    runway = generateRoute() // => [x:number,y:number][]
    rateLine = getRateLine(runway) // => number[]
    moveST()
}

var unit = 4

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

    // 移动至当前线段尾节点
    if (runway[0].length === 0) {
        directAvator = !directAvator
        rateIndex++
        runway.splice(0, 1)
        sumMoney = [0, 51111, 111111, 311111, 511111, 811111][rateIndex]
        if (runway.length === 0) {
            finallyRunner()
            clearTimeTask(raf)
            return
        }
    }
    sumMoney += currentLineMoney
    prevPoint = currentPoint

    currentPoint = runway[0].splice(0, 1)[0] // => {x:x,y:y}
    if (!prevPoint.x) {
        prevPoint = currentPoint
        ctx.moveTo(prevPoint.x, prevPoint.y)
        return
    }
    lineLength = +Math.sqrt(Math.pow((currentPoint.x - prevPoint.x), 2) + Math.pow((currentPoint.y - prevPoint.y), 2)).toFixed(3)
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
        ctxMoveCanvas.drawImage(dogGif[~~(dogGifIndex / 10)], x - (49 / 2), y - (34 / 2), 49, 34)
    } else {
        ctxMoveCanvas.drawImage(dogGifBack[~~(dogGifIndex / 10)], x - (49 / 2), y - (34 / 2), 49, 34)
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
    var x = x * scaleRate
    var y = y * scaleRate
    if (typeof runner[0] !== 'undefined' && runner[0].money <= num) {
        var imgObj = runner.splice(0, 1)[0]
        var img = new Image()
        var rate = 0.5 * scaleRate
        var bigRate = 0.3 * scaleRate
        img.onload = function () {
            ctx.beginPath()
            ctx.save()
            if (x - avatorPosition.x < 40 * rate && y - avatorPosition.y < 20 * rate && avatorPositionLock) {
                // 长头像
                avatorPositionLock = false
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headLongAvator, x - 80 * bigRate, y - 351 * bigRate + 5, 159 * bigRate, 351 * bigRate)
                    ctx.translate(x, y - 252 * bigRate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 252 * bigRate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (131 / 2) * bigRate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 131 * bigRate, 131 * bigRate)
                } else {
                    ctx.drawImage(xheadLongAvator, x - 30 * rate, y - 167 * rate + 5, 60 * rate, 167 * rate)
                    ctx.translate(x, y - 138 * rate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 138 * rate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (56 / 2) * rate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 56 * rate, 56 * rate)
                }
            } else {
                // 短头像
                avatorPositionLock = true
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 80 * bigRate, y - 241 * bigRate + 5, 159 * bigRate, 241 * bigRate)
                    ctx.translate(x, y - 145 * bigRate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 145 * bigRate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (131 / 2) * bigRate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 131 * bigRate, 131 * bigRate)
                } else {
                    ctx.drawImage(xheadAvator, x - 30 * rate, y - 100 * rate + 5, 60 * rate, 100 * rate)
                    ctx.translate(x, y - 70 * rate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 70 * rate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (56 / 2) * rate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 56 * rate, 56 * rate)
                }
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
            distance += +Math.sqrt(Math.pow(wayArr[i][j]['x'] - wayArr[i][j - 1]['x'], 2) + Math.pow(wayArr[i][j]['y'] - wayArr[i][j - 1]['y'], 2)).toFixed(3)
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
    if (runnerArr.length === 0) return
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
}

/**
 * [generateRoute 得到路径点数组]
 * @returns {[x:number,y:number][]} [轨道的坐标点]
 */
function generateRoute () {
    var point = []
    point[0] = [{'x': 179, 'y': 185}, {'x': 291, 'y': 186}, {'x': 427, 'y': 187}, {'x': 643, 'y': 187}, {'x': 742, 'y': 192}, {'x': 788, 'y': 197}, {'x': 835, 'y': 214}, {'x': 867, 'y': 235}, {'x': 888, 'y': 261}, {'x': 898, 'y': 285}, {'x': 906, 'y': 320}]

    point[1] = [{'x': 904, 'y': 359}, {'x': 892, 'y': 391}, {'x': 863, 'y': 420}, {'x': 827, 'y': 440}, {'x': 769, 'y': 452}, {'x': 717, 'y': 458}, {'x': 663, 'y': 460}, {'x': 579, 'y': 460}, {'x': 502, 'y': 456}, {'x': 381, 'y': 458}, {'x': 323, 'y': 463}, {'x': 289, 'y': 469}, {'x': 242, 'y': 481}, {'x': 211, 'y': 503}, {'x': 186, 'y': 527}, {'x': 172, 'y': 556}, {'x': 163, 'y': 592}]

    point[2] = [{'x': 166, 'y': 616}, {'x': 178, 'y': 657}, {'x': 200, 'y': 688}, {'x': 234, 'y': 705}, {'x': 282, 'y': 717}, {'x': 333, 'y': 721}, {'x': 398, 'y': 724}, {'x': 562, 'y': 714}, {'x': 690, 'y': 714}, {'x': 793, 'y': 720}, {'x': 849, 'y': 736}, {'x': 897, 'y': 770}, {'x': 904, 'y': 793}, {'x': 912, 'y': 825}]

    point[3] = [{'x': 902, 'y': 873}, {'x': 876, 'y': 913}, {'x': 832, 'y': 934}, {'x': 778, 'y': 944}, {'x': 706, 'y': 949}, {'x': 494, 'y': 952}, {'x': 300, 'y': 957}, {'x': 246, 'y': 974}, {'x': 192, 'y': 1009}, {'x': 169, 'y': 1038}, {'x': 157, 'y': 1069}, {'x': 156, 'y': 1104}]

    point[4] = [{'x': 158, 'y': 1132}, {'x': 176, 'y': 1170}, {'x': 216, 'y': 1201}, {'x': 262, 'y': 1222}, {'x': 316, 'y': 1237}, {'x': 377, 'y': 1245}, {'x': 444, 'y': 1250}, {'x': 530, 'y': 1249}, {'x': 640, 'y': 1244}, {'x': 801, 'y': 1230}, {'x': 894, 'y': 1222}]

    point.forEach(function (value, index) {
        var temp = []
        value.forEach(function (val, idx) {
            temp.push({
                x: val['x'] * screenRate,
                y: val['y'] * screenRate
            })
        })
        point[index] = temp
    })

    return point
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
            common.goRoom(pointArr[i - 1]['rid'], 2)
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

export default init
