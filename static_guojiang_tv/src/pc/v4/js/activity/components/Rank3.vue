<template>
    <div class="rank">
        <div class="title"></div>
        <ul class="tab">
            <li v-for="(item,index) in tab" :class="{active:selected==index}"  @click="exchangeTab(index)">{{item}}</li>
        </ul>
        <div class="tab-content box-corner">
            <div class="corner bottom"></div>
            <div class="corner left"></div>
            <div class="content">
                <ul class="tab-content-title">
                    <li class="title-1" v-if="selected<2">名次</li>
                    <li class="title-1" v-else>&nbsp;&nbsp;</li>
                    <li class="title-2">昵称</li>
                    <li class="title-3" style="position: relative;left:10px;">{{playNum}}</li>
                    <li class="title-4">{{blood}}</li>
                </ul>        
                <div class="scroll-box">
                    <ul class="rank-list">
                        <li v-for="(item,index) in rankList">
                            <div class="index" v-if="selected<2" :class="['index-'+index]">{{index+1}}</div>
                            <div class="index" v-else></div>
                            <div class="avatar-wrap">
                                <div class="live" v-if="selected == 1 && item.is_playing == 1">LIVE</div>
                                <div class="avatar-box">
                                    <img :src="item.head_pic_1" class="avatar" v-if="selected == 1" @click="inlive(item.id)">
                                    <img :src="item.head_pic_1" class="avatar" v-else>
                                </div>
                            </div>
                            <div class="nickname">{{item.nickname}}</div>
                            <div class="play-times" v-if="selected == 2">{{item.beastName}}</div>
                            <div class="play-times" v-else>{{item.attendNum}}</div>
                            <div class="blood" v-if="selected == 2">{{item.lastAttackBlood}}</div>
                            <div class="blood" v-else>{{item.num}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PolyfillScroll from '../../component/gj.polyfillScroll.js';
export default {
    data(){
        return {
            selected: 0, //当前选中的tab
            tab:['击打榜','主播榜','最后一击榜'],
            currentPage:1,//当前页数
            playNum:'总参与场次',
            blood:'总击杀血量',
            rankList:[],//当前列表数据
            hRanks: [], //击打排行榜
            mRanks: [], //主播排行榜
            uRanks: [], //用户排行榜
            scrollLock:false,
            entity:''
        }
    },

    created:function(){
        this.getRank(1,'user');
        this.getRank(1,'mod');
        this.getRank(1,'hit');
    },
    mounted:function(){
        this.whichRank(this.selected);
    },
    methods:{
        //tab切换
        exchangeTab(index) {
            this.selected = index;
            this.currentPage = 1;
            this.scrollLock = false;
            this.whichRank(index);
            this.$nextTick(()=>{
                if(!this.entity){
                    this.scrollLoad();
                }else{
                    this.entity.refresh();
                }
            })
        },
        //给相应的榜单填充数据
        whichRank(index){
            switch(index){
                case 0:
                    this.playNum = '总参与场次';
                    this.blood = '总击杀血量';
                    this.rankList = this.uRanks;
                break;
                case 1:
                    this.playNum = '场次';
                    this.blood = '获得击杀奖励';
                    this.rankList = this.mRanks;
                break;
                case 2:
                    this.playNum = '场次';
                    this.blood = '最后一击血量';
                    this.rankList = this.hRanks;
                break;
            }
        },
        //获取榜单数据
        getRank(Page,Type) {
            this.axios.get('/boss/getBossRank', {
                    params: {
                        page: Page,//当前第几页 1开头
                        pageSize: 20,//每页多少条记录
                        type: Type //mod主播 user用户 hit击打榜
                    }
                })
                .then(res => {
                    let data = res.data.data;
                    if (data.data.length > 0) {
                        switch(Type){
                            case 'user':
                                //console.log('击打榜',data.data);
                                this.uRanks = this.uRanks.concat(data.data);
                            break;
                            case 'mod':
                                //console.log('主播榜',data.data);
                                this.mRanks = this.mRanks.concat(data.data);
                            break;
                            case 'hit':
                                //console.log('最后一击榜',data.data);
                                this.hRanks = this.hRanks.concat(data.data);
                            break;
                        }
                        this.scrollLock = false;
                    }
                })
                .then(res => {
                    this.whichRank(this.selected);
                    this.$nextTick(() => {
                        this.scrollLoad();
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //点击主播头像，跳转直播间
        inlive(mid) {
            window.open(location.origin + '/' + mid);
        },
        //滚动加载绑定
        scrollLoad(){
            if(!this.entity && this.rankList.length>0){
                let that = this;
                this.entity = new PolyfillScroll({
                    scrollWrap:".scroll-box",
                    scrollContent: ".rank-list",
                    bar:{
                        width:"10px",
                        height:"50px",
                        right:'0',
                        background:"#d6b675"
                    },
                    cb(scrollTop){
                        if(this.contentHeight - scrollTop - this.scrollWrapHeight < 500){
                            if(that.scrollLock) return;
                            that.currentPage++;
                            that.scrollLock = true;
                            if(that.selected === 0){
                                that.getRank(that.currentPage,'user');
                            }else if(that.selected == 1){
                                that.getRank(that.currentPage,'mod');
                            }else if(that.selected == 2){
                                that.getRank(that.currentPage,'hit');
                            }
                        }
                    }
                });
            }
        },
    }
}
</script>