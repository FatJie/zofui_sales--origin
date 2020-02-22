<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="mylist">
                <div class="tabs">
                    <div @click="tabchange" class="tab" :class="page.pdata.type == index ? 'color-pri border-pri thin-border_b':''" :data-status="index" v-for="(item,index) in tabs" >{{item.name}}</div>
                </div>


                <div class="tag sortbox" v-if="sort.length > 0">
                    <div @click="changesort" class="tag-item" :class="page.pdata.sortid == 0?'color-pri':''"  data-id="0" >全部</div>
                    <div @click="changesort" class="tag-item" :class="page.pdata.sortid == item.id?'color-pri':''" :data-id="item.id" v-for="item in sort" :key="item.id">{{item.name}}</div>
                </div>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="all mylist-list" v-if="datalist.length>0">
                    <div @click="link" class="coupon" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="coupon_text">
                            <div class="coupon_title">
                                <template v-if="item.hidefee != 1">
                                    <font>¥</font> {{item.fee}}
                                </template>
                            </div>
                            <div class="coupon_rule" :style="{'margin-top':item.hidefee == 1 ? '-11px' : ''}">
                                <font class="coupon_tagname">{{item.name}}</font>
                            </div>
                            <div class="coupon_rule">
                                <font class="coupon_tagname coupon_taguse" >{{item.usestr}}</font>
                            </div>
                        </div>
                        <div class="btn_div" :class="item.istaked==0?'get_btn':'has_get'">
                            {{item.istaked == 0 ? '立即领取' : '已领取'}}
                        </div>
                        <div class="timedesc">
                            <font></font>        
                            <van-icon name="clock-o" />
                            {{item.usetime}}
                        </div>
                    </div>
                    
                </div>
                

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— 暂时还没有数据 —</div>
                </div>

                </van-list>

            </div>

            <img class="shareimg" @click="sharefn" src="http://img11.360buyimg.com/ddimg/jfs/t1/102100/30/3765/4166/5de20411Eb6b3ef48/19e1fe377eacdcab.png" />

            <img v-if="posterurl && showposter" :src="posterurl" class="poster_view">
            <van-popup class="showposter_popup" v-model="showposter" position="bottom" >
                <div class="showposter item_cell_box" >
                    <div  class="showposter_item" @click="wxshare(1)" >
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>转发给好友</div>
                    </div>
                    <div v-if="dev == 'app'" class="showposter_item" @click="wxshare(2)" >
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>转发到朋友圈</div>
                    </div>
                    <div class="showposter_item" @click="cposter" >
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/79397/19/948/5580/5cf23bdbE11da7e29/b145f3c1ba828eba.png">
                        <div>生成海报</div>
                    </div>
                </div>
            </van-popup>

        </div>
        <sharetip :isshowshare="isshowshare" @shareit="shareit" />
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Icon,Popup } from 'vant';
	import tabbar from '../../components/tabbar';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Icon.name] : Icon,
            [Popup.name] : Popup,
	    	tabbar,sharetip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                tabs : [{name:'全部卡券'},{name:'在线使用'},{name:'到店使用'}],
	  			page : {
	  				pdata : {
	  					doo : 'card',
	  					op : 'list',
	  					type : 0,
	  					page : 1,
                        zfid : 0,
                        sortid : 0,
                        isinit : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                sort : [],
                isshowshare : false,
                showposter : false,
                dev : '',
                posterurl : false,
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            sharefn(bool){
                this.showposter = true;
            },
            shareit(bool){
                this.isshowshare = bool;

            },
            wxshare(type){
                var self = this;
                if( self.dev != 'app' ){
                    self.isshowshare = !self.isshowshare;
                    this.showposter = false;
                    return false;
                }
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
            tabchange(e){
                var self = this;
                if( e.currentTarget.dataset.status == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.type = e.currentTarget.dataset.status;
                self.onLoad();
            },
            changesort(e){
                var self = this;
                if( e.currentTarget.dataset.id == self.page.pdata.sortid ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.sortid = e.currentTarget.dataset.id;
                self.onLoad();
            },
            useit(e){
                var self = this;

                var postdata = {cid:e.currentTarget.dataset.id,op:'getoid'};
                self.$util.http('cut','GET',postdata,function(res){    
                    if (!res.errno && res.data ) {
                        var tourl = '/orderinfo?id='+res.data.orderid;
                        self.$router.push(tourl);
                    }else{
                        self.$toast(res.message);
                    }
                })
            },
            cposter(){
                var self = this;
                var postdata = {
                    op:'card',
                    type : 'list',
                    path : self.sharedata.link,
                };
                if( self.posterurl ) return false;

                self.$util.http('poster','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        self.showposterurl = true;

                        if( self.dev == 'app' ){

                        }else if(self.dev == 'wx'){
                            //Dialog.alert({message:'可长按图片转发给好友'});
                        }else if(self.dev == 'wap'){
                            //Dialog.alert({message:'可截屏保存到手机'});
                        }

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();

                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
				
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
                        self.page.pdata.isinit = 0;
		                
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
#main{
    min-height: 100vh;
    background-color: #fff;
}

.mylist .tabs {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;
    padding: 0 15px;
    border-bottom: 0.5px solid #eee;
}

.mylist .tabs .tab {
    padding: 12.5px 0;
    font-size: 14px;
}

.mylist .mylist-item {
    padding: 10px 9px;
    margin-top: 10px;
    background-color: #fff;
}

.mylist-item .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-bottom: 12px;
}

.mylist-item .top .lt {
    margin-right: 7px;
}

.mylist-item .top .lt .img {
    width: 125px;
    height: 100px;
}

.mylist-item .top .lt .img img {
    display: block;
    width: 100%;
    height: 100%;
}

.mylist-item .top .rt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    font-size: 13px;
}

.mylist-item .top .rt .title {
    font-size: 16px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.mylist-item .mid {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    font-size: 14px;
}

.mylist-item .mid .info {
    margin: 10px 0;
    padding: 0 20px;
}

.mylist-item .mid .info:last-child {
    border-right-color: transparent;
}

.mylist-item .btm {
    font-size: 14px;
    margin-top: 10px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.mylist-item .btm .btn {
    width: 75px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
}

.mylist-list{
  padding: 10px;
  padding-top: 0;
}

/**/
.coupon {
    width: 100%;
    height: 110px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-right: 15px;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
    position: relative;
    padding-top: 15px;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 25px;
    height: 30px;
    line-height: 30px;
    color: #ff8585;
    padding-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width:240px;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    display: box;
    -webkit-box-orient: vertical;
}
.coupon_title font{
    font-size: 10px;
}
.coupon_name{
    font-size: 18px;
}
.coupon_rule {
    font-size: 14px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
    padding: 5px 0;

    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
}

.coupon_tagname {
    font-size: 15px;
    margin-right: 5px;
    color: #ff8585;
    font-weight: bold;
}
.coupon_taguse{
    font-weight: initial;
    font-size: 12px;
}

.get_hint {
    margin-top: 5px;
    color: #FF6A6A;
    font-size: 10px;
    text-align: center;
}

.btn_div {
    z-index: 50;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
    margin-top: 25px;
}

.get_btn {
    background-color: #ff5050;
}

.cant_get {
    background-color: #d2d2d2;
}

.has_get {
    border: 1px solid #ff5050;
    background-color: transparent;
    color: #ff5050!important;
}

.share_icon {
    width: 54.5px;
    height: 53px;
    position: fixed;
    right: 0;
    top: 325px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/share_icon_fansCard.png?v=1.0);
    background-size: 100% 100%;
    z-index: 55;
}

.timedesc{
    position: absolute;
    left: 0;
    top: 0;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    padding: 1px 5px;
}
.timedesc font{
    width: 0;
    height: 0;
    border-top: 18px solid black;
    border-right: 11px solid transparent;
    position: absolute;
    right: -10px;
    top: 0px;
}

.sortbox.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    padding: 10px;
}

.sortbox.tag>.tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 7.5px;
    margin-right: 7px;
    color: #585858;
    font-size: 13px;
    text-align: center;
}

.sortbox.tag>.tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}
.van-icon{
    line-height: 1!important;
}
.shareimg{
    position: fixed;
    z-index: 51;
    bottom:33.3%;
    right:10px;
    width:30px;
    height:30px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.5);
    padding: 10px;
}
.showposter {
    justify-content: center;
}
</style>