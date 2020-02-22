<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />

        <div class="bg_audio"  @click="replaybg" v-if="good.music">
            <img :class="audioplaying ? 'music-btn-ani' : ''" :style="{ 'top' : dev == 'app' ? '70px':'40px'}" src="https://img11.360buyimg.com/ddimg/jfs/t1/74637/31/7451/1357/5d57e82eE1c06ed22/5965b60a624b89e2.png" />  
        </div>
        <audio id="bgMusic" :src="good.music" loop="loop"></audio>

        <div id="content" v-if="inited == 2">
            
            <subtip :params="params"></subtip>

            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" :disabled="disrefresh" v-scroll="scrolltop" success-font="已刷新">

            <img class="jiziimg"  v-lazy="good.thumb" >
            <div class="type-bar lbg-pri">
                <div class="lt">
                    <img class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/80877/20/258/2622/5ce676f5Edda648a9/e7440e6948a1eb55.png">
                </div>
                <div class="rt" v-if="good.status == 3">已结束</div>
                <div class="rt" v-else>
                    距{{good.status == 0?'结束':''}}{{good.status == 2?'开始':''}}
                    <div class="countdown" >
                        <template v-if="Countdown.day != 0">
                            <font>{{Countdown.day}}</font> 天
                        </template>
                        <font>{{Countdown.hour}}</font> :
                        <font>{{Countdown.minute}}</font> :
                        <font>{{Countdown.second}}</font>
                    </div>
                </div>
            </div>
            <div class="info-wrap">
                <div class="item_cell_box discount_box">
                    <div class="discount item_cell_flex" >
                        <font >价值 </font>
                        <font class="_price color-pri" >{{good.fee}}</font>
                        <font > 剩余 {{good.stock}} </font>
                    </div>
                    <div class="info-divs pri-color" style="background-color:rgba(255,39,65, .08);">
                        <img class="iconfont bg-pri" src="https://img11.360buyimg.com/ddimg/jfs/t30157/219/1634375992/2858/bd203d37/5ce65dc6N980a59ce.png" />
                        <div class="divs color-pri">{{good.joined}}人参与</div>
                    </div>
                </div>
                <div class="info-title">
                    {{good.title}}
                </div>
            </div>

            <div class="font_box">
                <div class="btn_box item_cell_box">
                    <div class="item_cell_flex headlist">
                        <div class="joinednum" v-if="good.isjoined == 0">{{good.joined}}人参与活动</div>
                        <div class="joinednum" v-if="good.isjoined == 1">{{good.helpnum}}人帮你集字</div>
                        <div class="joinedhead">
                            <img v-for="item in headlist" :src="item.headimg ? item.headimg : 'https://i.jd.com/commons/img/no-img_mid_.jpg'" >
                        </div>
                    </div>


                    <div  @click="joinactfn(good.isjoined)" v-if="isjoined.status == 0 || !isjoined || !isjoined.status" class="btn joinbtn lbg-pri">{{good.isjoined == 0 ? '参与活动' : '请好友帮集字'}}</div>

                    <div v-if="good.isjoined == 1"  @click="cposter" class="btn posterbtn joinbtn bg-sec">海报</div>

                    <div v-if="isjoined.status == 1" @click="shareit(true)" class="btn joinbtn lbg-pri">邀请好友参与</div>

                </div>

                <div class="font_in" v-for="item in good.fontarr">
                    <div class="font_item" :class="inn.isact == 1 ? 'color-pri' : ''" v-for="inn in item" >{{inn.font}}</div>
                </div>

                <div class="tomyprize" v-if="isjoined.status == 1">
                    <div @click="link" data-url="/orderlist" class="btn joinbtn lbg-pri">查看我的奖品</div>
                </div>

                <div class="goodsqun" v-if="params.isgkf == 1">
                    <div class="item_cell_box mb20" >
                        <div class="goodsqun_head">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/50953/32/1956/5619/5cfcb6cfEe4f52864/172a393add980d52.png" >
                        </div>
                        <div class="item_cell_flex goodsqun_desc">
                            <div>联系客服</div>
                        </div>
                        <div class="btn btn-gray lbg-pri" @click="link" :data-url="'/kefuindex?shopid='+good.shopid+'&jid='+good.id+'&role=user'">客服</div>
                    </div>
                </div>

            </div>

            <div class="sub_title">
                活动奖品
                <div class="tbot bg-pri"></div>
                <div class="group-lists">
                    <div class="item" :class="index > 0 ? 'thin-border_t' : ''" v-for="(item,index) in good.prizelist" >
                        <img class="item_avatar tcthumb" v-lazy="item.thumb">
                        <div class="item_name">{{item.title}}</div>
                        <div class="item_btn lbg-pri" @click="link" :data-url="item.appurl">去看看</div>
                    </div>
                </div>
                
            </div>

            <div class="sub_title">
                活动详情<div class="tbot bg-pri"></div>
            </div>
            <div class="content detail-content section" v-html="good.content"></div>

            <div class="sub_title" v-if="helplist.length > 0">
                帮助好友
                <div class="tbot bg-pri"></div>
            </div>
            <div class="section" v-if="helplist.length > 0">
                <div class="item_cell_box helpitem" v-for="item in helplist">
                    <div class="help_head">
                        <img v-lazy="item.headimg" >
                    </div>
                    <div class="item_cell_flex help_nick">{{item.nickname}}</div>
                    <div class="help_font">集到 {{item.font}}</div>
                </div>
            </div>

            <div class="sub_title">
                店主推荐
                <div class="tbot bg-pri"></div>
            </div>
            <div class="sub_goods">
                <div class="goods_item" @click="link" :data-url="item.appurl"  v-for="item in tuijian">
                    <img  v-lazy="item.thumbh">
                    <font class="goods_tit">{{item.title}}</font>
                    <div class="goods_ft">
                        <div class="price_cur">{{item.show_price}}</div>
                        <div class="price_org item_cell_flex tr">{{item.ncon}} {{item.saled}}</div>
                    </div>
                </div>
            </div>

            <div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);" ></div>

            <div class="showgeted" v-if="showgeted">
                <div class="mask"></div>
                <div class="maskimg"></div>
                <div class="font_f" >
                    <div class="tip">{{showgetedstr ? showgetedstr : '恭喜你已收集到'}} </div>
                    <div class="font zoomin">{{getfont}}</div>
                    <div class="van-icon van-icon-close" @click="hidegeted"></div>
                </div>
            </div>

            <div class="m-pop pop-container--visible" v-if="showjoin">
                <div class="pop-shade" @click="showjoinfn"></div>
                <div class="pop-modal" :class="showjoin ? 'bounceInUp' : ''">
                    <div class="pop-userinfo">
                        <div class="tit">参与活动</div>

                        <div class="area">
                            <div class="tip">填写个人信息以便于联系兑奖</div>
                            <div class="row_inp thin-border_b">
                                <input name="tel" bindinput="name" placeholder="请输入姓名" type="text" v-model="userinfo.name"   />
                            </div>
                            <div class="row_inp thin-border_b">
                                <input name="tel" bindinput="tel" placeholder="请输入手机号" type="tel" v-model="userinfo.tel"  style="flex: 1" />
                            </div>
                            <div class="row_btn">
                                <div class="btn" @click="joinactpost" >确认参与</div>
                            </div>
                        </div>
                        <div @click="showjoinfn" class="close van-icon van-icon-close"></div>
                    </div>
                </div>
            </div>

            </van-pull-refresh>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

            <van-popup class="showposter_popup showposter" v-model="showposter" position="bottom" >
                <div class="showposter item_cell_box" >
                    <div class="showposter_item" @click="wxshare(1)" style="width:50%;">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>转发给好友</div>
                    </div>
                    <div class="showposter_item" @click="wxshare(2)" style="width:50%;">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>转发到朋友圈</div>
                    </div>
                </div>
            </van-popup>

            <van-popup class="showposter" v-model="showposterurl" position="bottom" >
                <img class="poster_img" :src="posterurl">
                <div class="showposter item_cell_box" v-if="dev == 'app'">
                    <div class="showposter_item" @click="wxshareposter(1)">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>转发给好友</div>
                    </div>
                    <div class="showposter_item" @click="wxshareposter(2)">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>转发到朋友圈</div>
                    </div>
                    <div class="showposter_item" @click="saveposter">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70599/27/1062/4948/5cf5d8a7E1d3b8a1d/7f74b9b5814e0c6e.png">
                        <div>保存到相册</div>
                    </div>
                </div>
            </van-popup>

            <div v-if="isshowsub">
                <div @click="hidepopsub" class="login-fullbtn __show " >
                </div>
                <div class="login-content tipstop-box " :class="isshowsub ? 'bounceInUp' : ''">   
                    <img :src="params.subqr.guanzhuqr" style="width:100%;" />
                    <div class="content">
                        <div>长按二维码关注公众号，便于查询订单和获取订单进度</div>
                    </div>
                    <div @click="hidepopsub" class="btn bg-pri">关闭</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ImagePreview,Popup } from 'vant';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'jiziinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            sharetip,subtip,
	  	},
	  	data : function(){
	  		return {
                disrefresh : false,
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                good : {},
                headlist : [],
                tuijian : [],
                helplist : [],
                helpdata : [],
                isjoined : {},
                timer : null,
                Countdown : {day:0,hour:0,minute:0,second:0},
                showgeted : false,
                showjoin : false,
                posterurl : '',
                isshowshare : false,
                dev : '',
                showposter : false,
                showposterurl : false,
                isshowsub : false,
                music : false,
                audioplaying : false,
                isclick : false,
	  		}
	  	},
	  	created:function(e){
            
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  		
	  	},
        beforeRouteLeave(to,from,next){
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
	  	methods: {
            scrolltop(e){
                this.disrefresh = e <= 0 ? false : true;
            },
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            joinact(){
                this.showjoin = true;
            },
            hidepopsub(){
                this.isshowsub = false;
            },
            joinactpost: function() {
                var self = this;
                
                var postdata = {
                    gid:self.good.id,
                    op:'join',
                    name : self.userinfo.name,
                    tel : self.userinfo.tel,
                };

                if( !postdata.name || postdata.name == '' ){
                    self.$toast('请填写姓名'); return false;
                }
                if( !postdata.tel || postdata.tel == '' ){
                    self.$toast('请填写联系电话');return false;
                }
                if( !self.$util.verify('mobile',postdata.tel) ){
                    self.$toast('请填写正确的联系电话');return false;
                }
                self.$util.http('jizi','GET',postdata,function(res){
                    if (!res.errno && res.data) {
                        if( res.data.font ){
                            
                            self.showgeted = true;
                            self.showgetedstr = false;
                            self.getfont = res.data.font;

                            var font = self.good.font;
                            for (var i = 0; i < font.length; i++) {
                                if( font[i].font == res.data.font ){
                                    self.$set(font[i],'isact',1);
                                }
                            }
                        }
                        self.showjoin = false;
                        self.initData();

                    }else if( res.errno == 2 ){
                        self.isshowsub = true;
                    }else{
                        self.$toast(res.data.message);
                    }
                },true)
            },
            joinactfn(isjoined){
                if( isjoined == 0 ){
                    this.joinact();
                }else{
                    this.shareit(true);
                }
            },
            shareit(bool){
                if( this.dev == 'app' ){
                    this.showposter = true;
                }else{
                    this.isshowshare = bool;
                }
            },
            wxshare(type){
                var self = this;
                var scene = 'session';
                if(type == 2){
                    scene = 'timeline';
                }
                var wx = api.require('wx');
                wx.shareWebpage({
                    apiKey: '',
                    scene: scene,
                    title: self.sharedata.title,
                    description: self.sharedata.desc,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.sharedata.link
                }, function(ret, err) {
                    if (ret.status) {
                        self.$toast('已分享');
                    } else {
                        self.$toast(err.code);
                    }
                });
            },
            cposter(){
                var self = this;
                var postdata = {
                    op:'getposter',
                    id:self.good.id,
                    path : self.sharedata.link,
                };

                self.$util.http('jizi','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        self.showposterurl = true;

                        if( self.dev == 'app' ){

                        }else if(self.dev == 'wx'){
                            Dialog.alert({message:'可长按图片转发给好友'});
                        }else if(self.dev == 'wap'){
                            Dialog.alert({message:'可截屏保存到手机'});
                        }

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            wxshareposter(type){
                var self = this;
                var scene = 'session';
                if(type == 2){
                    scene = 'timeline';
                }
                var wx = api.require('wx');
                wx.shareImage({
                    apiKey: '',
                    scene: scene,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.posterurl,
                }, function(ret, err) {
                    if (ret.status) {
                        self.$toast('已分享');
                    } else {
                        self.$toast(err.code);
                    }
                });
            },
            saveposter(){
                var self = this;
                api.saveMediaToAlbum({
                    path: self.posterurl
                }, function(ret, err) {
                    if (ret && ret.status) {
                        self.$toast('已保存到相册，可从相册选择发给微信好友或朋友圈');
                    } else {
                        self.$toast('保存失败');
                    }
                });
            },
            showjoinfn(){
                this.showjoin = !this.showjoin;
            },
            hidegeted : function(){
                this.showgeted = false;
            },
            endTime(){
                var self = this;
                clearInterval(self.timer);
                self.timer = null;

                self.countTime();

                self.timer = setInterval(function(){
                    self.countTime();
                },1000);
            },
            countTime(){
                var self = this;
                var date = new Date();
                var time = date.getTime();

                var endTime = 0;
                if( self.good.status == 0 ) {
                    endTime = self.good.end + '000';
                }
                if( self.good.status == 2 ) {
                    endTime = self.good.start + '000';
                }

                if(endTime != 0){
                    var lag = (endTime*1 - time);
                    if(lag > 0){
                        var second = Math.floor(lag/1000%60);     
                        var minite = Math.floor(lag/1000/60%60);
                        var hour = Math.floor(lag/1000/60/60%24);
                        var day = Math.floor(lag/1000/60/60/24);
                    }else{
                        var second = 0;
                        var minite = 0;
                        var hour = 0;
                        var day = 0;
                        if( self.good.status == 0 ){
                            self.good.status = 3;
                        }else if( self.good.status == 2 ){
                            self.good.status = 0;
                        }
                    }
                    self.Countdown = {day:day,hour:hour,minute:minite,second:second};
                }
            },
            replaybg(){
                if(this.music.paused) {
                    this.music.play();
                    this.audioplaying = true;
                } else {
                    this.music.pause();
                    this.audioplaying = false;
                }
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                
                document.addEventListener('touchstart',function(){
                    if( !self.isclick && self.music ){
                        self.music.play();
                        self.isclick = true;
                    }
                });

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.lat = loc.lat;
                if( loc.lng ) self.lng = loc.lng;

                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                    lat : self.lat ? self.lat : 0,
                    lng : self.lng ? self.lng : 0,
                }

	            self.$util.http('jizi','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
                        self.good = res.data.info;
                        self.headlist = res.data.headlist ? res.data.headlist : [];
                        self.tuijian = res.data.tuijian ? res.data.tuijian : [];
                        self.helplist = res.data.helplist ? res.data.helplist : [];
                        self.helpdata = res.data.helpdata ? res.data.helpdata : {};
                        self.isjoined = res.data.isjoined ? res.data.isjoined : {};
                        self.userinfo = res.data.userinfo ? res.data.userinfo : {};
                        self.sharedata = res.data.sharedata;
                        
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
                        setTimeout(function(){
                        if( self.good.music ){
                            self.music = document.getElementById('bgMusic');
                            self.audioplaying = true;
                            self.music.play();
                            if( self.dev == 'wx' ){
                                document.addEventListener("WeixinJSBridgeReady", function (){
                                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                                        self.music.play();
                                    }, false);
                                });
                            }
                        }
                        },1000)

                        window.document.title = self.good.title;
                        self.$emit('loadmessage',{title:self.good.title});

                        self.endTime();
	                	self.inited = 2;
                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
                        }
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
	  		onLoad() {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/login.css";
.pop-userinfo {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 82%;
    background-color: #fff;
    transform: translate(-50%,-50%);
    border-radius: 6px;
}

.pop-userinfo .tit {
    padding: 0 20px;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    color: #fff;
    background-color: #f73334;
    border-radius: 6px 6px 0 0;
    text-align: center;
}

.pop-userinfo .area {
    padding: 15px 20px;
}

.pop-userinfo .area .tip {
    margin-bottom: 15px;
    font-size: 15px;
    line-height: 20px;
    color: #525252;
}

.pop-userinfo .row_inp {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 45px;
    border-color: #c4c4c4;
    margin-bottom: 8px;
}

.pop-userinfo .row_inp input {
    font-size: 14px;
    width: 100%;
    text-align: left;
    border:0;
    border-radius: 0;
}

.pop-userinfo .row_btn {
    padding: 20px 0;
    text-align: center;
}

.pop-userinfo .row_btn .btn {
    width: 165px;
    height: 36px;
    font-size: 15px;
    line-height: 36px;
    color: #fff;
    background-color: #fc9127;
    border-radius: 36px;
    margin-top:15px;
    display: inline-block;
}

.pop-userinfo .close {
    position: absolute;
    z-index: 5;
    top: 100%;
    left: 50%;
    width: 28px;
    height: 28px;
    margin-left: -14px;
    margin-top: 20px;
    font-size: 35px;
    text-align: center;
    line-height: 28px;
    color: #fff;
}

.detail-content img{
    max-width: 100%;
  display: block;
}


#main {
    min-height: 100vh;
    background-color: #fff;
}
button {
    line-height: normal;
    padding: initial;
    margin: initial;
    background-color: initial;
    color: initial;
    overflow: initial;
}
.button-hover{
    background-color: initial;
    color: initial;
    opacity: initial;
}
.sub_title {
    color: #353535;
    font-size: 16px;
    text-align: center;
    display: block;
    padding:15px;
    font-weight: bold;
    border-top: 15px solid #f8f8f8;
}

.sub_title .tbot {
    width: 20px;
    height: 4px;
    display: block;
    margin: 14px auto 0;
}

.sub_goods {
    margin: 10px 10px 0;
    display: flex;
    flex-wrap: wrap;
}

.goods_item {
    background-color: #fff;
    width: 165px;
    padding: 5px;
    height: 175px;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 10px;
    text-align: left;
}

.goods_item:nth-child(2n-1) {
    margin-right: 5px;
}

.goods_item img {
    width: 165px;
    height: 92.5px;
    display: block;
    background-color: #eee;
}

.goods_item .goods_tit {
    color: #353535;
    font-size: 14px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0;
}

.price_cur {
    color: #ff4040;
    font-size: 16px;
    margin-right: 7.5px;
    font-family: 'DIN';
}

.price_org {
    color: #cccccc;
    font-size: 12px;
    font-family: 'DIN';
}


.goods_ft {
    display: flex;
    align-items: center;
}

.yhtext {
    font-size: 10px;
    color: #ff4040;
    border: 1px solid #ff4040;
    padding: 0 1px;
    margin-right: 5px;
    height: 14px;
}

.kanjiatk {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    top: 0;
    z-index: 999;
    text-align: center;
}

.kanjiatk .infotext {
    background-color: #fff;
    width: 230px;
    font-size: 14px;
    color: #353535;
    padding: 22.5px;
    border-radius: 10px;
    height: 309px;
    margin: 122.5px auto 0;
    text-align: left;
    line-height: 1.6;
}

.kanjiatk .info_tit {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
}

.kanjiatk .info_tit .tit_line {
    background: #ffd93f;
    width: 20px;
    height: 3px;
    margin: 10px auto 20px;
}

.kan_icon_alarm {
    width: 50px;
    height: 49.5px;
}

.text_kan {
    color: #888888;
}

.text_kan2 {
    font-size: 12px;
    color: #353535;
}

.red {
    color: #ff5050;
}

.rulesinfo {
}

.btn_ {
    width: 100%;
    text-align: center;
    padding-top: 26px;
}

.btn_close {
    width: 38.5px;
    height: 38px;
}

button.dbtn{
    background-color: initial!important;
    padding-left: initial!important;
    padding-right: initial!important;
    line-height: initial!important;
}
.tr{
    text-align: right;
}
.price_cur{
    font-size: 16px;
}
.price_cur text{
    font-size: 11px;
}

.info-wrap{
    padding: 10px 15px;
    border-bottom: 0.5px solid #f8f8f8;
}
.discount {
    font-size: 11px;
    font-family: DIN;
    color: #999;
}
.discount ._price {
    font-size: 24px;
    font-weight: bold;
}
.info-divs {
    position: relative;
    display: inline-flex;
    align-items: flex-end;
    height: 20px;
    margin-left: 14px;
    font-size: 11px;
    line-height: 20px;
    border-radius: 20px;
    padding-right:0;
}
.info-divs::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
}

.info-divs .iconfont {
    position: relative;
    margin-right: 6px;
    height: 23px;
    width: 23px;
    display: inline-block;
    font-size: 23px;
    line-height: 23px;
    opacity: 0.8;
}
.info-title {
    margin-top: 7.5px;
    font-weight: 500;
    font-size: 17px;
    color: #292929;
}
.discount_box{
    align-items: center;
}
.info-divs .divs{
    padding: 0 5px;
}

.type-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
}

