<template>

    <div  >
        <!-- 图片 -->
        <div v-if="itemout.name == 'image'" class="page_image" :style="{'background-image': 'url('+itemout.params.bgimg+')','background-color':itemout.params.bgcolor,padding: itemout.params.padding+'px '+itemout.params.paddingv+'px'}">
            <div v-if="itemout.params.type <= 3 || itemout.params.type == 6" class="item_cell_box">
                <div v-for="(nav,idx) in itemout.params.data" :key="idx" @click="bindtap($event,nav.type)" :data-url="nav.appurl" :data-weburl="nav.weburl" :data-tel="nav.tel"  class="item_cell_flex">

                    <div class="click_button btn-formid" >
                        <div class="page_image_item" >
                            <div class="app_images_itemin" >
                                <img v-lazy="nav.img"  class="page_image_img" :style="{'border-radius':itemout.params.radius+'px',width:itemout.params.pdimg+'%',height:itemout.params.imgheight ? itemout.params.imgheight+'vw' :'auto'}" />
                            </div>
                            <div class="page_image_title" v-if="nav.title && itemout.params.istext == 1" :style="{color: itemout.params.fontcolor,'font-size': itemout.params.fontsize+'px','padding-top': itemout.params.fonttop+'px'}">{{nav.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="itemout.params.type == 4" class="item_cell_box app_images_type4" >
                <div  v-for="(nav,idx) in itemout.params.data" :key="idx" v-if="idx == 0" @click="bindtap($event,nav.type)" :data-url="nav.appurl" :data-weburl="nav.weburl" :data-tel="nav.tel" style="width:50%" >
                    <div class="click_button btn-formid" >
                        <div class="page_image_item" :style="{'padding-right': itemout.params.pimg+'px'}">
                            <div class="app_images_itemin">
                                <img v-lazy="nav.img" lazy-load="true" class="img_jumi page_image_img" :style="{width:'100%',height:itemout.params.imgheight ? itemout.params.imgheight+(itemout.params.pimg/7.5)+'vw' :'auto','border-radius':itemout.params.radius+'px'}" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style="width:50%">
                    <div  v-for="(nav,idx) in itemout.params.data" :key="idx" v-if="idx > 0" @click="bindtap($event,nav.type)" :data-url="nav.appurl" :data-weburl="nav.weburl" :data-tel="nav.tel" style="width:100%" >
                        <div class="click_button btn-formid"  >
                            <div class="page_image_item" :class="idx == 2 ? 'fix_jimu_img':''" :style="{height:itemout.params.imgheight ? (itemout.params.imgheight/2) +'vw' :'auto','padding-bottom': idx == 1 ? itemout.params.pimg+'px' : 0+'px'}">
                                <div class="app_images_itemin">
                                    <img v-lazy="nav.img" lazy-load="true" class="img_jumi page_image_img"  :style="{width:'100%',height:itemout.params.imgheight ? (itemout.params.imgheight/2) +'vw' :'auto','border-radius':itemout.params.radius+'px'}" />
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>         

            <div v-if="itemout.params.type == 5" class="item_cell_box app_images_type4" >
                <div style="width:50%">
                    <div  v-for="(nav,idx) in itemout.params.data" :key="idx" v-if="idx < 2" @click="bindtap($event,nav.type)" :data-url="nav.appurl" :data-weburl="nav.weburl" :data-tel="nav.tel" style="width:100%" >

                        <div class="click_button btn-formid"  >
                            <div class="page_image_item"  :class="idx == 0 ? 'fix_jimu_img':''" :style="{width:'100%',height:itemout.params.imgheight ? (itemout.params.imgheight/2) +'vw' :'auto','padding-bottom': idx == 0 ? itemout.params.pimg+'px' : 0 +'px'}">
                                <div class="app_images_itemin">
                                    <img v-lazy="nav.img" lazy-load="true" class="img_jumi page_image_img" :style="{width:'100%',height:itemout.params.imgheight ? (itemout.params.imgheight/2) +'vw' :'auto','border-radius':itemout.params.radius+'px'}" />
                                </div>
                            </div>
                        </div>  

                    </div>
                </div>

                <div  v-for="(nav,idx) in itemout.params.data" :key="idx" v-if="idx == 2" @click="bindtap($event,nav.type)" :data-url="nav.appurl" :data-weburl="nav.weburl" :data-tel="nav.tel" style="width:50%" >
                    <div class="click_button btn-formid"  >
                        <div class="page_image_item" :style="{height:itemout.params.imgheight ? itemout.params.imgheight+(itemout.params.pimg/7.5)+'vw' :'auto','padding-left':itemout.params.pimg+'px'}">
                            <div class="app_images_itemin">
                                <img v-lazy="nav.img" lazy-load="true" class="img_jumi page_image_img" :style="{width:'100%',height:itemout.params.imgheight ? itemout.params.imgheight+(itemout.params.pimg/7.5)+'vw' :'auto','border-radius':itemout.params.radius+'px'}" />
                            </div>
                        </div>
                    </div> 
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
.page_image_title{
  text-align: center;
}
.app_images_itemin img{
  display: block;
}
</style>