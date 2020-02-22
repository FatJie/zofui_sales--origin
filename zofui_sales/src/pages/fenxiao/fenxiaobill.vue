<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
     	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="bill-top">
                <div class="price">
                ¥
                <font>{{userinfo.money > 0 ? userinfo.money : '0.00'}}</font>
                </div>
            </div>
            <div class="user-list wrap">
                <div class="item thin-border_b">
                    <div class="lt">
                        <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/57949/24/15068/1720/5dbeee83E4e358ef6/05fe45612a157ab5.png">
                        <div class="tit">待结算</div>
                    </div>
                    <div class="rt">{{userinfo.waitpay}}元</div>
                </div>
                <div @click="link" class="item thin-border_b ric"  data-url="/fenxiaoget_money">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/46407/5/15081/3243/5dbeee9bE5522d1b4/5ca97b4bb5ea39fa.png">
                    <div class="tit">提现</div>
                </div>
                <div @click="link" class="item thin-border_b ric"  data-url="/fenxiaocheckbill">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/51150/22/15189/1281/5dbeeeb9E16c1ff41/919f93c4dccf4e07.png">
                    <div class="tit">最近收支</div>
                </div>
                <!-- <navigator open-type="navigate" class="item thin-border_b"  url="/zofui_sales/fenxiao/aliaccount">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/96025/22/1454/1254/5dbeeed0E57960db9/92c4ea6592beb775.png">
                    <div class="tit">到账账户</div>
                </navigator> -->

            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePrediv } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaobill',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
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
            initData(){
                var self = this;
                var postdata = {
                    op : 'bill',
                    //zfid : zfid
                }
	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
                        self.dataInfo = res.data.datainfo;
						
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
.bill-top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: 150px;
    color: #fff;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/104510/19/1386/6483/5dbeeee8Ed8d03c0b/aa703c735d4f151a.png) 0 0 no-repeat;
    background-size: 100% 100%;
}

.bill-top .price {
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 1.4;
}

.bill-top .price font {
    font-size: 34px;
}

.bill-tit {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 2px 15px;
    font-size: 14px;
    line-height: 39px;
    color: #1e1e1e;
}

.hr {
    height: 10px;
    background-color: #f4f4f4;
}
.user-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 44px;
    font-size: 13px;
    line-height: 44px;
    color: #1e1e1e;
}

.user-list .item:last-child:after {
    visibility: hidden;
}

.user-list .item .lt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    align-items: center;
}

.user-list .item .icon {
    width: 20px;
    height: 20px;
    margin-right: 7.5px;
}

.user-list .item .tit {
    font-size: 14px;
}

.user-list .item .info {
    float: right;
    color: #969696;
}

.user-list .item .info.color {
    color: #f6854b;
}

.user-list .ric.item {
    position: relative;
    padding-right: 12px;
}

.user-list .ric.item:before {
    content: '\e60d';
    position: absolute;
    right: -2px;
    top: 0;
    font-size: 12px;
    font-family: 'iconfont';
    color: #acacac;
}

</style>