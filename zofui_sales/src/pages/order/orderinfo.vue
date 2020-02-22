<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
        <subtip :params="params"></subtip>    

        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新">

            <div class="order-tip" v-if="order.status == 0">
                请您于下单
                <font class="color-pri">{{order.gtype == 6 ? 5 : params.detime}}分钟</font>
                内完成支付，逾期订单将自动取消
            </div>
            <div class="receive-top" v-else>
                <div class="title">
                    <div class="txt" v-if="order.status == 1">
                        <template v-if="order.isfail == 1">
                            已超时失效
                        </template>
                        <template v-else>
                            {{group && group.status == 0 ? '拼团中' : '待使用'}} {{order.paytype == 2 ? '，需到店支付' : ''}}
                        </template>
                    </div>
                    <div class="txt" v-if="order.status == 2">已发货</div>
                    <div class="txt" v-if="order.status == 3 || order.status == 4">已完成</div>
                    <div class="txt" v-if="order.status == 5">已退款</div>
                    <div class="icon iconfont"></div>
                </div>
            </div>

            <div class="order-wrap">
                <div class="order-userinfo">
                    <div class="info">
                        <div>
                            <font class="icon iconfont"></font>
                            <font>{{order.name}}</font>
                        </div>
                        <div>{{order.tel}}</div>
                    </div>
                    <div class="adress" v-if="order.address">
                        <font class="icon iconfont"></font>
                        <font>{{order.address}}</font>
                    </div>
                </div>
            </div>
            <div class="order-wrap">
                <div class="order-detail">
                    <div class="attr">
                        <div class="attr_item" v-if="order.orderid">
                            <div class="name">订单编号：{{order.orderid}}</div>
                            <div class="minibtn" @click="copy" :data-copy="order.orderid">复制</div>
                        </div>
                        <div class="attr_item" v-if="order.createtime">
                            <div class="name">提交时间：{{order.createtime}}</div>
                        </div>
                        <div class="attr_item" v-if="order.paytime != 0 && order.paytype != 2">
                            <div class="name">支付时间：{{order.paytime}}</div>
                        </div>
                        <div class="attr_item" v-if="order.yydate">
                            <div class="name">预约时间：{{order.yydate}} {{order.yytime}}</div>
                        </div>
                        <div class="attr_item" v-if="order.exname">
                            <div class="name">快递名称：{{order.exname}}</div>
                        </div>
                        <div class="attr_item" v-if="order.exnum">
                            <div class="name">快递编号：{{order.exnum}}</div>
                        </div>
                        <div class="attr_item" v-if="order.lotinfo && order.lotinfo.lotpname">
                            <div class="name">中奖等级：{{order.lotinfo.lotpname}}</div>
                        </div>
                        <div class="attr_item" v-if="order.lotinfo && order.lotinfo.lotptip">
                            <div class="name">中奖提示：{{order.lotinfo.lotptip}}</div>
                        </div>
                        <div class="attr_item" v-if="order.subform.length > 0" v-for="(item,index) in order.subform" :key="index">
                            <div class="name" v-if="item.type == 'multi' || item.type == 'region'">{{item.name}}：
                                <font v-for="(inn,i) in item.value"  :key="i"> {{ inn }}， </font>        
                            </div>
                            <div class="name" v-else>{{item.name}}：{{item.value}}</div>
                        </div>
                    </div>
                </div>
                <div class="order-goods" @click="link" :data-url="'/goodinfo?id='+order.gid">
                    <div class="intro">
                        <div class="pic">
                            <div class="img image-box __100">
                                <img :src="good.thumb">
                            </div>
                        </div>
                        <div class="goodtitle">
                            <div class="desc">{{good.title}}</div>
                            <div v-if="order.rule">{{order.rule}}</div>
                        </div>
                        
                    </div>
                </div>
                <div class="order-detail">
                    <div class="row thin-border_b" v-if="order.mess">
                        <div class="lt">备注</div>
                        <div class="rt">
                            {{order.mess}}
                        </div>
                    </div>
                    <div class="total">共{{order.num}}件 合计：<font class="color-pri">¥{{order.fee}}</font>
                    </div>
                </div>
            </div>

            <template v-if="order.pttype == 1">
                <div class="order-wrap">
                    <div class="order-detail" >
                        <div class="attr">
                            <div class="attr_item" >
                                <div class="name">领取：{{order.params.getaddr}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="order-wrap" v-if="order.taketype == 1 && order.status > 0">
                    <div class="order-detail" v-if="good.address && good.tel && !good.shoplist">
                        <div class="attr">
                            <div class="attr_item" v-if="good.address">
                                <div class="name">领取地址：{{good.address}}</div>
                            </div>
                            <div class="attr_item" v-if="good.tel">
                                <div class="name">{{params.shopbname}}电话：{{good.tel}}</div>
                                <div class="minibtn" @click="callphone" :data-tel="good.tel">拨号</div>
                            </div>
                        </div>
                    </div>
                    <div class="order-detail" v-if="good.shoplist.length > 0" v-for="item in good.shoplist">
                        <div class="attr">
                            <div class="attr_item" v-if="item.name">
                                <div class="name">{{item.name}}</div>
                            </div>
                            <div class="attr_item" >
                                <div class="name">领取地址：{{item.address}}</div>
                                <div class="minibtn" @click="bindtap($event,'loc')" :data-add="item.address" :data-lat="item.lat" :data-lng="item.lng">导航</div>
                            </div>
                            <div class="attr_item" v-if="item.tel">
                                <div class="name">{{params.shopbname}}电话：{{item.tel}}</div>
                                <div class="minibtn" @click="callphone" :data-tel="item.tel">拨号</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order-wrap" v-if="shop.tel && order.taketype == 2 && order.status > 0">
                    <div class="order-detail">
                        <div class="attr">
                            <div class="attr_item" v-if="shop.tel">
                                <div class="name">{{params.shopbname}}电话：{{shop.tel}}</div>
                                <div class="minibtn" @click="callphone" :data-tel="shop.tel">拨号</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <div class="order-wrap" v-if="order.showusestart || order.showfailtime">
                <div class="order-detail" v-if="order.showusestart">
                    <div class="attr">
                        <div class="attr_item" >
                            <div class="name blod">订单可用：{{order.showusestart}}</div>
                            <div>请在此时间后使用</div>
                        </div>
                    </div>
                </div>
                <div class="order-detail" v-if="order.showfailtime">
                    <div class="attr">
                        <div class="attr_item" >
                            <div class="name blod">订单失效：{{order.showfailtime}}</div>
                            <div>请在此时间前使用</div>
                        </div>
                    </div>
                </div>
            </div>

            <template v-if="order.isshowqr == 1">
                <div class="goodsHx-top goodsHX-common" style="margin-top:10rpx;" v-if="order.status > 0 && order.status != 5 && order.othercode.length <= 0">
                    <div class="msg">
                        <div class="qrcode">
                            <div class="img image-box __100">
                                <img class="" :src="order.pttype == 1 ? 'http://2v.dedecms.com/index.php/welcome/generate_qrcode?size=10&message='+order.params.pftcode : qrcode">
                            </div>
                        </div>
                        <div class="tip">请将二维码展示给{{params.shopbname}}</div>
                    </div>
                </div>
                <div class="goodsHx-list goodsHX-common" v-if="order.status > 0  && order.status != 5">
                    <div class="btm goodscode-btm">
                        <div class="list aluse" >
                            <div class="info" v-if="order.code">
                                <div class="code">
                                    领取编码：{{order.pttype == 1 ? order.params.pftcode : order.code}}
                                    <font class="state" v-if="order.status >= 1">(还可使用{{order.hxtimes > 0 ? order.hxtimes : 0}}次)</font>
                                </div>
                                <div class="intro minibtn" @click="copy" :data-copy="order.code">复制</div>
                            </div>

                            <div class="info" v-for="item in order.othercode">
                                <div class="code">
                                    领取编码：{{item.code}}
                                    <font class="state" v-if="item.status == 1">(已使用)</font>
                                </div>
                                <div class="intro minibtn" @click="copy" :data-copy="item.code">复制</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <van-steps direction="vertical" :active="0" v-if="express.length > 0">
                <van-step v-for="item in express">
                    <div>{{item.time}}</div>
                    <p>{{item.desc}}</p>
                </van-step>
            </van-steps>

            <template v-if="order.gtype == 7">
                <div class="group_box bindorder_box item_cell_box" v-for="item in bindorder" @click="link" :data-url="item.appurl">
                    <div class="groupstatus" >
                        <img :src="item.thumb" class="thumb">
                    </div>
                    <div class="groupstatus item_cell_flex" >{{item.title}}</div>
                    <div class="bg-pri groupbtn">查看订单</div>
                </div>
            </template>

            <template v-if="order.groupid > 0 && group">
                <div class="group_box item_cell_box" @click="link" :data-url="'/groupinfo?id='+group.id">
                    <div class="groupstatus item_cell_flex" v-if="group.status == 0">团还差{{group.dismem}}人</div>
                    <div class="groupstatus item_cell_flex" v-if="group.status == 1">已完成</div>
                    <div class="groupstatus item_cell_flex" v-if="group.status == 2">已失败</div>
                    <div class="bg-pri groupbtn">查看团</div>
                </div>
            </template>

            <template v-if="order.lotinfo">
                <div class="group_box item_cell_box" @click="link" :data-url="'/goodinfo?id='+order.lotinfo.gid" style="align-items:center;">
                    <div class="groupstatus item_cell_flex" v-if="order.lotinfo && order.lotinfo.lotpname">
                        <div>{{order.lotinfo.lotpname}}</div>
                        <div>{{order.lotinfo.lotptip}}</div>
                    </div>
                    <div class="item_cell_flex groupstatus pr20">已中奖</div>
                    <div class="bg-pri groupbtn">查看活动</div>
                </div>
            </template>
            
            <div class="order-wrap mt20" v-if="order.gtype != 7 && hxlog.length > 0">
                <div class="order-detail">
                    <div class="attr">
                        <div class="attr_item" v-for="item in hxlog">
                            <div class="name">
                                {{item.time}}，使用一次 
                                <font v-if="item.nickname">，{{params.hxbname}}人：{{item.nickname}}</font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-wrap mt20" v-if="order.fanxlog && order.fanxlog.length > 0">
                <div class="order-detail">
                    <div class="attr">
                        <div class="attr_item" v-for="(item,index) in order.fanxlog" :key="index">
                            <div class="name">
                                {{item.time}}
                                <font >，返现{{item.money}}，{{item.statusstr}}</font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </van-pull-refresh>


        <div class="fix-box" v-if="order.status == 0 || (order.status == 2 && order.taketype == 2) || order.status == 3">
            <div class="g-fixbtn bg-pri" @click="dealorder" data-type="pay" v-if="order.status == 0">
                立即支付
            </div>
            <div @click="dealorder" data-type="com"  class="receive-btn" v-if="order.status == 2 && order.taketype == 2">确认收货</div>
            <div @click="dealorder" data-type="comment" class="receive-btn" v-if="order.status == 3">评价</div>
            <!-- <div class="is-ipx" if="$FixBox$IsIPX$isIPX"></div> -->
        </div>

        <div class="pan-box" v-if="prize.isprize == 1 && showprize">
            <div class="mask" catchtouchmove="catchtouchmove"></div>
            <div class="pan-zz" catchtouchmove="catchtouchmove">
                <div class="pan-zhuan cj_zhuan">
                    <div class="pan-zhuan1">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/53645/34/803/72523/5ce7e55eE14cafdcd/71777afe4a121cdd.gif">
                    </div>
                    <div class="main">
                        <div class="canvas-container">
                            <div class="canvas-content " :class="animationData ? 'rotateani' : ''" v-if="tab_zhuan == 0 || !tab_zhuan">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan8" v-if="tab_zhuan==1">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}" v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan7" v-if="tab_zhuan==2">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan6" v-if="tab_zhuan==3">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan5" v-if="tab_zhuan==4">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan4" v-if="tab_zhuan==5">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan3" v-if="tab_zhuan==6">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div  class="canvas-content cj_zhuan2" v-if="tab_zhuan==7">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div>
                            <div class="canvas-content cj_zhuan1"  v-if="tab_zhuan==8">
                                <div class="canvas-line">
                                    <div class="canvas-litem" :style="{'-webkit-transform': 'rotate('+item.lineTurn+')',transform: 'rotate('+item.lineTurn+')'}"  v-for="item in prize.allprize" :key="item.id"></div>
                                </div>
                                <div class="canvas-list">
                                    <div class="canvas-item" v-for="item in prize.allprize" :key="item.id">
                                        <font class="canvas-item-text text1" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}" >{{item.name}}</font>
                                        <img class="canvas-item-img" v-if="item.srcs" :src="item.srcs" style="width:60rpx;height:60rpx;" :style="{'-webkit-transform': 'rotate('+item.turn+')',transform: 'rotate('+item.turn+')'}">
                                    </div>
                                </div>
                            </div> 
                            <div class="canvas-btn">
                                <img @click="getLottery" src="https://img11.360buyimg.com/ddimg/jfs/t1/46797/4/796/13006/5ce7e56aE8ae436a0/7310fcb84b8dcf5b.png" v-if="cishu!=0||cishu==''">
                                <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70498/12/314/12055/5ce7e564E129ea835/17061a32bc2889f5.png" v-else>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showgiftmy" class="getedbox">
                <div class="mask"></div>
                <div class="getedtop bigg">
                    <div v-if="getedprize && getedprize.type > 0">
                        <div class="geted_name">恭喜你抽到奖品</div>
                        <img class="geted_pimg" :src="params.dgift" >
                        <img class="geted_bg rotate" :src="params.lighturl" >
                        <div class="geted_name geted_namebot">{{getedprize.name}}</div>
                    </div>
                    <div v-else>
                        <div class="geted_name">很遗憾，未抽中奖品</div>
                        <img class="geted_bg rotate" :src="params.lighturl" >
                        <img class="geted_pimg" :src="params.ngift" >
                    </div>
                    <div class="geted_btnbox">
                        <div class="geted_btn bg-pri" @click="link" :data-url="getedprize.appurl" v-if="getedprize.appurl">查看奖品</div>
                        <div class="geted_btn" @click="closeall">关闭</div>
                    </div>
                </div>
            </div>
        </div>

		<div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);bottom:120rpx;" ></div>
    	
        <div class="is-ipx" ></div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Steps,Step } from 'vant';
    import subtip from '../../components/subtip';

	export default {
		name : 'orderinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Steps.name] : Steps,
            [Step.name] : Step,
            subtip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			order : {},
	  			qrcode : '',
	  			good : {},
	  			shop : {},
	  			group : {},
	  			prize : {},
	  			hxlog : [],
	  			showprize : false,
	  			bindorder : [],
                tab_zhuan : false,
                cishu : false,
                showgiftmy : false,
                chouing : false,
                animationData : false,
                getedprize : {},
				dev : '',
                express : [],
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
            callphone(e){
            	window.location.href = 'tel://' + e.currentTarget.dataset.tel;
            },
            copy(e){
            	var self = this;
		        this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
			         self.$toast('已复制');
		        }, function (e) {
		          	self.$toast('复制失败');
		        })
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            dealorder(e){
		        var self = this;
		        var id = self.order.orderid;
		        var type = e.currentTarget.dataset.type;
		        var postdata = {
		            oid : id,
		            op:type
		        };
		        if( type == 'cancel' || type == 'com' ){
		            var nostr = '确定取消订单吗？';
		            if( type == 'com' ) {
		                var nostr = '确定完成订单吗？';
		            }

			        Dialog.confirm({
					  	message: nostr
					}).then(() => {
						self.$util.http('order','GET',postdata,function(res){
		                    if( res.data && !res.errno ){
		                        if( type == 'cancel' ){
		                            self.$toast('已取消');
		                        }else{
		                            self.order.status = 3;
		                            self.$toast(res.message);
		                        }
		                    }
		                    self.$toast(res.message);
						},true)
					});
		        }else if( type == 'pay' || type == 'com' ){

		            self.$util.http('order','GET',postdata,function(res){
		                if ( !res.errno && res.data ) {
		                    if( type == 'pay' ){

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
                                            self.$toast({
                                                type:'success',
                                                mask : true,
                                                forbidClick : true,
                                                message:'支付完成',
                                                onClose : function(){
                                                    if( self.order.gtype == 2 ){
                                                        self.checkGroup(self.order.orderid);
                                                    }else{
                                                        self.initData();
                                                    }
                                                }
                                            });
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
                                            self.$toast({
                                                type:'success',
                                                mask : true,
                                                forbidClick : true,
                                                message:'支付完成',
                                                onClose : function(){
                                                    if( self.order.gtype == 2 ){
                                                        self.checkGroup(self.order.orderid);
                                                    }else{
                                                        self.initData();
                                                    }
                                                }
                                            });
										} else {
											alert(err.code);
										}
									});
								}else if(self.dev == 'wap'){
									location.href = res.data.mweb_url;
								}else{       
									self.$toast('启动微信支付失败, 请检查你的支付参数.');
								}

		                    }else if( type == 'com' ) {
		                        self.order.status = 3;
		                    }
		                }else{
		                    self.$toast(res.message);
		                }
		            },true);

		        }else if( type == 'comment' ){
		            self.$router.push('/commentorder?id='+self.order.orderid);
		        }
            },
		    getRefund(status,id){
		        var self = this;
		        if( status != 0 ) return false;
		        var postdata = {
		            op:'applyback',
		            oid : id,
		        };
		        Dialog.confirm({
				  	message: '确定要申请退款吗？'
				}).then(() => {
					self.$util.http('order','GET',postdata,function(res){
	                    if( res.data && !res.errno ){
		                    for (var i = 0; i < self.datalist.length; i++) {
		                        if( self.datalist[i].id == postdata.oid ){
		                            self.datalist[i].isback = 1;
		                        }
		                    }
	                    }
	                    self.$toast(res.message);
					})
				});
		    },
            checkGroup(orderid){
                var self = this;
                setTimeout(function(){
                    self.$util.http('confirm','GET',{orderid:orderid,op:'checkgroup'},function(res){    
                        if (!res.errno && res.data) {
                            self.$router.push('/groupinfo?id='+res.data.groupid);
                        }else{
                            self.checkGroup(orderid);
                        }
                    },true);

                },500);
            },
            getLottery : function(){
                var self = this;

                if( self.chouing ) return false;

                self.tab_zhuan = false;
                
                self.chouing = true;
                self.animationData = true;

                self.$util.http('order','GET',{op:'getprize',oid:self.order.id},function(res){
                    if (!res.errno && res.data) {
                        var isother = 0;
                        var otherindex = -1;
                        var isin = 0;
                        for (var i = 0; i < self.prize.allprize.length; i++) {
                            if( self.prize.allprize[i].id*1 == res.data.prizeid*1 ){
                                self.tab_zhuan = i+1;
                                self.getedprize = res.data.prize;
                                isin = 1;
                                /*setTimeout(function(){
                                    self.animationData = false;
                                    self.showgift = 1;
                                },3000)*/
                            }
                            if( self.prize.allprize[i].id == -1 ){
                                isother = 1;
                                otherindex = i;
                            }
                        }

                        setTimeout(function(){
                            self.animationData = false;
                            self.showgiftmy = true;
                        },3000);

                        self.chouing = false;
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            closeall : function(){
                this.tab_zhuan = false;
                this.showgiftmy = false;
                this.showprize = false;
            },
            initData(){
                var self = this;
				self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'orderinfo',
                    oid : params.id ? params.id : 0,
                }
	            self.$util.http('order','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.params.subbgcolor = '#f14919';
                        
                        self.order = res.data.order;
                        self.qrcode = res.data.order.hxqrcode;
                        self.good = res.data.good;
                        self.shop = res.data.shop;
                        self.group = res.data.group;
                        self.prize = res.data.prize;
                        self.hxlog = res.data.hxlog ? res.data.hxlog : [];
                        self.showprize = res.data.prize.isprize == 1 ? true : false;
                        self.bindorder = res.data.bindorder ? res.data.bindorder : [];
		                
                        if( res.data.prize.isprize == 1 ){
                            self.getLottery();
                        }

	                	self.inited = 2;

                        if(self.order.exname && self.order.exnum){
                            var postdata = {
                                op:'express',
                                name:self.order.exname,
                                num:self.order.exnum,
                            }
                            self.$util.http('order','GET',postdata,function(res){
                                if( !res.errno && res.data  ){
                                    self.express = res.data;
                                }
                            })
                        }
                        
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
    background-color: #f5f5f5;
    min-height: 100%;
}
.order-tip {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #878787;
}

.order-wrap {
    padding: 0 15px;
    margin-bottom: 10px;
    color: #222;
    font-size: 13px;
    background-color: #fff;
}

.order-userinfo {
    padding: 13px 0;
    font-size: 15px;
    line-height: 27px;
}

.order-userinfo .icon {
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
}

.order-userinfo .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.order-goods .intro {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 10px;
    background-color: #f8f8f8;
}

.order-goods .intro .pic {
    width: 50px;
    margin-right: 10px;
}

.order-goods .intro .pic img {
    border-radius: 4px;
}

.order-goods .intro .goodtitle{
    -webkit-box-flex: 1;
    flex: 1;
}
.order-goods .intro .desc {
    color: #999999;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.order-detail .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    height: 50px;
}

.order-detail .row .rt {
    -webkit-box-flex: 1;
    flex: 1;
    padding-left: 20px;
    text-align: right;
}

.order-detail .attr {
    padding: 10px 0;
}

.order-detail .attr_item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 5px 0;
}

.order-detail .attr_item .name {
    padding-right: 10px;
    color: #999999;
    flex: 1;
}

.order-detail .total {
    line-height: 57.5px;
    text-align: right;
}

.order-detail .total font {
    font-weight: 500;
    font-size: 20px;
}

.sureorder-popup .title {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    padding: 20px 0;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
}

.redbag-list {
    height: 300px;
    box-sizing: border-box;
}

.redbag-list .item {
    padding: 15px 15px;
    color: #2a2a2a;
    font-size: 14px;
}

.redbag-list .item .radio {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.redbag-list .item .lt .top {
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 500;
}

.redbag-list .item .lt .top font {
    font-size: 20px;
    margin-right: 5px;
}

.redbag-list .item .lt .btm .name {
    margin-bottom: 5px;
    font-size: 14px;
    color: #5a5a5a;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.redbag-list .item .lt .btm .time {
    color: #aaaaaa;
    font-size: 12px;
}

/**/
#main {
    min-height: 100vh;
    background-color: #ffffff;
}

.receive-top {
    height: 99px;
    background: url(http://img11.360buyimg.com/ddimg/jfs/t1/95029/25/1466/12501/5dbef4a1E5a66d82a/f96092bb61827910.png) center no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-weight: 500;
    font-size: 17px;
    padding: 27.5px 15px;
    box-sizing: border-box;
}

.receive-top .title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.receive-top .title .icon {
    margin-left: 5px;
}

.receive-content {
    margin: 0 15px 30px;
}

.receive-usermsg {
    background-color: #fff;
    padding: 15px;
    border-radius: 6px;
    margin-top: -22px;
    font-size: 14px;
    color: #2a2a2a;
    box-shadow: 2px 0px 27px rgba(11,2,5,0.05);
}

.receive-usermsg .top .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    font-weight: 500;
    font-size: 15px;
}

.receive-usermsg .top .info .name {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.receive-usermsg .top .info .name .icon {
    margin-right: 10px;
}

.receive-usermsg .top .adress {
    margin-top: 5px;
    padding-left: 26px;
}

.receive-usermsg .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-top: 20px;
}

.receive-usermsg .btm .name {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.receive-usermsg .btm .name .icon {
    margin-right: 10px;
}

.receive-usermsg .btm .btn {
    height: 24px;
    padding: 0 10px;
    margin: 0 0 0 10px;
    font-size: 13px;
    line-height: 24px;
    color: #fff;
    background-color: #fb2d37;
    border-radius: 5px;
}

.receive-ordermsg {
    font-size: 14px;
    margin-top: 25px;
}

.receive-ordermsg .title {
    font-weight: 500;
    font-size: 17px;
}

.receive-ordermsg .goods {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 15px 0 19px;
}

.receive-ordermsg .goods .pic {
    width: 44px;
    margin-right: 10px;
}

.receive-ordermsg .goods .pic .img {
    border-radius: 5px;
}

.receive-ordermsg .lists {
    padding: 10px 0;
}

.receive-ordermsg .lists .title {
    margin: 5px 0 10px;
    font-size: 14px;
}

.receive-ordermsg .lists .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    line-height: 25px;
}

.receive-ordermsg .space-between {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.receive-total {
    text-align: right;
    line-height: 60px;
}

.receive-total text {
    font-weight: 500;
    font-size: 16px;
}

.receive-btn {
    font-size: 15px;
    border-radius: unset;
    height: 49px!important;
    line-height: 49px!important;
    color: #fff;
    background-color: #fb2d37;
    text-align: center;
}

/**/
page {
    background-color: #f7f7f7;
    box-sizing: border-box;
    color: #2a2a2a;
}

page .goodsHX-common {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(11,2,5,0.05);
}

page .space-between {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.goodsHx-top .title {
    font-size: 18px;
    font-weight: 500;
    padding: 15px;
}

.goodsHx-top .line {
    height: 15px;
}

.goodsHx-top .line img {
    display: block;
    width: 100%;
    height: 100%;
}

.goodsHx-top .msg {
    padding: 30px 0;
}

.goodsHx-top .msg .qrcode {
    position: relative;
    width: 159px;
    margin: 0 auto;
    text-align: center;
}

.goodsHx-top .msg .qrcode .txt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-weight: 500;
    color: #666;
}

.goodsHx-top .msg .tip {
    text-align: center;
    margin-top: 21px;
    font-size: 12px;
    color: #787878;
}

.goodsHx-top .gray {
    opacity: 0.3;
}

.goodsHx-list {
    margin-top: 12px;
}

.goodsHx-list .top {
    padding: 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 500;
}

.goodsHx-list .btm {
    padding: 7.5px 15px;
}

.goodsHx-list .btm .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 14px;
    line-height: 27.5px;
}

.goodscode-btm .list {
    display: block;
    font-size: 14px;
    margin-bottom: 30px;
}

.goodscode-btm .list:last-child {
    margin-bottom: unset;
}

.goodscode-btm .list .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.goodscode-btm .list .info .code {
    font-size: 18px;
}

.goodscode-btm .list .intro {
    margin-top: 5px;
}

.goodscode-btm .aluse {
    color: #999999;
}

.minibtn{
    border: 1px solid #999;
    padding: 1.5px 5px;
    color: #999;
    height: 18px;
    line-height: 18px;
}
.group_box{
  margin:20px 10px;
  background: #fff;
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
  border-radius: 5px;
  padding: 25px 10px;
}
.groupstatus{
  color: #666;
  font-size: 15px;
}
.groupbtn{
  padding: 2.5px 10px;
  border-radius: 1.5px;
  font-size: 14px;
}


/**/
img {
    height: 100%;
}
.pan {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.pan-title {
    width: 86%;
    height: 125px;
    position: absolute;
    top: 62.5px;
    left: 7%;
    z-index: 200;
}

.pan .pan-img,.pan-zz {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.pan .pan-img {
    position: relative;
}

.pan .pan-img img {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
}

.pan-zz {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 6;
}

.pan-zhuan,.pan-zhuan1 {
    width: 300px;
    height: 300px;
    margin: 0 auto;
}
.pan-zhuan1 img{
  background: #fff;
  border-radius: 50%;
}

.pan-zhuan {
    margin-top: 90px;
    position: relative;
}

.main {
    position: absolute;
    top: 27.5px;
    left: 27.5px;
}

.canvas-container ul,.canvas-container li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.canvas-container {
    margin: 0 auto;
    position: relative;
    width: 290px;
    height: 290px;
    border-radius: 50%;
}

.canvas-content {
    position: absolute;
    left: -1.5px;
    top: -1.5px;
    z-index: 1;
    display: block;
    width: 250px;
    height: 250px;
    border-radius: inherit;
    background-clip: padding-box;
    background-color: #f13f4b;
}

.canvas-element {
    position: relative;
    z-index: 1;
    width: inherit;
    height: inherit;
    border-radius: 50%;
}

.canvas-list {
    position: absolute;
    left: 0px;
    top: 0px;
    width: inherit;
    height: inherit;
    z-index: 9999;
}

.canvas-item {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    color: #fcf79b;
    box-sizing: border-box;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
}

.canvas-item-text {
    position: relative;
    display: block;
    padding-top: 20px;
    width: 65px;
    margin: 0 auto;
    text-align: center;
    transform-origin: 50% 125px;
    font-size: 14px;
}

.canvas-item-img {
    display: block;
    margin: 0 auto;
    margin-top: -36.5px;
    text-align: center;
    padding-top: 45px;
    transform-origin: 50% 125px;
}

.canvas-line {
    position: absolute;
    left: -25px;
    top: 0px;
    width: inherit;
    height: inherit;
    z-index: 99;
}

.canvas-litem {
    position: absolute;
    left: 150px;
    top: 0;
    width: 1px;
    height: 150px;
    background-color: #fcf79b;
    overflow: hidden;
    transform-origin: 50% 125px;
}

.canvas-btn {
    position: absolute;
    left: 89.25px;
    top: 82px;
    z-index: 400;
    width: 67.5px;
    height: 67.5px;
}

.gb-run {
    transition: all 6s ease;
}

.pan-btn {
    width: 55%;
    height: 52.5px;
    margin: -97.5px auto 0;
    position: relative;
    z-index: 200;
}

.dan {
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
}

.dan-top {
    width: 100%;
    height: 100px;
}

.dan-bottom {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background: #f13f4b;
    height: 430px;
    overflow-y: scroll;
}

.dan-list {
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    background: #fec56c;
    margin-bottom: 10px;
    overflow: hidden;
}

.right {
    float: right;
    width: 80%;
}

.left {
    float: left;
    width: 39px;
    height: 39px;
    border-radius: 50%;
    margin-top: 5px;
}

.dan-list div {
    box-sizing: border-box;
    font-family: "微软雅黑";
    font-size: 12.5px;
    color: #955340;
    overflow: hidden;
}

.dan-list div.left img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.dan-list div:last-child {
    margin-top: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dan-list div font:first-child {
    float: left;
    width: 50%;
    font-size: 10px;
}

.dan-list div font:last-child {
    float: right;
    width: 50%;
    font-size: 10px;
}

.guize {
    width: 100%;
    box-sizing: border-box;
    margin-top: 7.5px;
}

.guize-top {
    width: 100%;
    height: 100px;
}

.guize-bottom {
    width: 100%;
    padding: 0px 15px 15px;
    box-sizing: border-box;
    background: #ff8b52;
}

.guize-bottom div.details {
    width: 100%;
    line-height: 25px;
    padding: 5px 20px 15px;
    box-sizing: border-box;
    font-family: "微软雅黑";
    font-size: 14px;
    color: #fff;
}

.show {
    display: block;
}

.hide {
    display: none;
}

.canyu {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    padding: 25px;
    box-sizing: border-box;
    z-index: 900;
}

.canyu div.cy-1 {
    width: 100%;
    height: 359px;
    margin-top: 80px;
}

.canyu div.cy-2 {
    width: 50%;
    height: 45px;
    position: absolute;
    bottom: 182.5px;
    left: 93px;
    z-index: 1000;
}

.canyu div.cy-3 {
    width: 32.5px;
    height: 32.5px;
    margin-top: 50px;
    position: absolute;
    top: 30px;
    right: 45px;
    z-index: 2000;
}

.zhong {
    width: 100%;
    height: 100%;
    padding: 25px;
    background: rgba(0,0,0,0.5);
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.zhong-tu {
    width: 100%;
    height: 480px;
    box-sizing: border-box;
    margin-top: 25px;
}

.zhong-title {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 245px;
    left: 95px;
}

.zhong-title div:first-child {
    width: 55%;
    box-sizing: border-box;
    font-family: "微软雅黑";
    font-size: 16px;
    color: #fff;
    text-align: center;
}

.zhong-title div:last-child {
    width: 85px;
    height: 85px;
    margin-top: 17.5px;
    margin-left: 45px;
}

.zhong-btn {
    width: 50%;
    height: 45px;
    margin: 0 auto;
    margin-top: -65px;
}

.jilv {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    padding: 25px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 2000;
}

.jilv-img {
    width: 100%;
    height: 150px;
    position: relative;
    margin-top: 10px;
}

.jilv-img div {
    position: absolute;
    top: 28px;
    left: 101px;
    width: 120px;
    height: 28px;
    font-family: "微软雅黑";
    font-size: 15px;
    color: #000;
    text-align: center;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jilv-lists {
    position: absolute;
    top: 110px;
    left: 35px;
    width: 80.5%;
    height: 475px;
    padding: 0 10px;
    box-sizing: border-box;
    overflow-y: scroll;
}

.jilv-list {
    width: 100%;
    overflow: hidden;
    background: #ffe1b7;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 5px;
}

.jilv-list div:nth-child(1) {
    width: 40px;
    height: 40px;
    float: left;
}

.jilv-list div:nth-child(2) {
    width: 148px;
    float: left;
    margin-left: 7.5px;
}

.jilv-list div:nth-child(2) text {
    display: block;
    width: 100%;
    font-family: "微软雅黑";
    font-size: 9px;
    color: #000;
    margin-top: 4px;
}

.jilv-list div:nth-child(2) text:first-child {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
}

.jilv-list div:nth-child(3) {
    float: right;
    width: 65px;
    margin-top: 5px;
}

.jilv-list div:nth-child(3) div {
    width: 100%;
    font-size: 12.5px;
    background: #f13f4b;
    color: #fff;
    padding: 0 2.5px;
}

.jilv-list div:nth-child(3) div::after {
    border: none;
}

.jilv-close {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1000;
}

.tishi {
    margin: 3px auto 0;
    width: 60%;
    padding: 3px 0;
    text-align: center;
    color: red;
    font-size: 12px;
    background: rgba(255,255,255,0.6);
}

.zbf {
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
}

.zbf01 {
    width: 100%;
    box-sizing: border-box;
    font-size: 12px;
    color: #fff;
    text-align: center;
}

.cj_zhuan0 {
    transform: rotate(0deg);
    animation: zhuandong 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan1 {
    transform: rotate(45deg);
    animation: zhuandong1 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan2 {
    transform: rotate(90deg);
    animation: zhuandong2 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan3 {
    transform: rotate(135deg);
    animation: zhuandong3 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan4 {
    transform: rotate(180deg);
    animation: zhuandong4 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan5 {
    transform: rotate(225deg);
    animation: zhuandong5 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan6 {
    transform: rotate(270deg);
    animation: zhuandong6 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan7 {
    transform: rotate(315deg);
    animation: zhuandong7 3s linear infinite;
    animation-iteration-count: 1;
}

.cj_zhuan8 {
    transform: rotate(360deg);
    animation: zhuandong 3s linear infinite;
    animation-iteration-count: 1;
}

@-webkit-keyframes zhuandong {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1080deg);
    }
}

@keyframes zhuandong {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1080deg);
    }
}

@-webkit-keyframes zhuandong1 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1125deg);
    }
}

@keyframes zhuandong1 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1125deg);
    }
}

@-webkit-keyframes zhuandong2 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1170deg);
    }
}

@keyframes zhuandong2 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1170deg);
    }
}

