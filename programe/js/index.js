/**
 * Created by Administrator on 2016/11/4.
 */
(function () {
    var oBox = document.getElementById('banner');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aImg = oBoxInner.getElementsByTagName('img');
    var oBoxUl=oBox.getElementsByTagName('div')[1];
    var oUl = oBoxUl.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');
    var timer=null;
    var data = null;
    var n=0;
    //1、获取并解析数据 2、绑定数据  3、延迟加载  4、图片自动轮播  5、按钮自动轮播  6、鼠标移入停止，移出继续  7、点击按钮手动切换  8、点击焦点按钮切换
    lazyImg();
    function  lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var curImg=aImg[index];
                var tmpImg=new Image;
                tmpImg.src=curImg.getAttribute('realImg');
                tmpImg.onload=function(){
                    curImg.src=this.src;
                    tmpImg=null;
                    //让第一张图片层级为1，透明度从0-1的运动；
                    utils.css(aImg[0],'zIndex',1);
                    animate(aImg[0],{opacity:1},{duration:1000})
                }
            })(i);
        }
    }
    //4.渐隐渐现
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aImg.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function  setBanner(){
        for(var i=0; i<aImg.length; i++){
            if(i===n){//让谁显示，就先提高谁的层级，同时让其他图片层级为0；
                utils.css(aImg[i],'zIndex',1)
                animate(aImg[i],{opacity:1},{
                    duration:1000,
                    callback:function(){//等运动结束后想干的事情
                        //千万不要在回调函数中使用i，回调函数属于异步，异步中，i一定会出问题
                        var siblings=utils.siblings(this);
                        //让所有兄弟元素的透明度都为0；
                        for(var i=0; i<siblings.length; i++){
                            utils.css(siblings[i],{opacity:0});
                        }
                    }
                })
            }else{
                utils.css(aImg[i],'zIndex',0)
            }
        }
        bannerTip();
    }
    //5.焦点自动轮播
    function bannerTip(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==n?'on':null;
        }
    }
    //6.移入停止，移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000)
        oBtnLeft.style.display=oBtnRight.style.display='none';
    };
    //7.点击焦点手动切换
    handleChange();
    function  handleChange(){
        for(var i=0; i<aLi.length; i++){
            (function(index){
                aLi[index].onclick=function(){
                    n=index;
                    setBanner();
                }
            })(i);
        }
    }
    //8.点击左右按钮进行切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aImg.length;
        }
        n--;
        setBanner();
    }
})();