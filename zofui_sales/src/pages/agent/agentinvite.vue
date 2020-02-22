<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div>
                <div class="toptis">你的邀请码：{{userinfo.agentcode}}，商户注册时填写此邀请码即成为你的商户</div>
                
                <div v-if="poster" class="topposter">
                    <img :src="poster" >
                </div>
            </div>

            <div >
                <div class="fix-box" style="">
                    <div class="app-tabbar">
                        <div @click="shareit(true)" class="item gs-fixbtn bg-pri" v-if="dev != 'app'">
                            直接邀请
                        </div>
                        
                        <div class="item" v-if="dev == 'app'" @click="wxshare(2)">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                            <div>分享朋友圈</div>
                        </div>
                        <div class="item" @click="wxshare(1)" v-if="dev == 'app'">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                            <div>分享给好友</div>
                        </div>
                        <div @click="shareposter" class="item" v-if="dev == 'app'">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                            <div>分享海报</div>
                        </div>
                        <div @click="saveposter" class="item" v-if="dev == 'app'">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70599/27/1062/4948/5cf5d8a7E1d3b8a1d/7f74b9b5814e0c6e.png">
                            <div>保存到相册</div>
                        </div>

                    </div>
                </div>
            </div>
            <van-action-sheet v-model="showshareposter" :actions="[{name:'发给好友',id:1},{name:'发到朋友圈',id:2}]" @select="onshareWXposter" />
            
            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ActionSheet } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'groupinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [ActionSheet.name] : ActionSheet,
            sharetip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                poster : null,
                isshowshare : false,
                dev : '',
                showshareposter : false,
	  		}
	  	},
	  	created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }

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
                this.isshowshare = bool;
            },
            getPoster(){
                var self = this;
                var postdata = {op:'agent',path:self.sharedata.link};
                self.$util.http('poster','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        
                        self.poster = res.data.url;
                    }else{
                        self.$toast(res.message);
                    }
                });
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
            saveposter(){
                var self = this;
                api.saveMediaToAlbum({
                    path: self.poster
                }, function(ret, err) {
                    if (ret && ret.status) {
                        self.$toast('已保存到相册，可从相册选择发给微信好友或朋友圈');
                    } else {
                        self.$toast('保存失败');
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
                    contentUrl: self.poster,
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
                var params = this.$route.query;
                var postdata = {
                    op : 'invite',
                    id : params.id ? params.id : 0,
                }
	            self.$util.http('agent','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.userinfo = res.data.userinfo;
                        self.params = res.data.params;
                        self.sharedata = res.data.sharedata;

                        self.getPoster();
		                
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

	                	self.inited = 2;

                    }else if( res.data.errno == 3 ){    
                        self.$router.push('/agentjoin');
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
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
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

.share-area .item:first-child {
    border-right: 0.5px solid #d0d0d0;
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
.gs-fixbtn{
    width: 50%;
    font-size: 15px!important;
}
.gs-fixbtn:last-child{
    background: #ed414a!important;
}
.toptis{
    color: #666;
    margin:0 auto;
    margin-top:10px;
    width: 270px;
    padding: 10px;
    line-height: 25px;
    box-shadow: 2px 2px 30px rgba(140,234,165,0.4);
    font-size: 15px;

}
.topposter{
    text-align: center;
}
.topposter img{
    display: inline-block;
    width: 290px;
    height: 440px;
    box-shadow: 2px 2px 30px rgba(140,234,165,0.4);
    margin-top: 10px;

}

.app-tabbar {
    position:relative;
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
    box-shadow: 0!important;
}
.app-tabbar .item {
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
    -webkit-box-pack:center;
    justify-content:center;
    -webkit-box-align:center;
    align-items:center;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    flex-direction:column;
    -webkit-box-flex:1;
    flex:1;
    font-size:14px;
    color:#666;
    padding: 10px 0;
}
.fix-box{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    z-index:5;
    background-color:#fff;

}

</style>