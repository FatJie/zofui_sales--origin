<template>

    <div v-if="itemout.name == 'title'" class="temp_item temp_item_title" :style="{padding:itemout.params.paddingv+'px 0.4rem','background-color':itemout.params.bgcolor}">
        <div class="btn-formid" @click="bindtap($event,itemout.params.type)" :data-url="itemout.params.appurl" :data-weburl="itemout.params.weburl" :data-tel="itemout.params.tel" >
            <div class="item_cell_box" :style="{'align-items':'center','border-left':itemout.params.leftbord == 0 ? '6px solid '+itemout.params.bordbg : 0 }">
                <div class="item_cell_flex temp_title_mfont" :style="{'text-align':itemout.params.pos,'font-size':itemout.params.size+'px',color:itemout.params.color,'font-weight':itemout.params.isbold == 1 ? 'bold' : '','padding-left':itemout.params.leftbord == 0 ? '10px' : '0'}">
                    <div class="title_in">
                        <font class="title_intext">{{itemout.params.content}} </font>
                        <font class="title_inbg obg-pri" v-if="itemout.params.isbgline == 1"></font> 
                    </div>
                </div>
                <div class="temp_title_rfont" v-if="itemout.params.rightfont" :style="{color:itemout.params.rfontcolor}">
                    {{itemout.params.rightfont}}
                </div>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
	export default {
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
.title_in{
    display: inline-block;
    position: relative;
    z-index: 1;
}
.title_intext{
    position: relative;
    z-index: 1;
}
.title_inbg{
    position: absolute;
    width: 105%;
    height: 7px;
    border-radius: 17.5px;
    background-color: #fff;
    bottom: 3.5px;
    z-index: 0;
    left:-2px;
}
.temp_title_mfont{
  font-weight: 400;
  padding-left: 10px;
}
.temp_title_rfont{
  font-size: 13px;
}
</style>