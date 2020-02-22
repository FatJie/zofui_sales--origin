<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

<div class="chatBox">
    <div  id="chatContainer" scrollY="true"  >
        <div id="chat">
            <div class="historyTip" v-if="page.isend && datalist.length > 0">没有更多内容了</div>
            <template v-else>
                <image class="moreing" src="https://img11.360buyimg.com/ddimg/jfs/t1/56121/6/2089/2767/5cfe2db4Ec19d8cc3/a31cc09215e19b84.gif" v-if="moreing"></image>
                <div @click="handleHistoryMsg" class="historyTip" wx:else>点击加载</div>
            </template>
            
            <div v-for="(message,index) in datalist" :key="index" >

 
<div class="messageTime" v-if="message.time">{{message.time}}</div>

<!-- 商品 -->
<div class="commodity_card" @click="link" :data-url="message.appurl" v-if="message.type == 2 || message.type == 3">
    <div class="img">
        <img :src="message.gthumb" />
    </div>
    <div class="info">
        <div class="info_top">{{message.gtitle}}</div>
        <div class="info_btm">
            <div class="left" v-if="message.price">
                ¥
                <font class="num">{{message.price}}</font>
            </div>
            <div class="right">查看详情</div>
        </div>
    </div>
</div>

<!-- 单行文字 -->
<div class="box" :class="message.from == 'self' ? 'user':'service'" v-if="message.type == 0">
    <div class="head_img">
        <img :src="info.tarimg" />
    </div>
    <div class="message_box">
        <font class="message">{{message.content}}</font>
    </div>
</div>

<!-- 图片 -->
<div class="box_img " :class="message.from == 'self' ? 'user':'service'" v-if="message.type == 1">
    <div class="head_img">
        <img src="info.tarimg" />
    </div>
    <div class="message">
        <div class="message_box">
            <img @click="imageShowOrHideFun" :data-img="message.images" class="Photo" mode="widthFix" :src="message.images"  />
        </div>
    </div>
</div>
            </div>
            

<!-- 商品 -->
<div class="commodity_card" v-if="goods" >
    <div class="img">
        <img :src="goods.thumb" />
    </div>
    <div class="info">
        <div class="info_top">{{goods.title}}</div>
        <div class="info_btm">
            <div class="left">
                ¥<font class="num">{{goods.price}}</font>
            </div>
            <div @click="sendCommodityCard" class="right" data-type="2">发送链接</div>
        </div>
    </div>
</div>
<!-- 商品 -->
<div class="commodity_card" v-if="jizi" >
    <div class="img">
        <img :src="jizi.thumb">
    </div>
    <div class="info">
        <div class="info_top">{{jizi.title}}</div>
        <div class="info_btm">
            <div class="left"></div>
            <div @click="sendCommodityCard"  class="right" data-type="3">发送链接</div>
        </div>
    </div>
</div>
<div style="height:80px;background:#f2f2f2"></div>

        </div>
    </div>

    <div class="chat-field-tool" >
        <textarea v-model="msg" class="chat-field-area"  placeholder="请输入需要咨询的问题" ></textarea>
        <div class="chat-icons">
            <div @click="sendMsgBtnFun" class="btn-send" id="btn-send" >发送</div>
            <van-uploader :after-read="uploada">
              <div  class="toolbar-icon" ></div>
            </van-uploader>
            
        </div>
    </div>

</div>
<audio  id="sendau" :src="params.sendau"></audio>
<audio  id="getau" :src="params.getau"></audio>


        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Uploader,ImagePreview } from 'vant';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'kefuindex',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Uploader.name] : Uploader,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'kefu',
                        op : 'list',
                        type : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                moreing : '',
                goods : {},
                jizi : {},
                info : {},
                msg : '',
                timer : false,
                issend : false,
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
        beforeRouteLeave(to, from, next){
            clearInterval(this.timer);
            next();
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            sendCommodityCard(e){
                var type = e.currentTarget.dataset.type;
                this.sendMsg(type);
            },
            imageShowOrHideFun(e){
                ImagePreview([
                  e.currentTarget.dataset.img
                ]);
            },
            uploada(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.img = res.attachment;
                    self.sendMsg(1);
                })
            },
            sendMsg(type){
                var self = this;
                var type = type ? type : 0;
                if( !self.msg && type == 0 ) {
                    self.$toast('请填写发送的内容');
                    return false;
                }
                var postdata = {
                    op:'submess',
                    content : self.msg ? self.msg : '',
                    img : self.img ? self.img : '',
                    shopid : self.page.pdata.shopid,
                    uid : self.page.pdata.uid,
                    gid : self.page.pdata.gid,
                    jid : self.page.pdata.jid,
                    role : self.page.pdata.role,
                    type : type,
                };

                self.issend = true;

                self.$util.http('kefu','GET',postdata,function(res){    
                    if (res.data && !res.errno) {

                        self.datalist = self.datalist.concat(res.data.new);
                        self.msg = '';
                        self.img = '';
                        if( type == 2 ){
                            self.goods = null;
                        }

                        let chat = document.getElementById('chat');
                        chat.scrollTop = 3333;
                    }else{
                        self.$toast(res.message);
                    }
                    self.issend = false;
                },true);
            },
            sendMsgBtnFun(){
                this.sendMsg(0);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                
                self.page.pdata.shopid = query.shopid ? query.shopid : 0;
                self.page.pdata.uid = query.uid ? query.uid : 0;
                self.page.pdata.gid = query.gid ? query.gid : 0;
                self.page.pdata.jid = query.jid ? query.jid : 0; // 集字
                self.page.pdata.role = query.role ? query.role : '';
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                       self.datalist = res.data.list;
                       self.params = res.data.params;
                       self.info = res.data.info;
                       self.goods = res.data.goods ? res.data.goods : null;
                       self.jizi = res.data.jizi ? res.data.jizi : null;
		                
                        window.document.title = self.info.title;
                        
                        self.getNewMess();

                        setTimeout(function(){
                            let chat = document.getElementById('chat');
                            chat.scrollTop = 9999;
                        },500)

                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
	                	self.inited = 2;
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
            getNewMess(){
                var self = this;
                clearInterval(this.timer);
                self.timer = setInterval(function(){
                    var postdata = {
                        op:'newmess',
                        shopid : self.page.pdata.shopid,
                        uid : self.page.pdata.uid,
                        role : self.page.pdata.role,
                    };
                    var length = self.datalist.length;
                    var maxid = 0;
                    for (var i = 0; i < self.datalist.length; i++) {               
                        if( self.datalist[i].id*1 > maxid*1 ){
                            maxid = self.datalist[i].id;
                        }
                    }
                    postdata.maxid = maxid;

                    if( self.isnew || self.issend ) return false;
                    self.isnew = true;

                    self.$util.http('kefu','GET',postdata,function(res){    
                        if (res.data && !res.errno) {
                            var isin = 0;
                            for (var i = 0; i < res.data.new.length; i++) {
                                var item = res.data.new[i];
                                for (var j = 0; j < self.datalist.length; j++) {
                                    if( self.datalist[j].id == item.id ){
                                        res.data.new.splice(i,1);
                                    }
                                }
                            }
 
                            self.datalist = self.datalist.concat(res.data.new);

                            let chat = document.getElementById('chat');
                            chat.scrollTop = 9999;

                            document.getElementById('getau').play();
                        }
                        self.isnew = false;
                    });
                },3000)
            },
	  		handleHistoryMsg() {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){

                            for (var i = 0; i < res.data.list.length; i++) {
                                self.datalist.unshift(res.data.list[i])
                            }
	                		
	                	}else{
	                		self.datalist = res.data.list;
	                	}
                        self.$toast('加载完成');
	                }
	            },true);
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>