.type-bar .lt_img {
    width: 80px;
    height: 21px;
}
.jiziimg{
    display: block;
    width: 100%;
}
.countdown{
    display: inline-block;
}
.header_shouye{
    left: 10px;
    z-index: 5;
    bottom: 10px;
}
.font_box{
    padding: 10px 15px 15px;
}
.font_item{
    width: 80px;
    display: inline-block;
    height: 80px;
    background-color: #f8f8f8;
    color: #999;
    border-radius: 50%;
    font-size: 50px;
    text-align: center;
    line-height: 80px;
    margin: 0 6.25px 6.25px 0;

    background-repeat:no-repeat;
    background-position:0 0;
    background-size:100% 100%;
    box-shadow:0 0 2.5px 0 rgba(0,0,0,0.1);
}
.font_in .font_item:last-child{
  margin-right: 0;
}
.btn_box{
    align-items: center;
    padding-bottom: 15px;
}
.headlist{
    font-size: 12px;
    align-items: center;
}
.font_in{
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
    -webkit-box-pack:justify;
    justify-content:center;
    font-weight: bold;
}
.joinedhead{
    margin-left: 10px;
}
.joinedhead img{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: inline-block;
    margin-left: -10px;
    border: 1px solid #fff;
}

.joinbtn{
    padding: 0 15px;
    border-radius: 40px;
    height: 30px;
    line-height: 30px!important;
    font-size: 12.5px!important;
}

