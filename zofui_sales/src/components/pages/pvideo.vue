<template>

    <div class="i-video" v-if="itemout.name == 'video'" :style="{padding: itemout.params.paddingv+'px 10px','background-color':itemout.params.bgcolor}">
        <video :src="itemout.params.url" style="width:100%;" :style="{height : 100*itemout.params.height/100+'vw'}" object-fit="fill" :poster="itemout.params.poster" controls ></video>
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

</style>