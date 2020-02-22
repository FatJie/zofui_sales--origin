<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="rank-top">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97740/18/1285/23545/5dbef000E0e57bbe7/7499c68232741864.jpg">
            </div>
            <div class="rank-info">
                <div class="avatar">
                    <img :src="userinfo.headimg">
                </div>
                <div class="info">
                    <div class="name">{{userinfo.nickname}}</div>
                </div>
                <div class="rank">
                    <div v-if="myrank.rank > 0">
                        <text class="num">{{myrank.rank}}</text> 名
                    </div>
                    <div wx:else>暂无排名</div>
                </div>
            </div>
            <div class="rank-layout">
                <div class="rank-tit">
                    <div class="tit">排行榜</div>
                    <div>前50名排行榜</div>
                </div>
                <div class="rank-tabs thin-border" id="tabs">
                    <div @click="click" class="item thin-border_l" data-type="0" :class="type==0?'active':''">总榜</div>
                    <div @click="click" class="item thin-border_l " :class="type==1?'active':''" data-type="1">日榜</div>
                    <div @click="click" class="item thin-border_l" :class="type==2?'active':''" data-type="2">周榜</div>
                    <div @click="click" class="item thin-border_l" :class="type==3?'active':''" data-type="3">月榜</div>
                </div>
            </div>
            <div class="rank-lists" v-if="rank.length>0">
                <div class="item thin-border_t" v-for="(item,index) in rank" wx:key="key">
                    <div class="num">{{index+1}}.</div>
                    <img class="avatar" :src="item.headimg">
                    <div class="name">{{item.nickname}}</div>
                    <div class="price">{{item.totalmoney}}元</div>
                </div>
            </div>
            <div class="list-none" v-else>
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/93221/16/1388/16880/5dbeee50E0b5adbdb/6e0e5ca28baaba06.png">
                <div>~ 暂时没人 ~</div>
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePrediv } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaorank',
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
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                dataInfo : {},
                reload : false,
                type : 0,
                myrank : 0,
                rank : [],
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
        activated:function(e){
            if( this.reload ){
                this.initData();
                this.reload = false;
            }
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            click(e){
                var self = this;
                var type = e.currentTarget.dataset.type;
                self.type = type;
                self.$util.http('fenxiao','GET',{op:'rank',type:type},function(res){     
                    if (!res.errno && res.data) {
                        self.rank = res.data.rank;
                        self.myrank = res.data.myrank;
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'rank',
                    type : 0,
                    //zfid : zfid1
                }
	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
                        self.rank = res.data.rank;
                        self.myrank = res.data.myrank;
						
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

.rank-top img {
    width: 100%;
    height: auto;
}

.rank-info {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 20px 25px 20px 15px;
    margin: -30px 15px 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.2);
}

.rank-info .avatar {
    overflow: hidden;
    width: 43px;
    height: 43px;
}

.rank-info .avatar img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.rank-info .info {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 0 15px;
    font-size: 13px;
    line-height: 20px;
    color: #2a2a2a;
}

.rank-info .info .name {
    font-size: 16px;
    font-weight: 500;
}

.rank-info .rank {
    font-size: 13px;
}

.rank-info .rank .num {
    font-size: 24px;
    color: #969ffe;
}

.rank-layout {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: end;
    align-items: flex-end;
    padding: 0 15px;
    margin-bottom: 25px;
}

.rank-tit {
    font-size: 14px;
    line-height: 1;
    color: #2a2a2a;
}

.rank-tit .tit {
    margin-bottom: 12px;
    font-size: 18px;
}

.rank-tabs {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-color: #969ffe;
    border-radius: 4px;
}

.rank-tabs:after {
    border-radius: 8px;
}

.rank-tabs .item {
    position: relative;
    z-index: 1;
    height: 30px;
    padding: 0 10px;
    border-color: #969ffe;
    margin-left: -0.5px;
    font-size: 13px;
    line-height: 31px;
    color: #969ffe;
}

.rank-tabs .item.active {
    color: #fff;
    background-color: #969ffe;
}

.rank-tabs .item:first-child:after {
    visibility: hidden;
}

.rank-lists {
    padding: 0 15px;
}

.rank-lists .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 15px 0;
    line-height: 1.5;
}

.rank-lists .item:nth-child(1) .num,.rank-lists .item:nth-child(2) .num,.rank-lists .item:nth-child(3) .num {
    font-size: 0;
    text-indent: -9499.5px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
}

.rank-lists .item:nth-child(1) .num {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/87033/16/1430/4684/5dbef046E3822f0c7/1055ad104d4f5645.png);
}

.rank-lists .item:nth-child(2) .num {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/80933/15/14516/4934/5dbef04aEf9682278/01107b6ea7983e56.png);
}

.rank-lists .item:nth-child(3) .num {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/52347/8/15285/5106/5dbef04fE710eceed/724e9a2a1c42dcb5.png);
}

.rank-lists .num {
    width: 20px;
    height: 20px;
    margin-left: 6px;
    text-align: center;
    font-size: 12px;
}

.rank-lists .avatar {
    width: 28px;
    height: 28px;
    margin-left: 15px;
    border-radius: 50%;
}

.rank-lists .name {
    -webkit-box-flex: 1;
    flex: 1;
    height: 1.5em;
    padding: 0 10px;
    font-size: 14px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    color: #2a2a2a;
}

.rank-lists .price {
    font-size: 15px;
    color: #979bff;
}

</style>