.joinednum{
    padding-bottom: 5px;
    color: #999;
}

.group-lists .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 20px 0;
}

.group-lists .item_avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
}

.group-lists .item_name {
    -webkit-box-flex: 1;
    flex: 1;
    margin: 0 8px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-align: left;
}

.group-lists .item_info {
    font-size: 14px;
    text-align: right;
    line-height: 22px;
    color: #666;
}

.group-lists .item_info .num {
    font-size: 17px;
}

.group-lists .item_btn {
    height: 27.5px;
    padding: 0 13px;
    margin-left: 10px;
    font-size: 13px;
    line-height: 27.5px;
    border-radius: 3px;
}

.section{
    padding: 0 15px 15px;
    font-size: 13px;
}

.showgeted .font_f{
    position: fixed;
    z-index: 6;
    color: #fff;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-left: -100px;
    margin-top: -100px;
    text-align: center;
}
.showgeted .font{
    font-size: 100px;
    font-weight: bold;
    animation-name:zoomin; 
    animation-duration:0.5s; 
    -webkit-animation-name:zoomin; 
    -webkit-animation-duration:0.5s;
}
@keyframes zoomin
{
    from { transform:scale(0.5,0.5); opacity: 0; filter:alpha(opacity=0);}
    to { transform:scale(1,1); opacity: 1; filter:alpha(opacity=100);}
}
.showgeted .tip{
    font-size: 12px;
    margin-bottom: 10px;
}

