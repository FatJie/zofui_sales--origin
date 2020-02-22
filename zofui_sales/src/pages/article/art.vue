<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新">

            <div class="article-wrapper">
                <img class="bg-img" :src="article.thumb" />
                <div class="content-wrap">
                    <div class="content">
                        <div class="user-info dis-flex flex- middle">
                            <div class="avatar-wrap border-pri">
                                <img class="avatar" :src="article.headimg">
                            </div>
                            <div class="flex">
                                <div class="user-name">{{article.shopname}}</div>
                                <div class="tag">
                                    <van-rate readonly size="12" :value="article.shoprate"  />
                                </div>
                            </div>
                            <div class="share btn-wrap dis-flex flex-middle flex-center bg-pri" @click="shareit(true)">
                                <img class="icon-share" src="http://img11.360buyimg.com/ddimg/jfs/t1/84085/30/9062/5173/5d6e1d87E5e26aa89/073fa378e677e0c8.png" />
                                <div class="btn-text">分享</div>
                            </div>
                        </div>
                        <div class="article-title">{{article.title}}</div>
                        <div class="clamp-1 introdution" >{{article.desc}}</div>

                        <div @click="link" :data-url="article.goods.appurl" class="big-goods-wrapper"  v-if="article.goods">
                            <div class="img-wrapper">
                                <img class="img" :src="article.goods.thumb" />
                            </div>
                            <div class="goods-title clamp-2">{{article.goods.title}}</div>
                            <div class="price-info dis-flex flex-middle flex-between">
                                <div class="sales-or-btn dis-flex flex-middle">
                                    <div class="span" >已售 {{article.goods.saled}}</div>
                                    <div class="buy dis-flex flex-middle">
                                        <div class="buy lbg-pri">立即购买</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="detail-content" v-html="content"></div>

                        <div class="read-num-wrap dis-flex flex-right">
                            <div class="read-num">{{article.scan}}</div>
                            <div class="read-label">阅读</div>
                        </div>
                    </div>
                
                    
                    
                </div>
            </div>
            </van-pull-refresh>

            <div class="bar-bottom dis-flex flex-middle flex-between">
                <div class="bar-item vertical flex-middle" @click="link" data-url="/">
                    <img class="item-icon" src="https://file.open.banchengyun.com/2019/04/22/155592493689890.png">
                    <div class="item-text">首页</div>
                </div>
                <div class="bar-item vertical flex-middle share" @click="shareit(true)">
                    <img class="item-icon" src="https://file.open.banchengyun.com/2019/04/15/155530849243369.png">
                    <div class="item-text">分享</div>
                </div>
                
                <div class="btn-wrap"  v-if="article.type == 0" @click="link" :data-url="article.toappurl">
                    <div class="dis-flex flex-center buy-btn bg-pri">
                        <div class="num-style price" v-if="article.goods">￥{{article.goods.show_price}}</div>
                        <div class="btn-text">购买</div>
                    </div>
                </div>
                <div class="btn-wrap"  v-else @click="bindtap($event,article.type == 1 ? 'url' : 'weburl')" :data-url="article.toappurl" :data-weburl="article.url">
                    <div class="dis-flex flex-center buy-btn bg-pri">
                        <div class="btn-text">去看看</div>
                    </div>
                </div>
            </div>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Rate } from 'vant';
	import tabbar from '../../components/tabbar';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'art',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Rate.name] : Rate,
	    	tabbar,sharetip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                article : {},
                content : '',
                isshowshare : false,
	  		}
	  	},
        activated:function(e){

            
        },
	  	created:function(e){
            this.initData();
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            initData(){

                var meta = document.getElementsByTagName("meta");
                meta[6]["content"] = "no-referrer";

                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('article','GET',postdata,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.article = res.data.article;
	                   	self.params = res.data.params;
                        self.sharedata = res.data.sharedata;
                        self.content = res.data.content;
		                
                        window.document.title = self.article.title;
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
#main {
    min-height: 100vh;
}

.dis-flex,.vertical {
    display: flex;
    flex-direction: row;
}

.vertical {
    flex-direction: column;
}

.flex {
    flex: 1;
}

.flex-top {
    align-items: flex-start;
}

.flex-middle {
    align-items: center;
}

.flex-bottom {
    align-items: flex-end;
}

.flex-center {
    justify-content: center;
}

.flex-left {
    justify-content: flex-start;
}

.flex-right {
    justify-content: flex-end;
}

.flex-around {
    justify-content: space-around;
}

.flex-between {
    justify-content: space-between;
}

.flex-wrap {
    flex-wrap: wrap;
}

.clamp-1,.clamp-2,.clamp-3 {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.5;
}

.clamp-2,.clamp-3 {
    -webkit-line-clamp: 2;
}

.clamp-3 {
    -webkit-line-clamp: 3;
}

.bor-bom,.bor-left,.bor-right,.bor-top,.hover {
    position: relative;
}

.bor-bom::after,.bor-top::before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    height: 1PX;
    color: #eee;
    transform: scaleY(.5);
}

.bor-top::before {
    top: 0;
    border-top: 1PX solid #eee;
    transform-origin: 0 0;
}

.bor-bom::after {
    bottom: 0;
    border-bottom: 1PX solid #eee;
    transform-origin: 0 100%;
}

.bor-left::before,.bor-right::after {
    content: " ";
    position: absolute;
    right: 0;
    width: 1PX;
    height: 100%;
    color: #eee;
    transform: scaleX(.5);
}

.bor-left::before {
    left: 0;
    top: 0;
    border-left: 1PX solid #eee;
    transform-origin: 0 0;
}

.bor-right::after {
    bottom: 0;
    border-right: 1PX solid #eee;
    transform-origin: 0 100%;
}

button::after {
    display: none;
}

.hover {
    overflow: hidden;
}

.hover::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.1);
}