@-webkit-keyframes zhuandong3 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1215deg);
    }
}

@keyframes zhuandong3 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1215deg);
    }
}

@-webkit-keyframes zhuandong4 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1260deg);
    }
}

@keyframes zhuandong4 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1260deg);
    }
}

@-webkit-keyframes zhuandong5 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1305deg);
    }
}

@keyframes zhuandong5 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1305deg);
    }
}

@-webkit-keyframes zhuandong6 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1350deg);
    }
}

@keyframes zhuandong6 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1350deg);
    }
}

@-webkit-keyframes zhuandong7 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1395deg);
    }
}

@keyframes zhuandong7 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(1395deg);
    }
}


.rotateani{
    animation: zhuandong10 100s linear infinite;
    -webkit-animation: zhuandong10 100s linear infinite;
}
@keyframes zhuandong10 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(36000deg);
    }
}
@-webkit-keyframes zhuandong10 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(36000deg);
    }
}
.yes {
    transform: rotate(1deg);
}

/**/
.getedbox{
    position: relative;
    z-index: 7;
}
.getedtop{
    position: fixed;
    top: 100px;
    z-index: 6;
    width: 350px;
    height: 350px;
    left: 12.5px;
}
.geted_bg{
  position: absolute;
  z-index: 7;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.geted_pimg{
  width: 100px;
  height: 100px;
  position: relative;
  z-index: 10;
  padding-left: 125px;
  padding-top: 75px;
}
.geted_name{
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 21px;
}
.geted_namebot{
  font-size: 18px;
}

.rotate{
    -webkit-animation:rotatea 4s linear infinite;
}
@-webkit-keyframes rotatea{
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);}
}

.bigg{
    -webkit-animation:bigg 0.3s linear;
    transform-origin: center center;
}
@-webkit-keyframes bigg{
    0%{-webkit-transform:scale(0);}
    25%{-webkit-transform:scale(0.25);}
    50%{-webkit-transform:scale(0.5);}
    75%{-webkit-transform:scale(0.75);}
    100%{-webkit-transform:scale(1);}
}

.geted_btnbox{
    position: absolute;
    z-index: 7;
    bottom: -25px;
    width: 100%;
    text-align: center;
}
.geted_btn{
    background: #ed414a;
    color: #fff;
    padding: 5px 0;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
    width: 100px;
    font-size: 16px;
}
.geted_btn:nth-of-type(2){
  margin-left: 25px;
}

.code .state{
    font-size: 12.5px;
}

.bindorder_box{
    align-items: center;
}
.bindorder_box .groupstatus .thumb{
    width: 50px;
    height: 50px;
    margin-right: 5px;
    border-radius: 2.5px;
}
.fix-box{
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 0;
}
.pan-box{
    position: relative;
    z-index: 103;
}
.name.blod{
    color: #333!important;
}
</style>