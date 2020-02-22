<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="in-section" v-for="inn in goodlist" >
            <div class="shopname" v-if="inn.shop">{{inn.shop}}</div>
            <div class="order-section" v-for="item in inn.list" >
                <div class="order-goods ">
                    <div class="lt">
                        <div class="lt_pic image-box __100">
                            <img v-lazy="item.thumb" />
                        </div>
                    </div>
                    <div class="rt">
                        <div class="rt_tit">{{item.title}}</div>
                        <div class="rt_titd" v-if="mapname">{{mapname}}</div>
                        <div class="rt_price fmt-price" >
                            <div class="now color-pri" v-if="item.showPrice > 0">
                                <font class="dollar" >¥</font>
                                <font class="price">{{item.showPrice}}</font>
                                <font class="btm_fx lbg-pri" v-if="item.show_userpricejb > 0">{{params.umname}} {{item.show_userpricejb*100/100}}</font>
                            </div>
                            <div class="now color-pr" v-else>
                                <font class="price">免费</font>
                            </div>
                            <div class="old" v-if="item.oldprice > 0">¥ {{item.oldprice}}</div>
                        </div>
                    </div>
                </div>
                <div class="order-price thin-border_b" >
                    <div>
                        <div class="area" v-if="item.type != 4 && item.type != 3 && item.type != 6 && item.type != 7 && params.fontsty != 33">
                            <div class="count">
                                <div>数量</div>
                                <div>
                                    <div class="order-counter ">
                                        <font @click="miusVal" :data-id="item.id" data-type="1" class="thin-border_r" :class="item.num <= 1 ? 'disabled' : ''" >-</font>
                                        <input @input="bindVal" :data-id="item.id" type="tel" v-model="item.num"  />
                                        <font @click="miusVal" :data-id="item.id" data-type="2" class="thin-border_l" :class="item.num >= inn.stock ? 'disabled' : ''">+</font>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="area" v-if="item.isdate == 1" @click="setdate" :data-id="item.id" data-inid="">
                            <div class="count">
                                <div>日期</div>
                                <div class="">
                                    <font class="card_disnum color-desc" >{{item.yydate ? item.yydate+' '+item.yytime : '点击选择日期'}}</font>
                                    <font class="iconfont icon-icon_arrow_right" ></font>
                                </div>
                            </div>
                        </div>
                        <div class="area" v-if="item.shopnum == 1" @click="setshop" :data-id="item.id" data-inid="">
                            <div class="count">
                                <div>门店</div>
                                <div class="">
                                    <font class="card_disnum color-desc" >{{item.toshopname ? item.toshopname : '点击选择门店'}}</font>
                                    <font class="iconfont icon-icon_arrow_right" ></font>
                                </div>
                            </div>
                        </div>
                        <div class="area" v-if="item.myredbagdis > 0">
                            <div class="count">
                                <div>红包</div>
                                <div>
                                    <font class="card_disnum color-pri" >减免 ¥{{item.myredbagdis}}</font>
                                </div>
                            </div>
                        </div>
                        <div class="area" v-if="item.costexpfee > 0">
                            <div class="count">
                                <div>配送费</div>
                                <div>
                                    <font class="card_disnum color-pri" >¥{{item.costexpfee}}</font>
                                </div>
                            </div>
                        </div>
                        <div class="area" v-if="item.costpakfee > 0">
                            <div class="count">
                                <div>包装费</div>
                                <div>
                                    <font class="card_disnum color-pri" >¥{{item.costpakfee}}</font>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="scard_box" v-if="inn.allcard.length > 0" @click="showCard" :data-sid="inn.shopid">
                <div class="card_l">优惠券</div>
                <div class="card_dis">
                    <font class="card_disnum color-pri" v-if="inn.carddis > 0">减免 ¥{{inn.carddis}}</font> 
                    <font class="card_disnum " v-if="inn.carddis <= 0 || !inn.carddis">选择使用优惠券</font> 
                    <font class="iconfont icon-icon_arrow_right"></font>        
                </div>
            </div>
            <div class="scard_box" v-if="params.isyhm == 2" @click="setyhm" :data-sid="inn.shopid">
                <div class="card_l">优惠码</div>
                <div class="card_dis">
                    <font class="card_disnum color-pri" v-if="inn.yhmdis > 0">减免 ¥{{inn.yhmdis}}</font> 
                    <font class="card_disnum " v-if="inn.yhmdis <= 0 || !inn.yhmdis">选择使用优惠码</font> 
                    <font class="iconfont icon-icon_arrow_right"></font>        
                </div>
            </div>
            </div>


            <div class="order-form" v-if="params.jfpay > 0 && userinfo.jifen > 0 && buytype != 'cart'">
                <div class="order-section ems_way" >
                    <div class="form-cell">
                        <div class="cell__hd">{{params.jfbname}}</div>
                        <div class="cell__bd">
                            <van-radio-group class="my-radio" v-model="isusejifen" @change="countData">
                                <van-radio :name="0">不使用</van-radio>
                                <van-radio :name="1">抵扣{{isusejifen==1 ? '¥'+jifendis:''}}</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-form" >
                <div class="order-section ems_way" >
                    <div class="form-cell">
                        <div class="cell__hd">支付</div>
                        <div class="cell__bd">
                            <van-radio-group class="my-radio" v-model="paytype" @change="countData">
                                <van-radio v-if="params.iswxpay == 0" :name="0">微信支付</van-radio>
                                <van-radio v-if="params.isum == 1" :name="1">{{params.umname}}支付（¥{{userinfo.umoney*100/100}}）</van-radio>
                                <van-radio v-if="params.isshoppay == 1" :name="2">{{params.fontsty == 33?'驾校现场':'到店'}}支付</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                    <div class="tips" v-if="goodlist[0] && goodlist[0].show_userpricejb > 0">提示：{{params.cardname}}使用{{params.umname}}支付仅需{{goodlist[0].show_userpricejb*100/100}}</div>
                </div>
            </div>

            <div class="order-form">
                <div class="order-section ems_way" v-if="(params.isshoptake == 1 || params.isexpress == 1) && (params.fontsty == 0 || params.fontsty == 34)">
                    <div class="form-cell">
                        <div class="cell__hd">{{params.fontsty == 33?'地址':(params.fontsty == 34 ? '验票' : '配送')}}</div>
                        <div class="cell__bd">
                            <van-radio-group class="my-radio" v-model="taketype" @change="countData">
                                <van-radio v-if="params.isshoptake == 1" :name="1">{{params.fontsty == 33?'驾校使用':(params.fontsty == 34 ? '现场验票' : '到店使用')}}</van-radio>
                                <van-radio v-if="params.isexpress == 1" :name="2">{{params.fontsty == 33?'填写地址':'配送到家'}}</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                </div>

                <div class="order-section pd0h confirm">
                    <van-cell-group>
                        <van-field border type="text" :value="ctaddress" label="地区"  placeholder="选择地区" readonly @click="showaddressfn" v-if="params.ctaddress == 1" />

                        <van-field border type="text" @input="messfn" :value="mess" label="备注"  placeholder="可输入备注内容" v-if="!form"  />

                        <van-field border :value="name" @input="namefn" :placeholder="'请输入姓名'+ (params.coname == 1 ? '（选填）' : '')" label="姓名" v-if="taketype == 1" />

                        <van-field border type="tel" @input="telfn" :placeholder="'请输入你的手机号码'+ (params.cotel == 1 ? '（选填）' : '')" :value="tel" label="手机" v-if="taketype == 1" />
                        <van-field border type="tel" @input="pcardfn" :placeholder="请输入你的身份证号码" :value="pcard" label="证号" v-if="goodlist[0].list[0].isneedcard == 1" />

                        <template v-for="(item,index) in form" >
                            <van-field border v-model="item.value"  :placeholder="item.pla" :label="item.name" v-if="item.type == 'text'" type="text"/>
                            <van-field border v-model="item.value" :placeholder="item.pla" :label="item.name" v-if="item.type == 'tel'" type="tel"/>
                            <van-field border v-model="item.value" :placeholder="item.pla" :label="item.name" v-if="item.type == 'num'" type="number"/>

                            <van-field border type="text" :value="item.value" :label="item.name"  :placeholder="item.pla" readonly @click="formfndate(index)" :data-index="index" v-if="item.type == 'date'" />
                            <van-field border type="text" :value="item.value" :label="item.name"  :placeholder="item.pla" readonly @click="formfntime(index)" :data-index="index" v-if="item.type == 'time'" />

                            <van-field border type="text" :value="item.value ? item.value[0]+item.value[1]+item.value[2] : ''" :label="item.name"  :placeholder="item.pla" readonly @click="formfnarea(index)" v-if="item.type == 'region'" />

                            <van-field border type="text" :value="item.value" :label="item.name"  :placeholder="item.pla" readonly @click="formfnsigle(index,1)" v-if="item.type == 'single'" />

                            <van-field border type="text" :value="item.valuea" :label="item.name"  :placeholder="item.pla" readonly @click="formfnsigle(index,2)" v-if="item.type == 'multi'" />

                        </template>

                        <van-popup v-model="showdatepd" position="bottom">
                            <van-datetime-picker v-model="currentDate" type="date" @confirm="currentDatefn" @cancel="showdatepd = false" />
                        </van-popup>
                        <van-popup v-model="showdatept" position="bottom">
                            <van-datetime-picker v-model="currenttime" type="time" @confirm="currenttimefn" @cancel="showdatept = false"/>
                        </van-popup>
                        <van-popup  position="bottom" v-model="showareapt" :overlay="true">
                            <van-area :area-list="areaList" @confirm="formareac" @cancel="showareapt = false" />
                        </van-popup>

                        <van-popup  position="bottom" v-model="showsingle" :overlay="true">
                            <van-picker :columns="singlecolumns" @confirm="singleconfirm" confirm-button-text="确定" cancel-button-text="取消" :show-toolbar="true" @cancel="showsingle = false" />
                        </van-popup>

                        <van-popup  position="bottom" v-model="showmulti" :overlay="true">
                            <div class="item_cell_box multi-top">
                                <div class="multi-ok" @click="showmulti = false">取消</div>
                                <div class="item_cell_flex"></div>
                                <div class="multi-ok" @click="comfirmmulti">确定</div>
                            </div>
                            <div class="multi-box">
                            <van-checkbox-group v-model="multiresult" bind:change="onChangemulti">
                                <div style="margin-top:10px;font-size: 14px;" v-for="(item,index) in singlecolumns" :key="index">
                                <van-checkbox :name="item" >
                                    {{ item }}
                                </van-checkbox>
                                </div>
                            </van-checkbox-group>
                            </div>
                        </van-popup>

                    </van-cell-group>

                    <div @click="link" data-url="/orderaddress?from=confirm" class="wx-address" v-if="taketype == 2">
                        <div class="txt" v-if="address">
                            <div class="name">{{aname}}</div>
                            <div class="item_cell_flex">
                                <div class="tel">{{atel}}</div>
                                <div class="addr">{{address}}</div>
                            </div>
                            <div class="van-icon van-icon-arrow"></div>
                        </div>
                        <div v-else>
                            <font class="icon lbg-pri">+</font>添加收货信息
                        </div>
                    </div>
                </div>
            </div>
            <div class="fix-box" style="">
                <div class="order-menu">
                    <div class="order_price thin-border_t" >合计：
                        <font class="num color-pri">¥ {{total}}</font>
                    </div>
                    <div class="order_btn only_btn">
                        <div class="btn bg-sec" @click="toback">
                            <div class="btn-formid" >
                                <div class="btn bg-sec">返回</div>
                            </div>
                        </div>
                        <div @click="confirm" class="btn btn-formid lbg-pri" style="width:250rpx;" formType="submit">{{goodlist[0] && goodlist[0].type == 4 ? '立即报名' : (params.fontsty == 33?'提交报名':'提交订单')}}</div>
                        
                    </div>
                </div>
                <div class="is-ipx" v-if="isIPX"></div>
            </div>

            <input hidden name="fid" type="text" value="id"></input>
            <input hidden name="group_id" type="text" value="groupid"></input>
            <input hidden name="price" type="text" value="showPrice=='undefined'?'':showPrice"></input>

            <div class="module-popup" v-if="showsetymh">
                <div class="popup-mask popup--visible"></div>
                <div class="popup-dialog popup--visible">
                    <div class="popup-dialog__hd" >
                        <div class="popup-dialog__title">优惠码</div>
                    </div>
                    <div class="popup-dialog__bd">
                        <div class="popup-dialog__content" ></div>
                        <input class="popup-input popup-prompt-input" v-model="actyhm" :placeholder="item.placeholder"  v-for="item in prompt" />
                    </div>
                    <div class="popup-dialog__ft thin-border_t" v-if="buttons.length">
                        <div class="popup-dialog__btn popup-dialog__btn_default thin-border_l" :class="{'color-pri':item.type=='primary'}" @click="codeclick(item.fn)"  v-for="item in buttons" >{{item.text}}</div>
                    </div>
                </div>
            </div>

            <van-popup v-model="showdate" position="bottom" :overlay="true">
                <div class="multi-box" >
                    <div class="iconfont icon-close2 closedate" @click="showdatefn"></div>
                    <div class="datebox_body">
                        <!-- <div class="datebox_bodyin" >
                            <div class="datebox_item" :class="{'lbg-pri':actdate == item}" v-for="(item,index) in datearr.date" :key="index" @click="getdate" :data-t="item">
                                {{item}}
                            </div>
                        </div> -->
                        <date :dateday="datearr.date" :showdate="showdate" @getdatefn="getdate"></date>
                        <div calss="datebox_time">
                            <div class="datebox_timeitem" :class="{'color-pri border-pri':acttime == item}" v-for="(item,index) in datearr.time" @click="gettime" :data-t="item">{{item}}</div>
                        </div>
                    </div>
                    
                </div>
                <div @click="comdatefn" class="g-fixbtn lbg-pri">确定</div>
            </van-popup>

            <van-popup v-model="isshowshop" position="bottom" :overlay="true">
                <div class="multi-box" >
                    <div class="iconfont icon-close2 closedate" @click="showdatefn"></div>

                    <div class="shopbox_body">
                        <div class="item_cell_box shoplist_item" v-for="(item,index) in shoparr" :key="index" @click="comshopfn" :data-id="item.id" :data-name="item.name">
                            <div class="item_cell_flex shoplist_info">
                                <div class="shoplist_add color-pri" v-if="item.isnearly == 1">最近选择</div>
                                <div class="shoplist_name">{{item.name}}</div>
                                <div class="shoplist_add">{{item.address}}</div>
                            </div>
                            <div class="shoplist_dis" :style="{'padding-top':item.isnearly == 1 ? '15px' : '0'}">{{item.disfor}}</div>
                        </div>
                    </div>
                    
                </div>
            </van-popup>

            <van-popup v-model="hideCard" position="bottom">
                <div class="info-calendar info-card">
                    <div class="scrollY" style="height: 100%;padding:20rpx;text-align: center;">
                        <div class="coupon" v-for="item in allcard" :data-id="item.id" :key="item.id">
                            <div class="coupon_text">
                                <div class="coupon_title"><font>¥</font> {{item.fee}}</div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >{{item.name}}</font>
                                </div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >订单满{{item.use}}元使用</font>
                                </div>
                            </div>
                            <div class="btn_view" :class="inproall >= item.use ?'get_btn':'cant_get'"  @click="usecard($event,item.use)" :data-id="item.id">
                                {{inproall >= item.use?'使用':'不可使用'}}
                            </div>
                        </div>
                    </div>
                    <div class="fix-box" style="">
                        <div bindtap="hideCard" class="g-fixbtn lbg-pri">取消</div>
                    </div>
                </div>
            </van-popup>

           <div class="popup-container __top popup-container--visible" style="display: block" v-if="hideCard">
                <div bindtap="hideCard" class="popup-shade"></div>
                <div class="popup-modal popup-modal--half" style="padding-bottom: 120rpx;">

                </div>
            </div>

            <van-popup v-model="showaddress" position="bottom" :overlay="true">
                <van-area :area-list="areaList" @confirm="confirmarea" @cancel="cancelarea"  />
            </van-popup>
          	
        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,Swipe,SwipeItem,List,Toast,Dialog,Field,Area,Popup,cellGroup,RadioGroup,Radio,DatetimePicker,Picker,Checkbox,CheckboxGroup } from 'vant';
	import area from '../../assets/js/area.js';
    import date from '../../components/date';
	export default {
        name : 'ordercomfirm',
	  	components: {
	    	[Swipe.name] : Swipe,
	    	[SwipeItem.name] : SwipeItem,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
	    	[Field.name] : Field,
	    	[Area.name] : Area,
	    	[Popup.name] : Popup,
	    	[cellGroup.name] : cellGroup,
            [RadioGroup.name] : RadioGroup,
            [Radio.name] : Radio,
            [DatetimePicker.name] : DatetimePicker,
            [Picker.name] : Picker,
            [Checkbox.name] : Checkbox,
            [CheckboxGroup.name] : CheckboxGroup,
            date,
	  	},
	  	data : function(){
	  		return {
                inited : false,
                getAddress : false, // 选择地址返回不刷新
                isback : false, // 防止返回
	  			params : {},
	  			userinfo : {},
	  			goodlist : 0,
	  			sharedata :Object,
                swiperIndex : 0,
                showCardBenefit : false,
	  			allcard : [],
                cvisible : false,
	  			datalist : [],
	  			street : '',
                aname : '',
                atel : '',
	  			address : '',
	  			name : '',
	  			tel : '',
                num : 1,
                buytype : '',
                mapid : '',
                groupmem : 0,
                mapname : '',
                groupid : 0,
                cid : 0,
                taketype : 1,
                paytype : 0,
                myredbag : {},
                mess : '',
                total : 0,
                isusejifen : 0,
                jifendis : 0,
                myredbagdis : 0,
                jifendis : 0,
                cardid : 0,
                prototal : 0,
                isback : true,
	  			isIPX : false,
	  			showaddress : false,
	  			areaList : area,
                timer : null,
                ctaddress : '',
                inproall : 0,
                hideCard : false,
                actsid : 0,
                actyhmsid : 0,
                showsetymh : false,
                prompt : [{placeholder:'输入优惠码',response:'code'}],
                buttons : [{
                    type: "default",
                    text: "取消",
                    fn: "cancel"
                }, {
                    type: "primary",
                    text: "确定",
                    fn: "confirm"
                }],
                code : '',
                actyhm : '',
                form : false,
                showdatepd : false,
                currentDate : '',
                showdatept : false,
                currenttime : '',
                actformindex : 0,
                showareapt : false,
                showsingle : false,
                singlecolumns : [],
                showmulti : false,
                multiresult : [],
				dev : '',
                showdate : false,
                datearr : [],
                actdate : '',
                acttime : '',
                pcard : '',
                shoparr : [],
                selectshoptid : 0,
                isshowshop : false,
	  		}
	  	},
	  	activated:function(e){

            if( this.getAddress ) {
                var address = this.$util.getCache('address');
                if( address ){
                    this.aname = address.name;
                    this.atel = address.tel;
                    this.address = address.region+address.street;
                    this.$util.setCache('address','');
                }
                return false;
            }
	  		//this.$emit('loadmessage',false);

            this._setData();
            this.initData();
            
	  	},
        beforeRouteLeave(to,from,next){
            if( to.name == 'orderaddress' ){
                this.getAddress = true;
            }else{
                this.getAddress = false;
            }
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
	  	methods: {
	  		cancelarea(){
	  			this.showaddress = false;
	  		},
	  		confirmarea(e){
	  			this.ctaddress = e[0].name +','+e[1].name +','+e[2].name;
	  			this.showaddress = false;
	  		},
	  		showaddressfn(){
	  			this.showaddress = true;
	  		},
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            messfn(e){
                this.mess = e;
            },
		    namefn(e){
		        this.name = e;
		    },
		    telfn(e){
		        this.tel = e;
		    },
		    streetfn(e){
		        this.street = e;
		    },
            pcardfn(e){
                this.pcard = e;
            },
            toback(){
                this.$router.go(-1);
            },
            formfndate(e){
                this.showdatepd = true;
                this.actformindex = e;
            },
            formfntime(e){
                this.showdatept = true;
                this.actformindex = e;
            },
            formfnarea(e){
                this.showareapt = true;
                this.actformindex = e;
            },
            formfnsigle(e,type){
                var self = this;
                this.actformindex = e;
                for (var i = 0; i < self.form.length; i++) {
                    if(i == e){
                        self.singlecolumns = self.form[i].sdata
                    }
                }
                if( type == 1 ){
                    this.showsingle = true;
                }else{
                    this.showmulti = true;
                }
            },
            currentDatefn(e){
                let date = this.$util.formDate(e);
                this.setformvalue(date);
                this.showdatepd = false;
            },
            currenttimefn(e){
                this.setformvalue(e);
                this.showdatept = false;
            },
            formareac(e){
                this.setformvalue([e[0].name,e[1].name,e[2].name]);
                this.showareapt = false;
            },
            singleconfirm(e){
                this.setformvalue(e);
                this.showsingle = false;
            },
            comfirmmulti(){
                this.setformvalue(this.multiresult);
                this.showmulti = false;
            },
            setformvalue(value){
                var self = this;
                for (var i = 0; i < self.form.length; i++) {
                    if(i == self.actformindex){
                        self.$set(self.form[i],'value',value);
                        if( self.form[i].type == 'multi' ){
                            self.$set(self.form[i],'valuea',value.join(','));
                        }
                    }
                }
            },
            setyhm(e){
                var self = this;
                self.actyhmsid = e.currentTarget.dataset.sid;
                self.showsetymh = true;
            },
            codeclick(type){
                var self = this;
                if( type == 'confirm' ){
                    
                    if( self.actyhm ){
                        var postdata = {
                            code:self.actyhm,
                            op:'checkyhm',
                        };

                        for (var i = 0; i < self.goodlist.length; i++) {
                            var item = self.goodlist[i];   
                            if( item.shopid == self.actyhmsid ){
                                postdata.goodlist = JSON.stringify( self.goodlist[i] );
                            }
                        }

                        self.$util.http('confirm','GET',postdata,function(res){
                            if (!res.errno  && res.data) {
                                
                                for (var i = 0; i < self.goodlist.length; i++) {
                                    var item = self.goodlist[i];   
                                    if( item.shopid == self.actyhmsid ){
                                        self.$set(item,'yhmcode',self.actyhm);
                                        self.$set(item,'yhmdis',res.data.yhmdis);
                                        self.actyhm = '';
                                        self.showsetymh = false;
                                    }
                                }
                                
                                self.countData();
                                self.hideCardfn();

                            }else{
                                self.$toast(res.message);
                            }
                        },true);
                    }else{
                        for (var i = 0; i < self.goodlist.length; i++) {
                            var item = self.goodlist[i];   
                            if( item.shopid == self.actyhmsid ){

                                self.actyhm = '';
                                self.showsetymh = false;
                                self.$set(item,'yhmcode','');
                                self.$set(item,'yhmdis',0);
                            }
                        }
                        self.countData();
                        self.hideCardfn();
                    }

                }else{
                    this.showsetymh = false;
                }
            },
            setshop(e){
                var self = this;
                var id = e.currentTarget.dataset.id;

                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].id == id ){
                            self.shoparr = item[j].shoplist;
                            self.selectshoptid = id;
                            break;
                        }
                    }
                }
                this.showshopfn();
            },
            showshopfn(e){
                this.isshowshop = !this.isshowshop;
            },
            comshopfn(e){
                var self = this;
                var id = e.currentTarget.dataset.id;
                var name = e.currentTarget.dataset.name;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].id == self.selectshoptid ){
                            self.goodlist[i].list[j].toshopid = id;
                            self.goodlist[i].list[j].toshopname = name;
                            break;
                        }
                    }
                }
                this.showshopfn();
            },
            confirm(e){
                var self = this;
                var subform = [];

                if( !self.name && self.taketype == 1 && self.params.coname == 0 ) {
                    self.$toast('请填写姓名');return false;
                }
                if( !self.$util.verify('mobile', self.tel ) && self.taketype == 1 && self.params.cotel == 0 ) {
                    self.$toast('请填写正确的电话号码');return false;
                }

                if( self.form ){
                    for (var i = 0; i < self.form.length; i++) {   
                        if( !self.form[i].value ){
                            self.$toast('请完善'+self.form[i].name);
                            return false;
                        }
                        subform.push({
                            name : self.form[i].name,
                            value : self.form[i].value,
                        });
                    }
                }

                var goodlist = [];
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i];
                    var into = { cardid : item.cardid ,yhmcode:item.yhmcode, list : [] };
                    for (var j = 0; j < item.list.length; j++) {
                        into.list.push({
                            id : item.list[j].id,
                            gid : item.list[j].gid,
                            num : item.list[j].num,
                            redid : item.list[j].redbagid,
                            yydate : item.list[j].yydate ? item.list[j].yydate : '',
                            yytime : item.list[j].yytime ? item.list[j].yytime : '',
                            toshopid : item.list[j].toshopid ? item.list[j].toshopid : '',
                        });
                    }
                    goodlist.push(into);
                }

                var postdata = {
                    op:'pay',
                    taketype : self.taketype,
                    paytype : self.paytype,
                    name:self.name,
                    tel:self.tel,
                    mess : self.mess,
                    pcard : self.pcard,
                    num : self.num,
                    buytype : self.buytype,
                    groupid : self.groupid,
                    cid : self.cid,
                    aname : self.aname,
                    atel : self.atel,
                    address : self.address,
                    cardid : self.cardid,
                    isusejifen : self.isusejifen ? self.isusejifen : 0,
                    jifendis : self.jifendis > 0 ? self.jifendis : 0,
                    ctaddress : self.ctaddress ? self.ctaddress : '',
                    groupmem : self.groupmem ? self.groupmem : 0,
                    mapid : self.mapid ? self.mapid : '',
                    addcart : 1,// 新版的
                    goodlist : goodlist ? JSON.stringify( goodlist ) : [],
                    subform : subform ? JSON.stringify( subform ) : 0,
                };

                self.$util.http('confirm','GET',postdata,function(res){
                    if (!res.errno && res.data) {
                        self.$util.setCache('zfssbuy','');
                        if( res.data.payed == 1 ){
                            self.paysuc(res.data.orderid,self.buytype);
                        }else{
                            //self.isback = false; // 防止返回商品
                            if( self.dev == 'wx' ){
                                WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                    'appId' : res.data.appId, 
                                    'timeStamp': res.data.timeStamp,
                                    'nonceStr' : res.data.nonceStr,
                                    'package' : res.data.package,
                                    'signType' : res.data.signType,
                                    'paySign' : res.data.paySign
                                }, function(resa) {
                                    if(resa.err_msg == 'get_brand_wcpay_request:ok') {
                                        //checkpay( res.data.orderid );
                                        self.paysuc(res.data.orderid,self.buytype);
                                    } else {
                                        if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                            
                                            var tip = self.params.fontsty == 33 ? '请尽快提交' : '请尽快支付';
                                            self.$toast({
                                                type:'success',
                                                mask : true,
                                                forbidClick : true,
                                                message:tip,
                                                onClose : function(){

                                                    // 拼团
                                                    if( self.peytype == 1 || self.peytype == 2 ){
                                                        self.checkGroup(orderid);
                                                    }else{
                                                        var tourl = '/orderinfo?id='+res.data.orderid;
                                                        if( self.buytype == 'cart' ) {
                                                            tourl = '/orderlist';
                                                        }   
                                                        self.isback = true;
                                                        self.$router.push(tourl);
                                                    }
                                                }
                                            });
                                        }else{
                                            self.$toast('启动微信支付失败, 请检查你的支付参数. 详细错误为: ' + resa.err_msg);
                                        }
                                    }
                                });
                            }else if(self.dev == 'app'){
                                var wxPay = api.require('wxPay');
                                wxPay.payOrder({
                                    apiKey: res.data.appid,
                                    orderId: res.data.prepayid,
                                    mchId: res.data.partnerid,
                                    nonceStr: res.data.noncestr,
                                    timeStamp: res.data.timestamp,
                                    package: res.data.package,
                                    sign: res.data.sign,
                                }, function(ret, err) {
                                    if (ret.status) {
                                        self.paysuc(res.data.orderid,self.buytype);
                                    } else {
										var tip = self.params.fontsty == 33 ? '请尽快提交' : '请尽快支付';
										self.$toast({
											type:'success',
											mask : true,
											forbidClick : true,
											message:tip,
											onClose : function(){

												// 拼团
												if( self.peytype == 1 || self.peytype == 2 ){
													self.checkGroup(orderid);
												}else{
													var tourl = '/orderinfo?id='+res.data.orderid;
													if( self.buytype == 'cart' ) {
														tourl = '/orderlist';
													}   
													self.isback = true;
													self.$router.push(tourl);
												}
											}
										});
                                    }
                                });
                            }else if(self.dev == 'wap'){
                                location.href = res.data.mweb_url;
                            }else{       
                                self.$toast('启动微信支付失败, 请检查你的支付参数.');
                            }
                        }
                    }else{
                        var tip = res.data.message ? res.data.message : '';
                        self.$toast(res.message+tip);
                    }
                },true);
            },
            paysuc(orderid,peytype){
                var self = this;
                var tip = self.params.fontsty == 33 ? '已经提交' : '支付完成';
                self.$toast({
                    type:'success',
                    mask : true,
                    forbidClick : true,
                    message:tip,
                    onClose : function(){
                        if( peytype == 1 || peytype == 2 ){ // 拼团
                            self.checkGroup(orderid);
                        }else{
                            var tourl = '/orderinfo?id='+orderid;
                            if( self.buytype == 'cart' ) {
                                tourl = '/orderlist';
                            }
                            self.isback = true;
                            self.$router.push(tourl);
                        }
                    }
                })
            },
            checkGroup(orderid){
                var self = this;
                self.timer = setTimeout(function(){
                    self.$util.http('confirm','GET',{orderid:orderid,op:'checkgroup'},function(res){
                        if (!res.errno  && res.data) {
                            var tourl = '/groupinfo?id='+res.data.groupid;
                            self.isback = true;
                            self.$router.push(tourl);
                        }else{
                            self.checkGroup(orderid);
                        }
                    },true);
                },500);
            },
            countData(){
                var self = this;
                
                var total = 0;
                var redbagdis = 0;

                for (var i = 0; i < self.goodlist.length; i++) {
                    var carddis = 0;
                    var inproall = 0;
                    var intotal = 0;
                    var item = self.goodlist[i].list;

                    for (var j = 0; j < item.length; j++) {
                        var myredbagdis = 0;
                        var redbagid = 0;

                        var priprice = self.paytype == 0 || item[j].showPricejb <= 0 ? item[j].showPrice : item[j].showPricejb;
                        var prototal = priprice * item[j].num *100/100;
                        
                        // 包装费
                        var costpakfee = 0;
                        if( item[j].pakfee > 0 ){
                            prototal += item[j].pakfee*1;
                            costpakfee = item[j].pakfee*1;
                        }

                        // 快递费
                        var costexpfee = 0;
                        if( self.taketype == 2 && item[j].expfee > 0 ){
                            prototal += item[j].expfee*1;
                            costexpfee = item[j].expfee*1;
                        }


                        intotal += prototal;
                        inproall += prototal;

                        if( item[j].myredbag && prototal > item[j].myredbag.use*1 && prototal > item[j].myredbag.fee*1 ){
                            myredbagdis = item[j].myredbag.fee*1;
                            intotal -= myredbagdis;
                            redbagid = item[j].myredbag.id;
                        }

                        self.goodlist[i].list[j].myredbagdis = myredbagdis;
                        self.goodlist[i].list[j].redbagid = redbagid;
                        self.goodlist[i].list[j].costpakfee = costpakfee;
                        self.goodlist[i].list[j].costexpfee = costexpfee;
                    }

                    if( self.goodlist[i].cardid > 0 ){
                        var allcard = self.goodlist[i].allcard;
                        for (var j = 0; j < allcard.length; j++) {
                            if( allcard[j].id == self.goodlist[i].cardid && intotal >= allcard[j].use*1 ){
                                carddis = allcard[j].fee*100/100;
                                intotal -= carddis;
                            }
                        }
                    }

                    if( self.goodlist[i].yhmdis > 0 ){
                        intotal -= self.goodlist[i].yhmdis;
                    }

                    self.goodlist[i].inproall = inproall;
                    self.goodlist[i].intotal = intotal;
                    self.goodlist[i].carddis = carddis;
                    self.goodlist[i].cardid = carddis > 0 && self.goodlist[i].cardid ? self.goodlist[i].cardid : 0;

                    total += intotal;
                }
                var jifendis = 0;
                if( self.isusejifen == 1 && self.userinfo.jifen > 0 && self.params.jfpay > 0 ){
                    var candis = (self.userinfo.jifen/self.params.jfpay) .toFixed(2) * 1;
                    var usejifen = candis*1 >= total*1 ? total*1 : candis*1;
                    jifendis = usejifen >= 0.01 ? usejifen.toFixed(2)*1 : 0;
                }
                if( jifendis > 0 ){
                    total = total - jifendis*1;
                }

                self.prototal = prototal;
                self.total = total.toFixed(2) *1;
                self.myredbagdis = myredbagdis;
                self.jifendis = jifendis;
                self.cardid = carddis <= 0 ? 0 : self.cardid;
                
            },
            usecard(e,usefee){
                var self = this;
                if( usefee > self.inproall ) return false;
                
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i];   
                    if( item.shopid == self.actsid ){
                        self.$set(self.goodlist[i],'cardid',e.currentTarget.dataset.id);
                    }
                }
                
                self.countData();
                self.hideCardfn();
            },
            hideCardfn(){
                this.hideCard = false;
            },
            showCard(e){
                var self = this;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i];   
                    if( item.shopid == e.currentTarget.dataset.sid ){
                        self.allcard = item.allcard;
                        self.inproall = item.inproall;
                        self.actsid = item.shopid;
                        self.hideCard = true;
                    }
                }
            },
            miusVal(e,inputnum){
                var self = this;
                var id = e.currentTarget.dataset.id;
                var type = e.currentTarget.dataset.type;
                var num = inputnum;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].id == id ){
                            
                            if( type == 1 ){
                                num = item[j].num*1 - 1;
                                if( item[j].num <= 1 ){
                                    num = 1;
                                }
                            }else if(type == 2){
                                num = item[j].num*1 + 1;
                                if( item[j].num*1 >= item[j].stock*1 ){
                                    num = item[j].stock;
                                }
                            }else if(type == 3){
                                if( num*1 > item[j].stock*1 ) num = item[j].stock;
                            }
                            self.goodlist[i].list[j].num = num;
                            break;
                        }
                    }
                }
                self.countData();
            },
            bindVal(e){
                var self = this;
                self.countData();
            },
            formfn(){

            },
            setdate(e){
                var self = this;
                var id = e.currentTarget.dataset.id;

                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].id == id ){
                            
                            self.datearr = {actid:id,date:item[j].dateday,time:item[j].datetimes};
                            break;
                        }
                    }
                }
                this.showdatefn();
            },
            getdate(e){
                this.actdate = e
            },
            gettime(e){
                this.acttime = e.currentTarget.dataset.t;
            },
            showdatefn(){
                this.showdate = !this.showdate;
                this.actdate = '';
                this.acttime = '';
                
            },
            comdatefn(){
                var self = this;
                if( !this.actdate ) {
                    self.$toast('请选择日期');
                    return false;
                }
                if( this.datearr.time.length > 0 && !this.acttime ) {
                    self.$toast('请选择时间');
                    return false;
                }
                
                var id = self.datearr.actid;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].id == id ){
                            self.goodlist[i].list[j].yydate = this.actdate;
                            self.goodlist[i].list[j].yytime = this.acttime ? this.acttime : '';
                            break;
                        }
                    }
                }
                this.showdatefn();
            },
            initData(){
                var self = this;
				self.dev = self.$util.dev();
                var cache = self.$util.getCache('zfssbuy');
                if( (!cache || cache == '' || cache.length <= 0) && this.isback ){
                    this.$emit('loadmessage',true);
                    self.$router.go(-1);
                    return false;
                }

                var loc = self.$util.getCache('loc');
                var postdata = {
                    op : 'info',
                    gid : cache.gid ? cache.gid : 0,
                    cid : cache.cid ? cache.cid : 0,
                    groupid : cache.groupid ? cache.groupid : 0,
                    cartlist : cache.arr ? JSON.stringify( cache.arr ) : [],
                    type : cache.type,
                    mapid : cache.mapid,
                    groupmem : cache.groupmem,
                    addcart : 1,
                    lat : loc.lat ? loc.lat : 0,
                    lng : loc.lng ? loc.lng : 0,
                };

                self.$util.http('confirm','GET',postdata,function(res){
					self.inited = 1;
                    if( res.data && !res.errno ){       
                        
                        self.goodlist = res.data.goodlist ? res.data.goodlist : [];
                        self.userinfo = res.data.userinfo;
                        self.name = res.data.userinfo.name ? res.data.userinfo.name : res.data.userinfo.nickname;
                        self.tel = res.data.userinfo.tel ? res.data.userinfo.tel : '';
                        self.num = 1;
                        self.buytype = cache.type;
                        self.mapid = cache.mapid;
                        self.groupmem = cache.groupmem;
                        self.mapname = cache.mapname;
                        self.groupid = cache.groupid ? cache.groupid : 0;
                        self.cid = cache.cid ? cache.cid : 0;
                        self.allcard = res.data.allcard;
                        self.taketype = res.data.params.isshoptake == 1 ? 1 : 2;
                        self.paytype = res.data.params.iswxpay == 0 ? 0 : ( res.data.params.isum == 1 ? 1 : ( res.data.params.isshoppay == 1 ? 2 : 0 ) );
                        self.myredbag = res.data.myredbag ? res.data.myredbag : false;
                        self.params = res.data.params;
                        self.form = res.data.form ? res.data.form : false;

                        self.countData();
                        self.inited = 2;

                    }else if( res.errno == 2 ){
                        Dialog.alert({
                            message: '你还有未支付的订单，请先支付'
                        }).then(() => {
                            self.$util.setCache('zfssbuy','');
                            self.$router.push('/orderinfo?id='+res.data.orderid);
                        });
                    }else if( res.errno == 3 ){
                        Dialog.confirm({
                            title: '提示',
                            message: res.message
                        }).then(() => {
                            self.$util.setCache('zfssbuy','');
                            self.$router.push('/buycard');
                        }).catch(() => {
                            self.$router.go(-1);
                        });

                    }else{
                        Dialog.alert({
                            message: res.message
                        }).then(() => {
                            if( !self.$router.go(-1) ){
                                self.$router.push('/');
                            }
                        });
                    }
                });
            },
            _setData(){

            }
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/iconfont.css";
.info-calendar {
    position: relative;
    height: 100%;
}
.order-section.confirm{
    border: 0;
}
.calendar-head-wrap {
    height: 30px;
}
.calendar-head {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    height: 30px;
    border-bottom: 0.5px solid #e5e5e5;
    text-align: center;
    line-height: 30px;
    background-color: #fff;
}