.icon-arrow {
    width: 10px;
    height: 10px;
    border-top: 0.5px solid #9496ab;
    border-right: 0.5px solid #9496ab;
    transform: rotate(45deg);
}

.icon-arrow-right {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #a6a6a6;
    border-right: 1.2.5px solid #a6a6a6;
    transform: rotate(45deg) translateY(-0.5px);
}

.icon-arrow-bottom {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #c7a15c;
    border-right: 1.2.5px solid #c7a15c;
    transform: rotate(135deg);
}

.icon-arrow-right-golden {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #d1b483;
    border-right: 1.2.5px solid #d1b483;
    transform: rotate(45deg) translateY(-0.5px);
}

.Bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
    background-color: rgba(0,0,0,.7);
}

.swiper-page {
    transform: translateY(3.5px);
}

.swiper-page .now-page {
    font-size: 21px;
    font-weight: 700;
}

.swiper-page .all-page {
    transform: translateY(3.5px);
    margin-left: 1.5px;
}

.weui-loading {
    width: 17.5px;
    height: 17.5px;
    display: inline-block;
    vertical-align: middle;
    animation: e 1s steps(12) infinite;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
    margin-right: .1rem;
}

.position-info {
    width: 100%;
    margin-top: 12px;
    margin-bottom: -8px;
}

.position-info .left .circle {
    width: 4px;
    height: 4px;
    background-color: #fd0;
    border-radius: 50%;
}

.position-info .left .span {
    font-size: 12px;
    color: #999;
    margin-left: 7.5px;
}

.position-info .distance,.swiper-page .all-page {
    font-size: 12px;
    color: #999;
}

.sale-tag {
    padding: 1.5px 5px;
    background-color: #f64031;
    font-size: 11px;
    color: #fff;
    border-radius: 2.5px;
    font-family: 'not specified';
}

.bottom-after-height::after {
    content: " ";
    position: relative;
    bottom: 0;
    z-index: 1;
    background-color: transparent;
    width: 100%;
    height: 150px;
}

text,view {
    line-height: inherit;
}

.num-style {
    font-family: "DINN";
}

.article-wrapper {
    background-color: #fff;
}

.article-wrapper .bg-img {
    width: 375px;
    height: 211px;
}

.article-wrapper .content-wrap {
    padding: 0 15px 10px;
    position: relative;
    top: -50px;
}

.article-wrapper .content-wrap .content {
    background: #fff;
    box-shadow: 0 1.5px 7.5px 0 rgba(51,51,51,.12);
    border-radius: 20px 20px 0 0;
    padding: 15px;
    box-sizing: border-box;
}

.article-wrapper .content-wrap .content .user-info .avatar-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 7px;
}

.article-wrapper .content-wrap .content .user-info .avatar-wrap .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.article-wrapper .content-wrap .content .user-info .user-name {
    font-weight: bold;
    font-size: 13px;
    height: 13px;
    line-height: 13px;
    position: relative;
    top: 6px;
}

.article-wrapper .content-wrap .content .user-info .tag-wrap {
    padding: 0;
    margin: 0;
}

.article-wrapper .content-wrap .content .user-info .tag {
    display: inline-block;
    height: 15px;
    line-height: 15px;
    padding: 7.5px 0;
    font-size: 9px;
    color: #333;
    position: relative;
    top: -5px;
}

.article-wrapper .content-wrap .content .user-info .btn-wrap {
    height: 28px;
    line-height: 28px;
    color: #fff;
    border-radius: 14px;
    padding: 0 15px;
    box-sizing: border-box;
}

.article-wrapper .content-wrap .content .user-info .btn-wrap .icon-share {
    width: 14px;
    height: 14px;
    margin-right: 5px;
}

.article-wrapper .content-wrap .content .user-info .btn-wrap .btn-text {
    font-size: 11px;
    color: #fff;
    font-weight: 500;
}

.article-wrapper .content-wrap .content .article-title {
    font-size: 20px;
    font-weight: 600;
    margin: 15px 0 6px;
    color: #333;
}

.article-wrapper .content-wrap .content .introdution {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}

.article-wrapper .content-wrap .content .content-text {
    position: relative;
    z-index: 1;
}

.article-wrapper .content-wrap .content .read-num-wrap {
    margin-top: 20px;
    margin-bottom: 5px;
    align-items: center;
}

