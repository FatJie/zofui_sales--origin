<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                
                <div class="myshop-top">
                    <div class="info">
                        <img class="avatar" :src="uinfo.headimg"></image>
                        <div class="rt">
                            <div class="name">{{uinfo.nickname}}</div>
                        </div>
                    </div>
                    <div class="divs" v-if="uinfo.scan > 0">
                        <div class="divs-num">
                            <font class="num">{{uinfo.scan}}位</font>好友已浏览过
                        </div>
                    </div>
                </div>
                <div class="hr"></div>
                <div class="myshop-tit">精选推荐</div>
                <template v-if="datalist.length>0">
                    <div class="main-list myshop-list">
                        <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="(item,index) in datalist" :key="index">
                            <div class="top">
                                <div class="top_pic image-box __100">
                                    <img mode="aspectFill" :src="item.thumb"></image>
                                </div>
                                <div class="list-"></div>
                            </div>
                            <div class="btm">
                                <div class="btm_tit">
                                    {{item.title}}</div>
                                <div class="btm-b">
                                    <div class="btm-info">
                                        <div class="btm_price fmt-price">
                                            <div class="now color-pri">
                                                <font class="dollar">¥</font>
                                                <font class="price">{{item.show_price}}</font>
                                            </div>
                                            <div class="old" v-if="item.oldprice > 0">¥{{item.oldprice}}</div>
                                        </div>
                                        <div class="btm_saled" v-if="item.saled > 0">已售：{{item.saled}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="list-none"  v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— '暂时还没有数据' —</div>
                </div>
            </van-list>
            
        </div>
    </div>
    </van-pull-refresh>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell, CellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
		name : 'fenxiaoindex',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Cell.name] : Cell,
            [CellGroup.name] : CellGroup,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			sharedata :{},
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'fenxiao',
	  					op : 'indexlist',
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


        },
	  	created:function(e){
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
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
            initData(){
                var self = this;
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                var uid = query.uid ? query.uid : 0;
                
	            self.$util.http('fenxiao','GET',{op:'index',uid:uid},function(res){  
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.goods;
	                   	self.uinfo = res.data.user;
		                
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

.main-list .btm_tit {
    font-size: 13px;
    line-height: 18px;
}

.main-list {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
}

.main-list .item {
    margin-bottom: 15px;
    width: 160px;
}

.main-list .item:nth-last-child(1):after,.main-list .item:nth-last-child(2):after {
    visibility: hidden;
}

.main-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px;
}

.main-list .item .btm {
    padding: 15px 0 10px;
}

.main-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.main-list .item .btm-info {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.main-list .btm_tit {
    height: 36px;
    margin-bottom: 10px;
    font-weight: 400;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #2a2a2a;
}

.main-list .btm_tit .tag {
    display: inline-block;
    vertical-align: top;
    padding: 0 7.5px;
    margin-right: 10px;
    font-size: 10px;
    text-align: center;
    line-height: inherit;
    color: #fff;
    border-radius: 1px;
}

.main-list .btm_price .old {
    display: none;
}

.main-list .btm_saled {
    margin-left: 10px;
    font-size: 12px;
    color: #b4b4b4;
}

.myshop-top {
    padding-top: 25px;
    padding-bottom: 15px;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/83291/14/14480/5676/5dbeef23E1823e6d7/f566730aefd1769a.png) 0 0 no-repeat;
    background-size: 100% auto;
    padding: 15px;
}

.myshop-top .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 15px 15px 20px;
    margin-bottom: 12px;
    background: #fff url(http://img11.360buyimg.com/ddimg/jfs/t1/80931/37/14720/9450/5dbeef39E1ee6cf51/8811361ea38bacd0.png) 0 0 no-repeat;
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 0 1px 2.5px 0 rgba(0,0,0,0.1);
}

.myshop-top .info .avatar {
    width: 60px;
    height: 60px;
    margin-right: 15px;
    border-radius: 50%;
}

.myshop-top .info .rt {
    -webkit-box-flex: 1;
    flex: 1;
    line-height: 20px;
}

.myshop-top .info .name {
    font-size: 15px;
    color: #2a2a2a;
}

.myshop-top .info .rank {
    font-size: 13px;
    color: #969696;
}

.myshop-top .views .views-num {
    font-size: 11px;
    color: #959595;
}

.myshop-top .views .views-num .num {
    margin-right: 8px;
    font-size: 13px;
    color: #2a2a2a;
}

.myshop-top .views .views-list {
    padding-top: 8px;
    font-size: 0;
}

.myshop-top .views .views-list .item {
    display: inline-block;
    vertical-align: top;
    width: 27px;
    height: 27px;
    margin-right: -2px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    line-height: 27px;
    color: #959595;
    background-color: #e4e4e4;
    border-radius: 50%;
}

.myshop-tit {
    padding: 15px 0;
    font-size: 18px;
    text-align: center;
    line-height: 28px;
    color: #353535;
}

.myshop-tit:before,.myshop-tit:after {
    content: '.';
    display: inline-block;
    vertical-align: top;
    width: 11px;
    margin: 0 5px;
    font-size: 0;
    text-indent: -9499.5px;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/57327/10/15217/1410/5dbeef52E570f5dd0/11032c060603b828.png) 0 center no-repeat;
    background-size: 100% auto;
}

.myshop-tit:after {
    transform: rotateY(180deg);
}

.myshop-list .top {
    border-radius: 4px;
}

.myshop-list .top img {
    border-radius: 4px;
}
</style>