<template>

    <div class="headucard item_cell_box " :class="params.style" :style="{'background-color':itemout.params.bg,color:itemout.params.color,'margin-top':itemout.params.top+'px'}" @click="link" data-url="/ucard">
        <template v-if="itemout.params.style == 1">
            <div class="ucard_icon">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/91316/8/6068/1283/5df1c64eEa27dcc02/f723f0488e28e2a2.png" />
            </div>
            <div class="ucard_info item_cell_flex">
                <div class="ucard_name">{{userinfo.level > 0 && params.twoucard == 1 && userinfo.cardlevel == 1 ? params.upcname : params.cardname}}</div>
                <div class="ucard_desc">{{userinfo.level == 1 ? '到期时间：'+userinfo.cardend : params.carddesc}}</div>
            </div>
            <div class="ucard_r">{{userinfo.level == 1 ? '会员中心' :'开通会员'}}</div>
        </template>
        <template v-else>
            <div class="ucard_icon item_cell_flex">
                <div class="item_cell_box ucard_icon2">
                    <img src="http://img11.360buyimg.com/ddimg/jfs/t1/91316/8/6068/1283/5df1c64eEa27dcc02/f723f0488e28e2a2.png" />
                    <div>{{userinfo.level > 0 && params.twoucard == 1 && userinfo.cardlevel == 1 ? params.upcname : params.cardname}}</div>
                </div>
                <div class="ucard_desc">
                    {{userinfo.level == 1 ? '到期时间：'+userinfo.cardend : params.carddesc}}
                </div>
            </div>
            <div class="ucard_r2 bg-pri">{{userinfo.level == 1 ? '会员中心' :'开通会员'}}</div>
        </template>
    </div>

</template>

<script type="text/javascript">
	export default {
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
.headucard{
    align-items: center;
    background-color: #272425;
    padding: 7px 12px;
    border-radius: 8px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    margin:0 10px;
    font-size: 14px;
}
.ucard_icon{
    padding-right: 10px;
}
.ucard_icon img{
    width:20px;
    height: 20px;
}

.ucard_desc{
    font-size: 13px;
    color: #999;
}
.ucard_icon2{
    align-items: center;
    padding-bottom: 10px;
}
.ucard_icon2 img{
    margin-right: 10px;
    width:10px;
    height: 10px;
}
.ucard_r2{
    background-color: red;
    padding:3px 10px;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
}
.item_cell_box{
    display: flex;
}
.item_cell_flex{
    flex: 1;
}
.ucard_r{
    font-size: 12px;
}
.ucard_name{
    padding-bottom: 5px;
}
</style>