<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="search-wrap">
                <form action="get" @submit.prevent="confirm">
                    <div class="search-area" :style="{top:dev == 'app' ? '60px':0}">
                        <div class="input thin-border">
                            <font class="iconfont icon-search"></font>
                            <input focus bindconfirm="comfirm" v-model="page.pdata.key" confirmType="search" name="search" placeholder="请输入要搜索的内容" type="search"  ></input>
                            <img @click="close" v-if="page.pdata.key" class="icon-close" src="http://img11.360buyimg.com/ddimg/jfs/t1/62911/33/14620/898/5dbef51eE5dd9038a/4ead8adae087b789.png" >
                        </div>
                        <div class="btn" @click="toback" >取消</div>
                    </div>
                </form>
            </div>
            <div class="order-tags-wrap">
                <div class="order-tags">
                    <div @click="tabChange" class="item" data-type="goods" >
                        <font class="name" :class="'goods' == page.pdata.stype ? 'color-pri':''">{{params.goodbname}}</font>
                        <div class="botline" :class="'goods' == page.pdata.stype ? 'bg-pri':''"></div>
                    </div>
                    <div @click="tabChange" class="item" data-type="shop" >
                        <font class="name" :class="'shop' == page.pdata.stype ? 'color-pri':''">{{params.shopbname}}</font>
                        <div class="botline" :class="'shop' == page.pdata.stype ? 'bg-pri':''"></div>
                    </div>
                </div>
            </div>

            
            <template v-if="datalist.length > 0">
                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="main-list" v-if="page.pdata.stype == 'goods'">
                    <div  class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="top">
                            <div class="top_pic image-box" :class="params.othumb == 1 ? '__60' : '__100'">
                                <img mode="aspectFill" :src="params.othumb == 1 ? (item.thumbh ? item.thumbh : item.thumb) : item.thumb">
                            </div>
                            <div class="list-status" :class="{'__end':item.status==3,'__saled':item.status==1}" v-if="item.status"></div>
                        </div>
                        <div class="btm">
                            <div class="btm_tit">
                                {{item.title}}
                            </div>
                            <div class="btm-b">
                                <div class="btm-info">
                                    <div class="btm_price fmt-price">
                                        <div class="now color-pri">
                                            <font class="dollar" v-if="item.show_price > 0">¥</font>
                                            <font class="price">{{item.show_price > 0 ? item.show_price : '免费'}}</font>
                                        </div>
                                        <div class="old" v-if="item.oldprice*1 > 0">
                                            ¥{{item.oldprice}}
                                        </div>
                                    </div>
                                    <div class="btm_saled" >{{item.ncon}}：{{item.saled}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="shop_list">
                <div v-if="page.pdata.stype == 'shop'" class="thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                    <div class="item_cell_box shopitem">
                        <div class="shophead">
                            <img :src="item.headimg" >
                        </div>
                        <div class="shopname">{{item.name}}</div>
                    </div>
                </div>
                </div>
            </van-list>
            </template>
            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 没有找到数据 —</div>
            </div>
            
        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,Toast,List,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'aboutindex',
	  	components: {
            [Loading.name]: Loading,
            [List.name] : List,
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                info : {},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'sort',
                        op : 'search',
                        stype : 'goods',
                        key : '',
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                dev : '',
	  		}
	  	},
	  	created:function(e){
	  		//this.$emit('loadmessage',false);

            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            toback(){
                this.$router.go(-1);
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            searchinput(e){
                this.page.pdata.key = e.detail.value;
            },
            close(){
                this.page.pdata.key = '';
            },
            tabChange(e){
                
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.stype = e.currentTarget.dataset.type;
                
                this.onLoad(true);
            },
            confirm(e){
                var self = this;
                if( !self.page.pdata.key || self.page.pdata.key == '' ) return false;
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.onLoad(true);
            },
            bindtap(e,type){
                var self = this;
                if( type == 'copy' ){
                    this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                         self.$toast('已复制');
                    }, function (e) {
                        self.$toast('复制失败');
                    })
                }else if(type == 'callphone'){
                    window.location.href = 'tel://' + e.currentTarget.dataset.tel;
                }else if(type == 'toweburl'){
                    window.location.href = e.currentTarget.dataset.weburl;
                }else if(type == 'navigateto'){
                    window.location.href = e.currentTarget.dataset.url;
                }
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = self.$route.query;
                var postdata = {
                    op : 'info',
                    zfid : params.zfid ? params.zfid : 0,
                }

                if( params.from == 'shop' ){
                    self.page.pdata.stype = 'shop';
                }

	            self.$util.http('search','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
		                self.params = res.data.params;

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
	  		onLoad(loading) {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            },loading);
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/iconfont.css";
.his_box {
    font-size: 14px;
    padding: 20px;
    color: #9a9a9a;
}

.his_box .his-mid {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin-top: 13px;
}

.his_box .his-mid .item {
    font-size: 13px;
    padding: 0 9px;
    height: 23.5px;
    line-height: 25px;
    position: relative;
    margin: 0 10px 10px 0;
    border-radius: 4px;
    max-width: 70px;
    border: 1px solid #c2c2c2;
    overflow: hidden;
}

.search-wrap {
    height: 50px;
    margin-bottom: 5px;
}

.search-area {
    position: fixed;
    top: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    background: #ffffff;
    z-index: 10;
    border-bottom: 0.5px solid #eee;
}

.search-area .input {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    border-color: #ddd;
    line-height: 30px;
    border-radius: 30px;
}

.search-area .input input {
    position: relative;
    z-index: 1;
    -webkit-box-flex: 1;
    flex: 1;
    height: 100%;
    padding: 0 10px;
    font-size: 14px;
    line-height: inherit;
    border:0;
    background-color: rgba(0,0,0,0);
}

.search-area .input .icon-search {
    font-size: 16px;
}

.search-area .input .icon-close {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    opacity: 0.2;
}

.search-area .btn {
    height: 30px;
    padding: 0 15px;
    margin-right: -15px;
    font-size: 14px;
    line-height: 30px;
    background-color: transparent;
}

.order-tags-wrap {
    height: 38.5px;
    margin-bottom: 15px;
}

.order-tags {
    height: 38.5px;
    line-height: 38.5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    z-index: 5;
    background-color: #fff;
}

.order-tags .item {
    font-size: 14px;
    text-align: center;
    position: relative;
    width: 50%;
}

.order-tags .item .botline {
    position: absolute;
    height: 2px;
    width: 23px;
    left: 50%;
    margin-left: -11.5px;
    bottom: 0px;
}

.shop_list{
    padding: 15px;
}
.shopitem{
    align-items: center;
    border-radius: 2.5px;
    box-shadow: 0.5px 0.5px 5.5px rgba(0,0,0,0.2);
    margin-bottom: 15px;
    padding: 10px;
}
.shophead{

}
.shophead img{
    width: 65px;
    height: 65px;
    padding-right: 10px;
}
.shopname{
    font-size: 16px;
    font-weight: bold;
}

.main-list .btm_tit {
    font-size: 13px;
    line-height: 18px;
}

.main-list {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
}

.main-list .item {
    margin-bottom: 15px;
    width: 160px;
}

.main-list .item:nth-last-child(1):after,.main-list .item:nth-last-child(2):after {
    visibility: hidden;
}

.main-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px;
}

.main-list .item .btm {
    padding: 15px 0 10px;
}

.main-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.main-list .item .btm-info {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.main-list .btm_tit {
    height: 36px;
    margin-bottom: 10px;
    font-weight: 400;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #2a2a2a;
}

.main-list .btm_tit .tag {
    display: inline-block;
    vertical-align: top;
    padding: 0 7.5px;
    margin-right: 10px;
    font-size: 10px;
    text-align: center;
    line-height: inherit;
    color: #fff;
    border-radius: 1px;
}

.main-list .btm_price .old {
    display: none;
}

.main-list .btm_saled {
    margin-left: 10px;
    font-size: 12px;
    color: #b4b4b4;
}

</style>