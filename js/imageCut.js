/**
 * Created by 夏茂轩 on 2015/12/4.
 */
"use strict";
define(function (require, exports, moudle) {
    require("js/jquery");
    var imageCut = function () {
        return {
            firstPosition: undefined,//第一次点击的点
            secondPostion: undefined,//第二次点击的点
            div: undefined,
            div_id: undefined,
            cover_div: undefined,
            cover_div_id: undefined,
            cover_dom: undefined,
            box_width: 8,
            border_width: 1,
            bg_color: "#00CC66",
            translated: 0.5,
            original_image_size:undefined,
            width_proportion:undefined,
            height_proportion:undefined,
            callback:undefined,//选择截图后的回调函数，默认传参数params编码
            cut_div_dom:undefined,//截图后的展示div
            cut_div_width:undefined,//截图后展示的div的宽度
            cut_div_height:undefined,//截图后展示的div的高度
            cut_div_position:undefined,//截图后的展示div的相对
            init: function (json) {
                var initDom;
                //初始化参数
                if(typeof json=="object"){
                    if(json.initDom!=undefined){
                        this.dom = $(json.initDom);
                    }else{
                        console.error("请传入合法参数");
                        return;
                    }
                }else if(typeof json =="string"){
                    this.dom=$(json);
                }
                this.callback=json.callback?json.callback:function(){return;};
                this.original_image_size=this.getImageSize();
                var imageWith = this.getNums(this.dom.css("width"));
                var imageHeight = this.getNums(this.dom.css("height"));
                this.width_proportion=this.original_image_size[0]/imageWith;
                this.height_proportion=this.original_image_size[1]/imageHeight;
                var abTop = this.dom .offset().top;
                var abLeft = this.dom .offset().left;
                this.cover_div_id = this.uuid();
                var cut_div_id=this.uuid();
                this.cut_div_id=cut_div_id;
                this.cover_div = "<div id='" + this.cover_div_id + "' style='z-index:5;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none;user-select:none;width: " + imageWith + "px;height:" + imageHeight + "px;'><div style='z-index: 10;width: 100%;height: 100%;background-color: red;filter:alpha(opacity=0); -moz-opacity:0; -khtml-opacity: 0;opacity: 0;'></div>" +
                    "<div id=\""+this.cut_div_id+"\" style='position: absolute;'></div>"
                    +"</div>";
                console.info(this.cover_div);
                $(this.cover_div).appendTo(this.dom.parent());
                this.cover_dom = $("#" + this.cover_div_id);
                this.cover_dom.offset({top: abTop, left: abLeft});
                this.cut_div_dom=$("#"+cut_div_id);
                var Obj = this;
                //jquery对象
                $(document).bind("mouseup", function () {
                    if (Obj.cover_dom != undefined) {
                        Obj.cover_dom.unbind("mousemove");
                    }
                    if (Obj.div != undefined) {
                        Obj.div.dom.unbind("mousemove");
                    }
                });
                this.listen();
                return this;
            },
            listen: function () {
                //第一次点击的时候
                var imageObj = this;
                this.cover_dom.bind("mousedown", function (e) {
                    //获取第一个点的位置
                    imageObj.firstPosition = imageObj.getLocation(e);
                    //鼠标移动的时候获取鼠标的位置
                    imageObj.cover_dom.bind("mousemove", function (e1) {
                        imageObj.secondPostion = imageObj.getLocation(e1);
                        imageObj.cover_dom.unbind("mouseup").bind("mouseup", function () {
                            imageObj.cover_dom.unbind("mousemove");
                            if (imageObj.div != undefined) {
                                imageObj.div.dom.unbind("mousemove");
                            }
                            imageObj.clearMouseUp();
                        });
                        imageObj.drawDiv(imageObj.firstPosition, imageObj.secondPostion);
                        imageObj.drawCutImg();
                    });
                });
            }, drawDiv: function (first, second) {
                var imageObject = this;
                if (this.div != undefined) {
                    this.div.dom.remove();
                }
                var divWith = second[0] - first[0];
                var divHeight = second[1] - first[1];
                if (divWith < 0) {
                    divWith = Math.abs(divWith);
                }
                if (divHeight < 0) {
                    divHeight = Math.abs(divHeight);
                }
                if (this.div_id == undefined) {
                    this.div_id = this.uuid();
                }
                var spans = "<span class='left_top' style='display: block;z-index: 20;cursor: nw-resize;position: absolute;top:-" + imageObject.border_width + "px;left:-" + imageObject.border_width + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='top_mid' style='display: block;z-index: 20;cursor: n-resize;position: absolute;top:-" + imageObject.border_width + "px;left:" + ((divWith - imageObject.box_width - 2 * imageObject.border_width) / 2) + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='right_top' style='display: block;z-index: 20;cursor:ne-resize;position: absolute;top:-" + imageObject.border_width + "px;right: -" + imageObject.border_width + "px;border:" + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='left_mid' style='display: block;z-index: 20;cursor: w-resize;position: absolute;top:" + ((divHeight - imageObject.box_width - 2 * imageObject.border_width) / 2) + "px;left:-" + imageObject.border_width + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='right_mid' style='display: block;z-index: 20;cursor: w-resize;position: absolute;top:" + ((divHeight - imageObject.box_width - 2 * imageObject.border_width) / 2) + "px;right:-" + imageObject.border_width + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='left_bottom' style='display: block;z-index: 20;cursor: sw-resize;position: absolute;bottom:-" + imageObject.border_width + "px;left:-" + imageObject.border_width + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='bottom_mid' style='display: block;z-index: 20;cursor: s-resize;position: absolute;bottom:-" + imageObject.border_width + "px;left:" + ((divWith - imageObject.box_width - 2 * imageObject.border_width) / 2) + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>" +
                    "<span class='right_bottom' style='display: block;z-index: 20;cursor:se-resize;position: absolute;bottom: -" + imageObject.border_width + "px;right: -" + imageObject.border_width + "px;border: " + imageObject.border_width + "px solid black;width: " + imageObject.box_width + "px;height: " + imageObject.box_width + "px'></span>";
                var bg_id = imageObject.uuid();
                var bgdiv = "<div  id='" + bg_id + "' style='width:100%;height:100%; transition: background .5s; -moz-transition: background .5s;-webkit-transition: background .5s;;	-o-transition: background .5s;'></div>";
                var div = "<div  onselectstart='return false' ondragstart='return false'  id='" + this.div_id + "' style='border: " + imageObject.border_width + "px black dashed;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none;user-select:none; width:" + divWith +
                    "px;height: " + divHeight +
                    "px;cursor:move;position: absolute;" +
                    "'>" + spans + bgdiv + "</div>";
                $(div).appendTo(imageObject.cover_dom);
                imageObject.div = {
                    dom: $("#" + this.div_id),
                    maxTop: undefined,
                    maxLeft: undefined
                };
                imageObject.bgDom = $("#" + bg_id);
                if (first[1] - second[1] < 0) {
                    imageObject.div.dom.offset({top: first[1]});
                } else {
                    imageObject.div.dom.offset({top: second[1]});
                }
                if (first[0] - second[0] < 0) {
                    imageObject.div.dom.offset({left: first[0]});
                } else {
                    imageObject.div.dom.offset({left: second[0]});
                }
                var domWidth = imageObject.getNums(imageObject.dom.css("width"));
                var domHeight = imageObject.getNums(imageObject.dom.css("height"));
                var maxTop;
                if (imageObject.div.maxTop == undefined) {
                    maxTop = domHeight - divHeight
                } else {
                    maxTop = imageObject.div.maxTop;
                }
                var maxLeft;
                if (imageObject.div.maxLeft == undefined) {
                    maxLeft = domWidth - divWith;
                } else {
                    maxLeft = imageObject.div.maxLeft;
                }
                //给当前截取的div绑定事件
                this.div.dom.unbind("mousedown").bind("mousedown", function (e) {
                    imageObject.stopBubble(e);
                    var preLocation = imageObject.getLocation(e);
                    imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e1) {
                        imageObject.bgDom.css({
                            filter: "alpha(opacity="+imageObject.translated*100+")",
                            "-moz-opacity": imageObject.translated,
                            "-khtml-opacity": imageObject.translated,
                            "opacity": imageObject.translated,
                            "background-color":imageObject.bg_color
                        });
                        if (imageObject.div.maxTop == undefined) {
                            maxTop = domHeight - divHeight
                        } else {
                            maxTop = imageObject.div.maxTop;
                        }
                        if (imageObject.div.maxLeft == undefined) {
                            maxLeft = domWidth - divWith;
                        } else {
                            maxLeft = imageObject.div.maxLeft;
                        }
                        var currentLocation = imageObject.getLocation(e1);
                        var x = currentLocation[0] - preLocation[0];
                        var y = currentLocation[1] - preLocation[1];
                        var top = imageObject.getNums(imageObject.div.dom.css("top")) + y;
                        var left = imageObject.getNums(imageObject.div.dom.css("left")) + x;
                        if (x < 0 && y < 0) {
                            if (top >= 0 && left >= 0 && top < maxTop - imageObject.border_width && left < maxLeft - imageObject.border_width) {
                                imageObject.div.dom.css({
                                    top: top + "px",
                                    left: left + "px"
                                });
                            } else if (top >= 0 && left < 0 && top < maxTop - imageObject.border_width) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            } else if (top < 0 && left >= 0 && left < maxLeft - imageObject.border_width) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            }
                            preLocation = currentLocation;
                        } else if (x < 0 && y >= 0) {
                            if (left < maxLeft && left >= 0) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            }
                            if (top >= 0 && top < maxTop - imageObject.border_width) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            }
                            preLocation = currentLocation;
                        } else if (x >= 0 && y < 0) {
                            if (top < maxTop - imageObject.border_width && top >= 0) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            }
                            if (left >= 0 && left < maxLeft - imageObject.border_width) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            }
                            preLocation = currentLocation;
                        } else if (x >= 0 && y >= 0) {
                            if (top < maxTop - imageObject.border_width && left < maxLeft - imageObject.border_width && top >= 0 && left >= 0) {
                                imageObject.div.dom.css({
                                    top: top + "px",
                                    left: left + "px"
                                });
                            } else if (top > maxTop - imageObject.border_width && left < maxLeft - imageObject.border_width && left >= 0) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            } else if (top < maxTop - imageObject.border_width && left > maxLeft - imageObject.border_width && top >= 0) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            }
                            preLocation = currentLocation;
                        }
                        imageObject.cover_dom.unbind("mouseup").bind("mouseup", function () {
                            imageObject.bgDom.css({
                                filter: "alpha(opacity=0)",
                                "-moz-opacity": 0,
                                "-khtml-opacity": 0,
                                "opacity": 0,
                                "background-color":imageObject.bg_color
                            });
                            imageObject.clearMouseUp();
                        });
                        imageObject.drawCutImg();
                    });
                    //右中
                    imageObject.div.dom.find(".right_mid").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.wFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.wSecondPostion = imageObject.getLocation(e3);
                            imageObject.widthRefresh('right', imageObject.wSecondPostion[0] - imageObject.wFirstPostion[0]);
                            imageObject.wFirstPostion = imageObject.wSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".right_mid").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });

                    //左中
                    imageObject.div.dom.find(".left_mid").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.wFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.wSecondPostion = imageObject.getLocation(e3);
                            imageObject.widthRefresh('left', imageObject.wSecondPostion[0] - imageObject.wFirstPostion[0]);
                            imageObject.wFirstPostion = imageObject.wSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".left_mid").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                    //下中
                    imageObject.div.dom.find(".bottom_mid").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('bottom', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".bottom_mid").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                    //右下
                    imageObject.div.dom.find(".right_bottom").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('bottom', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.widthRefresh('right', imageObject.hSecondPostion[0] - imageObject.hFirstPostion[0]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".right_bottom").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                    //上中
                    imageObject.div.dom.find(".top_mid").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('top', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".top_mid").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });

                    //左上
                    imageObject.div.dom.find(".left_top").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('top', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.widthRefresh('left', imageObject.hSecondPostion[0] - imageObject.hFirstPostion[0]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".left_top").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                    //左下
                    imageObject.div.dom.find(".left_bottom").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('bottom', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.widthRefresh('left', imageObject.hSecondPostion[0] - imageObject.hFirstPostion[0]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".left_bottom").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                    imageObject.div.dom.find(".right_top").unbind("mousedown").bind("mousedown", function (e2) {
                        imageObject.stopBubble(e2);
                        imageObject.hFirstPostion = imageObject.getLocation(e2);
                        imageObject.cover_dom.unbind("mousemove").bind("mousemove", function (e3) {
                            imageObject.stopBubble(e3);
                            imageObject.hSecondPostion = imageObject.getLocation(e3);
                            imageObject.heightRefresh('top', imageObject.hSecondPostion[1] - imageObject.hFirstPostion[1]);
                            imageObject.widthRefresh('right', imageObject.hSecondPostion[0] - imageObject.hFirstPostion[0]);
                            imageObject.hFirstPostion = imageObject.hSecondPostion;
                            imageObject.clearMouseUp();
                            imageObject.drawCutImg();
                        });
                    });
                    imageObject.div.dom.find(".right_top").unbind("mouseup").bind("mouseup", function () {
                        imageObject.clearMouseUp();
                    });
                });
            },
            getLocation: function (e) {
                var array = new Array();
                var pageX = e.pageX;
                var pageY = e.pageY;
                if (pageX == undefined) {
                    pageX = event.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
                }
                if (pageY == undefined) {
                    pageY = event.clientY + document.body.scrollTop || document.documentElement.scrollTop;
                }
                array.push(pageX);
                array.push(pageY);
                return array;
            }
            , stopBubble: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    window.event.cancelBubble = true;
                }
            }, clearMouseUp: function () {
                var imageObject = this;
                var params=imageObject.getParams();
                imageObject.callback(params);

                this.cover_dom.unbind("mouseup").bind("mouseup", function () {
                    imageObject.div.dom.unbind("mousemove");
                    imageObject.div.dom.find(".left_top").unbind("mousemove");
                    imageObject.div.dom.find(".top_mid").unbind("mousemove");
                    imageObject.div.dom.find(".right_top").unbind("mousemove");
                    imageObject.div.dom.find(".left_mid").unbind("mousemove");
                    imageObject.div.dom.find(".right_mid").unbind("mousemove");
                    imageObject.div.dom.find(".left_bottom").unbind("mousemove");
                    imageObject.div.dom.find(".bottom_mid").unbind("mousemove");
                    imageObject.div.dom.find(".right_bottom").unbind("mousemove");
                });
            },
            uuid: function () {
                var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var chars = CHARS, uuid = new Array(36), rnd = 0, r;
                for (var i = 0; i < 36; i++) {
                    if (i == 8 || i == 13 || i == 18 || i == 23) {
                        uuid[i] = '-';
                    } else if (i == 14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join('');
            },
            getNums: function (str) {
                return parseInt(str.substring(0, str.length - 2));
            },
            widthRefresh: function (side, shift) {
                if (side == 'right') {
                    var divWidth = this.getNums(this.div.dom.css("width"));
                    divWidth = divWidth + shift;
                    //cover_div的offset x+cover_div的宽度必须大于div的offset x+div的宽
                    var cover_ofx = this.cover_dom.offset().left;
                    var div_ofx = this.div.dom.offset().left;
                    var cover_width = this.getNums(this.cover_dom.css("width"));
                    if ((cover_ofx + cover_width) > (div_ofx + divWidth)) {
                        this.div.dom.css({width: divWidth + "px"});
                        var obj = this;
                        this.div.dom.find(".top_mid").css({left: ((divWidth - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                        this.div.dom.find(".bottom_mid").css({left: ((divWidth - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                    }
                    this.div.maxLeft = (cover_width) - (divWidth);
                } else {
                    var cover_ofx = this.cover_dom.offset().left;
                    var divWidth = this.getNums(this.div.dom.css("width"));
                    divWidth = divWidth - shift;
                    var div_ofx = this.div.dom.offset().left + shift;
                    var cover_width = this.getNums(this.cover_dom.css("width"));
                    if ((cover_ofx ) < (div_ofx )) {
                        this.div.dom.css({width: divWidth + "px"});
                        this.div.dom.offset({left: div_ofx});
                        var obj = this;
                        this.div.dom.find(".top_mid").css({left: ((divWidth - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                        this.div.dom.find(".bottom_mid").css({left: ((divWidth - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                    }
                    this.div.maxLeft = (cover_width) - (divWidth);
                }
            },
            heightRefresh: function (side, shift) {
                if (side == 'bottom') {
                    var divHeight = this.getNums(this.div.dom.css("height"));
                    divHeight = divHeight + shift;
                    var cover_ofx = this.cover_dom.offset().top;
                    var div_ofx = this.div.dom.offset().top;
                    var cover_height = this.getNums(this.cover_dom.css("height"));
                    if ((cover_ofx + cover_height) > (div_ofx + divHeight)) {
                        this.div.dom.css({height: divHeight + "px"});
                        var obj = this;
                        this.div.dom.find(".left_mid").css({top: ((divHeight - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                        this.div.dom.find(".right_mid").css({top: ((divHeight - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                    }
                    this.div.maxTop = (cover_height) - (divHeight);
                }
                else {
                    var cover_ofx = this.cover_dom.offset().top;
                    var divHeight = this.getNums(this.div.dom.css("height"));
                    divHeight = divHeight - shift;
                    var div_ofx = this.div.dom.offset().top + shift;
                    var cover_Height = this.getNums(this.cover_dom.css("height"));
                    if ((cover_ofx ) < (div_ofx)) {
                        this.div.dom.css({height: divHeight + "px"});
                        this.div.dom.offset({top: div_ofx});
                        var obj = this;
                        this.div.dom.find(".left_mid").css({top: ((divHeight - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                        this.div.dom.find(".right_mid").css({top: ((divHeight - obj.box_width - 2 * obj.border_width) / 2) + "px"});
                    }
                    this.div.maxTop = (cover_Height) - (divHeight);
                }
            },
            getImageSize:function(){
                try{
                    var image=new Image();
                    image.src= this.dom.attr("src");
                    return [image.width,image.height];
                }catch (e){
                    console.error("没有背景图片");
                    return;
                }
            },
            getParams:function(){
                var left=this.getNums(this.div.dom.css("left"))*this.width_proportion;
                var top=this.getNums(this.div.dom.css("top"))*this.height_proportion;
                var width=this.getNums(this.div.dom.css("width"))*this.width_proportion;
                var height=this.getNums(this.div.dom.css("height"))*this.height_proportion;
                return [left,top,width,height];
            },
            drawCutImg:function(){
                var imageObject=this;
                var params=imageObject.getParams();
                var div_width=imageObject.getNums(imageObject.cover_dom.css("width"));
                var width=imageObject.cut_div_width?imageObject.cut_div_width:params[2];
                var height=imageObject.cut_div_height?imageObject.cut_div_height:params[3];
                var left = imageObject.cut_div_position?(imageObject.cut_div_position[0]+div_width):(100+div_width);
                var top=imageObject.cut_div_position?(imageObject.cut_div_position[1]):0;
                imageObject.cut_div_dom.css({
                    "width":width+"px",
                    "height":height+"px",
                    "left":left+"px",
                    "top":top+"px",
                    "background-position-x":-params[0],
                    "background-position-y":-params[1],
                    "background-image": "url("+ this.dom.attr("src")+")"
                });
            }
        };
    };
    //暴露接口
    exports.imageCut = imageCut;
});