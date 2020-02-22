<template>
    
    <div class="shop-itemin item_cell_box thin-border_b" @click="link" :data-url="item.appurl" >
        <div class="top_pic shop-headimg image-box ">
            <img v-lazy="item.headimg" />
        </div>
        <div class="item_cell_flex shop-itemr">
            <div class="item_cell_box">
                <div class="item_cell_flex shop-iname">
                    <good :name="item.name" :tag="goodtag" :istag="isgood"></good>
                </div>
                <div class="font-fail">{{item.distance}}</div>
            </div>
            <div class="item_cell_box shop-rate">
                <div class="item_cell_flex">
                    <van-rate readonly size="14" :value="item.rate*1"  />
                </div>
                <div class="font-fail">人气:{{item.times}}</div>
            </div>
            <div class="item_cell_box shop-add" @click.stop="bindtap($event,'loc')" :data-lat="item.lat" :data-lng="item.lng" :data-addname="item.name" :data-address="item.address">
                <div class="font-fail item_cell_flex">{{item.address}}</div>
                <div class="iconfont icon-position">
                    <van-icon name="location-o" />
                </div>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
    import { Rate,Icon } from 'vant';
    import good from './good';
	export default {
	    props: ['item','goodtag','isgood'],
        components: {
            [Rate.name] : Rate,
            [Icon.name] : Icon,
            good,
        },
        data : function(){
            return {
            }
        },
	    created(){
            

	    },
        methods : {
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
        }
	}
</script>

<style type="text/css" scoped>
.shop-headimg{
    width: 100px;
    height: 100px;
    border-radius: 5rpx;
    overflow: hidden;
}
.shop-itemin{
    padding: 10px 0;
}
.shop-itemr{
    height: 100px;
    font-size: 14px;
    padding: 0 0 0 10px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.shop-iname{
    font-size: 16px;
    font-weight: 700;
}
.shop-rate{
    align-items: center;
}
.font-fail{
    color: #999;
}
.shop-add{
    align-items: center;
}
.shop-add .icon-position{
    font-size: 20px;
}

</style>