<template>
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <div class="collect-top-wrap" >
                <div @click="opena" class="collect-top thin-border_b" :style="{top:dev == 'app' ? '60px' : 0}">
                    <div class="txt">我的收藏</div>
                    <div class="icon iconfont"></div>
                </div>
            </div>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <div class="collect-list collect-listaa">
                <div @click="link" class="item thin-border_b" :data-url="item.appurl"  v-for="item in datalist" wx:key="key">
                    <div class="lt">
                        <div class="img image-box __100">
                            <img :src="item.thumb">
                        </div>
                    </div>
                    <div class="rt">
                        <div class="title">{{item.title}}</div>
                        <div class="msg">
                            <div class="price">
                                <div class="now color-pri">
                                    <text>¥</text>
                                    <text>{{item.showprice}}</text>
                                </div>
                                <div class="old" v-if="item.oldprice*1 > 0">¥{{item.oldprice}}</div>
                            </div>
                            <div class="btn color-pri thin-border border-pri" v-if="item.type == 3">参与活动</div>
                            <div class="btn color-pri thin-border border-pri" v-else>去抢购</div>
                        </div>
                    </div>
                </div>
            </div>
            </van-list>

            <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="https://img11.360buyimg.com/ddimg/jfs/t1/79412/23/2595/15072/5d0da041E5f3b3959/120d6d0dc230dfaa.png">
                <div>— 暂时还没有数据 —</div>
            </div>

            <div class="opacity" v-if="openit" :style="{top:dev == 'app' ? '105px' : '45px'}">
                <div class="content">
                    <div @click="choose(item.type,item.name)" class="item" :class="page.pdata.type === item.type?'color-pri':''" :data-type="item.type" :data-name="item.name" v-for="item in type" >
                        <div class="info">
                            <div class="txt">{{item.name}}</div>
                            <div class="icon iconfont" v-if="page.pdata.type === item.type"></div>
                        </div>
                    </div>
                </div>
                <div @click="opena" class="bg"></div>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
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
	  			cardinfo : {},
	  			opentype : false,
	  			sharedata :{},
	  			datalist : [],
                openit : false,
	  			page : {
	  				pdata : {
	  					doo : 'collect',
	  					op : 'list',
	  					type : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                dev : '',
                type:[{"num":0,"name":"全部收藏","type":0},{"num":1,"name":"商品收藏","type":1},{"num":0,"name":"活动收藏","type":2},{"num":0,"name":"拼团收藏","type":3}],
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		this.$emit('loadmessage',false);           
	  	},
	  	methods: {
            onRefresh(){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            choose(type,name){
                var self = this;
                if( type == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.type = type;
                self.onLoad();
            },
            opena() {
                this.openit = !this.openit;
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                }
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.type[1].name = self.params.goodbname+'收藏';

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
.collect-top-wrap {
    height: 45px;
}
.collect-top {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-size: 13px;
    color: #7e7e7e;
    background-color: #fff;
}

.collect-top .txt {
    line-height: 45px;
    margin-right: 10px;
}

.collect-top .icon {
    font-size: 10px;
}

.collect-listaa{
    padding: 15px;
}

.collect-list .item {
    padding: 15px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.collect-list .item .lt {
    margin-right: 10px;
}

.collect-list .item .lt .img {
    width: 89px;
}

.collect-list .item .rt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.collect-list .item .rt .title {
    font-size: 14px;
    color: #3e3e3e;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.collect-list .item .rt .msg {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    font-size: 12px;
}

.collect-list .item .rt .msg .price {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: baseline;
    align-items: baseline;
}

.collect-list .item .rt .msg .price .now text {
    font-size: 20px;
}

.collect-list .item .rt .msg .price .old {
    text-decoration: line-through;
    color: #787878;
    margin-left: 5px;
}

.collect-list .item .rt .msg .btn {
    padding: 2px 7px;
    border-radius: 6px;
}

.opacity {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    height: 100%;
}

.opacity .content {
    position: relative;
    top: 0;
    left: 0;
    background-color: #fff;
}

.opacity .content .item {
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 45px;
    font-size: 13px;
    color: #222;
}

.opacity .content .item .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
}

.opacity .content .item .info .txt {
    margin-right: 20px;
}

.opacity .bg {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
}
</style>