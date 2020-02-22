<template>

    <div class="i-swiper" v-if="itemout.name == 'slide'" :style="{padding: '0 '+itemout.params.paddingv+'px'}">
        <van-swipe  :autoplay="itemout.params.ischange == 0 ? itemout.params.changetime*1000 : 0" :show-indicators="itemout.params.showpoint == 0 ? true : false" :indicator-color="itemout.params.actcolor" :duration="itemout.params.changelast">
            <van-swipe-item v-for="(item,index) in itemout.params.data" :key="index" @click="bindtap($event,item.type)" :data-url="item.appurl" :data-weburl="item.weburl" :data-tel="item.tel" >
                <img v-lazy="item.img" :style="{width:'100%',height: (itemout.params.imgheight ? itemout.params.imgheight +'vw' :'auto')}" />
            </van-swipe-item>
        </van-swipe>
    </div>

</template>

<script type="text/javascript">
    import { Swipe,SwipeItem,Lazyload } from 'vant';
	export default {
        components: {
            [Swipe.name] : Swipe,
            [SwipeItem.name] : SwipeItem,
            [Lazyload.name] : Lazyload,
        },
	    props: ['itemout'],
        data : function(){
            return {
                timer : null,
                show : false,
            }
        },
	    created(){
            
	    },
        methods: {
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },

        }

	}
</script>

<style type="text/css">
@import "../../assets/css/common.css";

.i-swiper {
    position: relative;
}

.i-swiper .swiper-dots {
    position: absolute;
    left: 50%;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    bottom: 5px;
    transform: translateX(-50%);
}

.i-swiper .swiper-dots .item {
    width: 9px;
    height: 1px;
    margin: 0 5px;
    border-radius: 0;
    background-color: #fff;
}

.i-swiper .swiper-dots .active {
    width: 9px;
    height: 9px;
    border: 1px solid #fff;
    border-radius: 50%;
    background-color: transparent;
}
</style>