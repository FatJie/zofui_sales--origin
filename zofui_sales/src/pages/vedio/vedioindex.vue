<template>
    <div  :class="params.style + ' container_box'" id="video_box">
        <div class="van_swipe">
            <!--vant van-swipe 滑动组件 -->
            <van-swipe :show-indicators="false" ref="swiper" @change="onChange" vertical :touchable="params.isscroll == 0" :loop="false">
                <van-swipe-item v-for="(item, index) in videoList" :key="index" class="product_swiper" >
                    <div class="video_container">
                        
                        <video class="video_box" width="100%" height="100%" webkit-playsinline="true" x5-playsinline=""
                            x5-video-player-type="h5" x5-video-player-fullscreen="" playsinline preload="auto"
                            :poster="item.cover" :src="item.shortv" :playOrPause="playOrPause" x-webkit-airplay="allow"
                            x5-video-orientation="portrait" @click="pauseVideo" @ended="onPlayerEnded($event)"
                            loop="loop">
                        </video>
                        <!-- 封面 -->
                        <img v-show="isVideoShow && item.vposter" class="play" @click="playvideo" :src="item.vposter" />
                        <!-- 播放暂停按钮 -->
                        <div v-show="iconPlayShow" class="play-btn" @click="playvideo"  ></div>
                    </div>
                </van-swipe-item>
            </van-swipe>
           	
            <div class="nav" v-if="params.vstyle == 0">
                <div @click="link" :data-url="'/commentinfo?id='+goods.commentid" v-if="goods.commentid">
                    <div class="fixed-share" openType="">
                        <img mode="aspectFit" src="http://img11.360buyimg.com/ddimg/jfs/t1/62396/6/7997/4957/5d60dc47E25b82840/06ac560d766d22ef.png">
                    </div>
                    <div class="text">评价</div>
                </div>
                <div @click="shareit(true)">
                    <div class="fixed-share" openType="share">
                        <img mode="aspectFit" src="http://img11.360buyimg.com/ddimg/jfs/t1/77982/24/8095/5679/5d60dc2dEa917344b/735293d67f258d00.png">
                    </div>
                    <div class="text">转发</div>
                </div>
                <div @click="back"  v-if="haveback">
                    <div class="fixed-share" >
                        <img mode="aspectFit" src="http://img11.360buyimg.com/ddimg/jfs/t1/71570/31/8305/3422/5d63e793E7eae0cdf/ff13b21123f2e691.png">
                    </div>
                    <div class="text">返回</div>
                </div>
                <div @click="link" data-url="/" v-else>
                    <div class="fixed-share" >
                        <img mode="aspectFit" src="http://img11.360buyimg.com/ddimg/jfs/t1/65849/14/8148/3203/5d60dbd5Ebe0ba8fd/6548f69aa3954abe.png">
                    </div>
                    <div class="text">首页</div>
                </div>
            </div>

            <div class="singleback" @click="back" v-if="params.vstyle == 1">
                <img mode="aspectFit" src="http://img11.360buyimg.com/ddimg/jfs/t1/71570/31/8305/3422/5d63e793E7eae0cdf/ff13b21123f2e691.png" />
            </div> 

            <div @click="link" class="goods" :class="{'singlegoods':params.vstyle == 1}" :data-url="'/goodinfo?id='+goods.id">
                <div class="good-img">
                    <img :src="goods.thumb">
                </div>
                <div class="good-desc" style="display: flex;flex-direction: column;justify-content: space-between;margin-right:10rpx;flex:1;">
                    <div class="good-title .text-overflow2">{{goods.title}}</div>
                    <div class="xqbottom">
                        <div class="good-price">￥{{goods.price}}</div>
                        <img class="cart" src="http://img11.360buyimg.com/ddimg/jfs/t1/38343/38/15038/3401/5d60dcc8E44864766/2c1cb40caace3ce7.png">
                        <div class="cartbtn bg-pri">立即抢购</div>
                    </div>
                </div>
            </div>
            <div @click="showtuijian" class="shopping-bag" v-if="params.vstyle == 0">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/84503/27/8476/7041/5d5fcab5E4bd0f579/993f8ea3375ba836.png">
                <div class="goodsnumber">{{tuijian?tuijian.length:0}}</div>
            </div>
            <div class="switch"  v-if="params.vstyle == 0">
                <div @click="pre" class="an">上一个商品</div>
                <div @click="next" class="an">下一个商品</div>
            </div>

            <div class="allgoods " :class="select?'show':'hidden'" v-if="tuijian.length>0">
                <div style="height:100%;overflow-y:scroll;">
                    <div class="list_head">
                        <img class="headimg" :src="goods.shophead">
                        <div class="head">
                            <div class="head-name ">{{goods.shopname}}</div>
                            <div class="head-title">推荐宝贝</div>
                        </div>
                        <img @click="showtuijian" class="closeimg" src="http://img11.360buyimg.com/ddimg/jfs/t1/78025/38/7965/407/5d5fdbeaEa1a17c3c/d32c4a9d70043293.png">
                    </div>
                    <div @click="link" class="goodlist" :data-url="item.appurl" v-for="(item,index) in tuijian" :key="item.id">
                        <img class="listimg" :src="item.thumb">
                        <div class="xiangqing">
                            <div class="list-title text-overflow2">{{item.title}}</div>
                            <div class="xqbottom">
                                <div class="list-price">￥{{item.show_price}}</div>
                                <img class="list-cart" src="http://img11.360buyimg.com/ddimg/jfs/t1/38343/38/15038/3401/5d60dcc8E44864766/2c1cb40caace3ce7.png">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>
