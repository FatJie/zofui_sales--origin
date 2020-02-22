<template>

<div v-if="!params.isjoin || params.isjoin == 0">
    <div  bindtap="params.jointype == 0  ? 'navigateto' : 'showJoin'" @click="showJoin(params.jointype)" class="shop-join" data-url="/shopjoin" :data-tel="params.jointel" :data-copy="params.joinwx">
        <img :src="params.joinbg ? params.joinbg : 'http://img11.360buyimg.com/ddimg/jfs/t1/64884/15/14399/12214/5dbeec29E7784b2d1/8154c800cb6e176a.png?v=1.0'">
    </div>

    <div class="m-pop pop-container--visible" v-if="Joinanimation">
        <div class="pop-shade"></div>
        <div class="pop-modal" :class="Joinanimation ? 'bounceInUp':''">
            <div class="infopop-wrap">

                <div class="infopop-content">
                    <div class="pop-join">
                        <img class="topimg" src="http://img11.360buyimg.com/ddimg/jfs/t1/86770/37/1484/8733/5dbeec50Ea085d783/9458ef05cd519591.png">
                        <div class="area">
                            <div class="tit">申请入驻</div>
                            <div class="txt" >
                                {{params.jointype == 1 ? '请拨打电话联系客服开店' : ''}}
                                {{params.jointype == 2 ? '请点击下方按钮联系客服说明开店' : ''}}
                                {{params.jointype == 3 ? '复制下方客服微信号，添加客服微信号并联系开店' : ''}}
                            </div>
                            <div class="more">
                                <div class="more_item" v-if="params.jointype == 1">
                                    <div class="ct">电话：{{params.jointel}}</div>
                                    <div @click="bindtap($event,'tel')" class="btn" :data-tel="params.jointel">拨打</div>
                                </div>
                                <div class="more_item" v-if="params.jointype == 2">
                                    <div @click="bindtap($event,'img')" :data-img="params.kfqr" class="btn btn-pri">联系客服</div>
                                </div>
                                <div class="more_item" v-if="params.jointype == 3">
                                    <div class="ct">微信：{{params.joinwx}}</div>
                                    <div @click="bindtap($event,'copy')" class="btn" :data-copy="params.joinwx">复制</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="hideJoin" class="infopop-close">
                    <font class="iconfont"></font>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script type="text/javascript">
    import { Toast,Dialog } from 'vant';
	export default {
        components: {
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
        },
	    props: ['isshow','params'],
        data : function(){
            return {
                Joinanimation : false,
            }
        },
	    created(){
	    	

	    },
        methods : {
            showJoin(type){
                if( type == 0 ){
                    this.$router.push('/shopjoin');
                }else{
                    this.Joinanimation = true;
                }
            },
            hideJoin(){
                this.Joinanimation = false;
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            }
        }
	}
</script>

<style type="text/css" scoped>
@import "../assets/css/iconfont.css";

.shop-join {
    position: fixed;
    top: 80%;
    right: 10px;
    z-index: 5;
    width: 60px;
    height: 60px;
    margin-top: -25px;
}

.shop-join img {
    display: block;
    width: 100%;
    height: 100%;
}

.pop-join .topimg {
    width: 100%;
    height: 121px;
    margin-bottom: 15px;
}

.pop-join .area {
    padding: 0 25px;
}

.pop-join .tit {
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 23px;
    color: #222;
}

.pop-join .more {
    margin-top: 25px;
}

.pop-join .more_item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-top: 8px;
    font-size: 14px;
    line-height: 27px;
    color: #222;
}

.pop-join .more_item .icon {
    display: inline-block;
    vertical-align: top;
    margin-right: 12px;
    font-size: 15px;
}

.pop-join .more_item .ct {
    -webkit-box-flex: 1;
    flex: 1;
    text-align: left;
}

.pop-join .more_item .btn {
    height: 27px;
    padding: 0 15px;
    font-size: 13px;
    line-height: 27px;
    color: #fff;
    background-color: #FFB946;
    border-radius: 5px;
}
</style>