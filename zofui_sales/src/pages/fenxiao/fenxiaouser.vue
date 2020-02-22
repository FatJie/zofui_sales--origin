<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新">
    <div :class="params.style"  id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="user-top">
                <div class="info">
                    <div class="name">{{userinfo.nickname}}</div>
                    <!-- <div class="rank" v-if="dataInfo.sort > 0">榜单排名：{{dataInfo.sort}}</div> -->
                </div>
                <div class="detial">
                    <img class="avatar" :src="userinfo.headimg">
                    <div class="item">
                        本日收入
                        <div class="num">{{dataInfo.today_deduct}}</div>
                    </div>
                    <div class="item">
                        推广订单
                        <div class="num">{{dataInfo.order}}</div>
                    </div>
                    <div class="item" v-if="params.isucard == 0">
                        推广卡数
                        <div class="num">{{dataInfo.card_order}}</div>
                    </div>
                </div>
            </div>
            <div class="user-list wrap">
                <div class="item thin-border_b">
                    <div class="lt">
                        <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/57949/24/15068/1720/5dbeee83E4e358ef6/05fe45612a157ab5.png">
                        <div class="tit">累计销售额</div>
                    </div>
                    <div class="info">{{userinfo.totalmoney}}元</div>
                </div>
                <div class="item thin-border_b ric" @click="link" data-url="/fenxiaobill">
                    <div class="lt">
                        <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/51150/22/15189/1281/5dbeeeb9E16c1ff41/919f93c4dccf4e07.png">
                        <div class="tit">提现中心</div>
                    </div>
                    <div class="info">余额{{userinfo.money}}</div>
                </div>
            </div>
            <div class="hr"></div>
            <div v-if="userinfo.parent > 0" class="user-parent">邀请人 {{dataInfo.parent}}（{{userinfo.parent}}）</div>
            <div class="user-link wrap">
                <div @click="getPoster" class="item bg01" :style="{width:params.pfrank == 0 ? '2.7rem' : '3rem'}">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/80631/11/14265/2117/5dbef0bdE14cb3c8a/482800ce3029588b.png">
                    <div>邀请海报</div>
                </div>
                <div class="item bg02" @click="link" data-url="/fenxiaorank" v-if="params.pfrank == 0 || !params.pfrank">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/103092/17/1477/2227/5dbef0e0Eaf5112c1/8182ef204a21162b.png">
                    <div>达人排行榜</div>
                </div>
                <div class="item bg03" @click="link" data-url="/fenxiaomyteam" :style="{width:params.pfrank == 0 ? '2.7rem' : '3rem'}">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/45970/10/15138/1767/5dbef0f2E4e21d94e/a345a7f50602e561.png">
                    <div>我的团队</div>
                </div>
            </div>
            <div class="hr"></div>
            <div class="user-list wrap">
                <div class="item thin-border_b" @click="link" data-url="/ucardapply" v-if="params.fxocard == 1 && userinfo.isfxcard == 0 ">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/51150/22/15189/1281/5dbeeeb9E16c1ff41/919f93c4dccf4e07.png">
                    <div class="tit">申请会员卡</div>
                </div>
                <div class="item thin-border_b" @click="link" data-url="/fenxiaoorder_record">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/91840/4/1457/1781/5dbef11bEff4503d3/49e0c1984b9c69a8.png">
                    <div class="tit">订单推广记录</div>
                </div>
                <div class="item thin-border_b" @click="link" data-url="/fenxiaocard_record" v-if="params.pfc == 0 || !params.pfc">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/96025/22/1454/1254/5dbeeed0E57960db9/92c4ea6592beb775.png">
                    <div class="tit">{{params.cardname}}推广记录</div>
                </div>
                <div class="item thin-border_b" @click="link" data-url="/fenxiaoinvite_shop">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/61500/15/14467/1918/5dbef140E3edd3e67/16a6cc927d578b78.png">
                    <div class="tit">发展团队</div>
                </div>
                <!-- <navigator class="item thin-border_b" url="/zofui_sales/fenxiao/kefu">
                    <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/106760/36/1411/1790/5dbef15aE43faa2e3/72d2efcbce472a3b.png">
                    <div class="tit">客服人员</div>
                </navigator> -->
            </div>

            
            <van-popup class="showposter_popup showposter" style="z-index:111;" v-model="showposter" position="bottom" >
                <img class="poster_img" :src="posterurl" >
                <div class="showposter item_cell_box" v-if="dev == 'app'">
                    <div class="showposter_item" @click="wxshare(1)">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>转发给好友</div>
                    </div>
                    <div class="showposter_item" @click="wxshare(2)">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>转发到朋友圈</div>
                    </div>
                    <div class="showposter_item" @click="saveposter">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70599/27/1062/4948/5cf5d8a7E1d3b8a1d/7f74b9b5814e0c6e.png">
                        <div>保存到相册</div>
                    </div>
                </div>
            </van-popup>
            
            
        </div>
    </div>
    </van-pull-refresh>

