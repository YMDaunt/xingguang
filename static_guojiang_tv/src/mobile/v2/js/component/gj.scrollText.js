///// <reference path="./declaration.d.ts" />
/*
    bullets:string[]     消息容器
    gun:string        容器名字
    scrollName:string       滚动块外层容器类名  <ul>



*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//profix requestAnimationFrame
/**
 *
 */
var setTimeTask = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//profix cancelAnimationFrame
var clearTimeTask = (function () {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.clearTimeout;
})();
var ScrollBox = (function () {
    function ScrollBox(_a) {
        var gun = _a.gun, clip = _a.clip, bullets = _a.bullets, distance = _a.distance;
        this.options = {
            gun: "",
            clip: [],
            bullets: [],
            distance: 0,
        };
        this.extendOpt(arguments[0]);
        this.clipName = this.options.clip.join(" ");
        this.createELe();
    }
    ScrollBox.prototype.extendOpt = function (opt) {
        var that = this;
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                that.options[key] = opt[key];
            }
        }
    };
    //创建元素组件
    ScrollBox.prototype.createELe = function () {
        var that = this;
        var str = "<ul class=\"" + that.clipName.replace(/\./g, '') + "\">";
        str += this.createContent();
        str += "</ul>";
        var gun = document.querySelector(this.options.gun);
        gun.innerHTML = str;
    };
    ScrollBox.prototype.createContent = function () {
        var str = "";
        for (var i = 0, len = this.options.bullets.length; i < len; i++) {
            str += this.options.bullets[i];
        }
        return str;
    };
    return ScrollBox;
}());
/*水平滚动*/
export var Horizontal = (function (_super) {
    __extends(Horizontal, _super);
    function Horizontal(opt, bulletsGap) {
        if (bulletsGap === void 0) { bulletsGap = 0; }
        var _this = _super.call(this, opt) || this;
        _this.sumWidth = 0;
        _this.distance = 0;
        _this.copyLock = false;
        _this.bulletsGap = bulletsGap;
        _this.childClipName = _this.clipName.replace(/\s/g, "");
        _this.gunLength = +window.getComputedStyle(document.querySelector(opt.gun), null).getPropertyValue("width").replace("px", "");
        _this.arrange();
        _this.startRun();
        return _this;
    }
    Horizontal.prototype.arrange = function () {
        var clipEle = document.querySelector(this.childClipName);
        this.sumWidth = 0;
        for (var i = 0, len = clipEle.childNodes.length; i < len; i++) {
            var temp = window.getComputedStyle(clipEle.childNodes[i], null).getPropertyValue("width");
            this.sumWidth += (Math.ceil(+temp.replace("px", "")) + this.bulletsGap);
        }
        clipEle.style.width = this.sumWidth + "px";
    };
    Horizontal.prototype.startRun = function () {
        this.clipEle = document.querySelector(this.childClipName);
        this.STRun();
    };
    Horizontal.prototype.STRun = function () {
        this.STMove();
        setTimeTask(function () {
            this.STRun();
        }.bind(this));
    };
    Horizontal.prototype.STMove = function () {
        this.distance += this.options.distance;
        if (Math.abs(this.distance) >= this.sumWidth && !this.copyLock) {
            this.copyLock = true;
            var clipEle = document.querySelector(this.childClipName);
            clipEle.innerHTML += clipEle.innerHTML;
            clipEle.style.width = this.sumWidth * 2 + "px";
        }
        if (Math.abs(this.distance) >= this.sumWidth + this.gunLength) {
            this.copyLock = false;
            this.distance = -this.gunLength;
            _super.prototype.createELe.call(this);
            this.arrange();
            this.clipEle = document.querySelector(this.childClipName);
        }
        this.clipEle.style.transform = "translateX(" + this.distance + "px)";
        this.clipEle.style.webkitTransform = "translateX(" + this.distance + "px)";
    };
    return Horizontal;
}(ScrollBox));
/*垂直滚动*/
export var Vertical = (function (_super) {
    __extends(Vertical, _super);
    function Vertical(opt) {
        var _this = _super.call(this, opt) || this;
        _this.distance = 0;
        _this.copyLock = false;
        _this.childClipName = _this.clipName.replace(/\s/g, "");
        _this.gunHeight = +window.getComputedStyle(document.querySelector(opt.gun), null).getPropertyValue("height").replace("px", "");
        _this.startRun();
        return _this;
    }
    Vertical.prototype.startRun = function () {
        this.clipEle = document.querySelector(this.childClipName);
        this.sumHeight = +window.getComputedStyle(this.clipEle).getPropertyValue("height").replace("px", "");
        this.STRun();
    };
    Vertical.prototype.STRun = function () {
        this.STMove();
        if (this.sumHeight < this.gunHeight)
            return;
        setTimeTask(function () {
            this.STRun();
        }.bind(this));
    };
    Vertical.prototype.STMove = function () {
        this.distance += this.options.distance;
        if (this.sumHeight - Math.abs(this.distance) >= this.gunHeight && !this.copyLock) {
            this.copyLock = true;
            var clipEle = document.querySelector(this.childClipName);
            clipEle.innerHTML += clipEle.innerHTML;
        }
        if (Math.abs(this.distance) >= this.sumHeight) {
            this.copyLock = false;
            this.distance = 0;
            _super.prototype.createELe.call(this);
            this.clipEle = document.querySelector(this.childClipName);
        }
        this.clipEle.style.transform = "translateY(" + this.distance + "px)";
        this.clipEle.style.webkitTransform = "translateY(" + this.distance + "px)";
    };
    return Vertical;
}(ScrollBox));
// new Horizontal({
//     gun: ".scroll-ele",
//     clip: [".horizontal", ".clearfix"],
//     bullets: ["<li>第一条</li>", "<li>第二条</li>", "<li>第三条</li>"],
//     distance: -0.5
// }, 10);
// new Vertical({
//     gun: ".vertical",
//     clip: [".vertical-wrap"],
//     bullets: ["<li>第一条</li>", "<li>第二条</li>", "<li>第二条</li>", "<li>第二条</li>"],
//     distance: -0.5
// });
