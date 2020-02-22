<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="mylist">
                <div class="tabs">
                    <div @click="tabchange" class="tab" :class="page.pdata.type == index ? 'color-pri border-pri thin-border_b':''" :data-status="index" v-for="(item,index) in tabs" >{{item.name}}</div>
                </div>

                <div class="tocard item_cell_box" @click="link" data-url="/cardlist">
                    <div class="tocard_l bg-pri">
                        <van-icon name="coupon-o" />
                    </div>
                    <div class="tocard_c item_cell_flex">
                        领券中心
                    </div>
                    <div class="tocard_r">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-show="datalist.length > 0">
                        <div class="all mylist-list" >
                            <div @click="link" class="coupon" :data-url="'/cardmyinfo?id='+item.myid" v-for="item in datalist" >
                                <div class="coupon_text">
                                    <div class="coupon_title coupon_name" v-if="item.hidefee == 1">{{item.name}}</div>
                                    <div class="coupon_title" v-else><font>¥</font> {{item.fee}}</div>
                                    <div class="coupon_rule">
                                        <font class="coupon_tagname" v-if="item.hidefee != 1">{{item.name}}</font>
                                    </div>
                                    <div class="coupon_rule">
                                        <font class="coupon_tagname coupon_taguse" >{{item.usetime}}</font>
                                    </div>
                                </div>
                                <div class="btn_div" :class="item.status==0?'get_btn':'has_get'" v-if="item.isend == 0">
                                    {{item.status == 0 ? '立即使用' : ''}} {{item.status == 1 ?'已使用':''}}
                                </div>
                                <div class="btn_div has_get " v-if="item.isend == 1"> 
                                    {{item.status == 0 ? '已过期' : ''}} {{item.status == 1 ?'已使用':''}} {{item.status == 3 ? '已过期':''}}
                                </div>
                            </div>
                        </div>
                    </template>
                </van-list>

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— '暂时还没有信息' —</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Icon } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Icon.name] : Icon,
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
                tabs : [{name:'全部卡券'},{name:'在线使用'},{name:'到店使用'}],
	  			page : {
	  				pdata : {
	  					doo : 'card',
	  					op : 'mylist',
	  					type : 0,
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
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
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
}

/**/
.coupon {
    width: 100%;
    height: 100px;
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
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 25px;
    color: #ff8585;
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

.tocard {
  margin: 10px;
  padding: 10px;
  align-items: center;
  box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.tocard_l{
    border-radius: 50%;
    width: 40px;
    height: 40px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
}
.tocard_c{
    font-size: 15px;
    padding-left: 15px;
}
.tocard_r{
    color: #999;
    font-size: 14px;
}

</style>