<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" />
        <div id="content" v-if="inited == 2">
            

            <van-pull-refresh v-model="isrefresh" :disabled="disrefresh"  v-scroll="scrolltop" :head-height="80" @refresh="onRefresh" success-text="已刷新">
            <template v-if="datalist.length">
                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                    <div class="oh" >

                        <div class="pitem_l">
                            <div class="pitem" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index" v-if="index%2 == 0" :style="{'background-image': 'url('+item.vposter+')'}">
                                
                                <div class=" pitem_bot">
                                    <div class="pitem_title">{{item.title}}</div>
                                    <div class="item_cell_box">
                                        <div class="pitem_head">
                                            <img :src="item.headimg" />
                                        </div>
                                        <div class="item_cell_flex pitem_name">
                                            {{item.name}}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="pitem_l pitem_r">
                            <div class="pitem" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index" v-if="index%2 == 1" :style="{'background-image': 'url('+item.vposter+')'}">
                                
                                <div class=" pitem_bot">
                                    <div class="pitem_title">{{item.title}}</div>
                                    <div class="item_cell_box">
                                        <div class="pitem_head">
                                            <img :src="item.headimg" />
                                        </div>
                                        <div class="item_cell_flex pitem_name">
                                            {{item.name}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </van-list>
            </template>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 暂时还没有数据 —</div>
            </div>
            </van-pull-refresh>
            <div class="is-ipx" ></div>
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Tab,Tabs,Search } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Tabs.name] : Tabs,
            [Tab.name] : Tab,
			[Search.name] : Search,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'vedio',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
                        zfid : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                dev : '',
				searchfor : '',
	  		}
	  	},
        activated:function(e){
            if( self.sharedata ){
                self.$util.share(wx,self.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            scrolltop(e){
                if( e >= 40 ){
                    this.showtoptab = true;
                }else{
                    this.showtoptab = false;
                }
                this.disrefresh = e <= 0 ? false : true;
            },
            onRefresh(){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            clearfn(e){
                this.searchfn('');
            },

            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.geting = false;

	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){          	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;

	                   	self.datalist = res.data.list;
		                
                        self.$util.share(wx,self.sharedata);
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
#main #content {
    background-color: #fcfcfc;
    padding: 1vw;
    box-sizing: border-box;
}

.pitem_l{
    width: 48.5vw;
    float: left;
}
.pitem_l:nth-of-type(2){
    margin-left:1vw;
}
.pitem_l .pitem{
    background: rgba(0,0,0,0.1);
    margin-bottom: 15px;
    height:70vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 5px;
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
}
.pitem_r .pitem:first-child{
    height: 74vw;
}
.item_in img{
    height:66vw;
}
.pitem_bot{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 5px 5px 5px;
    box-sizing: border-box;
    background-color: rgba(0,0,0,0.2);

}
.pitem_title{
    color: #fff;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    padding-bottom: 3px;
}
.pitem_name{
    font-weight: bold;
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    
}
.pitem_head{
    background-color: #fcfcfc;
    width:25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 5px;
}
.pitem_head img{
    width:25px;
    height: 25px;
    display: block;
}
.pitem_bot .item_cell_box{
    align-items: center;
}
.oh{
    overflow: hidden;
}

</style>