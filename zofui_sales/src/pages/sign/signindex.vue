<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                
                <div class="sign_item" v-for="item in datalist" @click="link" :data-url="item.appurl" >
                    <div class="sign_itemtop">
                        <img v-lazy="item.thumb" >
                        <div class="sign_itemjoin bg-pri">{{item.joined}}人参与</div>
                    </div>
                    <div class="sign_name">
                        {{item.name}}
                    </div>
                    <div class="sign_bot item_cell_box">
                        <div class="item_cell_flex item_cell_box">
                            <img class="icon" src="https://img11.360buyimg.com/ddimg/jfs/t1/62662/31/3194/2759/5d1618a6E275ee1e0/48523d2ae2fb43c8.png" ></image>
                            <div>{{item.shop.name}}</div>
                        </div>
                        <div class="sign_m">{{item.m}}</div>
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
	  					op : 'list',
	  					status : 1,
	  					page : 1,
                        zfid : 0,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                tabList : [{key:1,name:'进行中的'},{key:2,name:'已结束的'},{key:3,name:'我参与的'}],
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
            initData(){
                var self = this;
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
				self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
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
                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
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
.sign_item{
    margin: 10px;
    box-shadow: 0.5px 0.5px 11px rgba(4,4,4,0.2);
    border-radius: 5px;
    margin-bottom: 20px;
}
.sign_itemtop{
    padding: 10px;
    height: 200px;
    position: relative;
}
.sign_itemtop img{
    width: 100%;
    height: 200px;
    display: block;
}
.sign_itemjoin{
    position: absolute;
    top: 20px;
    right: 20px;
    border-radius: 25px;
    padding: 2.5px 10px;
    text-align: center;
    font-size: 12.5px;
    box-shadow: 0.5px 0.5px 11px rgba(255,255,255,0.2);
}
.sign_name{
    padding: 5px 10px;
    font-size: 15px;
    font-weight: bold;
}
.sign_bot{
    padding: 5px 10px;
    padding-bottom: 10px;
    font-size: 14px;
    color: #999; 
    align-items: center;
}
.sign_bot .item_cell_flex{
    align-items: center;
    color: #333;
}
.sign_bot .icon{
    width: 20px;
    height: 20px;
}
</style>