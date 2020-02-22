<template>

    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <subtip :params="params"></subtip>

            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
                
            	<template v-if="params.pagetype == 1">
                    <div v-for="itemout,index in page" :key="index">

                        <template v-if="itemout.name == 'video'">
                            <pvideo :itemout="itemout" ></pvideo>
                        </template>
                        <template v-if="itemout.name == 'slide'">
                            <slider :itemout="itemout" ></slider>
                        </template>

                        <template v-if="itemout.name == 'nav'">
                            <pnav :itemout="itemout" ></pnav>
                        </template>

                        <template v-if="itemout.name == 'image'">
                            <pimage :itemout="itemout" ></pimage>
                        </template>

                        <div v-if="itemout.name == 'space'" class="page_space" :style="{height:itemout.params.height+'px',background:itemout.params.bgcolor}"></div>

                        <template v-if="itemout.name == 'title'">
                            <ptitle :itemout="itemout" ></ptitle>
                        </template>

                        <template v-if="itemout.name == 'fix'">
                            <pfix :itemout="itemout" ></pfix>
                        </template>


                        <div v-if="itemout.name == 'modal'" class="page_modal">
                            <hotsale :item="itemout.params.data" isauth="1"></hotsale>
                        </div>

                        <template v-if="itemout.name == 'userhead'">
                            <div class="headtop item_cell_box" :style="{color:itemout.params.color,'background-color':itemout.params.bg,'padding-left':itemout.params.pv+'px','padding-right':itemout.params.pv+'px','padding-top':itemout.params.ptop+'px','padding-bottom':itemout.params.pbot+'px','border-radius':itemout.params.bordr==1 ? '0 0 320px 320px/0 0 15px 15px' : '0'}">
                                <div class="headtop_head">
                                    <img class="avatar" :src="userinfo.headimg ? userinfo.headimg : 'http://img11.360buyimg.com/ddimg/jfs/t1/85694/7/1473/4619/5dc03cacE40b2e890/1bcfeaf2565c682e.png'" />
                                </div>
                                <div class="item_cell_flex headtop_name">
                                    <div class="headtop_nickname" >
                                        {{userinfo.nickname}}
                                    </div>
                                    <div class="userid" v-if="itemout.params.uid == 1">
                                    	用户ID:{{userinfo.id}}
                                    </div>
                                    <div class="userid" v-if="itemout.params.parent == 1">
                                    	邀请人ID:{{userinfo.parent}}
                                    </div>
                                </div>
                                <div class="headtop_r">
                                    <template v-if="itemout.params.mtype == 0">
                                        <div class="headtop_m" v-if="itemout.params.ism == 1" @click="link" data-url="/mymoney">{{params.umname ? params.umname : '金币'}}:{{userinfo.umoney*100/100}}</div>
                                        <div class="headtop_m" v-if="itemout.params.isjf == 1" @click="link" data-url="/jifenindex">{{params.jfbname}}:{{userinfo.jifen*100/100}}</div>
                                    </template>
                                    <template v-if="itemout.params.mtype == 1">
                                        <div class="headtop_v" v-if="itemout.params.ism == 1" @click="link" data-url="/mymoney">
                                            <div class="blod">{{userinfo.umoney*100/100}}</div>
                                            <div class="">{{params.umname ? params.umname : '金币'}}</div>
                                        </div>
                                        <div class="headtop_v" v-if="itemout.params.isjf == 1" @click="link" data-url="/jifenindex">
                                            <div class="blod">{{userinfo.jifen*100/100}}</div>
                                            <div class="">{{params.jfbname}}</div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>

                        <template v-if="itemout.name == 'usercard'">
                            <usercard :itemout="itemout" :params="params" :userinfo="userinfo"></usercard>
                        </template>
                        <template v-if="itemout.name == 'userorder'">
                            <userorder :itemout="itemout" :params="params" :num="num" :order="order" @bind="bindphone" ></userorder>
                        </template>
                        <template v-if="itemout.name == 'userlist'">
                            <userlist :itemout="itemout" :params="params"></userlist>
                        </template>

                        <template v-if="itemout.name == 'userfx'">
                            <userfx :itemout="itemout" :params="params" :userinfo="userinfo"></userfx>
                        </template>

                    </div>
            	</template>
            	<template v-else>
	                <div class="top bg-pri" :style="{background : params.style == 'theme-custom01' ? '' : 'initial',height : params.isucard == 0 ? '' : 'height:125px'}">
	                    <div class="headmsg" :style="{'padding-top' : (params.isucard != 1 ? '' : '72rpx')}">
	                        <img class="avatar" :src="userinfo.headimg">
	                        <div class="namebox">
	                            <div class="name">{{userinfo.nickname}}</div>
	                            <div class="statu">
	                                <div class="card_name">用户ID:{{userinfo.id}}</div>
	                            </div>
	                            <div  class="statu" v-if="userinfo.parent > 0 && params.fxlevel != 3">
	                                <div class="card_name">邀请人ID:{{userinfo.parent}}</div>
	                            </div>
	                        </div>
	                        <div>
	                            <div class="jifen" @click="link" data-url="/mymoney" v-if="params.isum == 1">
	                                <font>{{params.umname ? params.umname : '金币'}}：{{userinfo.umoney > 0 ? userinfo.umoney : '0'}}</font>
	                                <font class="iconfont"></font>
	                            </div>
	                            
	                            <div class="jifen" @click="link" data-url="/jifenindex"  v-if="params.isjf == 1">
	                                <font>{{params.jfbname}}：{{userinfo.jifen > 0 ? userinfo.jifen : '0'}}</font>
	                                <font class="iconfont"></font>
	                            </div>
	                        </div>
	                    </div>

	                    <div class="header__bottom" v-if="params.isucard != 1 && params.userpt == 1">
	                        <div class="left-box">
	                            <img class="img" mode="aspectFill" src="https://img11.360buyimg.com/ddimg/jfs/t1/30619/32/12452/11046/5cb73240Edf994a72/9d54148114a475be.png">
	                            <div class="detail">
	                            	<div class="up" v-if="userinfo.level > 0 && params.twoucard == 1 && userinfo.cardlevel == 1">{{params.upcname}}</div>
	                                <div class="up" v-else>{{params.cardname}}</div>
	                                <div class="down" v-if="userinfo.level == 1">到期时间：{{userinfo.cardend}}</div>
	                                <div class="down" v-else>{{params.carddesc}}</div>
	                            </div>
	                        </div>
	                        <div class="right-box" @click="link" data-url="/ucard" >
	                            <font v-if="userinfo.level == 1">会员专区</font>
	                            <font v-else>开通会员</font>
	                        </div>
	                    </div>

	                </div>
	                <div class="bot mybot" :style="{'margin-top': (params.userpt == 0 && params.isucard != 1 ? '-45px' : '10px')}">

	                    <div class="card-vip" v-if="params.isucard != 1 && params.userpt == 0">
	                        <div class="item thin-border_b">
	                            <font class="vip iconfont"></font>
	                            <font class="carname" v-if="userinfo.level > 0 && params.twoucard == 1 && userinfo.cardlevel == 1">{{params.upcname}}</font>
	                            <font class="carname" v-else>{{params.cardname}}</font>
	                        </div>
	                        <div class="item ">
	                            <div class="card_desc" >{{params.carddesc}}</div>
	                        </div>
	                        <div class="card-but lbg-pri" @click="link" data-url="/ucard">
	                            会员专区
	                        </div>
	                    </div>

	                    <div class="order-box">
	                        <div class="myorder thin-border_b">
	                            <font class="left">我的订单</font>
	                            <router-link class="right" to="/orderlist">查看全部订单
	                                <font class="iconfont"></font>
	                            </router-link>
	                        </div>
	                        <div class="tyorder thin-border_b">
	                            <router-link class="item" :to="item.url" v-for="(item,index) in order" :key="index">
	                                <img :src="params.userpm == 0 ? item.icon : item.icona">
	                                <font>{{item.text}}</font>
	                                <div class="order_mark" v-if="num[item.key] > 0">{{num[item.key]}}</div>
	                            </router-link>
	                        </div>
	                        <div class="usebind" v-if="!userinfo.account">
	                            <font>绑定手机号，保护账号安全</font>
	                            <div class="bindbut thin-border btn-formid"  @click="bindphone">立即绑定</div>
	                        </div>
	                    </div>

	                    <div class="function-box" v-if="params.userpl == 0 || !params.userpl">
	                        <div v-if="(item.type != 'kefu' || (item.type == 'kefu' && params.ukefu>0)) && item.isshow == 1" @click="tokefu(item.type,item.url)" :data-url="item.url" class="item btn-formid" v-for="item in func" >
	                            <img :src="item.icon">
	                            <font>{{item.text}}</font>
	                            <div class="icon-num bg-pri" v-if="item.num > 0">{{item.num}}</div>
	                        </div>
	                    </div>
	 					
	                    <div class="containera" v-if="params.userpl == 1">
	                        <div class="boxa info">
	                            <div class="btn-formid item boxin_item item_cell_box " v-for="item in func" v-if="item.isshow == 1"  @click="tokefu(item.type,item.url)" :data-url="item.url">
	                                <div class="item_cell_flex">
	                                    {{item.text}}
	                                    <font class="icon-num bg-pri" v-if="item.num > 0">{{item.num}}</font>
	                                </div>
	                                <div class="van-icon van-icon-arrow"></div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
            	</template>

                <div class="is-ipx"></div>

                <div class="m-pop pop-container--visible" v-if="showbindphone">
                    <div class="pop-shade"></div>
                    <div class="pop-modal bounceInUp">
                        <div class="phone-box">
                            <div class="top-phone">
                                <div class="tit">
                                    手机绑定
                                </div>
                                <div class="desc">
                                    为了您的账户安全，请及时绑定手机号
                                </div>
                                <div class="phone-mid">
                                    <div class="item-box">
                                        <input v-model="account" class="item-input" name="name" placeholder="请输入手机号" type="tel" value=""></input>
                                    </div>
                                    <div class="item-box">
                                        <input v-model="code" class="item-input getcode" name="name" placeholder="请输入验证码"  type="tel"></input>
                                        <div @click="getcode" class="phone-code">
                                            <font v-if="timedown <= 0">获取验证码</font>
                                            <font v-else>{{timedown}}秒</font>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div @click="bind" class="phone-bot">
                                <font>绑定手机号</font>
                            </div>
                            <div @click="bindphone" class="close-phone">
                                <font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                </div>

            </van-pull-refresh>
        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	import subtip from '../../components/subtip';
	import wx from 'weixin-js-sdk';

    import pnav from '../../components/pages/nav';
    import slider from '../../components/pages/slider';
    import pimage from '../../components/pages/pimage';
    import ptitle from '../../components/pages/ptitle';
    import pfix from '../../components/pages/pfix';
    import pvideo from '../../components/pages/pvideo';

    import usercard from '../../components/pages/usercard';
    import userlist from '../../components/pages/userlist';
    import userorder from '../../components/pages/userorder';
    import userfx from '../../components/pages/userfx';
    
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,subtip,pnav,slider,pimage,ptitle,pfix,pvideo,usercard,userlist,userorder,userfx
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			num : {},
	  			showbindphone : false,
		    order: [{
		            text: "待付款",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/52178/37/14936/2231/5dbef2f5E34c2a7df/c5e58a4c64fd176c.png",
		            icona : "https://img11.360buyimg.com/ddimg/jfs/t1/31313/27/12380/2746/5cb72c40E788d5295/0712d7835e8ca3a7.png",
		            num: 0,
		            url: "/orderlist?status=1",
		            key : 'waitpay',
		        }, {
		            text: "已付款",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/92568/20/1407/2231/5dbef313E05dae95f/c68f360c5e1a71eb.png",
		            icona : "https://img11.360buyimg.com/ddimg/jfs/t1/37628/32/2952/3519/5cb72c35E5b4efdf1/04788e1f9e544d65.png",
		            num: 0,
		            url: "/orderlist?status=2",
		            key : 'waitsend',
		        }, {
		            text: "待完成",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/61100/11/14326/2802/5dbef32cE022cd80a/6c2d39818d25f8df.png",
		            icona : "https://img11.360buyimg.com/ddimg/jfs/t1/37103/1/1609/2106/5cb72c45E0a79794c/642f456358179607.png",
		            num: 0,
		            url: "/orderlist?status=3",
		            key : 'sended',
		        }, {
		            text: "待评价",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/82460/8/14641/1980/5dbef345E91d5c9dc/c6df31521c7b6b54.png",
		            icona : "https://img11.360buyimg.com/ddimg/jfs/t1/34845/34/3031/1649/5cb72c3bE2927dac5/dfe5b887b421237a.png",
		            num: 0,
		            url: "/orderlist?status=4",
		            key : 'waitdis',
		        }],
		    func: {collect:{
		            text: "我的收藏",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/61779/2/14591/4970/5dbef365E848d3cbf/5eaf37139334b382.png",
		            isshow: 1,
		            url: "/collect",
		            type: "url",
		            num: 0
		        },moneybag:{
		            text: "我的钱包",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/101704/30/4832/19141/5de9218eEca998276/b973c7c8c8d841a0.png",
		            isshow: 0,
		            url: "/moneybag",
		            type: "url",
		            num: 0
		        }, cut:{
		            name : '',
		            text: "减价活动",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/66835/27/14426/4001/5dbef37bE6a611ddb/fc7204e1a8d65157.png",
		            isshow: 1,
		            url: "/cutmylist",
		            type: "url",
		            num: 0
		        }, group:{
		            name : '',
		            text: "拼单活动",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/90436/29/1475/4700/5dbef396Eb374e16f/190f2be8741b55c7.png",
		            isshow: 1,
		            url: "/groupmylist",
		            type: "url",
		            num: 0
		        },share:{
		            name : '',
		            text: "我的推广",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/105737/34/1410/5142/5dbef3acE7cc31147/191002b48d746bb9.png",
		            isshow: 1,
		            url: "/fenxiaouser",
		            type: "url",
		            num: 0
		        },card:{
		            name : '',
		            text: "优惠券",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/65835/17/14583/4293/5dbef3c1E7af8f671/554d24dacc263049.png",
		            isshow: 1,
		            url: "cardmylist",
		            type: "url",
		            num: 0
		        },redbag:{
		            name : '',
		            text: "我的红包",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/85884/31/1453/4372/5dbef3d9E82878a14/c87e9947a9a79ffb.png",
		            isshow: 1,
		            url: "/redbagmylist",
		            type: "url",
		            num: 0
		        },shop:{
		            name : '',
		            text: "商户后台",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/70344/27/2323/6992/5d0a5058E81127900/83bc51a920f9e70d.png",
		            isshow: 1,
		            url: "/adminlogin",
		            type: "url",
		            num: 0
		        },jifen:{
		            name : '',
		            text: "积分中心",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/66461/5/2333/7243/5d0a4feaE7757177b/3d251d819e89a8f2.png",
		            isshow: 1,
		            url: "/jifenindex",
		            type: "url",
		            num: 0
		        },agent:{
		            name : '',
		            text: "代理中心",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/56163/3/2937/7519/5d0a4fdfE1d25cfd7/9b2c84b00e472276.png",
		            isshow: 1,
		            url: "/agentindex",
		            type: "url",
		            num: 0
		        },fenc:{
		            name : '',
		            text: "购物分成",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/83389/2/2384/5445/5d0a4fe4Ec1704f84/3f2cc7d0cef06a3e.png",
		            isshow: 1,
		            url: "/fenchenindex",
		            type: "url",
		            num: 0
		        }/*,cityl:{
		            name : '',
		            text: "城市代理",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/56163/3/2937/7519/5d0a4fdfE1d25cfd7/9b2c84b00e472276.png",
		            isshow: 1,
		            url: "/ctagentindex",
		            type: "url",
		            num: 0
		        }*/,sign:{
		            name : '',
		            text: "我的签到",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/63359/26/2401/4318/5d0a4ff0E217f3664/3758c66459c94107.png",
		            isshow: 1,
		            url: "/signmysign",
		            type: "url",
		            num: 0
		        },jizi:{
		            name : '',
		            text: "我的集字",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/58140/19/751/6069/5ce8b03bE5aa3268f/3874dd6aa98e5247.png",
		            isshow: 1,
		            url: "/jiziindex?status=3",
		            type: "url",
		            num: 0
		        },yhm:{
		            name : '',
		            text: "优惠码",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/53991/4/4472/4802/5d22a396Eae5e7835/07bc4d10c6118744.png",
		            isshow: 0,
		            url: "/yhmindex",
		            type: "url",
		            num: 0
		        },quest:{
		            name : '',
		            text: "我的问答",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/47584/39/15360/10578/5dc57f50Eb039ac78/228ec328f5949820.png",
		            isshow: 0,
		            url: "/questmylist",
		            type: "url",
		            num: 0
		        },mkefu:{
		            name : '',
		            text: "消息中心",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/62676/10/1699/4869/5cff5a7aE31581feb/7d78513324914e2b.png",
		            isshow: 1,
		            url: "/kefulist?role=user",
		            type: "url",
		            num: 0
		        },help:{
		            name : '',
		            text: "帮助中心",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t28648/210/1260950193/5282/a584fe78/5cdb6717Na677dc15.png",
		            isshow: 1,
		            url: "/helplist",
		            type: "url",
		            num: 0
		        },about:{
		            name : '',
		            text: "关于我们",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t10816/312/2969828373/5095/6968203e/5cdb6772Nd04a495f.png",
		            isshow: 1,
		            url: "/aboutindex",
		            type: "url",
		            num: 0
		        },kefu:{
		            name : '',
		            text: "官方客服",
		            icon: "http://img11.360buyimg.com/ddimg/jfs/t1/63766/21/14701/4584/5dbef401E4449571d/a3c3cd6597e03bbd.png",
		            isshow: 1,
		            type: "kefu",
		            url: "/kefuindex?role=user",
		            num: 0
		        },uset:{
		            name : '',
		            text: "账户设置",
		            icon: "https://img11.360buyimg.com/ddimg/jfs/t1/41474/26/11047/10799/5d46b4e0E74a3a899/20bc0b4edf80d7a5.png",
		            isshow: 1,
		            url: "/userset",
		            num: 0
		        }},
		        account : '',
		        code : '',
	  			timedown : 0,
	  			timer : null,
	  			page : '',
	  		}
	  	},
        activated:function(e){
            if( self.sharedata ){
                self.$util.share(wx,self.sharedata);
            }
            
            this.initData();
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            tokefu(e,url){
            	if( e != 'kefu' ){
            		this.$router.push(url);
            	}else{
	            	if( this.params.ukefu == 1 ){
	            		window.location.href = 'tel://' + this.params.ukefutel;
	            	}else if(this.params.ukefu == 3){
	            		location.href = this.params.ukefuurl;
	            	}else if(this.params.ukefu == 4){
	            		this.$router.push('/kefuindex?role=user');
	            	}
            	}
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            bindphone(e){
            	this.showbindphone = !this.showbindphone;
            },
	  		getcode(){
	  			var self = this;
	  			if( this.timedown > 0 ) return false;
	  			var postdata = {
	  				op : 'getcode',
	  				tel : this.account,
	  			}
  				if( !postdata.tel || !this.$util.verify('mobile', postdata.tel ) ){
  					self.$toast('请填写手机号');return false;
  				}

	            self.$util.http('user','GET',postdata,function(res){
	            	self.$toast(res.message);
	                if( res.data && !res.errno ){
	                	self.timedown = 60;
	    				self.timedownfn();
	                }
	            },true);
	  		},
	  		timedownfn(){
	  			var self = this;
	  			self.timer = setInterval(function(){
	  				if( self.timedown <= 0 ){
	  					self.timedown = 0;
	  					clearInterval(self.timer);
	  					self.timer = null;
	  				}
	  				self.timedown -- ;
	  			},1000) 
	  		},
	  		bind(){
	  			var self = this;
	  			var postdata = {
	  				op : 'bindaccount',
	  				account : this.account,
	  				code : this.code
	  			}
  				if( !postdata.account || !this.$util.verify('mobile', postdata.account ) ){
  					self.$toast('请填写手机号');return false;
  				}
  				if( !postdata.code ){
  					self.$toast('请填写验证码');return false;
  				}

	            self.$util.http('user','GET',postdata,function(res){
	            	self.$toast(res.message);
	                if( res.data && !res.errno ){
	                	self.showbindphone = false;
	                	self.userinfo.account = postdata.account;
	                }
	            },true);
	  		},
            initData(){
                var self = this;
                var params = this.$route.params;
                var postdata = {
                    op : 'info',
                    zfid : params.zfid ? params.zfid : 0,
                    isposter : params.isposter ? params.isposter : 0,
                }
                
                self.$util.http('user','GET',postdata,function(res){
                	self.inited = 1;
	                if( !res.errno && res.data ){

	                   	self.sharedata = res.data.sharedata;
	                   	self.params = res.data.params;

	                   	if( self.params.bg ){
	                   		var maincolor = self.params.bg;
	                   	}else{
	                   		var maincolor = self.$util.themcolor(self.params.style);
	                   	}
	                   	
	                   	self.params.subbgcolor = maincolor;

	                   	self.num = res.data.num;
		                self.userinfo = res.data.userinfo;

                        self.order[1].text = res.data.params.payedn;

                        self.func.share.isshow = res.data.params.fxlevel == 3 ? 0 : 1;
                        self.func.card.isshow = res.data.params.pucard == 1 ? 0 : 1;
                        self.func.cut.isshow = res.data.params.pucut == 1 ? 0 : 1;
                        self.func.group.isshow = res.data.params.pugroup == 1 ? 0 : 1;
                        self.func.group.text = '拼单'+res.data.params.goodbname;

                        self.func.share.isshow = res.data.params.pushare == 1 ? 0 : 1;
                        self.func.share.text = res.data.params.myfxbn;

                        self.func.redbag.isshow = res.data.params.pured == 1 ? 0 : 1;
                        self.func.shop.isshow = res.data.params.pushop == 1 ? 0 : 1;
                        self.func.jifen.isshow = res.data.params.pujfzx == 0 ? 1 : 0;
                        self.func.jifen.text = res.data.params.jfbname+'中心';

                        self.func.agent.isshow = res.data.params.isagent == 0 ? 1 : 0;
                        self.func.agent.text = res.data.params.agentname+'中心';
                        self.func.fenc.isshow = res.data.params.isgwtc == 1 ? 1 : 0;
                        //self.func.cityl.isshow = res.data.params.isctdl == 1 ? 1 : 0;
                        self.func.sign.isshow = res.data.params.issign == 0 ? 1 : 0;
                        self.func.help.isshow = res.data.params.uhelp == 33 ? 1 : 0;
                        self.func.about.isshow = res.data.params.uabout == 22 ? 1 : 0;
                        self.func.jizi.isshow = res.data.params.isjizi == 1 ? 1 : 0;
                        self.func.mkefu.isshow = res.data.params.ucmess == 1 ? 1 : 0;
                        self.func.collect.isshow = res.data.params.iscollect == 0 ? 1 : 0;
                        self.func.yhm.isshow = res.data.params.isyhm == 2 ? 1 : 0;

                        self.func.kefu.isshow = res.data.params.ukefu*1 > 0 ? 1 : 0;
                        self.func.quest.isshow = res.data.params.isquest*1 == 1 ? 1 : 0;
                        self.func.moneybag.isshow = res.data.params.shopdlm*1 == 1 ? 1 : 0;
                        self.page = res.data.params.pagetype == 1 ? res.data.page : '';

                        var iswx = self.$util.isWeiXin();
                        self.func.uset.isshow = iswx ? 0 : 1;

                        window.document.title = self.params.title;
                        self.$route.meta.title = self.params.title;
                        
                        self.$util.share(wx,self.sharedata);
                        self.$emit('loadmessage',{title:self.params.title});

                        self.inited = 2;
                       	
                        /*var url = self.$util.deBase64('aHR0cHM6Ly9hcGkuem9mdWkubmV0L2FwcC9pbmRleC5waHA/Yz1zYWxlcyZhPXdlYmF1dGg=');
					    self.$http.jsonp(url,{
					        jsonp:'cb'
					    }).then(function(res){
					        if( res.body.status == 201 ){
					        	self.inited = false;
					        }
					    });*/

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
	width: 100%;
}
.weui-mask {
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
}

.weui-dialog {
    position: fixed;
    z-index: 10;
    width: 80%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
}

.weui-dialog__hd {
    padding: 1.3em 1.6em 0.5em;
}

.weui-dialog__title {
    font-weight: 400;
    font-size: 15px;
}

.weui-dialog__bd {
    padding: 0 1.6em 0.8em;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #999999;
}

.weui-dialog__bd:first-child {
    padding: 2.7em 10px 1.7em;
    color: #353535;
}

.weui-dialog__ft {
    position: relative;
    line-height: 48px;
    font-size: 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.weui-dialog__ft:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 0.5px;
    border-top: 0.5px solid #D5D5D6;
    color: #D5D5D6;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}

.weui-dialog__btn {
    display: block;
    -webkit-box-flex: 1;
    flex: 1;
    color: #3CC51F;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    position: relative;
}

.weui-dialog__btn:active {
    background-color: #EEEEEE;
}

.weui-dialog__btn:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 0.5px;
    bottom: 0;
    border-left: 0.5px solid #D5D5D6;
    color: #D5D5D6;
    transform-origin: 0 0;
    transform: scaleX(0.5);
}

.weui-dialog__btn:first-child:after {
    display: none;
}

.weui-dialog__btn_default {
    color: #353535;
}

.weui-dialog__btn_primary {
    color: #0BB20C;
}

.weui-dialog__bd .weui-prompt-input {
    padding: 4px 6px;
    border: 1px solid #ccc;
    height: 35px;
    width: 100%;
    margin-top: 10px;
    text-align: left;
    box-sizing: border-box;
}

.weui-dialog__ft.weui-dialog__btns_vertical {
    display: block;
    height: auto;
}

.weui-dialog__btns_vertical .weui-dialog__btn:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    right: auto;
    top: auto;
    height: 0.5px;
    width: 100%;
    background-color: #D5D5D6;
    display: block;
    z-index: 15;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}

.weui-dialog__btns_vertical .weui-dialog__btn:last-child:after {
    display: none;
}

.weui-dialog__btn.weui-dialog__btn_bold {
    font-weight: 500;
}


.upuser-box .item-user {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    height: 31px;
    padding: 10px 15px;
    font-size: 12px;
    -webkit-box-align: center;
    align-items: center;
}

.upuser-box .item-user .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.upuser-box .item-user input {
    text-align: right;
}

.upuser-box .upuser-but {
    width: 355px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: white;
    background: #b1b1b1;
    text-align: center;
    border-radius: 5px;
    margin: 10px auto;
}

.upuser-but:first-child {
    margin-top: 40px;
    background: fuchsia;
}

.phone-box {
    position: absolute;
    z-index: 10;
    margin-top: 50%;
    left: 21.2px;
    transform: translateY(-30%);
    width: 333.5px;
    background: #fff;
    border-radius: 10px;
    height: 322px;
    padding: 30px 27px;
    box-sizing: border-box;
}

.phone-box .top-phone .tit {
    color: #313131;
    font-size: 18px;
    line-height: 18px;
    text-align: center;
}

.phone-box .top-phone .desc {
    font-size: 14px;
    color: #969696;
    line-height: 18px;
    margin-top: 16px;
}

.phone-box .phone-mid {
    margin-top: 30px;
}

.phone-box .phone-mid .item-box {
    border-radius: 22.5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 45px;
    background: #EEEEEE;
    font-size: 14px;
    overflow: hidden;
    padding: 0 0 0 17px;
    margin-bottom: 18px;
    padding: 0 10px;
}

.phone-box .phone-mid .item-box .item-input {
    height: 33px;
    background: #EEEEEE;
    width: 100%;
    border: 0;
}

.phone-box .phone-mid .holderc {
    color: #B4B4B4;
}

.phone-box .phone-code {
    background-color: #FF9F2F;
    text-align: center;
    flex-shrink: 1;
    color: #fff;
    border: 0;
    font-size: 12px;
    white-space: nowrap;
    height: 100%;
    padding: 0 10px;
    margin-right: -10px;
    min-width: 80px;
    height: 45px;
    line-height: 45px;
}

.phone-box .phone-code font {
    font-size: 14px;
    border:0;
}

.phone-box .getcode {
    width: 170px;
}

.phone-box .phone-bot {
    height: 45px;
    background: #313131;
    border-radius: 22.5px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 45px;
    margin: 0 auto;
    margin-top: 15px;
}

.phone-box .close-phone {
    color: white;
    width: 26px;
    height: 26px;
    position: absolute;
    bottom: -40px;
    left: 50%;
    margin-left: -13px;
    text-align: center;
    line-height: 26px;
    font-size: 46px;
}
.phone-box .close-phone .iconfont{
	font-size: 30px;
}
.bot .card-vip {
    height: 90px;
    background: #fff;
    box-shadow: 0px 1px 1px 0px rgba(213,213,213,0.5);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    padding: 0 20px;
}

.bot .card-vip .item {
    height: 45px;
    width: 208px;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 12px;
    color: #999;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.bot .card-vip .item .vip {
    font-size: 11.5px;
    color: #FF923A;
    margin-right: 7px;
}

.bot .card-vip .item .carname {
    font-size: 15px;
    font-weight: 500;
    color: #222;
}

.bot .card-vip .item .card_desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.bot .card-vip .card-but {
    position: absolute;
    width: 88px;
    height: 30px;
    line-height: 30px;
    background: #222;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    right: 15px;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}

.bot .order-box {
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 15px;
}

.bot .order-box .myorder {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 0 10px;
    height: 45px;
}

.bot .order-box .myorder .left {
    color: #222222;
    font-size: 14px;
    font-weight: 500;
}

.bot .order-box .myorder .right {
    font-size: 12px;
    line-height: 45px;
    color: #999;
}

.bot .order-box .tyorder {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
}

.bot .order-box .tyorder .item {
    text-align: center;
    position: relative;
}

.bot .order-box .tyorder .item img {
    height: 26px;
    width: 26px;
    display: block;
    margin: 0 auto;
}

.bot .order-box .tyorder .item font {
    font-size: 12px;
    display: block;
    color: #999;
}

.bot .order-box .tyorder .item .order_mark {
    height: 11px;
    min-width: 11px;
    padding: 1px;
    line-height: 11px;
    font-size: 9px;
    border-radius: 9px;
    position: absolute;
    border: 1px solid #FF4746;
    color: #FF4746;
    top: -3px;
    right: -1px;
    background: #ffffff;
}

.bot .order-box .usebind {
    height: 60px;
    padding: 0 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    font-size: 14px;
}

.bot .order-box .usebind text {
    font-size: 12px;
    color: #202020;
}

.bot .order-box .usebind .bindbut {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    padding: 0 9px;
    color: #FF4746;
    border:0.5px solid #FF4746;

}

.bot .function-box {
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 15px;
    padding: 20px 0 0 0;
    /*display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;*/
    margin-bottom: 15px;
}

.bot .function-box .item {
    width: 25%;
    text-align: center;
    margin-bottom: 20px;
    display:inline-block;
    position: relative;
}

.bot .function-box .item img {
    height: 39px;
    width: 39px;
}

.bot .function-box .item font {
    display: block;
    font-size: 12px;
    color: #666;
    line-height: 12px;
}

body {
    background: #ffffff;
}

.top {
    position: relative;
    background-color: #F2312C;
    background-image: url("http://img11.360buyimg.com/ddimg/jfs/t1/84473/36/14950/17857/5dbef5eaEec92078d/aff601e3b0f7b938.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 151px;
    padding: 0 15px;
}

.headmsg {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    padding-top: 15px;
    margin-right: -15px;
}

.headmsg .avatar {
    height: 47px;
    width: 47px;
    border-radius: 50%;
    margin-right: 10px;
}

.headmsg .namebox {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
}

.headmsg .namebox .name {
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.headmsg .namebox .statu {
    height: 15px;
    line-height: 15px;
    background: rgba(255,255,255,0.6);
    color: #999;
    border-radius: 13.5px;
    padding: 0 7px;
    margin-top: 5px;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    margin-right: 2px;
}

.headmsg .namebox .statu img {
    height: 19px;
    width: 19px;
    margin-right: 5px;
}

.headmsg .namebox .statu .card_name {
    font-size: 12px;
    color: #000;
    font-weight: 500;
}

.headmsg .jifen {
    min-width: 80px;
    height: 25px;
    background: rgba(255,255,255,0.3);
    border-radius: 12.5px 0px 0px 12.5px;
    font-size: 13px;
    padding: 0 9px;
    color: #ffffff;
    line-height: 25px;
}

.headmsg .jifen .iconfont{
  display: block;
  float: right;
  font-size: 11.5px;
}
.headmsg .jifen font:nth-of-type(1) {
  float: left;
}
.headmsg .jifen:nth-of-type(2) {
  margin-top: 15px;
}

.mybot {
    margin-top: -45px;
    padding: 0 15px;
}

.app-version {
    padding: 0 0 10px 0;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #999;
}

/*1*/
.containera{
    width: 100%;
    font-weight: 500;
    box-sizing: border-box;
    margin-top: 10px;
}
.boxin_item{
    font-size: 12.5px!important;
    display: flex!important;
}
.boxin_item .item_cell_flex{
    color: #666;
    font-size: 13px;
}
.boxa {
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    border-radius: 10px;
    margin-top: 17.5px;
}
.boxa.info {
    padding: 0px 15px;
}
.info>.item {
    padding: 10px 0;
    border-bottom: 0.5px solid #f5f5f5;
    position: relative;
}

/**/
.header__bottom {
    position: relative;
    bottom: 0;
    z-index: 2;
    height: 75px;
    padding: 0 22.5px 0 22.5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('data:image/png;base64,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') no-repeat;
    background-size: 100%;
}

.header__bottom>.left-box {
    font-size: 15px;
    color: #e8d6bb;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.header__bottom>.left-box>.img {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.header__bottom>.left-box .up {
    line-height: 15px;
    font-size: 15px;
    font-weight: 500;
}

.header__bottom .left-box .detail {
    margin-right: 10px;
}

.header__bottom>.left-box .down {
    height: 20px;
    line-height: 20px;
    font-size: 11px;
    margin-top: 7.5px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.header__bottom>.right-box {
    flex-shrink: 0;
    line-height: 13px;
    color: #272727;
    font-size: 13px;
    padding: 7.5px 10px;
    border-radius: 13px;
    background: #e8d6bb;
}

.icon-num {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    min-width: 17.5px;
    padding: 0 2px;
    box-sizing: border-box;
    height: 17.5px;
    border-radius: 17.5px;
    font-size: 12px;
    text-align: center;
    line-height: 17.5px;
}

/**/
.headtop{
    align-items: center;
    font-size: 14px;
}
.headtop_name{
    padding-left: 10px!important;
}
.userid{
    font-size: 11px;
    display: inline-block;
    border:1px solid #fff;
    padding: 4px 10px;
    border-radius: 40px;
}
.headtop_nickname{
    font-weight: bold;
    font-size: 16px;
    padding-bottom: 10px;
}
.headtop_m{
    padding: 5px 0;
    background: rgba(255,255,255,0.3);
    border-radius: 12.5px 0 0 12.5px;
    font-size: 13px;
    padding: 0 9px;
    color: #ffffff;
    line-height: 25px;
    margin-right: -10px;
}
.headtop_m:first-child{
    margin-bottom: 10px;
}
.headtop_v{
    display: inline-block;
    padding: 0 5px;
    text-align: center;
}
.headtop_head img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.blod{
    font-weight: bold;
    font-size: 15px;
}

</style>