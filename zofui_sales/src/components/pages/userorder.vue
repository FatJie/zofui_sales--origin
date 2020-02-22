<template>

    <div class="headorder" :class="params.style" :style="{color:itemout.params.color,'margin':itemout.params.mv+'px 10px'}">

        <div class="item_cell_box headorder_t" @click="link" data-url="/orderlist">
            <div class="item_cell_flex headorder_title">我的订单</div>
            <div class="headorder_r">全部订单</div>
        </div>
        <div class="item_cell_box headorder_m">
            <div class="order-item" v-for="item,i in itemout.params.data" :key="i" @click="link" :data-url="order[i].url">
                <img :src="item.img">
                <div>{{item.name}}</div>
                <div class="order_mark color-pri border-pri" v-if="i == 0 && num['waitpay'] > 0">{{num['waitpay']}}</div>
                <div class="order_mark color-pri border-pri" v-if="i == 1 && num['waitsend'] > 0">{{num['waitsend']}}</div>
                <div class="order_mark color-pri border-pri" v-if="i == 2 && num['sended'] > 0">{{num['sended']}}</div>
                <div class="order_mark color-pri border-pri" v-if="i == 3 && num['waitdis'] > 0">{{num['waitdis']}}</div>
            </div>
        </div>
        <div class="item_cell_box headorder_b " v-if="itemout.params.isbind != 1 && itemout.params.bindtype == 0" @click="bind">
            <div class="item_cell_flex">{{itemout.params.btext}}</div>
            <div>
                <span class="bindbtn">立即绑定</span>
            </div>
        </div>
        <div class="item_cell_box headorder_b headorder_b2" v-if="itemout.params.isbind != 1 && itemout.params.bindtype == 1" @click="bind">
            <div class="item_cell_flex">{{itemout.params.btext}}</div>
            <div class="color-pri">
                立即绑定
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
    import { Lazyload } from 'vant';
	export default {
        components: {
            [Lazyload.name] : Lazyload,
        },
	    props: ['itemout','params','order','num'],
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
            bind(){
                this.$emit('bind');
            }
        }

	}
</script>

<style type="text/css">
@import "../../assets/css/common.css";
.headorder{
    margin: 0 10px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    padding: 10px;
    border-radius: 5px;
}
.order-item{
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: #999;
    position: relative;
}
.order-item img{
    width: 30px;
    height: 30px;
    display: inline-block;
}
.headorder_t{
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}
.headorder_m{
    padding: 15px 0;
}
.headorder_b{
    padding-top: 15px;
    color: #999;
    align-items: center;
    font-size: 13px;
}
.bindbtn{
    display:inline-block;
    color: red;
    border:1px solid red;
    padding: 3px 10px;
    border-radius: 3px;
}
.headorder_b2{
    height: 26px;
    padding: 0 8px 0 8px;
    line-height: 26px;
    background-color: #fff8ed;
    border-radius: 4px;
}
.headorder_title{
    color: #333;
    font-weight: bold;
    font-size: 15px;
}
.headorder_r{
    color: #999;
    font-size: 12px;
}
.order_mark{
    height: 11px;
    min-width: 11px;
    padding: 1px;
    line-height: 11px;
    font-size: 12px;
    border-radius: 9px;
    position: absolute;
    border: 1px solid #fff;
    top: -3px;
    right: 10px;
    background: #ffffff;
}
</style>