</template>
<script>
    import { Toast,Swipe, SwipeItem } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
    export default {
        name: 'vedioindex',
	  	components: {
            [Toast.name] : Toast,
            [Swipe.name] : Swipe,
            [SwipeItem.name] : SwipeItem,
            sharetip,
	  	},
        data() {
            let u = navigator.userAgent;
            return {
                current: 0,
                videoList: [],
                isVideoShow: true,
                playOrPause: true,
                video: null,
                iconPlayShow: true,
                isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
                isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                info : {},
                select : false,
                ising : false,
                start : {},
                video : false,
                showplay : true,
                goods : {},
                tuijian : {},
                playerOptions : {},
                isshowshare : false,
                haveback : false,
            }
        },
	  	created:function(e){
	  		this.initData();
	  	},

        beforeRouteLeave(to,from,next){
		    document.body.addEventListener('touchmove', function (e) {
		        window.event.returnValue = true
		    })
		    next();
        },
        methods: {
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
		    showtuijian(){
		        this.select = !this.select;
		    },
            shareit(bool){
                this.isshowshare = bool;
            },
            back(){
                this.$router.go(-1)
            },
            pre(){
            	if( this.current <= 0 ){
            		this.$toast('没有上一个');
            		return false;
            	}
            	let video = document.querySelectorAll('video')[this.current];
            	video.pause();

            	this.current = this.current - 1;
            	this.$refs.swiper.swipeTo(this.current);
            	//this.onChange(this.current);
            },
            next(){
            	if( this.current >= this.videoList.length - 1 ){
            		return false;
            	}
            	let video = document.querySelectorAll('video')[this.current];
            	video.pause();

            	this.current = this.current + 1;
            	this.$refs.swiper.swipeTo(this.current);
            	//this.onChange(this.current);
            },
            initData(){
                var self = this;
                var params = this.$route.query;

				var meta = document.getElementsByTagName("meta");
				meta[6]["content"] = "no-referrer";
                
                self.haveback = window.history.length >= 2;

				document.body.addEventListener('touchmove', function (e) {
				    e.preventDefault(); 
				}, {passive: false});

				let htmlWidth = document.documentElement.clientWidth;
				self.width = htmlWidth;

                var postdata = {
                    op : 'info',
                    zfid : params.zfid ? params.zfid : 0,
                    gid : params.gid ? params.gid : 0,
                }
	            self.$util.http('vedio','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.videoList = res.data.goods;
                        self.params = res.data.params;
                        self.goods = res.data.goods[0];
                        self.tuijian = res.data.goods[0].tuijian;
		                
                        window.document.title = self.goods.title;
						self.inited = 2;
                        self.$util.share(wx,self.sharedata);

                        self.readlog();
                        
						self.getNew();
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
            //滑动改变播放的视频
            onChange(index) {

            	var self = this;
                //改变的时候 暂停当前播放的视频
                let video = document.querySelectorAll('video')[this.current];
                video.pause();
                this.playOrPause = false;
                this.current = index;
                if (this.isiOS) {
                    //ios切换直接自动播放下一个
                    this.isVideoShow = false;
                    this.pauseVideo()
                } else {
                    //安卓播放时重置显示封面。图标等
                    this.isVideoShow = true;
                    this.iconPlayShow = true
                }

                self.goods = self.videoList[index];
                self.tuijian = self.videoList[index].tuijian;

            	if( index == this.videoList.length - 1 ){
            		self.getNew();
            	}

                self.readlog();

                var url = self.$util.Murl('vedio','info');
                self.sharedata.link = url+'&gid='+self.goods.id+'&zfid='+self.params.zfid;
                self.$util.share(wx,self.sharedata);
            },
            readlog(){
                var self = this;
                var postdata = {
                    op : 'readlog',
                    gid : self.goods.id ? self.goods.id : 0,
                }
                self.$util.http('vedio','GET',postdata,function(res){});
            },
            getNew(){
            	var self = this;
                var postdata = {
                    op : 'info',
                }
	            self.$util.http('vedio','GET',postdata,function(res){ 
	                if( !res.errno && res.data ){
                        self.videoList = self.videoList.concat(res.data.goods);
	                }
	            });
            },
            playvideo(event) {
                let video = document.querySelectorAll('video')[this.current];
                this.isVideoShow = false;
                this.iconPlayShow = false
                video.play();
                window.onresize = function () {
                    video.style.width = window.innerWidth + "px";
                    video.style.height = window.innerHeight + "px";
                }
            },
            pauseVideo() { //暂停\播放
                let video = document.querySelectorAll('video')[this.current]
                if (this.playOrPause) {
                    video.pause()
                    this.iconPlayShow = true
                } else {
                    video.play()
                    this.iconPlayShow = false
                }
                this.playOrPause = !this.playOrPause
            },
            
        }
    }
</script>
<style scoped>
    .clear {
        clear: both;
    }

    .video-player {
        height: 100vh;
        width: 100vw;
    }

    .product_swiper {
        width: 100vw;
        height: 100vh;
    }

    .van_swipe {
        width: 100vw;
        height: 100vh;
        background-color: #000;
    }

    .van-swipe {
        width: 100%;
        height: 100%;
    }

    .container_box {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .video_box {
        object-fit: fill !important;
        z-index: 999;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    video {
        object-position: 0 0;
    }

    .icon_play {
        position: absolute;
        top: 44%;
        right: 0;
        left: 0;
        bottom: auto;
        margin: auto;
        z-index: 999;
        height: 60px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
    }

    .play,
    .platStart {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
    }

    /* 点赞，转发 */
    .tools_right {
        z-index: 1001;
        position: absolute;
        right: 16px;
        bottom: 238px
    }

    .tools_r_li {
        margin-bottom: 20px;
        color: #fff;
        font-size: 14px;
    }

    .tools_r_li:last-child {
        margin-bottom: 0px;
    }

    .icon_right {
        margin-bottom: 5px;
        font-size: 42px;
        display: block;
        text-shadow: 0px 0px 10px #9d9d9d;
        /*transition: .5s;*/
    }

    .production_box {
        z-index: 1001;
        position: absolute;
        /* right: 16px; */
        bottom: 60px;
        text-align: left;
        padding: 0 15px 15px 15px;
        color: #fff;
        width: 100%;
        left: 0;
        box-sizing: border-box;
        background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* 标准的语法 */
    }

    .production_name {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .production_des {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        min-height: 62px;
    }

    .container_bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        height: 60px;
        border-top: 1px solid rgba(255, 255, 255, 0.7);
    }

    .production_top {
        display: inline-block;
        padding: 6px;
        margin-bottom: 5px;
        background: rgba(0, 0, 0, .3);
        border-radius: 6px;
        margin-top: 5px;
    }

    .product_go {
        color: #fbdd21;
    }

    .production_title {
        margin-left: 4px;
    }

    .bottom_tab {
        width: 50%;
        text-align: center;
        float: left;
        color: #c9c9c9;
        padding: 10px 0;
    }

    .bottom_tab_span {
        line-height: 38px;
        border-bottom: 2px solid transparent;
        font-weight: 600;
        font-size: 16px;
        display: inline-block;
        padding: 0 4px;
        transition: .5s all;
    }

    .tab_active .bottom_tab_span {
        border-bottom: 2px solid #fff;
        color: #fff;
    }

    .icon-shoucang {
        transition: .5s all;
    }

    .follow_active {
        color: #f44;
        animation: showHeart .5s ease-in-out 0s;
    }

    /*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
    /*animation-duration ：指定元素播放动画所持续的时间*/
    /*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
    /*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
    /*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
    /*animation-direction：主要用来设置动画播放方向*/
    @keyframes showHeart {
        0% {
            color: #f44;
            transform: scale(1);
        }

        25% {
            color: #fff;
            transform: scale(0);
        }

        80% {
            color: #f44;
            transform: scale(1.2);
        }

        100% {
            color: #f44;
            transform: scale(1);
        }
    }

    /*分享样式*/
    .share_hover {
        position: fixed;
        display: none;

    }

    .share_box {
        position: fixed;
        bottom: -300px;
        width: 100%;
        z-index: 1002;
        background: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        transition: .5s;
    }

    .share_tips {
        text-align: center;
        line-height: 38px;
        color: #333;
    }

    .share_ul {
        box-sizing: border-box;
        padding: 0 25px 25px;
        border-bottom: 1px solid #e8e8e8;
    }

    .share_li {
        float: left;
        width: 33%;
        text-align: center;
    }

    .share_li i {
        font-size: 44px;
    }

    .share_cancel {
        text-align: center;
        line-height: 48px;
        color: #777;
        text-align: center;
    }

    .pengyouquan {
        color: #47D000;

    }

    .pengyouquan_li {
        animation: rotating 8s linear infinite
    }

    @keyframes rotating {
        from {
            transform: rotate(0)
        }

        to {
            transform: rotate(360deg)
        }
    }

    .weixin {
        color: #20CA2E;
    }

    .lianjie {
        color: #cdcdcd;
    }

    .share_active {
        bottom: 0px;
    }

.play-btn{
    width: .98rem;
    height: .98rem;
    position: absolute;
    z-index: 20;
    left: 50%;
    top: 50%;
    margin-left: -.5rem;
    margin-top: -.5rem;
    display: block;
    background-image: url(//s3.pstatp.com/ies/resource/falcon/douyin_falcon/page/reflow_video/image/sprite_loading_c7c74f1.png);
    background-size: 35.28rem .98rem;
    z-index: 1000;
}

/**/
.text-overflow3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

.text-overflow2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.text-overflow1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}
.wait {
    width: 75px;
    height: 75px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 999;
}

.wait img {
    width: 75px;
    height: 75px;
}

#myVideo {
    position: fixed;
    width: 375px;
    height: 100vh;
}

.nav {
    position: fixed;
    bottom: 125px;
    right: 12.5px;
    z-index: 9997;
}
.nav>div{
	line-height: 1;
	margin-bottom: 5px;
}
.nav .text {
    font-size: 14px;
    color: #fff;
    display: block;
    text-align: center;
    z-index: 9998;
}

.fixed-share {
    display: inline-block;
    width: 39.5px;
    height: 39.5px;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
    padding: 7.5px;
    margin: 5px 0;
}

.fixed-share img {
    display: block;
    margin: 0 auto;
    z-index: 9998;
    width: 24px;
    height: 24px;
}

.goods {
    width: 200px;
    height: 75px;
    background: #fff;
    border-radius: 5px;
    position: fixed;
    bottom: 80px;
    left: 10px;
    z-index: 9998;
    display: flex;
}

.goods .good-img {
    width: 75px;
    height: 75px;
    margin-right: 5px;
}

.good-img img {
    border-radius: 5px 0 0 5px;
    width: 75px;
    height: 75px;
}

.good-title {
    display: inline-block;
    font-size: 13px;
    line-height: 1.2;
    white-space: pre-wrap;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    -webkit-box-orient: vertical;
}

.xqbottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.good-price {
    display: inline-block;
    flex: 1;
    font-size: 14px;
    color: red;
}

.cart {
    width: 22.5px;
    height: 22.5px;
    margin-left: 4px;
}

.shopping-bag {
    width: 55px;
    height: 55px;
    display: block;
    position: fixed;
    bottom: 20px;
    left: 5px;
    z-index: 9996;
}

.shopping-bag img {
    width: 55px;
    height: 55px;
}

.goodsnumber {
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 23.5px;
    left: 12.5px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 16px;
}

.allgoods {
    width: 315px;
    background: #fff;
    height: 450px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px 10px 0 0;
    z-index: 9999;
    padding: 0 10px;
    overflow: hidden;
}

::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}

.hidden {
    display: none;
}

.show {
    display: block;
}

.goodlist {
    border-bottom: 0.5px solid #f1f1f1;
    width: 300px;
    height: 80px;
    margin: 10px auto 0 auto;
    display: flex;
}

.goodlist .listimg {
    width: 80px;
    height: 80px;
    border-radius: 7.5px;
}

.goodlist .xiangqing {
    margin: 0 5px 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.goodlist view {
    font-size: 14px;
}

.goodlist .list-title {
    display: inline-block;
    font-size: 14px;
    margin-top: 5px;
    height: 32px;
    line-height: 16px;
    white-space: pre-wrap;
}

.goodlist .xqbottom {
    display: flex;
    justify-content: space-between;
}

.goodlist .list-price {
    color: red;
    font-size: 15px;
    flex: 1;
}

.goodlist .list-cart {
    width: 25px;
    height: 25px;
}

.list_head {
    width: 310px;
    height: 60px;
    margin: 5px auto 0 auto;
    border-bottom: 0.5px solid #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.list_head .head {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
}

.list_head .headimg {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
}

.head .head-name {
    font-size: 16px;
    font-weight: bold;
}

.head .head-title {
    font-size: 13px;
    color: gray;
}

.list_head .closeimg {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 10px;
    margin-top: 7.5px;
    align-self: flex-start;
}

.switch {
    display: flex;
    position: fixed;
    bottom: 20px;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    left: 50%;
    transform: translateX(-41%);
}

.switch .an {
    width: 125px;
    height: 40px;
    background: rgba(0,0,0,0.3);
    margin-left: 10px;
    border-radius: 5px;
    line-height: 40px;
    text-align: center;
    border:1px solid rgba(255,255,255,0.3);
}

.switch .an:nth-child(2) {
    margin-right: 10px;
}


.singlegoods{
    width:100%;
    bottom: 0;
    height: auto;
    left: 0;
    border-radius: 0;
    background: rgba(0,0,0,0.4);
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
}
.singlegoods .good-title{
    display: block;
    color: #fff;
}
.singlegoods .good-desc{
    width:auto;
    padding:0 10px;
    flex: 1;
}
.singlegoods .good-img img{
    width:60px;
    height: 60px;
}
.singlegoods .good-img{
    width:60px;
    height: 60px;
    overflow: visible;
}
.singlegoods .good-price{
    font-size: 22px;
    font-weight: bold;
}
.singlegoods .cart {
    display: none;
}
.cartbtn{
    display: none;
}
.singlegoods .cartbtn{
    display: block;
    color: #fff;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 3px;
}
.singleback{
    position: fixed;
    top: 25px;
    left: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0,0,0,0.4);
    border-radius: 50%;
    text-align: center;
}
.singleback img{
    display: block;
    width:25px;
    height: 25px;
    padding-top: 7.5px;
    margin: 0 auto;
}

</style>