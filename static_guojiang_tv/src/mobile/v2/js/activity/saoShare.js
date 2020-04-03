// import Vue from 'vue';

import '../../css/activity/saoShare.less'

// import imgs from './sao/bgBase64';

// const bgImg = imgs.invite_bg;
// const avatarImg = imgs.avatar;
// const qrcodeImg = imgs.qrcode;

// const PANEL_RATIO = 4; // 抗锯齿
// const PANEL = {
//     bg: null,
//     avatar: null,
//     qrcode: null
// };

// new Vue({
//     el: '#app',
//     data: {
//         ctx: null
//     },
//     methods: {
//         //适配机型重定向
//         adaptation() {
//             let href = window.location;
//             if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
//                 if (href.host.indexOf('www') >= 0) {
//                     window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname;
//                 }
//             } else {
//                 if (href.host.indexOf('www') < 0) {
//                     window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '');
//                 }
//             }
//         },
//         generateEnvelop: function () {
//             // 点击生成邀请函 -> 显示layer
//             this.showModal('layer');
//         },
//         savePic: function () {
//             // 点击保存图片 -> 保存至本地相册
//             // 图片尺寸 -> 640*960
//             var panel = this.$refs.panel;
//             var href = panel.toDataURL("image/png").replace("image/png", "image/octet-stream");

//             var alink = document.getElementById('download-pic');
//             alink.href = href;

//             if (document.createEventObject){
//                 var evt = document.createEventObject();
//                 alink.fireEvent('onclick', evt);
//             }
//             else{
//                 var evt = document.createEvent('MouseEvent');
//                 evt.initEvent('click', false, false);
//                 alink.dispatchEvent(evt);
//             }

//             this.hideModal('layer');
//         },
//         /**
//          * @desc 加载画板所需要的资源
//          */
//         panelInit: function () {
//             var panel = this.$refs.panel;
//             panel.style.width = panel.clientWidth;
//             panel.style.height = panel.clientHeight;
//             panel.width = panel.clientWidth * PANEL_RATIO;
//             panel.height = panel.clientHeight * PANEL_RATIO;
//             var _self = this;

//             function loaded () {
//                 if (PANEL.bg.complete && PANEL.avatar.complete && PANEL.qrcode.complete) {
//                     _self.renderPanel();

//                     _self.renderImg();
//                 }
//             }

//             this.ctx = this.$refs.panel.getContext('2d');
//             this.ctx.scale(PANEL_RATIO, PANEL_RATIO);

//             PANEL.bg = new Image();
//             PANEL.bg.onload = loaded;
//             PANEL.bg.src = bgImg;

//             PANEL.avatar = new Image();
//             PANEL.avatar.onload = loaded;
//             PANEL.avatar.src = avatarImg;

//             PANEL.qrcode = new Image();
//             PANEL.qrcode.onload = loaded;
//             PANEL.qrcode.src = qrcodeImg;
//         },
//         renderImg: function () {
//             var panel = this.$refs.panel;
//             var href = panel.toDataURL("image/png");
//             this.$refs.inviteImg.src = href;
//         },
//         /**
//          * @desc 渲染邀请函 - canvas - 用于保存图片
//          */
//         renderPanel: function () {
//             var width = this.$refs.panel.width / PANEL_RATIO;
//             var height = this.$refs.panel.height / PANEL_RATIO;
//             var scale = PANEL.bg.width / width;

//             // 1. 背景图
//             this.ctx.drawImage(PANEL.bg, 0, 0, width, height);

//             // 2. 头像图
//             var avataBilv = 270 / 976;
//             var borderR = (270 + 8) / 976;

//             this.ctx.save();
//             this.ctx.beginPath();
//             this.ctx.fillStyle = '#f4c261';
//             this.ctx.arc(width/2, ((252/976) + avataBilv/2) * width, (width * borderR)/2, 0, 2 * Math.PI);
//             this.ctx.fill();
//             this.ctx.closePath();
//             this.ctx.restore();

//             this.ctx.save();
//             this.ctx.beginPath();
//             this.ctx.arc(width/2, ((252/976) + avataBilv/2) * width, (width * avataBilv)/2, 0, 2 * Math.PI);
//             this.ctx.clip();
//             this.ctx.drawImage(PANEL.avatar, (width - width * avataBilv) / 2, (252/976) * width, width * avataBilv, width * avataBilv);
//             this.ctx.restore();

//             // 3. 二维码图
//             var qrcodeBilv = 204 / 976;
//             this.ctx.drawImage(PANEL.qrcode, (width - width * qrcodeBilv) / 2, (860/976) * width, width * qrcodeBilv, width * qrcodeBilv);

//             // 4. 文本
//             var fs = 42 / scale;
//             var textTop = 90;
//             this.ctx.fillStyle = '#000';
//             this.ctx.textAlign = 'center';
//             this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif';
//             this.ctx.fillText('2018年7月7日-7月10日', width/2, ((252 + 270 + textTop)/976) * width);
//             this.ctx.fillText('Sao家族成立2周年', width/2, ((252 + 270 + textTop + 60)/976) * width);
//             this.ctx.fillText('邀您共聚星光直播', width/2, ((252 + 270 + textTop + 120)/976) * width);

//             fs = 44 / scale;
//             this.ctx.fillStyle = '#f4c261';
//             this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif';
//             this.ctx.fillText('识别图中二维码，即可参与活动！', width/2, ((860 + 204 + 50 + 40)/976) * width);
//         }
//     },
//     mounted: function () {
//         // pc / mobile 重定向
//         this.adaptation();

//         // 加载用户的登录信息
//         // this.getUser();

//         // // 画布资源加载
//         // this.panelInit();

//         // // 初始化信息
//         // this.initService();
//     }
// });
