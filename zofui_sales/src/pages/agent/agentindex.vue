<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
                <div class="header bg-pri" >
                    <div class="up">
                        <div class="up__left">
                            <img bindlongpress="longpressAvatar" bindtap="tapAvatar" class="up__img" mode="aspectFill" :src="userinfo.headimg">
                            <div class="left-main">
                                <div class="top">
                                    <div class="lt">{{userinfo.nickname}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="up__right">
                            推荐码：<font class="">{{userinfo.agentcode}}</font>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="box nav-box">
                        <div class="item" @click="link" data-url="/agentshoplist">
                            <img class="img" mode="aspectFill" src="https://img11.360buyimg.com/ddimg/jfs/t1/74482/33/3183/1494/5d15dea8Ea5ab0f64/4e2da3ce19862567.png">
                            <font>我的商户</font>
                        </div>
                        <div class="item" @click="link" data-url="/agentinvite">
                            <img class="img" mode="aspectFill" src="https://img11.360buyimg.com/ddimg/jfs/t1/53724/26/3598/2159/5d15de9fE83fb3f27/9968e23ecb2c34a5.png">
                            <font>发展商户</font>
                        </div>
                        <div class="item" @click="link" data-url="/agentmlog" >
                            <img class="img" mode="aspectFill" src="https://img11.360buyimg.com/ddimg/jfs/t1/53724/26/3598/2159/5d15de9fE83fb3f27/9968e23ecb2c34a5.png">
                            <font>推广记录</font>
                        </div>
                        <div class="item" @click="link" data-url="/agentexplain">
                            <img class="img" mode="aspectFill" src="https://img11.360buyimg.com/ddimg/jfs/t1/34375/20/11924/2353/5d15dea4E933f1439/b359d2ae68fb3163.png">
                            <font>{{params.agentname}}说明</font>
                        </div>
                    </div>
                    <div class="box info">
                        <div class="item">
                            <div class="item__top">我的资产</div>
                            <div class="item__down item__downa">
                                <div class="ele">
                                    <div class="ele__up color-pri" >{{userinfo.totalagent}}</div>
                                    <div class="ele__down">总收益(元）</div>
                                </div>
                                <div class="ele">
                                    <div class="ele__up color-pri" >{{feedata.todayall > 0 ? feedata.todayall : 0}}</div>
                                    <div class="ele__down">今日收益(元)</div>
                                </div>
                                <div class="ele__seperate"></div>
                                <div class="ele" @click="link" data-url="/fenxiaoget_money">
                                    <div class="ele__icon">
                                        <font>点击提现</font>
                                    </div>
                                    <div class="ele__up color-pri" >{{userinfo.money}}</div>
                                    <div class="ele__down">可提现金额(元）</div>
                                </div>
                            </div>
                            <div class="item__down">
                                <div class="ele">
                                    <div class="ele__up color-pri" >{{feedata.waitpay > 0 ? feedata.waitpay : 0}}</div>
                                    <div class="ele__down">待结算(元）</div>
                                </div>
                                <div class="ele">
                                    <div class="ele__up color-pri" >{{feedata.todaya > 0 ? feedata.todaya : 0}}</div>
                                    <div class="ele__down">今日推广(元)</div>
                                </div>
                                <div class="ele__seperate"></div>
                                <div class="ele" >
                                    <div class="ele__up color-pri" >{{feedata.totalagent > 0 ? feedata.totalagent : 0}}</div>
                                    <div class="ele__down">总计推广(元）</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="box info" v-if="params.agentucardper > 0">
                        <div class="item boxin_item item_cell_box " v-if="userinfo.agentarea">
                            <div class="item_cell_flex">{{params.agentname}}区域:{{userinfo.agentarea}}</div>
                            <div class="zan-icon zan-icon-"></div>
                        </div>

                        <div class="item boxin_item item_cell_box " @click="link" data-url="/agentmlog?status=1&type=card">
                            <div class="item_cell_flex">会员卡提成记录</div>
                            <div class="zan-icon zan-icon-arrow"></div>
                        </div>
                    </div>


                </div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'agentindex',
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
                feedata : {},
                needback : false,
	  		}
	  	},
        activated:function(e){
        },
	  	created:function(e){
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
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'index',
                    zfid : query.zfid ? query.zfid : 0,
                }
                self.$util.http('agent','GET',postdata,function(res){ 
	                if( !res.errno && res.data ){
	                	self.needback = false;
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.feedata = res.data.feedata ? res.data.feedata : {};
                        self.userinfo = res.data.userinfo;
		                
	                	self.inited = 2;

                    }else if( res.errno == 3 ){
                        var isback = self.$util.cookie.get('needback');
                        if( isback ){
                            self.$util.cookie.del('needback');
                            self.$router.push('/user');
                        }else{
                            self.$toast({
                                message : res.message,
                                duration : 1000,
                                onClose : function(){
                                    self.$router.push('/agentjoin');
                                }
                            });
                            self.$util.cookie.set('needback',1,3600);
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
#main{
    min-height: 100vh;
    background-color: #fff;
}
.header {
    width: 100%;
    padding: 15px;
    padding-bottom: 40px;
    color: #fff;
    font-weight: 500;
    box-sizing: border-box;
    background-size: 100% 100%;
}

.header .up {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
}

.up__img {
    width: 37.5px;
    height: 37.5px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: inline-block;
}

.up__left {
    display: flex;
    align-items: center;
    justify-content: flex-center;
}

.left-main {
    margin-left: 7.5px;
}

.left-main .top {
    line-height: 18px;
    font-size: 18px;
    display: flex;
    justify-content: flex-start;
}

.left-main .top .lt {
    max-width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.left-main .top .rt {
    line-height: 11px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 11px;
    margin-left: 7.5px;
}

.left-main .top .rt .iconfont {
    font-size: 0.9em;
    margin-right: 3px;
}

.left-main .bt {
    height: 16px;
    font-size: 10px;
    padding: 0px 7.5px;
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 8px;
    background: rgba(255,255,255,0.26);
}

.left-main .bt .iconfont {
    font-size: 0.8em;
    margin-left: 4px;
}

.up__right {
    margin-left: 3px;
    font-size: 15px;
    padding-top: 5px;
    line-height: 37.5px;
}
.up__right text{
  font-weight: bold;
    font-size: 17.5px;
}


.up__right .iconfont {
    font-size: 19px;
    margin-bottom: 3px;
}

.up__right .rt {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-left: 10px;
}

.up__right .rt .img {
    width: 24.5px;
    height: 20px;
    margin-bottom: 2.5px;
}

.header .down {
    height: 27.5px;
    line-height: 27.5px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 5px;
    margin-top: 20px;
    border-radius: 13.5px;
    background-color: rgba(0,0,0,0.2);
}

.header .share-btm {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
}

.header .share-btm .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
    padding: 8px 10px;
    font-size: 12px;
}

.header .share-btm .icon {
    font-size: 12px;
    margin-left: 4px;
}

.header .down .btn {
    line-height: 19px;
    font-size: 10px;
    padding: 0 7.5px;
    border-radius: 10px;
    box-sizing: border-box;
}

.container {
    width: 100%;
    font-weight: 500;
    padding: 0 15px;
    box-sizing: border-box;
    margin-top: -40px;
}

.box {
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    border-radius: 10px;
    margin-top: 17.5px;
}

.box:first-child {
    margin-top: 20px;
}

.nav-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
}

.nav-box>.item {
    color: #9d9d9d;
    font-size: 12px;
    padding: 12.5px 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.nav-box>.item>.img {
    width: 25px;
    height: 25px;
    margin-bottom: 5px;
}

.info {
    padding: 0px 15px;
}

.info>.item {
    padding: 15px 0;
    border-bottom: 0.5px solid #f5f5f5;
    position: relative;
}

.item__tips {
    height: 17.5px;
    line-height: 11px;
    font-size: 11px;
    color: #fff;
    padding: 0 7.5px;
    background: #edb86a;
    position: absolute;
    top: 30px;
    right: -15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.item__tips>.img {
    width: 5px;
    height: 9px;
    margin-left: 5px;
}

.item__top {
    line-height: 16px;
    color: #222;
    font-size: 16px;
}

.item__bt {
    line-height: 14px;
    color: #ff6e7e;
    font-size: 14px;
    margin-top: 9px;
}

.item__down {
    width: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.item__down>.ele {
    padding-top: 22.5px;
    position: relative;
    width: 33.3%;
}

.ele__seperate {
    width: 0.5px;
    height: 37.5px;
    margin-top: 22.5px;
    background: #f5f5f5;
}

.ele__icon {
    font-size: 10px;
    color: #fff;
    border-radius: 3px;
    padding: 3px;
    background: #edb86a;
    position: absolute;
    top: -5px;
    left: 35px;
    z-index: 5;
}

.ele__icon font {
    position: relative;
    z-index: 1;
}

.ele__icon:after {
    content: '';
    border-left: 9px solid #edb86a;
    border-bottom: 9px solid transparent;
    border-top: 9px solid transparent;
    position: absolute;
    margin-bottom: -4.5px;
    bottom: 0;
    left: 0;
}

.ele__up {
    text-align: center;
    font-size: 18px;
    color: #ff6e7e;
}

.ele__down {
    text-align: center;
    font-size: 11px;
    color: #9d9d9d;
}

.flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.item__left {
    margin-left: 2.5px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.item__left>.img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.item__left>.view {
    margin-left: 2.5px;
}

.item__left>.view>.up {
    color: #222;
    font-size: 14px;
}

.item__left>.view>.down {
    color: #9d9d9d;
    font-size: 10px;
    margin-top: 5px;
}

.item__right {
    padding: 5px 7.5px;
    color: #edb86a;
    font-size: 12px;
    background: rgba(237,184,106,0.2);
    border-radius: 11.5px;
}

.shade {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.4);
    z-index: 99;
    padding: 105px 57.5px 0 57.5px;
    box-sizing: border-box;
}

.shade__box {
    background: #fff;
    border-radius: 9.5px;
    padding: 7.5px;
    position: relative;
}

.shade__box__img {
    width: 44px;
    height: 44px;
    display: block;
    position: absolute;
    top: -16px;
    left: 109px;
    border-radius: 50%;
}

.shade__box>.content {
    border: 1px solid rgba(209,186,157,1);
    border-radius: 5px;
    padding: 37.5px 17.5px 22.5px 17.5px;
    color: #222;
}

.content__hd {
    margin: 0 auto;
}

.content__hd__top {
    font-size: 18px;
    font-weight: bold;
    color: #d1ba9d;
    text-align: center;
}

.content__hd__middle {
    height: 0.5px;
    margin-top: 10px;
    background: #d1ba9d;
    position: relative;
}

.content__hd__middle::after {
    content: '';
    width: 16px;
    height: 3px;
    background: #fff;
    position: absolute;
    top: -1px;
    left: 97.5px;
}

.content__hd__middle::before {
    content: '';
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    background: #d1ba9d;
    position: absolute;
    top: -3px;
    left: 103px;
    z-index: 95;
}

.content__hd__bottom {
    font-size: 11px;
    text-align: center;
    margin-top: 9px;
}

.content__bd {
    margin-top: 42.5px;
}

.content__bd__tips {
    font-weight: bold;
    font-size: 13px;
}

.content__bd__main {
    line-height: 24px;
    margin-top: 20px;
    font-size: 12px;
}

.content__bd__main>view>text {
    color: #fc2626;
}

.content__btn {
    width: 197.5px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    color: #fff;
    background: #d1ba9d;
    border-radius: 3.5px;
    margin: 0 auto;
    margin-top: 40px;
}
.item__downa{
    margin-bottom: 10px;
}

.boxin_item{
    font-size: 12.5px;
}
.boxin_item .item_cell_flex{
    color: #666;
    font-size: 13px;
}

</style>