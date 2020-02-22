<template>
    <div class="quest_item ">
        <div class="item_cell_box quest_itemin" >
            <div class="quest_ic bg-pri">问</div>
            <div class="item_cell_flex quest_desc quest_q">{{item.title}}</div>
        </div>
        <div class="item_cell_box quest_itemin" v-if="item.reply">
            <div class="quest_ic">答</div>
            <div class="item_cell_flex quest_desc">{{item.reply}}</div>
        </div>
        <div class="item_cell_box quest_itemin quest_time">
            <div class="item_cell_flex">{{item.leftstr}}</div>
            <div class="">{{item.rightstr}}</div>
        </div>
    </div>
</template>
<script type="text/javascript">
	export default {
        props: ['item'],
        data : function(){
            return {
            }
        },
	    created(){
            var self = this;           

	    }
	}
</script>
<style type="text/css" scoped>
.quest_item{
    background: #fff;
    padding: 20px 15px;
    border-radius: 5px;
}
.quest_itemin{
    align-items: start;
    font-size: 13px;
    padding: 5px 0 ;
}
.quest_ic{
    background: #23bf22;
    border-radius: 1.5px;
    width:20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #fff;
    margin-right: 10px;
}
.quest_desc{
    line-height: 20px;
}
.quest_q{
    font-size: 16.5px;
    font-weight: bold;
}
.quest_time{
    color: #999;
    font-size: 11px;
    margin-top: 10px;
}
</style>