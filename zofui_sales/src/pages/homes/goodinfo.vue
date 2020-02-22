<template>

<div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />

        <div class="bg_audio"  @click="replaybg" v-if="good.music">
            <img :class="audioplaying ? 'music-btn-ani' : ''" :style="{ 'top' : dev == 'app' ? '70px':'10px'}" src="https://img11.360buyimg.com/ddimg/jfs/t1/74637/31/7451/1357/5d57e82eE1c06ed22/5965b60a624b89e2.png" />  
        </div>
        <audio id="bgMusic" :src="good.music" loop="loop"></audio>

        <div id="content" v-if="inited == 2">

        <subtip :params="params"></subtip>

        <van-swipe :show-indicators="false" :vertical="true" class="top-swiper fade-in" :style="{top:params.subqr.isshow == 1 ? (dev == 'app' ? '3.1rem' : '2.1rem') : '1.1rem'}" v-if="buyed && buyed.length>1" :autoplay="4000" >
            <van-swipe-item v-for="(item,index) in buyed" :key="index">
                <div class="item_cell_box">
                    <div class="avatar">
                        <img class="avatar" :src="item.head" />
                    </div>
                    <div class="txt item_cell_flex">
                        {{item.nick}} 刚刚{{params.fontsty == 33 || params.fontsty == 34 ?'报名':'购买' }}了本{{params.goodbname}}
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>

        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" :disabled="disrefresh" v-scroll="scrolltop" success-font="已刷新">
     
            <van-swipe class="info-swiper goods-swiper" v-if="good.img && good.img.length > 0" :autoplay="autoplay" :indicator-color="maincolor" >
                <van-swipe-item  v-if="good.showv == 1" class="swiper-video" @touchstart="stopswiper" :style="{height:sheight+'px'}">
                    <video id="videoid" webkit-playsinline="true" playsinline :src="good.shortv"  :controls="false" loop style="width:100%;" :style="{height:sheight+'px'}" :show-center-play-btn="false" @click="pauseVideo" :poster="good.vposter"></video>
                    <div v-if="iconPlayShow" class="play-btn" @click="playvideo"  ></div>
                </van-swipe-item>

                <van-swipe-item v-for="(item,index) in good.img" :key="index" @touchstart="stopswiper">
                    <img :src="item" style="width: 100%;" @load="loadswip" />
                </van-swipe-item>
            </van-swipe>
            
            <div class="apple-tips" v-if="dev == 'app' && devl == 'apple'">本活动与苹果公司无关</div>
            
            <div v-if="good.type == 3">
                <div class="info-section noborder-top">
                    <goodbar :good="good" :cut="cut" @countdownfn="countdownfn" />
                    <div class="bargain-top">
                        <div class="top thin-border_b">
                            <div class="top_price">
                                <div class="now color-pri">
                                    底价<font v-if="good.show_price > 0">¥<font class="num">{{good.show_price}}</font>
                                    </font>
                                    <font v-else>
                                        <font class="num">免费</font>
                                    </font>
                                </div>
                                <div class="old" v-if="good.oldprice > 0">原价¥{{good.oldprice}}</div>
                            </div>
                            <div class="kucun thin-border_l">
                                <div class="num">{{good.stock}}</div>剩余库存
                            </div>
                        </div>
                        <div class="titArea">
                            <div class="tit" @click="bindtap($event,'copy')" :data-copy="good.title">{{good.title}}</div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <div class="bargain-intro">
                        <div class="top">
                            <div class="top_item thin-border_l">
                                <div class="num color-pri">{{good.share}}</div>
                                <div>人分享</div>
                            </div>
                            <div class="top_item thin-border_l">
                                <div class="num color-pri">{{good.join}}</div>
                                <div>人参加</div>
                            </div>
                            <div class="top_item thin-border_l">
                                <div class="num color-pri">{{good.scan}}</div>
                                <div>人浏览</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-section" v-if="cut">
                    <div class="bargain-main">
                        <div class="top thin-border-b">
                            <img class="img" :src="cut.user.headimg">
                            <div class="mes">
                                <div>{{cut.user.nickname}}</div>
                                <div class="price-box thin-border border-pri">
                                    <div class="le lbg-pri">当前价</div>
                                    <div class="ri color-pri" v-if="cut.nowprice > 0">¥ {{cut.nowprice}}</div>
                                    <div class="ri color-pri" v-else>免费</div>
                                </div>
                            </div>
                            <div class="item_cell_flex t cuttime_down" >
                                <template v-if="cut.status == 0 && Countdown">
                                    <div class="cuttime_downin color-pri">
                                        距失败{{Countdown.day ? Countdown.day+'天':''}} {{Countdown.hour}}:{{Countdown.minute}}:{{Countdown.second}}
                                    </div>
                                </template>
                                <template v-else-if="cut.status == 1">已完成</template>
                                <template v-else-if="cut.status == 2">已失败</template>
                            </div>
                        </div>
                        <div class="bot">
                            <div class="le">
                                <div class="headlist">
                                    <img class="item" v-lazy="item.headimg" v-if="index < 6" v-for="(item,index) in cut.helplist" :key="index">
                                </div>
                                <img class="moreimg" src="http://imgds3.fhcloudapi.cn/urm_huodong/20180719/1531982018223.jpg?imageMogr2/thumbnail/!400x400r|imagediv2/1/w/400/h/400" v-if="cut && cut.helplist.length > 6">
                            </div>
                            <div class="ri">
                                {{cut.helptime}}位好友共减掉
                                <font class="color-pri">¥ {{cut.cha_price}}元</font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="good.type == 5" class="info-section noborder-top">
                <goodbar :good="good"  @countdownfn="countdownfn" />
                <div class="lottery-top info-top">
                    <div class="o-top">
                        <div class="top_tit" @click="bindtap($event,'copy')" :data-copy="good.title">{{good.title}}</div>
                        <div class="top-rt">
                            <div class="top_func">
                                <div class="iconfont"></div>
                                <div>{{good.scan}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="o-price">
                        <div class="price">
                            <div class="price_now color-pri">
                                价值 ¥<font class="num">{{good.oldprice}}</font>
                            </div>
                        </div>
                        <div>
                            <font>奖品数量：{{good.stock}}</font>
                        </div>
                    </div>
                </div>
                <div class="Lotterymodule ">
                    <div class="Countdown" v-if="(good.over_type == 0 || good.over_type == 2) && good.isopenlott == 0">
                        <div class="Countdown_l" v-if="good.opentime == 0">
                            <font class="Countdown_lf" v-if="good.over_type == 0">开奖倒计时 </font>
                            <font class="Countdown_lf" v-if="good.over_type == 2">距抽奖开始 </font>
                            <font class="Countdown_lx" v-if="Countdown.day > 0">{{Countdown.day}}</font>
                            <font v-if="Countdown.day>0">天</font>
                            <font class="Countdown_lx">{{Countdown.hour}}</font>时
                            <font class="Countdown_lx">{{Countdown.minute}}</font>分
                            <font class="Countdown_lx" >{{Countdown.second}}</font>
                            <font>秒</font>
                        </div>
                        <div class="Countdown_l" v-if="good.opentime == 1 && good.opennum > 0">
                            
                            <font class="Countdown_lf" v-if="good.over_type == 0">距离开奖还差{{good.opennumdis}}人 </font>
                            <template v-if="good.over_type == 2">
                                <font class="Countdown_lf" >距抽奖开始 </font>
                                <font class="Countdown_lx" v-if="Countdown.day > 0">{{Countdown.day}}</font>
                                <font v-if="Countdown.day>0">天</font>
                                <font class="Countdown_lx">{{Countdown.hour}}</font>时
                                <font class="Countdown_lx">{{Countdown.minute}}</font>分
                                <font class="Countdown_lx" >{{Countdown.second}}</font>
                                <font>秒</font>
                            </template>
                        </div>
                        <div class="Countdown_r" @click="link" data-url="/lotteryrule" formType="submit">中奖规则</div>
                    </div>
                    <div  @click="joinLottery" class="Lotterybutton" v-if="good.isopenlott == 0">
                        <div class="Lotterybutton_x Lotterybutton_x4"></div>
                        <div class="Lotterybutton_zi ">
                            <font v-if="good.over_type == 2">即将开始</font>
                            <font v-else-if="good.over_type == 0 &&  lottery.status == 0">参与抽奖</font>
                            <font v-else-if="good.isopenlott == 0 && lottery.status == 1">等待开奖</font>
                        </div>
                    </div>

                    <div class="Haswon" v-if="good.isopenlott == 1 && lottery.status == 2">
                        <img class="Haswontop" src="https://img11.360buyimg.com/ddimg/jfs/t1/77295/26/3572/16244/5d1cb517E15851a14/aa97035a045ea2eb.png" >
                        <div class="Haswoncon2">恭喜, 你中奖啦！获奖幸运码: <font> {{lottery.actcode}}</font>
                        </div>
                        <div v-if="lottery && lottery.order"  @click="link" :data-url="'/orderinfo?id='+lottery.order.orderid" class="Haswonbtn">查看我的奖品</div>
                        <div class="Countdown_r Countdown_r2"  @click="link" data-url="/lotteryrule" >中奖规则</div>
                    </div>
                    <div class="Haswon" v-if="good.isopenlott == 1 && lottery.status == 1">
                        <img class="Haswontop Haswontop_not" src="https://img11.360buyimg.com/ddimg/jfs/t1/77140/10/3622/9781/5d1cb4daE4e7955bd/4c9c4ef87e67a684.png" >
                        <div class="Haswoncon Haswoncon_not" v-if="lottery.status==1">很遗憾，未中奖</div>
                        
                        <div class="Countdown_r Countdown_r2"  @click="link" data-url="/lotteryrule" >中奖规则</div>
                    </div>
                    <div class="Winlist" v-if="good.isopenlott == 1 && awardlist && awardlist.length > 0">
                        <div class="Winlisttit">————— <font> 中奖者名单 </font> —————</div>
                        <div class="Winlisttop">
                            <div class="Winlisttop_da" v-for="(item,index) in awardlist" :key="index">
                                <div class="Winlisttop_on" :style="{'background-image':'url('+item.headimg+')'}"></div>
                                <div class="Winlisttop_tw">{{item.nickname}}</div>
                                <div class="Winlisttop_th">{{item.code}}</div>
                            </div>
                        </div>
                        <div class="Winlistdow"  @click="link" :data-url="'/lotterycount?id='+good.id" >获奖幸运码计算过程</div>
                    </div>
                    <div class="Luckycode" v-if="lottery && lottery.list.length >= 0 && lottery.status != 0">
                        <div class="LCtop2">
                            ————— <font> 我的幸运码 共{{lottery.list.length}}个 </font> —————
                        </div>
                        <div catchtap="lottery.list.length>9?'lookmore':'nomore'" class="LCcon" :class="lottery.list.length==1?'LCcon2':''">
                            <div class="LCconma" :class="lottery.list.length==1?'LCconma2':''" v-if="index<9" v-for="(item,index) in lottery.list">{{item.code}}</div>
                            <div class="LCconma" v-if="index >=9 && reservations" v-for="(item,index) in lottery.list">{{item.code}}</div>
                        </div>
                        <div catchtap="lookmore" class="LCconjian" v-if="lottery.list.length > 9 && !reservations">
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/LCconjian.png">
                        </div>
                        <div catchtap="lookmore" class="LCconjian LCconjian2" v-if="lottery && lottery.list.length>9 && reservations">
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/LCconjian.png">
                        </div>
                        <div @click="openShareArea" class="LCcondown" v-if="good.isopenlott == 0 && good.over_type == 0 && good.chousmaxs > 0">获得更多幸运码</div>
                    </div>
                    <div class="Numdraws" bindtap="navigateto" data-url="/zofui_sales/lottery/joined?gid=good.id" formType="submit" v-if="lottlist && lottlist.length > 0">
                        <div class="Numdraws_t">
                            <div class="Numdraws_avr" :style="{'background-image': 'url(' + ( lottlist[index] && lottlist[index].headimg ? lottlist[index].headimg : '' ) + ')'}" v-for="(item,index) in [1,1,1,1]" :key="index"></div>
                            <div class="Numdraws_avr">...</div>
                        </div>
                        <div class="Numdraws_d" @click="link" :data-url="'/lotteryjoined?gid='+good.id" >
                            <font class="Numdraws_df">{{good.join}}人已参与 </font>
                            <font class="Numdraws_dt">查看全部</font>
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/Numdrawsdt.png">
                        </div>
                    </div>
                    
                </div>

            </div>

            <div class="info-section noborder-top" v-else-if="good.type == 6">
                <div class="info-top">
                    <goodbar :good="good" @countdownfn="countdownfn" />
                    <div class="o-top">
                        <div class="top_tit" @click="bindtap($event,'copy')" :data-copy="good.title">
                            {{good.title}}
                        </div>
                        <div class="top-rt" v-if="params.showscan == 0 || params.iscollect == 0">
                            <div class="top_func" v-if="params.showscan == 0">
                                <div class="iconfont"></div>
                                <div>{{good.scan}}</div>
                            </div>
                            <div @click="bindCollect" class="top_func" :class="{'color-pri':good.iscollect}" v-if="params.iscollect == 0">
                                <div class="iconfont">
                                    {{good.iscollect ? '':''}}
                                </div>
                                <div>{{good.iscollect ? '已收藏':'收藏'}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="o-price">
                        <div>
                            <div class="price">
                                <div class="price_now color-pri">
                                    <div v-if="good.type == 2">
                                        ¥<font class="num">{{good.show_price.gprice}}</font>{{good.qi}}
                                    </div>
                                    <div v-else>
                                        <div v-if="good.show_price > 0">
                                            ¥<font class="num">{{good.show_price}}</font>{{good.qi}}
                                        </div>
                                        <div v-else>
                                            <font class="num">免费</font>
                                        </div>
                                    </div>
                                </div>
                                <div class="price_fan lbg-pri" v-if="good.userpricejb > 0">
                                    {{params.umname}} {{good.userpricejb*100/100}}
                                </div>
                                <div class="price_old" v-if="good.oldprice >0">¥{{good.oldprice}}</div>
                                <div class="price_fan lbg-pri" v-if="good.fanxm > 0 && good.userpricejb <= 0">
                                    返{{good.fanxm*100/100}}
                                </div>
                            </div>
                            <div class="btm_save" v-if="params.isucard == 0 &&  params.gtstyle == 1 && good.disprice > 0 && good.isuser <= 0">
                                <div class="vip-price" >
                                    <div >
                                        <font class="vip-pricel" style="background-image:url('https://img11.360buyimg.com/ddimg/jfs/t1/34155/32/4010/1076/5cbc76b9E327f4bae/03a7ecdeb3d91531.png');"> {{params.cardname}}{{params.twoucard == 1 ? ','+params.upcname : ''}} </font>减<font> {{good.disprice*100/100}} </font>元
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="ms_pro">
                                <font class="ms_last" v-if="good.over_type == 2 || good.over_type == 3">限量{{good.stock}}件</font>
                                <font class="ms_last" v-if="good.over_type == 0 || good.over_type == 1">{{ good.mslast > 0 ? '已抢'+good.mstaked+'件' : '已抢完' }}  </font>
                                <font class="ms_proact lbg-pri" :style="{width:good.mspro+'%'}"></font>
                            </div>
                            <div class="ms_desc" v-if="good.over_type == 0 || good.over_type == 2">
                                {{good.over_type == 0 ? '距结束' : '距开始'}} 
                                {{Countdown.day > 0 ? Countdown.day+'天' : ''}}
                                {{Countdown.hour}}:{{Countdown.minute}}:{{Countdown.second}}
                            </div>
                        </div>
                        
                    </div>

                    <form v-if="params.isucard != 1 && (good.disprice > 0 || good.isuser == 1)">

                        <div class="btn-formid" v-if="good.isuser == 0">
                            <div class="o-vip" :class="params.gtstyle == 0 ? 'gtstyle0' : 'gtstyle1'" v-if="userinfo.level == 1">
                                <div class="vip_name">
                                    <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                                </div>
                                <div class="vip-ct" >
                                    此{{params.goodbname}}为您节省<font class="color-pri">{{good.disprice}}</font>元
                                </div>
                            </div>
                            <div class="o-vip" :class="params.gtstyle == 0 ? 'gtstyle0' : 'gtstyle1'" @click="link" data-url="/buycard" v-else>
                                <div class="vip_name">
                                    <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                                </div>
                                <div class="vip-ct">
                                    开通{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}立减<font class="color-pri">{{good.disprice}}</font>元
                                </div>
                                <div>
                                    开通<font class="van-icon van-icon-arrow"></font>
                                </div>
                            </div>
                        </div>
                        <div class="btn-formid" v-else>
                            <div class="o-vip" @click="link" data-url="/buycard" >
                                <div class="vip_name">
                                    <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                                </div>
                                <div class="vip-ct">
                                    仅限{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}会员{{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}
                                </div>
                                <div>
                                    开通<font class="van-icon van-icon-arrow"></font>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            <div class="info-section noborder-top" v-else>
                <div class="info-top">
                <goodbar :good="good" @countdownfn="countdownfn" />
                <div class="o-top">
                    <div class="top_tit" @click="bindtap($event,'copy')" :data-copy="good.title">
                        <font class="tag lbg-pri" v-if="good.type == 2">{{good.groupmem}}人团</font>
                        {{good.title}}
                    </div>
                    <div class="top-rt" v-if="(params.showscan == 0 || params.iscollect == 0) && params.gtstyle == 0">
                        <div class="top_func" v-if="params.showscan == 0">
                            <div class="iconfont"></div>
                            <div>{{good.scan}}</div>
                        </div>
                        <div @click="bindCollect" class="top_func" :class="{'color-pri':good.iscollect}" v-if="params.iscollect == 0">
                            <div class="iconfont">
                                {{good.iscollect ? '':''}}
                            </div>
                            <div>{{good.iscollect ? '已收藏':'收藏'}}</div>
                        </div>
                    </div>
                </div>

                <div class="o-price">
                    <div class="price">
                        <div>
                            <div class="price_now color-pri">
                                <div v-if="good.type == 2">
                                    ¥<font class="num">{{good.show_price.gprice}}</font>{{good.qi}}
                                </div>
                                <div v-else>
                                    <div v-if="good.show_price > 0">
                                        ¥<font class="num">{{good.show_price}}</font>{{good.qi}}
                                    </div>
                                    <div v-else>
                                        <font class="num">免费</font>
                                    </div>
                                </div>
                            </div>
                            <div class="price_fan lbg-pri" v-if="good.userpricejb > 0">
                                {{params.umname}} {{good.userpricejb*100/100}}
                            </div>
                            <div class="price_old" v-if="good.oldprice > 0">¥{{good.oldprice}}</div>
                            <div class="price_fan lbg-pri" v-if="good.fanxm > 0 && good.userpricejb <= 0">
                                返{{good.fanxm*100/100}}
                            </div>
                        </div>
                        
                        <div class="btm_save" v-if="params.isucard == 0 && params.gtstyle == 1 && good.disprice > 0 && good.isuser <= 0">
                            <div class="vip-price" >
                                <div >
                                    <font class="vip-pricel" style="background-image:url('https://img11.360buyimg.com/ddimg/jfs/t1/34155/32/4010/1076/5cbc76b9E327f4bae/03a7ecdeb3d91531.png');"> {{params.cardname}}{{params.twoucard == 1 ? ','+params.upcname : ''}} </font>减<font> {{good.disprice*100/100}} </font>元
                                </div>
                            </div>
                        </div>
                           
                    </div>
                    <template v-if="params.gtstyle == 0">
                        <div v-if="good.type == 4"></div>
                        <div v-else>
                            <font v-if="params.showsales == 0">
                                {{params.fontsty == 33 || params.fontsty == 34?'报名':'已售' }}：{{good.show_saled}}
                            </font>
                            <font class="color-pri">
                                只剩{{good.stock}}{{params.fontsty == 33 || params.fontsty == 34?'名额':'件' }}
                            </font>
                        </div>
                    </template>
                    <template v-else>
                        <div class="info-views pri-color" style="background-color:rgba(255,39,65, .08);">
                            <img class="iconfont bg-pri" src="https://img11.360buyimg.com/ddimg/jfs/t30157/219/1634375992/2858/bd203d37/5ce65dc6N980a59ce.png" />
                            <div class="views color-pri">{{good.scan}}人喜欢</div>
                        </div>
                    </template>
                </div>

                <div v-if="params.isucard != 1 && (good.disprice > 0 || good.isuser == 1)">
                    <div v-if="good.isuser == 0">
                        <div class="o-vip" :class="params.gtstyle == 0 ? 'gtstyle0' : 'gtstyle1'" v-if="userinfo.level == 1">
                            <div class="vip_name">
                                <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                            </div>
                            <div class="vip-ct">
                                此{{params.goodbname}}为您节省<font class="color-pri">{{good.disprice}}</font>元
                            </div>
                        </div>
                        <div class="o-vip" :class="params.gtstyle == 0 ? 'gtstyle0' : 'gtstyle1'" @click="link" data-url="/buycard" v-else>
                            <div class="vip_name">
                                <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                            </div>
                            <div class="vip-ct">
                                开通{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}立减<font class="color-pri">{{good.disprice}}</font>元
                            </div>
                            <div>
                                开通<font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                    <div  v-else>
                        <div class="o-vip" @click="link" data-url="/buycard" >
                            <div class="vip_name">
                                <font class="iconfont"></font>{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}
                            </div>
                            <div class="vip-ct">
                                仅限{{good.isuser == 1 ? params.cardname + (params.twoucard == 1 ? ','+params.upcname : '') : params.upcname}}会员{{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}
                            </div>
                            <div>
                                开通<font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                </div>

                <div scroll-x class="group_step" v-if="good.type == 2 && good.groupparams.length > 0">
                    <div class="group_stepitem" :class="{'lbg-pri':(groupmem == 0 || !groupmem || groupmem == good.groupmem_default)}" @click="getGroupprice" :data-m="good.groupmem_default" :data-price="good.show_price_default">
                        <div class="group_stepmem">
                            <font>{{good.groupmem_default}}</font>人团
                        </div>
                        <div class="group_stepprice">
                            ¥<font>{{good.show_price_default}}</font>
                        </div>
                    </div>

                    <div class="group_stepitem" :class="{'lbg-pri' : groupmem == item.groupm }" v-for="(item,index) in good.groupparams" :key="index" @click="getGroupprice" :data-m="item.groupm" :data-price="item.show_price">
                        <div class="group_stepmem">
                            <font>{{item.groupm}}</font>人团
                        </div>
                        <div class="group_stepprice">
                            ¥<font>{{item.show_price}}</font>
                        </div>
                    </div>
                </div>

                    <div class="o-discount thin-border_t" v-if="good.icon.length > 0">
                        <div class="discount_list" @click="isshowtags = true">
                            <div class="item thin-border" v-for="(item,index) in good.icon" :key="index">{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-section" v-if="good.type == 4">
                <div class="info-sign">
                    <div class="top" >
                        <div class="top_num" >{{good.show_saled}}人报名</div>
                        <div class="top_kucun" >剩{{good.stock}}个名额</div>
                    </div>
                    <div class="list" v-if="good.joinlist.length">
                        <div class="item" v-if="index <7" v-for="(item,index) in good.joinlist" :key="index">
                            <div class="img image-box __100">
                                <img v-lazy="item.headimg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-section" v-if="good.type == 2">
                <div>
                    <div v-if="groups && groups.length">
                        <div class="group-top">
                            <div class="tit">{{groups.length}}人在拼单，可直接参与</div>
                        </div>
                        <div class="group-lists">
                            <div class="item thin-border_t" v-if="index < 2" v-for="(item,index) in groups" :key="index">
                                <img class="item_avatar" :src="item.headimg">
                                <div class="item_name">{{item.nickname}}</div>
                                <div class="item_info">
                                    <div>还差
                                        <font class="num color-pri">{{item.dismem}}</font>人拼成
                                    </div>
                                    <div v-if="item && item.time">
                                        剩余{{item.time.day}}天{{item.time.hour}}:{{item.time.minite}}:{{item.time.second}}
                                    </div>
                                </div>
                                <div class="item_btn lbg-pri" @click="link" :data-url="'/groupinfo?id='+item.id" >去拼单</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="goodsqun" v-if="params.isgqun == 1 || (params.isgkf == 1 && params.gkfsite == 0)">
                <div class="item_cell_box mb20" v-if="params.isgkf == 1 && params.gkfsite == 0">
                    <div class="goodsqun_head">
                        <img :src="params.kfghead" >
                    </div>
                    <div class="item_cell_flex goodsqun_desc">
                        <div>联系客服</div>
                    </div>
                    <div class="btn btn-gray lbg-pri" @click="link" :data-url="'/kefuindex?shopid='+shop.id+'&gid='+good.id+'&role=user'">客服</div>
                </div>
                <div class="item_cell_box" v-if="params.isgqun == 1">
                    <div class="goodsqun_head">
                        <img :src="params.qunhead" >
                    </div>
                    <div class="item_cell_flex goodsqun_desc">
                        <div>{{params.quntitle}}</div>
                        <div class="goodsqun_descin" v-if="params.qundesc">{{params.qundesc}}</div>
                    </div>
                    <div class="btn btn-gray lbg-pri" @click="showqunfn">添加</div>
                </div>
            </div>

            <div class="redpacket redpacket_item" v-if="redbag">
                <div @click="link" class="content_hb_use" :data-url="redbag.appurl" >
                    <div class="hb_price" >
                        <font>{{redbag.fee}}</font>元
                    </div>
                    <div class="hb_desc">
                        <font class="hb_desc_name">{{redbag.name}}</font>
                        <font class="hb_desc_font">{{redbag.ruledesc}}</font>
                        <font class="hb_desc_font" v-if="redbag.redlog && redbag.redlog &&  redbag.redlog.isact == 1">{{redbag.starttime}}-{{redbag.endtime}}</font>
                        <font class="hb_desc_font" v-else-if="redbag.invite > 0">邀请{{redbag.invite}}位好友一起领即可获得红包</font>
                    </div>
                    <div class="hb_status">
                        <div class="hb_usebtn has_get" v-if="redbag && redbag.redlog && redbag.redlog.isact == 1">已领取</div>
                        <div class="hb_usebtn" v-else>领 取</div>
                    </div>
                </div>
            </div>

            <div class="info-section" v-if="bindgoods.length > 0">
                <div class="info-title bottitle tl" style="margin-top:0">
                    其他套餐
                    <font class="bott bg-pri"></font>        
                </div>
                <div class="quick-box">
                    <div @click="link" :data-url="item.appurl" class="quick-item item_cell_box" v-for="item in bindgoods" :key="item.id">
                        <div class="item_cell_flex">
                            <div class="quick-gtitle">
                                {{item.title}}
                            </div>
                            <div class="quick-price">
                                <font>¥</font>{{item.show_price}}
                            </div>
                        </div>
                        <div class="van-icon van-icon-arrow"></div>
                    </div>
                </div>
            </div>

            <div class="info-section" v-if="allcard && allcard.length > 0">
                <div class="card_box" >
                    
                    <div @click="link" class="coupon" :data-url="'/cardinfo?id='+item.id" v-for="item in allcard" :data-id="item.id" :style="allcard.length == 1 ? 'width: 100%' : ''">
                        <div class="coupon_font">
                            <div class="coupon_title"><font>¥</font> {{item.fee}}</div>
                            <div class="coupon_rule">
                                <font class="coupon_tagname" >{{item.name}}</font>
                            </div>
                            <div class="coupon_rule">
                                <font class="coupon_tagname" >{{item.statusstr}}</font>
                            </div>
                        </div>
                        <div @click.stop="takecard" :data-id="item.id" :data-status="item.istaked == 0 && item.status == 0 ? '1' : '0'" class="btn_div"  v-if="item.istaked == 0" :class="item.status===0?'get_btn':'cant_get'">
                            {{item.status===0?'立即领取':''}} {{item.status===1?'已领完':''}} {{item.status===2?'未开始':''}} {{item.status===3?'已过期':''}}
                        </div>
                        <div class="btn_div cant_get " v-if="item.istaked == 1">
                            已领取
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-section quest-section" v-if="params.isgquest == 1">
                <div class="namebox item_cell_box" @click="link" :data-url="'/questindex?gid='+good.id" >
                    <div class="item_cell_flex">问答（{{good.questnum > 0 ? good.questnum : 0}}）</div>
                    <div class="van-icon van-icon-arrow"></div>
                </div>
                <div class="quest-list" v-if="good.questlist && good.questlist.length > 0">
                    <div class="item_cell_box quest-item" v-for="(item,index) in good.questlist"  @click="link" :data-url="'/questinfo?id='+item.id">
                        <div class="quest-itemq lbg-pri">问</div>
                        <div class="item_cell_flex quest-itemt">{{item.title}}</div>
                        <div class="quest-tip">{{item.retimes > 0 ? item.retimes+'个回答' : '去回答'}}</div>
                    </div>
                </div>
            </div>

             <div class="info-section" v-if="shop">
                <div class="info-title bottitle">{{params.shopbname}}详情<font class="bott bg-pri" :style="params.hengxx == 1 ? 'width:65px' : ''"></font>
                </div>
                <div class="info-shop">
                    <div class="shop-item" v-if="shop" >
                        <div class="namebox item_cell_box" @click="link" :data-url="'/shopinfo?id='+shop.id" >
                            <div class="item_cell_flex">{{shop.name}}</div>
                            <div class="van-icon van-icon-arrow"></div>
                        </div>
                        <div class="row" v-if="shop.severtime">
                            <div class="label">· 营业时间：</div>
                            <div class="info">{{shop.severtime}}</div>
                        </div>
                        <div class="row" v-if="shop.tel">
                            <div class="label">· {{params.shopbname}}电话：</div>
                            <div class="info">{{shop.tel}}</div>
                            <div @click="bindtap($event,'tel')" class="btn lbg-pri" :data-tel="shop.tel">拨打</div>
                        </div>
                        <div class="row" v-if="shop.address">
                            <div class="label">· {{params.shopbname}}地址：</div>
                            <div class="info">{{shop.address}}</div>
                            <div @click="bindtap($event,'loc')" class="btn lbg-pri" :data-lat="shop.lat/1000000" :data-lng="shop.lng/1000000"  :data-add="shop.address" >导航</div>
                        </div>
                    </div>
                </div>
                <div class="info-shop" v-for="(item,index) in fendian" :key="index" v-if="showallfd || index == 0">
                    <div class="shop-item" >
                        <!-- <div class="name" url="/zofui_sales/shop/shop?id=shop.id" >{{item.name}}</div> -->
                        <div class="namebox item_cell_box" @click="link" :data-url="'/shopinfo?id='+shop.id" >
                            <div class="item_cell_flex">{{item.name}}</div>
                            <div class="van-icon van-icon-arrow"></div>
                        </div>
                        <div class="row" v-if="item.tel">
                            <div class="label">· {{params.shopbname}}电话：</div>
                            <div class="info">{{item.tel}}</div>
                            <div @click="bindtap($event,'tel')" class="btn lbg-pri" :data-tel="item.tel">拨打</div>
                        </div>
                        <div class="row" v-if="item.address">
                            <div class="label">· {{params.shopbname}}地址：</div>
                            <div class="info">{{item.address}}</div>
                            <div @click="bindtap($event,'loc')" class="btn lbg-pri" :data-lat="item.lat/1000000" :data-lng="item.lng/1000000" :data-addname="item.name" :data-add="item.address" >导航</div>
                        </div>
                    </div>
                </div>
                <div v-if="!showallfd  && fendian.length > 0" class="shopmore-btn" @click="showallfd = true" >
                    更多
                    <i class="iconfont icon-icon_arrow_bottom"></i>
                </div>
                <div v-if="showallfd  && fendian.length > 0" class="shopmore-btn" @click="showallfd = false" >
                    收起
                    <i class="iconfont icon-icon_arrow_bottom arrowup"></i>
                </div>
            </div>

            <div class="info-section" v-if="goodpak && goodpak.length  > 0">
                <div class="info-title bottitle">套餐{{params.goodbname}}列表
                    <font class="bott bg-pri" :style="{width:params.hengxx == 1 ? '65px' : ''}"></font>  
                </div>
                <div class="group-lists">
                    <div class="item thin-border_t" v-for="item in goodpak" :key="item.id">
                        <img class="item_avatar tcthumb" :src="item.thumb">
                        <div class="item_name">{{item.title}}</div>
                        <div class="item_btn lbg-pri" @click="link" :data-url="item.appurl">去看看</div>
                    </div>
                </div>
            </div>

            <div class="info-section" v-if="good.know && good.know.length">
                <div class="info-title bottitle">
                    活动须知
                    <font class="bott bg-pri" :style="{width:params.hengxx == 1 ? '65px' : ''}"></font>  
                </div>
                <div class="info-notice">
                    <div class="item" v-for="(item,index) in good.know" :key="index">{{item}}</div>
                </div>
            </div>

            <div class="info-section">
                <div class="info-detail">
                    <div class="info-tab thin-border_b">
                        <div @click="tabChange" class="item" :class="item.id==Tabcurrent?'active border-pri':''" :data-index="item.id" v-for="(item,index) in label" :key="index">
                            <font>{{item.n}}</font>
                        </div>
                    </div>
                    <div class="info-contents info-heiplist">
                        <div class="contents-item" :class="Tabcurrent=='shop'?'active':''">
                            <div v-if="good.shopinfo">
                                <div class="detail-content auto" >
                                    <div v-html="good.shopinfo"></div>
                                </div>
                            </div>
                            <div class="detail-nomore" wx:else>— 暂时没有介绍 —</div>
                        </div>

                        <div class="contents-item" :class="Tabcurrent=='info'?'active':''">
                            
                            <div v-if="good.content || good.pic || good.vediourl">
                                <div class="detail-content auto" >
                                    <div class="video_block" v-if="good.vediourl" bindtap="showVideo" >
                                        <img src="/images/v.png" >
                                    </div>
                                    <img v-for="(item,index) in good.pic" :key="index" style="width:100%;" :src="item" />
                                    <div v-html="good.content"></div>
                                </div>
                            </div>
                            <div class="detail-nomore" v-else>— 暂时没有详情介绍 —</div>
                            
                        </div>

                        <div class="contents-item" :class="Tabcurrent=='comment' && !cut.ismy ?'active':''">
                            <div class="info-comment" v-if="comment">
                                <div class="item thin-border_b" v-for="(item,index) in comment" :key="index">
                                    <div class="lt">
                                        <div class="lt_avatar image-box __100">
                                            <img :src="item.headimg">
                                        </div>
                                    </div>
                                    <div class="rt">
                                        <div class="rt_name">{{item.nickname}}</div>
                                        <div class="rt_date">{{item.ctime}}</div>
                                        <div class="rt_star">
                                            <van-rate v-model="item.star*1" disabled-color="#FFD21E" disabled />
                                        </div>
                                        <div class="rt_msg">{{item.content}}</div>
                                        <div class="rt_pic" v-if="item.img && item.img.length">
                                            <div class="pic" v-for="(pic,index) in item.img" :key="index">
                                                <div class="image-box __100">
                                                    <img @click="preimg" :data-current="index" :data-pic="item.img"  :src="pic">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rt_reply" v-if="item.backcontent">店家回复: {{item.backcontent}}</div>
                                    </div>
                                </div>
                            </div>
                            <div @click="morecomment" class="detail-btn" v-if="!commented && comment && comment.length > 0">
                                查看更多<font class="iconfont"></font>
                            </div>
                            <div class="detail-nomore" v-if="comment && comment.length <= 0">— 暂时没有评价 —</div>
                        </div>

                        <div class="shoplist-bot" v-if="Tabcurrent=='help' && cut.ismy" :class="Tabcurrent=='help' && good.type == 3 ?'active':''">
                            <div class="item thin-border_b" v-if="cut && cut.helplist.length > 0" v-for="item in cut.helplist" >
                                <div class="le">
                                    <img class="avatar" :src="item.headimg">
                                    <font class="name">{{item.nickname}}</font>
                                    <div class="ct">帮减了
                                        <font class="color-pri price">¥{{item.down}}</font>
                                    </div>
                                </div>
                                <div class="ri">{{item.ctime}}</div>
                            </div>
                            <div @click="morehelp" class="more-btn" v-if="!helplisted && cut && cut.helplist.length > 0">查看更多
                                <font class="iconfont"></font>
                            </div>
                            <div class="detail-nomore" v-if="cut && cut.helplist.length <= 0">-没有更多信息-</div>
                        </div>

                    </div>
                </div>
            </div>

             <div class="info-section" v-if="tuijian.length > 0">
                <div class="info-title bottitle">人气推荐<font class="bott bg-pri" :style="{width:params.hengxx == 1 ? '65px' : ''}"></font>
                </div>
                <div class="sub_goods">
                    <div class="goods_item" @click="linkself" :data-id="item.id"  v-for="(item,index) in tuijian" :key="index">
                        <img lazy-load="true" :src="item.thumbh">
                        <font class="goods_tit">{{item.title}}</font>
                        <div class="goods_ft">
                            <div class="price_cur">￥{{item.show_price}}</div>
                            <div class="price_org item_cell_flex tr">{{item.ncon}} {{item.saled}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="m-pop pop-container--visible" v-if="HelpkanInfo">
                <div class="pop-shade"></div>
                <div class="HelpkanInfo pop-modal" :class="{'bounceInUp':HelpkanInfo}">
                    <div class="helpop">
                        <div class="iconfont kanicon color-pri"></div>
                        <div class="kanc">
                            <font class="color-pri">{{helpkantxt}}</font>
                        </div>
                        <div v-if="cut.ismy == 1" class="btn lbg-pri" @click="openShareArea" style="font-size: 30rpx;margin:30rpx;"> 邀请好友帮忙减价</div>
                        <div v-else @click="joincut" class="btn lbg-pri" style="font-size: 30rpx;margin:30rpx;">参与活动</div>
                        <div @click="kanInfoclose" class="close iconfont"></div>
                    </div>
                    
                </div>
            </div>

            <div class="m-pop pop-container--visible" v-if="KansuccessPop">
                <div class="pop-shade"></div>
                <div class="pop-modal" :class="{'bounceInUp':KansuccessPop}">
                    <div class="kan-success">
                        <img class="top-img" src="http://img11.360buyimg.com/ddimg/jfs/t1/85867/13/1437/64106/5dbef233E0cb2c7b1/5f5b6c40ff079754.png">
                        <div class="title">恭喜您减价成功</div>
                        <div class="content">亲友们合力帮您减到最低价<div>立即{{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}吧~</div>
                        </div>
                        <div @click="KansuccessPopkanpay" class="btn lbg-pri">立即{{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}</div>
                        <div @click="KansuccessPopclose" class="close iconfont"></div>
                    </div>
                </div>
            </div>
        
        </van-pull-refresh>


        <div class="fix-box" style="">
            <div class="info-menu">
                <div class="menu-items">
                    <div @click="link" class="item" :data-url="params.goodsurl == 0  || good.type == 7 ? '/' : '/shopinfo?id='+shop.id">
                        <img class="icon" :src="footimg.index">
                        <div>首页</div>
                    </div>
                    <div @click="openShareArea" class="item ">
                        <div v-if="good.show_fx >= 0.01">
                            <img class="icon" :src="footimg.add">
                            <div>赚¥{{good.show_fx*100/100}}</div>
                        </div>
                        <div v-else>
                            <img class="icon" :src="footimg.share">
                            <div>分享</div>
                        </div>
                    </div>
                    <div v-if="params.iscart == 1" @click="link" class="item " data-url="/cart">
                        <img class="icon" :src="footimg.cart">
                        <div>购物车</div>
                        <div class="cartnum bg-pri" v-if="params.cartnum > 0">{{params.cartnum}}</div>
                    </div>
                    <div v-else-if="params.isgkf && params.gkfsite == 1" @click="link" class="item" :data-url="'/kefuindex?shopid='+shop.id+'&gid='+good.id+'&role=user'">
                        <img class="icon" :src="footimg.my">
                        <div>客服</div>
                    </div>
                    <div v-else @click="link" class="item" :data-url="good.type == 2 ? '/groupmylist' : ( good.type == 3 ? '/cutmylist' : '/user' )">
                        <img class="icon" :src="footimg.my">
                        <div>我的</div>
                    </div>
                </div>
                <div v-if="good.type != 3" class="menu-btns">
                    <div class="btn btn-gray" v-if="good.over_type==1">
                        已售罄
                    </div>
                    <div class="btn btn-gray" v-else-if="good.over_type==2">
                        未开始
                    </div>
                    <div class="btn btn-gray" v-else-if="good.over_type==3">
                        已结束
                    </div>
                    <template v-else >
                        <div v-if="good.pttype != 1 && params.iscart == 1 && (good.type == 0 || good.type == 1)" @click="joincart" class="btn bg-sec cartbtn" >
                            加入购物车
                        </div>
                        <div @click="buyit" class="btn lbg-pri" v-if="good.type == 1">
                            {{params.fontsty == 33 || params.fontsty == 34?'立即报名':'立即抢购' }}
                        </div>
                        <div @click="buyit" class="btn lbg-pri" data-type="6" v-else-if="good.type == 6">{{params.fontsty == 33 || params.fontsty == 34?'立即报名':'立即抢购' }}
                        </div>
                        <template v-else-if="good.type == 2" >
                            <div class="btn lbg-pri" @click="buyit" v-if="options.from == 'group'" data-type="2">立即参团</div>
                            <template v-else >
                                <div @click="buyit" data-type="0" class="btn bg-sec" >
                                    <div class="fmt-price">
                                        <div class="now">
                                            <font class="dollar">¥</font>
                                            <font class="price">{{good.show_price.price}}</font>
                                        </div>
                                    </div>
                                    {{params.fontsty == 33 || params.fontsty == 34?'单独报名':'单独购买' }}
                                </div>
                                <div @click="buyit" data-type="1" class="btn lbg-pri" >
                                    <div class="fmt-price">
                                        <div class="now">
                                            <font class="dollar">¥</font>
                                            <font class="price">{{good.show_price.gprice}}</font>
                                        </div>
                                    </div>
                                    {{params.fontsty == 33 || params.fontsty == 34?'拼团报名':'拼团购买' }}
                                </div>
                            </template>
                        </template>
                        <div @click="buyit" data-type="3" class="btn lbg-pri" v-else-if="good.type == 4">我要报名
                        </div>
                        <template v-else-if="good.type == 5" >
                            <div @click="link" class="btn bg-sec" data-url="/lotteryindex">更多活动</div>
                            <div @click="joinLottery" class="btn" :class="good.isopenlott == 0 && lottery.list.length <= 0 ? 'bg-pri' : 'bg-gray'" >{{good.isopenlott == 0 ? ( lottery.list.length <= 0 ? '立即参与' : '已参与' ) : '已开奖'}}</div>
                        </template>
                        <div @click="buyit" class="btn lbg-pri" v-else>{{params.fontsty == 33 || params.fontsty == 34?'立即报名':'立即购买' }}
                        </div>
                    </template>
                </div>
                <div v-else-if="good.type == 3" class="menu-btns">
                    <template v-if="cut" >
                        <template v-if="cut.status == 0" >
                            <template v-if=" cut.ismy == 1 " >
                                <div @click="KansuccessPopkanpay" class="btn bg-sec" v-if="good.botbuy == 1">
                                    {{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}
                                </div>
                                <div @click="openShareArea" class="btn lbg-pri">
                                    {{good.botbuy == 1 ? '邀友减价' : '邀请好友帮忙减价'}}
                                </div>
                            </template>
                            <template v-else >
                                <div @click="helpit" class="btn btn-gray" >帮Ta减价</div>
                                <div @click="joincut" class="btn lbg-pri">
                                    我也参加
                                </div>
                            </template>
                        </template>
                        <template v-if="cut.status == 1" >
                            <div v-if="cut.ismy == 1" class="btn bg-gray" style="color:#fff;background-color:#aeaeae;">
                                你已经完成了
                            </div>
                            <div v-else @click="joincut" class="btn lbg-pri">
                                我也参加
                            </div>
                        </template>
                        <template v-if="cut.status == 2">
                            <div v-if="cut.ismy == 1" @click="link" data-url="/cutlist" class="btn lbg-pri">
                                更多活动
                            </div>
                            <div v-else @click="joincut" class="btn lbg-pri">
                                我也参加
                            </div>
                        </template>
                    </template>
                    <template v-else >
                        <div @click="joincut" class="btn lbg-pri">
                            我也参加
                        </div>
                    </template>
                </div>

            </div>
            <div class="is-ipxa" v-if="isIPX"></div>
        </div>
            

            <!-- <div catchtouchmove="$InfoNone$true" v-if="{{!hideInfoNone && InfoNonelist.length > 0}}">
                <div class="popup-container __bottom popup-container--visible" style="display:block" >
                    <div bindtap="closeInfoNone" class="popup-shade"></div>
                    <div class="popup-modal popup-modal--half" style="{{$InfoNone$Popup$isIpx&&$InfoNone$Popup$dir!='bottom'?'padding-bottom: 68rpx;':''}}">
                        <div class="info-none">
                            <div class="tip">
                                <img class="tip_icon" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/91107/29/1417/840/5dbef24eE96eac266/5818e63b7e613ed6.png">
                                <font>手慢了亲，活动{{params.goodbname}}已被抢完</font>
                            </div>
                            <div class="tit">— 为您甄选 —</div>
                            <div class="act-list">
                                <navigator class="item thin-border_b" openType="navigateto" url="{{item.url}}" v-for="{{InfoNonelist}}" >
                                    <div class="top">
                                        <div class="image-box __60">
                                            <img mode="aspectFill" src="{{item.thumb}}">
                                        </div>
                                    </div>
                                    <div class="btm">
                                        <div class="btm_tit">{{item.title}}</div>
                                        <div class="btm-b">
                                            <div class="btm_price fmt-price">
                                                <div class="now color-pri">
                                                    <font class="dollar">¥</font>
                                                    <font class="price">{{item.show_price}}</font>
                                                </div>
                                            </div>
                                            <div class="btm_join" >
                                                <block v-if="{{item.type==4}}">
                                                    {{item.saled}}人参与
                                                </block>
                                                <block wx:else>{{params.fontsty == 33 || params.fontsty == 34?'报名':'已售' }}：{{item.saled}}</block>
                                            </div>
                                        </div>
                                    </div>
                                </navigator>
                            </div>
                            <div bindtap="closeInfoNone" class="close iconfont"></div>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="m-pop pop-container--visible" v-if="choupop">
                <div class="pop-shade" @click="choupopfn"></div>
                <div class="pop-modal" :class="choupop ? 'bounceInUp' : ''">
                    <div class="pop-userinfo">
                        <div class="tit">参与抽奖</div>
                        <div class="area">
                            <div class="tip">填写个人信息以便于联系兑奖</div>
                            <div class="row_inp thin-border_b" v-if="good.isexpress == 1">
                                <input name="tel" placeholder="请输入姓名" type="text" v-model="userinfo.name" style="flex: 1" />
                            </div>
                            <div class="row_inp thin-border_b">
                                <input name="tel" placeholder="请输入手机号" type="number" v-model="userinfo.tel" style="flex: 1" />
                            </div>
                            <div class="row_inp thin-border_b" v-if="good.isexpress == 1">
                                <input name="tel" placeholder="请输入地址" type="text" v-model="userinfo.address" style="flex: 1" />
                            </div>
                            <div class="row_btn">
                                <div class="btn" @click="sublott" >确认参与</div>
                            </div>
                            <div @click="choupopfn" class="close">
                                <font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <van-popup v-model="showrule" position="bottom" class="van-popup--round" :overlay="true">
                <div class="goodbuy_box">
                    <div class="goodbuy_top">
                        <div class="item_cell_box rule_top" style="align-items: center;">
                            <div class="goodbuy_top_l item_cell_flex item_cell_box">
                                <!-- <div class="goodbuy_top_price" >
                                    <font>￥{{rulefee > 0 ? rulefee*100/100 : (good.type == 2 ? good.show_price.price : good.show_price)}}</font>
                                    <font>，剩余{{rulestock > 0 ? rulestock : good.stock}}</font>
                                </div> -->
                                <div class="rule_topimg">
                                    <img :src="good.thumb">
                                </div>
                                <div class="item_cell_flex rule_topdesc">
                                    <div class="rule_topprice color-pri">
                                        ￥{{rulefee > 0 ? rulefee*100/100 : (good.type == 2 ? good.show_price.price : good.show_price)}}
                                    </div>
                                    <div class="rule_topstock">
                                        剩余 {{rulestock > 0 ? rulestock : 0}}件
                                    </div>
                                    <div class="rule_toprule" v-if="mapname">
                                        选择 {{mapname}}
                                    </div>
                                </div>
                            </div>
                            <div class="goodbuy_top_close van-icon van-icon-cross" @click="togglerule"></div>
                        </div>
                    </div>
                    <div scroll-y class="goodbuy_rule" v-if="good.isrule == 1">
                        <div class="goodbuy_rule_item" v-for="(item,index) in rule" :key="index">
                            <div class="rule_item_title">{{item.pro.title}}</div>
                            <div>
                                <div class="rule_item_name" :class="item.actitem == inn.id ? 'lbg-pri' : ''" v-for="(inn,idx) in item.data" :key="idx" @click="changeRule" :data-oid="item.pro.id" :data-tid="inn.id" >{{inn.name}}</div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div class="buy_confirm lbg-pri" @click="confirmcart" data-type="cart" v-if="showruletype == 'cart'">确定</div>
                    <div class="buy_confirm lbg-pri" @click="confirmrule" data-type="buy" v-else>确定</div>
                </div>
            </van-popup>

            <div class="m-pop pop-container--visible" v-if="tipshare">
                <div class="pop-shade" @click="tipsharefn"></div>
                <div class="pop-modal " :class="tipshare ? 'bounceInUp' : ''">
                    <div class="pop-userinfo">
                        <div class="area">
                            <div class="row_btn" >
                                <div class="tips mini_tips tc" >
                                    已成功参与活动 <font v-if="good.chousmaxs > 0">，邀请好友最多可再获得{{good.chousmaxs}}枚幸运码，增加中奖几率</font>
                                </div>
                                <div class="tips mini_tips tc" v-if="choupaktips">
                                    {{choupaktips}}
                                </div>
                                <div v-if="good.chousmaxs > 0" class="btn" @click="openShareArea" value="">立即获取更多幸运码</div>
                                <div formType="submit" v-if="choupaktips" class="btn" @click="link" data-url="/orderlist" style="margin-top: 30rpx;">查看订单</div>
                            </div>

                            <div @click="tipsharefn" class="close">
                                <font class="iconfont"></font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div @click="openShareArea" class="fenxiao-share" v-if="good.show_fx > 0.01 && params.ptopf != 1">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/44619/6/15562/1496/5dbef268Ebdc762f2/d1fc338c8c4e187e.png">约赚{{good.show_fx*100/100}}元
            </div>

            <div @click="openShareArea" class="btn-share" v-if="params.isgsrimg == 0">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/75027/19/14616/15432/5dbef283E55fd1d7a/d82fc2dd74051eb8.png">
            </div>

            <van-popup v-model="SharePopupshow" position="bottom" :overlay="true" @click-overlay="SharePopupshow = true">

                <div class="posterbox" v-if="posterurl">
                    <img @click="posterurlfn"  :src="posterurl" >
                </div>

                <div class="share-area">
                    <div class="item" v-if="good.sharedesc"  @click="link" :data-url="'goodsshare?id='+good.id">
                        <img src="http://img11.360buyimg.com/ddimg/jfs/t1/103560/23/4172/8220/5de4dfe9Eee327186/6a18d9c78ef7ea10.png">
                        <div>素材</div>
                    </div>
                    <div class="item" v-if="dev == 'app'" @click="wxshare('1')">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>分享好友</div>
                    </div>
                    <div class="item" v-if="dev == 'app'" @click="wxshare('2')">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>分享朋友圈</div>
                    </div>
                    <div class="item" @click.stop="shareit(true)" v-if="dev == 'wx'">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                        <div>分享给好友</div>
                    </div>
                    <div @click="shareposter" class="item" v-if="posterurl && dev == 'app'">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                        <div>分享海报</div>
                    </div>
                    <div @click="saveposter" class="item" v-if="posterurl && dev == 'app'">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70599/27/1062/4948/5cf5d8a7E1d3b8a1d/7f74b9b5814e0c6e.png">
                        <div>保存到相册</div>
                    </div>
                    <div @click="getPoster" class="item" v-if="!posterurl">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/79397/19/948/5580/5cf23bdbE11da7e29/b145f3c1ba828eba.png">
                        <div>生成海报</div>
                    </div>

                    <!-- <div @click="givefriend" class="item" v-if="params.ishwq == 0">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75393/18/949/4959/5cf23bd6E0ef3e754/fdfc53439a4c9b8f.png">
                        <div>推荐到好物圈</div>
                    </div> -->
                    <div @click="openShareArea" class="close">
                        <font class="iconfont"></font>
                    </div>
                </div>
            </van-popup>

            <van-action-sheet v-model="showshareposter" :actions="[{name:'发给好友',id:1},{name:'发到朋友圈',id:2}]" @select="onshareWXposter" />

            <div class="m-pop pop-container--visible" v-if="good.isorder == 1 && Popanimation">
                <div class="pop-shade"></div>
                <div class="pop-modal" :class="Popanimation ? 'bounceInUp':''">
                    <div class="infopop-wrap">
                        <div class="infopop-content">
                            <div class="info-orderpay">
                                <img class="topimg" src="http://img11.360buyimg.com/ddimg/jfs/t1/79873/21/14320/8712/5dbef2a6Ea772c099/0600fd3d50079f22.png">
                                <div class="area">
                                    <div class="tit">有订单未支付</div>
                                    <div class="txt">
                                        <font>您有一笔订单尚未支付请完成支付哦！</font>
                                    </div>
                                    <div class="btn_box">
                                        <div @click="cancelOrder" class="btn btn_cancel thin-border">取消订单</div>
                                        <div @click="link" class="btn btn_pay" :data-url="'/orderinfo?id='+good.waitorderid">现在支付</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @click="InfoOrderpayPop" class="infopop-close">
                            <font class="iconfont"></font>
                        </div>
                    </div>
                </div>
            </div>

        <div class="m-pop pop-container--visible" v-if="showqun">
            <div class="pop-shade"></div>
            <div class="pop-modal " :class="showqun ? 'bounceInUp':''">
                <div class="infopop-wrap">
                    <div class="infopop-content">
                        <div class="info-orderpay">
                            <img class="topimg" src="https://img11.360buyimg.com/ddimg/jfs/t1/40356/11/8583/21826/5cff1f05Ebcd60c9a/e1f88171888c30a4.png">
                            <div class="area">
                                <div class="txt">
                                    <img :src="params.qunqr" style="width:100%;">
                                </div>

                            </div>
                        </div>
                    </div>
                    <div @click="showqunfn" class="infopop-close">
                        <font class="iconfont"></font>
                    </div>
                </div>
            </div>
        </div>

        <van-popup v-model="isshowtags" position="bottom" :overlay="true" @click-overlay="isshowtags = false">
            <div class="tags-box">
                <div class="tags-item item_cell_box" v-if="good.quicklimit > 0 || good.buytimes > 0">
                    <div class="tags-l color-pri border-pri">限购</div>
                    <div class="tags-r item_cell_flex">{{good.quicklimit > 0 ? '每次仅限量购买'+good.quicklimit+'件' : ''}} {{good.buytimes > 0 ? '最多购买'+good.buytimes+'次' : ''}}</div>
                </div>
                <div class="tags-item item_cell_box" v-if="good.showjifen > 0">
                    <div class="tags-l color-pri border-pri">{{params.jfbname}}</div>
                    <div class="tags-r item_cell_flex">订单完成后赠送{{good.showjifen}}{{params.jfbname}}</div>
                </div>
                <div class="tags-item item_cell_box"  v-if="good.fanxm > 0">
                    
                    <div class="tags-l color-pri border-pri">返现</div>
                    <div class="tags-r item_cell_flex">
                        <div>订单完成后返现{{good.fanxm*100/100}}元</div>
                        <div v-if="good.fanxtype == 1 && good.fanxper">
                            <div v-for="(item,idx) in good.fanxper" :key="idx">第{{item.day}}天返{{item.per}}%</div>
                        </div>
                    </div>
                </div>
                <div class="tags-item item_cell_box" v-if="good.userpricejb > 0">
                    <div class="tags-l color-pri border-pri">会员</div>
                    <div class="tags-r item_cell_flex">{{params.cardname}}可使用{{params.umname}}下单，仅需{{good.userpricejb*100/100}}</div>
                </div>
            </div>
            <div class="buy_confirm lbg-pri" @click="isshowtags = false" >确定</div>
        </van-popup>

        <div v-if="popknow">
            <div @click="hidepopknow" class="login-fullbtn __show " >
            </div>
            <div class="login-content tipstop-box " :class="popknow ? 'bounceInUp' : ''">   
                <div class="tipstop bg-pri" v-if="good.type == 3 || good.type == 5">活动须知</div>
                <div class="tipstop bg-pri" v-else>{{params.fontsty == 33 || params.fontsty == 34?'报名':'购买' }}须知</div>

                <div class="content">
                    <div v-for="(item,index) in good.tips"  :key="index">{{item}}</div>
                </div>
                <div @click="popknowfn" class="btn bg-pri">知道了</div>
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
    import { Loading,List,Toast,Swipe,SwipeItem,Dialog,PullRefresh,ImagePreview,Lazyload,Popup,ActionSheet,Rate } from 'vant';
    import goodbar from '../../components/goodbar';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';
    
    export default {
        name: 'goodinfo',
        components: {
            [List.name] : List,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Swipe.name] : Swipe,
            [SwipeItem.name] : SwipeItem,
            [ImagePreview.name] : ImagePreview,
            [Lazyload.name] : Lazyload,
            [Popup.name] : Popup,
            [ActionSheet.name] : ActionSheet,
            [Rate.name] : Rate,
            goodbar,sharetip,subtip,
        },
        data : function(){
            return {
                thisgid : 0, // 缓存商品页面
                isrefresh : false,
                disrefresh : false,
                inited : false,
                params : {},
                userinfo : {},
                sharedata :{},
                groupmem : 0,
                Popanimation : false,
                HelpkanInfo : false,
                isIPX : false,
                commented : false,
                datalist : [],
                actendtime : null,
                options : {},
                commentpage : {
                    pdata : {
                        doo : 'comment',
                        op : 'list',
                        gid : 0,
                        page : 2,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                helppage : {
                    pdata : {
                        doo : 'help',
                        op : 'list',
                        page : 2,
                        cid : 0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                label : {},
                Tabcurrent : 'info',
                good : {},
                shop : {},
                fendian : [],
                userinfo : {},
                InfoNonelist : [],
                groups : [],
                redbag : {},
                KansuccessPop : false,
                cut : {},
                lottery : null,
                lottlist : [],
                awardlist : [],
                comment : [],
                commented : false,
                allcard : [],
                buyed : null,
                rule : {},
                rulemap : {},
                goodpak : [],
                tuijian : [],
                groupid : 0,
                groupmem : 0,
                Countdown : {},
                choupop : false,
                timer : null,
                SharePopupshow : false,
                showqun : false,
                posterurl : '',
                issharetip : false,
                helplisted : false,
                lat : 0,
                lng : 0,
                gid : 0,
                zfid : 0,
                cid : 0,
                shareid : 0,
                groupid : 0,
                reservations : false,
                tipshare : false,
                showrule : false,
                showruletype : '',
                rulefee : 0,
                rulestock : 0,
                rule : {},
                actmap : '',
                mapname : '',
                isshowshare:false,
                bindgoods : [],
                dev : '',
                devl : '',
                showshareposter : false,
                popknow : false,
                poptype : 0,
                popbuytype : 0,
                needsub : 0,
                isshowsub : false,
                music : false,
                audioplaying : false,
                footimg : {},
                isVideoShow : false,
                iconPlayShow : true,
                playing : false,
                maincolor : '',
                autoplay : 3000,
                sheight : 0,
                isshowtags : false,
                showallfd : false,
                initmusic : false,
                isclick : false,
            }
        },
        activated:function(e){
            var self = this;

            if( self.good && self.good.type != 5 ) {
                self.$util.http('good','GET',{gid:self.good.id,op:'iswaitpay'},function(res){
                    if (!res.errno && res.data) {
                        self.Popanimation = true;
                        self.good.isorder = res.data.isorder;
                        self.good.waitorderid = res.data.waitorderid;
                    }
                })
            }
            if( self.music && self.audioplaying ){
                self.music.play();
                self.audioplaying = true;
            }
            if( !this.$route.meta.gid || this.$route.meta.gid != this.$route.meta.oldgid  ){
                this.inited = false;
                this._setData();
                this.initData();
                
                this.$route.meta.keepAlive = false;
            }
        },
        beforeRouteEnter(to,from,next){
            to.meta.gid = to.query.id;
            next();
        },
        beforeRouteLeave(to,from,next){
            from.meta.oldgid = this.good.id;
            var meta = document.getElementsByTagName("meta");
            meta[6]["content"] = "unsafe-url";
            next();
        },
        beforeRouteUpdate(to,from,next){
            if( to.query.id && from.query.id && to.query.id != from.query.id ){
                this.inited = false;
                this._setData();
                this.initData(to.query.id);
            }
            next();
        },
        methods: {
            scrolltop(e){
                this.disrefresh = e <= 0 ? false : true;
            },
            onRefresh(){
                this.initData();
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            fetchData(){
                var params = this.$route;
                if( params.name != 'goodinfo' || params.query.id == this.thisgid ) {
                    return false;
                }

                this.inited = false;
                this._setData();
                this.initData();
            },
            change(index){
                var self = this;
                if( index == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.type = index;
                self.onLoad();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            linkself(e){
                this.$router.push({name:'goodinfo',query:{id:e.currentTarget.dataset.id}});
            },
            togglerule(){
                this.showrule = false;
            },
            confirmrule(){
                var self = this;
                if( self.good.isrule == 1 ){
                    for (var i = 0; i < self.rule.length; i++) {
                        if( !self.rule[i].actitem || typeof self.rule[i].actitem == 'undefined' ){
                            self.$toast('请选择'+self.rule[i].pro.title);return false;
                        }
                    }
                }
                if( !self.actmap || !self.mapname ){
                    self.$toast('请选择下单类型');return false;
                }

                self.$util.setCache('zfssbuy',{'gid':this.good.id,type:self.buytype,mapid:self.actmap,mapname:self.mapname,groupid:self.groupid});
                var tourl = '/orderconfirm';
                self.$router.push(tourl);
            },
            changeRule( e ){
                var self = this;
                for (var i = 0; i < self.rule.length; i++) {
                    if( self.rule[i].pro.id == e.currentTarget.dataset.oid ){
                        self.$set(self.rule[i],'actitem',e.currentTarget.dataset.tid);

                        var selectarr = [];
                        
                        for (var j = 0; j < self.rule.length; j++) {
                            if( self.rule[j].actitem ) {
                                selectarr.push( self.rule[j].actitem );
                            }
                        }
                        if( selectarr.length < self.rule.length ) return false;
                        
                        for (var j = 0; j < self.rulemap.length; j++) {
                            var thisstr = ( self.rulemap[j].id + '' ).split(":");
                            
                            if( thisstr.sort().toString() == selectarr.sort().toString() ){
                                
                                var ruleprice = self.buytype == 0 || !self.buytype ||  self.buytype == 6 ? (self.userinfo.level == 1 ? self.rulemap[j].uprice : self.rulemap[j].nowprice) : (self.userinfo.level == 1 ? self.rulemap[j].ugprice : self.rulemap[j].groupprice);

                                self.rulestock = self.rulemap[j].stock;
                                self.rulefee = ruleprice;
                                self.actmap = self.rulemap[j].id;
                                self.mapname = self.rulemap[j].name;
                                
                                return false;
                            }
                        }
                        return false;
                    }
                }
            },
            stype(e){
                this.sstype = e.currentTarget.dataset.type;
            },
            tabChange(e){
                this.Tabcurrent = e.currentTarget.dataset.index;
            },
            lookmore(){
                this.reservations = !this.reservations;
            },
            preimg(e){
                var pic = e.currentTarget.dataset.pic.split(",");
                ImagePreview({
                  images: pic,
                  startPosition: e.currentTarget.dataset.current*1,
				  closeOnPopstate : true
                });
            },
            InfoOrderpayPop(){
                this.Popanimation = false;
            },
            cancelOrder(){
                var self = this;
                self.$util.http('good','GET',{oid:self.good.waitorderid,op:'cancel'},function(res){
                    self.$toast(res.message);
                    if (!res.errno && res.data ) {
                        self.good.isorder = 0;
                        self.Popanimation = false;
                    }
                },true)
            },
            countdownfn(e){
                this.Countdown = e;
            },
            joinLottery(){
                if( this.good.over_type == 0 && this.lottery.status == 0 ){
                    this.choupop = true;
                }
            },
            choupopfn(){
                this.choupop = false;
            },
            sublott(){
                var self = this;
                var name = '';
                var tel = self.userinfo.tel;
                if( this.good.isinsever == 0 ){
                    self.$toast('不在可参与范围内');return false;
                }
                if( !tel || !self.$util.verify('mobile',tel) ){
                    self.$toast('请填写正确的联系电话');return false;
                }
                if( !self.userinfo.name && self.good.isexpress == 1 ){
                    self.$toast('请填写正确的姓名');return false;
                }
                if( !self.userinfo.address && self.good.isexpress == 1 ){
                    self.$toast('请填写正确的地址');return false;
                }

                if( self.needsub == 1 ){
                    self.isshowsub = true;
                    return false;
                }

                if( this.good.tips && this.good.popknow == 1 && !this.popknow ){
                    this.popknow = true;
                    this.poptype = 3;
                    return false;
                }

                if( self.good.chouprice > 0 && !self.ispayed ){
                    var postdata = {
                        op : 'payjoin',
                        gid : self.good.id
                    }
                    self.$util.http('lottery','GET',postdata,function(res){    
                        if (!res.errno && res.data) {
                            self.$util.setCache('zfssbuy','');
                            if( res.data.payed == 1 ){
                                self.sublottfn(name,tel);
                            }else{

                                if( res.data == 11 ){ // 测试的
                                    self.checkLottPay(name,tel);return false;
                                }
                                if( self.dev == 'wx' ){
                                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                        'appId' : res.data.appId, 
                                        'timeStamp': res.data.timeStamp,
                                        'nonceStr' : res.data.nonceStr,
                                        'package' : res.data.package,
                                        'signType' : res.data.signType,
                                        'paySign' : res.data.paySign
                                    }, function(resa) {
                                        if(resa.err_msg == 'get_brand_wcpay_request:ok') {
                                            self.checkLottPay(name,tel);
                                        }else{
                                            if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                                self.$toast('取消支付');
                                            }else{
                                                self.$toast('启动微信支付失败, 请检查你的支付参数. 详细错误为: ' + resa.err_msg);
                                            }
                                        }
                                    });
								}else if(self.dev == 'app'){
									var wxPay = api.require('wxPay');
									wxPay.payOrder({
										apiKey: res.data.appid,
										orderId: res.data.prepayid,
										mchId: res.data.partnerid,
										nonceStr: res.data.noncestr,
										timeStamp: res.data.timestamp,
										package: res.data.package,
										sign: res.data.sign,
									}, function(ret, err) {
										if (ret.status) {
											self.checkLottPay(name,tel);
										} else {
											alert(err.code);
										}
									});
								}else if(self.dev == 'wap'){
									location.href = res.data.mweb_url;
                                }else{    
                                    self.$toast('启动微信支付失败, 请检查你的支付参数.');
                                }
                            }
                        }else{
                            self.payed = false;
                            self.$toast(res.message);
                        }
                    },true);

                }else{
                    self.sublottfn(name,tel);
                }
            },
            sublottfn(name,tel){
                var self = this;
                var postdata = {
                    op:'join',
                    gid : self.good.id,
                    name : name ? name : '',
                    addname : self.userinfo.name ? self.userinfo.name : '',
                    address : self.userinfo.address ? self.userinfo.address : '',
                    tel : tel ? tel : '',
                    inviteid : self.zfid,
                }
                if( this.good.isinsever == 0 ){
                    self.$toast('不在可参与范围内');return false;
                }
                if( !postdata.tel || !self.$util.verify('mobile',postdata.tel) ){
                    self.$toast('请填写正确的联系电话');return false;
                }
                self.$util.http('lottery','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        self.lottery.list.push( res.data.code );
                        self.lottery.status = 1;
                        self.good.join = self.good.join + 1;
                        self.lottery.list = self.lottery.list;
                        self.choupop = false;
                        self.tipshare = true;
                        self.choupaktips = res.data.choupaktips ? res.data.choupaktips : false;
                        if( res.data.isopen == 1 ){
                            self.initData();
                        }

                    }else if( res.errno == 3 ){

                        Dialog.confirm({
                          message: res.message,
                          confirmButtonText : '购买会员',
                        }).then(() => {
                            self.$util.setCache('zfssbuy','');
                            self.$router.push('/buycard');
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            checkLottPay(name,tel){
                var self = this;
                if( self.ispayed ) return false;
                Toast.loading({
                    mask: true,
                    message: '处理中'
                });
                setTimeout(function(){
                    var postdata = {
                        op : 'ispayed',
                        gid : self.good.id,
                    }
                    self.$util.http('lottery','GET',postdata,function(res){     
                        if (!res.errno && res.data ) {
                            self.ispayed = 1;
                            self.sublottfn(name,tel);
                        }else if ( res.errno == 1 ) {    
                            self.checkLottPay(name,tel);
                        }
                    },true);
                },1500);
            },
            tipsharefn(){
                this.tipshare = !this.tipshare;
            },
            joincut(){
                var self = this;               
                if( this.good.isinsever == 0 ){
                    self.$toast('不在销售范围内');return false;
                }
                if( this.good.isintime == 0 ){
                    self.$toast('不在下单时间内');return false;
                }

                if( self.needsub == 1 ){
                    self.isshowsub = true;
                    return false;
                }

                if( this.good.tips && this.good.popknow == 1 && !this.popknow ){
                    this.popknow = true;
                    this.poptype = 2;
                    return false;
                }

                self.$util.http('cut','GET',{gid:self.good.id,op:'join'},function(res){
                    if (!res.errno && res.data) {

                        self.cut = res.data.cut;
                        self.HelpkanInfo = true;
                        self.helpkantxt = res.data.downinfo.txt;
                        self.sharedata.path = '/zofui_sales/pages/good/good?id='+self.good.id+'&zfid='+self.userinfo.id+'&cid='+res.data.cut.id;
                        self.sharedata.link = '/goodinfo?id='+self.good.id+'&zfid='+self.userinfo.id+'&cid='+res.data.cut.id;

                        setTimeout(function(){
                            self.$router.push('/goodinfo?id='+self.good.id);
                            self.initData();
                        },2000)

                    }else if( res.errno == 3 ){
                        Dialog.confirm({
                            title: '提示',
                            message: res.message,
                            'confirm-button-text' : '购买会员',
                        }).then(() => {
                            self.$router.push('/buycard');
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true)
            },
            incart(){
                var self = this;
                var postdata = {
                    op : 'add',
                    id : self.good.id,
                    mapid : self.actmap ? self.actmap : 0,
                    mapname : self.mapname ? self.mapname : 0,
                };
                
                self.$util.http('cart','POST',postdata,function(res){      
                    self.$toast(res.message);
                    if (!res.errno && res.data) {
                        
                        self.showrule = false;
                        self.params.cartnum = res.data.nownum;
                        
                    }
                },true);
            },
            confirmcart(){
                this.incart();
            },
            helpit(){
                var self = this;
                var postdata = {cid:self.cut.id,op:'help'};
                self.$util.http('cut','GET',postdata,function(res){    
                    if (!res.errno && res.data) {
                        self.HelpkanInfo = true;
                        self.helpkantxt = res.data.downinfo.txt;
                    }else if( res.errno == 2 ){
                        self.isshowsub = true;
                    }else{
                        self.$toast(res.message);
                    }
                },true)
            },
            kanInfoclose(){
                this.HelpkanInfo = false;
            },
            takecard(e){
                var self = this;
                var status = e.currentTarget.dataset.status;
                if( status == '0' || status == 0 ) return false;

                var postdata = {
                    op : 'takecard',
                    id : e.currentTarget.dataset.id,
                };
                self.$util.http('card','GET',postdata,function(res){
                    if (!res.errno && res.data) {
                        for (var i = 0; i < self.allcard.length; i++) {
                            if( self.allcard[i].id == postdata.id ){
                                self.allcard[i].istaked = 1;
                                return false;
                            }
                        }
                        self.$toast(res.message);
                    }else if( res.errno == 2 ){

                        Dialog.confirm({
                            title: '提示',
                            message: '23131',
                            'confirm-button-text' : '购买会员',
                        }).then(() => {
                            self.$router.push('/buycard');
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            bindCollect(e){
                var self = this;
                self.$util.http('good','GET',{gid:self.good.id,op:'collect'},function(res){
                    if ( res.errno == 2 ) {
                        self.$toast('已加入收藏');
                        self.good.iscollect = true;
                    }else if(res.errno == 3){
                        self.$toast('已取消收藏');
                        self.good.iscollect = false;
                    }else{
                        self.$toast(res.message);
                    }
                },true)
            },
            hidepopknow(){
                this.popknow = false;
            },
            popknowfn(){
                if( this.poptype == 1 ){
                    var e = {
                        currentTarget : {
                            dataset : {
                                type : this.popbuytype
                            }
                        }
                    };
                    this.buyit(e);
                }else if(this.poptype == 2){
                    this.joincut();
                }else if(this.poptype == 3){
                    this.sublott();
                }
                this.popknow = false;
            },
            buyit(e){   
                var self = this;
                var type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : 0;

                // 存在订单
                if( this.good.isorder == 1 ){
                    this.Popanimation = true;
                    return false;
                }
                if( this.good.isinsever == 0 ){
                    self.$toast('不在销售范围内');return false;
                }
                if( this.good.isintime == 0 ){
                    self.$toast('不在下单时间内');return false;
                }

                if( self.needsub == 1 ){
                    self.isshowsub = true;
                    return false;
                }

                if( this.good.tips && this.good.popknow == 1 && !this.popknow ){
                    this.popknow = true;
                    this.poptype = 1;
                    this.popbuytype = type;
                    return false;
                }

                /*this.rulestock = 0;
                this.rulefee = 0;*/

                if( this.good.isrule == 1 ){
                    this.showrule = true;
                    this.showruletype = 'buy';
                    this.buytype = type;
                }else{
                    // 0正常购买 1拼团
                    self.$util.setCache('zfssbuy',{'gid':this.good.id,type:type,groupid:this.groupid,groupmem:this.groupmem});
                    self.$router.push('/orderconfirm');
                }
            },
            jingroupstart(mem,price){
                var e = {
                    currentTarget : {
                        dataset : {
                            m : mem,
                            price : price,
                        }
                    },
                    pass : 1,
                }
                this.getGroupprice(e);
            },
            getGroupprice(e){
                if( this.options.from == 'group' && !e.pass ){
                    return false;
                }
                this.groupmem = e.currentTarget.dataset.m;
                this.good.groupmem = e.currentTarget.dataset.m;
                this.good.show_price.gprice = e.currentTarget.dataset.price;
            },
            openShareArea : function(e){
                this.SharePopupshow = !this.SharePopupshow;
            },
            showqunfn : function(){
                this.showqun = !this.showqun;
            },
            posterurlfn(){
                ImagePreview({
                    images : [this.posterurl]
                })
            },
            sharetipfb(){
                this.issharetip = true;
            },
            wxshare(type){
                var self = this;
                var wx = api.require('wx');

                var scene = 'timeline';
                if( type == '1' ){
                    scene = 'session';
                }

                wx.shareWebpage({
                    apiKey: '',
                    scene: scene,
                    title: self.sharedata.title,
                    description: self.sharedata.desc,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.sharedata.link
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
            shareposter(){
                this.showshareposter = true;
            },
            onshareWXposter(item){
                var self = this;
                var scene = 'session';
                if(item.id == 2){
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
            getPoster(){
                var self = this;
                var postdata = {
                    op:'goods',
                    gid:self.good.id,
                    path:self.sharedata.link,
                    dev : self.dev,
                };
                self.$util.http('poster','GET',postdata,function(res){    
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        Dialog.alert({
                            message: '可将图片保存到本地相册和发给好友！'
                        }).then(() => {
                            if( self.dev == 'app' ){

                            }else{
                                ImagePreview({
                                    images : [res.data.url],
                                    closeOnPopstate : true,
                                    showIndicators : true,
                                })
                            }
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            givefriend(){
                var self = this;
                if( self.good.ishwq == 0 || !self.good.ishwq ){
                    self.$util.http('good','GET',{op:'tuijian',gid:self.good.id},function(res){     
                        if (!res.errno && res.data ) {
                            self.openBusinessView();
                        }else{
                            self.$toast(res.message);
                        }
                    },true);
                }else{
                    self.openBusinessView();
                }
            },
            openBusinessView(){

            },
            KansuccessPopclose(){
                this.KansuccessPop = false;
            },
            KansuccessPopkanpay(){
                var self = this;
                // 4 砍价订单
                self.$util.setCache('zfssbuy',{'cid':this.cut.id,type:4});
                self.$router.push('/orderconfirm');
            },
            morecomment(){
                var self = this;
                self.commentpage.pdata.gid = self.good.id;
                self.$util.pageList(self,self.commentpage,function(res){
                    if( res && res.data && res.data.list.length > 0 ){        
                        self.comment = self.comment.concat(res.data.list)
                    }else{
                        self.commented = true;
                    }
                },true,false,'commentpage');
            },
            morehelp(){
                var self = this;
                self.helppage.pdata.cid = self.cut.id;
                self.$util.pageList(this,this.helppage,function(res){
                    if( res && res.data && res.data.list.length > 0 ){        
                        self.cut.helplist = self.cut.helplist.concat(res.data.list)
                    }else{
                        self.helplisted = true;
                    }
                });
            },
            joincart(){
                var self = this;
                if( self.good.isinsever == 0 ){
                    self.$toast('不在销售范围内');return false;
                }
                if( self.good.isrule == 1 ){
                    self.showrule = true;
                    self.showruletype = 'cart';
                }else{
                    self.incart();
                }
            },
            incart(){
                var self = this;
                
                var postdata = {
                    op : 'add',
                    id : self.good.id,
                    mapid : self.actmap ? self.actmap : 0,
                    mapname : self.mapname ? self.mapname : 0,
                };

                self.$util.http('cart','GET',postdata,function(res){    
                    self.$toast(res.message);
                    if (!res.errno && res.data) {
                        self.showrule = false
                        self.params.cartnum = res.data.nownum;
                    }
                },true);
            },
            hidepopsub(){
                this.isshowsub = false;
            },
            replaybg(){
                if(this.music.paused) {
                    this.music.play();
                    this.audioplaying = true;
                } else {
                    this.music.pause();
                    this.audioplaying = false;
                }
            },
            playvideo(event) {
                let video = document.getElementById('videoid');
                this.isVideoShow = false;
                this.iconPlayShow = false
                this.playing = true;
                video.play();
            },
            pauseVideo() { //暂停\播放
                let video = document.getElementById('videoid')
                if (this.playing) {
                    video.pause()
                    this.iconPlayShow = true
                } else {
                    video.play()
                    this.iconPlayShow = false
                }
                this.playing = !this.playing
            },
            stopswiper(e){
                this.autoplay = 0;
            },
            loadswip(e){
                if( e.path[0].height > 0 && e.path[0].height > this.sheight ){
                    this.sheight = e.path[0].height;
                }
            },
            playMusic(){
                var self = this;
                setTimeout(function(){

                },100)
            },
            initData(gid){
                var self = this;

                var meta = document.getElementsByTagName("meta");
                meta[6]["content"] = "no-referrer";

                self.dev = self.$util.dev();

                document.getElementById('bgMusic').pause();
                document.addEventListener('touchstart',function(){
                    if( !self.isclick && self.music ){
                        self.music.play();
                        self.isclick = true;
                    }
                });

                var u = navigator.userAgent;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                self.devl = isiOS ? 'apple' : 'andr';

                var query = this.$route.query;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.lat = loc.lat;
                if( loc.lng ) self.lng = loc.lng;

                var postdata = {
                    op : 'info',
                    gid : gid ? gid : (query.id ? query.id : 0),
                    zfid : (query.zfid ? query.zfid : 0),
                    cid : (query.cid ? query.cid : 0),
                    shareid : (query.shareid ? query.shareid : 0),
                    groupid : (query.groupid ? query.groupid : 0),
                    lat : self.lat,
                    lng : self.lng,
                }
                self.gid = postdata.gid;
                self.zfid = postdata.zfid;
                self.cid = postdata.cid;
                self.shareid = postdata.shareid;
                self.groupid = postdata.groupid;
                
                self.$util.http('good','GET',postdata,function(res){
					self.inited = 1;

                    if( res && !res.errno ){     
                          
                        var shopsty = res.data.params.shopbname;
                        var goodsty = res.data.params.goodbname;
                        var commsty = res.data.params.fontsty == 33?'驾校点评':'商品评价';
						if( res.data.params.fontsty == 34 ) commsty = '学员评价';

                        var label = res.data.good.type == 4 ? [{n:'活动详情',id:'info'},{n:'活动评价',id:'comment'}] : [{n:goodsty+'详情',id:'info'},{n:commsty,id:'comment'}];
                        if( res.data.good.type == 5 ) var label = [{n:goodsty+'详情',id:'info'}];
                        if( res.data.good.type == 3 ){
                            var label = [{n:goodsty+'详情',id:'info'},{n:commsty,id:'comment'}];
                            if( res.data.cut && res.data.cut.ismy ){
                               var label = [{n:goodsty+'详情',id:'info'},{n:'助力榜单',id:'help'}];
                            }
                        }
                        if( res.data.params.gsinfo == 1 ){
                            label.splice(0, 0, {n:shopsty+'介绍',id:'shop'});
                        }

                        self.label = label
                        self.Tabcurrent = 'info'
                        self.good = res.data.good
                        self.thisgid = self.good.id; // 缓存页面
                        self.shop = res.data.shop
                        self.fendian = res.data.fendian
                        self.params = res.data.params
                        self.userinfo = res.data.userinfo
                        self.InfoNonelist = res.data.more ? res.data.more : false
                        self.groups = res.data.groups
                        self.sharedata = res.data.sharedata
                        self.redbag = res.data.redbag ? res.data.redbag : false

                        self.KansuccessPop = res.data.cut && res.data.cut.status == 1 && res.data.cut.ispay == 0 && res.data.cut.ismy == 1 ? true : false
                        self.cut = res.data.cut ? res.data.cut : false
                        self.lottery = res.data.lottery ? res.data.lottery : false
                        self.lottlist = res.data.lottlist ? res.data.lottlist : false
                        self.awardlist = res.data.awardlist ? res.data.awardlist : false
                        self.comment = res.data.comment ? res.data.comment : [];
                        self.allcard = res.data.allcard ? res.data.allcard : [];
                        self.buyed = res.data.buyed ? res.data.buyed : false;

                        self.rule = res.data.good.rulearray ? res.data.good.rulearray.rule : {};
                        self.rulemap = res.data.good.rulearray ? res.data.good.rulearray.rulemap : {};
                        self.goodpak = res.data.goodpak ? res.data.goodpak : [];
                        self.tuijian = res.data.tuijian ? res.data.tuijian : [];
                        self.bindgoods = res.data.bindgoods ? res.data.bindgoods : [];
                        self.needsub = res.data.needsub;
                        self.footimg = res.data.footimg ? res.data.footimg : {};
                               
                        if( self.cid && res.data.cut && !res.data.cut.ismy ){
                            self.helpit();
                        }

                        // 自动参与
                        if( self.good.type == 5 && self.good.isopenlott == 0 && self.good.over_type == 0 ){
                            if( self.lottery.status == 0 ) {
                                self.joinLottery();
                            }
                            if( self.lottery.status == 1 && self.good.chousmaxs > 0 ) {
                                self.tipshare = true;
                            }
                        }

                        if( self.good.thisgroupmember > 0 ){
                            self.jingroupstart(self.good.thisgroupmember,self.good.thisgroupprice);
                        }
                        
                        if( self.good.music ){
                            self.music = document.getElementById('bgMusic');
                            self.audioplaying = true;
                            self.music.play();
                        }
                        self.initmusic = true;
                        
                        window.document.title = self.good.title;
                        self.$util.share(wx,self.sharedata);
                        self.$emit('loadmessage',{title:self.good.title});

                        self.countTime();
                        self.inited = 2;
                        
                        self.maincolor = self.$util.themcolor(self.params.style);

                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
                        }
                        
                    }else{
                        self.$toast(res.message);
                    }
                    self.isrefresh = false;
                });
            },
            countTime(){
                var self = this;

                clearInterval(self.timer);
                self.timer = null;

                if( self.groups && self.groups.length > 0 ){

                    self.timer = setInterval(function(){

                        var date = new Date();
                        var time = date.getTime();
                        for (var i = 0; i < self.groups.length; i++) {
                            var item = self.groups[i];
                            var endTime = item.end + '000';
                            var lag = (endTime*1 - time);
                            if(lag > 0){
                                var second = Math.floor(lag/1000%60);     
                                var minite = Math.floor(lag/1000/60%60);
                                var hour = Math.floor(lag/1000/60/60%24);
                                var day = Math.floor(lag/1000/60/60/24);
                            }else{
                                var second = '0';
                                var minite = '0';
                                var hour = '0';
                                var day = '0';
                            }
                            self.$set(item,'time',{day:day,hour:hour,minite:minite,second:second});
                        }
                    },1000);
                }
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
            _setData(){
                this.isrefresh = false
                this.inited = false
                this.params = {}
                this.userinfo = {}
                this.sharedata = {}
                this.groupmem = 0
                this.Popanimation = false
                this.HelpkanInfo = false
                this.isIPX = false
                this.commented = false
                this.datalist = []
                this.actendtime = null
                this.options = {}
                this.commentpage = {
                    pdata : {
                        doo : 'comment',
                        op : 'list',
                        gid : 0,
                        page : 2,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                };
                this.helppage = {
                    isend : false,
                    doing : false,
                    pdata : {
                        doo : 'help',
                        op : 'list',
                        page : 2,
                        cid : 0,
                    },
                    geting : false,
                    initget : false,
                };
                this.label = {}
                this.Tabcurrent = 'info'
                this.good = {}
                this.shop = {}
                this.fendian = []
                this.userinfo = {}
                this.InfoNonelist = []
                this.groups = []
                this.redbag = {}
                this.KansuccessPop = false
                this.cut = {}
                this.lottery = null
                this.lottlist = []
                this.awardlist = []
                this.comment = []
                this.allcard = []
                this.buyed = null
                this.rule = {}
                this.rulemap = {}
                this.goodpak = []
                this.tuijian = []
                this.groupid = 0
                this.groupmem = 0;

                this.Countdown = {}
                this.choupop = false
                this.timer = null
                this.SharePopupshow = false
                this.showqun = false
                this.posterurl = ''
                this.issharetip = false
                this.helplisted = false
                this.lat = 0
                this.lng = 0
                this.gid = 0
                this.zfid = 0
                this.cid = 0
                this.shareid = 0
                this.groupid = 0
                this.reservations = false
                this.tipshare = false
                this.showrule = false
                this.showruletype = ''
                this.rulefee = 0
                this.rulestock = 0
                this.rule = {}
                this.actmap = ''
                this.mapname = ''
                this.isshowshare=false
                this.bindgoods = []
                this.dev = ''
                this.devl = ''
                this.showshareposter = false
                this.popknow = false
                this.poptype = 0
                this.popbuytype = 0
                this.needsub = 0
                this.isshowsub = false
                this.music = false
                this.audioplaying = false
                this.footimg = {}
                this.isVideoShow = false
                this.iconPlayShow = true
                this.playing = false
                this.maincolor = ''
                this.autoplay = 3000
                this.sheight = 0
                this.showallfd = false;
                this.initmusic = false;
                this.isclick = false;
            }
        }
    }
</script>


<style type="text/css" scoped>

@import "../../assets/css/iconfont.css";
@import "../../assets/css/login.css";
@import "../../assets/css/vipcss.css";
#main{
    background-color: #fff;
}
.loadinfo{
    width: 25px;
    height: 25px;
    margin: 0 auto;
    display: block;
    margin-top: 15px;
}

.info-none {
    position: relative;
    padding: 0 20px;
    background-color: #fff;
}

.info-none .tip {
    padding-top: 10px;
    font-size: 15px;
    text-align: center;
    line-height: 22px;
    color: #999;
}

.info-none .tip_icon {
    vertical-align: top;
    width: 22px;
    height: auto;
    margin-right: 8px;
}

.info-none .tit {
    padding: 10px 0;
    font-size: 14px;
    text-align: center;
    color: #222;
}

.info-none .close {
    position: absolute;
    top: 100%;
    left: 50%;
    margin: 15px 0 0 -15px;
    font-size: 30px;
    font-weight: 200;
    color: #fff;
}
.HelpkanInfo .close {
    position: absolute;
    top: 100%;
    left: 50%;
    margin: 15px 0 0 -15px;
    font-size: 30px;
    font-weight: 200;
    color: #fff;
}

.info-comment {
    margin-top: -12px;
}

.info-comment .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 12px 0;
    align-items: flex-start;
}

.info-comment .item:last-child:after {
    visibility: hidden;
}

.info-comment .item .lt {
    width: 34px;
    -webkit-box-flex: 34px;
    flex: 34px 0 0;
    margin-right: 10px;
}

.info-comment .item .rt {
    -webkit-box-flex: 1;
    flex: 1;
}

.info-comment .lt_avatar {
    overflow: hidden;
    border-radius: 50%;
}

.info-comment .rt_name {
    font-size: 13px;
    line-height: 19px;
    color: #222;
}

.info-comment .rt_date {
    font-size: 10px;
    line-height: 15px;
    color: #a2a2a2;
}
.info-comment .rt_star{
    height: 20px;
    line-height: 20px;
}
.info-comment .rt_star img{
    width: 15px;
    height: 15px;
    display: inline-block;
}

.info-comment .rt_msg {
    padding-top: 10px;
    font-size: 12px;
    line-height: 18px;
    color: #5b5b5b;
}

.info-comment .rt_pic {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-align: center;
    align-items: center;
    padding-top: 8px;
    margin-left: -6px;
}

.info-comment .rt_pic .pic {
    width: 25%;
    padding-left: 6px;
    margin-bottom: 6px;
    box-sizing: border-box;
}

.info-comment .rt_pic .pic img {
    width: 100%;
}

.info-comment .rt_reply {
    position: relative;
    padding: 12px 14px;
    margin-top: 6px;
    font-size: 12px;
    background-color: #f6f6f6;
}

.info-comment .rt_reply:before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 15px;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #f6f6f6 transparent;
}

.info-contents {
    padding: 10px 0;
}

.info-contents .contents-item {
    display: none;
}

.info-contents .contents-item.active {
    display: block;
}

.detail-content {
    position: relative;
    overflow: hidden;
    height: auto;
    max-height: 330px;
}

.detail-content.auto {
    max-height: none;
}

.detail-content.auto:after {
    display: none;
}

.detail-content:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),to(#fff));
    background: linear-gradient(rgba(255,255,255,0),#fff);
}

.detail-btn {
    position: relative;
    padding-top: 10px;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    color: #222;
}

.detail-btn .iconfont {
    display: inline-block;
    vertical-align: top;
    margin-left: 5px;
}

.detail-btn.show .iconfont {
    transform: rotate(180deg);
}

.detail-nomore {
    padding: 35px 0;
    font-size: 14px;
    text-align: center;
    color: #626262;
}

.group-top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 14px;
    line-height: 17px;
}

.group-top .tit {
    color: #222;
}

.group-top .more {
    color: #999;
}

.group-lists .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 20px 0;
}

.group-lists .item_avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
}

.group-lists .item_name {
    -webkit-box-flex: 1;
    flex: 1;
    margin: 0 8px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: box;
    display: -webkit-box;
}

.group-lists .item_info {
    font-size: 14px;
    text-align: right;
    line-height: 22px;
    color: #666;
}

.group-lists .item_info .num {
    font-size: 17px;
}

.group-lists .item_btn {
    height: 34px;
    padding: 0 15px;
    margin-left: 10px;
    font-size: 15px;
    line-height: 34px;
    border-radius: 3px;
}

.group-mine {
    padding: 25px 0;
    text-align: center;
}

.group-mine .mine_group {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: center;
    justify-content: center;
    margin: 0 0 10px -25px;
}

.group-mine .mine_group .item {
    position: relative;
    width: 56px;
    height: 56px;
    margin: 0 0 10px 25px;
    line-height: 56px;
}

.group-mine .mine_group .item img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.group-mine .mine_group .item .tag {
    display: none;
    position: absolute;
    top: 0;
    left: -8.5px;
    z-index: 2;
    padding: 0 4px;
    font-size: 10px;
    line-height: 14px;
    color: #222;
    border-radius: 1.5px;
    background-color: #fdc90b;
}

.group-mine .mine_group .item:before {
    content: '?';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0.5px dashed #979797;
    font-size: 18px;
    line-height: inherit;
    color: #a7a7a7;
    box-sizing: border-box;
    border-radius: 50%;
}

.group-mine .mine_group .item:first-child .tag {
    display: block;
}

.group-mine .tips {
    margin-bottom: 11.5px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
}

.group-mine .btn {
    height: 45px;
    font-size: 15px;
    line-height: 45px;
    border-radius: 6px;
}

.group-popup {
    position: relative;
    height: 100%;
    box-sizing: border-box;
}

.group-popup .scroll {
    position: absolute;
    top: 0;
    bottom: 48px;
    width: 100%;
}

.group-popup .lists {
    padding: 0 15px;
}

.info-sign {
    padding: 10px 0;
}

.info-sign .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 10px 0;
    line-height: 22px;
}

.info-sign .top_num {
    font-size: 17px;
    color: #222;
}

.info-sign .top_kucun {
    font-size: 14px;
    color: #999;
}

.info-sign .list {
    overflow: hidden;
    padding: 10px 0;
    margin-left: -15px;
}

.info-sign .list .item {
    float: left;
    width: 14.2857%;
    padding-left: 15px;
    box-sizing: border-box;
}

.info-sign .list .item .img {
    border-radius: 50%;
}

.info-step .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 84px;
    font-size: 12px;
}

.info-step .item:last-child:after {
    visibility: hidden;
}

.info-step .item .lt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.info-step .item .rt {
    width: 30%;
    margin-left: 10px;
}

.info-step .lt_price {
    font-size: 14px;
    line-height: 1;
}

.info-step .lt_price font {
    font-size: 24px;
}

.info-step .lt_range {
    margin-left: 5px;
    font-size: 14px;
    color: #222;
}

.info-step .rt_kucun {
    font-size: 12px;
    line-height: 18px;
    color: #999;
}

.info-step .rt_progress {
    overflow: hidden;
    height: 9px;
    margin-top: 6px;
    background-color: #e5e5e5;
    border-radius: 4.5px;
}

.info-step .rt_progress .inner {
    width: 0;
    height: 100%;
    background-color: #fc9127;
}

.redbag-tap {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 44px;
    font-size: 13px;
    color: #787878;
}

.redbag-tap .txt {
    -webkit-box-flex: 1;
    flex: 1;
    height: 1em;
    padding: 0 15px;
    line-height: 1em;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.redbag-popup {
    background-color: #f2f2f2;
}

.redbag-popup .topbar {
    position: relative;
    z-index: 1;
    font-size: 16px;
    text-align: center;
    line-height: 42px;
    color: #313131;
    background-color: #fff;
    box-shadow: 0 0 0.5px 0 rgba(0,0,0,0.1);
}

.redbag-popup .top_tit {
    position: relative;
    display: inline-block;
    vertical-align: top;
}

.redbag-popup .top_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 42px;
    font-size: 20px;
    text-align: center;
}

.redbag-popup .content {
    max-height: 300px;
}

.info-orderpay .topimg {
    width: 100%;
    height: 121px;
    margin-bottom: 15px;
    margin-top: -10px;
}

.info-orderpay .area {
    padding: 0 20px;
}

.info-orderpay .tit {
    margin-bottom: 20px;
    font-size: 18px;
    color: #222;
}

.info-orderpay .btn_box {
    padding-top: 25px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.info-orderpay .btn_box .btn {
    width: 100px;
    height: 33px;
    margin: 0;
    font-size: 14px;
    line-height: 33px;
    color: #fff;
    border-radius: 5px;
}

.info-orderpay .btn_box .btn_cancel {
    color: #222;
    border-color: #222;
    border-radius: 10px;
}

.info-orderpay .btn_box .btn_pay {
    background-color: #F23723;
}

.info-help {
    background-color: #fff;
    border-radius: 7.5px;
}

.info-help .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 15px 0;
}

.info-help .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 15px 0;
    font-size: 14px;
    color: #222;
}

.info-help .top_price {
    font-size: 12px;
    line-height: 20px;
    color: #222;
}

.info-help .top_price .price {
    font-size: 25px;
}

.info-help .top_btn {
    height: 35px;
    padding: 0 12.5px;
    margin: 0;
    font-size: 13px;
    line-height: 35px;
    border-radius: 17.5px;
}

.info-help .btm_pic {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
}

.info-help .btm_pic .item {
    overflow: hidden;
    width: 30px;
    height: 30px;
    margin-left: 4px;
    font-size: 15px;
    text-align: center;
    line-height: 23px;
    color: #b5b5b5;
    background-color: #eee;
    border-radius: 50%;
}

.info-help .btm_pic .item img {
    width: 100%;
    height: 100%;
}

.info-top {
    position: relative;
}

.info-top .top-countdown {
    height: 30px;
    margin: -25px -20px 0;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background-color: rgba(0,0,0,0.3);
}

.info-top .o-top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-top: 10px;
    margin-bottom: 20px;
}

.info-top .o-top .top-rt {
    /*-webkit-box-flex: 80px;
    flex: 80px 0 0;*/
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    /*width: 20px;*/
    margin-left: 10px;
}

.info-top .top_tit {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
    color: #222;
}

.info-top .top_tit .tag {
    display: inline-block;
    vertical-align: top;
    height: 19px;
    padding: 0 5px;
    margin: 3px 3px 0 0;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
}

.info-top .top_func {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 10px;
    text-align: center;
    color: #666;
    min-width: 30px;
}

.info-top .top_func .iconfont {
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    line-height: 29px;
}

.info-top .o-price {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: 20px;
    font-size: 13px;
    line-height: 15px;
    color: #999;
}

.info-top .price_now {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
}

.info-top .price_now .num {
    font-size: 25px;
}

.info-top .price_old {
    display: inline-block;
    margin-left: 7.5px;
    text-decoration: line-through;
}
.price_fan{
  display: inline-block;
  color: #fff;
  border-radius: 2.5px;
  padding: 2px 5px;
  margin-left: 2.5px;
}
.info-top .o-vip {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 8.5px 5px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 18px;
    background-color: #F8F8F8;
}

.info-top .o-vip .vip-ct {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 0 7.5px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.info-top .vip_name {
    padding-right: 7px;
    font-size: 10px;
    color: #fff;
    background-color: #4f473e;
}

.info-top .vip_name .iconfont {
    display: inline-block;
    vertical-align: top;
    width: 18px;
    height: 16px;
    margin-right: 7px;
    text-align: center;
    background-color: #000;
}

.info-top .o-info {
    margin-bottom: 10px;
}

.info-top .o-info .item {
    position: relative;
    padding-left: 25px;
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 19px;
    color: #666;
}

.info-top .o-info .item .iconfont {
    position: absolute;
    top: 0;
    left: 0;
}

.info-top .o-discount {
    padding: 10px 0;
}

.info-top .discount_list {
    overflow: hidden;
    margin-left: -10px;
}

.info-top .discount_list .item {
    float: left;
    height: 20px;
    padding: 0 4px;
    margin: 5px 0 5px 10px;
    border-color: #fc9127;
    font-size: 12px;
    line-height: 20px;
    color: #fc9127;
    border-radius: 6px;
}

.top-swiper {
    position: fixed;
    top: 40px;
    left: 15px;
    z-index: 5;
    width: 190px;
    height: 28px;
    padding: 0 3px;
    font-size: 11px;
    color: #fff;
    background-color: rgba(0,0,0,0.6);
    box-sizing: border-box;
    border-radius: 14px;
    opacity: 0;
    padding-top: 3px;
}

.top-swiper:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.top-swiper swiper-item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.top-swiper .avatar {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 50%;
}

.top-swiper .txt {
    -webkit-box-flex: 1;
    flex: 1;
    height: 23px;
    padding-right: 10px;
    line-height: 22px;
    overflow: hidden;
    display: box;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-left: -8px;
}

.fade-in {
    opacity: 1;
    transition: opacity 0.5s;
}

.fenxiao-share {
    position: fixed;
    top: 40px;
    right: 0;
    height: 28px;
    padding: 0 8px;
    font-size: 13px;
    line-height: 28px;
    color: #222;
    background-color: rgba(255,255,255,0.8);
    border-radius: 14px 0 0 14px;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
}

.fenxiao-share img {
    display: inline-block;
    vertical-align: top;
    width: 18px;
    height: 18px;
    margin: 5px 8px 0 0;
}

.sharebox {
    top: 25px!important;
}

.kan-success {
    position: absolute;
    left: 11%;
    top: 40%;
    width: 78%;
    padding-bottom: 32px;
    background-color: #fff;
    border-radius: 2px;
    transform: translateY(-50%);
    padding-top: 52px;
    font-size: 16px;
}

.kan-success .top-img {
    height: 102px;
    position: absolute;
    width: 100%;
    left: 0;
    top: -20%;
}

.kan-success .title {
    font-weight: 500;
    text-align: center;
    color: #E74C3C;
}

.kan-success .content {
    padding: 0 40px;
    margin-bottom: 24px;
    font-size: 15px;
    text-align: center;
    line-height: 24px;
    margin-top: 13.5px;
}

.kan-success .btn {
    display: block;
    width: 232px;
    height: 44px;
    margin: 0 auto;
    font-size: 16pxpx;
    line-height: 44px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
}

.kan-success .close {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-top: 16px;
    margin-left: -6.5px;
    font-size: 25px;
    color: #fff;
}

.helpop {
    width: 230px;
    position: absolute;
    left: 73px;
    top: 150px;
    background: white;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
}

.helpop .kanicon {
    margin: 28px 0 38px 0;
    font-size: 57px;
}

.helpop .kanc {
    margin-bottom: 18px;
    line-height: 17px;
    padding: 0 15px;
}

.helpop .btn {
    height: 43px;
    line-height: 43px;
}

.getuse-info {
    width: 300px;
    border-radius: 2px;
    -webkit-radius: 2px;
    background: white;
    padding: 27px 20px;
    box-sizing: border-box;
    margin: 36% auto;
    font-size: 14px;
    position: relative;
}

.getuse-info .item-input {
    height: 42px;
    border-color: #c0c0c0;
    border-radius: 4px;
    width: 260px;
    margin-top: 16px;
    line-height: 42px;
    padding-left: 16px;
    box-sizing: border-box;
    position: relative;
    overflow: visible;
}

.getuse-info .item-but {
    height: 43px;
    line-height: 43px;
    text-align: center;
    background: #f73334;
    border-radius: 2px;
    -webkit-radius: 2px;
    margin-top: 16px;
    color: white;
    font-size: 14px;
}

.getuse-info .closebtn {
    font-size: 25px;
    text-align: center;
    margin-top: 20px;
    position: absolute;
    bottom: -40px;
    left: 50%;
    margin-left: -6px;
    color: white;
}

.orcodebox {
    width: 80%;
    background: #ffffff;
    font-size: 14px;
    border-radius: 5px;
    margin: 100px auto;
    text-align: center;
}

.orcodebox .orimg {
    height: 200px;
    width: 200px;
    margin-bottom: 10px;
}

.orcodebox .title {
    padding: 20px;
}

.orcodebox .btn {
    height: 45px;
    line-height: 45px;
}

.kan-rule {
    padding-bottom: 20px;
    font-size: 14px;
    color: #666;
    line-height: 22px;
}

.kan-list .item {
    padding: 20px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.kan-list .item .le {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.kan-list .item .le .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
}

.kan-list .item .le .mess {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 15px;
    color: #222;
    line-height: 21px;
}

.kan-list .item .le .mess .name {
    height: 21px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.kan-list .item .le .mess .time {
    font-size: 12px;
    color: #999;
    line-height: 16.5px;
}

.kan-list .item .ri {
    margin-left: 10px;
    font-size: 15px;
    color: #222;
    line-height: 21px;
}

.kan-list .item .ri .price {
    margin-left: 10px;
}

.kan-list .more-btn {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    color: #666;
    text-align: center;
    color: #666666;
}

.kan-list .nomes {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 20px 0;
}

.join-tap {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 20px 0;
}

.join-tap .le {
    position: relative;
    line-height: 24px;
    font-size: 17px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: #222222;
    font-weight: 500;
}

.join-tap .le .line {
    height: 15px;
    width: 2.5px;
    border-radius: 1.5px;
    background: #ff4746;
    margin-right: 15px;
}

.join-tap .ri {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.join-tap .ri .btn {
    width: 68px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    color: #666666;
    text-align: center;
    background: #eee;
    border-radius: 3px 0px 0px 3px;
}

.join-tap .ri .btn-r {
    width: 68px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    color: #666666;
    text-align: center;
    background: #eee;
    border-radius: 0px 3px 3px 0px;
}

.join-tap .ri .active {
    color: #ffffff;
}


.info-heiplist {
    padding: 0 0px;
}

.info-heiplist .shopinfo-top {
    overflow: hidden;
    padding: 20px 0;
}

.info-heiplist .shoplist-bot .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 20px 0;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.info-heiplist .shoplist-bot .le {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 15px;
    position: relative;
    color: #1a1a1a;
}

.info-heiplist .shoplist-bot .le .name {
    margin-right: 6px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.info-heiplist .shoplist-bot .le .ct {
    flex-shrink: 0;
}

.info-heiplist .shoplist-bot .le .price {
    margin-right: 6px;
}

.info-heiplist .shoplist-bot .le .avatar {
    flex-shrink: 0;
    width: 37px;
    height: 37px;
    border-radius: 50%;
    margin-right: 8px;
}

.info-heiplist .shoplist-bot .le .mark-avatar {
    position: absolute;
    width: 39.5px;
    height: 13px;
    left: 0;
    bottom: -4px;
    line-height: 14px;
    text-align: center;
    background: #ff7e00;
    border-radius: 6.5px;
    font-size: 10px;
    color: #fff;
}

.info-heiplist .shoplist-bot .ri {
    font-size: 12px;
    font-family: PingFang-SC-Regular;
    color: #999;
    line-height: 16.5px;
}

.info-heiplist .shoplist-bot .more-btn {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    color: #666;
    text-align: center;
    color: #666666;
}

.info-heiplist .nomes {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 20px 0;
}

.info-heiplist .detail-content {
    position: relative;
    overflow: hidden;
    height: auto;
    max-height: 330px;
    font-size: 14px;
    padding: 15px 0;
}

.info-heiplist .detail-content.auto {
    max-height: none;
}

.info-heiplist .detail-content.auto:after {
    display: none;
}

.info-heiplist .detail-content:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),to(#fff));
    background: linear-gradient(rgba(255,255,255,0),#fff);
}

.info-heiplist .detail-btn {
    position: relative;
    padding-top: 10px;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    color: #222;
}

.info-heiplist .detail-btn .iconfont {
    display: inline-block;
    vertical-align: top;
    margin-left: 5px;
}

.info-heiplist .detail-btn.show .iconfont {
    transform: rotate(180deg);
}

.bargain-main .top {
    padding: 18px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.bargain-main .top .img {
    height: 51px;
    width: 51px;
    border-radius: 50%;
    margin-right: 8px;
}

.bargain-main .top .mes {
    font-size: 13px;
    color: #272727;
}

.bargain-main .top .price-box {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-top: 10px;
    font-size: 13px;
    color: #ffffff;
}

.bargain-main .top .le {
    background: inherit;
    height: 24px;
    line-height: 25px;
    padding: 0 5px;
}

.bargain-main .top .ri {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    padding: 0 7px;
}

.bargain-main .bot {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 18px 0;
}

.bargain-main .bot .le {
    overflow: hidden;
}

.bargain-main .bot .le .headlist {
    display: inline-block;
    padding-left: 8px;
}

.bargain-main .bot .le .item {
    width: 25px;
    height: 25px;
    border: 1px solid #fff;
    flex-shrink: 0;
    margin-left: -8px;
    border-radius: 50%;
}

.bargain-main .bot .le .moreimg {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: 15px;
}

.bargain-main .bot .ri {
    font-size: 13px;
}

.bargain-intro .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 15px 0;
}

.bargain-intro .top_item {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
}

.bargain-intro .top_item:before {
    top: 25%;
    height: 50%;
}

.bargain-intro .top_item:first-child:before {
    visibility: hidden;
}

.bargain-intro .top_item .num {
    font-size: 15px;
}

.bargain-intro .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 20px 0;
}

.bargain-intro .btm_intro {
    padding-right: 10px;
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.bargain-intro .btm_list {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    overflow: hidden;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.bargain-intro .btm_list .item {
    width: 36px;
    flex-shrink: 0;
    background-color: #eee;
    overflow: hidden;
    border-radius: 50%;
}

.bargain-intro .btm_list .item .imag-item {
    border-radius: 50%;
}

.bargain-top {
    padding-bottom: 0.5px;
}

.bargain-top .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin: 10px -15px 10px;
}

.bargain-top .top_price {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-box-align: end;
    align-items: flex-end;
    padding-left: 15px;
}

.bargain-top .top_price .now {
    font-size: 15px;
    line-height: 1em;
}

.bargain-top .top_price .now .num {
    font-size: 27px;
    font-weight: 500;
}

.bargain-top .top_price .old {
    font-size: 13px;
    text-decoration: line-through;
    color: #999;
}

.bargain-top .top_countdown {
    padding: 5px 15px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #FFFFFF;
    min-height: 46px;
    background-color: #fc9127;
}

.bargain-top .top_countdown font {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-color: #fff;
    border-radius: 1.5px;
    color: #222222;
}

.bargain-top .titArea {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: 15px;
}

.bargain-top .titArea .tit {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 17px;
    line-height: 25px;
    color: #222;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.bargain-top .kucun {
    padding-left: 25px;
    margin-right: 15px;
    font-size: 12px;
    text-align: center;
    line-height: 17px;
    color: #666;
}

.bargain-top .kucun .num {
    font-size: 17px;
    line-height: 22px;
    color: #222;
}

.bargain-top .infoArea {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 13px;
    line-height: 18px;
    color: #999;
}

.shopinfo {
    border-top: 8px solid #f5f5f5;
}


/*choujiang*/
.Lotterymodule {
    padding: 20px 15px 17.5px;
    border-radius: 10px;
    box-shadow: 0 0px 10px rgba(144,144,144,0.3);
    margin-bottom: 10px;
}

.Countdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.Countdown_l {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #353535;
}

.Countdown_r {
    font-size: 12px!important;
    color: #353535;
    border: 1px solid #353535;
    padding: 0 5px;
    height: 19px;
    line-height: 19px;
    position:relative;
    margin:0;
}

.Countdown_r2 {
    position: absolute;
    top: 0;
    right: 0;
}

.Countdown_lf {
    margin-right: 6.5px;
}

.Countdown_lx {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 2.5px;
    background-color: #353535;
    color: #fff;
    display: block;
    text-align: center;
    margin: 0 3.5px;
}

.Lotterybutton {
    width: 89px;
    height: 89px;
    padding: 5px;
    border-radius: 50%;
    background-color: #ff5050;
    margin: 0 auto 30px;
    box-sizing: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.button[disabled][type="default"],button[disabled]:not([type]) {
    background-color: #ff5050;
}


.Lotterybutton_x {
    width: 100%;
    height: 100%;
    border: 2px solid #fff;
    border-radius: 50%;
}

.Lotterybutton_x3 {
    animation: spin 0.8s ease-in;
    animation-iteration-count: 1;
}

.Lotterybutton_x4 {
    animation: spin 1s ease-in;
    animation-iteration-count: infinite;
    border-color: #fff;
}

.Lotterybutton_x2 {
    border-color: #ffa8a8;
}

.Lotterybutton_zi {
    position: absolute;
    width: 75px;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: #ffffff;
    left: 50%;
    top: 50%;
    margin-left: -37.5px;
    margin-top: -7px;
    text-align: center;
}

.Lotterybutton_zi2 {
    color: #ffa8a8;
}

.Lotterybutton_zi3 {
    color: #fff;
}

.Luckycode {
    margin-bottom: 33px;
}

.LCtop {
    text-align: center;
    line-height: 14px;
    font-size: 14px;
    margin-bottom: 20px;
}

.LCtop2 {
    text-align: center;
    font-size: 14px;
    line-height: 14px;
    color: #e8e8e8;
    margin-bottom: 18px;
}

.LCtop2 text {
    color: #888;
}

.LCcon {
    flex-wrap: wrap;
    margin-bottom: 5px;
    text-align: center;
}

.LCcon2 {
    justify-content: center;
}

.LCconma {
    font-size: 18px;
    line-height: 18px;
    color: #ff5050;
    padding: 7.5px 0px;
    width: 92.5px;
    border-radius: 25px;
    letter-spacing: 1px;
    margin-bottom: 15px;
    border:1px solid #ff5050;
    display: inline-block;
    margin:0 10px 10px 0;

}

.LCconma2 {
    text-align: center;
}

.LCcondown {
    width: 150px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
    border-radius: 17.5px;
    color: #fff;
    background-color: #ff5050;
}

.LCconjian {
    margin: 0 auto;
    padding: 10px 0 14px;
}

.LCconjian2 {
    transform: rotate(180deg);
}

.LCconjian img {
    width: 9px;
    height: 5px;
    margin: 0 auto;
    display: block;
}
@-webkit-keyframes spin {
    0% {
        transform: scale(1,1);
    }

    50% {
        transform: scale(1.19,1.19);
        border-color: transparent;
    }

    100% {
        transform: scale(1,1);
    }
}

@keyframes spin {
    0% {
        transform: scale(1,1);
    }

    50% {
        transform: scale(1.19,1.19);
        border-color: transparent;
    }

    100% {
        transform: scale(1,1);
    }
}

.Haswon {
    margin-bottom: 30px;
    position: relative;
    padding-top: 14.5px;
    text-align: center;
}

.Haswontop {
    width: 112px;
    height: 67px;
    display: inline-block;
}

.Haswontop_not {
    width: 84.5px;
    height: 55.5px;
    left: 115px;
}

.Haswontop2 {
    left: 72.5px;
    top: 28.5px;
}

.Haswontop2_not {
    width: 84.5px;
    height: 55.5px;
    left: 116px;
    top: 46.5px;
}

.Haswoncon {
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #ff7f18;
    margin-top: 7.5px;
    margin-bottom: 12px;
}

.Haswoncon_not {
    color: #888;
}

.Haswoncon2 {
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    margin: 15px 0;
}

.Haswoncon2_not {
    color: #353535;
}

.Haswoncon2 text {
    color: #ff5050;
}

.Haswonbtn {
    width: 155px;
    height: 30px;
    text-align: center;
    border-radius: 17.5px;
    background-color: #ff5050;
    line-height: 30px;
    color: #fff;
    margin: 0 auto;
    font-size: 14px;
}

.Haswonbtn2 {
    margin-bottom: 26px;
}

.Winlist {
    margin-bottom: 39.5px;
}

.Winlisttit {
    text-align: center;
    font-size: 14px;
    line-height: 14px;
    color: #e8e8e8;
    margin-bottom: 18px;
}

.Winlisttit font {
    color: #888;
}

.Winlisttop {
display:-webkit-box;
display:-webkit-flex;
display:flex;
flex-wrap:wrap;



}

.Winlistdown {
    text-align: center;
    line-height: 13px;
    font-size: 13px;
    color: #888;
}

.Winlisttop_da {
  -webkit-box-flex:1;
  flex:1;
  min-width:25%;
  margin-bottom: 20px;
  text-align: center;
}

.Winlisttop_da2 {
    margin-right: 26.5px;
    margin-bottom: 20px;
}

.Winlisttop_da:nth-child(4n) {
    margin-right: 0;
}

.Winlisttop_on {
    width: 38.5px;
    height: 38.5px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: #888;
    margin: 0 auto 7px;
    border: 1px solid #eee;
}

.Winlisttop_tw {
    text-align: center;
    line-height: 12px;
    font-size: 12px;
    color: #003535;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.Winlisttop_th {
    text-align: center;
    line-height: 12px;
    font-size: 12px;
    color: #ff5050;
}

.Winlistdow {
    width: 164px!important;
    height: 29px!important;
    line-height: 29px!important;
    border-radius: 17.5px;
    color: #353535;
    font-size: 14px!important;
    text-align: center;
    border: 1px solid #888;
    margin: 0 auto;
}

.Numdraws_t {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 9px;
}

.Numdraws_avr {
    width: 28px;
    height: 28px;
    border: 1px solid #eee;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: #f0f0f0;
    margin-left: -12.5px;
    text-align: center;
    line-height: 9px;
    color: #767676;
    border-radius: 50%;
}

.Numdraws_d {
    line-height: 12px;
    font-size: 12px;
    text-align: center;
}

.Numdraws_df {
    color: #888888;
    margin-right: 10px;
    font-size: 15px;
}

.Numdraws_dt {
    color: #ff9517;
    font-size: 15px;
}

.Numdraws_d img {
    width: 5px;
    height: 11px;
    margin-left: 6.5px;
}


.pop-userinfo {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 82%;
    background-color: #fff;
    transform: translate(-50%,-50%);
    border-radius: 6px;
}

.pop-userinfo .tit {
    padding: 0 20px;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    color: #fff;
    background-color: #f73334;
    border-radius: 6px 6px 0 0;
    text-align: center;
}

.pop-userinfo .area {
    padding: 15px 20px;
}

.pop-userinfo .area .tip {
    margin-bottom: 15px;
    font-size: 15px;
    line-height: 20px;
    color: #525252;
}

.pop-userinfo .row_inp {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 45px;
    border-color: #c4c4c4;
    margin-bottom: 8px;
}

.pop-userinfo .row_inp input {
    font-size: 14px;
    border:0;
    border-radius: 0;
}

.pop-userinfo .row_btn {
    padding: 20px 0;
}

.pop-userinfo .row_btn .btn {
    width: 165px;
    height: 36px;
    font-size: 15px;
    line-height: 36px;
    color: #fff;
    background-color: #fc9127;
    border-radius: 36px;
    margin-top:15px;
    text-align: center;
    margin: 0 auto;
}

.pop-userinfo .close {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 28px;
    height: 28px;
    border: 1px solid #fff;
    margin-left: -14px;
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
    line-height: 28px;
    color: #fff;
    border-radius: 50%;
}

.detail-content img{
    max-width: 100%;
  display: block;
}

/**/
.ms_pro{
  margin-bottom: 5px;
  width: 125px;
  height: 20px;
  line-height: 20px;
  background: #ddd;
  border-radius: 10px;
  text-align: center;
  font-size: 11px;
  color: #fff;
  position: relative;
}
.ms_proact{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  max-width: 125px;
  border-radius: 10px;
  display: block;
  z-index: 1;
}
.ms_last{
  position: relative;
  z-index: 2;
}
.ms_desc{
  text-align: center;
}

/**/
.coupon {
    width: 265px;
    height: 80px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-right: 15px;
    box-sizing: border-box;
    padding: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 18px;
    color: #ff8585;
}
.coupon_title font{
    font-size: 10px;
}

.coupon_rule {
    font-size: 10px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
}

.coupon_tagname {
    font-size: 10px;
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
    z-index: 1;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
    margin-top: 17.5px;
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
.card_box{
    padding: 10px 0;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.video_block{
    width: 100%;
    height: 150px;
    background-color: rgba(0,0,0,1);
    text-align: center;
    vertical-align: middle;
    display: table;
    border-radius: 1.5px;
}
.video_block img{
    width: 40px;
    height: 40px;
    padding-top: 55px;
    display: inline-block;
}
.video_in video{
    width: 100%;
    height: 281px;
}

/**/

.redpacket {
    margin: 10px 0;
    height: 80px;
    padding: 0 10px;
}

.redpacket_item {
    width: 100%;
}

.content_hb_use {
    width: 325px;
    height: 80px;
    background: #ff7070 url("https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/list_hbbg.png") no-repeat 215px 15px;
    background-size: 73px 75px;
    font-size: 12px;
    display: flex;
    color: #fff;
    align-items: center;
    padding: 0 15px;
    border-radius: 5px;
}

.hb_price {
    margin-right: 15px;
}

.hb_price text {
    font-size: 24px;
}

.hb_desc {
    text-align: left;
    margin-right: 12.5px;
    width: 182.5px;
}

.hb_desc_name {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-bottom: 2.5px;
}

.hb_desc_name2 {
    font-size: 14px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.hb_desc_text {
    font-size: 10px;
    display: block;
}

.hb_usebtn {
    width: 59px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #fff;
    display: block;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    text-align: center;
}

.hb_usebtn.has_get {
    border: none;
}

.hb_top.active {
    background-color: #ff7070;
}

.hb_footer {
    height: 25px;
    background-color: #fff;
    color: #888888;
    font-size: 10px;
    text-align: right;
    padding: 0 15px;
    line-height: 25px;
}

.has_gethb {
    text-align: center;
    height: 15px;
    position: relative;
    margin: 15px 0 15px -10px;
}

.has_gethb .line {
    position: absolute;
    top: 50%;
    background-color: #eee;
    display: block;
    height: 1px;
    overflow: hidden;
    width: 100%;
}

.has_gethb_text {
    width: 40px;
    font-size: 10px;
    color: #dddddd;
    height: 15px;
    line-height: 15px;
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -20px;
    top: 0;
    background-color: #fff;
    overflow: hidden;
    display: block;
    z-index: 10;
}

/**/
.goodbuy_rule,.goodbuy_num{
    padding: 15px 0;
}
.goodbuy_rule{
    border-top: 1px solid #eee;
    max-height: 200px;
    margin-bottom: 20px;
}
.goodbuy_num {
    align-items: center;
}
.goodbuy_quantity{
    text-align: right;
}
.goodbuy_num_last{
    color: #999;
    font-size: 14px;
}
.goodbuy_name{
    font-size: 14px;
}

.goodbuy_rule_item{
    margin-bottom: 15px;
}
.rule_item_title{
    font-size: 13px;
    color: #999;
}
.rule_item_name{
    display: inline-block;
    margin: 5px 10px 0 0;
    background: #eee;
    color: #666;
    border-radius: 2.5px;
    font-size: 14px;
    padding: 3px 10px;
    min-width: 20px;
    text-align: center;
}
.buy_confirm{
    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align:center;
    font-size: 16px;
    border-radius: 50px;
}
.goodbuy_top_title{
  color: #222;
  padding: 10px 0;
  padding-bottom: 0;
  font-weight: bold;
}
.goodbuy_top_close{
    width: 35px;
    height: 35px;
    text-align: center;
    font-size: 20px;
    color: #999;
    line-height: 35px!important;
    position: absolute;
    right: 0;
    top: 0;
}

.goodbuy_top_price{
    font-size: 13px;
    color: #222;
    font-weight: bold;
}
.goodbuy_top_l{
    padding-left: 0;
}

.cartbox{
    position: fixed;
    top:20px;
    right: 10px;
    border-radius: 30px;
    width: 55px;
    height: 30px;
    box-shadow: 0.5px 0.5px 11px rgba(255,255,255,0.3);
}
.cartbox img{
    width: 25px;
    height: 25px;
    display: block;
    padding-top: 2.5px;
    padding-left: 5px;
}
.cartnum{
    position: absolute;
    left: 40px;
    top: 0.5px;
    font-size: 11px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
}
.cartbtn{
    font-size: 12px!important;
}
.item_avatar.tcthumb{
    border-radius: 2.5px;
    width: 50px;
    height: 50px;
}


.bottitle{
    text-align: center;
}
.bottitle .bott{
    display: block;
    width: 25px;
    height: 4px;
    margin : 0 auto;
    border-radius: 2px;
    margin-top: 5px;
}

/**/
.sub_goods {
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
}

.goods_item {
    background-color: #fff;
    width: 170px;
    height: 175px;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 10px;
    text-align: left;
}

.goods_item:nth-child(2n-1) {
    margin-right: 15px;
}

.goods_item img {
    width: 170px;
    height: 92.5px;
    display: block;
    background-color: #eee;
    border-radius:4px;
}

.goods_item .goods_tit {
    color: #353535;
    font-size: 14px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    box-orient: vertical;
    -webkit-box-orient: vertical;
    height: 36px;
    line-height: 18px;
}

.price_cur {
    color: #ff4040;
    font-size: 16px;
    margin-right: 7.5px;
    font-family: 'DIN';
}

.price_org {
    color: #cccccc;
    font-size: 12px;
    font-family: 'DIN';
}


.goods_ft {
    display: flex;
    align-items: center;
}

.yhtext {
    font-size: 10px;
    color: #ff4040;
    border: 1px solid #ff4040;
    padding: 0 1px;
    margin-right: 5px;
    height: 14px;
}

.kanjiatk {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    top: 0;
    z-index: 999;
    text-align: center;
}

.kanjiatk .infotext {
    background-color: #fff;
    width: 230px;
    font-size: 14px;
    color: #353535;
    padding: 22.5px;
    border-radius: 10px;
    height: 309px;
    margin: 122.5px auto 0;
    text-align: left;
    line-height: 1.6;
}

.kanjiatk .info_tit {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
}

.kanjiatk .info_tit .tit_line {
    background: #ffd93f;
    width: 20px;
    height: 3px;
    margin: 10px auto 20px;
}

.kan_icon_alarm {
    width: 50px;
    height: 49.5px;
}
.tr{
    text-align: right;
}
.posterbox{
    position: relative;
    z-index: 1;
}
.posterbox img{
    position: fixed;
    bottom: 125px;
    width: 250px;
    left: 62.5px;
}

/**/
.goodsqun{
    padding: 15px;
    padding-top: 7.5px;
}
.goodsqun .item_cell_box{
    box-shadow: 0.5px 0.5px 5.5px rgba(224, 238, 232, 0.5);
    padding: 15px;
    align-items: center;
    border-radius: 5px;
}
.goodsqun_head{
    width: 40px;
    height: 40px;
}
.goodsqun_head img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.goodsqun_desc{
    padding-left: 15px;
    font-size: 12.5px;
}
.goodsqun_descin{
    color: #999;
}
.goodsqun .btn{
    padding: 2.5px 10px;
    border-radius: 1.5px;
    background-color: #19ec27;
    font-size: 12px;
}

/**/
.group_step{
    margin: 15px 0;
    white-space: nowrap;
    text-align: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.group_stepitem{
    display: inline-block;
    padding: 5px 5px;
    width: 100px;
    border-radius: 10px;
    margin-right: 10px;
    font-size: 12px;
    background-image:url('https://img11.360buyimg.com/ddimg/jfs/t1/40100/3/8532/23797/5cffbf9eE5e5d9087/b786f27358441632.png');
    background-size: cover;
    color: #777;
}
.group_stepitem:nth-of-type(2){
    margin-left: -10px;
}
.group_stepmem{
    text-align: left;
}
.group_stepmem font{
    font-size: 20px;
    font-weight: bold;
    padding-right: 5px;
    color: #333;
}
.group_stepprice{
    text-align: center;
}
.group_stepprice font{
    font-size: 17.5px;
    font-weight: bold;
    padding-left: 2.5px;
    color: #333;
}
.lbg-pri.group_stepitem font{
    color: #fff;
}

/**/
.info-views {
    position: relative;
    display: inline-flex;
    align-items: flex-end;
    height: 20px;
    margin-left: 14px;
    font-size: 11px;
    line-height: 20px;
    border-radius: 20px;
    padding-right:0;
}
.info-views::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
}

.info-views .iconfont {
    position: relative;
    margin-right: 6px;
    height: 23px;
    width: 23px;
    display: inline-block;
    font-size: 23px;
    line-height: 23px;
    opacity: 0.8;
}
.info-title {
    margin-top: 7.5px;
    font-weight: 500;
    font-size: 17px;
    color: #292929;
}
.discount_box{
    align-items: center;
}
.info-views .views{
    padding: 0 5px;
}
.btm_save{
    margin-top: 5px;
}
.gtstyle1{
    background-color: #4f4b48!important;
    color: #efdcbb;
    border-radius: 5px;
}
.gtstyle1 .vip_name{
    display: none;
}
.gtstyle1 .color-pri{
    color: #efdcbb!important;
}


.info-section {
    padding: 0 10px;
    border-top: 6px solid #F9F9F9;
}

.info-section-first{
    border-top: 0;
}

.shop-item {
    overflow: hidden;
    margin-bottom: 20px;
}
.shop-item .name,.shop-item .namebox {
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    line-height: 20px;
}
.shop-item .namebox {
    text-align: left;
}
.namebox .zan-icon-arrow{
  color: #999;
}

.shop-item .name:before,.shop-item .name:after {
    content: '';
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 20px;
    margin: 0 10px;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/66477/21/14495/4342/5dbef2c4E55edb85d/a272cda26e2cb3d4.png) center no-repeat;
    background-size: 80% 80%;
}

.shop-item .name:after {
    transform: rotateY(180deg);
}

.shop-item .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
}

.shop-item .label {
    align-self: flex-start;
}

.shop-item .info {
    -webkit-box-flex: 1;
    flex: 1;
}

.shop-item .btn {
    height: 22px;
    padding: 0 10px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 22px;
    border-radius: 3px;
}

.detail-btn {
    position: relative;
    padding-top: 10px;
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    color: #222;
}

.detail-btn .iconfont {
    display: inline-block;
    vertical-align: top;
    margin-left: 5px;
}

.detail-btn.show .iconfont {
    transform: rotate(180deg);
}

.info-tab {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.info-tab .item {
    padding: 10px 0;
    -webkit-box-flex: 1;
    flex: 1;
    border-color: transparent;
    font-size: 17px;
    text-align: center;
    line-height: 22px;
    color: #999;
}

.info-tab .item font {
    display: inline-block;
    vertical-align: top;
    padding: 5px 0;
    border-bottom: 3px solid;
    border-color: inherit;
    box-sizing: border-box;
}

.info-tab .item.active {
    color: #222;
}

/**/
.fix-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background-color: #fff;
    width: 100%;
}
.goods-swiper img{
    display: block;
    width: 100%;
}
.info-title {
    padding: 20px 0 15px;
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    color: #222;
}
.info-notice{
    font-size: 15px;
    padding-bottom: 10px;
}
.detail-content img{
    max-width: 100%!important;
}
.noborder-top {
    border-top: none;
}

/**/
.btn-share {
    position: fixed;
    top: 45%;
    right: 10px;
    z-index: 5;
    width: 60px;
    height: 60px;
}

.btn-share img {
    display: block;
    width: 100%;
    height: 100%;
}

.gotop {
    top: 25px;
}
.share-area {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 26px 0 20px;
}

.share-area .item {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
    background-color: transparent;
    border-radius: 0;
}

.share-area .item img {
    width: 38px;
    height: 38px;
}

.share-area .close {
    position: absolute;
    bottom: 100%;
    right: 12px;
    margin-bottom: 10px;
    color: #fff;
}

.share-area .close .iconfont {
    font-size: 20px;
}

.cuttime_down{
    text-align: right;
    font-size: 12px;
    color: #999;
}
.cuttime_downin{
    border : 1px solid #ddd;
    display : inline-block;
    padding : 2.5px 10px;
    border-radius: 15px;
}

.quick-list{
    padding: 15px;
}
.quick-title{
    font-weight: 500;
    font-size: 17px;
    color: #292929;
    margin-bottom: 5px;
}
.quick-item{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    align-items: center;
    font-size: 13px;

}

.quick-item .zan-icon{
    font-size: 11px;
    color: #999;
}
.quick-price{
    color: #999;
}
.quick-price text{
    font-size: 10px;
}
.quick-gtitle{
    padding: 5px 0;
}

.tipstop-box{
    z-index: 102;
    position: fixed;
}
.tipstop-box .tipstop{
    height: 60px;
    width: 100%;
    font-size: 16px;
    line-height: 60px;
    text-align: center;
    border-radius: 0 0 50% 50%;
    margin-bottom: 10px;
}
.tipstop-box .content{
    color: #666;
    max-height: 350px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.apple-tips{
    left: 0;
    bottom: 2px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #999;
}

/**/
.bg_audio img{
    width: 40px;
    height: 40px;
    border-radius:50%;
    position: fixed;
    z-index:2;
    top: 10px;
    right: 10px;
}
.music-btn-ani {
    -webkit-animation: music 1.5s infinite linear;
    animation: music 1.5s infinite linear;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

@keyframes music {
    0% {
        -webkit-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1)
    }

    50% {
        -webkit-transform: rotate(180deg) scale(1.1);
        transform: rotate(180deg) scale(1.1)
    }

    to {
        -webkit-transform: rotate(1turn) scale(1);
        transform: rotate(1turn) scale(1)
    }
}

.play-btn{
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 20;
    left: 50%;
    top: 50%;
    margin-left: -20px;
    margin-top: -20px;
    display: block;
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/55602/22/8860/4677/5d638bc3E79d8d188/e43dfc7f867e6409.png);
    background-size: 100%;
    z-index: 1000;
}
.dots {
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
}
 
.dot {
  width: 10px;
  height: 5px;
  border-radius: 7px;
  margin-right: 11px;
  background-color: rgba(255,255,255,0.6);
}
.swiper-box{
    position: relative;
}
.swiper-video{
    align-items:center;
    display: flex;
    background-color:#000;
    position:relative;
}
.vposter{
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
}

/**/
.tags-box{
    padding: 20px 15px;
}
.tags-item{
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    font-size: 14px;
    align-items: center;
}
.tags-item:last-child{
    border:0;
}
.tags-l{
    border:1px solid #fff;
    padding: 2px 6px;
    margin-right: 15px;
}
.shopmore-btn{
    font-size: 13px;
    text-align: center;
    color: #999;
    margin: 0 auto;
    margin-bottom:10px;
    border:1px solid #eee;
    padding: 5px 0;
    width:100px;
    border-radius: 3px;
    
}
.shopmore-btn .iconfont{
    font-size: 13px;
}
i.arrowup{
    display: inline-block;
    transform: rotate(180deg);
    -webkit-transform:rotate(180deg);
}

.quest-section{
    padding: 15px;
    font-size: 14px;
}
.quest-section .namebox{
    padding-bottom: 10px;
}
.quest-section .quest-item{
    line-height: 15px;
}
.quest-section .namebox ,.quest-section .quest-item{
    padding: 5px 0;
}
.quest-itemq{
    width:15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    font-size: 11px;
    margin-right: 5px;
    border-radius: 1.5px;
}
.quest-tip{
    color: #999;
    font-size: 11px;
    padding-left:5px;
}
.quest-itemt{
    white-space: nowrap;
    overflow: hidden;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
}

.van-popup--round{
    border-radius: 20px 20px 0 0;
}
.goodbuy_box{
    padding: 10px;
}
.rule_top{
    position: relative;
}
.rule_topimg{
    position: relative;
    float: left;
    width: 86px;
    height: 86px;
    margin: 12px 0;
    overflow: hidden;
    background: #f8f8f8;
    border-radius: 4px;
}
.rule_topimg img{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
}
.rule_topdesc{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    min-height: 86px;
    padding: 12px 36px 12px 8px;
    overflow: hidden;
}
.rule_topprice{
    font-size: 18px;
}
.rule_topstock,.rule_toprule {
    margin-top: 8px;
    color: #969799;
    font-size: 12px;
    line-height: 16px;
}


</style>