<template>
  <div class="header_nav">
    <div class="h-center container posR">
      <a
        href="/"
        class="logo posA xingguang_logo"/>
      <ul class="navbar">
        <li><a href="/">首页</a></li>
        <!-- <li
          :class="{active: navActive.chat}"
          class="chat"><a href="/chat/index.html">语聊<i/></a></li> -->
        <li><a href="/rank">排行榜</a></li>
        <li><a href="/store">商城</a></li>
        <li><a
          href="/recharge/center"
          target="_blank">充值</a></li>
      </ul>

      <div class="search_box topSearch">
        <input
          type="text"
          name="search_key">
        <i class="search_icon"/>
      </div>
      <div class="living_btn">
        <a
          class="living_a"
          href="/help/liveGuide"><i class="living_icon"/><span>我要直播</span></a>
      </div>

      <div class="room_logined h-login_info posA">
        <div class="avatar_wrap_51 avatar_wrap_people">
          <img
            src="../../img/common/alpha.png?v=505f05c4c9"
            width="51"
            height="51">
          <i class="hide"/>
        </div>

        <div class="tuc_wrap hide">
          <div class="tuc_title clearfix">
            <div class="avatar_wrap_51 tuc_img">
              <img
                src="../../img/common/alpha.png?v=505f05c4c9"
                width="51"
                height="51">
            </div>
            <div class="tuc_detail">
              <p class="tuc_nickname"/>
              <p class="pp_val"><span/>克拉</p>
              <div class="tuc_btn_wrap clearfix">
                <a class="tuc_edit_nickname">修改昵称</a>
                <a
                  href="/recharge/center"
                  target="_blank">充值</a>
              </div>

              <div class="edit_nickname hide posA">
                <div class="editCont">
                  <div class="editInner mar">
                    <p>当前昵称： <b/></p>
                    <p>修改昵称：
                      <input
                        id="tucNewNickname"
                        type="text"
                        class="fi-nickname">
                    </p>
                    <span class="editBtn">
                      <input
                        id="tucEditNickname"
                        type="button"
                        class="btns btn-confirm"
                        value="确定">
                      <input
                        id="tucCancelEditNickname"
                        type="button"
                        class="btns btn-cancel"
                        value="取消">
                    </span>
                  </div>
                  <div class="editNotice">注：修改后，原昵称有可能被抢注</div>
                </div>
              </div>

            </div>
          </div>
          <ul class="top_user_center  ">
            <li><a
              href="/userCenter"
              target="_blank">个人主页</a></li>
            <li class="tuc_my_moderator"><a
              href="/userCenter/publishHistory"
              target="_blank">我的直播</a></li>
            <!-- <li class="tuc_my_orgmanager"><a href="/userCenter/orgManager" target="_blank">我是会长</a></li> -->
            <li class=""><a
              href="/userCenter/guard"
              target="_blank">我的守护</a></li>
            <!-- <li class=""><a href="/userCenter/backpack" target="_blank">我的背包</a></li> -->
            <li><a
              href="/userCenter/rechargeHistory"
              target="_blank">充值记录</a></li>
            <li><a
              href="/user/findPassword"
              target="_blank">密码管理</a></li>
            <li
              class="last"
              @click="logOut()"><a>退出</a></li>
          </ul>
        </div>

      </div>

      <div class="room_login hide h-login_info">
        <span class="login">登录</span>|<span class="register">注册</span>
      </div>

    </div>
  </div>

</template>
<script type="text/javascript">
import user from 'user'
import Vue from 'vue'
import common from 'common'