::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
#chat{
    height: calc(100vh - 10px);
    overflow-y: auto;
    background: #f2f2f2;
    -webkit-overflow-scrolling: touch;
}
#content {
    min-height: 100vh;
}
.chatBox {
    display: flex;
    height: 100%;
    flex-flow: column;
    overflow: hidden;
}

.video-content {
    height: 100%;
    width: 100%;
}

#chatContainer {
    box-sizing: border-box;
    flex: 1;
    overflow-y: scroll;
    background: #f2f2f2;
}

.historyTip {
    text-align: center;
    font-size: 15px;
    color: #ff5500;
    padding-top: 10px;
}

.mb30 {
    margin-bottom: 15px!important;
}

.rotate {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA3ZJREFUaAXtmE9IFFEcx39vplVpI/8h6q5F4Gag3fYSdLFTBYKIKEVRYH/oJHQOko559NQfoogiUCSEoLwJXbosRJCQu0aYmmJqC22sbuvr9xbfMmNv3ryZedulGRh25837/X7fz3dnfm9mAcItdCB0IHQgdOB/doC4wdMpaIaDkE1cbT9FKb2C8z8YhnE3k8lsucWqnqcUDJiC+PFbXbl8Pj+CcU1YYzSdTr93y2HIJtAJ6IEt+Lo4F1lG0imc24/7HQR5mUgkqmWxqufoOCRgAuY2Ns2F/UbuI+Yexv18sVh8k0wmI255pABA4QQmiCxu7KvfobScDAuc1QFREg8ws5Ez2y8+jMF6zmixCG7OZrN1lmPhVzmACfcwail5JA+dsW1bgqAQFvFxJv7TStmfUh1CyDhepmu2ooIDKQDph0WM6Y6YdOnJ0DfoaC7YUviFUBD/GgEu2Yo5HLjexCyOF1z/aZbcmlv9yy1WsE/lxua58LJxcl45F9OmBKALQrd4TwBBISoh3jOAX4hKifcF4BWikuKZFmkXYhNEGxmEDI53Nx4oLj27tuzYndJjVZ04j/V5LTesUItoUHWMu+vUnU4m8vnRgdWaocfCPu+p2zhpUu5CTgncIKLVFHJb9jLYcrWIZ5rsmZ1Uuoy7QVjDdYpnebUAsES7EG/xcmo5dz8Gn9fsi12pGCHTCNCrsuCx+Sqbr5tYlpigJdpckRXaPacFgF9C2G1a2IPZvMB9Vg+fnU7reIq1cgUGsIgXtkp2E1s3vw+A1hzW74EA3MSzNjp9c8FxndDxUuQbwE086za3e74nW+vki11QCF8AKuIRoO/o8PYs/tyuK3YQCM8NQ1W8tVXyGKcVO8ja4AmAC2HPNhcexMDLiw2P1Q2hDMAF+BHPuwbPoRNCCYAXDiK+UhCuADrF74XQYYi0C9FJaMOiM4UiiV9+1OrpmudiRZ/8faIhKm2xT0Wxe8ekAFCEGxgQT32pgdnlKltskM7BEnEI9lL0/LrwpWgQ22uTrajgQA5A4B3GFNoafm8ahJT/FAoqnuvgEPhLzDOIxujOCj+Hn6u1tbU/LMfCr1IAMgCvoBoOtXUUYvhE04sZJnEfYYuUtc8LMysO7kIca6gvHv61E+3C3GO4vzBN80wqlSqbppgunBY6EDoQOhA6EDoQOvBPHfgD40d0nn7jwIEAAAAASUVORK5CYII=)!important;
    background-size: 100%!important;
}

.bottom-area {
    background: #fff;
}

.chat-field-tool {
    display: flex;
    flex-direction: row;
    align-items: center;
    bottom: 0;
    left: 0;
    width: 100%;
    background:#fff;
    position: fixed;
}

.chat-field-tool .chat-field-area {
    width: 230px;
    height: 19px;
    margin: 8.5px 0 8.5px 12px;
    background: #F2F2F2;
    border-radius: 36px;
    font-size: 16px;
    padding: 7.5px 15px;
    border:0;
}

.chat-field-tool .chat-icons {
    display: flex;
    flex-direction: row;
    margin: 0 0 0 12px;
    align-items: center;
}

.chat-field-tool .chat-icons .emoji-icon, .chat-field-tool .chat-icons .toolbar-icon,.chat-field-tool .chat-icons .emoji-keyboard {
    width: 24px;
    height: 24px;
}

.chat-field-tool .chat-icons .emoji-keyboard {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAVZJREFUaAXtWbENwjAQxIEJCA0SZVKzQnagY5AMwRzABAzACtSkpHaBqBP+ESFOyLtAwjxwlizefj++OxxziMEADQpAASjwSQWMb/MkSWZVVa2oZ7zOGLOnnhdFcdJSJxJg8GVZHgjouAPWRlE0l0iEros64B5DVr4HPOfH99xjrRuErvMRyFxgblwfKXeujkPnRAI1IO2vIgF+YCXwmnI+AjkRsD0kLN9EPfO3qXsuWN1QAmKtPcdxvKX8lPqE+oXA7egGWkg3EL9X6DreEw0KQAEo8DkFRDPHkOBG2x/MW1ys+E0c2lW+up+PQNYWsBmFdpy+/UQCDVzdkUhAk+P0YfERgBulw/d2F6v7gAMdFIACUAAKQIFfV+DpFxlZV5Om6ZKIp8rIH6ltydhVLq6RO+CYwdP/AuvuvIYxYWMYGxeL6EbdRZrjrz9CmsUFNigABf5BgSs2oD9JCYbDxwAAAABJRU5ErkJggg==);
    background-size: 100%;
}

