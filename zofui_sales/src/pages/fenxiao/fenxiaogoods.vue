<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="search-wrap">
                <form action="" method="get" @submit.prevent="search">
                <div class="search-area">
                    <div class="input thin-border">
                        <font class="iconfont icon-search"></font>
                        <input bindconfirm="comfirm" confirmType="search" name="search" :placeholder="'请输入要搜索的'+ params.goodbname" type="text" v-model="page.pdata.key"></input>
                        <img bindtap="close" class="icon-close" src="http://img11.360buyimg.com/ddimg/jfs/t1/91764/22/1408/898/5dbeef03E1c8b5199/e35e44a7efed521a.png" v-if="hasValue">
                    </div>
                    <div class="btn" @click="search">搜索</div>
                </div>
                </form>
            </div>
            
            <div class="goods-list" wx:if="datalist.length">
                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="item wrap thin-border_b" v-for="item in datalist" >
                    <div class="inner">
                        <div class="goods" @click="link" :data-url="item.appurl">
                            <div class="lt">
                                <div class="image-box __100">
                                    <img :src="item.thumb">
                                </div>
                            </div>
                            <div class="rt">
                                <div class="rt_tit">{{item.title}}</div>
                                <div class="rt_price color-pri">
                                    <div class="sale">¥{{item.show_price}}</div>
                                    <div class="earn">
                                        <font>赚¥</font>{{item.fx_money}}起
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @click="getPoster" class="btn-wrap thin-border border-pri" :data-id="item.id">
                            <font class="color-pri">生成海报</font>
                        </div>
                    </div>
                </div>
                </van-list>
            </div>
            
            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                <div>— 暂时没有{{params.goodbname}} —</div>
            </div>

        </div>
    </div>

</template>

<script type="text/javascript">
	import { Toast,PullRefresh,ImagePreview,List,Dialog } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaogoods',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [List.name] : List,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                info : {},
                value : '',
                hasValue : false,
                datalist : [],
                page : {
                    pdata : {
                        doo : 'fenxiao',
                        op : 'indexlist',
                        status : 0,
                        key : '',
                        page : 1,
                        zfid : 0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
	  		}
	  	},
	  	created:function(e){
            this.initData();
            this.$route.meta.keepAlive = true;
            
	  	},
	  	methods: {
            onRefresh(){

                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            search(){
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
                return false;
            },
            getPoster(e){
                var self = this;
                self.$util.http('poster','GET',{op:'goods',gid:e.currentTarget.dataset.id},function(res){      
                    if (!res.errno && res.data ) {
                        ImagePreview({
                            images : [res.data.url],
                            closeOnPopstate : true
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.datalist = res.data.list;
                        self.params = res.data.params;
		                self.inited = 2;

                    }else if( res.errno == 3 ){

                        Dialog.confirm({
                          message: res.message
                        }).then(() => {
                            self.$router.push('/buycard');
                            self.reload = true;
                        }).catch(() => {
                            self.$router.go(-1);
                        });

                    }else if( res.errno == 4 ){

                        var isback = self.$util.cookie.get('needbackfx');
                        if( isback ){
                            self.$util.cookie.del('needbackfx');
                            self.$router.push('/user');
                        }else{
                            Dialog.alert({
                              message: res.message
                            }).then(() => {
                                self.$util.cookie.set('needbackfx',1,3600);
                                var tourl = '/fenxiaojoinPartner';
                                self.$router.push(tourl);
                            });
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
@import "../../assets/css/iconfont.css";
#main{
    min-height: 100vh;
    background-color: #fff;
}
.goods-list .item {
    padding-top: 10px;
    padding-bottom: 10px;
}
.goods-list .inner {
    position: relative;
}
.goods-list .inner .btn {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    padding: 0 15px;
    border: 1px solid;
    font-size: 12px;
    line-height: 24px;
    background-color: #fff;
    border-radius: 12px;
}
.goods-list .goods {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
}
.goods-list .goods .lt {
    width: 100px;
    margin-right: 12px;
    border-radius: 4px;
    position: relative;
}
.goods-list .goods .lt img {
    border-radius: 4px;
}
.goods-list .goods .rt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-flex: 1;
    flex: 1;
}
.goods-list .goods .rt_tit {
    font-size: 14px;
    line-height: 19px;
    color: #313131;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.goods-list .goods .rt_price {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 16px;
    line-height: 21px;
}
.goods-list .goods .rt_price .sale {
    margin-right: 7px;
}
.goods-list .goods .rt_price .earn {
    padding-left: 7px;
    border-left: 0.5px solid;
    height: 15px;
    line-height: 15px;
}
.goods-list .goods .rt_price .earn font {
    font-size: 11px;
}
.goods-list .btn-wrap {
    position: absolute;
    height: 25px;
    width: 70px;
    text-align: center;
    line-height: 25px;
    border-radius: 25px;
    bottom: 0;
    right: 0;
    font-size: 12px;
}
.search-wrap {
    height: 50px;
    margin-bottom: 15px;
}
.search-area {
    position: fixed;
    top: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.2);
    background: #ffffff;
    z-index: 10;
}
.search-area .input {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    border-color: #ddd;
    line-height: 30px;
    border-radius: 30px;
}
.search-area .input input {
    position: relative;
    z-index: 1;
    -webkit-box-flex: 1;
    flex: 1;
    height: 100%;
    padding: 0 10px;
    font-size: 14px;
    line-height: inherit;
    border:0;
    background-color : rgba(0,0,0,0);
}
.search-area .input .icon-search {
    font-size: 16px;
}
.search-area .input .icon-close {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    opacity: 0.2;
}
.search-area .btn {
    height: 30px;
    padding: 0 15px;
    margin-right: -15px;
    font-size: 14px;
    line-height: 30px;
    background-color: transparent;
}
</style>