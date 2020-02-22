<template>
	
    <div :class="params.style" id="main">
     	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="mylist">
                <div class="tabs">
                    <div @click="tabchange" class="tab" :class="page.pdata.status == index ? 'color-pri border-pri thin-border_b':''" :data-status="index" v-for="(item,index) in tabs" >{{item.name}}</div>
                </div>

                <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新">

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="all mylist-list" v-if="datalist.length > 0">
                    <div class="item mylist-item" v-for="item in datalist" >
                        <div @click="link" :data-url="item.appurl" >
                            <div class="top">
                                <div class="lt">
                                    <div class="img">
                                        <img :src="item.thumb">
                                    </div>
                                </div>
                                <div class="rt">
                                    <div class="title">{{item.title}}</div>
                                    <div class="time">结束时间：{{item.endtime}}</div>
                                </div>
                            </div>
                            <div class="mid thin-border_t thin-border_b">
                                <div class="info thin-border_r">
                                    <div class="price color-pri">{{item.price}}</div>
                                    <div class="name">原价</div>
                                </div>
                                <div class="info thin-border_r">
                                    <div class="price color-pri">{{item.nowprice}}</div>
                                    <div class="name">当前价</div>
                                </div>
                                <div class="info thin-border_r">
                                    <div class="price color-pri">{{item.botprice}}</div>
                                    <div class="name">底价</div>
                                </div>
                                <div class="info">
                                    <div class="price color-pri">{{item.helptime}}</div>
                                    <div class="name">人减价</div>
                                </div>
                            </div>
                        </div>
                        <div class="btm">
                            <div>
                                参与状态：
                                <font class="state color-pri">{{item.statusstr}}</font>
                            </div>
                            <div class="btn bg-pri" @click="useit" :data-id="item.id" v-if="item.ispay == 1">去使用</div>
                            <div class="btn bg-pri" @click="payit" :data-id="item.id" v-if="item.ispay==0 && item.status == 1">去付款</div>
                        </div>
                    </div>
                </div>
                </van-list>

                <div class="list-none"  v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— '暂时还没有信息' —</div>
                </div>

                </van-pull-refresh>

            </div>

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
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			tabs : [{name:'全部'},{name:'减价中'},{name:'已完成'},{name:'已失败'}],
	  			page : {
	  				pdata : {
	  					doo : 'cut',
	  					op : 'mylist',
	  					status : 0,
	  					page : 1,
                        zfid : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},

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
	  		this.$emit('loadmessage',false);
	  	},
	  	methods: {
            onRefresh(){
                this.page.isend = false;
                this.page.pdata.page = 1;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            tabchange(e){
                var self = this;
                if( e.currentTarget.dataset.status == self.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.status = e.currentTarget.dataset.status;
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
            payit(e){
                // 4 砍价订单
                sessionStorage.setItem('zfssbuy',JSON.stringify({'cid':e.currentTarget.dataset.id,type:4}));
                var tourl = '/confirm';
                this.$router.push(tourl);
            },
            initData(){
                var self = this;
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
    background-color: #f2f2f2;
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
</style>