.chat-field-tool .chat-icons .emoji-icon {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABbFJREFUaAXtmX9InVUYx/Vep23lFElSg6FBEGbbH9dijSBRg4yiPwIHbSuT8Od1EnML5hZSYq3JwsTrVUZFOAgpCsaswFsGMUa3G2W0aH+0IU2tluRslLupfR59z93xve/94Z3Xf3pfOPc853me831+nF/ve25Kiv3YGfh/ZyA1WviNjY1Vi4uLm71e74epqalL0XRvRlZXV5cFfsXS0lKR4EBfhPYNDg7OxsKNGEBDQ8MenB8yAPwOh8NNIF/FAlyLHMdvR7+TUkvZZOobpP0W5QiBXDHJQk1HiDIROK9n/H7a5+rr60+2tLTkmlQTaoJVTMcApZ5idl4whSeygKErvLAn4giIJh2PMJTtkLdoPf9kNI6Wl5f3V1dXL2j8uEkj8+L8Nq3TOFPnnLSxuZNquyabgHZZjUTUAATA7XYXBYPBNwB9UgOUefodPDegX+r8eGgC8KIn2RWcq5Qmpucpva9MYfA9lK0GfwBbDbqO0DEDUB0YjUeh3wTwbsWTGuOn4B0EfErnR6JlwSL7nbI8bRjNvWbnVV/TOpQ1kYudVQs74hpQIKoeGBj4JD8/vwSHD8O7pvg4vwf6J4y9oHjRahyuRL7sPPV4JOcFw5CNC82zCdsVK+SN37gDkC4dHR3XCeTVjIyMewAbvgGTkskiP0EQNRrPkkSvUAnAWJ7zqm1V6zokq8iss6YAtM7zgP1FW9+pRKwyq6kml1xTAMPDw06y7J6fn7+AW7WU5TVElv6mHO3v7z8Zy12m0CWlQxJkt4n66DrYuGhWjjsAFt9DPp8vwBToBSRbA/oI4GKmVie1eUQ0tRWS/qNQsiDl2S4LdYUM/zVkajsNEozPrBVzF2pqaspbWFg4Tue9ps4XyOZ+FtqnJn7M5oZtoxjaT1ZfwXm1F4tzsgN1FhQUnJBFHdNbCwU5zZmGXyNK3kHG8D3FcL+v2yeY4fT09AO9vb2/6PxE6Obm5ns5IEdMQVhBTWC3iil63koYbQ3IgbP8AHCe6VIByO71cF5A+/r6fqByUQYoak1Ahh7hicwVyXnRjLoGOH134/zmvLy8IabLv9IhGY+czthJ6HU6Gf7YmHYG7AzYGbAzYGdgwzIQdhJz4jqmpqZe4wXOwQvb4URf2NYrAk7pLWB5Oalvy8zM3Nfd3R36nBUbaWZD09PTNTh/UPiTk5PSucmss5FtHJcbkX2UlLm5OTe2j+n2w17meAPVv3rqeB/aoXfYSJqrTfmYeV7ZJBi/olUdFgDXFp+jKK+58jiJ3MM0ChupFXHyfsUmyfRiX/l4ho+nz8wWlXAVPy0tTa5I1CvuLtbE8VUKG9AQmzj/oGEq6HQ6D1iZdVox/X7/Hy6X6x9kjxjynbQvBwKBb6z015vHwpVp06Xhvsg3wWmtHSItAxApzp4tLS0tgSw2tJ8giN/gy6dg0h6cbwRcrh7VDvkB0zripVnUuZ2VlVU7OztbyFCWGoAeFnUR7XZA1RRbl2BwXG7eusBu0wD92dnZz2ntMFJFGSZQDD7At/IB/jHtXYpH7WedPOvxeH7UeAmTJEVG+W2cf0ADOcsNYBWfsFc1XhgZMwDp0dbWdit78HsYeFxDWCBj78B7mdGY0Phxk2R9GxgvgVFDp9B0hneaRfs0CZLbv6hPXAEoBDLVCn0MgxmKRy3/Efj46H+XjI329PT8qsnCyNbW1jsY0Uq2yGdwtBIsfSe8Du8QC7YnrGMExpoCEAyuW0ow/jpklRUmDlzCqW+RXaHMGDo58HOhdyArNHirKuQjTMtDxm3FKlm0xpoDUGCckg8TSDttuU3Qs6hUYtY4vUjfUaZLF/eqX8TsYKGQcAAKixG5Eyfk2vExatmttihZhPoajsvfSyPUQ5yulyPoxcW+6QB0K3J7PTY2dh93qXcRTA7rIkfkjNQMzs6Q6Z/Lysq+T/S/Nd2WTdsZsDOwkoH/AKJbS1KK7QisAAAAAElFTkSuQmCC);
    background-size: 100%;
}

.chat-field-tool .chat-icons .toolbar-icon {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAcBJREFUeAHtmkFOhEAQRUfiLdxN0K1X0OvoxqPMxrmOXsGtEnZeY2J3wiSkQ/MSaaHHvEnI0PWhunj8hkWx2/mTgAQkIAEJSKAAgf1+fxu3AqmKpWiKZVqYKIB5DSk+4zbsL8xY5vSrMmmWZRlcE+GMf3d933+NA1vsV+Ggpmlu0oufiqXHrDGuAtAaF/rbOQQE5AQkICAAsg4SEBAAWQcJCAiArIMEBARA1kECAgIg6yABAQGQdZCAgADIOkhAQABkHSQgIACyDhIQEABZBwGga9B3san31z2q0+l0n9YRY23bpuGi4zDHNzUnZzurQwv4qWhV9SU7BkjPubKygDLt4FyeS49n29w+g+DWZgENa/MI5/8HOS6x7EcS2SV2vvIVH9KH85zD/0t4OXwksaLDxQ/potXMJAtvq4dQ7Nv4kADnseu693Fsi/3sEtuimBrnFBDcFQEJCAiArIMEBARA1kECAgIg6yABAQGQdZCAgADIOkhAQABkHSQgIACyDhIQEABZBwkICICsgwQEBEDWQZcAKDbw0jqnYukxa4yrcNBEm3u2HbwGmCrniG3u4auSKuuzKAlIQAISkMBlEfgB4wdRMvsorroAAAAASUVORK5CYII=);
    background-size: 100%;
    margin-left: 8px;
}

