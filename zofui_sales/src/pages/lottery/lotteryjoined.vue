<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template wx:if="datalist.length">
                <div class="contbox" v-for="item in datalist">
                    <div class="contbox_l">
                        <div class="contbox_l_ava" :style="{'background-image':' url('+item.headimg+')'}"></div>
                        <div class="contbox_l_info">
                            <font class="contbox_l_name">{{item.nickname}}</font>
                            <font class="contbox_l_time">{{item.createtime}}</font>
                        </div>
                    </div>
                    <div class="contbox_r">
                        <font class="contbox_r_ma">{{item.code}}</font>
                    </div>
                </div>
            </template>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 暂时还没有数据 —</div>
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
	  					doo : 'lottery',
	  					op : 'joined',
	  					status : 0,
	  					page : 1,
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
            initData(){
                var self = this;
                var params = this.$route.query;
                self.page.pdata.gid = params.gid ? params.gid : 0,
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
    border-top: 1px solid #f1f1f1;
}

.contbox {
    padding: 18.5px 15px 21.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #f1f1f1;
}

.contbox_l {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.contbox_l_ava {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #f1f1f1;
    margin-right: 11.5px;
    border: 1px solid #eee;
}

.contbox_l_info {
    width: 150px;
}

.contbox_l_name {
    font-size: 14px;
    line-height: 14px;
    color: #2f2f2f;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 13.5px;
    display: block;
    text-align: left;
}

.contbox_l_time {
    font-size: 12px;
    line-height: 12px;
    color: #888888;
    text-align: left;
    display: block;
}

.contbox_r_ma {
    color: #ff5050;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 11px;
    display: block;
    text-align: right;
}

.contbox_r_more {
    font-size: 12px;
    line-height: 12px;
    display: block;
    text-align: right;
    color: #353535;
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 9000;
    color: #fff;
}

.showbox {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9000;
    padding-top: 124.5px;
}

.showbox_da {
    width: 200px;
    height: 266px;
    border-radius: 10px;
    margin: 0 auto 30px;
    padding: 23.5px 30px 18.5px;
    background-color: #fff;
}

.showbox_tit {
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    margin-bottom: 14px;
}

.showbox_huang {
    width: 20px;
    height: 3px;
    margin: 0 auto;
    background-color: #ffd93f;
    margin-bottom: 30px;
}

.showbox_list {
    height: 180px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.showbox_xiao {
    width: 100px;
    font-size: 14px;
    color: #353535;
    line-height: 14px;
    height: 14px;
    text-align: center;
    margin-bottom: 13px;
    float: left;
}

.showbox_fx {
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: #888888;
    margin-top: 10px;
}

.showbox_close {
    width: 38px;
    height: 38px;
    margin: 0 auto;
}

.showbox_close img {
    width: 38px;
    height: 38px;
}
</style>