.calendar-head .date {
    -webkit-box-flex: 1;
    flex: 1;
}

.calendar-body {
    position: absolute;
    top: 30px;
    bottom: 48px;
    width: 100%;
}

.calendar-mouth .head {
    width: 375px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: #f4f4f4;
}

.calendar-mouth .daybox {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    padding-top: 5px;
    padding-bottom: 5px;
}

.calendar-mouth .item {
    overflow: hidden;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    width: 14.285714%;
    height: 53px;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    color: #353535;
}

.calendar-mouth .item .price {
    font-size: 11px;
}

.calendar-mouth .item .price .s {
    font-size: 10px;
}

.order-menu {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 48px;
    font-size: 14px;
    line-height: 48px;
}

.order-menu .order_price {
    -webkit-box-flex: 175px;
    flex: 175px 0 0;
    width: 175px;
    padding-left: 20px;
    border-color: #dedede;
    box-sizing: border-box;
}

.order-menu .order_price .num {
    font-size: 19px;
}

.order-menu .order_btn {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.order-menu .order_btn .btn {
    -webkit-box-flex: 1;
    flex: 1;
    height: 48px;
    font-size: 14px;
    text-align: center;
    line-height: 48px;
    border-radius: 0;
}

.order-menu .only_btn .btn:last-child {
    -webkit-box-flex: 1.5;
    flex: 1.5;
}

.picker-shade {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(0,0,0,0.3);
    transition: all .3s;
}

.picker-shade.picker-select--visible {
    visibility: visible;
    opacity: 1;
}

.picker-select {
    position: fixed;
    top: 100%;
    left: 0;
    z-index: 10;
    width: 100%;
    background-color: #fff;
    transition: all .3s;
    transform: translateY(0);
}

.picker-select .wrapper {
    margin-bottom: 0;
}

.picker-select .toolbar {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 35px;
    font-size: 14px;
    text-align: center;
    line-height: 35px;
    background-color: #eee;
}

.picker-select .toolbar .title {
    -webkit-box-flex: 1;
    flex: 1;
    color: #333;
}

.picker-select .toolbar button {
    height: inherit;
    font-size: inherit;
    line-height: inherit;
    background-color: transparent;
    border-radius: 0;
}

.picker-select .toolbar button.btn-gray {
    color: #a0a0a0;
}

.picker-select scroll-view {
    height: 200px;
}

.picker-select .label-item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 14px;
    line-height: 20px;
    color: #666;
}