.chat-field-tool .chat-icons .btn-send {
    color: #fff;
    border-radius: 13px;
    margin-left: 7.5px;
    padding: 9px 7.5px;
    font-size: 14px;
    background: #f60;
    text-align: center;
    line-height: 11px;
    background: linear-gradient(to right,#ff8f00,#ff5500);
}

.chat-field-tool-panel .toolbar-panel {
    width: 100%;
    background: #fff;
    height: 216px;
}

.show {
    display: block;
}

.hide {
    display: none;
}

.window {
    width: 100%;
    height: 100%;
    position: absolute;
}

.window-2 {
    display: flex;
    flex-direction: row;
}

.camera {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9999;
}

.video-close {
    margin: 5px;
    width: 16px;
    height: 16px;
}

.cover-1 {
    width: 75px;
    height: 75px;
    border-radius: 75px;
    background-color: #dedcdc;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 30px;
    left: 150px;
}

.cover-3 {
    position: absolute;
    bottom: 52.5px;
    left: 67.5px;
}

.cover-9 {
    width: 364px;
    height: 80%;
    margin: 0 5px;
    border: 1px solid;
    border-radius: 5px;
}

button {
    margin: 0 5px;
    width: 100%;
}

.cover-4 {
    position: absolute;
    top: 30px;
    right: 20px;
}

.cover-2 {
    width: 55px;
    height: 55px;
    border-radius: 55px;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #da2121;
    font-size: 16px;
}

.order_box {
    overflow: hidden;
    padding-top: 18px;
}

.order_box .order_content {
    position: relative;
    width: 255px;
    height: 90px;
    box-sizing: border-box;
    padding: 6.5px 9px 11.5px;
    color: #fff;
    background-color: #fff;
    border: 3px solid #ff8f00;
}

.order_box .order_content .order .img_box {
    float: left;
    position: relative;
    margin-right: 14px;
    border-radius: 14px;
    width: 72px;
    height: 72px;
    overflow: hidden;
    background-color: #fff;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUVBMjlFNEFEOTQxMTFFNkI2QzU5QTUyQjlFQTZGMzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUVBMjlFNDlEOTQxMTFFNkI2QzU5QTUyQjlFQTZGMzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IkJBNTNFMjNGMkU4NTYwM0ZDMzg3NTc5MkM2NEUxRTkzIiBzdFJlZjpkb2N1bWVudElEPSJCQTUzRTIzRjJFODU2MDNGQzM4NzU3OTJDNjRFMUU5MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgGIkbcAAANpSURBVHja7NnZThtBEIVhvLCZVawCifd/It4BgTA7BDB2vvgoLcsmxCPIBVH3xaiX6qq/qqtrBtN6fX1d+G6tvfANW4Wu0BW6QlfoCl2hK3SFrtAVukJX6Ar9raG78wi1Wq12+5d7b29v765OzYxGo6n52RltOBxGrdUsRexT0GH1pP3q6mp5eXltbS2qJ+lvbm4eHx+JLS4uDgYDSyR3dnaenp7u7+/tNbO0tERgc3OTPFWhpNyS5/7+/u3tLWEbe70egW63u7GxsbKy8j7Yn36soZTql5cXSjEh6HQ66+vr1JnxRBN/Hh4ehr9bd9yi4fr6GoEhPZ6UsIVeB43JzrgZUkvJ6uoqK5ag/xi3o6OjZpFGxvu7uzvxA0dj4TPc29srZ808Y4BswSRC+kLYGzdiPCcWPQTQYCVgo5NJgLTn5+c8mYifjdMjx2cnY8m/GM5xx0zJVGImt7a28J2fn9sIF5CDjjZ9e4kJpEAQ07eRe5zkidxIFGZvyLzQIgGOap0EI8mXMGMVD7EvYQ43UDMJleHu7q6huGK6uLiQ5RSWQJY7Jz0+COq8JS9Y/X6fjZymjnzAJD1y4YQQKzcG4xY/c73yRGYmxSG+ZSa5i9KdNnlwcJDouKMx5yiSTo0jXWzYD1GQPA2dplBRXcqfeUPzUJw7TwxN5jREkYy7ERqrgUuDnsCTz0YBcj65/R/8nPt+9Uh6XF5esq0e4Ts9PaXu5OQEGYjt7e1kba5UTFoytBSfzafkYZLumUz+JJv5mTKnpYbQQC1iCkkmAxuUPGGQA1adYEnN5MPZ2ZliVK58KQ7JEAIhNkzl1glo7nSW2uOWSDsEaZNLTz4vh5SBZtUjqYlVuRUJxIko7bmRk/WYMVGxJKLOIW+NnFhJNp3kK7XIjo+PnaSh0OrEVjKwvCYPDw+bQTPjruTV4J2XA2Eg1yhZwZKOmZSF0URLJUllMOQMJj7nCkoDQ+gpgsQUvhR7w0SawmY5HUdtTqjwCYZ4u0apD+U1Hpd4iNIk83woGylP3c05pDTlnQ/OpL2EZbNOiiZPkngp4c2gp+5lCf/sN83kW2ZqdXImn0eSx7HE/1IiZ4X/8gE35z+KGn2F/SMNzT5Nv8TYl+DWv1wqdIWu0BW6QlfoCl2hK3SFrtAVukL/B9A/BRgAsAwakWkLRMwAAAAASUVORK5CYII=);
    background-size: 72px;
    font-size: 12px;
    color: #ddd;
}

.order_box .order_content .order .img_box .order_img {
    width: 100%;
    height: 100%;
}

.order_box .order_content .order .img_box .order_img img {
    width: 17px;
    height: 17px;
    vertical-align: middle;
}

.order_box .order_content .order .img_box .order_quantity {
    width: 72px;
    height: 18px;
    line-height: 18px;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    opacity: 0.6;
    background: #000000;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
    border-radius: 0 0 14px 14px;
}

.order_box .order_content .order .order_textA {
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
    line-height: 18px;
}

.order_box .order_content .order .order_textB {
    width: 85.5px;
    height: 72px;
    float: left;
    margin-left: 11px;
    font-family: ArialMT;
    font-size: 12px;
    color: #222222;
    letter-spacing: 0;
    text-align: justify;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
}

.order_box .order_content .order .order_textB .act {
    color: #ff5500;
}

.order_box .order_content .order .order_textB .dow {
    position: absolute;
    background-color: #fff;
    bottom: 0;
    left: 0;
    width: 100%;
}

.box {
    position: relative;
    padding-top: 18px;
    font-family: PingFangSC-Regular;
    width: 100%;
    overflow: hidden;
}

.box .message_box {
    position: relative;
    margin-right: 12px;
    max-width: 238px;
    box-sizing: border-box;
    padding: 15px 10px;
    color: #fff;
}

.box .message_box .message {
    font-size: 16px;
    letter-spacing: 0;
    line-height: 23px;
    word-break: break-all;
}

.box .message_box navigator {
    text-decoration: underline;
    display: inline-block;
}

.greet {
    position: relative;
    padding-top: 18px;
    font-family: PingFangSC-Regular;
    width: 100%;
    overflow: hidden;
}

.greet .message_box {
    position: relative;
    margin-right: 12px;
    max-width: 238px;
    box-sizing: border-box;
    padding: 15px 10px;
    color: #fff;
}

.greet .message_box .message {
    font-size: 16px;
    letter-spacing: 0;
    line-height: 23px;
    word-break: break-all;
}

.greet .message_box .navigator {
    text-decoration: underline;
}

.service>.content {
    float: left;
    border-radius: 6px 21px 21px 21px;
}

.service>.content .king,.service>.content .messageStatus,.service>.content .Refresh {
    display: none;
}

.service .head_img {
    width: 36px;
    height: 36px;
    margin: 0 12px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
}

.service .head_img img {
    width: 100%;
    height: 100%;
}

.service>.message {
    float: left;
}

.service>.message .message_box,.service>.message .loadingBox {
    border-radius: 6px 21px 21px 21px;
    border: 3px solid #fff;
}

.service>.message .king,.service>.message .messageStatus,.service>.message .Refresh {
    display: none;
}

.service>.message_box {
    float: left;
    background: #ffffff;
    border-radius: 6px 21px 21px 21px;
}

.service>.message_box .king,.service>.message_box .messageStatus,.service>.message_box .Refresh {
    display: none;
}

.service>.message_box .message {
    color: #222222;
}

.service>.message_box .underline {
    font-size: 16px;
    word-break: break-all;
    display: inline-block;
    outline: none;
    text-decoration: underline;
}

.service>.file_box {
    color: #222222;
    float: left;
    background: #ffffff;
    border-radius: 6px 21px 21px 21px;
}

.service>.file_box .king,.service>.file_box .messageStatus,.service>.file_box .Refresh {
    display: none;
}

.service>.order_content {
    float: left;
    border-radius: 6px 21px 21px 21px;
}

.service>.order_content .king,.service>.order_content .messageStatus,.service>.order_content .Refresh {
    display: none;
}

.user .head_img {
    display: none;
}

.user>.content {
    float: right;
    margin-right: 12px;
    border-radius: 21px 6px 21px 21px;
}

.user>.content .king {
    width: 17.5px;
    height: 17.5px;
    position: absolute;
    top: -10.5px;
    left: -10.5px;
    transform: rotateZ(-43deg);
}

.user>.content .messageStatus {
    position: absolute;
    left: -32px;
    top: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 14px;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
}

.user>.content .Refresh {
    width: 20px;
    height: 20px;
    position: absolute;
    left: -32px;
    top: 50%;
    transform: translateX(-50%);
}

.user>.content .Refresh img {
    width: 100%;
    height: 100%;
}

.user>.message {
    margin-right: 12px;
    float: right;
    color: #ffffff;
}

.user>.message .message_box,.user>.message .loadingBox {
    border-radius: 21px 6px 21px 21px;
    border: 3px solid #ff5500;
}

.user>.message .king {
    width: 17.5px;
    height: 17.5px;
    position: absolute;
    top: -8.5px;
    left: -7.5px;
    transform: rotateZ(-43deg);
}

.user>.message .messageStatus {
    position: absolute;
    left: -32px;
    top: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 14px;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
}

.user>.message .Refresh {
    width: 20px;
    height: 20px;
    position: absolute;
    left: -32px;
    top: 50%;
    transform: translateX(-50%);
}

.user>.message .Refresh img {
    width: 100%;
    height: 100%;
}

.user>.message_box {
    float: right;
    background-image: linear-gradient(-270deg,#ff8f00 3%,#ff5500 100%);
    border-radius: 21px 6px 21px 21px;
}

.user>.message_box .king {
    width: 17.5px;
    height: 17.5px;
    position: absolute;
    top: -8.5px;
    left: -7.5px;
    transform: rotateZ(-43deg);
}

.user>.message_box .messageStatus {
    position: absolute;
    left: -32px;
    bottom: 0px;
    width: 20px;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
}

.user>.message_box .Refresh {
    width: 20px;
    height: 20px;
    position: absolute;
    left: -32px;
    bottom: 0;
}

.user>.message_box .Refresh img {
    width: 100%;
    height: 100%;
}

.user>.message_box .message {
    color: #ffffff;
}

.user>.message_box .underline {
    font-size: 16px;
    word-break: break-all;
    display: inline-block;
    outline: none;
    text-decoration: underline;
}

.user>.file_box {
    color: #fff;
    margin-right: 12px;
    float: right;
    background-image: linear-gradient(-270deg,#ff8f00 3%,#ff5500 100%);
    border-radius: 21px 6px 21px 21px;
}

.user>.file_box .king {
    width: 17.5px;
    height: 17.5px;
    position: absolute;
    top: -8.5px;
    left: -7.5px;
    transform: rotateZ(-43deg);
}

.user>.file_box .messageStatus {
    position: absolute;
    left: -32px;
    bottom: 0px;
    width: 20px;
    height: 14px;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
}

.user>.file_box .Refresh {
    width: 20px;
    height: 20px;
    position: absolute;
    left: -32px;
    bottom: 0;
}

.user>.file_box .Refresh img {
    width: 100%;
    height: 100%;
}

.user>.order_content {
    float: right;
    margin-right: 12px;
    border-radius: 21px 6px 21px 21px;
}

.user>.order_content .head_img {
    display: none;
}

.user>.order_content .king {
    width: 17.5px;
    height: 17.5px;
    position: absolute;
    top: -8.5px;
    left: -7.5px;
    transform: rotateZ(-43deg);
}

.user>.order_content .messageStatus {
    position: absolute;
    left: -32px;
    bottom: 0px;
    width: 20px;
    height: 14px;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    text-align: justify;
}

.user>.order_content .Refresh {
    width: 20px;
    height: 20px;
    position: absolute;
    left: -32px;
    bottom: 0;
}

.user>.order_content .Refresh img {
    width: 100%;
    height: 100%;
}

.message_file {
    padding-top: 18px;
    position: relative;
    width: 100%;
    overflow: hidden;
}

.message_file .file_box {
    height: 71px;
    position: relative;
    box-sizing: border-box;
    padding: 15px 10px;
}

.message_file .file_box .left {
    float: left;
    width: 42px;
    height: 42px;
}

.message_file .file_box .left img {
    width: 100%;
    height: 100%;
}

.message_file .file_box .right {
    float: left;
    margin-left: 11px;
    color: black;
}

.message_file .file_box .right .top {
    margin-bottom: 5px;
    overflow: hidden;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
}

.message_file .file_box .right .size {
    float: left;
    font-size: 12px;
}

.message_file .file_box .right .download {
    float: right;
    font-size: 12px;
    color: #666;
}

.message_file .file_box .right .no {
    color: red;
}

.message_file .file_box .right .fileStatus {
    color: #ff5500;
    font-size: 12px;
    text-align: center;
    margin-bottom: 10px;
}

.message_file .file_box .right .ProgressBox {
    position: relative;
    width: 200px;
    height: 5px;
}

.message_file .file_box .right .ProgressBox .down {
    width: 100%;
    height: 100%;
    background-color: #cccccc;
}

.message_file .file_box .right .ProgressBox .up {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: green;
}

.box_img {
    padding-top: 18px;
    position: relative;
    width: 100%;
    overflow: hidden;
}

.box_img .message {
    position: relative;
    width: 100px;
}

.box_img .message .play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 36px;
    height: 36px;
    z-index: 100;
}

.box_img .message .play img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
}

.box_img .message .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 16px;
    height: 16px;
    z-index: 100;
}

