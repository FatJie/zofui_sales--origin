<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
        <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

                <div class="invite-txt wrap">
                    <div class="item" v-for="item in quest" wx:key="key">
                        <div class="tit">{{item.quest}}</div>
                        <div>{{item.answer}}</div>
                    </div>
                </div>
                <div class="popup-container __top " :class="shareVisible ? 'popup-container--visible' : ''" catchtouchmove="false" style="display:block" v-if="SharePopupshow">
                    <div @click="openShareArea" catchtouchmove="false" class="popup-shade"></div>

                    <img v-if="posterurl" class="posterurl" :src="posterurl">
                    <div class="popup-modal" >
                        <div class="share-area">
                            <div class="item" @click="shareit" v-if="dev == 'wx'">
                                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/90386/25/1451/2465/5dbeef68Eacb15f2c/5673453822fdf77a.png">
                                <div>分享给好友</div>
                            </div>
                            <div class="item" @click="wxshare(1)" v-if="dev == 'app'">
                                <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                                <div>分享给好友</div>
                            </div>
                            <div class="item" @click="wxshare(2)" v-if="dev == 'app'">
                                <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                                <div>分享朋友圈</div>
                            </div>
                            <div class="item" @click="shareposter" v-if="posterurl && dev == 'app'">
                                <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                                <div>分享海报</div>
                            </div>
                            <div @click="getposter" class="item">
                                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/65504/16/14583/1913/5dbeef7cEde06ec79/1e3b7bd3eea32c40.png">
                                <div>生成海报</div>
                            </div>
                            <div @click="openShareArea" class="close">
                                <font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                </div>
                <van-action-sheet v-model="showshareposter" :actions="[{name:'发给好友',id:1},{name:'发到朋友圈',id:2}]" @select="onshareWXposter" />

                <div class="fix-box" style="">
                    <div @click="openShareArea">
                        <div class="g-fixbtn bg-pri">邀请好友加入团队</div>
                    </div>
                </div>

                <sharetip :isshowshare="isshowshare" @shareit="shareit" />

            </div>
        </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePreview,Popup,ActionSheet } from 'vant';
	import tabbar from '../../components/tabbar';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [Popup.name] : Popup,
            [ActionSheet.name] : ActionSheet,
	    	tabbar,sharetip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                quest : [],
                SharePopupshow : false,
                shareVisible : false,
                isshowshare : false,
                dev : '',
                posterurl : '',
                showshareposter : false,
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

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
            shareit(){
                this.isshowshare = !this.isshowshare
            },
            openShareArea(){
                var self = this;
                self.SharePopupshow = !self.SharePopupshow;

                setTimeout(function(){
                    self.shareVisible = self.SharePopupshow ? 'visible' : '';
                },100)

            },
            getposter(){
                var self = this;
                self.$util.http('poster','GET',{op:'user',path:self.sharedata.link},function(res){    
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        /*ImagePreview({
                            images : [res.data.url],
                            closeOnPopstate : true
                        });*/
                        if( self.dev == 'wx' ){
                            self.$toast('可长按图片转发给好友');
                        }else if(self.dev == 'wap'){
                            self.$toast('可截屏保存到手机相册');
                        }

                    }else{
                        self.$toast(res.message);
                    }
                },true);
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
            shareposter(){
                this.showshareposter = true;
            },
            onshareWXposter(item){
                var self = this;
                var scene = 'session';
                if(item.id == 2){
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
            initData(){
                var self = this;
                self.dev = self.$util.dev();

                var query = this.$route.query;
                var postdata = {
                    op : 'inviteshop',
                    zfid : query.zfid ? query.zfid : 0,
                }

	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
                        self.quest = res.data.quest;

                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
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
@import "../../assets/css/iconfont.css";
#main{
    min-height: 100vh;
    background-color: #fff;
}
.fix-box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    z-index: 111;
}

.popup-container .popup-shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(0,0,0,0.6);
    transition: all 0.3s;
}

.popup-container .popup-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    opacity: 0;
    background-color: #fff;
    transition: all 0.3s;
    box-sizing: border-box;
}

.popup-container .popup-modal.popup-modal--full {
    height: 100%;
}

.popup-container .popup-modal.popup-modal--half {
    height: auto;
}

.popup-container.__top .popup-modal {
    top: 100%;
}

.popup-container.__bottom .popup-modal {
    top: 0;
    transform: translate(0,-100%);
}

.popup-container.__left .popup-modal {
    left: 100%;
}

.popup-container.popup-container--visible.__top .popup-modal {
    transform: translate(0,-100%);
}

.popup-container.popup-container--visible.__bottom .popup-modal {
    transform: translate(0,0);
}

.popup-container.popup-container--visible.__left .popup-modal {
    transform: translate(-100%,0);
}

.popup-container.popup-container--visible .popup-modal {
    opacity: 1;
}

.popup-container.popup-container--visible .popup-shade {
    opacity: 1;
    visibility: visible;
}

.btn-share {
    position: fixed;
    top: 45%;
    right: 10px;
    z-index: 5;
    width: 60px;
    height: 60px;
}

.btn-share img {
    display: block;
    width: 100%;
    height: 100%;
}

.gotop {
    top: 25px;
}

.share-area {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 26px 0 20px;
}

.share-area .item {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
    background-color: transparent;
    border-radius: 0;
}

.share-area .item img {
    width: 38px;
    height: 38px;
}

.share-area .close {
    position: absolute;
    bottom: 100%;
    right: 12px;
    margin-bottom: 10px;
    color: #fff;
}

.share-area .close .iconfont {
    font-size: 20px;
}

.invite-txt .item {
    position: relative;
    padding-left: 15px;
    margin: 15px 0;
    font-size: 13px;
    line-height: 23px;
    color: #252525;
}

.invite-txt .item:before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 7px;
    height: 7px;
    background-color: #cda571;
    border-radius: 50%;
}

.invite-txt .item .tit {
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
} 
.posterurl{
    position: fixed;
    top: 20px;
    width: 70%;
    left: 15%;
}
</style>