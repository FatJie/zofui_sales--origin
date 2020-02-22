<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新" >
                <img :src="params.arttopimg" style="width:100%;" v-if="params.arttopimg">

                <div class="tag mt10" v-if="sort.length > 0" style="margin-top:10px;">
                    <div @click="tabChange" class="tag-item" :class="page.pdata.sortid == 0?'color-pri':''"  data-id="0" >全部</div>
                    <div @click="tabChange" class="tag-item" :class="page.pdata.sortid == item.id?'color-pri':''"  :data-id="item.id" v-for="(item,index) in sort" :key="item.id">{{item.name}}</div>
                </div>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <template v-if="datalist.length>0">
                    <div class="big-wrapper" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index">
                        <img class="goods-img" v-lazy="item.thumb">
                        <div class="content">
                            <div class="shop-title clamp-2">{{item.title}}</div>
                            <div class="shop-introduction clamp-1" >{{item.desc}}</div>

                            <div class="dis-flex flex-between">
                                <img class="avatar" v-lazy="item.headimg">
                                <div class="user-name flex">{{item.shopname}}</div>
                                <div class="read-num-wrap dis-flex flex-middle flex-between">
                                    <div class="read-num">{{item.scan}}</div>
                                    <div class="read-label">阅读</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                </van-list>

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                    <div>— 暂时还没有数据 —</div>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'article',
                        op : 'list',
                        status : 0,
                        sortid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
	  			sharedata :{},
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.isbot = false;
                this.page.pdata.sortid = 0;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            tabChange(e){
                var self = this;

                this.isbot = false;
                this.datalist = [];
                this.page.pdata.sortid = e.currentTarget.dataset.id;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                self.onLoad(true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                
                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
                
				self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
                self.$util.pageList(this,this.page,function(res){
                    self.inited = 1;
                    if( !res.errno && res.data ){        
                        
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.datalist = res.data.list;
                        self.sort = res.data.sort;
                          
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
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

.big-wrapper {
    border: 0.5px solid #eee;
    border-radius: 10px;
    margin: 10px 15px 10px 15px;
    overflow: hidden;
}

.big-wrapper .goods-img {
    width: 100%;
    height: 194px;
    border-radius: 10px 10px 0 0;
}

.big-wrapper .content {
    padding: 14px 15px 15px;
}

.big-wrapper .shop-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
}

.big-wrapper .shop-introduction {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}

.big-wrapper .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
}

.big-wrapper .read-num-wrap .read-num,.big-wrapper .user-name {
    font-size: 12px;
    color: #666;
    line-height: 20px;
    height: 20px;
}

.big-wrapper .tag-group {
    margin-bottom: 15px;
}

.big-wrapper .read-num-wrap .read-num {
    font-weight: 500;
    color: #333;
    position: relative;
    font-family: "DINN";
    z-index: 10!important;
    top: 1px;
    letter-spacing: -1Px;
}

.big-wrapper .read-num-wrap .read-label {
    font-size: 10px;
    color: #666;
    margin-left: 5px;
    font-weight: 500;
}

.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    padding: 0 15px;
}

.tag>.tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 13px;
    margin-right: 12px;
    color: #585858;
    font-size: 13px;
    text-align: center;
}

.tag>.tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}
</style>