.box_img .message .loading img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
}

.box_img .message .warning {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    z-index: 100;
}

.box_img .message .warning img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
}

.box_img .message .loadingBox {
    position: relative;
    width: 100px;
    height: 100px;
    background-color: #000;
}

.box_img .message .message_box {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background-color: black;
}

.box_img .message .message_box>img {
    width: 100px;
    height: 100px;
    vertical-align: bottom;
}

.message_tips {
    margin: 30px auto;
    width: 277.5px;
    height: 31px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #999999;
    text-align: center;
}

.message_tips text {
    font-size: 12px;
}

.message_tips .out {
    color: #ff5500;
}

.shadowBox {
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
}

.shadowBox .alent_box {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: #000;
}

.shadowBox .alent {
    position: absolute;
    z-index: 200;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 270px;
    height: 127.5px;
    background: #ffffff;
    border-radius: 8px;
}

.shadowBox .alent .alent_txt {
    height: 84.5px;
    width: 100%;
    box-sizing: border-box;
    padding: 22.5px 15px 24px;
}

.shadowBox .alent .alent_txt text {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
    line-height: 19px;
    display: inline-block;
    width: 240px;
    height: 38px;
}

.shadowBox .alent .alent_btn {
    height: 42px;
    border-top: 1px solid rgba(0,0,0,0.1);
    display: flex;
}

.shadowBox .alent .alent_btn .left,.shadowBox .alent .alent_btn .right {
    height: 100%;
    border-right: 0.5px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #999999;
    letter-spacing: 0;
    text-align: center;
    line-height: 15px;
    flex: 1;
}

.shadowBox .alent .alent_btn .right {
    border-right: 0;
    border-left: 0.5px solid rgba(0,0,0,0.1);
    color: #ff5500;
}

.commodity_card {
    font-family: PingFangSC-Regular;
    border-radius: 12px 10px 10px;
    width: 351px;
    height: 90px;
    margin: 12px auto;
    box-sizing: border-box;
    padding: 10px 12px 7.5px 10px;
    background-color: #fff;
}

.commodity_card .img {
    float: left;
    width: 70px;
    height: 70px;
    margin-right: 10px;
    border-radius: 8px;
    overflow: hidden;
    background-size: 70px 70px;
}

.commodity_card .img img {
    width: 100%;
    height: 100%;
}

.commodity_card .info {
    float: left;
    width: 249px;
    height: 100%;
    position: relative;
}

.commodity_card .info .info_top {
    font-size: 14px;
    color: #222222;
    letter-spacing: 0;
    text-align: justify;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 40px;
}

.commodity_card .info .info_btm {
    width: 100%;
    position: absolute;
    bottom: 0;
}

.commodity_card .info .info_btm .left {
    float: left;
    font-size: 12px;
    color: #ff5500;
    letter-spacing: 0;
    text-align: justify;
    min-width: 67.5px;
    height: 22.5px;
    line-height: 22.5px;
}

.commodity_card .info .info_btm .left .num {
    font-size: 16px;
    color: #ff5500;
    letter-spacing: 0;
    text-align: justify;
    line-height: 16.5px;
}

