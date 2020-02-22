<template>
    <div>
        <div v-if="subdata.isshow == 1">
            <div class="item_cell_box subtop_item" :style="{top:dev == 'app' ? '60px' : 0}">
                <div class="sub_headimg" @click="subqr">
                    <img :src="subdata.guanzhuhd" />
                </div>
                <div class="item_cell_flex sub_notice" @click="subqr">{{subdata.guanzhutip ? subdata.guanzhutip : '更多有趣的好物'}}</div>
                <div class="sub_click" @click="subqr">{{showtype == 0 ? '关注公众号' : '下载APP'}}</div>
                <div class="close_sub" @click="closesub">×</div>
            </div>
            <div class="block" :style="{'background-color':params.subbgcolor}"></div>
        </div>
        <div class="m-pop pop-container--visible" v-if="showqun">
            <div class="pop-shade"></div>
            <div class="pop-modal" :class="showqun ? 'bounceInUp':''">
                <div class="infopop-wrap">
                    <div class="infopop-content">
                        <img :src="subdata.guanzhuqr">
                        <div class="subtxt">{{subdata.guanzhuft}}</div>
                    </div>
                    <div @click="showqunfn" class="infopop-close">
                        <van-icon name="cross" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import { Popup,Icon } from 'vant';

	export default {
        components: {
            [Popup.name] : Popup,
            [Icon.name] : Icon,
        },
	    props: ['isshowshare','params'],
        data : function(){
            return {
                showstatus : true,
                showqun : false,
                subdata : {},
                dev : '',
                downurl : '',
                showtype : 0, // 0关注 1下载app
            }
        },
        created:function(e){
            this.subdata = this.params.subqr;

            var dev = this.$util.dev();
            if( dev == 'app' ){
                this.dev = 'app';
            }
            if( dev == 'wap' ){
                if( this.params.subqr.wapttip == 0 ){
                    this.showtype = 0;
                }
                if( this.params.subqr.wapttip == 1 ){
                    this.showtype = 1;
                }

            }else if(dev == 'app'){
                this.showtype = 0;
            }else if(dev == 'wx'){
                if( this.params.subqr.toptip == 0 ){
                    this.showtype = 0;
                }
                if( this.params.subqr.toptip == 1 ){
                    this.showtype = 1;
                }
            }
        },
        methods :{
            closesub(){
                this.subdata.isshow = 0;
            },
            subqr(){
                if(this.showtype == 0){
                    this.showqun = true;
                }else if(this.showtype == 1){
                    let url = this.$util.Murl('downapp');
                    location.href = url;
                }
            },
            showqunfn(){
                this.showqun = false;
            },
            hide(){
                this.show = false;
                this.$emit('shareit',false);
            }
        },
        watch: {
            isshowshare(newValue, oldValue) {
                this.show = newValue;
                return newValue;
            },
        }
	}
</script>

<style type="text/css" scoped>
.subtop_item{
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    height: 44px;
    display: flex;
    align-items: center;
}
.block{
    height: 44px;
}
.top_top{
    background: #43da71;
    height: 50px;
}
.subtop_item .sub_headimg{
  padding-left: 10px;
}
.subtop_item .sub_headimg img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.subtop_item .sub_click{
    border-radius: 2.5px;
    color: #22e600;
    border: 1px solid #22e600;
    padding: 2.5px 10px;
    font-size: 12px;
    margin-right: 10px;
    cursor: pointer;
}
.subtop_item .sub_click,.toadd_click{
    border-radius: 2.5px;
    color: #22e600;
    border: 1px solid #22e600;
    padding: 2.5px 10px;
    font-size: 12px;
    margin-right: 10px;
}
.subtop_item .close_sub{
    background: rgba(255, 255, 255, 0.7);
    color: #000;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: inline-block;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    margin-right: 10px;
    font-size: 12px;
}
.sub_str{
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
}
.sub_notice{
    flex: 1;
  padding-left:10px;
  font-size: 13px;
}
.info-orderpay .topimg {
    width: 100%;
    height: 121px;
    margin-bottom: 15px;
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
    background: rgb(0, 221, 55);
}

.info-orderpay .btn_box .btn_cancel {
    color: #222;
    border-color: #222;
    border-radius: 10px;
}

.info-orderpay .btn_box .btn_pay {
    background-color: #F23723;
}
.infopop-content{
    padding: 10px;
}
.infopop-content img{
    width: 100%;
}
.subtxt{
    padding: 10px 0;
}
</style>