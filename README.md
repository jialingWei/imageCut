# imageCut
网页截图插件(前提:等待dom加载完成,依赖Jquery)
使用方式：
1.var image= new ImageCut().init({
                "initDom":"#img",//必填,其余参数为选填，只有这个为必填
                "box_width":8,//截图框的拖拽框大小
                "border_width":1,//截图框的border宽度
                "bg_color":"green",//截图框的背景颜色
                "translated":0.5,//截图框透明度
                "cut_div_multiple":1,//展示框的和截图框的比例,会被cut_div_width和cut_div_height属性覆盖
                "callback": function (params) {
                    //每次完成截图的时候的回掉函数，其中params是截图完成的参数，均为数字，
                    // 前两个参数合为图片中截图起点，后连个参数为需要截取的长宽
                    console.info(params);
                },
                "cut_div_position":[100,0],//截图框和展示框的比例位置
                "dblclick":function(params){//双击的回掉函数，参数和callback一样
                    console.info(params);
                }
            });  
            注意：一般截图是通过获取params后把这四个参数提交到后台，通过后台来实现截图
  2. var image= new ImageCut().init("#img");
