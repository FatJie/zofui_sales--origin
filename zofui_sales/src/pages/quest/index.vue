<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新" >
        <div id="content" v-if="inited == 2">
            

                <div class="tag mt10" v-if="sort.length > 0 && page.pdata.gid == 0" >
                    <div @click="tabChange" class="tag-item " :class="page.pdata.sortid == 0?'color-pri':''" data-id="0" >全部</div>
                    <div @click="tabChange" class="tag-item " :class="page.pdata.sortid == item.id?'color-pri':''" :data-id="item.id" v-for="(item,index) in sort" :key="item.id">{{item.name}}</div>
                </div>

                <template v-if="page.pdata.gid > 0 && goodsinfo">
                    <div class="goodsinfobox item_cell_box" @click="link" :data-url="goodsinfo.appurl">
                        <div class="thumb">
                            <img :src="goodsinfo.thumb" />
                        </div>
                        <div class="item_cell_flex gtitle">{{goodsinfo.title}}</div>
                    </div>
                </template>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                    <template v-if="datalist.length>0">
                        <div class="quest_box" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index">
                            <questitem :item="item" :sstyle="params.style"></questitem>
                        </div>
                    </template>
                </van-list>

                <div class="list-none" v-if="datalist.length <= 0">
                    <img class="info_img"  src="https://ui.fhcloudapi.cn/xcx_urm/img/listnone-info.png">
                    <div>— 暂时还没有提问 —</div>
                </div>

            

            

        </div>
        </van-pull-refresh>
        <img class="pubbtn" @click="link" :data-url="'/questpub?gid='+page.pdata.gid" src="http://img11.360buyimg.com/ddimg/jfs/t1/95622/38/1802/17963/5dc50f16E0cacaa60/83a6588ca3c87da9.png" />
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import questitem from '../../components/questitem';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
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
                        gid : 0,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
	  			sharedata :{},
                sort:[],
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
                this.page.pdata.sortid = e.currentTarget.dataset.id;
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
                self.page.pdata.gid = query.gid ? query.gid : 0;
                
                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
                
				self.page.isend = false;
                self.page.geting = false;
				
                self.$util.pageList(this,this.page,function(res){
                    self.inited = 1;
                    if( !res.errno && res.data ){        
                        
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

#main #content{
    min-height: 100vh;
    background: #fcfcfc;
}
.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    margin-top:10px;
}

.tag>.tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 13px;
    margin-right: 12px;
    color: #585858;
    font-size: 13px;
    text-align: center;
}

.tag>.tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}

.quest_box{
    padding: 5px 15px;
}

.pubbtn{
    position:fixed;
    right:10px;
    bottom:150px;
    width:50px;
    height:50px;
}
.goodsinfobox{
    padding: 15px;
    background: #fff;
    align-items: center;
}
.thumb{
    width:50px;
    margin-right:5px;
}
.thumb img{
    width: 50px;
    height: 50px;
    border-radius: 4px;
}
.gtitle{
    font-size: 14px;
    color: #666;
}
</style>