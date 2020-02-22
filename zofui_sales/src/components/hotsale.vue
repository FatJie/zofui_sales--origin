<template>

<div>
<div class="modal-dialog " :class="inn.isshow == 1 ? 'modal-dialog--visible' : ''" v-for="inn in item" >
    <div class="shade" ></div>
    <div class="modal animated bounceInUp">
        <div catchtap="prevent">
            <div class="recommendbox">

                <template v-if=" inn.stype == 0 || inn.stype == 2 || !inn.stype ">
                    <img class="recommendbg" mode="widthFix" src="https://ui.aiyichuan.com/xcx_urm/img/home/bg-hot_sales.png">
                    <div class="box">
                        <div class="goods" @click="link" :data-url="inn.appurl">
                            <img class="img" :src="inn.thumb">
                            <div class="left">
                                <div class="title">{{inn.title}}</div>
                                <div class=" price" >
                                    <div class="color-pri">
                                        <font class="mark" v-if="inn.price > 0">￥</font>
                                        <font class="num">{{inn.price}}</font>
                                    </div>
                                    <font class="divs" v-if="inn.show_div">{{inn.show_div}}人喜欢</font>
                                </div>
                            </div>
                        </div>
                        <div class="timeout">
                            <div v-if="inn.time > 0">— {{inn.timetype == 1 ? '活动倒计时' : '距活动开始'}} <font>{{date.day}}</font>天<font>{{date.hour}}</font>：<font>{{date.minute}}</font>：<font>{{date.second}}</font> —</div>
                        </div>
                        <div class="btn" @click="link" :data-url="inn.appurl">{{inn.btn}}</div>
                    </div>
                </template>
                <template v-else>
                    <div class="btn-formid"  @click="bindtap($event,inn.type)"  :data-tel="inn.tel" :data-url="inn.appurl" :data-weburl="inn.weburl"  >
                        <img class="recommendbgimg" mode="widthFix" :src="inn.img">
                    </div>
                </template>

                <div @click="open" class="closebtn">
                    <font class="iconfont icon-close">×</font>
                </div>
            </div>
        </div>
    </div>
</div>
</div>


</template>

<script type="text/javascript">
	export default {
	    props: ['item','isshowhot'],
        data : function(){
            return {
                date : {
                    day : 0,
                    hour : 0,
                    minite : 0,
                    second : 0,
                },
                timer : null,
                show : false,
            }
        },
	    created(){
            this.open();
	    },
        watch: {
            isshowhot(newValue, oldValue) {
                this.show = newValue;
                if( newValue ){
                    this.open();
                }
                return newValue;
            },
        },
        methods: {
            link(e){
                this.open();
                this.$router.push(e.currentTarget.dataset.url);
            },
            timeEnd: function() {
                clearInterval(this.timer);
                this.timer = null;
            },
            bindtap(e,type){
                this.open();
                this.$util.bindtap(e,type,this);
            },
            getCurrentTime: function(timedesc) {
                var self = this;
                self.timeEnd();
                if( !timedesc || timedesc <= 0 ) return false;
                this.timer = setInterval(function() {
                    var i = new Date().getTime();
                    var endTime = timedesc + '000';
                    var lag = (endTime*1 - i);
                    var second = minite = hour = day = 0;
                    if(lag > 0){
                        var second = Math.floor(lag/1000%60);
                        var minite = Math.floor(lag/1000/60%60);
                        var hour = Math.floor(lag/1000/60/60%24);
                        var day = Math.floor(lag/1000/60/60/24);
                    }
                    self.date.day = day;
                    self.date.hour = hour;
                    self.date.minute = minite;
                    self.date.second = second;
                },1000);
            },
            open: function() {
                var self = this;
                self.timeEnd();

                for (var i = 0; i < self.item.length; i++) {
                    var item = self.item[i];
                    if( item.isshow == 1 ){
                        self.$set(item,'showed',1);
                        self.$set(item,'isshow',0);
                    }else{
                        if( !item.showed ){
                            self.$set(item,'isshow',1);

                            self.getCurrentTime(item.time);
                            return false;
                        }
                    }
                }
            },

        }

	}
</script>

<style type="text/css">
.recommendbox {
    position: fixed;
    left: 50%;
    top: 55%;
    transform: translate(-50%,-60%);
    z-index: 3;
}

.recommendbox .recommendbg {
    width: 375px;
}

.recommendbox .box {
    position: absolute;
    top: 175px;
    left: 50%;
    transform: translateX(-50%);
}

.recommendbox .goods {
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    width: 221px;
}

.recommendbox .goods .img {
    width: 72px;
    height: 72px;
    margin-right: 11.5px;
}

.recommendbox .goods .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.recommendbox .goods .title {
    font-size: 13px;
    color: rgba(34,34,34,1);
    line-height: 17px;
    display: box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 34px;
}

.recommendbox .goods .price {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.recommendbox .goods .price .divs {
    font-size: 11px;
    color: #ccc;
}

.recommendbox .goods .price .mark {
    font-size: 9px;
}

.recommendbox .goods .price .num {
    font-size: 14px;
    font-weight: 500;
}

.recommendbox .timeout {
    font-size: 13px;
    height: 18px;
    color: rgba(34,34,34,1);
    line-height: 18px;
    margin: 34px 0 18px 0;
    text-align: center;
}

.recommendbox .timeout font {
    display: inline-block;
    height: 16px;
    min-width: 16px;
    padding: 0 3px;
    line-height: 16px;
    text-align: center;
    color: white;
    font-size: 12px;
    background: #1B1B1B;
    box-sizing: border-box;
}

.recommendbox .btn {
    background: linear-gradient(rgb(254,229,89),rgb(249,188,12));
    width: 183px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #333;
    margin: 5px auto;
    border-radius: 50px;
}

.recommendbox .closebtn {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
    width: 30px;
    height: 30px;
    border: 1.5px solid rgba(248,248,248,1);
    color: white;
    border-radius: 50%;
    line-height: 30px;
    text-align: center;
}
.recommendbgimg{
    width:300px;
    margin-bottom: 15px;
}

/**/
.animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}

@-webkit-keyframes bounceInUp {
    from,60%,75%,90%,to {
        animation-timing-function: cubic-bezier(0.215,0.610,0.355,1.000);
    }

    from {
        opacity: 0;
        transform: translate3d(0,3000px,0);
    }

    60% {
        opacity: 1;
        transform: translate3d(0,-20px,0);
    }

    75% {
        transform: translate3d(0,10px,0);
    }

    90% {
        transform: translate3d(0,-5px,0);
    }

    to {
        transform: translate3d(0,0,0);
    }
}

@keyframes bounceInUp {
    from,60%,75%,90%,to {
        animation-timing-function: cubic-bezier(0.215,0.610,0.355,1.000);
    }

    from {
        opacity: 0;
        transform: translate3d(0,3000px,0);
    }

    60% {
        opacity: 1;
        transform: translate3d(0,-20px,0);
    }

    75% {
        transform: translate3d(0,10px,0);
    }

    90% {
        transform: translate3d(0,-5px,0);
    }

    to {
        transform: translate3d(0,0,0);
    }
}

.bounceInUp {
    animation-name: bounceInUp;
}

.modal-dialog {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
}

.modal-dialog .shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    transition: all 0.3s;
}

.modal-dialog .modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
}

.modal-dialog.modal-dialog--visible {
    display: block;
}
</style>