.picker-select .label-item .txt {
    -webkit-box-flex: 1;
    flex: 1;
}

.picker-select.picker-select--visible {
    transform: translateY(-100%);
}

.order-form .cell__bd {
    text-align: left;
}

.order-form .ems_radio:nth-of-type(2) {
    margin-left: 20px;
}


.order-counter {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    border-color: #ccc;
    font-size: 14px;
    text-align: center;
    line-height: 25px;
    color: #222;
    border-radius: 6px;
    border: 1px solid #ccc;
}

.order-counter font {
    position: relative;
    z-index: 2;
    width: 34px;
    border-color: #ccc;
    font-size: 18px;
    font-weight: 500;
}

.order-counter font.disabled {
    color: #d8d8d8;
}

.order-counter input {
    width: 34px;
    height: 23px;
    text-align: center;
    border: 0;
}

.order-price {
    font-size: 15px;
    line-height: 21px;
    color: #222;
}

.order-price .area {
    padding: 10px 0;
}

.order-price .area_tit {
    margin-bottom: 10px;
}

.order-price .count {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.single-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 -7.5px -7.5px;
}

.single-list .item {
    position: relative;
    height: 25px;
    padding: 0 10px;
    border-color: #999;
    margin: 0 0 7.5px 7.5px;
    font-size: 13px;
    line-height: 25px;
    border-radius: 3px;
}

