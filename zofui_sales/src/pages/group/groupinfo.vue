<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <subtip :params="params"></subtip>
            
            <div class="joingroup-top thin-border_b" @click="link" :data-url="'/goodinfo?id='+good.id">
                <div class="lt">
                    <div class="img image-box __100">
                        <img :src="good.thumb">
                    </div>
                </div>
                <div class="rt">
                    <div class="name">{{good.title}}</div>
                    <div class="btm">
                        <div class="price color-pri" v-if="good.show_price && good.show_price.gprice">¥{{good.show_price.gprice}}</div>
                        <div class="num" v-if="group.dismem > 0">
                        还差
                        <font class="color-pri">{{group.dismem}}</font>
                        人组团成功
                    </div>
                    </div>
                    <div class="endtag" v-if="group.status == 2">
                        <img src="http://img11.360buyimg.com/ddimg/jfs/t1/87922/25/1488/22890/5dbef1d5E2bfbe066/253ab90c5ec00eef.png">
                    </div>
                </div>
            </div>
            <div class="joingroup-member">
                <div class="content">
                    <div class="tip" v-if="group.status == 3">
                        - 离成团还差
                        <font class="color-pri">{{group.dismem}}</font>
                        人，
                        <template class="countdown" v-if="Countdown">
                            <template v-if="Countdown.day != 0">
                                <font>{{Countdown.day}}</font> 天 </template>
                            <font>{{Countdown.hour}}</font> :
                            <font>{{Countdown.minute}}</font> :
                            <font>{{Countdown.second}}</font>
                        </template>后结束 -
                    </div>
                    <div class="pic">
                        <div class="item" :class="!item ?'__none':''" v-if="showGroup || index < 15" v-for="(item,index) in grouplist" >
                            <img class="img" v-if="item && item.headimg" :src="item.headimg">
                            <div class="remark" v-if="index == 0">团长</div>
                        </div>
                    </div>
                    <div @click="showPicMore" class="pic_more" v-if="grouplist.length > 15">{{showGroup?'收起':'展示更多'}}</div>
                    <div v-if="group.status == 3 && group.ismy == 1" @click="shareit(true)" class="btn_time" >
                        邀请好友快来参团
                    </div>
                    <div class="tip" v-else-if="group.status == 1">
                        - 组团成功 -
                    </div>
                    <div class="tip" v-else>
                        - 组团失败，离成团还差
                        <font class="color-pri">{{group.dismem}}</font>
                        人 -
                    </div>
                </div>
            </div>
            <div class="joingroup-record">
                <div class="title">参团记录</div>
                <div class="lists">
                    <div class="item thin-border_b" v-for="(item,index) in grouplist" v-if="item">
                        <div class="pic">
                            <img :src="item.headimg">
                        </div>
                        <div class="info">
                            <div class="name">{{item.nickname}}
                                <font class="remark" v-if="index == 0">团长</font>
                            </div>
                            <div class="time">{{item.createtime}} {{index == 0 ? '开' : '参'}}团</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="joingroup-notice">
                <div class="title">参团须知</div>
                <img class="img" src="http://img11.360buyimg.com/ddimg/jfs/t1/83089/29/14428/15505/5dbef1edEad9fba25/3051268743aad219.png">
            </div>
                
            <div class="fix-box" v-if="group.ismy == 0">
                <div class="joingroup-btn" v-if="group.status == 3">
                    <div class="cancel" @click="link" :data-url="'/goodinfo?id='+good.id+'&from=group&groupid='+group.id">
                        {{params.goodbname}}详情
                    </div>
                    <div class="join" @click="joinit" >我要参团</div>
                </div>
                <div class="joingroup-btn end-btn" v-else>
                    <div class="join" @click="link" :data-url="'/goodinfo?id='+good.id+'&from=group'">查看{{params.goodbname}}</div>
                </div>
            </div>

            <div v-if="isshowsub">
                <div @click="hidepopsub" class="login-fullbtn __show " >
                </div>
                <div class="login-content tipstop-box " :class="isshowsub ? 'bounceInUp' : ''">   
                    <img :src="params.subqr.guanzhuqr" style="width:100%;" />
                    <div class="content">
                        <div>长按二维码关注公众号，便于查询订单和获取订单进度</div>
                    </div>
                    <div @click="hidepopsub" class="btn bg-pri">关闭</div>
                </div>
            </div>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup } from 'vant';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'groupinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            sharetip,subtip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                good : {},
                group : {},
                Countdown : {},
                grouplist : [],
                timer : null,
                showGroup : false,
                sharetip : false,
                isshowshare:false,
                needsub : false,
                isshowsub : false,
	  		}
	  	},
	  	created:function(e){
            this.$emit('loadmessage',false);

            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            shareit(bool){
                this.isshowshare = bool;
            },
            showPicMore(){
                this.showGroup = !this.showGroup
            },
            hidepopsub(){
                this.isshowsub = false;
            },
            endTime(){
                var self = this;
                clearInterval(self.timer);
                self.timer = false;

                self.timer = setInterval(function(){
                    var date = new Date();
                    var time = date.getTime();

                    if(self.group.status == 3){
                        var endTime = self.group.end + '000';
                        var lag = (endTime*1 - time);
                        if(lag > 0){
                            var second = Math.floor(lag/1000%60);     
                            var minite = Math.floor(lag/1000/60%60);
                            var hour = Math.floor(lag/1000/60/60%24);
                            var day = Math.floor(lag/1000/60/60/24);
                        }else{
                            var second = 0;
                            var minite = 0;
                            var hour = 0;
                            var day = 0;
                        }
                        self.Countdown = {day:day,hour:hour,minute:minite,second:second};
                    }
                },1000);
            },
            joinit(){
                var self = this;

                if( self.needsub == 1 ){
                    self.isshowsub = true;
                    return false;
                }

                // 0正常购买 1拼团 2参团
                if( self.good.isrule == 1 ){
                    var tourl = '/goodinfo?id='+self.good.id+'&from=group&groupid='+self.group.id;
                }else{
                    self.$util.setCache('zfssbuy',{'gid':this.good.id,type:2,groupid:self.group.id});
                    var tourl = '/orderconfirm';
                }
                self.$router.push(tourl);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('group','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	

                        var needGroupList = res.data.grouplist;
                        needGroupList.length += res.data.group.dismem*1;
                        needGroupList.length += res.data.group.falsemem*1;

                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;

                        self.Pagetheme = res.data.params.style;
                        self.good = res.data.good;
                        self.group = res.data.group;
                        self.userinfo = res.data.userinfo;
                        self.grouplist = needGroupList;
                        self.needsub = res.data.needsub;
                        
                        if(self.group.status == 3){
                            self.endTime();
                        }
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
@import "../../assets/css/iconfont.css";
@import "../../assets/css/login.css";
#main {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.joingroup-top {
    padding: 20px 15px 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #fff;
}

.joingroup-top .lt {
    margin-right: 15px;
}

.joingroup-top .lt .img {
    width: 70px;
}

.joingroup-top .rt {
    -webkit-box-flex: 1;
    flex: 1;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.joingroup-top .rt .name {
    font-size: 15px;
    color: #4a4a4a;
    font-weight: 500;
}

.joingroup-top .rt .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.joingroup-top .rt .btm .price {
    font-size: 15px;
    font-weight: 500;
}

.joingroup-top .rt .btm .num {
    font-size: 12px;
    color: #4a4a4a;
}

.joingroup-top .rt .endtag {
    position: absolute;
    top: 0;
    right: 0;
    width: 79px;
    height: 79px;
}

.joingroup-top .rt .endtag img {
    display: block;
    width: 100%;
    height: 100%;
}

.joingroup-member {
    padding: 20px 15px 5px;
    background-color: #fff;
}

.joingroup-member .content {
    padding: 20px 15px 25px;
    border-radius: 5px;
    box-shadow: 0.5px 0px 8px rgba(14,5,10,0.13);
}

.joingroup-member .content .pic {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 15px;
}

.joingroup-member .content .pic .item {
    position: relative;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 35px;
    border-radius: 50%;
    border: 1px solid #ffc122;
    margin: 0 10px 10px 0;
    background-color: #eee;
}

.joingroup-member .content .pic .item .img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.joingroup-member .content .pic .item .remark {
    position: absolute;
    top: 0;
    left: -20%;
    background-color: #ffc122;
    font-size: 9px;
    line-height: 15px;
    color: #3d3d3d;
    padding: 0 4px;
}

.joingroup-member .content .pic .item.__none {
    border-color: #d6d6d6;
}

.joingroup-member .content .pic .item.__none:before {
    content: '\e622';
    font-family: 'iconfont';
    font-size: 20px;
    color: #BABABA;
}

.joingroup-member .content .pic_more {
    padding: 5px 0;
    font-size: 14px;
    text-align: center;
    color: #999;
}

.joingroup-member .content .tip {
    margin-top: 5px;
    font-size: 12px;
    text-align: center;
    line-height: 17px;
    color: #3d3d3d;
}

.joingroup-member .content .btn_time {
    text-align: center;
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    color: #3d3d3d;
    background-color: #fdc90b;
    border-radius: 3px;
    margin-top: 15px;
}

.joingroup-member .content .btn_countdown {
    text-align: center;
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    color: #3d3d3d;
    border-radius: 3px;
    margin-top: 15px;
}

.joingroup-record {
    padding: 15px 15px 0;
    background-color: #fff;
}

.joingroup-record .title {
    color: #3d3d3d;
    font-size: 17px;
    font-weight: 500;
}

.joingroup-record .lists .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 17.5px 0;
}

.joingroup-record .lists .item .pic {
    width: 37.5px;
    height: 37.5px;
    margin-right: 10px;
}

.joingroup-record .lists .item .pic img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.joingroup-record .lists .item .info .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: #333;
}

.joingroup-record .lists .item .info .name .remark {
    display: inline-block;
    vertical-align: top;
    padding: 0 4px;
    margin: 3px 0 0 5px;
    background-color: #ffc122;
    font-size: 9px;
    line-height: 13px;
    color: #3d3d3d;
}

.joingroup-record .lists .item .info .time {
    font-size: 12px;
    color: #606060;
    margin-top: 3px;
}

.joingroup-notice {
    padding: 15px;
    margin-top: 13px;
    background-color: #fff;
}

.joingroup-notice .title {
    font-size: 17px;
    color: #222;
    font-weight: 500;
}

.joingroup-notice .img {
    display: block;
    width: 100%;
    height: 26.5px;
    margin-top: 19px;
}

.joingroup-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    display: flex;
}
.fix-box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
.joingroup-btn .cancel {
    display: inline-block;
    width: 40%;
    height: 100%;
    background-color: #222;
}

.joingroup-btn .join {
    display: inline-block;
    width: 60%;
    height: 100%;
    background-color: #fb2d37;
}
.end-btn .join {
    width: 100%;
}
</style>