<template>
	
    <div :class="params.style" id="main">
	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
    <div id="content" v-if="inited == 2">

        <subtip :params="params"></subtip>
        <van-pull-refresh v-model="isrefresh" :disabled="disrefresh" :head-height="80" @refresh="onRefresh" success-text="已刷新">

            <template v-if="params.ucardtype == 0">
            <div class="card-head" :style="{'background-image': 'url('+cardinfo.cardbg+')'}">
                <div class="top">
                    <div class="top_avatar">
                        <img :src="userinfo.headimg" />
                    </div>
                    <div class="top_info">
                        <div class="info">
                            <div class="name">{{userinfo.nickname}}</div>
                            <template v-if="params.pencardt == 0">
                                <div class="vip thin-border" v-if="userinfo.level == 1">{{params.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}会员</div>
                                <div class="card" v-else>
                                    {{cardinfo.mcardprice <= 0 ? '' : '¥'}}
                                    <font class="price">{{cardinfo.mcardprice <= 0 ? '' : cardinfo.mcardprice}}</font>
                                </div>
                            </template>
                        </div>
                        <div class="info">
                            <div class="status" v-if="userinfo.level == 0">还未加入{{cardinfo.cardname}}</div>
                            <div class="status" v-if="userinfo.level == 1">{{userinfo.endtime}}到期</div>
                            <div class="status" v-if="userinfo.level == 2">{{params.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}已过期</div>
                        </div>
                    </div>
                </div>
                <div class="btm" style="position:relative;">
                    <div class="m-open-tag" v-if="params.fxocard == 1 && params.fxojoin == 0 && userinfo.isfxcard == 0" @click="link" :data-url="params.fxotp == 1 ? 'ucardapply' : ''" >邀好友赠卡，还差{{userinfo.down}}人</div>
                    <div class="btm-novip" >
                        <div class="novip_info">
                            <div>
                                <font class="num">{{cardinfo.count_card || 100}}</font> 人已开卡
                            </div>
                            <div class="tips">{{params.carddesc ? params.carddesc : '享受会员权益，给你更高优惠'}}</div>
                        </div>
                        <router-link class="novip_btn lbg-pri" to="/buycard">立即{{userinfo.level > 0 ? '续期':'开通'}}</router-link>
                    </div>
                </div>
            </div>
            <div class="card-getway">
                <div @click="bindCode" class="item thin-border_b" v-if="(userinfo.level == 0 || userinfo.level == 2) && cardinfo.iscodecard == 0">
                    <div class="label">{{cardinfo.cardname}}激活</div>
                    <div class="link item_cell_flex tright" url="">已有激活码的点这里</div>
                    <i class="van-icon van-icon-arrow"></i>
                </div>

                <router-link class="item thin-border_b" to="/buycard">
                    <div class="label">{{ userinfo.level > 0 && cardinfo.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}{{userinfo.level > 0 ? '续期':'开通'}}</div>
                    <div class="link item_cell_flex tright">点击立即{{userinfo.level > 0 ? '续期':'开通'}}
                    </div>
                    <i class="van-icon van-icon-arrow"></i>
                </router-link>
            </div>

            <div class="ucard_give" v-if="allcard.length > 0 && userinfo.level <= 0 && params.pencardt == 0">
                <div class="ucard_title">{{cardinfo.cardname}}专属礼包</div>
                <div class="ucard_list">
                    
                    <div class="ucard_item item_cell_box" v-for="item in allcard" wx:key="index">
                        <div class="ucard_gicon">送</div>
                        <div class="item_cell_flex ucard_name">{{item.showname}}</div>
                        <div class="ucard_fee color-pri">¥ {{item.fee}}</div>
                    </div>
                    
                </div>
                <div class="ucard_bot">
                    <router-link  to="/buycard" class="ucard_botbtn border-pri color-pri">立即开通</router-link>
                </div>
            </div>


            <div class="card-section" v-if="cardinfo.cardfuli">
                <div class="card-benefit">
                    <div class="content" id="cardimg" v-if="!showCardBenefit && cardinfo.cardfuli">
                        <img mode="widthFix" :src="cardinfo.cardfuli" />
                    </div>
                </div>
            </div>
            
            <div class="present_da" >
                <div class="present_tit">
                    <div @click="Nonmembers(0)" class="present_tit_left" data-index="0" v-if="params.pencardt == 1">
                        <div class="present_tit_left_top">
                            <img class="present_tit_left_top_img1" src="https://img11.360buyimg.com/ddimg/jfs/t1/30806/15/13553/4594/5cbb2c7fE21219a74/d6db2ec817ef608d.png" v-if="membersnum == 0">
                            <img class="present_tit_left_top_img2" src="https://img11.360buyimg.com/ddimg/jfs/t1/36090/26/4243/2119/5cbaea18E5004533b/fd538e49fe971908.png" v-if="membersnum != 0">
                        </div>
                        <!-- <div class="present_tit_info">购买礼包赠{{cardinfo.cardname}}</div> -->
                    </div>
                    <div @click="Nonmembers(1)" class="present_tit_right" data-index="1" fwqfq="32">
                        <div class="present_tit_right_top">
                            <img class="present_tit_right_top_img1" src="https://img11.360buyimg.com/ddimg/jfs/t1/30762/10/13624/2068/5cbaea1dEac317c28/edeb8881c53e795d.png" v-if="membersnum != 1">
                            <img class="present_tit_right_top_img2" src="https://img11.360buyimg.com/ddimg/jfs/t1/35845/40/2011/4544/5cbb2c3fE5f5accc8/49d48b00fa70b496.png" v-if="membersnum == 1">
                        </div>
                        <!-- <div class="present_tit_info">{{cardinfo.cardname}}会员可购买</div> -->
                    </div>
                    <div @click="Nonmembers(2)" class="present_tit_right" data-index="2">
                        <div class="present_tit_right_top">
                            <img class="present_tit_right_top_img1" src="https://img11.360buyimg.com/ddimg/jfs/t1/36163/6/4198/2181/5cbaea24E9e5a86ad/5339741fab981510.png" v-if="membersnum != 2">
                            <img class="present_tit_right_top_img2" src="https://img11.360buyimg.com/ddimg/jfs/t1/36653/12/2884/4633/5cbb2c34Eb48fce9e/0f213e30f32d9f8b.png" v-if="membersnum ==2">
                        </div>
                        <!-- <div class="present_tit_info">{{cardinfo.cardname}}会员可领取</div> -->
                    </div>
                </div>
                
                <van-list class="diy-list" v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <div class="present" v-if="membersnum == 0">
                        <router-link :to="'/buycard?pid='+item.id" v-for="item in datalist" :key="item.id">
                        <div class="present_kuai" >
                            <div class="present_kuai_two">
                                <div class="gift_top">
                                    <div class="gift_top_l" :style="{'background-image':'url('+item.img+')'}"></div>
                                    <div class="gift_top_r">
                                        <div class="gift_top_r_tit">{{item.name}}</div>
                                        <div class="gift_top_r_pri color-pri" v-if="item.value > 0">价值：<font>{{item.value}}元</font>
                                        </div>
                                    </div>
                                </div>
                                <div class="gift_down">
                                    <div class="gift_down_l">
                                        <div class="gift_down_l_song">送</div>
                                        <div class="gift_down_l_tit" v-if="item.cardtype == 1 && cardinfo.twoucard == 1">{{cardinfo.upcname}}会员</div>
                                        <div class="gift_down_l_tit" v-else>{{cardinfo.cardname}}会员</div>
                                    </div>
                                    <div class="gift_down_r">{{item.usertime*100/100}}个月</div>
                                </div>
                                <div class="gift_down" v-for="inn in item.list" >
                                    <div class="gift_down_l">
                                        <div class="gift_down_l_song">送</div>
                                        <div class="gift_down_l_tit">{{inn.name}}</div>
                                    </div>
                                    <div class="gift_down_r color-pri">{{inn.price}}元</div>
                                </div>
                            </div>
                            <div class="present_kuai_thr color-pri border-pri" bindtap="navigateto" data-url="/zofui_sales/ucard/buycard?pid=item.id">购买￥{{item.price}}</div>
                        </div>
                        </router-link>
                    </div>
                    
                    <div v-if="membersnum == 1">
                        <router-link  :to="item.appurl" v-for="item in datalist" :key="item.id">
                            <div class="con_kuai">
                            <div class="con_kuai_paiming " :class="{'con_kuai_yxg':item.vip_auth==1,'con_kuai_zhuanshu':item.vip_auth==2}"></div>
                            <div class="con_kuai_l" :style="{'background-image':'url('+item.thumbh+')'}"></div>
                            <div class="con_kuai_r">
                                <div class="name">
                                    <div class="storename">{{item.name}}</div>
                                    <!-- <div class="juli">{{item.area_name==''?'':item.area_name+' |'}} {{item.distance}}</div> -->
                                </div>
                                <div class="con_kuai_r_tit">
                                    <div class="leibie lbg-pri" v-if="item.tag">
                                        {{item.tag}}
                                    </div>
                                    {{item.title}}
                                </div>
                                <div class="con_kuai_r_down">
                                    <div class="con_kuai_r_price">
                                        <div class="con_kuai_r_price_l">
                                            <div class="pricetext">
                                                <font class="big">{{item.show_price}}</font>
                                                <font> 元</font>
                                            </div>
                                            <div class="vipprice" v-if="item.isuser >= 1">
                                                <div class="icon_vip lbg-pri" v-if="item.isuser == 2 && params.twoucard == 1">{{cardinfo.upcname}}专享</div>
                                                <div class="icon_vip lbg-pri" v-else>{{cardinfo.cardname}}{{params.twoucard == 1 ? ','+cardinfo.upcname : ''}}专享</div>
                                            </div>
                                            <div class="vipprice" v-else-if="item.save_price > 0">
                                                <div class="icon_vip lbg-pri">{{cardinfo.cardname}}{{params.twoucard == 1 ? ','+cardinfo.upcname : ''}}优惠{{item.save_price*100/100}}元</div>
                                            </div>
                                        </div>
                                        <div class="con_kuai_r_price_r lbg-pri">购买</div>
                                    </div>
                                    <div class="con_kuai_r_an">
                                        <div class="con_kuai_r_an_text3" v-if="item.oldprice*1 > 0">原价{{item.oldprice}}</div>
                                        <div class="con_kuai_r_an_r">{{item.saled}}人购买</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </router-link>
                    </div>

                    <div v-if="membersnum == 2 && datalist.length > 0" class="cardlist">
                        <router-link class="coupon" :to="'/cardinfo?id='+item.id" v-for="item in datalist" :key="item.id">
                            <div class="coupon_text">
                                <div class="coupon_title"><font>¥</font> {{item.fee}}</div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >{{item.name}}</font>
                                </div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >{{item.start}} - {{item.end}}</font>
                                </div>
                            </div>
                            <div class="btn_div get_btn" >
                                查看
                            </div>
                        </router-link>
                    </div>
                </van-list>
                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                    <div>— 暂时还没有数据 —</div>
                </div>
            </div>
            </template>

            <div class="member" v-if="params.ucardtype == 1" :style="{'background-color':maincolor}">
                <div class="member-head">
                    <div class="m-title">{{params.ptname}}{{params.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}</div>
                    <div class="m-title-sub">{{cardinfo.count_card || 100}}人已加入会员权益</div>
                    <div class="m-head-contain" :style="{'background-image': 'url(' + cardinfo.cardbg ? cardinfo.cardbg : 'http://q7.img.aiyichuan.com/urm_huodong/20190606/1559802058347.jpg'+')'}">
                        <div class="m-not" >
                            <div class="m-not-title">
                                <div class="m-not-title-1">{{params.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}</div>
                                <div class="m-not-title-2">{{params.carddesc ? params.carddesc : '加入会员 · 马上省钱'}}</div>
                            </div>
                            <div style="position: relative;">
                                <div class="m-open-tag" v-if="params.fxocard == 1  && params.fxojoin == 0 && userinfo.isfxcard == 0" @click="link" :data-url="params.fxotp == 1 ? 'ucardapply' : ''">邀好友赠卡，还差{{userinfo.down}}人</div>
                                <div class="m-open thin-border" @click="link" data-url="buycard" >
                                    <div class="m-price" v-if="params.pencardt == 0">
                                        ¥
                                        <font class="num">{{cardinfo.mcardprice <= 0 ? '0' : cardinfo.mcardprice}}</font>
                                    </div>
                                    <div class="m-open-btn">
                                        <div class="text">立即{{userinfo.level > 0 ? '续期':'开通'}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="m-info">
                            <img mode="aspectFill" :src="userinfo.headimg">
                            <div class="m-info-wrap">
                                <div class="m-name">{{userinfo.nickname}}
                                    <font class="iconfont icon-huangguan" v-if="userinfo.level == 1"></font>
                                </div>
                                <div class="m-message" v-if="userinfo.level == 0">还未加入{{cardinfo.cardname}}</div>
                                <div class="m-message" v-if="userinfo.level == 1">到期时间：{{userinfo.endtime}}</div>
                                <div class="m-message" v-if="userinfo.level == 2">{{params.twoucard == 1 && userinfo.cardlevel == 1 ? cardinfo.upcname : cardinfo.cardname}}已过期</div>
                            </div>
                        </div>
                    </div>
                    <img class="member-head-line" src="https://img11.360buyimg.com/ddimg/jfs/t1/57648/37/8448/1032/5d5d0ac1Efce522b2/38b7da20b06f6667.png">
                </div>
                <div class="member-body">
                    <div class="ac-code" @click="bindCode" v-if="(userinfo.level == 0 || userinfo.level == 2) && cardinfo.iscodecard == 0">
                        <div>若有激活码，请点击立即激活</div>
                        <div class="ac-code-btn">立即激活</div>
                    </div>
                    <div class="auth">
                        <img class="auth-pic" mode="widthFix" :src="cardinfo.cardfuli ? cardinfo.cardfuli : 'https://img11.360buyimg.com/ddimg/jfs/t1/44676/13/8385/170873/5d5e1870E13e01f9e/1ef8e6c3e1ea76f6.png'" >
                        <div v-if="userinfo.level != 1" class="auth-open lbg-pri" @click="link" data-url="buycard" >立即开通</div>
                    </div>

                    <div class="goods" v-if="prizelist.length > 0">
                        <div class="title-wrap">
                            <font class="title-tag">特权</font>
                            <font class="title-txt"> 开通会员专享礼包</font>
                        </div>
                        <div class="subtitle">开通会员获赠礼包</div>
                        <div class="goods-contain">
                            <div scrollX class="goods-scroll" style="margin: -20rpx 0;">
                                <div class="goods-scrollin" >
                                    <div class="goods-wrap" @click="link" :data-url="'buycard?pid='+item.id" v-for="(item,index) in prizelist" :key="index">
                                        <img class="goods-pic" :src="item.img">
                                        <div class="goods-tag">特权礼包</div>
                                        <div class="goods-info">
                                            <div class="goods-name">{{item.name}}</div>
                                            <div class="goods-foot">
                                                <div class="goods-price">
                                                    <div class="goods-price-sub">
                                                        <font>价值￥{{item.value}}</font>
                                                    </div>
                                                    <div class="goods-sale">￥{{item.price}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="red-bag" v-if="ucardcoup.length > 0">
                        <div class="title-wrap">
                            <font class="title-tag">特权</font>
                            <font class="title-txt">会员专属红包</font>
                        </div>
                        <div class="redbag-list">
                            <div class="item" @click="link" :data-url="'cardinfo?id='+item.id" v-for="(item,index) in ucardcoup" :key="index">
                                <div class="bd">
                                    <img class="_bg" src="https://img11.360buyimg.com/ddimg/jfs/t1/48155/30/8490/1836/5d5d54e3E1a98dfd7/c88ddfe603ac7c79.png">
                                    <div class="_lt">
                                        <div class="bd_price">
                                            <font>¥</font>
                                            <font class="_d">{{item.dollar}}</font>
                                            <font class="_c">.{{item.cent}}</font>
                                        </div>
                                    </div>
                                    <div class="_rt">
                                        <div class="bd_name">{{item.name}}</div>
                                    </div>
                                </div>
                                <div class="fd">
                                    <div class="fd_count">
                                        <font>可领</font>
                                        <div>
                                            <font class="_c">{{item.maxtake > 0 ? item.maxtake : 1}}</font>次
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <van-list class="diy-list" v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <div class="goods" >
                        <div class="title-wrap">
                            <font class="title-tag">特权</font>
                            <font class="title-txt"> 开通会员专享商品</font>
                        </div>
                        <div class="goods-contain">
                            <div class="con_kuai" @click="link" :data-url="item.appurl" formType="submit" v-for="(item,index) in datalist" :key="index">
                                <div class="con_kuai_paiming" :class="{'con_kuai_yxg':item.vip_auth==1,'con_kuai_zhuanshu':item.vip_auth==2}"></div>
                                <div class="con_kuai_l" :style="{'background-image':'url('+item.thumbh+')'}"></div>
                                <div class="con_kuai_r">
                                    <div class="name">
                                        <div class="storename">{{item.name}}</div>
                                    </div>
                                    <div class="con_kuai_r_tit">
                                        <div class="leibie lbg-pri" v-if="item.tag">
                                            {{item.tag}}
                                        </div>
                                        {{item.title}}
                                    </div>
                                    <div class="con_kuai_r_down">
                                        <div class="con_kuai_r_price">
                                            <div class="con_kuai_r_price_l">
                                                <div class="pricetext">
                                                    <font class="big">{{item.show_price}}</font>
                                                    <font> 元</font>
                                                </div>
                                                <div class="vipprice" v-if="item.isuser >= 1">
                                                    <div class="icon_vip lbg-pri" v-if="item.isuser == 2 && params.twoucard == 1">{{cardinfo.upcname}}专享</div>
                                                    <div class="icon_vip lbg-pri" v-else>{{cardinfo.cardname}}{{params.twoucard == 1 ? ','+cardinfo.upcname : ''}}专享</div>
                                                </div>
                                                <div class="vipprice" v-else-if="item.save_price > 0">
                                                    <div class="icon_vip lbg-pri">{{cardinfo.cardname}}{{params.twoucard == 1 ? ','+cardinfo.upcname : ''}}优惠{{item.save_price*100/100}}元</div>
                                                </div>
                                            </div>
                                            <div class="con_kuai_r_price_r lbg-pri">购买</div>
                                        </div>
                                        <div class="con_kuai_r_an">
                                            <div class="con_kuai_r_an_text3" v-if="item.oldprice*1 > 0">原价{{item.oldprice}}</div>
                                            <div class="con_kuai_r_an_r">{{item.saled}}人购买</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="list-none" v-if="datalist.length <= 0 && !page.waitf">
                                <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                                <div>— 暂时还没有数据 —</div>
                            </div>

                        </div>
                    </div>
                    </van-list>
                </div>
            </div>
            </van-pull-refresh>
        </div>

        <div class="module-popup" v-if="cvisible">
            <div class="popup-mask popup--visible"></div>
            <div class="popup-dialog popup--visible">
                <form bindreset="$FormModel$resetFn" >
                    <div class="popup-dialog__hd" >
                        <div class="popup-dialog__title">激活卡</div>
                    </div>
                    <div class="popup-dialog__bd">
                        <div class="popup-dialog__content" ></div>
                        <input class="popup-input popup-prompt-input" v-model="code" :placeholder="item.placeholder"  @input="incode" v-for="item in prompt" />
                    </div>
                    <div class="popup-dialog__ft thin-border_t" v-if="buttons.length">
                        <div class="popup-dialog__btn popup-dialog__btn_default thin-border_l" :class="{'color-pri':item.type=='primary'}" @click="codeclick(item.fn)"  v-for="item in buttons" >{{item.text}}</div>
                    </div>
                </form>
            </div>
        </div>

    </div>

</template>

<script type="text/javascript">
	import { Loading,Swipe,SwipeItem,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';

	export default {
	  	components: {
	    	[Swipe.name] : Swipe,
	    	[SwipeItem.name] : SwipeItem,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,subtip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			prompt : [{placeholder:'输入激活码',response:'code'}],
	  			sharedata :Object,
                membersnum : 0,
                showCardBenefit : false,
	  			allcard : [],
                cvisible : false,
                code : '',
	  			buttons : [{
                    type: "default",
                    text: "取消",
                    fn: "cancel"
                }, {
                    type: "primary",
                    text: "确定",
                    fn: "confirm"
                }],
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'ucard',
	  					op : 'ucardprize',
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                prizelist : [],
                maincolor : '',
                ucardcoup : [],
	  		}
	  	},
        activated:function(e){
            if( self.sharedata ){
                self.$util.share(wx,self.sharedata);
            }

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		this.$emit('loadmessage',false);           
	  	},
	  	methods: {
            scrolltop(e){
                this.disrefresh = e <= 0 ? false : true;
            },
            onRefresh(){
                this.datalist = [];
                this.isbot = false;
                this.membersnum = 0;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            incode(e){
                this.code = e.currentTarget.value;
            },
            codeclick(type){
                var self = this;
                if( type == 'confirm' ){
                    self.$util.http('ucard','GET',{op:'passbycode',code:self.code},function(res){
                        if( res && !res.errno ){
                            self.userinfo.level = 1;
                            self.userinfo.endtime = res.data.cardend;
                            self.cvisible = false;
                        }else{
                            self.$toast(res.message);
                        }
                        
                    },true)
                }else{
                    this.cvisible = false;
                }
            },
            bindCode(){
                this.cvisible = true;
            },
            Nonmembers(index){
                var self = this;
                if( index == self.membersnum ) return false;
                this.datalist = [];
                this.isbot = false;
                this.membersnum = index;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.doo = index == 0 ? 'ucard' : ( index == 1 ? 'ucard' : 'card' );
                this.page.pdata.op = index == 0 ? 'ucardprize' : ( index == 1 ? 'ulist' : 'alllist' );
                self.onLoad();
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                    type : 1,
                }
                self.$util.http('ucard','GET',postdata,function(res){
					self.inited = 1;
                    if( res && !res.errno ){
                        
                        self.allcard = res.data.allcard;
                        self.cardinfo = res.data.cardinfo;
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
                        self.params = res.data.params;
                        self.ucardcoup = res.data.ucardcoup ? res.data.ucardcoup : [];
                        self.prizelist = res.data.params.pencardt == 1 ? res.data.prizelist : [];
                        
                        window.document.title = self.params.title;
                        self.$route.meta.title = self.params.title;
                        
                        self.$util.share(wx,self.sharedata);
                        self.$emit('loadmessage',{title:self.params.title});
                             
                        self.page.pdata.op = res.data.params.pencardt == 1 && res.data.params.ucardtype == 0 ? 'ucardprize' : 'ulist';
                        self.membersnum = res.data.params.pencardt == 1 ? 0 : 1;

                        var maincolor = self.$util.themcolor(self.params.style);
                        self.maincolor = maincolor;

                        self.inited = 2;
                        self.onLoad();
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
	  		}
	  	}
  	}
</script>
<style type="text/css" scoped>
#main{
    min-height: 100vh;
    background-color: #fff;
}
.van-icon{
    line-height: 21.5px;
}
.recommend-list {
    padding: 0 20px;
    margin-bottom: -18px;
}
.recommend-list .item {
    padding-bottom: 18px;
    margin-bottom: 18px;
}

.recommend-list .inner {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.recommend-list .inner .lt {
    width: 115px;
    margin-right: 12px;
}

.recommend-list .inner .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.recommend-list .inner .rt-btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.recommend-list .lt_pic {
    border-radius: 2px;
}

.recommend-list .rt_tit {
    height: 2.8em;
    font-size: 15px;
    line-height: 1.4em;
    color: #222;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.recommend-list .rt_price {
    -webkit-box-align: center;
    align-items: center;
}

.recommend-list .rt_price .tag {
    padding: 0 5px;
    margin-left: 5px;
    font-size: 10px;
    line-height: 16px;
    border-color: #fc9127;
    color: #fc9127;
    border-radius: 6px;
}

.recommend-list .rt_sale {
    font-size: 12px;
    line-height: 17px;
    color: #999;
}

.recommend-list .rt_btn {
    min-width: 70px;
    height: 29px;
    padding: 0 9px;
    border-color: #222;
    margin: 0;
    font-size: 13px;
    text-align: center;
    line-height: 29px;
    color: #222;
    border-radius: 3px;
    box-sizing: border-box;
}

.recommend-list .rt_btn:after {
    border-radius: 6px;
}


.benefit-list {
    position: relative;
    margin-bottom: 10px;
}

.benefit-list .list {
    overflow: hidden;
    position: relative;
    height: 170px;
    margin: -10px 0;
}

.benefit-list .item {
    padding: 10px;
    margin-bottom: 10px;
}

.benefit-list .inner {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
}

.benefit-list .inner .lt {
    position: relative;
    width: 150px;
}

.benefit-list .inner .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 12px;
}

.benefit-list .lt_tag {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    padding: 0 7px;
    font-size: 10px;
    line-height: 20px;
    color: #fff;
    background-color: #1f1f1f;
    border-radius: 2px 0 2px 0;
}

.benefit-list .lt_tag .iconfont {
    display: inline-block;
    vertical-align: top;
    margin-right: 3px;
    font-size: 10px;
}

.benefit-list .rt_tit {
    height: 2.3em;
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.2em;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #2c2c2c;
}

.benefit-list .rt_price {
    margin-bottom: 5px;
    font-size: 12px;
    text-decoration: line-through;
    color: #969696;
}

.benefit-list .rt_button {
    display: inline-block;
    vertical-align: top;
    height: 24px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 24px;
    border-radius: 12px;
}

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
    padding: 0.5em 0.5em .5em;
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
    outline: none;
    border-radius: 0;
    border:1px solid #eee;
    box-shadow: 0;
    resize: none;
    box-sizing: border-box;
    -webkit-appearance:none;
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

.card-head {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    height: 190px;
    padding: 25px 20px;
    margin: 20px 20px 5px;
    color: #fff;
    background: url("http://img11.360buyimg.com/ddimg/jfs/t1/87532/8/1395/46170/5dbef2d8Ecc35fd17/1c790ea03a6d320e.png") 0 0 no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
}

.card-head .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.card-head .top_avatar {
    overflow: hidden;
    width: 54px;
    height: 54px;
    margin-right: 15px;
    border-radius: 50%;
    background-color: #f8f8f8;
}

.card-head .top_avatar img {
    width: 100%;
    height: 100%;
}

.card-head .top_info {
    -webkit-box-flex: 1;
    flex: 1;
}

.card-head .top_info .name {
    height: 28px;
    padding-right: 10px;
    font-size: 20px;
    line-height: 28px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space:nowrap;
    max-width:150px;
}

.card-head .top_info .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 4px 0;
}

.card-head .top_info .card {
    flex-shrink: 0;
    font-size: 15px;
}

.card-head .top_info .card .price {
    font-size: 20px;
}

.card-head .top_info .vip {
    flex-shrink: 0;
    height: 15px;
    padding: 0 3px;
    border-color: #fc9127;
    margin-right: 10px;
    font-size: 9px;
    line-height: 15px;
    color: #fc9127;
    border-radius: 6px;
}

.card-head .top_info .status {
    font-size: 11px;
    opacity: .7;
}

.card-head .btm-novip {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.card-head .btm-novip .novip_info {
    -webkit-box-flex: 1;
    flex: 1;
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 24px;
}
.novip_info .tips{
	padding-left: 0;
}
.card-head .btm-novip .novip_info .num {
    font-size: 17px;
}

.card-head .btm-novip .novip_info .tips {
    font-size: 11px;
    line-height: 15px;
    opacity: .7;
}

.card-head .btm-novip .novip_btn {
    width: 90px;
    height: 34px;
    font-size: 15px;
    text-align: center;
    line-height: 34px;
    border-radius: 5px;
}

.card-head .btm-vip {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.card-head .btm-vip .vip_item {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 12px;
    text-align: center;
}

.card-head .btm-vip .name {
    margin-bottom: 5px;
    font-size: 11px;
    line-height: 15px;
    opacity: .7;
}

.card-head .btm-vip .num {
    font-size: 17px;
    line-height: 24px;
}

.card-getway {
    padding: 0 20px;
    margin-bottom: 10px;
}

.card-getway .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 15px 0;
    font-size: 12px;
    line-height: 20px;
}

.card-getway .item .label {
    font-size: 14px;
    color: #222;
}

.card-getway .item .link {
    font-size: 12px;
    color: #999;
}

.card-benefit {
    padding: 0 20px;
    margin-bottom: 10px;
}

.card-benefit .tit {
    padding: 15px 0;
    font-size: 16px;
    text-align: center;
    line-height: 21px;
}

.card-benefit .tit .iconfont {
    display: inline-block;
    vertical-align: top;
    margin-left: 6px;
    font-size: 10px;
    transition: all .3s;
}

.card-benefit .tit.hide .iconfont {
    transform: rotate(180deg);
}

.card-benefit .content {
    overflow: hidden;
    transition: all .3s;
}

.card-benefit .content img {
    display: block;
    width: 100%;
}

.card-section {
    overflow: hidden;
    margin-bottom: 10px;
}

.card-tit {
    padding: 0 20px;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    color: #222;
    text-align: center;
}

.card-btn_buy {
    height: 44px;
    margin: 0 20px;
    font-size: 15px;
    text-align: center;
    line-height: 44px;
    border-radius: 6px;
}

.card-close {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    font-size: 14px;
    text-align: center;
    color: #969696;
    background-color: #fff;
}

.card-close .icon {
    width: 140px;
    margin-bottom: 10px;
}

/**/
.ucard_give{
    margin: 20px;
    margin-top: 10px;
    border-radius: 5px;
    border:1px solid #ddd;
    box-shadow: 0.5px 0.5px 11px rgba(0,0,0,0.2);
    padding: 10px;
    font-size: 13px;
}
.ucard_title{
    padding: 0;
    color: #333;
    font-weight: bold;
    border-left: 3px solid #000;
    height: 15px;
    line-height: 15px;
    padding-left: 10px;
    margin: 10px 0;
    font-size: 15px;
}
.ucard_bot{
    text-align: center;
    margin-top: 15px;
}
.ucard_botbtn{
    display: inline-block;
    padding: 7.5px 30px;
    border-radius: 40px;
    border: 1px solid #ddd;
}
.ucard_item{
    padding: 10px 0;
    align-items: center;
}
.ucard_gicon{
    margin-right: 10px;
    padding: 0px 3px;
    border-radius: 1px;
    background-color: #2dbb00;
    color: #fff;
    font-size: 12px;
}
.ucard_name{
  color: #666;
}
.ucard_fee{
    padding: 1.5px 10px;
    background-color: rgba(251, 45, 55, 0.1);
}

/*new*/
.present_da {
    padding-top: 32px;
}
.present_tit {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    -webkit-justify-content: space-around;    
    margin-bottom: 26px;
}

.present_tit_left,.present_tit_right {
    width: 33.3%;
    text-align: center;
}

.present_tit_left_top,.present_tit_right_top {
    margin-bottom: 5px;
}

.present_tit_left_top_img1,.present_tit_right_top_img2 {
    width: 94px;
}

.present_tit_right_top_img1,.present_tit_left_top_img2 {
    width: 94px;
}

.present_tit_left_top_img1,.present_tit_left_top_img2,.present_tit_right_top_img1,.present_tit_right_top_img2 {
    display: block;
    margin: 0 auto;
    height: 15.5px;
}

.present_tit_info {
    font-size: 12px;
    line-height: 12px;
    color: #bbb;
}

.present {
    padding: 0 15px;
}

.present2 {
    padding: 0;
}

.present_kuai {
    border-radius: 4px;
    padding: 10px;
    box-shadow: 1px 1px 10px 0px rgba(184,184,184,0.3);
    margin-bottom: 30.5px;
    overflow: hidden;
    position: relative;
}

.present_kuai2 {
    box-shadow: 0px 0px 10px rgba(144,144,144,0.3);
    width: 315px;
    background-color: #fff;
    padding: 16px 15px 17.5px;
    margin: 5px auto 0;
}

.present_kuai_two {
    margin-bottom: 21.5px;
}

.present_kuai_two2 {
    margin-bottom: 35.5px;
}

.gift_top {
    display: flex;
    justify-content: space-between;
}

.gift_top_l {
    width: 70px;
    height: 70px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #333;
}

.gift_top_r {
    width: 230px;
}

.gift_top_r_tit {
    height: 48px;
    font-size: 16px;
    line-height: 24px;
    text-align: left;
    color: #353535;
    margin-bottom: 8px;
    width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.gift_top_r_pri {
    text-align: left;
    font-size: 14px;
    line-height: 14px;
    color: #888;
}

.gift_top_r_pri text {
    color: #ff5050;
}

.gift_down {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
}

.gift_down_l {
    display: flex;
}

.gift_down_l_song {
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    color: #fff;
    background-color: #2ac814;
    font-size: 11px;
    margin-right: 6px;
    display: block;
}

.gift_down_l_tit {
    color: #353535;
    line-height: 15px;
    font-size: 12px;
    text-align: left;
    flex:1;
}

.gift_down_r {
    padding: 0 5px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #ff5050;
    background-color: #fff3f3;
    text-align: center;
    white-space: nowrap;
}

.present_kuai_thr {
    font-size: 14px;
    line-height: 14px;
    border-radius: 20px;
    border: 1px solid;
    padding: 9.5px 32.5px;
    overflow: visible;
    justify-content: center;
    margin: 0 25px;
    text-align: center;;
}

.present_kuai_thr2 {
    padding: 9.5px 14px;
    margin-right: 12px;
    position: relative;
}

.present_kuai_thr3 {
    margin-right: 0;
}

.present_kuai_thr4 {
    padding: 9.5px 14px;
    margin-right: 9px;
}

.present_kuai_thr2_jiangli {
    height: 25.5px;
    position: absolute;
    top: -25.5px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    padding: 0 5px;
}

/**/
.con_kuai {
    margin: 0 10px 29px;
    padding: 10px;
    position: relative;
    box-shadow: 1px 1px 10px 0px rgba(184,184,184,0.3);
}

.con_kuai_paiming {
    position: absolute;
    top: 0;
    left: 0;
    width: 125px;
    height: 28.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.con_kuai_zhuanshu {
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/black_card_zhuanshu.png);
    width: 125px;
}

.con_kuai_yxg {
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/black_card_yxg.png);
    width: 140px;
}

.con_kuai_l {
    margin-bottom: 7.5px;
    width: 335px;
    height: 194px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #888;
}

.con_kuai_r {
    width: 340px;
}

.name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #888;
    font-size: 12px;
    margin-bottom: 12px;
}

.con_kuai_r_tit {
    width: 345px;
    text-align: left;
    font-size: 16px;
    color: #353535;
}

.con_kuai_r_tit .leibie {
    display: inline-block;
    color: #353535;
    padding: 4px 7.5px;
    font-size: 11px;
    position: relative;
}

.con_kuai_r_price {
    margin-top: 12px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.con_kuai_r_price_l {
    position: relative;
    line-height: 1;
}

.con_kuai_r_price_l .text1 {
    font-size: 24px;
    color: #ff5050;
    margin-right: 6px;
    line-height: 24px;
    font-family: 'DIN';
}

.con_kuai_r_price_l .text2 {
    font-size: 12px;
    color: #ff5050;
    font-family: 'DIN';
}

.con_kuai_r_price_r {
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    border-radius: 5px;
    background-color: #ff5050;
    color: #fff;
}

.con_kuai_r_an {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}

.con_kuai_r_an_text3 {
    font-size: 12px;
    line-height: 12px;
    color: #888;
    text-decoration: line-through;
}

.con_kuai_r_an_r {
    font-size: 12px;
    line-height: 12px;
    color: #888;
    text-align: left;
}

.vipprice {
    font-size: 12px;
    color: #353535;
    margin-left: 7.5px;
    display: flex;
    align-items: center;
}

.icon_vip {
    background-color: #353535;
    color: #fff;
    font-size: 10px;
    display: inline-block;
    padding: 0 5px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    border-radius: 4px;
    margin-right: 3.5px;
    font-family: 'DIN'!important;
}

.con_kuai_r_price_l {
    color: #ff4040;
    font-size: 12px;
    display: flex;
    align-items: flex-end;
}

.pricetext {
    display: flex;
    align-items: flex-end;
    line-height: 1;
}

.con_kuai_r_price_l .pricetext .big {
    font-size: 24px;
    font-family: 'DIN'!important;
    line-height: 19px;
}

.gold_but_da {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 21.5px 15px 22.5px;
}

.gold_but_top {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background-color: #ffd93f;
    margin: 0 auto 7.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.gold_but_cen {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 7px;
}

.gold_but_down {
    font-size: 16px;
    line-height: 16px;
    font-family: 'DIN';
}

.gold_but_down2 {
    border: 1px solid #353535;
    border-radius: 10px;
    padding: 3px 0;
    font-size: 12px;
    line-height: 12px;
}

.gold_but_down text {
    font-size: 12px;
}

/**/
.coupon {
    width: 100%;
    height: 100px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-right: 15px;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 25px;
    color: #ff8585;
}
.coupon_title text{
    font-size: 10px;
}

.coupon_rule {
    font-size: 14px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
    padding: 5px 0;
}

.coupon_tagname {
    font-size: 14px;
    margin-right: 5px;
    color: #ff8585;
}

.get_hint {
    margin-top: 5px;
    color: #FF6A6A;
    font-size: 10px;
    text-align: center;
}

.btn_div {
    z-index: 50;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
}

.get_btn {
    background-color: #ff5050;
}

.cant_get {
    background-color: #d2d2d2;
}

.has_get {
    border: 1px solid #ff5050;
    background-color: transparent;
    color: #ff5050!important;
}

.share_icon {
    width: 54.5px;
    height: 53px;
    position: fixed;
    right: 0;
    top: 325px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/share_icon_fansCard.png?v=1.0);
    background-size: 100% 100%;
    z-index: 55;
}
.cardlist{
    padding: 10px;
}

/*样式一*/
.member {
    background: #fcdf21;
    min-height: 100vh;
}

.member-head {
    overflow: hidden;
    position: relative;
    padding-top: 15px;
}

.member-head-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 11px;
}

.m-title {
    text-align: center;
    font-size: 24px;
    line-height: 34px;
    font-weight: 700;
    color: #fff;
}

.m-title-sub {
    text-align: center;
    font-size: 12px;
    line-height: 17px;
    margin: 6px 0 8px 0;
    color: #fff;
}

.m-head-contain {
    background: #282423 0 0 no-repeat;
    background-size: 100% auto;
    margin: 0 15px;
    padding: 0 15px 5px;
    border-radius: 15px 15px 0 0;
    color: #e9c9ba;
    box-shadow: 0 3px 5px rgba(0,0,0,0.33);
}

.m-not {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0;
    position: relative;
}

.m-not-title {
    font-size: 16px;
    font-weight: bold;
}

.m-not-title-2 {
    font-size: 12px;
    font-weight: normal;
    margin-top: 4px;
}

.m-open {
    overflow: hidden;
    border-color: #e9c9ba;
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 30px;
}

.m-open-tag {
    position: absolute;
    right: 0;
    top: -20px;
    background: linear-gradient(247deg,rgba(255,65,30,1) 0%,rgba(252,6,52,1) 100%);
    border-radius: 15px;
    color: #fff;
    font-size: 11px;
    line-height: 1;
    padding: 4px 10px;
    margin-bottom: 5px;
    width:140px;
    text-align: center;
}


.m-open-tag::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 3px solid transparent;
    border-top: 3px solid #fc0634;
    position: absolute;
    bottom: -6px;
    right: 25px;
}
.m-not .m-open-tag{
  top:inherit;
  bottom:-35px;
}
.m-not .m-open-tag::after{
    border-top: 0;
    border-bottom: 6px solid #fc0634;
    bottom: initial;
    top: -6px;
}

.m-price {
    flex: auto;
    padding: 0 8px;
    font-size: 12px;
    white-space: nowrap;
}

.m-price .num {
    font-size: 15px;
    font-weight: 500;
}

.m-open-btn {
    position: relative;
    z-index: 1;
    flex: 73px 0 0;
    width: 73px;
    padding-right: 2px;
    font-size: 13px;
    color: #554c3d;
    background: linear-gradient(110deg,rgba(255,231,194,1) 0%,rgba(255,209,152,1) 100%);
    text-align: center;
    line-height: 31px;
    margin: 0 0 0 -3px;
    transform: skewX(-10deg);
    transform-origin: right bottom;
}

.m-open-btn .text {
    transform: skewX(10deg);
}

.m-info {
    padding: 11px 0;
    display: flex;
    align-items: center;
}

.m-info img {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #eee;
}

.m-info-wrap {
    flex: auto;
    padding-left: 11.5px;
    position: relative;
}

.m-name {
    line-height: 21px;
    font-size: 15px;
}

.m-message {
    height: 17px;
    font-size: 12px;
    line-height: 17px;
    margin-top: 2px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.m-keep {
    width: 94.5px;
    line-height: 33px;
    background: linear-gradient(110deg,rgba(255,231,194,1) 0%,rgba(255,209,152,1) 100%);
    border-radius: 25px;
    font-size: 13px;
    text-align: center;
    color: #554c3d;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
}

.m-save {
    padding: 8.5px 0 11px 0;
    border-top: 1px solid #322d2b;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
}

.m-save font {
    font-weight: 400;
}

.member-body {
    background: #fff;
    padding: 11px 0;
}

.auth {
    width: 345px;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    overflow: hidden;
}

.auth-pic {
    width: 100%;
    display: block;
}

.auth-open {
    width: 306.5px;
    line-height: 50px;
    border-radius: 25px;
    background: #fcdf21;
    color: #2a2a2a;
    text-align: center;
    font-size: 18px;
    margin: 20px auto 25px;
    box-shadow: 0 4px 6px rgba(252,223,33,0.5);
}

.ac-code {
    margin: 15px;
    border-radius: 25px;
    background: #f8f8f8;
    padding: 0 4px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #969696;
    height: 28px;
    overflow: hidden;
}

.ac-code input {
    line-height: 28px;
    padding-left: 19px;
    flex: auto;
    font-size: 12px;
}

.ac-code-btn {
    flex: none;
    width: 70px;
    line-height: 20px;
    text-align: center;
    color: #8a5426;
    background: rgba(251,235,211,1);
    border-radius: 15px;
}

.red-bag {
    margin-top: 37.5px;
    padding: 0 15px;
}

.title-wrap {
    display: flex;
    align-items: center;
    line-height: 1;
}

.title-tag {
    padding: 4px 6px;
    color: #e9c9ba;
    font-size: 12px;
    background: linear-gradient(90deg,rgba(44,40,38,1) 0%,rgba(48,48,48,1) 100%);
    border-radius: 3.5px;
}

.title-txt {
    font-size: 20px;
    color: #2a2a2a;
    margin-left: 10px;
    font-weight: 700;
}

.subtitle {
    color: #c9ad80;
    font-size: 12px;
    margin-top: 8px;
}

.red-bag-more {
    margin-top: 25px;
    font-size: 12px;
    color: #969696;
    text-align: center;
}

.goods {
    margin-top: 32.5px;
}

.goods .title-wrap,.goods .subtitle {
    padding: 0 15px;
}

.goods-contain {
    margin-top: 22px;
}

.product {
    padding: 0 15px;
    margin-top: 40px;
}

.pro-head {
    display: flex;
    align-items: center;
    line-height: 1;
}

.pro-title {
    font-size: 20px;
    color: #2a2a2a;
    font-weight: 700;
    position: relative;
}

.pro-title font {
    position: relative;
    z-index: 1;
}

.pro-title::after {
    content: '';
    display: block;
    width: 100%;
    height: 7px;
    background: linear-gradient(270deg,rgba(235,222,54,1) 0%,rgba(251,194,17,1) 100%);
    border-radius: 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 0;
}

.pro-title-sub {
    border-left: 1px solid #d8d8d8;
    padding-left: 8px;
    color: #787878;
    font-size: 12px;
    margin-left: 9.5px;
}

.pro-contain {
    margin-top: 20px;
}

/**/
.redbag-list {
    padding-top: 15px;
}

.redbag-list .item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 10px;
    background: linear-gradient(130deg,rgba(228,197,145,1) 0%,rgba(246,226,195,1) 100%);
    border-radius: 4px;
}

.redbag-list .bd {
    position: relative;
    flex: 245px 0 0;
    display: flex;
    align-items: center;
    width: 245px;
    height: 92px;
    padding: 6px;
    box-sizing: border-box;
}

.redbag-list .bd ._bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.redbag-list .bd ._lt {
    position: relative;
    flex: 88px 0 0;
    width: 88px;
}

.redbag-list .bd ._rt {
    position: relative;
    flex: 1;
}

.redbag-list .bd_price {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    font-family: DIN;
    line-height: 1;
    color: #ff411e;
}

.redbag-list .bd_price ._d {
    margin-left: 2px;
    font-size: 45px;
    line-height: 30px;
}

.redbag-list .bd_price ._c {
    align-self: flex-end;
    margin-bottom: -3px;
}

.redbag-list .bd_name {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #2a2a2a;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.redbag-list .fd {
    flex: 1;
}

.redbag-list .fd_count {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #906a43;
}

.redbag-list .fd_count ._c {
    font-size: 35px;
}

.redbag-list .more {
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
    color: #969696;
}

.redbag-list .more .iconfont {
    display: inline-block;
    vertical-align: top;
}

.redbag-list .more .iconfont.__up {
    transform: rotate(180deg);
}

/**/
.goods-scroll {
    white-space: nowrap;
}
.goods-scrollin{
    padding: 20rpx 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.goods-wrap {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
    position: relative;
}

.goods-wrap:first-child {
    margin-left: 15px;
}

.goods-wrap:last-child {
    margin-right: 15px;
}

.goods-pic {
    display: block;
    width: 100%;
    height: 128.5px;
    background: #eee;
    overflow: hidden;
    position: relative;
}

.goods-tag {
    color: #e9c9ba;
    font-size: 12px;
    background: rgba(0,0,0,0.7);
    border-radius: 0 0 7.5px 0;
    position: absolute;
    left: 0;
    top: 0;
    padding: 4px 10px;
}

.goods-info {
    padding: 10px 10px 22px;
}

.goods-name {
    height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 18px;
    color: #2a2a2a;
}

.goods-foot {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.goods-price {
    background: #ffdcaa;
    border-radius: 25px;
    font-size: 12px;
    color: #e9c9ba;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.goods-price-sub {
    flex: none;
    line-height: 30px;
    text-align: center;
    background: linear-gradient(270deg,rgba(44,40,38,1) 0%,rgba(48,48,48,1) 100%);
    transform: skewX(-10deg);
    padding: 0 10px;
}

.goods-price-sub text {
    display: block;
    transform: skewX(10deg);
}

.goods-sale {
    padding: 4px 11px 4px 5px;
    color: #905b2d;
    font-size: 15px;
}

.goods-sale::first-letter {
    font-size: 13px;
}

.goods-num {
    color: #969696;
    font-size: 13px;
}

</style>