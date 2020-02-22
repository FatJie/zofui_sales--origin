<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="tabs">
                <div @click="tabChange" class="tab" :class="page.pdata.type == index ? 'color-pri border-pri thin-border_b':''" :data-type="index" v-for="(item,index) in tabs" >{{item.name}}</div>
            </div>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                <div class="content_hb_use" @click="link" :data-url="item.appurl" v-for="item in datalist">
                    <div class="content_hb_use_Countdown" style="background-image:url(https://img11.360buyimg.com/ddimg/jfs/t1/31792/33/11981/1600/5cb5e6edE68af2341/dfa4484b25ba50cf.png);" v-if="item.sstatus == 0">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/33809/3/3843/1739/5cb5e6d1E39a80ea6/2967e6722d01939f.png">
                        <div class="content_hb_use_Countdown_xiao">
                            还差<font>{{item.disnum <= 0 ? 0 : item.disnum}}</font>次签到
                        </div>
                    </div>
                    <div class="hb_top active">
                        <div class="hb_desc">
                            <font class="hb_desc_name">{{item.name}}</font>
                        </div>
                        <div class="hb_status">
                            <font class="hb_usebtn" v-if="item.sstatus == 0">签到</font>
                            <font class="hb_usebtn" v-else-if="item.sstatus == 1">已完成</font>
                            <font class="hb_usebtn" v-else-if="item.sstatus == 2">已失败</font>
                            <font class="hb_usebtn" v-else>立即签到</font>
                        </div>
                    </div>
                    <div class="hb_footer item_cell_box">
                        <div class="item_cell_flex shopname">{{item.shop.name}}</div>
                        <div>活动时间：{{item.starttime}}-{{item.endtime}}</div>
                    </div>
                </div>
               
            </template>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                <div>— 暂时没有数据 —</div>
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
	  			page : {
	  				pdata : {
	  					doo : 'signin',
	  					op : 'mylist',
	  					type : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                tabs : [{name:'进行中'},{name:'已完成'},{name:'已失败'}],
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) {
                this.$emit('loadmessage',true);
                return false;
            }
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
            tabChange(e){
                var self = this;
                if( e.currentTarget.dataset.type == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.type = e.currentTarget.dataset.type;
                self.onLoad();
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
    background: #bbbbbb url("https://img11.360buyimg.com/ddimg/jfs/t1/30367/13/12011/10493/5cb5e1c8Edd4e975e/fa537f351d9f015a.png") no-repeat 215px 15px;
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
}

.hb_price text {
    font-size: 24px;
}

.hb_desc {
    text-align: left;
    margin-right: 22.5px;
    flex: 1;
}

.hb_desc_name {
    font-size: 14px;
    display: block;
}

.hb_desc_text {
    font-size: 10px;
    display: block;
}

.hb_usebtn {
    width: 59px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #fff;
    display: block;
    border-radius: 15px;
    display: inline-block;
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
    border: 1px solid #ff5050;
    border-radius: 5px;
    width: 55px;
    height: 18px;
    line-height: 18px;
    text-align: center;
}

.tabs {
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

.tabs .tab {
    padding: 12.5px 0;
    font-size: 14px;
}
.shopname{
    text-align: left;
    font-size: 14px;
    font-weight: bold;
}

</style>