.single-list .item:after {
    border-radius: 6px;
}

.single-list .item.on:before {
    content: '\e61b';
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 14px;
    font-family: 'iconfont';
    line-height: 1;
}

.single-list .item.disabled {
    border-color: transparent;
    background-color: #f5f5f5;
}

.single-list .item .name {
    height: inherit;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.multi-list {
    margin-bottom: -8px;
}

.multi-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 18px;
    color: #999;
}

.multi-list .item .lt {
    -webkit-box-flex: 1;
    flex: 1;
}

.multi-list .lt_info {
    padding-top: 2.5px;
}

.multi-list .lt_info .price {
    margin-right: 15px;
    color: #222;
}

.order-goods {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 10px 0;
}

.order-goods .lt {
    width: 70px;
    height: 70px;
    margin-right: 12px;
}
.order-goods .lt img{
    width: 70px;
    height: 70px;
}
.order-goods .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.order-goods .lt_pic {
    border-radius: 3px;
}

.order-goods .rt_tit {
    font-size: 13px;
    line-height: 19px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

body {
    background-color: #f5f5f5;
}
.tel{
  text-align: left;
}

/**/
.scard_box {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 18px;
    background-color: #fff;
    margin-bottom: 5px;
}

.card_l {
    -webkit-box-flex: 1;
    flex: 1;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.info-card{
    height: 300px;
}
.card_disnum{
    color: #666;
}

/**/
.coupon {
    width: 355px;
    height: 80px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
    text-align: left;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 18px;
    color: #ff8585;
}
.coupon_title font{
    font-size: 10px;
}

.coupon_rule {
    font-size: 10px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
}

.coupon_tagname {
    font-size: 10px;
    margin-right: 5px;
    color: #ff8585;
}

.get_hint {
    margin-top: 5px;
    color: #FF6A6A;
    font-size: 10px;
    text-align: center;
}

.btn_view {
    z-index: 1;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
    margin-top: 17.5px;
}

.get_btn {
    background-color: #ff5050;
}

.cant_get {
    background-color: #d2d2d2;
}

.has_get {
    border: 1px solid #ff5050;
    background-color: transparent;
    color: #ff5050!important;
}

.share_icon {
    width: 54.5px;
    height: 53px;
    position: fixed;
    right: 0;
    top: 325px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/share_icon_fansCard.png?v=1.0);
    background-size: 100% 100%;
    z-index: 55;
}
.card_box{
    padding: 10px 0;
    white-space: nowrap;
}
.tips{
    padding: 0;
    padding-bottom: 7.5px;
    font-size: 12.5px;
}
.rt_titd{
    color: #999;
    font-size: 12.5px;
}

.shopname{
    font-size: 15px;
    font-weight: bold;
    padding: 10px 20px;
    background: #fff;
    border-bottom: 0.5px solid #f7f7f7;
}
.in-section{
    margin-bottom: 8px;
}
.fix-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background-color: #fff;
    width: 100%;
}
.order-section {
    padding: 5px 20px;
    background-color: #fff;
    border-bottom: 1px #eee;
}
.van-field{
    padding-left: 0!important;
    padding-right: 0!important;
    font-size: 15px;
}
.wx-address{
    font-size: 14px;
}