.commodity_card .info .info_btm .right {
    float: right;
    width: 96px;
    height: 25px;
    line-height: 25px;
    background-image: linear-gradient(-90deg,#ff8f00 0%,#ff5500 97%);
    border-radius: 12.5px;
    color: #ffffff;
    text-align: center;
    font-size: 12px;
}

.message_commodity {
    overflow: hidden;
    font-family: PingFangSC-Regular;
    padding-top: 18px;
}

.message_commodity .content {
    width: 249px;
    background: #fff;
    border: 3px solid #ff5500;
    padding: 9px;
    box-sizing: border-box;
    position: relative;
}

.message_commodity .content .top {
    width: 100%;
    overflow: hidden;
}

.message_commodity .content .top .img_box {
    float: left;
    width: 72px;
    height: 72px;
    border-radius: 8px;
    overflow: hidden;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUVBMjlFNEFEOTQxMTFFNkI2QzU5QTUyQjlFQTZGMzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUVBMjlFNDlEOTQxMTFFNkI2QzU5QTUyQjlFQTZGMzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IkJBNTNFMjNGMkU4NTYwM0ZDMzg3NTc5MkM2NEUxRTkzIiBzdFJlZjpkb2N1bWVudElEPSJCQTUzRTIzRjJFODU2MDNGQzM4NzU3OTJDNjRFMUU5MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgGIkbcAAANpSURBVHja7NnZThtBEIVhvLCZVawCifd/It4BgTA7BDB2vvgoLcsmxCPIBVH3xaiX6qq/qqtrBtN6fX1d+G6tvfANW4Wu0BW6QlfoCl2hK3SFrtAVukJX6Ar9raG78wi1Wq12+5d7b29v765OzYxGo6n52RltOBxGrdUsRexT0GH1pP3q6mp5eXltbS2qJ+lvbm4eHx+JLS4uDgYDSyR3dnaenp7u7+/tNbO0tERgc3OTPFWhpNyS5/7+/u3tLWEbe70egW63u7GxsbKy8j7Yn36soZTql5cXSjEh6HQ66+vr1JnxRBN/Hh4ehr9bd9yi4fr6GoEhPZ6UsIVeB43JzrgZUkvJ6uoqK5ag/xi3o6OjZpFGxvu7uzvxA0dj4TPc29srZ808Y4BswSRC+kLYGzdiPCcWPQTQYCVgo5NJgLTn5+c8mYifjdMjx2cnY8m/GM5xx0zJVGImt7a28J2fn9sIF5CDjjZ9e4kJpEAQ07eRe5zkidxIFGZvyLzQIgGOap0EI8mXMGMVD7EvYQ43UDMJleHu7q6huGK6uLiQ5RSWQJY7Jz0+COq8JS9Y/X6fjZymjnzAJD1y4YQQKzcG4xY/c73yRGYmxSG+ZSa5i9KdNnlwcJDouKMx5yiSTo0jXWzYD1GQPA2dplBRXcqfeUPzUJw7TwxN5jREkYy7ERqrgUuDnsCTz0YBcj65/R/8nPt+9Uh6XF5esq0e4Ts9PaXu5OQEGYjt7e1kba5UTFoytBSfzafkYZLumUz+JJv5mTKnpYbQQC1iCkkmAxuUPGGQA1adYEnN5MPZ2ZliVK58KQ7JEAIhNkzl1glo7nSW2uOWSDsEaZNLTz4vh5SBZtUjqYlVuRUJxIko7bmRk/WYMVGxJKLOIW+NnFhJNp3kK7XIjo+PnaSh0OrEVjKwvCYPDw+bQTPjruTV4J2XA2Eg1yhZwZKOmZSF0URLJUllMOQMJj7nCkoDQ+gpgsQUvhR7w0SawmY5HUdtTqjwCYZ4u0apD+U1Hpd4iNIk83woGylP3c05pDTlnQ/OpL2EZbNOiiZPkngp4c2gp+5lCf/sN83kW2ZqdXImn0eSx7HE/1IiZ4X/8gE35z+KGn2F/SMNzT5Nv8TYl+DWv1wqdIWu0BW6QlfoCl2hK3SFrtAVukL/B9A/BRgAsAwakWkLRMwAAAAASUVORK5CYII=) no-repeat;
    background-size: 72px;
}

.message_commodity .content .top .img_box img {
    width: 100%;
    height: 100%;
}

.message_commodity .content .top .info {
    float: left;
    width: 143px;
    height: 72px;
    padding-left: 9px;
}

.message_commodity .content .top .info .title {
    font-size: 13.5px;
    color: #999999;
    letter-spacing: 0;
    line-height: 19px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 36px;
}

.message_commodity .content .top .info .status {
    font-size: 14px;
    color: #ff4400;
    letter-spacing: 0;
    text-align: justify;
    height: 20px;
}

