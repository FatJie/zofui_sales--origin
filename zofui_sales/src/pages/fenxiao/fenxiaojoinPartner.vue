<template>
    
    <div :class="params.style" id="main">
        <loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="joinPartner-top">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/82098/36/14531/61349/5dbeef9fE15c5184c/110488875a870694.png">
            </div>
            <div class="joinPartner-content">
                <div class="joinPartner-msg">
                    <div class="title">合伙人信息</div>
                    <form bindsubmit="submit" report-submit>
                        <div class="item">
                            <input name="name" v-model="name" placeholder="请添加姓名" value=""></input>
                        </div>
                        <div class="item">
                            <input name="phone" v-model="tel" placeholder="请添加手机号码" value=""></input>
                        </div>
                        <div class="btn bg-pri" @click="submit">提交信息</div>
                    </form>
                </div>
                <div class="joinPartner-tip">
                    <div class="title">
                        <div class="icon iconfont">
                            <img src="http://img11.360buyimg.com/ddimg/jfs/t1/84309/13/14460/1276/5dbeefc1E3289b265/1491b85c427bbec7.png">
                        </div>
                        <div class="text">加入合伙人须知</div>
                    </div>
                    <div class="tips">
                        <div class="item">1.请填写有效的身份信息(姓名、手机账号)，确保信息的真实性。</div>
                        <div class="item">2.提交信息后，管理员会及时审核，请耐心等待。</div>
                    </div>
                </div>
            </div>

        </div>

        </div>
    </div>
</template>

<script type="text/javascript">
    import { Loading,List,Toast,Dialog,PullRefresh,Popup } from 'vant';
    export default {
        name : 'fenxiaojoinPartner',
        components: {
            [List.name] : List,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
        },
        data : function(){
            return {
                isrefresh : false,
                inited : false,
                params : {},
                userinfo : {},
                sharedata :{},
                datalist : [],
                name : '',
                tel : '',
                address : '',
                showaddress : false,
            }
        },
        created:function(e){
            
            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            submit(e){
                var self = this;
                var postdata = {
                    op : 'subjoinfx',
                    name : self.name,
                    tel : self.tel
                };
                if( postdata.name == '' ){
                    self.$toast('请填写姓名');
                    return false;
                }
                if( postdata.tel == '' ){
                    self.$toast('请填写电话');
                    return false;
                }
                self.$util.http('user','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        Dialog.alert({
                          message: res.message
                        }).then(() => {
                            self.$router.go(-1);
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true);

            },
            cancelarea(){
                this.showaddress = false;
            },
            confirmarea(e){
                this.address = e[0].name +','+e[1].name +','+e[2].name;
                this.showaddress = false;
            },
            showaddressfn(){
                this.showaddress = true;
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'joinfx',
                    zfid : query.zfid ? query.zfid : 0,
                    isposter : query.isposter ? query.isposter : 0,
                }
                self.$util.http('user','GET',postdata,function(res){
                    self.inited = 1;  
                    if (!res.errno && res.data ) {
                        self.params = res.data.params;
                        self.inited = 2;
                    }else{
                        self.$toast(res.message);
                    }
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
#main {
    min-height: 100vh;
    background-color: #fff;
}
@import "../../../sttic/css/iconfont.css";


.joinPartner-top img {
    display: block;
    width: 100%;
    height: 100%;
}

.joinPartner-content {
    padding: 15px;
}

.joinPartner-msg {
    padding: 19.5px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 1px 0px 25px rgba(51,142,240,0.4);
    margin-top: -43px;
    font-size: 18px;
    color: #343434;
    position: relative;
}
input{
    width: 100%;
    background-color: rgba(0,0,0,0);
    border: 0;
}
.joinPartner-msg .title {
    text-align: center;
    font-weight: 500;
    margin-bottom: 25px;
}

.joinPartner-msg .item {
    padding: 10px;
    margin: 12px 0;
    font-size: 14px;
    background: #f5f5f7;
    border-radius: 3.5px;
}

.joinPartner-msg .item .input-placeholder {
    font-size: 14px;
    color: #c6c6c8;
}

.joinPartner-msg .btn {
    height: 49.5px;
    line-height: 49.5px;
    margin-top: 43px;
    font-size: 15px;
    color: #fff;
    background: #3390ef;
    border-radius: 3.5px;
    text-align: center;
}

.joinPartner-tip {
    padding: 15px;
    margin-top: 29px;
}

.joinPartner-tip .title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: #343434;
    font-size: 14px;
    font-weight: 500;
}

.joinPartner-tip .title .icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
}

.joinPartner-tip .title .icon img {
    display: block;
    width: 100%;
    height: 100%;
}

.joinPartner-tip .tips {
    font-size: 13px;
    color: #5a5a5a;
    padding: 10px 0 0 30px;
    line-height: 21px;
}

</style>