<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="container">
                <div class="box info">
                    <div class="item">
                        <div class="item__down item__downa">
                            <div class="ele">
                                <div class="ele__up color-pri" >{{userinfo.myget > 0 ? userinfo.myget : 0}}</div>
                                <div class="ele__down">获得分成(元）</div>
                            </div>
                            <div class="ele">
                                <div class="ele__up color-pri" >{{userinfo.todayget > 0 ? userinfo.todayget : 0}}</div>
                                <div class="ele__down">今日分成(元)</div>
                            </div>
                            <div class="ele__seperate"></div>
                            <div class="ele" @click="link" data-url="/fenxiaoget_money">
                                <div class="ele__icon">
                                    <font>点击提现</font>
                                </div>
                                <div class="ele__up color-pri" >{{userinfo.money > 0 ? userinfo.money : 0}}</div>
                                <div class="ele__down">可提现金额(元）</div>
                            </div>
                        </div>
                        <div class="item__down">
                            <div class="ele">
                                <div class="ele__up color-pri" >{{gongyi.lastm > 0 ? gongyi.lastm : 0}}</div>
                                <div class="ele__down">资金池(元）</div>
                            </div>
                            <div class="ele">
                                <div class="ele__up color-pri" >{{gongyi.payed > 0 ? gongyi.payed : 0}}</div>
                                <div class="ele__down">累计发放(元)</div>
                            </div>
                            <div class="ele__seperate"></div>
                            <div class="ele" >
                                <div class="ele__up color-pri" >{{gongyi.totalsale > 0 ? gongyi.totalsale : 0}}</div>
                                <div class="ele__down">累计销售(元）</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="full_box ">
                <div class="item_cell_box full_item" v-if="params.gwtcfs == 1">
                    <div class="full_no bg-pri">1</div>
                    <div class="item_cell_flex full_line">
                        <div class="full_tiao">开通会员</div>
                        <div class="full_d full_linein">
                            <div class="full_now full_linein bg-pri" :style="{width : userinfo.isbuycard == 1 ? 100 : 0 +'%'}"></div>
                        </div>
                    </div>
                    <div class="full_btn bg-pri" @click="link" data-url="/buycard">
                        {{userinfo.isbuycard == 0 ? '开通会员' : '已经完成'}}
                    </div>
                </div>

                <div class="item_cell_box full_item">
                    <div class="full_no bg-pri">{{params.gwtcfs == 1 ? '2' : '1'}}</div>
                    <div class="item_cell_flex full_line">
                        <div class="full_tiao">累计下单金额达到{{params.gwtcm}}元</div>
                        <div class="full_d full_linein">
                            <div class="full_now full_linein bg-pri"  :style="{width:userinfo.buyedper+'%'}"></div>
                        </div>
                    </div>
                    <div  class="full_btn bg-pri" @click="link" data-url="/">
                        {{userinfo.buyedper < 100 ? '立即购物' : '已经完成'}}
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="box info">
                    <div class="item boxin_item item_cell_box " @click="link" data-url="/fenchenrule">
                        <div class="item_cell_flex">分成规则</div>
                        <div class="van-icon van-icon-arrow van-cell__right-icon"></div>
                    </div>

                    <div class="item boxin_item item_cell_box " @click="link" data-url="/fenchenlog">
                        <div class="item_cell_flex">分成记录</div>
                        <div class="van-icon van-icon-arrow van-cell__right-icon"></div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'aboutindex',
	  	components: {
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
                gongyi : {},
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
                var params = this.$route.query;
                var postdata = {
                    op : 'index',
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('fenchen','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
                        self.gongyi = res.data.gongyi;
		                self.params = res.data.params;
						
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
.container {
    width: 100%;
    font-weight: 500;
    padding: 0 15px;
    box-sizing: border-box;
    margin-top: 10px;
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

.ele__icon text {
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

.full_box{
    margin:15px;

}
.full_item{
    padding: 5px 0;
    font-size: 13px;
    align-items: center;
}
.full_item:first-child{
    margin: 15px 0;
    margin-top: 30px;
}
.full_no{
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: #000;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    font-size: 17px;
    margin-top: -5px;
    box-shadow:  1px 1px 11px rgba(0,0,0,0.3);
}
.full_btn{
    background: #000;
    color: #fff;
    padding: 2.5px 7.5px;
    border-radius: 4px;
}
.full_line{
    padding: 10px;
    position: relative;
}
.full_tiao{
    position: absolute;
    top: -15px;
    left: 15px;
    color: #999;
}
.full_linein{
    width: 100%;
    height: 17px;
    border-radius: 17px;
    background: #ddd;
    float: left;
}
.full_now {
    width: 50%;
    background: #000;
}
.tips{
    font-size: 12.5px;
    padding-left: 30px;
}

.boxin_item{
    font-size: 12.5px;
}
.boxin_item .item_cell_flex{
    color: #666;
    font-size: 13px;
}
</style>