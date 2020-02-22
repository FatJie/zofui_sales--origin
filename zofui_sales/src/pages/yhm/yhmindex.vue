<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新"> 

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                    <template v-if="datalist.length > 0">

                        <div class="content_hb_use"  :data-url="item.url" v-for="(item,index) in datalist" :key="index">
                            <div class="content_hb_use_Countdown" @click="copy" :data-copy="item.code" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/orinfor_Countdown.png);" >
                                <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/orinfor_Countdown_time.png">
                                <div class="content_hb_use_Countdown_xiao">
                                    <font>{{item.endtime}}</font>到期
                                </div>
                            </div>
                            <div class="hb_top " :class="item.sstatus == 0 ? 'active' : ''">
                                <div class="hb_price " @click="copy" :data-copy="item.code">
                                    <font>{{item.code}}</font>
                                </div>
                                <div class="hb_desc" @click="copy" :data-copy="item.code">
                                    <font class="hb_desc_name">优惠{{item.fee}}元</font>
                                    <font class="hb_desc_text" v-if="item.sstatus == 0">可使用{{item.lasttimes}}次,点击复制</font>
                                </div>
                                <div class="hb_status">
                                    <font class="hb_usebtn" v-if="item.sstatus == 1">已过期</font>
                                    <font class="hb_usebtn" v-else-if="item.sstatus == 2">已使用</font>
                                    <font class="hb_usebtn" v-else @click="link" :data-url="item.appurl">去使用</font>
                                </div>
                            </div>
                        </div>
                       
                    </template>
                    
                    <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                        <img class="info_img" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                        <div>— 暂时还没有数据 —</div>
                    </div>

                </van-list>
                
        </van-pull-refresh>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Icon } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'yhmindex',
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
	  			page : {
	  				pdata : {
	  					doo : 'yhm',
	  					op : 'mylist',
	  					type : 0,
	  					page : 1,
                        sortid : 0,
                        isinit : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                sort : [],
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
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            copy(e){
                var self = this;
                this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                     self.$toast('已复制');
                }, function (e) {
                    self.$toast('复制失败');
                })
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
                        self.page.pdata.isinit = 0;
		                
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
    position: relative;
}

.content_hb_use_Countdown {
    position: absolute;
    height: 24px;
    padding-left: 10px;
    padding-right: 18px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    display: flex;
    align-items: center;
}
.content_hb_use_Countdown img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
}

.content_hb_use_Countdown_xiao {
    color: #fff;
    font-size: 10px;
    line-height: 10px;
}

.content_hb_use_Countdown_xiao font {
    color: #ffd93f;
    margin: 0 1px;
    font-size: 12px;
}

.content_hb_use {
    margin: 9px 15px 17.5px;
    border-radius: 5px;
    box-shadow: 0 0px 10px rgba(144,144,144,0.3);
}

.hb_top {
    height: 80px;
    background: #bbbbbb url("https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/list_hbbg.png") no-repeat 215px 15px;
    background-size: 73px 75px;
    display: flex;
    color: #fff;
    align-items: center;
    padding: 0 15px;
    font-size: 12px;
}

.hb_top2 {
    height: 72.5px;
}

.hb_price {
    margin-right: 15px;
    text-align: left;
}

.hb_price font {
    font-size: 18px;
}

.hb_desc {
    text-align: left;
    margin-right: 22.5px;
    width: 165px;
}

.hb_desc_name {
    font-size: 14px;
    display: block;
    padding-top: 5px;
}

.hb_desc_text {
    font-size: 10px;
    display: block;
    padding-top: 5px;
}

.hb_usebtn {
    width: 59px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #fff;
    display: block;
    border-radius: 15px;
    text-align: center;
}

.hb_top.active {
    background-color: #ff7070;
}

.hb_footer {
    height: 25px;
    background-color: #fff;
    color: #888888;
    font-size: 10px;
    text-align: right;
    padding: 0 15px;
    line-height: 25px;
}

.change_redpacket {
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    color: #353535;
    font-size: 12px;
    margin: 15px 0 25px;
    align-items: center;
}

.changeText {
    background: url("https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/icon_notice.png") no-repeat left center;
    background-size: 15px 12.5px;
    padding-left: 25px;
}

.changeBtn {
    color: #ff5050;
    border: 0.5px solid #ff5050;
    border-radius: 5px;
    width: 55px;
    height: 18px;
    line-height: 18px;
    text-align: center;
}


</style>