</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePreview,Popup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaouser',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [Popup.name] : Popup,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                dataInfo : {},
                reload : false,
                dev : '',
                showposter : false,
                posterurl : '',
                atrue : true,
	  		}
	  	},
	  	created:function(e){
	  		//this.$emit('loadmessage',false);

            this.initData();
            this.$route.meta.keepAlive = true;
	  	},
        activated:function(e){
            if( this.reload ){
                this.initData();
                this.reload = false;
            }
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                var self = this;
                if( type == 'copy' ){
                    this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                         self.$toast('已复制');
                    }, function (e) {
                        self.$toast('复制失败');
                    })
                }else if(type == 'callphone'){
                    window.location.href = 'tel://' + e.currentTarget.dataset.tel;
                }else if(type == 'toweburl'){
                    window.location.href = e.currentTarget.dataset.weburl;
                }else if(type == 'navigateto'){
                    window.location.href = e.currentTarget.dataset.url;
                }
            },
            wxshare(type){
                var self = this;
                var scene = 'session';
                if(type == 2){
                    scene = 'timeline';
                }
                var wx = api.require('wx');
                wx.shareImage({
                    apiKey: '',
                    scene: scene,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.posterurl,
                }, function(ret, err) {
                    if (ret.status) {
                        self.$toast('已分享');
                    } else {
                        self.$toast(err.code);
                    }
                });
            },
            saveposter(){
                var self = this;
                api.saveMediaToAlbum({
                    path: self.posterurl
                }, function(ret, err) {
                    if (ret && ret.status) {
                        self.$toast('已保存到相册，可从相册选择发给微信好友或朋友圈');
                    } else {
                        self.$toast('保存失败');
                    }
                });
            },
            getPoster(){
                var self = this;
                self.$util.http('poster','GET',{op:'user'},function(res){     
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        self.showposter = true;

                        if( self.dev == 'app' ){

                        }else if(self.dev == 'wx'){
                            Dialog.alert({message:'可长按图片转发给好友'});
                        }else if(self.dev == 'wap'){
                            Dialog.alert({message:'可截屏保存到手机'});
                        }

                        /*ImagePreview({
                            images : [res.data.url],
                            closeOnPopstate : true
                        });*/
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                var postdata = {
                    op : 'user',
                    zfid : query.zfid ? query.zfid : 0,
                }
	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					//self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
                        self.dataInfo = res.data.datainfo;
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
.user-top {
    margin-bottom: 9px;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/63750/30/14659/13999/5dbef21eE5c54c0a7/8e0c878ac82627b7.png) 0 0 no-repeat;
    background-size: 100% auto;
    padding: 0 15px;
}

.user-top .info {
    padding-top: 22px;
    color: #fff;
}

.user-top .info .name {
    font-size: 18px;
}

.user-top .info .rank {
    font-size: 14px;
}

.user-top .detial {
    position: relative;
    z-index: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-right: 80px;
    margin-top: 15px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.1);
}

.user-top .detial::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: -5px;
    left: 3px;
    right: 3px;
    height: 100%;
    border-radius: 3px;
    background-color: rgba(255,255,255,0.6);
}

.user-top .detial .avatar {
    position: absolute;
    top: -15px;
    right: 17px;
    width: 62px;
    height: 62px;
    border: 1px solid #fff;
    border-radius: 50%;
}

.user-top .detial .item {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 12px 0;
    font-size: 12px;
    text-align: center;
    line-height: 23px;
}

.user-top .detial .item .num {
    font-size: 18px;
    color: #f6854b;
}

.user-link {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding-top: 25px;
    padding-bottom: 25px;
}

.user-link .item {
    width: 103px;
    height: 80px;
    font-size: 13px;
    text-align: center;
    line-height: 16px;
    color: #fff;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    border-radius: 2px;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.1);
}

.user-link .item.bg01 {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/61286/34/14738/3020/5dbef17fE16f0d147/221b025b6a3eed7c.jpg);
}

.user-link .item.bg02 {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/90762/24/1388/2344/5dbef190E9ed4060f/ccfe83a2c1d2a42f.jpg);
}

.user-link .item.bg03 {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/58878/30/14762/2566/5dbef1a1E24d050b2/1b850bca6d66123d.jpg);
}

.user-link .item .icon {
    width: 32px;
    height: 32px;
    margin: 12px auto 5px;
}

.hr {
    height: 10px;
    background-color: #eee;
}
.user-parent{
    position: absolute;
    right: 0;
    top: 12.5px;
    z-index:1;
    background:#03a5f5;
    color:#fff;
    border-radius: 20px 0 0 20px;
    padding: 5px 10px;
    font-size: 14px;
}
.user-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 44px;
    font-size: 13px;
    line-height: 44px;
    color: #1e1e1e;
}

.user-list .item:last-child:after {
    visibility: hidden;
}

.user-list .item .lt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    align-items: center;
}

.user-list .item .icon {
    width: 20px;
    height: 20px;
    margin-right: 7.5px;
}

.user-list .item .tit {
    font-size: 14px;
}

.user-list .item .info {
    float: right;
    color: #969696;
}

.user-list .item .info.color {
    color: #f6854b;
}

.user-list .ric.item {
    position: relative;
    padding-right: 12px;
}

.user-list .ric.item:before {
    content: '\e60d';
    position: absolute;
    right: -2px;
    top: 0;
    font-size: 12px;
    font-family: 'iconfont';
    color: #acacac;
}
.showposter .showposter_item{
    width: 33.3%;
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
}
.showposter .showposter_item img{
    width: 30px;
    height: 30px;
}
.poster_img{
    position: absolute;
    top: -95vh;
    width: 70%;
    left: 15%;
    z-index: 2003;
}
.van-popup{
    overflow: initial;
}
</style>