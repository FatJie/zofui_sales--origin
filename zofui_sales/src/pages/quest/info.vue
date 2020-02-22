<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新">


                <template v-if="goodsinfo">
                    <div class="goodsinfobox item_cell_box" @click="link" :data-url="goodsinfo.appurl">
                        <div class="thumb">
                            <img :src="goodsinfo.thumb" />
                        </div>
                        <div class="item_cell_flex gtitle">{{goodsinfo.title}}</div>
                    </div>
                </template>

                <div class="item_cell_box info_title">
                    <div class="lbg-pri info_titlei">问</div>
                    <div class="item_cell_flex info_titlet">{{info.title}}</div>
                </div>

                <div class="item_cell_box info_desc">
                    <div class="item_cell_flex info_desct">{{info.time}}</div>
                    <div class="reply_btn lbg-pri" @click="answer">我来回答</div>    
                </div>

                <div class="reply_list">

                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="到底了" :offset="100" @load="onLoad">
                    <template v-if="datalist.length>0">
                        <div class="reply_item item_cell_box" v-for="(item,index) in datalist" :key="index">
                            <div class="item_head">
                                <img :src="item.headimg" ></image>
                            </div>
                            <div class="item_cell_flex">
                                <div class="item_nick">{{item.nickname}}</div>
                                <div class="item_time">{{item.time}}</div>
                                <div class="item_content">
                                    {{item.content}}
                                </div>
                                <div class="tr item_bot" >
                                    <div class="item_num" @click="zanit" :data-id="item.id" :data-i="index">有用  {{item.zan}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    </van-list>

                    <div class="list-none" v-if="datalist.length <= 0">
                        <img class="info_img"  src="https://ui.fhcloudapi.cn/xcx_urm/img/listnone-info.png" />
                        <div>— 暂时还没有回复 —</div>
                    </div>

                </div>

            </van-pull-refresh>
            
            <van-popup v-model="show" position="top" bind:close="onClose" :close-on-click-overlay="true" >
                <div class="text_box">
                    <textarea class="text" bindinput="contentfn" v-model="content" auto-height placeholder="输入内容" :focus="show" />
                    <van-button custom-class="lbg-pri disbtn mt20" block  type="primary" size="normal" @click="sub">提交</van-button>
                </div>
                
            </van-popup>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Rate,Popup,Button } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'questinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Rate.name] : Rate,
            [Popup.name] : Popup,
            [Button.name] : Button,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                info : {},
                goodsinfo : '',
                isshowshare : false,
                datalist : [],
                page : {
                    pdata : {
                        doo : 'quest',
                        op : 'replylist',
                        status : 0,
                        qid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
                content : '',
                show : false,
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
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            sub(){
                var self = this;
                var postdata = {
                    op : 'reply',
                    qid : self.info.id,
                    content : self.content,
                }

                self.$util.http('quest','GET',postdata,function(res){
                    if( res && res.data ){        
                        
                        self.$dialog.alert({
                            message: res.message
                        }).then(() => {
                            
                            self.datalist = [];
                            self.page.isend = false;
                            self.page.doing = false;
                            self.page.pdata.page = 1;
                            self.onLoad();
                            self.show = false;
                            self.content = '';
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            answer(){
                this.show = true;
            },
            zanit(e){
                var self = this;
                var postdata = {
                    op : 'zan',
                    rid : e.currentTarget.dataset.id,
                }
                var index = e.currentTarget.dataset.i;
                self.$util.http('quest','GET',postdata,function(res){
                    if( res && res.data && !res.errno ){        
                        self.datalist[index].zan = self.datalist[index].zan*1 + 1;
                    }
                    self.$toast(res.message);
                },true);
            },
            initData(){

                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
                self.page.pdata.qid = params.id;

	            self.$util.http('quest','GET',postdata,function(res){
					self.inited = 1;
	                if( res && res.data && !res.errno ){        
	                	
                        self.info = res.data.info;
	                   	self.params = res.data.params;
                        self.sharedata = res.data.sharedata;
                        self.goodsinfo = res.data.goodsinfo;
		                
                        window.document.title = self.info.title;
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        self.onLoad();
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
}
#main{
    padding: 10px;
    background: #fcfcfc;
}
#content{
    min-height: 90vh;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
}
.info_title{
    align-items: flex-start;
}
.info_titlei{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
    text-align: center;
    font-size:15px;
}
.info_titlet{
    line-height: 20px;
    font-weight: bold;
    font-size:15px;
}
.info_desc{
    padding: 15px 0;
    align-items: center;
    border-bottom: 0.5px solid #eee;
}
.info_desct{
    font-size: 11px;
    color: #999;
}
.reply_btn{
    padding: 5px 15px;
    border-radius: 40px;
    font-size: 12.5px;
}
.reply_item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}
.item_head img{
    width:50px;
    height: 50px;
    border-radius: 50%;
    border:0.5px solid #eee;
}
.item_head{
    margin-right: 10px;
}
.item_nick{
    font-size: 14px;
    font-weight: bold;
}
.item_time{
    font-size: 11px;
    color: #999;
    padding: 10px 0;
}
.item_content{
    font-size: 13px;

}
.item_bot{
    margin-top: 15px;
    text-align: right;
}
.item_bot .item_num{
    display: inline-block;
    border-radius: 25px;
    border:1px solid #eee;
    font-size: 10px;
    padding: 2.5px 5px;
}

.disbtn{
    border:0!important;
}
.text_box{
    padding: 10px;
}
.text{
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 1.5px;
    font-size: 14px;
    min-height: 100px;
    border:1px solid #eee;
    width:100%;
}

.goodsinfobox{
    padding: 15px 0;
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