.article-wrapper .content-wrap .content .read-num-wrap .read-num {
    font-weight: 500;
    font-size: 12px;
    color: #333;
    position: relative;
    font-family: "DINN";
    z-index: 10!important;
    height: 20px;
    line-height: 20px;
    top: -1px;
    letter-spacing: -1Px;
}

.article-wrapper .content-wrap .content .read-num-wrap .read-label {
    font-size: 10px;
    color: #666;
    margin-left: 5px;
}

.article-wrapper .content-wrap .content .big-goods-wrapper {
    margin: 30px 0;
}

.article-wrapper .content-wrap .content .big-goods-wrapper .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
    box-sizing: border-box;
    border: 1px solid #f8f8f8;
}

.article-wrapper .content-wrap .content .big-goods-wrapper .shop-name {
    font-size: 12px;
    color: #666;
    line-height: 20px;
    height: 20px;
}

.article-wrapper .content-wrap .content .big-goods-wrapper .big-goods {
    background: #fff;
    border: 0.5px solid #eee;
    border-radius: 10px;
    margin: 10px 0 30px;
    padding: 15px;
}

.article-wrapper .content-wrap .recommand {
    margin-top: 30px;
}

.article-wrapper .content-wrap .recommand .recommand-title {
    color: #333;
    font-size: 15px;
    margin-bottom: 15px;
    font-weight: 500;
}

.article-wrapper .content-wrap .recommand .recommand-item {
    margin-bottom: 25px;
}

.bar-bottom {
    width: 100vw;
    height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99999999999;
    background-color: #fff;
    border-top: 0.5px solid #eee;
}

.bar-bottom .bar-item {
    padding: 0 10px;
}

.bar-bottom .bar-item .item-icon {
    width: 17px;
    height: 17px;
    margin-bottom: 5px;
}

.bar-bottom .bar-item .item-text {
    font-size: 9px;
    color: #333;
    font-weight: 500;
    height: 9px;
    line-height: 9px;
}

.bar-bottom .btn-wrap {
    width: 180px;
    color: #333;
}

.bar-bottom .btn-wrap .btn-text {
    font-size: 13px;
    margin-left: 5px;
    font-weight: 500;
    height: 34px;
    line-height: 34px;
}

.bar-bottom .btn-wrap .price {
    font-size: 15px;
    font-weight: 500;
    height: 34px;
    line-height: 34px;
    position: relative;
    top: 1px;
}

.article-wrapper .modal-recommand-wrapper {
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: rgba(0,0,0,.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    opacity: 0;
    transition: .2s all;
    overflow: hidden;
}

.article-wrapper .modal-recommand-wrapper.fade {
    opacity: 1;
}

.article-wrapper .modal-recommand-wrapper .modal-recommand {
    border-radius: 10px 10px 0 0;
    background-color: #fff;
    padding: 30px 0 20px 15px;
    transform: translateY(200%);
    transition: .2s all;
}

.article-wrapper .modal-recommand-wrapper .modal-recommand.show {
    transform: translateY(0);
}

.article-wrapper .modal-recommand-wrapper .modal-recommand .recommand-scroll {
    white-space: nowrap;
}

.article-wrapper .modal-recommand-wrapper .modal-recommand .recommand-scroll .dedault-goods {
    display: inline-block;
    margin-right: 10px;
}

.article-wrapper .modal-recommand-wrapper .modal-recommand .recommand-scroll .dedault-goods:last-child {
    margin-right: 15px;
}

.article-wrapper .modal-recommand-wrapper .modal-recommand .recommand-scroll .dedault-goods .goods-img {
    width: 161px;
    height: 110px;
    border-radius: 5px 5px 0 0;
}

.share {
    position: relative;
}

.share .share-btn {
    position: absolute;
    width: 100%;
    height: 100%;
}

.buy-btn{
    align-items: center;
    border-radius: 45px;
}

/**/
.big-goods-wrapper {
    width: 100%;
}

.big-goods-wrapper .img-wrapper {
    position: relative;
    width: 100%;
    border-radius: 5px;
    background-color: #eee;
    overflow: hidden;
}

.big-goods-wrapper .img-wrapper .img {
    width: 100%;
    height: 194px;
}


.big-goods-wrapper .position-info .left .span {
    font-size: 12px;
    color: #999;
    margin-left: 7.5px;
}

.big-goods-wrapper .goods-title {
    white-space: normal;
    font-size: 15px;
    color: #333;
    margin-top: 12px;
    font-weight: 500;
    line-height: 20px;
}

.big-goods-wrapper .price-info {
    width: 100%;
    margin-top: 12px;
    transform: translateX(-1px);
}


.big-goods-wrapper .price-info .sales-or-btn .span {
    font-size: 10px;
    color: #999;
    flex: 1;
}

.big-goods-wrapper .price-info .sales-or-btn .buy {
    margin-left: 10px;
    border-radius: 25px;
    padding: 3px 12.5px;
    font-size: 13px;
}
.sales-or-btn{
    width:100%;
}
.detail-content{
    font-size: 14px;
}
</style>