.wx-address {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    min-height: 70px;
    padding: 12.5px 0;
    font-size: 14px;
    line-height: 21px;
    color: #222;
    box-sizing: border-box;
}

.wx-address .icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: 3px 5px 0 0;
    font-size: 10px;
    text-align: center;
    line-height: 13px;
    border-radius: 50%;
}

.wx-address .txt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    color: #222;
    align-items: center;
}

.wx-address .txt .name {
    flex-shrink: 0;
    width:66px;
    margin-right:4px;
    text-align: left;
}

.wx-address .txt .addr {
    font-size: 12px;
    color: #999;
    text-align: left;
}

.wx-address .icon-arrow {
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -10.5px;
    color: #999;
}
.scrollY{
    max-height: 400px;
    overflow-y: auto;
}

/**/
.module-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 19;
    width: 100%;
    height: 100%;
}

.module-popup .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
    background-color: rgba(0,0,0,0.6);
}

.module-popup .popup-dialog {
    overflow: hidden;
    position: absolute;
    top: 45%;
    left: 50%;
    width: 80%;
    max-width: 300px;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    background-color: #fff;
    transition: all .3s;
    transform: translate(-50%,-50%);
    border-radius: 1.5px;
}

.module-popup .popup-dialog .popup-dialog__hd {
    padding: 0.5em 0.5em .5em;
}

