<template>
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
        
        <div class="tips mt20 sever_type ">基本参数</div>
        <van-cell-group>
            <van-field v-model="good.title" :label="params.goodbname + '名称'" type="textarea" clearable :placeholder="'输入'+ params.goodbname +'名称'" />

            <van-field v-model="good.oldprice" clickable label="原价" type="number" placeholder="输入原价" >
                <div slot="button" >元</div>
            </van-field>

            <van-field v-if="params.editss == 0" v-model="good.falsesaled" clickable clearable label="虚拟销量" type="tel" placeholder="输入虚拟销量" ></van-field>

            <van-field v-if="params.editsa == 1" v-model="good.falsescan" clickable clearable label="虚拟浏览" type="tel" placeholder="输入虚拟浏览量" >
            </van-field>

            <van-field v-if="params.editsa == 1" v-model="good.falseshare" clickable clearable label="虚拟分享" type="tel" placeholder="输入虚拟分享量" >
            </van-field>

            <van-field  v-model="good.number" clickable clearable label="排序序号" type="tel" placeholder="越大越排前" >
            </van-field>

            <van-field v-model="good.permax" clickable clearable label="限购数量" type="tel" placeholder="每次下单限购的数量" >
            </van-field>

            <van-field v-model="good.buytimes" clickable clearable label="限购单数" type="tel" placeholder="每人最多下单次数" >
            </van-field>

            <van-field v-if="params.kghxtimes == 0" v-model="good.hxtimes" clickable clearable :label="params.hxbname+'次数'" type="tel" :placeholder="'对应订单可'+params.hxbname+'的次数'" >
            </van-field>

            <div class="van-cell van-cell--clickable van-field" v-if="params.kghxtimes == 0">
                <div class="van-cell__title van-field__label">
                    <span>购买数量与{{params.hxbname}}次数</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.hxtype" >
                        <van-radio name="1">固定</van-radio>
                        <van-radio name="2">{{params.hxbname}}次数随购买数量增加</van-radio>
                        
                    </van-radio-group>
                    </div>
                </div>
            </div>

            <van-field clickable  :label="params.goodbname + '分类'" readonly :placeholder="good.sortname ? good.sortname : '选择分类'" @click="popupsort = true" >
            </van-field>
            <van-popup v-model="popupsort" position="bottom" >
                <van-picker :columns="allsort"  value-key="name" confirm-button-text="确定" show-toolbar @cancel="popupsort = false" @confirm="onChangesort" />
            </van-popup>
            
            <van-field clickable  label="使用红包" readonly :placeholder="good.redname ? good.redname : '选择红包'" @click="popupredbag = true" >
            </van-field>
            <van-popup v-model="popupredbag" position="bottom" >
                <van-picker :columns="allredbag"  value-key="name" confirm-button-text="确定" show-toolbar @cancel="popupredbag = false" @confirm="onChangered" />
            </van-popup>

            <van-field v-model="good.shortv" clickable clearable label="视频链接" type="shortv" placeholder="可填入抖音视频链接" v-if="params.isvideo == 0">
            </van-field>

            <div class="van-cell van-cell--clickable van-field" v-if="params.isvideo == 0">
                <div class="van-cell__title van-field__label">
                    <span>视频轮播</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.sliderv" >
                        <van-radio name="0">不放</van-radio>
                        <van-radio name="1">视频放轮播图上</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field" v-if="params.isvideo == 0">
                <div class="van-cell__title van-field__label">
                    <span>视频专页</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.isv" >
                        <van-radio name="0">不在视频专页显示</van-radio>
                        <van-radio name="1">在视频专页显示</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field" v-if="params.isvideo == 0">
                <div class="van-cell__title van-field__label">
                    <span>优先进视频</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.vfirst" >
                        <van-radio name="0">商品优先进入视频页</van-radio>
                        <van-radio name="1">不进入</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>

        </van-cell-group>


        <div class="tips mt20 sever_type ">其他参数</div>
        <van-cell-group>
            <div class="van-cell van-cell--clickable van-field" >
                <div class="van-cell__title van-field__label">
                    <span>资金计算单位</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.mper" >
                        <van-radio name="0">百分比（%）</van-radio>
                        <van-radio name="1">固定值（元）</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <van-field v-if="params.isfan == 1" v-model="good.fanx" clickable clearable label="购买返现" type="number" placeholder="订单完成返现" >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>

            <van-field v-if="params.isfan == 1" v-model="good.userfanx" clickable clearable label="会员购买返现" type="number" placeholder="会员订单完成返现" >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>

            <van-field v-if="params.fxlevel != 3 && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.fxmoney" clickable clearable :label="params.fxbname+'佣金'" type="number" :placeholder="params.fxbname+'者的佣金比例'" >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>
            <van-field v-if="params.isucard == 0 && params.fxlevel != 3 && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.userfxmoney" clickable clearable :label="'会员'+params.fxbname+'佣金比例'" type="number" :placeholder="'不能小于'+params.fxbname+'佣金'" >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>

            <van-field v-if="(params.fxlevel == 1 || params.fxlevel == 2) && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.fxmoneya" clickable clearable :label="'二级'+params.fxbname+'佣金'" type="number"  >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>
            <van-field v-if="params.isucard == 0 && (params.fxlevel == 1 || params.fxlevel == 2) && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.userfxmoneya" clickable clearable :label="'会员二级'+params.fxbname+'佣金比例'" type="number"  >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>

            <van-field v-if="params.fxlevel == 2 && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.fxmoneyb" clickable clearable :label="'三级'+params.fxbname+'佣金'" type="number"  >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>
            <van-field v-if="params.isucard == 0 && params.fxlevel == 2 && params.fxmtype != 1 && shop.auth.isfx != 1" v-model="good.userfxmoneyb" clickable clearable :label="'会员三级'+params.fxbname+'佣金比例'" type="number"  >
                <div slot="button" >{{good.mper == 1 ? '元' : '%'}}</div>
            </van-field>

            <div class="van-cell van-cell--clickable van-field" v-if="params.jfpay*1 > 0 && params.gjfmm*1 == 0">
                <div class="van-cell__title van-field__label">
                    <span>{{params.jfbname}}抵扣</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.isjfdk" >
                        <van-radio name="0">开启</van-radio>
                        <van-radio name="1">关闭</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field" >
                <div class="van-cell__title van-field__label">
                    <span>配送到家</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.isexpress" >
                        <van-radio name="0">关闭</van-radio>
                        <van-radio name="1">开启</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>

            <div class="van-cell van-cell--clickable van-field" >
                <div class="van-cell__title van-field__label">
                    <span>到店领取</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="good.istoshop" >
                        <van-radio name="1">关闭</van-radio>
                        <van-radio name="0">开启</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>          
            

        </van-cell-group>

        <template v-if="good.istoshop == 0 || !good.istoshop">
            <div class="tips mt20 sever_type ">领取门店</div>
            <van-checkbox-group v-model="shoplista">
                <van-cell-group >
                    <van-cell v-for="(item, index) in shoplist" clickable :key="index" :title="item.name" >
                        <van-checkbox :name="item.id || item.id+''" ref="checkboxes" slot="right-icon" />
                    </van-cell>
                </van-cell-group>
            </van-checkbox-group>
        </template>

        <div class="tips mt20 sever_type ">
            设置{{params.goodbname}}图片
        </div>
        <van-cell-group class="upbox">
            <van-uploader upload-text="正方形封面" v-model="showthumb" :max-count="1" :after-read="uploada" />
            <van-uploader upload-text="长方形封面" v-model="showthumbh" :max-count="1" :after-read="uploadb" />
        </van-cell-group>

        <van-cell-group class="upbox">
            <div class="van-uploader__preview" v-for="(item,index) in good.pic" :key="index">
                <div class="van-image van-uploader__preview-image">
                    <img :src="item.show" class="van-image__img">
                    <i @click="deletet(index)"  class="van-icon van-icon-delete van-uploader__preview-delete"></i>
                </div>
            </div>
            <van-uploader @delete="deletet" :preview-image="true" :multiple="true" :after-read="upload" upload-text="详情图片" :max-count="10" accept="image/*" />
        </van-cell-group>

        <div class="tips mt20 sever_type ">{{params.goodbname}}模式</div>
        <van-tabs v-model="acttype">
            <van-tab :title="'普通'+ params.goodbname +'参数'" :disabled="good.id && acttype != 0" >
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>普通{{params.goodbname}}</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isdefault" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>
                <van-field v-model="good.stock" clickable clearable label="剩余库存" type="tel" placeholder="填写剩余库存" >
                </van-field>

                <van-field v-model="good.price" clickable clearable label="现价" type="tel" placeholder="下单的价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.isucard == 0" v-model="good.userprice" clickable clearable label="会员现价" type="tel" placeholder="不能大于现价" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.ismpr == 1" v-model="good.userpricejb" clickable clearable :label="'会员'+params.umname+'价'" type="tel" placeholder="不能大于现价" >
                    <div slot="button" >元</div>
                </van-field>

            </van-tab>
            <van-tab title="限时抢购" :disabled="good.id && acttype != 1" v-if="(params.isquick == 0 || !params.isquick) && (!shop.auth || shop.auth.isxq != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关抢购</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isquick" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>


                <van-field clickable  label="开始时间" readonly :placeholder="good.quickstart ? good.quickstart : '设置时间'" @click="quickstart = true" >
                </van-field>
                <van-popup v-model="quickstart" position="bottom" >
                    <van-datetime-picker v-model="good.showquickstart" type="datetime"  @cancel="quickstart = false" @confirm="timefn($event,'quickstart')"  />
                </van-popup>

                <van-field clickable  label="结束时间" readonly :placeholder="good.quickend ? good.quickend : '设置时间'" @click="quickend = true" >
                </van-field>
                <van-popup v-model="quickend" position="bottom" >
                    <van-datetime-picker v-model="good.showquickend" type="datetime" @cancel="quickend = false" @confirm="timefn($event,'quickend')"  />
                </van-popup>

                <van-field v-model="good.quickstock" clickable clearable label="剩余库存" type="tel" placeholder="填写剩余库存" >
                </van-field>

                <van-field v-model="good.quicklimit" clickable clearable label="限抢数量" type="tel" placeholder="每人能抢的数量" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.quickprice" clickable clearable label="抢购价格" type="number" placeholder="抢购的价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.isucard == 0" v-model="good.quickuserprice" clickable clearable label="会员抢购价格" type="number" placeholder="不能大于抢购价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.ismpr == 1" v-model="good.quickuserpricejb" clickable clearable :label="'会员'+params.umname+'价'" type="number" placeholder="不能大于抢购现价" >
                    <div slot="button" >元</div>
                </van-field>

            </van-tab>
            <van-tab title="拼团" :disabled="good.id && acttype != 2" v-if="(params.isgroup == 0 || !params.isgroup) && (!shop.auth || shop.auth.ispin != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关拼团</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isgroup" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>


                <van-field clickable  label="开始时间" readonly :placeholder="good.groupstart ? good.groupstart : '设置时间'" @click="groupstart = true" >
                </van-field>
                <van-popup v-model="groupstart" position="bottom" >
                    <van-datetime-picker  type="datetime" v-model="good.showgroupstart" @cancel="groupstart = false" @confirm="timefn($event,'groupstart')"  />
                </van-popup>

                <van-field clickable  label="结束时间" readonly :placeholder="good.groupend ? good.groupend : '设置时间'" @click="groupend = true" >
                </van-field>
                <van-popup v-model="groupend" position="bottom" >
                    <van-datetime-picker type="datetime" v-model="good.showgroupend" @cancel="groupend = false" @confirm="timefn($event,'groupend')"  />
                </van-popup>

                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>自动成团</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.groupauto" >
                            <van-radio name="0">开启</van-radio>
                            <van-radio name="1" >关闭</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>
                <div class="van-cell van-cell--clickable van-field" v-if="params.gerfree > 0">
                    <div class="van-cell__title van-field__label">
                        <span>团长免单</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isleadfree" >
                            <van-radio name="0">关闭</van-radio>
                            <van-radio name="1" >开启(非自动成团有效)</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>

                <van-field v-model="good.groupstock" clickable clearable label="剩余库存" type="tel" placeholder="填写剩余库存" >
                </van-field>

                <van-field v-model="good.groupmem" clickable clearable label="成团人数" type="tel" placeholder="团成功人数" >
                    <div slot="button" >人</div>
                </van-field>

                <van-field v-model="good.grouptime" clickable clearable label="拼团时间" type="number" placeholder="拼团持续时间" >
                    <div slot="button" >小时</div>
                </van-field>

                <van-field v-model="good.gprice" clickable clearable label="单买价格" type="number" placeholder="单买购买的价格" >
                    <div slot="button" >元</div>
                </van-field>
                <van-field v-if="params.isucard == 0" v-model="good.guserprice" clickable clearable label="会员单买价格" type="number" placeholder="不能大于单买价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.groupprice" clickable clearable label="拼团价格" type="number" placeholder="不能大于单买价格" >
                    <div slot="button" >元</div>
                </van-field>
                <van-field v-if="params.isucard == 0" v-model="good.groupuserprice" clickable clearable label="会员拼团价格" type="number" placeholder="不能大于拼团价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.ismpr == 1" v-model="good.guserpricejb" clickable clearable :label="'会员'+params.umname+'价'" type="number" placeholder="不能大于单买价格" >
                    <div slot="button" >元</div>
                </van-field>
                <van-field v-if="params.ismpr == 1" v-model="good.groupuserpricejb" clickable clearable :label="'会员'+params.umname+'拼团价'" type="number" placeholder="不能大于拼团价" >
                    <div slot="button" >元</div>
                </van-field>
                
            </van-tab>
            <van-tab title="砍价" :disabled="good.id && acttype != 3" v-if="(params.iscut == 0 || !params.iscut) && (!shop.auth || shop.auth.iscut != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关砍价</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.iscut" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>


                <van-field clickable  label="开始时间" readonly :placeholder="good.cutstart ? good.cutstart : '设置时间'" @click="cutstart = true" >
                </van-field>
                <van-popup v-model="cutstart" position="bottom" >
                    <van-datetime-picker v-model="good.showcutstart" type="datetime" @cancel="cutstart = false" @confirm="timefn($event,'cutstart')"  />
                </van-popup>

                <van-field clickable  label="结束时间" readonly :placeholder="good.cutend ? good.cutend : '设置时间'" @click="cutend = true" >
                </van-field>
                <van-popup v-model="cutend" position="bottom" >
                    <van-datetime-picker v-model="good.showcutend" type="datetime" @cancel="cutend = false" @confirm="timefn($event,'cutend')"  />
                </van-popup>

                <van-field v-model="good.cutdtime" clickable clearable label="限制时间" type="tel" placeholder="需参与后此时间内完成" >
                    <div slot="button" >小时</div>
                </van-field>

                <van-field v-model="good.cutstock" clickable clearable label="剩余库存" type="tel" placeholder="填写剩余库存" >
                </van-field>

                <van-field v-model="good.cutprice" clickable clearable label="起始价格" type="tel" placeholder="起砍的价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.cutbot" clickable clearable label="底价价格" type="number" placeholder="能砍到的底价" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.cutuserbot" clickable clearable label="会员底价" type="number" placeholder="不能大于底价价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.cutmin" clickable clearable label="砍价最低金额" type="number" placeholder="每次砍价的最低金额" >
                    <div slot="button" >元</div>
                </van-field>
                <van-field v-model="good.cutmax" clickable clearable label="砍价最高金额" type="number" placeholder="每次砍价的最高金额" >
                    <div slot="button" >元</div>
                </van-field>
                
            </van-tab>

            <van-tab title="报名" :disabled="good.id && acttype != 4" v-if="(params.isbm == 0 || !params.isbm) && (!shop.auth || shop.auth.isbm != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关报名</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isact" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>

                <van-field clickable  label="开始时间" readonly :placeholder="good.actstart ? good.actstart : '设置时间'" @click="actstart = true" >
                </van-field>
                <van-popup v-model="actstart" position="bottom" >
                    <van-datetime-picker  type="datetime" v-model="good.showactstart" @cancel="actstart = false" @confirm="timefn($event,'actstart')"  />
                </van-popup>

                <van-field clickable  label="结束时间" readonly :placeholder="good.actend ? good.actend : '设置时间'" @click="actend = true" >
                </van-field>
                <van-popup v-model="actend" position="bottom" >
                    <van-datetime-picker type="datetime" v-model="good.showactend" @cancel="actend = false" @confirm="timefn($event,'actend')"  />
                </van-popup>

                <van-field v-model="good.actstock" clickable clearable label="报名名额" type="tel" placeholder="名额到0后不能再参与" >
                    <div slot="button" >人</div>
                </van-field>

                <van-field v-model="good.actprice" clickable clearable label="支付金额" type="tel" placeholder="报名需要支付的金额" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.isucard == 0" v-model="good.actuserprice" clickable clearable label="会员支付金额" type="number" placeholder="不能大于支付金额" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.ismpr == 1" v-model="good.actuserpricejb" clickable clearable :label="'会员'+params.umname+'价'" type="number" placeholder="不能大于支付金额" >
                    <div slot="button" >元</div>
                </van-field>

            </van-tab>

            <van-tab title="抽奖" :disabled="good.id && acttype != 5" v-if="(params.ischou == 0 || !params.ischou) && (!shop.auth || shop.auth.ischou != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关抽奖</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.ischou" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>

                <van-field clickable  label="开始时间" readonly :placeholder="good.choustart ? good.choustart : '设置时间'" @click="choustart = true" >
                </van-field>
                <van-popup v-model="choustart" position="bottom" >
                    <van-datetime-picker  type="datetime" v-model="good.showchoustart" @cancel="choustart = false" @confirm="timefn($event,'choustart')"  />
                </van-popup>

                <van-field clickable  label="开奖时间" readonly :placeholder="good.chouend ? good.chouend : '设置时间'" @click="chouend = true" >
                </van-field>
                <van-popup v-model="chouend" position="bottom" >
                    <van-datetime-picker type="datetime" v-model="good.showchouend" @cancel="chouend = false" @confirm="timefn($event,'chouend')"  />
                </van-popup>

                <van-field v-model="good.choustock" clickable clearable label="中奖名额" type="tel" placeholder="能中奖的人数" >
                    <div slot="button" >人</div>
                </van-field>

                <van-field v-model="good.chouprice" clickable clearable label="支付金额" type="tel" placeholder="填0即不需要支付" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-model="good.chousmaxs" clickable clearable label="最多邀请获码" type="number" placeholder="每邀请一位获得一枚抽奖码" >
                    <div slot="button" >枚</div>
                </van-field>


            </van-tab>
            <van-tab title="秒杀" :disabled="good.id && acttype != 6" v-if="(params.isms == 0 || !params.isms) && (!shop.auth || shop.auth.isms != 1)">
                
                <div class="van-cell van-cell--clickable van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开关秒杀</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.isms" >
                            <van-radio :name="0 || '0'">关闭</van-radio>
                            <van-radio :name="1 || '1'" >开启</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>

                <div class="van-cell  van-field" >
                    <div class="van-cell__title van-field__label">
                        <span>开启时间</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                        <van-radio-group class="my-radio tl" v-model="good.mstime" >
                            <van-radio v-for="(item,index) in params.kill" :key="index" :name='item.start+""'>{{item.start}}</van-radio>
                        </van-radio-group>
                        </div>
                    </div>
                </div>

                <van-field v-model="good.msstock" clickable clearable label="每次库存" type="tel" placeholder="填写每次秒杀的库存" >
                </van-field>

                <van-field v-model="good.msprice" clickable clearable label="秒杀价" type="tel" placeholder="秒杀的价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.isucard == 0" v-model="good.msuserprice" clickable clearable label="会员秒杀价" type="number" placeholder="会员秒杀的价格" >
                    <div slot="button" >元</div>
                </van-field>

                <van-field v-if="params.ismpr == 1" v-model="good.msuserpricejb" clickable clearable :label="'会员'+params.umname+'价'" type="number" placeholder="不能大于秒杀价" >
                    <div slot="button" >元</div>
                </van-field>


            </van-tab>
        </van-tabs>

        <div class="bot_place"></div>

        <div class="pub_pub" @click="pub" >
            <div class="mybtn" >发布</div>
        </div>



        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,Popup,Field,cellGroup,Radio,radioGroup,Picker,Checkbox,CheckboxGroup,Cell,Uploader,Tab,Tabs,DatetimePicker } from 'vant';
	export default {
        name : 'adminpub',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Radio.name] : Radio,
            [radioGroup.name] : radioGroup,
            [Picker.name] : Picker,
            [Checkbox.name] : Checkbox,
            [CheckboxGroup.name] : CheckboxGroup,
            [Cell.name] : Cell,
            [Uploader.name] : Uploader,
            [Tab.name] : Tab,
            [Tabs.name] : Tabs,
            [DatetimePicker.name] : DatetimePicker,

	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                allsort : [],
                allredbag : [],
                good : {title:'',pic:[]},
                shop : {},
                shoplist : [],
                popupsort : false,
                popupredbag : false,
                shoplista : [],
                showthumb : [],
                showthumbh : [],
                pictemp : [],
                acttype : 0,
                quickstart : false,
                quickend : false,
                groupstart : false,
                groupend : false,
                cutstart : false,
                cutend : false,
                actstart : false,
                actend : false,
                choustart : false,
                chouend : false,
                quickstarttt : new Date(),
	  		}
	  	},
        activated:function(e){


        },
	  	created:function(e){
            this.inited = false;
            this.initData();
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            timefn(e,type){
                var t = this.$util.formDate(e);
                if( type == 'quickstart' ){
                    this.good.quickstart = t;
                    this.good.showquickstart = new Date(t);
                    this.quickstart = false;
                }else if(type == 'quickend'){
                    this.good.quickend = t;
                    this.good.showquickend = new Date(t);
                    this.quickend = false;
                }else if(type == 'groupstart'){
                    this.good.groupstart = t;
                    this.good.showgroupstart = new Date(t);
                    this.groupstart = false;
                }else if(type == 'groupend'){
                    this.good.groupend = t;
                    this.good.showgroupend = new Date(t);
                    this.groupend = false;
                }else if(type == 'cutstart'){
                    this.good.cutstart = t;
                    this.good.showcutstart = new Date(t);
                    this.cutstart = false;
                }else if(type == 'cutend'){
                    this.good.cutend = t;
                    this.good.showcutend = new Date(t);
                    this.cutend = false;
                }else if(type == 'actstart'){
                    this.good.actstart = t;
                    this.good.showactstart = new Date(t);
                    this.actstart = false;
                }else if(type == 'actend'){
                    this.good.actend = t;
                    this.good.showactend = new Date(t);
                    this.actend = false;
                }else if(type == 'choustart'){
                    this.good.choustart = t;
                    this.good.showchoustart = new Date(t);
                    this.choustart = false;
                }else if(type == 'chouend'){
                    this.good.chouend = t;
                    this.good.showchouend = new Date(t);
                    this.chouend = false;
                }
                
            },
            pub(){
                var self = this;
                var good = self.good;

                if( !good.title ) {
                    self.$toast('请填入名称');return false;
                }
                if( !good.oldprice || good.oldprice*1 <= 0 ) {
                    self.$toast('请填入原价');return false;
                }        
                if( !good.thumb && !good.thumbtemp ) {
                    self.$toast('请上传封面图');return false;
                }
                if( !good.sortid ) {
                    self.$toast('请选择分类');return false;
                }
                self.savedata();
            },
            savedata(){
                var self = this;
                self.good.shoplista = self.shoplista;
                var form = JSON.stringify( self.good );
                self.$util.http('admin','get',{op:'pubgoods',form:form},function(res){     
                    if (!res.errno && res.data) {
                        self.$toast({
                            message : res.message,
                            mask : true,
                            onClose : function(){
                                self.$router.go(-1);
                            }
                        });
                    }else{
                        self.$toast({
                            message : res.message,

                            onClose : function(){
                                if( res.data.appurl ){
                                    self.$router.push(res.data.appurl);
                                }
                            }
                        });
                    }
                },true);
            },
            deletet(e){
                this.good.pic.splice(e,1);
            },
            uploada(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.good.showthumb = res.url;
                    self.good.thumb = res.attachment;
                })
            },
            uploadb(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.good.showthumbh = res.url;
                    self.good.thumbh = res.attachment;
                })
            },
            upload(e){
                var self = this;
                if( e instanceof Array ){
                    for (let i = 0; i < e.length; i++) {
                        self.$util.upimg(e[i].file,function(res){
                            self.good.pic.push({
                                id : new Date().getTime(),
                                show : res.url,
                                att : res.attachment,
                            });
                        })
                    }
                }else{
                    self.$util.upimg(e.file,function(res){
                        self.good.pic.push({
                            id : new Date().getTime(),
                            show : res.url,
                            att : res.attachment,
                        });
                    })
                }
            },
            onChangesort(tar){
                this.good.sortid = tar.id;
                this.good.sortname = tar.name;
                this.popupsort = false;
            },
            onChangered(tar){
                this.good.redid = tar.id;
                this.good.redname = tar.name;
                this.popupredbag = false;
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var gid = query.gid ? query.gid : 0;

                self.$util.http('admin','GET',{op:'pubstart',gid:gid},function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
	                   	self.allsort = res.data.allsort;
                        self.allredbag = res.data.allredbag;
		                self.good = gid > 0 ? res.data.good : self.good;
                        self.shop = res.data.shop;
                        self.shoplist = res.data.shoplist;
                        self.shoplista = res.data.shoplista ? res.data.shoplista : [];

                        if( self.good ){
                            if( self.good.showthumb ){
                                self.showthumb = [{content:self.good.showthumb}];
                            }
                            if( self.good.showthumbh ){
                                self.showthumbh = [{content:self.good.showthumbh}];
                            }
                            self.acttype = self.good.type;
                        }

                        self.good.showquickstart = self.good.quickstart ? new Date(self.good.quickstart) : new Date();
                        self.good.showquickend = self.good.quickend ? new Date(self.good.quickend) : new Date();

                        self.good.showgroupstart = self.good.groupstart ? new Date(self.good.groupstart) : new Date();
                        self.good.showgroupend = self.good.groupend ? new Date(self.good.groupend) : new Date();

                        self.good.showcutstart = self.good.cutstart ? new Date(self.good.cutstart) : new Date();
                        self.good.showcutend = self.good.cutend ? new Date(self.good.cutend) : new Date();

                        self.good.showactstart = self.good.actstart ? new Date(self.good.actstart) : new Date();
                        self.good.showactend = self.good.actend ? new Date(self.good.actend) : new Date();

                        self.good.showchoustart = self.good.choustart ? new Date(self.good.choustart) : new Date();
                        self.good.showchouend = self.good.chouend ? new Date(self.good.chouend) : new Date();                       
                        
						self.inited = 2;
                    }else if( res.errno == 2 ){
                        self.$toast( res.message );
                        self.$router.push(res.data.appurl);
	                }else{
                        self.$toast({
                            message : res.message,
                            duration : 1000,
                            onClose : function(){
                                self.$router.push(res.data.appurl);
                            }
                        });
	                }
	                self.isrefresh = false;
	            });
            },
	  		onLoad() {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
#main{
    min-height: 100vh;
    font-size: 15px;
    background: #eee;
}
.pub_pub{
    position: fixed;
    left: 2%;
    width: 96%;
    bottom: 5px;
    z-index: 100;
}
.pub_pub .btn{
    background: #449aff;
    width: 100%;
}
.bot_place{
    height: 100px;
}
.shoplist_item{
    padding: 2.5px 0;
}
.shoplist_name{
    font-size: 15px;
}
.upbox{
    padding: 10px;
    font-size: 14px;
    overflow: hidden;
}
.upbox>div{
    float: left;
    margin-right: 20px;
}
</style>