export default {
    data: function () {
        return {
            navActive: {
                'chat': false
            }
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.refreshUserInfo()
            this.initSearch()
            this.initNavActive()
        })
    },
    methods: {
        logOut () {
            location.href = `/user/logout?callback=${location.href}`
        },
        initNavActive () {
            for (let val in this.navActive) {
                if (location.href.indexOf(val) != -1) {
                    this.navActive[val] = true
                    break
                }
            }
        },
        refreshUserInfo () {
            let vm = this
            user.getUserInfo(function (resp) {
                var startLiving = $('.living_a')
                if (resp.errno) {
                    $('.room_logined').hide().siblings('.room_login').show()

		            // 开始直播点击需要登录
                    startLiving.attr('href', 'javascript:;')
                    startLiving.on('click', function () {
                        user.showLoginPanel()
                    })

                    vm.initHeaderEvent()

                    return
                }

		        // 是否第一次登录
                var isFirstLogin = common.getCookie('isFirstLogin')
                if (isFirstLogin) {
                    window.document.cookie = 'isFirstLogin=;path=/'
                    if (!resp.data.isBindMobile) {
                        user.showBindPanel()
                    }
                }

		        // fill now nickname
                $('.edit_nickname .editInner b').text(resp.data['nickname'])

		        // 头部个人中心面板
                $('.room_logined').show().siblings('.room_login').hide()
                $('.avatar_wrap_people img').attr('src', resp.data['head_pic_1'])
                $('.rn_avatar img').attr('src', resp.data['head_pic_1'])

                $('.tuc_title img').attr('src', resp.data['head_pic_1'])
                $('.tuc_title .pp_val span').text(resp.data.coin)
                $('.tuc_title .r_lowcoin_num a').text(resp.data.low_coin)
                $('.tuc_title .tuc_nickname').text(resp.data['nickname'])
                $('.tuc_title .edit_nickname .editInner b').text(resp.data['nickname'])

                if (resp.data['isModerator']) {
                    startLiving.attr('href', resp.data['rUrl'])
                }

		        // 我的消息
                if (resp.data['totalMessageNum'] > 0) {
                    $('.avatar_wrap_people i').text(resp.data['totalMessageNum']).show()

                    $('.tuc_my_message i').show()
                    $('.st_message_wrap').addClass('on')
                    $('.my_message i').show()
		            // 首页面板私信
                    $('.hl_message i').show()
                }

                vm.initHeaderEvent()
            })
        },

        initHeaderEvent () {
            // register
            $('.room_login .register').off().on('click', function () {
                console.log('register')
                user.showRegisterPanel()
            })
            $('.room_login .login').off().on('click', function () {
                console.log('login')
                user.showLoginPanel()
            })

            // top user center
            var outTimer
            $('.avatar_wrap_people, .tuc_wrap').hover(function () {
                clearTimeout(outTimer)
                $('.tuc_wrap').show()
            }, function () {
                outTimer = setTimeout(function () {
                    $('.tuc_wrap').hide()
                }, 200)
            })

            // 修改昵称
            $('.tuc_edit_nickname').off().on('click', function () {
                if ($('.tuc_detail .edit_nickname').is(':hidden')) {
                    $('.tuc_detail .edit_nickname').show()
                } else {
                    $('.tuc_detail .edit_nickname').hide()
                }
            })

            $('#tucEditNickname').off().on('click', function () {
                var nickname = $.trim($('#tucNewNickname').val())
                if (!nickname) {
                    layer.alert('昵称不能为空')
                    return
                }
                $.ajax({
                    url: '/user/updateUserInfo/scene/nickname',
                    type: 'post',
                    dataType: 'json',
                    data: {nickname: nickname},
                    success: function (resp) {
                        if (resp.errno) {
                            layer.alert(resp.msg)
                            return
                        }
                        layer.msg('昵称更新成功')
                        setTimeout(function () { location.reload() }, 3000)
                    }
                })
            })

            $('#tucCancelEditNickname').off().on('click', function () {
                $('.tuc_detail .edit_nickname').hide()
            })
        },

        initSearch () {
		    // login placeholder
		    require('component')($) // 共享给jquery
		    $('.topSearch input[name=search_key]').gjPlaceHolder({
		            fontSize: '12px',
		            top: 0,
		            left: 15,
		            placeHolderColor: '#a0a0a0',
		            inputTextColor: '#a0a0a0',
		            content: '主播ID号',
		            relParent: $('.topSearch')
		    })

		    // 搜索
		    $('.topSearch input[name=search_key], .search_page input[name=search_key]').on('keydown', function (e) {
		        if (e.keyCode == 13) {
		            var keywords = $(this).val()
		            if (keywords != '') {
		            location.href = '/search?keywords=' + keywords
		            }
		        }
		    })

		    $('.search_icon').on('click', function () {
		        var keywords = $(this).siblings('input').val()
		        if (keywords != '') {
		            location.href = '/search?keywords=' + keywords
		        }
		    })
        }

    }
}

</script>

<style type="text/css" lang="less">
	/* header */
