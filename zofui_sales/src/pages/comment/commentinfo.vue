<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="single">
                <div class="sing_top">
                    <div class="sing_top_avatar" :style="{'background-image':'url('+user.headimg+')'}"></div>
                    <div class="sing_top_right">
                        <div class="sing_top_nc">
                            <div class="sing_top_name">{{user.nickname}}</div>
                            <div class="sing_top_time">{{info.createtime}}</div>
                        </div>
                        <div class="sing_top_zhong">
                            <div class="sing_top_haoping" v-if="info.score_name">{{info.score_name}}</div>
                            <div class="sing_top_xx" :style="{'background-image':'url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/'+ (info.star >= item ? 'p_star_1' : 'p_star_0')+'.png)'}" v-for="item in [1,2,3,4,5]"></div>
                        </div>
                    </div>
                </div>
                <div @click="bindtap($event,'copy')" class="sing_text" :data-copy="info.content">
                    <font>{{info.content}}</font>
                </div>
                <img @click="bindtap($event,'img')" data-type="img" class="sing_img" mode="widthFix" :data-index="index" :data-img="info.img" :src="item" v-for="(item,index) in info.img" />
                    
                <div @click="singdel" class="sing_del" v-if="show_del == 1">删除</div>
                <div @click="Notrecommended" class="sing_del" v-else-if="is_admin==1 && info.status == 2">不推荐</div>
                <div @click="setrecommended" class="sing_del" v-else-if="is_admin==1 && info.status != 2">推荐</div>
                <div class="sing_del" v-if="show_del !=1 || is_admin !=1 "></div>
                <div class="cont_kuai_shang" @click="link" :data-url="good.appurl" >
                    <div class="kuai_shang_left" :style="{'background-image':'url('+good.thumb+')'}"></div>
                    <div class="kuai_shang_right">
                        <div class="kuai_shang_right_title">{{good.title}}</div>
                        <div class="kuai_shang_right_down" >
                            <div class="shang_right_down_left color-pri" >{{good.show_price}}元</div>
                            <div class="shang_right_down_right color-pri border-pri" >{{good.btn}}</div>
                        </div>
                    </div>
                </div>
                <div class="sing_zan">
                    <div @click="favorclick" class="sing_zan_btn" :data-cid="info.id" :style="{'background-image':'url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/sing_zan_btn'+ (info.zaned == 1 ? 3 : '') +'.png)'}"></div>
                    <div class="sing_zan_avatar" v-if="zan.list && zan.list.length > 0">
                        <div class="sing_zan_ava_xiao" :style="{'background-image':'url('+ zan.list[index] ? zan.list[index] : '' +')'}" v-for="item in [0,0,0,0]"></div>
                        <div class="sing_zan_ava_xiao sing_zan_ava_xiao2">...</div>
                    </div>
                    <div class="sing_zan_shu" v-if="info.zan > 0">{{info.zan}}人觉得很赞</div>
                </div>
            </div>

            <div class="praises_exciting"  v-if="datalist.length > 0">
                <div>更多评论</div>
                <font class="line bg-pri"></font>   
            </div>

            <div class="content" v-if="datalist.length > 0">

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="cont_kuai"  v-for="item in datalist">
                    <div class="cont_kuai_top">
                        <div class="kuai_top_avatar" :style="{'background-image':'url('+item.headimg+')'}"></div>
                        <div>
                            <div class="kuai_top_name">{{item.nickname}}</div>
                            <div class="kuai_top_zhong">
                                <div class="kuai_top_haoping" v-if="item.score_name">{{item.score_name}}</div>
                                <div class="kuai_top_xx" :style="{'background-image' : 'url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/'+ item.star >= inn ? 'p_star_1' : 'p_star_0' + '.png)'}" v-for="inn in [1,2,3,4,5]" ></div>
                            </div>
                        </div>
                    </div>
                    <div class="cont_kuai_mid">
                        <font>{{item.content}}</font>
                    </div>
                    <div class="cont_kuai_down" v-if="item.img.length > 0">
                        <div :ckass="'kuai_down_'+item.img.length" :style="{'background-image' : 'url('+pic+')'}" v-for="pic in item.img"  @click="bindtap($event,'img')" :data-img="item.img"></div>
                    </div>
                    <div catchtap="zztz" class="dianfen">
                        <div catchtap="favorclick2" class="cont_kuai_zan" :data-id="item.commid" >
                            <img class="cont_kuai_zan_icon" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/haoping_dianzan2.png" >
                            <img class="cont_kuai_zan_icon" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/haoping_dianzan.png" v-if="item.is_zan == 1">
                            <div style="line-height:34rpx; padding-top:3rpx;" v-if="item.zan > 0">{{item.zan}}</div>
                        </div>
                    </div>
                </div>
                </van-list>
            </div>
            
            <div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);"></div>

            <div @click="shareit" class="header_shouye header_fenxiang" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/praise_details_fx.png);"></div>

            <div class="Go_buy bg-pri" @click="link" :data-url="good.appurl" >{{good.btn}}</div>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

            <van-popup class="showposter_popup" v-model="showposter" position="bottom" >
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

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ImagePreview,Popup } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'commentinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [ImagePreview.name] : ImagePreview,
            [Popup.name] : Popup,
            sharetip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			user : {},
	  			sharedata :{},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'comm',
                        op : 'list',
                        gid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                good : {},
                info : {},
                show_del : 0,
                is_admin : false,
                zan : [],
                isshowshare : false,
                dev : '',
                showposter : false,
	  		}
	  	},
	  	created:function(e){
            //this.$emit('loadmessage',false);

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
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
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            favorclick(e){
                var self = this;
                var postdata = {
                    op : 'favorclick',
                    cid : e.currentTarget.dataset.cid,
                };
                self.$util.http('comm','GET',postdata,function(res){ 
                    if (!res.errno && res.data) {
                        var now = self.info.zan*1 + 1;
                        self.info.zan = now;
                        self.info.zaned = 1;
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('comm','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.info = res.data.info;
                        self.good = res.data.good;
                        self.user = res.data.user;

                        window.document.title = self.good.title;
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        self.$emit('loadmessage',{title:self.good.title});

		                self.onLoad();

	                	self.inited = 2;
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
#main {
    padding-bottom: 57.5px;
}
.single {
    width: 345px;
    padding: 15px 15px 50px;
}

.sing_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12.5px;
}

.sing_top_avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ddd;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.sing_top_right {
    width: 285px;
}

.sing_top_nc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.sing_top_name {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    line-height: 16px;
    color: #353535;
}

.sing_top_time {
    font-size: 12px;
    line-height: 12px;
    color: #888888;
}

.sing_top_haoping {
    font-size: 12px;
    color: #aaa;
    padding-top: 2px;
    margin-right: 5px;
}

.sing_top_zhong {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 12px;
}

.sing_top_xx {
    width: 12px;
    height: 12px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 5px;
}

.sing_text {
    font-size: 14px;
    line-height: 25px;
    letter-spacing: 1px;
    margin-bottom: 12.5px;
    word-break: break-all;
}

.sing_img {
    width: 345px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #ddd;
    margin-bottom: 10px;
    position: relative;
}

.sing_img_del {
    position: absolute;
    right: 5px;
    top: 5px;
}

.sing_img_del img {
    width: 40px;
    height: 40px;
}

.sing_del {
    font-size: 14px;
    color: #576b95;
    text-align: right;
    margin-bottom: 25px;
}

.cont_kuai_shang {
    width: 315px;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 0px 10px rgba(144,144,144,0.3);
    display: flex;
    justify-content: space-between;
    box-sizing: content-box;
    text-align: left;
    margin-bottom: 23.5px;
}

.kuai_shang_left {
    width: 69px;
    height: 69px;
    border: 1px solid #eeeeee;
    border-radius: 3.5px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.kuai_shang_right {
    width: 230px;
}

.kuai_shang_right_title {
    font-size: 14px;
    line-height: 17.5px;
    height: 36px;
    width: 230px;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-bottom: 4px;
}

.kuai_shang_right_down {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.kuai_shang_right_down2 {
    justify-content: flex-end;
}

.shang_right_down_left {
    font-size: 14px;
    color: #ff5050;
    font-family: 'DIN';
    font-weight: 700;
}

.shang_right_down_right {
    height: 29px;
    padding: 0 21.5px;
    font-size: 14px;
    line-height: 29px;
    border: 1px solid #ff5050;
    color: #ff5050;
    border-radius: 15px;
}

.sing_zan_btn {
    width: 86px;
    height: 86px;
    margin: 0 auto;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 21.5px;
}

.sing_zan_avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.sing_zan_ava_xiao {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #fff;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #ddd;
    margin-left: -12px;
}

.sing_zan_ava_xiao:nth-child(1) {
    margin-left: 0;
}

.sing_zan_ava_xiao2 {
    line-height: 15px;
    text-align: center;
    color: #767676;
}

.sing_zan_shu {
    font-size: 12px;
    line-height: 12px;
    color: #888888;
    text-align: center;
}

.praises_exciting {
    width: 128px;
    height: 32.5px;
    margin: 0 auto 30px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
.praises_exciting .line{
  width: 50px;
  height: 2.5px;
  display: inline-block;
}

.content {
    padding: 0 15px;
}

.cont_kuai {
    margin-bottom: 12px;
    border-bottom: 0.5px solid #eee;
    overflow: hidden;
}

.cont_kuai:nth-last-child(1) {
    border: none;
    margin-bottom: 0;
}

.cont_kuai_top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 12.5px;
}

.kuai_top_avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #dddddd;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 6.5px;
}

.kuai_top_name {
    color: #353535;
    line-height: 16px;
    font-size: 16px;
    text-align: left;
    margin-bottom: 6px;
}

.kuai_top_haoping {
    font-size: 11px;
    padding-top: 2.5px;
    color: #aaa;
    margin-right: 5px;
}

.kuai_top_zhong {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 11px;
}

.kuai_top_xx {
    width: 11px;
    height: 11px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 5px;
}

.cont_kuai_mid {
    width: 345px;
    font-size: 14px;
    color: #353535;
    line-height: 1.75;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    margin-bottom: 17.5px;
    text-align: left;
}

.cont_kuai_down {
    margin-bottom: 20px;
    overflow: hidden;
}

.kuai_down_1,.kuai_down_2,.kuai_down_3,.kuai_down_4,.kuai_down_5,.kuai_down_6,.kuai_down_7,.kuai_down_8,.kuai_down_9 {
    float: left;
    width: 345px;
    height: 345px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #dddddd;
}

.kuai_down_2 {
    width: 168px;
    height: 168px;
}

.kuai_down_2:nth-child(1) {
    margin-right: 9px;
}

.kuai_down_3:nth-child(1) {
    width: 227.5px;
    height: 227.5px;
    margin-right: 7.5px;
}

.kuai_down_3:nth-child(2),.kuai_down_3:nth-child(3) {
    margin-right: 0;
    width: 110px;
    height: 110px;
}

.kuai_down_3:nth-child(3) {
    margin-top: 7.5px;
}

.kuai_down_4 {
    width: 168px;
    height: 168px;
}

.kuai_down_4:nth-child(1),.kuai_down_4:nth-child(2) {
    margin-bottom: 9px;
}

.kuai_down_4:nth-child(1),.kuai_down_4:nth-child(3) {
    margin-right: 9px;
}

.kuai_down_5 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_5:nth-child(1) {
    width: 168px;
    height: 168px;
    margin-right: 9px;
}

.kuai_down_5:nth-child(2),.kuai_down_5:nth-child(3) {
    margin-bottom: 6px;
}

.kuai_down_5:nth-child(2),.kuai_down_5:nth-child(4) {
    margin-right: 5px;
}

.kuai_down_6 {
    margin-right: 0;
    width: 110px;
    height: 110px;
}

.kuai_down_6:nth-child(1) {
    width: 227.5px;
    height: 227.5px;
    margin-right: 7.5px;
}

.kuai_down_6:nth-child(2),.kuai_down_6:nth-child(3) {
    margin-bottom: 7.5px;
}

.kuai_down_6:nth-child(4),.kuai_down_6:nth-child(5) {
    margin-right: 7.5px;
}

.kuai_down_7 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_7:nth-child(1),.kuai_down_7:nth-child(6),.kuai_down_7:nth-child(7) {
    width: 168px;
    height: 168px;
    margin-right: 7.5px;
}

.kuai_down_7:nth-child(1) {
    margin-bottom: 7.5px;
}

.kuai_down_7:nth-child(7) {
    margin-right: 0;
}

.kuai_down_7:nth-child(2),.kuai_down_7:nth-child(4) {
    margin-right: 5px;
}

.kuai_down_7:nth-child(2),.kuai_down_7:nth-child(3) {
    margin-bottom: 5px;
}

.kuai_down_7:nth-child(4),.kuai_down_7:nth-child(5) {
    margin-bottom: 7.5px;
}

.kuai_down_8 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_8:nth-child(1) {
    width: 256px;
    height: 256px;
    margin-right: 8px;
}

.kuai_down_8:nth-child(1),.kuai_down_8:nth-child(4) {
    margin-bottom: 7.5px;
}

.kuai_down_8:nth-child(2),.kuai_down_8:nth-child(3) {
    margin-bottom: 6px;
}

.kuai_down_8:nth-child(5),.kuai_down_8:nth-child(6),.kuai_down_8:nth-child(7) {
    margin-right: 7px;
}

.kuai_down_9 {
    width: 110px;
    height: 110px;
    margin-right: 7.5px;
    margin-bottom: 7.5px;
}

.kuai_down_9:nth-child(3),.kuai_down_9:nth-child(6),.kuai_down_9:nth-child(9) {
    margin-right: 0px;
}

.kuai_down_9:nth-child(7),.kuai_down_9:nth-child(8),.kuai_down_9:nth-child(9) {
    margin-bottom: 0px;
}

.cont_kuai_zan {
    display: flex;
    justify-content: flex-start;
    width: 100px;
}

.cont_kuai_zan_icon {
    width: 17px;
    height: 17px;
    margin-right: 4.5px;
}

.dianfen {
    display: flex;
    justify-content: space-between;
    height: 18px;
    color: #888888;
    font-size: 14px;
    padding-bottom: 15px;
}

.content_more {
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: #576b95;
    margin-bottom: 55.5px;
}

.header_shouye {
    border-radius: 50%;
    background-color: rgba(0,0,0,0.5);
    width: 45px;
    height: 45px;
    position: fixed;
    left: 15px;
    bottom: 15px;
    z-index: 500;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.header_fenxiang {
    left: 85px;
}

.Go_buy {
    width: 135.5px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background-color: #ff5050;
    color: #fff;
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 500;
    border-radius: 22.5px;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    padding: 15px 0 30px;
    background-color: #fff;
    margin-top: 62.5px;
}

.footer .logo img {
    height: 40px;
    width: 40px;
}

.footer .text {
    margin: 0 15px;
    line-height: 20px;
}

.footer .btn button {
    font-size: 12px;
    background: #ffd93f;
    width: 57.5px;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
}

.footer .btn img {
    width: 10.5px;
    height: 11px;
    margin-right: 4px;
}
</style>