.showgeted .zan-icon-close{
    margin-top:125px;
    font-size: 35px;
    color: #fff;
    font-weight: bold
}
.showgeted .maskimg{
    background-image: url(https://img11.360buyimg.com/ddimg/jfs/t1/62018/16/335/104541/5ce7e68eE14052a93/dfd636c9665d32b5.png);
    background-size:100% auto;
    background-repeat: no-repeat;
    background-position: center center;
    animation: que 8s linear infinite;
    position: fixed;
    width: 258px;
    height: 258px;
    top: 50%;
    left: 50%;
    margin-top:-129px;
    margin-left:-129px;
    z-index: 5;
}
@keyframes que {
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
}

.helpitem{
    align-items: center;
    padding: 10px 0;
}
.help_head img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border:1px solid #fff;
}
.help_nick{
    font-weight: bold;
    font-size: 12.5px;
    padding-left: 15px;
}
.help_font{
    color: #666;
    font-size: 12.5px;
}

.tomyprize{
    padding: 10px 0;
    text-align: center;
}
.tomyprize .btn{
    display: inline-block;
}
.posterbtn{
    margin-left: 10px;
}

/**/
.goodsqun{
    padding: 15px 0;
    padding-top: 7.5px;
}
.goodsqun .item_cell_box{
    box-shadow: 0.5px 0.5px 5.5px rgba(224, 238, 232, 0.5);
    padding: 15px;
    align-items: center;
    border-radius: 5px;
}
.goodsqun_head{
    width: 40px;
    height: 40px;
}
.goodsqun_head img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.goodsqun_desc{
    padding-left: 15px;
    font-size: 12.5px;
}
.goodsqun_descin{
    color: #999;
}
.goodsqun .btn{
    padding: 2.5px 10px;
    border-radius: 1.5px;
    background-color: #19ec27;
    font-size: 12px;
}
/**/
.bg_audio img{
    width: 40px;
    height: 40px;
    border-radius:50%;
    position: fixed;
    z-index:2;
    top: 15px;
    left: 13px;
}
.music-btn-ani {
    -webkit-animation: music 1.5s infinite linear;
    animation: music 1.5s infinite linear;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

@keyframes music {
    0% {
        -webkit-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1)
    }

    50% {
        -webkit-transform: rotate(180deg) scale(1.1);
        transform: rotate(180deg) scale(1.1)
    }

    to {
        -webkit-transform: rotate(1turn) scale(1);
        transform: rotate(1turn) scale(1)
    }
}

.poster_img{
    position: absolute;
    top: -95vh;
    width: 70%;
    left: 15%;
    z-index: 2003;
}
.van-popup{
    overflow: initial;
}

</style>