.module-popup .popup-dialog .popup-dialog__hd .popup-dialog__title {
    font-weight: 400;
    font-size: 18px;
}

.module-popup .popup-dialog .popup-dialog__bd {
    padding: 0 1.6em .8em;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #666;
}

.module-popup .popup-dialog .popup-dialog__bd .popup-input {
    padding: 4px 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    height: 2em;
    width: 90%;
    margin: 10px auto 0;
    font-size: inherit;
    text-align: left;
    line-height: 2em;
    color: inherit;
    background-color: transparent;
    outline: none;
    border-radius: 0;
    border:1px solid #eee;
    box-shadow: 0;
    resize: none;
    box-sizing: border-box;
    -webkit-appearance:none;
}

.module-popup .popup-dialog .popup-dialog__bd .input-place {
    color: #999;
}

.module-popup .popup-dialog .popup-dialog__ft {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-color: #d5d5d5;
    font-size: 18px;
    line-height: 48px;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn {
    overflow: visible;
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    border-color: #d5d5d5;
    color: #3cc51f;
    background-color: transparent;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn.default {
    color: #5f646e;
}

.module-popup .popup-dialog .popup-dialog__ft .popup-dialog__btn:first-child:after {
    visibility: hidden;
}

.module-popup .popup--visible {
    opacity: 1;
    visibility: visible;
}

/**/
.multi-box{
    padding: 15px;
}
.multi-top{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}
.multi-ok{
    font-size: 15px;
    color: #1989fa;
    padding: 5px 15px;
}

.closedate{
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 16px;
}
.datebox_body{
    margin-top: 30px;
}
.datebox_bodyin{
    height:75px;
    width:345px;
    white-space: nowrap;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
}
.datebox_item{
    width:100px;
    height:50px;
    line-height: 50px;
    border-radius:7.5px;
    box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.1) inset;
    text-align: center;
    display: inline-block;
    margin:0 10px 0 0;
    font-size: 14px;
}
.datebox_timeitem{
    display: inline-block;
    border:1px solid #ddd;
    padding:5px 10px;
    margin: 10px 10px 0 0 ;
    border-radius:3px;
    font-size: 13px;
}


.shoplist_item{
    margin:15px 0;
    box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.1);
    border-radius: 5px;
    padding: 10px;
}
.shoplist_item:first-child{
    margin-top: 25px;
}
.shoplist_info{
    padding-right: 10px;
}
.shoplist_name{
    font-weight: bold;
    color: #333;
    font-size: 15px;
    padding-bottom: 10px;
}
.shoplist_add{
    color: #999;
    font-size: 13px;
}
.shoplist_dis{
    color: #999;
    font-size: 13px;
}

</style>