.header_nav {
	height:62px;box-shadow: 0 1px 1px #bfbfbf; background-color: #fff ;position: relative;
	.h-center{position: relative;line-height: 66px;height: 100%;}
	.navbar{
		position: relative;float: left;    margin-left: 45px;
		li{float:left;font-size:18px;position: relative;}
		li:hover a{text-decoration:none;color:#ff0071;border-bottom: 5px solid #ff0071;}
		li a{color:#7f7e7e;font-size:22px; margin-left: 10px;margin-right: 10px;padding: 0 10px 11px;}
		li.active a{color: #ff0071;
			border-bottom: 5px solid #ff0071;
		}
	}
	.avatar_wrap_51 img{border-radius:51px;-webkit-border-radius:51px;-moz-border-radius:51px;-o-border-radius:51px;-ms-border-radius:51px;}
	.avatar_wrap_people{position: absolute;right:0px;top:7px;
		 i{background: url('../../img/common/gj_common.png') no-repeat -279px -334px;width: 20px;height: 20px;font-size:12px;color:#fff;text-align: center;line-height: 20px;position: absolute;top:-2px;right:-5px;}
	}
	.top_user_center{width: 130px;padding: 0 35px;
		li{text-align: center;font-size: 12px;color: #787878;border-bottom: 1px solid #EFEFEF;cursor: pointer;position: relative;}
		li.last{border-bottom:none;}
		li a{display: block; padding: 7px 0 7px;}
	}
	.tuc_wrap{position: absolute;top: 63px;right: -91px;background:#fff;z-index: 1001;  box-shadow:0 2px 5px #B6B6B6;  padding-bottom: 10px;
		.tuc_detail .edit_nickname{  top: 0px;right: -39px;box-shadow: 0 0 5px #ADADAD;    z-index: 9999;}
	}
	.edit_nickname{background: #fff;position: absolute;  top: 124px;right: 37px;width: 300px;
		.editInner p{  color: #999;font-size: 12px;margin-bottom: 10px}
		.editInner b{color:#ff0071;}
		.editInner p input{padding: 2px 5px;height: 22px;line-height: 22px;border: #e2e2e2 1px solid;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;}
		.editInner{width:220px;margin:0 auto;}
		.editBtn{margin: 0 auto;width: 190px;display: block;margin-bottom: 10px}
		.editNotice {padding:10px;font-weight:bold;font-size:14px;color:#ff0071;text-align:left;background:#f5f5f5;border-top:#ddd 1px solid;}
		.btn-confirm,.btn-cancel {margin:0 11px;width:68px;height:31px;cursor: pointer;}
		.btn-confirm {background:#ff0071;color:#fff;}
		.btn-cancel {background:#c6c6c6;}
	}
	.ie7 .tuc_detail .edit_nickname, .ie8 .tuc_detail .edit_nickname{border:1px solid #ddd;}
	.ie7 .tuc_wrap,.ie8 .tuc_wrap{border:1px solid #adadad;}

	.h-login_info{position: relative;float: right;}
	.room_login{position: absolute;right:0;top:20px;font-size:18px;color: #7f7e7e;
		span{font-size:20px;cursor: pointer;width: 70px;height: 30px;line-height: 30px;text-align: center;display: inline-block;
				&:hover{color:#ff0071;}
		}
		.register{margin-left: 2px;color:#7f7e7e;
		}

	}
	.tuc_title{padding: 15px 0 10px 10px;width: 200px;}
	.tuc_img,.tuc_detail{float:left;}
	.tuc_img{top: 9px;}
	.tuc_detail{font-size:13px;color:#787878;margin-left:10px;}
	.tuc_btn_wrap a{width: 57px;height: 20px;text-align: center;line-height: 20px;background: #ff0071;border-radius:2px;color:#fff;font-size: 12px;margin-right: 5px;  display: inline-block;cursor: pointer;float:left;}
	.logo { position: relative;float: left;background:url(../../img/common/logo/paopao_logo.png) no-repeat 0 0;
	    width: 160px;height: 41px;display:block;top:13px;left:0;}
	.xingguang_logo.logo{background: url(../../img/common/logo/xingguang_logo.png) no-repeat 0 0; top:8px;background-size:161px 45px;    width: 161px;height: 45px;}
	.chabei_logo.logo{background: url(../../img/common/logo/chabei_logo.png) no-repeat 0 0;background-size:161px 41px;    width: 161px;height: 41px;}
	.start_living{position: absolute;right: 390px;top: 17px;background: url(../../img/room/start_living.png) no-repeat 0 0;width: 92px;height: 28px;
		&:hover{background-position: 0 -33px;}
	}

}
.ie7 .header-wrap {z-index:11;}

/*search*/
.s_header{padding:30px 0 30px 20px;border-bottom: 1px solid #dedede;}
.search_box{border:1px solid #ff0071;border-radius: 17px;-webkit-border-radius:17px;-moz-border-radius:17px;-ms-border-radius:17px;-o-border-radius:17px;position: relative;width:300px;height:40px;line-height: 39px;
	input{border:none;font-size: 14px;color: #a0a0a0;padding: 7px;margin-left: 11px;width: 212px;     }
	i{background:url(../../img/common/all.png) no-repeat -22px 0;width: 18px;height: 18px;display:inline-block;position: relative;top: 6px;left: 10px;cursor: pointer;}
}
.ie7 .search_box i{top:3px;}
.s_result_summary{font-size:17px;color:#989898;padding:20px 0 30px;
 	span{color:#ff0071;}
}
.living_btn{
	position: absolute;top:12px;right:160px;
	.living_a{
	display: inline-block;
    width:126px;height: 43px;line-height: 43px; background: #ff0071;color:#fff;border-radius: 5px; text-align: right;padding-right: 10px;
		font-size: 20px;text-decoration:none;
		&:hover{background:#cc005a; cursor: pointer;}
	}

	.living_icon{background:url(../../img/common/all.png?v=0906) no-repeat -69px -28px;width: 25px;height: 26px;display:inline-block;position: relative;top: 4px;left: -10px;}
}
.topSearch{    top: 20px;right:318px;position: absolute!important;width:200px;height:30px;border-color:#a2a2a2;font-size:12px;line-height: 27px;}
.topSearch input{padding:0;width:150px;margin-left: 17px;background: none;height: 100%;}
.topSearch i{background-position:0 0;width: 18px;height: 18px;top: 6px;left: -2px; }

//head
.header_nav{
	.chat{
		i{
			background: url(../../img/chat/all.png) no-repeat top center;
			background-position: 0 -44px;
			width: 33px;
			height: 21px;
			display: inline-block;
			position: absolute;
			top:5px;
			right: -15px;
		}
	}
}
</style>
