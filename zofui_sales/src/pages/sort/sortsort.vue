<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <font @click="link" data-url="/sortsearch">
                <van-search placeholder="搜索" shape="round"  disabled />
            </font>
            
            <!-- <van-tree-select
                
                :items="sort"
                :main-active-index="activeIndex"
            >
                <template slot="content">
                    <van-image v-if="activeIndex === 0" src="https://img.yzcdn.cn/vant/apple-1.jpg" />
                    <van-image v-if="activeIndex === 1" src="https://img.yzcdn.cn/vant/apple-2.jpg" />
                </template>
            </van-tree-select> -->

            <div class="tree-select">
                <div class="tree-select__nav">
                    <div class="tree-select__nav-item" :class="{'tree-select__nav-item--active':activeIndex == index}" :style="{'border-left': activeIndex == index ? '3px solid '+color : '0'}" v-for="(item,index) in sort" @click="actfn(index)">
                        {{item.text}}
                    </div>
                </div>
                <div class="tree-select__content">
                    
                        <div v-for="(item,index) in sort" :key="index" v-if="activeIndex == index">
                            <div class="sort_item" v-for="(inn,idx) in item.children" :key="idx">
                                <div class="sort_itemin" @click="link" :data-url="inn.appurl">
                                    <div class="sort_img">
                                        <img v-lazy="inn.img" >
                                    </div>
                                    <div class="sort_name">{{inn.text}}</div>
                                </div>
                            </div>
                        </div>

                </div>
            </div>

        </div>
    </div>
    
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Search,TreeSelect } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';

	export default {
        name : 'sortsort',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
			[Search.name] : Search,
            [TreeSelect.name] : TreeSelect,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			sharedata :{},
	  			datalist : [],
	  			sort : [],
                color : '',
                dev : '',
				activeIndex : 0,
	  		}
	  	},
	  	created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            actfn(e){
                this.activeIndex = e;
            },
            onPageScroll(e){
                if( e.scrollTop > 100 ){
                    this.setData({
                        showtoptab : false
                    })
                }else{
                    this.setData({
                        showtoptab : true
                    })
                }
            },
            onReachBottom : function(){
                var self = this;
                app.com.getPage(self,self.data.page,20,function(res){
                    self.setData({
                        datalist : self.data.datalist.concat(res.data.data.list)
                    });
                });
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;

                var postdata = {
                    op : 'sortlist',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
                self.$util.http('sort','GET',postdata,function(res){
                    self.inited = 1;
                    if( res && res.data ){        
                        
                        self.sort = res.data.sort;
                        self.params = res.data.params;
                        self.sharedata = res.data.sharedata;
                        
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        self.color = self.$util.themcolor(self.params.style);
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
.tree-select {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    -webkit-user-select: none;
    user-select: none
}

.tree-select__nav {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    overflow-y: auto;
    background-color: #fafafa;
    -webkit-overflow-scrolling: touch
}

.tree-select__nav-item {
    position: relative;
    padding: 0 9px 0 12px;
    line-height: 44px;
    border-left: 3px solid transparent;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.tree-select__nav-item--active {
    font-weight: 700;
    background-color: #fff;
    border-color: #fff
}

.tree-select__nav-item--disabled {
    color: #969799
}

.tree-select__content {
    -webkit-box-flex: 3;
    -webkit-flex: 3;
    flex: 3;
    overflow-y: auto;
    background-color: #fff;
    -webkit-overflow-scrolling: touch
}

.tree-select__item {
    position: relative;
    padding-left: 15px;
    font-weight: 700;
    line-height: 44px
}

.tree-select__item--active {
    color: #f44
}

.tree-select__item--disabled {
    color: #c8c9cc
}

.tree-select__selected {
    position: absolute;
    top: 50%;
    right: 15px;
    margin-top: -8px
}

#content{
    overflow: hidden;
}
.van-tree-select{
    height:calc(90vh)!important;
}
.van-tree-select__nav{
    width:27%!important;
    min-width:50px!important;
    padding-bottom:60rpx;
}
.van-tree-select__content{
    width:75%!important;
    margin-left: 25%!important;
    padding-left: 8px!important;
}
.sort_item{
    width:33.3%;
    float: left;
    text-align: center;
}
.sort_itemin{
    padding: 15px 5px;
}
.sort_img img{
    width:40px;
    height:40px;
    display: inline-block;
}
.sort_name{
    font-size:12px;
}

</style>