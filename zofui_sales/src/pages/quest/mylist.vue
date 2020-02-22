<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新" >


                <van-tabs active="0" @change="tabChange" :color="color">
                    <van-tab title="我的提问" name="0"></van-tab>
                    <van-tab title="我的回答" name="1"></van-tab>
                </van-tabs>

                <div class="tocard item_cell_box" @click="link" data-url="/questindex">
                    <div class="tocard_l bg-pri">
                        <van-icon name="question-o" size="22" />
                    </div>
                    <div class="tocard_c item_cell_flex">
                        问答中心
                    </div>
                    <div class="tocard_r">
                        <van-icon name="arrow" size="12" />
                    </div>
                </div>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-if="datalist.length>0">
                        <div class="quest_box" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index">
                            <questitem :item="item" ></questitem>
                        </div>
                    </template>
                </van-list>

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                    <div>— 暂时还没有数据 —</div>
                </div>


            </van-pull-refresh>
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,tabs,tab,icon } from 'vant';
	import tabbar from '../../components/tabbar';
    import questitem from '../../components/questitem';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [tabs.name] : tabs,
            [tab.name] : tab,
            [icon.name] : icon,
	    	tabbar,questitem
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'quest',
                        op : 'list',
                        status : 0,
                        sortid : 0,
                        page : 1,
                        ismy : 1,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
	  			sharedata :{},
                color : '',
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.isbot = false;
                this.page.pdata.sortid = 0;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            tabChange(e){
                var self = this;
                this.isbot = false;
                this.datalist = [];
                this.page.pdata.type = e;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                self.onLoad(true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                
                
				self.page.isend = false;
                self.page.geting = false;
				
                self.$util.pageList(this,this.page,function(res){
                    self.inited = 2;
                    if( !res.errno && res.data ){        
                        
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.datalist = res.data.list;
                          
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
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

#main #content{
    min-height: 100vh;
    background: #fcfcfc;
}
.tocard {
    margin: 10px;
    padding: 10px;
    align-items: center;
    box-shadow: 0.5px 0.5px 4px 0.5px rgba(0, 0, 0, 0.1);
    border-radius: 2.5px;
    background: #fff;
}
.tocard_l{
    border-radius: 50%;
    width: 40px;
    height: 40px;
    line-height: 45px;
    text-align: center;
    font-size: 30px;
}
.tocard_c{
    font-size: 15px;
    padding-left: 15px;
}
.tocard_r{
    color: #999;
}

.quest_box{
    padding: 5px 15px;
}
</style>