.message_commodity .content .foot {
    margin-top: 5px;
    width: 228px;
    font-size: 12px;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.vip {
    overflow: hidden;
    font-family: PingFangSC-Regular;
    padding-top: 18px;
}

.vip .head_img {
    width: 36px;
    height: 36px;
    margin: 0 12px;
    float: left;
    border-radius: 50%;
    overflow: hidden;
}

.vip .head_img image {
    width: 100%;
    height: 100%;
}

.vip .link {
    overflow: hidden;
}

.vip .content {
    float: left;
    width: 255px;
    height: 179.5px;
    background: #fcfafa;
    border-radius: 6px 21px 21px 21px;
    box-sizing: border-box;
    padding: 15px 12px 0;
}

.vip .content .nav {
    width: 231px;
    height: 123px;
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
}

.vip .content .nav img {
    width: 100%;
    height: 100%;
}

.vip .content .button {
    border: 0.5px solid rgba(0,0,0,0.1);
    border-radius: 48px;
    width: 78px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    margin: 9px auto 0;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
}

.appraise_box {
    width: 348.5px;
    background-color: #fff;
    margin: 18px auto 0;
    border-radius: 10px;
    text-align: center;
    overflow: hidden;
}

.appraise_box .active {
    background-image: linear-gradient(-90deg,#ff8f00 0%,#ff5500 97%);
    color: #fff;
    border: 0.5px solid #fff!important;
}

.appraise_box .appraise_tex {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #222222;
    text-align: center;
    margin-top: 25px;
    display: inline-block;
}

.appraise_box .logo_img {
    width: 100%;
    margin: 22px auto 22px;
}

.appraise_box .logo_img .img_box {
    width: 71.3px;
    height: 71.3px;
    background-color: #fff;
    display: inline-block;
    margin: 0 15.1px;
}

.appraise_box .logo_img .img_box img {
    width: 100%;
    height: 100%;
}

.appraise_box .logo_img .feedback {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ff5500;
    letter-spacing: 0;
    text-align: center;
    display: block;
    margin-top: 5px;
}

.appraise_box .describe {
    margin-bottom: 18px;
    overflow: hidden;
    color: #666666;
}

.appraise_box .describe view {
    display: inline-block;
    padding: 5px 15px;
    border: 0.5px solid #cccccc;
    border-radius: 50px;
    margin: 6px 6px;
}

.appraise_box .describe text {
    font-family: PingFangSC-Regular;
    font-size: 12px;
}

.appraise_box .textarea_box {
    text-align: left;
    line-height: 28px;
    position: relative;
}

.appraise_box .textarea_box .bgcBox {
    width: 315px;
    background: #f2f2f2;
    height: 4px;
    border-radius: 6px 6px 0 0;
    margin: 0 auto;
}

.appraise_box .textarea_box .Want_say {
    word-break: break-all;
    margin: 0 auto;
    border-radius: 0 0 6px 6px;
    width: 315px;
    min-height: 23px;
    background: #f2f2f2;
    box-sizing: border-box;
    padding-left: 9px;
    line-height: 19px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #aeaeae;
    overflow: hidden;
}

.appraise_box .submit {
    width: 315px;
    height: 45px;
    line-height: 45px;
    background-image: linear-gradient(-90deg,#ff8f00 0%,#ff5500 97%);
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    margin: 23px auto 16px;
    margin-bottom: 16px;
}

.input_shawbox {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    background: rgba(0,0,0,0.6);
    transition: all 0.2s ease-in-out;
}

.input_shawbox .inpout_box {
    background: #fff;
    width: 375px;
    border-radius: 10px 10px 0 0;
    box-sizing: border-box;
    padding: 15px 12px;
    max-height: 300px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.input_shawbox .inpout_box .text_shad {
    width: 301px;
    background: #f2f2f2;
    position: absolute;
    bottom: 15px;
    left: 12px;
    height: 25px;
}

.input_shawbox .inpout_box .input {
    background: #f2f2f2;
    border-radius: 3px;
    width: 301px;
    min-height: 80px;
    max-height: 185px;
    font-size: 16px;
    color: #444444;
    box-sizing: border-box;
    padding: 10px;
    float: left;
    margin-bottom: 25px;
}

.input_shawbox .inpout_box .numberV {
    font-family: ArialMT;
    font-size: 10px;
    color: #222;
    text-align: right;
    position: absolute;
    bottom: 15px;
    right: 67px;
    z-index: 100;
}

.input_shawbox .inpout_box .btn {
    position: absolute;
    right: 9px;
    bottom: 15px;
    width: 45px;
    height: 35px;
    background-color: #ff8f00;
    color: #fff;
    text-align: center;
    line-height: 35px;
    border-radius: 20px;
}

.appraisePlaceholder {
    font-size: 16px;
    color: #aeaeae;
}

.appraise_err {
    width: 100%;
    height: 16.5px;
    margin-top: 24px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    text-align: center;
}

.appraise_ok {
    width: 100%;
    height: 16.5px;
    margin-top: 39px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    text-align: center;
}

.appraise_ok .modify {
    color: #ff5500;
}

.messageTime {
    margin-top: 30px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    text-align: center;
    line-height: 17px;
}

.message_box .audio {
    max-width: 218px;
}

.message_box .ico {
    width: 15px;
    height: 20px;
    vertical-align: middle;
}

.message_box .voice {
    float: right;
    padding-left: 25px;
}

.service>.message_box .noPrompt {
    color: #28e;
}

.channelnBox {
    box-sizing: border-box;
    padding-top: 18px;
}

.channelnBox .head_img {
    width: 36px;
    height: 36px;
    margin: 0 12px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
}

.channelnBox .head_img img {
    width: 100%;
    height: 100%;
}

.channelnBox .channelnNavigationBox {
    background: #f2f2f2;
    font-family: PingFangSC-Regular;
    width: 255px;
    box-sizing: border-box;
    overflow: hidden;
}

.channelnBox .channelnNavigationBox .radiusBox {
    background: #ffffff;
    border-radius: 6px 21px 21px 21px;
    padding-top: 10px;
}

.channelnBox .channelnNavigationBox .textBox {
    box-sizing: border-box;
    padding: 0px 15px;
}

.channelnBox .titleOne {
    font-size: 16px;
    color: #222222;
    letter-spacing: 0;
    text-align: justify;
    margin-bottom: 9px;
}

.channelnBox .channelnNavigationBox .textBox .titleTwo {
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
    height: 16px;
    line-height: 16px;
    margin-bottom: 1.5px;
}

.channelnBox .channelnNavigationBox .xianBox {
    padding: 10px 15px;
    margin-top: 11.5px;
    box-sizing: border-box;
}

.channelnBox .channelnNavigationBox .xianBox .xian {
    border-top: 1px solid #e5e5e5;
}

.channelnBox .channelnNavigationBox .xianBox .button {
    width: 71.5px;
    height: 24px;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 48px;
    margin: 7px auto 0;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
    line-height: 21.5px;
}

.channelnBox .channelnNavigationBox .xianBox .button img {
    width: 7.5px;
    height: 4px;
    vertical-align: middle;
}

.channelnBox .channelnNavigationBox .channelnNavigation {
    overflow: hidden;
    height: 100px;
    box-sizing: border-box;
    padding: 0px 15px;
}

.channelnBox .channelnNavigationBox .channelnNavigation .nav {
    width: 225px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.channelnBox .channelnNavigationBox .channelnNavigation .nav .item {
    height: 100px;
    width: 60px;
    padding-top: 15.5px;
    text-align: center;
}

.channelnBox .channelnNavigationBox .channelnNavigation .nav .item img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 8px;
    vertical-align: top;
}

.channelnBox .channelnNavigationBox .channelnNavigation .nav .item font {
    display: block;
    width: 60px;
    height: 16.5px;
    font-size: 12px;
    color: #222222;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
}

.three .xian,.three .button {
    display: none;
}

.arrow {
    transition: All 0.5s ease-in-out;
}

.openRotateUp {
    transform: rotateZ(180deg);
}

.openRotateDown {
    transform: rotateZ(0deg);
}

.xing_box {
    display: flex;
    align-items: center;
}

.postion_box {
    position: relative;
}

.xing {
    margin-right: 4px;
    float: left;
    width: 10px;
    height: 10px;
}

.img_boxszs {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAeCAYAAAGJacbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDExQzU2NzlGNUQzMTFFOEJEOTk4MDc5NThDMTlEODkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDExQzU2N0FGNUQzMTFFOEJEOTk4MDc5NThDMTlEODkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMTFDNTY3N0Y1RDMxMUU4QkQ5OTgwNzk1OEMxOUQ4OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMTFDNTY3OEY1RDMxMUU4QkQ5OTgwNzk1OEMxOUQ4OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PidjvP4AAAVvSURBVHjaYvz//z8DNQATmFzNyMCwjtEaxPx/AMhezfQfLEaCHAvUvP8MLP/Bsoy/gGazA9k/mU4CuebEykFcxPjv7f/fEC/+//yPgYEPyGb610WKHEAAMVIjjFhAfmZ8zQg0Cei80P8QPzMzWDME/T9KrBwTxL8MQFmwf6HhxHgUERaE5ZjIDQdkOYAAYqRWuqEGgCSZNYzXgUGkwcD6X47hN9MpoIgEQ+hfRnrLQZJdCIsmMOy+M/xm9GEQZZJlCGVihjuXjnKDKpoAAmhQOYaJYRABSAJezQRMT/+BwcT4joH5vxADKJ2F/mOgtxy0AP4PlAMKsAGJX0yg0gcchfSWg0QTLwM/sPSSBitj/HcbKM4IDzs6ykEc48HyCejKLwy/WV8CQ08VmNUQEUlHOTD5f+0fBoZfwLD6/0ccKNTKAOJDAT3lBlXWBgigQeWYwVfMQNtfwDYFOPtDgSeQuQ2YFyGZAJYxYUXFMNfHhJmEQJhJl5GBdQ0DF4MoUOgfw39ikt7w0gcPGGADkhtURgNZckDuZQaW39wMfxjeMPxnYmJgZgIF5gOgiYcwLBqm+liQ9H4F1heMDJ//LwUmtz2MvxnnA4triMzff/8ZWIFyv7G2NoalPgTrEzBvfQGHbRSwZp8HZNxk+MUYCAplYB3/Hxi6PsDeBaZ1w1TfaK2EAwAE0GjADIUuymjADKUGHsMaYOPmP6h/9w+ax8AdPS8gczukAQSUF2VmYHD4jWrCMNWHK8VYAfF7oEHbwCr+E52who0+LC1fcBv5CAPnfzVg6H5j+MugS1wpPrz0IQIG3IkAtwyB3V6ml6BWISMrgwZQ5hJc/M2f6xgmDFN9TEj6DgMlHzIwgztVklDhx0AloMwpD+pSMPAxmGCxb1jqY0JKYnZA6iXDv3+3GNj/Q0a4QCNI7P+lwAaChpdAzWrMpDks9bGg6Gb9Z87wG9jm+wUssFmB/F+g1MfkDgzNZaBGNc6MOwz1IbV8WSEpaPW/v/9F/rEyvmV4CuQ3MnAzLmH48v8FQygLF0Tdb3TbhqU+RMCsAY/X+ADxJmAoAjn/goDmdABpNehQDoQM+Y/ZPhiG+pAKXzBmB2pqY2ACaWRYzyDKpM7ABiySgOU1JE8yYCnsh6e+0U7kaF+JNAAQoF3rd2kgisHJcQURtSg6SJ1cHFx0VKhuFTfBbv4Rjjq5dOmsm7ub4CAouuniXyCoQ5fqpIJiFSnte365Pq+t19qKIj1IIPDu/fpSSJO8JKoxSvpPUvqPbMynU5Oy1IPzbsRh9uJLcH3qBpmoV6wHBC2zIooXazy/s89y2HWSilRabsbSOXu0EK5UxWCZX/pIxetlPK87UJZar/AhBEhjkMNUDvNpa+iQqgL2l4GV4vUqXisL0weeBk81MeMBaqkf1mobO7aCBqg3HoIA6xDgFWs3JBXPZr4Ev3eQQfFihBd9Je3zEWzYslveg+k6qR1mueCZEs5kfZq5cmCkkjBlEIynLNslaO6ay7Aeczao2rQnxYsVXlRhThHoPNsBGYHnsKNAnrdIvr2tB0buTEMPJlV4whpzBrBJfF1gMUNJU6JMh2e74sUKr10MU6JBO08JOww1e6GqKdqyzUtWXTgkGdc4Dx9YZNkrZ+Ssa8/pkhQvJnjRGCbTpENPtF8xUutmNgd2BHr3IFppB936C43iisfKAbR2I3iUrfhPP4qpFS9WeNE8TENHO2gSQdEsZu+gh+N4318FAVSZ64/2e3MNeTYRh0vZagbnxaQVQp+3+v3vU7x44bVpBw8560reKTbeLnn+Do3ZRJgVGvMT1jM7bGgXQVNKekDlTOMd3eQJFC8+eFpLUtJakpIqjFKP0Aehf6yZ7V+BIAAAAABJRU5ErkJggg==) no-repeat;
    background-size: 70px 15px;
}

.img_boxszs2 {
    position: absolute;
    left: 0;
    top: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAeCAYAAAGJacbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDExQzU2N0RGNUQzMTFFOEJEOTk4MDc5NThDMTlEODkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDExQzU2N0VGNUQzMTFFOEJEOTk4MDc5NThDMTlEODkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMTFDNTY3QkY1RDMxMUU4QkQ5OTgwNzk1OEMxOUQ4OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMTFDNTY3Q0Y1RDMxMUU4QkQ5OTgwNzk1OEMxOUQ4OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtPgrsYAAASKSURBVHjaYvz//z8DNQATmFwNpNYxW4PZBxiBfOb/DKsZGUiRY4Ea+J/h7z8QzcjwiwnMBTJPAglzYuXALvrP+P/tfyYGsDX/PwElRIEiTP+7SJEDCCBGaoQRC9jPr5mAJv1jZAj9D/EzM6M1Q9Dfo8TKsZAbFshyLCC/MooCvfWWIZgR6legEhFGaDgQIwcQQIzUSjfUAOAk838N43XG/wwasKQIDC8GYFgy0lsOGjKgBM74DUhzgsM9lJmZgeH3P4hC+skNqmgCCKBB5RgmhkEEIGXeamZgdgNmsf/ACGRmYmT4C4pHaPTSUQ5eADP+h5bOf+HxxkhvOUghzvOPH6EORDPCOHSVAzuG0ZPhE7QohRSpoYikRE85SMisARLsjHyg0AMqaP2/9g9cIz3lBlXWBgigQeWYwVfMwNpfr4EpiPEfTMQTGKPbYFmQ8T804Yf+QzVhmOrDrAxA6v4z6QLz2zZoSQCsS4moM4aZPoTILyZuoI7/0FbkJVhpBAxQRmAo/weHKeP/QxgmDFN9yEH19T8POFktg+hFqtdATFag3H8mOyxxMCz1IQLmI1DJFxCXMQoqcguIg+DK/jD4IOVPhuGub7RWwgEAArBj9SoIw0D4ciKiCE4+g5ObIDg5dxR8JJ+mgps+gE6OLr5Edwdt4+WnTdpU0bFHQgNH4cvw5S533xeJ6YJEicR0asBLsSyuSlzRl1B0Mr+FsrsA1o3SY4oLMsY2spVqY3TGUSBCpT+/zU3McBi+xkJ19ou2s1SUy/lvrzgvnEeMak92MpQoPGPgZkgmfjO4t9wBS5znTMDZuiMu4cBPMWJ4AovwCnji0BNXahy+ulEZa6fKMcForG4RZSxx9TemL5fOV/P1hCR9oayuD4shzpt8rb+YYu5AJW/yAdveyMTPIEc54rDW51NMvPrbGKGl4yHsX6B3czHFoSvBQu0BhTvT0eAA02JmzFnItL8j2nwfnrgoIqNW+m+9BWjXjFUaCIIwPLMYEDGKhS+goIVNauHaFGIhmMfw0SRNCsHSxjqFhYW+QFKkULC5Hed27y6z2TOXiMgtzMCQzYXdbw8mO7v/rEaMmv6T1P5DjanMlaXEiQKp6eT+6DbRSMN4yYLlCaRJFVFe0ryddlnHDSyfPPFwWd02ooCTy8PHL015neZtlJKc4uXvMk64nVWaBs8jA2snDpT/5cZKeV3lNa0wu+wX7OeBoz3j4NuLZAyCa47gT55IUe18XfEX9q+WOSgvIV4cMHMYQ3GdJtC4sFSQjVdF699Mlfd4IjTg1sA/99o7zeGBv12tfT3lJcWLU9JBIW9Bnwd49h2llF5BUUjrqxdDHYz7Yh8PW15OecnxftrDfNA+XUIPjrjjdAmTAHkpx1Y+Lfq4vjzGFmlWeYnw4pQ0tDLeFnBP1jNMvVSF0Wjk0kdwYxa4zZ5aeUnxIqWXxkHF4QRzfAuLmXIJo+iTDJ1y470G3K4/pikvLV58KSY30kci780I7R0cU6/cRWHRJsPPAGZC+BlhqRfhBhKC8tLiaS1JTWtJahowah2xbw1X9Do+4oiOAAAAAElFTkSuQmCC) no-repeat;
    background-size: 70px 15px;
}

.fail_toast {
    position: absolute;
    margin-top: 15px;
    margin-left: 50px;
}

.fail_position {
    position: absolute;
    margin-top: 5px;
    margin-left: -25px;
    z-index: 99;
    width: 50px;
}

.aduioBox .message_box {
    padding: 0;
}

.aduioBox .audioText {
    border-bottom: 0.5px solid #DEDEDE;
    padding: 11px 15px;
    margin: 0;
}

.aduioBox .audio {
    padding: 6px 15px;
    height: 36px;
}

.aduioBox .ico {
    float: left;
    width: 24px;
    height: 24px;
}

.aduioBox .voice {
    font-size: 12px;
    color: #999999;
    float: left;
    padding-left: 6px;
}

.service .order_content {
    border: 3px solid #fff;
}

.message_commodity.service .content {
    border: 3px solid #fff;
}

.message_commodity.user .content {
    border: 3px solid #ff8f00;
}

.moreing{
    width: 20px;
    height: 20px;
    display: block;
    margin: 0 auto;
}

</style>