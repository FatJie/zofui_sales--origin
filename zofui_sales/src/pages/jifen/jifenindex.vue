<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

            <div class="item_cell_box jifen_head bg-pri">
                <div class="jifen_headimg">
                    <img :src="userinfo.headimg" >
                </div>
                <div class="item_cell_flex jifen_my">
                    <div class="jifen_myt">{{userinfo.nickname}}</div>
                    <div class="jifen_mynum" @click="link" data-url="/jifenlog">剩余{{params.jfbname}}{{userinfo.jifen ? userinfo.jifen*100/100 : 0}}</div>
                </div>
                <div class="jifen_log" @click="bindCode">
                    使用卡密
                </div>
            </div>

            <div class="search-wrap" >
                <div class="search-area" style="border:0;box-shadow:initial;" :style="istop ? 'position:fixed' : 'position:relative'">
                	<form action="" @submit.prevent="subsearch" style="width:100%;">
	                    <div class="input thin-border sortinput" >
	                        <font class="iconfont icon-search"></font>
	                        <input bindconfirm="comfirm" @focus="searching = true" @blur="searchingfalse" confirmType="search" name="search" type="search" placeholder="请输入要搜索的内容" v-model="search" style="width:100%;" />
	                        <img @click="close" v-if="search || searching" class="icon-close" src="http://img11.360buyimg.com/ddimg/jfs/t1/83785/27/14502/898/5dbef476Ef515b4a6/3e8b4950f1c6943a.png" >
	                    </div>
                	</form>
                </div>
                    <div scrollX class="scroll" v-if="sort.length > 0">
                        <div class="top-scroll">
                            <div @click="tabChange" class="sortitem" :class="0 == page.pdata.sortid ? 'color-pri border-pri' : ''" data-sortid="0"  >
                                全部
                            </div>
                            <div @click="tabChange" class="sortitem" :class="item.id == page.pdata.sortid ? 'color-pri border-pri' : ''" :data-sortid="item.id"  v-for="item in sort" >
                                {{item.name}}
                            </div>
                        </div>
                    </div>
            </div>

            <div v-if="datalist.length > 0">
            	<van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="main-list myshop-list">
                    <div class="jifen_item " @click="link" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="jifen_thumb">
                            <img :src="item.thumb" >
                        </div>
                        <div class="jifen_title">
                            {{item.name}}
                        </div>
                        <div class="item_cell_box jifen_bot">
                            <div class="item_cell_flex jifen_botold">原价 <font>¥{{item.price*100/100}} </font></div>
                            <div class="jifen_need color-pri">
                                {{item.need*100/100}}{{params.jfbname}}<font v-if="item.fee > 0">+¥{{item.fee*100/100}}</font>
                            </div>
                        </div>
                    </div>
                </div>
                </van-list>
            </div>
            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 暂时还没有数据 —</div>
            </div>
        
            <div class="module-popup" v-if="cvisible">
                <div class="popup-mask popup--visible"></div>
                <div class="popup-dialog popup--visible">
                    <form bindreset="$FormModel$resetFn" bindsubmit="FormIdsubmit">
                        <div class="popup-dialog__hd" >
                            <div class="popup-dialog__title">兑换{{params.jfbname}}</div>
                        </div>
                        <div class="popup-dialog__bd">
                            <div class="popup-dialog__content" ></div>
                            <input class="popup-input popup-prompt-input" placeholder="输入密码"  v-model="code"   />
                        </div>
                        <div class="popup-dialog__ft thin-border_t" v-if="buttons.length">
                            <div class="popup-dialog__btn popup-dialog__btn_default thin-border_l" :class="item.type=='primary'?'color-pri':''" @click="butfn(item.fn)"  v-for="item in buttons" >{{item.text}}</div>
                        </div>
                    </form>
                </div>
            </div>

            
        </div>
    </div>
    </van-pull-refresh>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell, CellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
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
	  			userinfo : {},
	  			datalist : [],
	  			searching : false,
	  			istop : false,
	  			cvisible : false,
	  			search : '',
	  			sort : [],
                code : '',
	  			page : {
	  				pdata : {
	  					doo : 'jifen',
	  					op : 'indexlist',
	  					sortid : 0,
	  					page : 1,
                        zfid : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
		        buttons : [{
		            type: "default",
		            text: "取消",
		            fn: "cancel"
		        }, {
		            type: "primary",
		            text: "确定",
		            fn: "confirm"
		        }],
		        prompt : [{placeholder:'输入密码',response:'code'}],
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
            bindCode(e){
            	this.cvisible = true;
            },
            comfirm(e){
                console.log(e)
            },
            close(){
            	this.search = '';
            	this.subsearch();
            },
            searchingfalse(){
            	this.search = '';
            	this.searching = false;
            	if( this.page.pdata.search && this.page.pdata.search.length > 0 ){
            		this.page.pdata.search = '';
            		this.subsearch();
            	}
            },
            subsearch(){

            	if( !self.search ) return false;

                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.pdata.search = self.search;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            butfn(type){
            	var self = this;
            	if( type == 'cancel' ){
            		this.cvisible = false;
            	}else if(type == 'confirm'){
			        
	                var postdata = {
	                    op : 'passbycode',
	                    code : self.code,
	                }
		            self.$util.http('jifen','GET',postdata,function(res){
		                if( !res.errno && res.data ){ 
			                Dialog.alert({
							  	message: res.message
							}).then(() => {
			                    self.userinfo.jifen = res.data.data.jifen;
			                    self.cvisible = false;
							});
			            }else{
			                self.$toast(res.message);
			            }
			        },true);
            	}
            },
            tabChange(e){
                var self = this;
                if( e.currentTarget.dataset.sortid == self.page.pdata.sortid ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.sortid = e.currentTarget.dataset.sortid;
                self.onLoad();
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
	                   	self.userinfo = res.data.userinfo;
		                
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

                        window.document.title = self.params.jfbname+'中心';
                        
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
@import "../../assets/css/iconfont.css";
#main{
	min-height: 100vh;
    background: #fff;
}
.jifen_head{
    background: #000;
    padding: 20px 10px;
    align-items: center;
    color: #fff;
}
.jifen_headimg{
    margin-right: 10px;
    width: 50px;
    height: 50px;
}
.jifen_headimg img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0.5px 0.5px 5.5px rgba(255,255,255,0.5);
}
.jifen_log{
    color: #fff;
    padding: 0 15px;
    height: 20px;
    line-height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 25px;
    font-size: 13px;
}
.jifen_myt{
    font-size: 17.5px;
    font-weight: bold;
}
.jifen_mynum{
    font-size: 12px;
    border:1px solid #fff;
    padding: 1px 5px;
    margin-top: 5px;
    display: inline-block;
    border-radius: 20px;
    opacity: 0.9;
}

.main-list{
  padding: 10px;
  overflow: hidden;
}
.jifen_item{
  width: 49%;
  float: left;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 2.5px;
  box-shadow: 0.5px 0.5px 5.5px rgba(0, 0, 0, 0.2);
}
.jifen_item:nth-of-type(2n){
  margin-left: 2%;
}
.jifen_thumb{
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 4.766rem;
}
.jifen_thumb img{
  width: 100%;
  height: 4.766rem;
}
.jifen_title{
  padding: 5px 2.5px;
  font-size: 14px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-align: justify;
}
.jifen_botold{
  color: #999;
  font-size: 13px;
}
.jifen_bot{
  padding: 0 2.5px;
  padding-bottom: 10px;
}
.jifen_need{
  font-size: 15px;
}
.jifen_botold font{
    text-decoration: line-through;
}

/**/

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
    padding: 0 10px;
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
    height: 32.5px;
    padding: 0 10px;
    border-color: #ddd;
    line-height: 32.5px;
    border-radius: 32.5px;
}

.search-area .input input {
    position: relative;
    z-index: 1;
    -webkit-box-flex: 1;
    flex: 1;
    height: 32.5px;
    padding: 0 10px;
    font-size: 14px;
    line-height: inherit;
    border:0;
    background:rgba(0,0,0,0);
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

.scroll-wrap .scroll {
  position: relative;
}

.scroll-wrap .scroll {
  height: 40px;
}

/**/
.module-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 19;
    width: 100%;
    height: 100%;
}

.module-popup .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
    background-color: rgba(0,0,0,0.6);
}

.module-popup .popup-dialog {
    overflow: hidden;
    position: absolute;
    top: 45%;
    left: 50%;
    width: 80%;
    max-width: 300px;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    background-color: #fff;
    transition: all .3s;
    transform: translate(-50%,-50%);
    border-radius: 1.5px;
}

.module-popup .popup-dialog .popup-dialog__hd {
    padding: 0.3em 1.6em 0.3em;
}

.module-popup .popup-dialog .popup-dialog__hd .popup-dialog__title {
    font-weight: 400;
    font-size: 18px;
}

.module-popup .popup-dialog .popup-dialog__bd {
    padding: 0 1.6em .8em;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #666;
}

.module-popup .popup-dialog .popup-dialog__bd .popup-input {
    padding: 4px 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    height: 2em;
    width: 90%;
    margin: 10px auto 0;
    font-size: inherit;
    text-align: left;
    line-height: 2em;
    color: inherit;
    background-color: transparent;
    outline: 0;
}

.module-popup .popup-dialog .popup-dialog__bd .input-place {
    color: #999;
}

.module-popup .popup-dialog .popup-dialog__ft {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-color: #d5d5d5;
    font-size: 18px;
    line-height: 48px;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn {
    overflow: visible;
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    border-color: #d5d5d5;
    color: #3cc51f;
    background-color: transparent;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn.default {
    color: #5f646e;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn:first-child:after {
    visibility: hidden;
}

.module-popup .popup--visible {
    opacity: 1;
    visibility: visible;
}

.top-scroll{
    white-space: nowrap;
    overflow-x: auto;
    margin-top: -10px;
    -webkit-overflow-scrolling : touch;
}
.sortitem{
    border:1px solid #ddd;
    -webkit-box-flex:1;
    flex:1;
    font-size:14px;
    text-align:center;
    white-space: nowrap;
    border-radius: 35px;
    padding: 5px 10px;
    margin-left: 7.5px;
    display: inline-block;
}

.sortinput input{
  width: 35px;
}
</style>