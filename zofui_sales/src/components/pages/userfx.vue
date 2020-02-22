<template>

    <div class="headfx" :class="params.style" :style="{'margin-top':itemout.params.mv+'px'}">
        <div v-if="itemout.params.style == 0" class="headfx1-style item_cell_box" @click="link" data-url="/fenxiaouser">
            <div class="item_cell_flex">
                <div class="headfx1-tips">{{itemout.params.stext}}</div>
                <div class="headfx1-desc">已邀请{{userinfo.downnum > 0 ? userinfo.downnum : 0}}人，已赚得{{userinfo.totalmoney > 0 ? userinfo.totalmoney : '0.00'}}元</div>
            </div>
            <div class="headfx1-btn bg-pri" v-if="itemout.params.btn">{{itemout.params.btn}}</div>
        </div>
        <div class="headfx2-style" v-if="itemout.params.style == 1">
            <div class="item_cell_box headfx2-top" @click="link" data-url="/fenxiaobill">
                <div class="item_cell_flex headfx2-draw">
                    <div class="headfx2-numt">{{userinfo.money}}</div>
                    <div class="headfx2-numb">可提现资金（元）</div>
                </div>
                <div class="headfx2-btn bg-pri" v-if="itemout.params.dbtn">{{itemout.params.dbtn}}</div>
            </div>
            <div class="item_cell_box headfx2-bot" @click="link" data-url="/fenxiaouser">
                <div class="headfx2-num">
                    <div class="headfx2-numt">{{userinfo.totalmoney > 0 ? userinfo.totalmoney : '0.00'}}</div>
                    <div class="headfx2-numb">已获收益（元）</div>
                </div>
                <div class="item_cell_flex headfx2-num">
                    <div class="headfx2-numt">{{userinfo.downnum > 0 ? userinfo.downnum : 0}}</div>
                    <div class="headfx2-numb">已经邀请（位）</div>
                </div>
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
	    props: ['itemout','params','userinfo'],
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


.headfx{
    border-radius: 8px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    margin:0 10px;
}
.headfx1-style{
    background-size: auto 100%;
    background-position: 100% 0;
    background-repeat: no-repeat;
    align-items: center;
    background-image: url('http://img11.360buyimg.com/ddimg/jfs/t1/94310/9/6434/38114/5df382bfE5b3479b2/16b30ab4aac68d6a.png');
    padding: 10px;
}
.headfx1-tips{
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding-bottom: 10px;
}
.headfx1-desc{
    padding-top: 10px;
    color: #999;
    font-size: 12px;
}
.headfx1-btn,.headfx2-btn{
    color: #fff;
    padding: 0 10px;
    border-radius: 3px;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
}
.headfx2-style{
    padding: 15px;
}
.headfx2-top{
    padding-bottom: 10px;
    border-bottom: 1px solid #fcfcfc;
}
.headfx2-bot{
    padding-top: 10px;
}
.headfx2-numb{
    font-size: 12px;
    color: #999;
}
.headfx2-numt{
    color: #333;
    font-weight: bold;
    font-size: 18px;
    padding-bottom: 5px;
    padding-left: 5px;
}
.headfx2-num{
    width: 50%;
    text-align: left;
}
</style>