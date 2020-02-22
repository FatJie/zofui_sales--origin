<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
           

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <template v-show="datalist.length > 0">

                    <div class="kflist item_cell_box" @click="link" :data-sid="item.id" :data-url="item.appurl" v-for="item in datalist">
                        <div class="readit" v-if="item.status == 0 && item.role == page.pdata.role"></div>
                        <div class="kflist_head">
                            <img :src="item.headimg" >
                        </div>
                        <div class="item_cell_flex kflist_nick">
                            <div class="name">{{item.name}}</div>
                            <div class="desc">{{item.content}}</div>
                        </div>
                        <div class="kflist_time">
                            {{item.time}}
                        </div>
                    </div>

                </template>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
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
        name : 'kefulist',
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
                timer : false,
	  			page : {
	  				pdata : {
	  					doo : 'kefu',
	  					op : 'mylist',
	  					type : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},

	  		}
	  	},
	  	created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            this.getnew();

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
        beforeRouteLeave(to, from, next){
            clearInterval(this.timer);
            next();
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            getnew(){
                var self = this;
                clearInterval(self.timer);
                self.timer = setInterval(function(){
                    console.log('123')
                    self.initData();
                },8000);
            },
            initData(){
                var self = this;
                var query = this.$route.query;

                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.pdata.role = query.role ? query.role : 'user';
                self.page.pdata.shopid = query.shopid ? query.shopid : '';
                self.page.pdata.uid = query.uid ? query.uid : '';
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
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
#main {
    min-height: 100vh;
    background-color: #f9f9f9;
    color : #343434;
}
#main #content{
    padding-bottom: 0;
}
.kflist{
    padding: 10px;
    align-items: center;
    background-color: #fff;
    margin-bottom: 15px;
    border-radius: 2.5px;
    font-size: 12px;
    position: relative;
}
.kflist_head{
    width: 50px;
    height: 50px;
}
.kflist_head img{
    width: 50px;
    height: 50px;
    border-radius: 50%;

}
.kflist_nick {
    padding: 0 10px;
}
.kflist_nick .name{
    font-size: 16px;
    font-weight: bold;
}
.kflist_nick .desc{
    color: #999;
}
.kflist_time{
    color: #999;
    font-size: 11px;
}
.kflist .readit{
    width: 10px;
    height: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 50%;
    background-color: rgb(66, 231, 0);
}
</style>