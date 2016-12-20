/**
 * Created by Administrator on 2016/9/26.
 */
//类数组转数组：如果浏览器支持就用数组原型上的方法，如果浏览器不支持就for循环
var utils = (function () {
    var flg = 'getComputedStyle' in window;

    function makeArray(arg) {
        var ary = [];
        if (flg) {
            return [].slice.call(arg);
        } else {
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i]);
            }
        }
        return ary;
    }

    //将JSON格式的字符串转为JSON格式的对象
    function jsonParse(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
    }

    function win(attr, value) {
        if (typeof value == 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        } else {
            document.documentElement[attr] = document.body[attr] = value;
        }
    }

    function offset(curEle) {
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        var par = curEle.offsetParent;
        //判断是否是IE8浏览器，IE8浏览器自动加了border值
        while(par){
            if (window.navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }

    function rnd(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var tmp = m;
            m = n;
            n = tmp;
        }
        return Math.round(Math.random() * (m - n) + n);
    }

    //通过class名获取元素
    function getByClass(strClass, curEle) {
        curEle = curEle || document;
        if (flg) {
            return [].slice.call(curEle.getElementsByClassName(strClass));
        }
        var aryStr = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        var curList = curEle.getElementsByTagName('*');
        var ary = [];
        for (var i = 0; i < curList.length; i++) {
            var cur = curList[i];
            var bOk = true;
            for (var j = 0; j < aryStr.length; j++) {
                var reg = new RegExp('\\b' + aryStr[j] + '\\b');
                if (!reg.test(cur.className)) {
                    bOk = false;
                    break;
                }
            }
            if (bOk) {
                ary.push(cur);
            }
        }
        return ary;
    }

    //只能一个个的校验
    function hasClass(curEle, cName) {
        var reg = new RegExp('\\b' + cName + '\\b');
        return reg.test(curEle.className);
    }

    function addClass(curEle, strClass) {
        var aryStr = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryStr.length; i++) {
            if (!this.hasClass(curEle, aryStr[i])) {
                curEle.className += ' ' + aryStr[i];
            }
        }
    }

    function removeClass(curEle, strClass) {
        var aryStr = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryStr.length; i++) {
            var reg = new RegExp('\\b' + aryStr[i] + '\\b');
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(reg, ' ').replace(/(^ +)|( +$)/g, '').replace(/\s+/g, ' ');
            }
            if (curEle.className.length == 0) {
                curEle.removeAttribute('class');
            }
        }
    }

    function getCss(curEle, attr) {
        var val = null;
        var reg = null;
        if (flg) {//标准浏览器
            val = getComputedStyle(curEle, false)[attr];
        } else {
            if (attr == 'opacity') {
                val = curEle.currentStyle.filter;
                reg = /^alpha\(opacity[:=](\d+)\)$/i;
                return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        }
        reg = /^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    function setCss(curEle, attr, value) {
        if (attr == 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity:' + value * 100 + ')';
            return;
        }
        if (attr == 'float') {
            curEle.style.cssStyle = value;
            curEle.style.styleFloat = value;
            return;
        }

        var reg = /^(width|height|left|right|top|bottom)|((margin|padding)(left|right|top|bottom)?)$/gi;
        if (reg.test(attr) && value.toString().indexOf('%') == -1) {
            value = parseFloat(value) + 'px';
        }
        curEle.style[attr] = value;
    }

    function setGroupCss(curEle, opt) {
        if (opt.toString() !== '[object Object]') return;
        for (var attr in opt) {
            this.setCss(curEle, attr, opt[attr])
        }
    }

    function css(curEle) {
        var arg2 = arguments[1];
        if (typeof arg2 == 'string') {//设置一个或者是获取
            var arg3 = arguments[2];
            if (typeof arg3 == 'undefined') {
               return this.getCss(curEle, arg2);
            } else {
                this.setCss(curEle, arg2, arg3);
            }
        }
        if (arg2.toString() == '[object Object]') {
            this.setGroupCss(curEle, arg2)
        }
    }

    function getChildren(curEle, ele) {
        var nodeList = curEle.childNodes;
        var ary = [];
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            if (curNode.nodeType === 1) {
                if (typeof ele !== 'undefined') {
                    if (ele.toUpperCase() == curNode.nodeName) {
                        ary.push(curNode)
                    }
                } else {
                    ary.push(curNode)
                }
            }
        }
        return ary;
    }
    function prev(curEle){
        if(flg){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType !==1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function next(curEle){
        if(flg){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType !== 1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[];
        while(pre){
            ary.push(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    function sibling(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary;
    }
    function siblings(curEle){
        var preAry=this.prevAll(curEle);
        var nexAry=this.nextAll(curEle);
        return preAry.concat(nexAry);
    }
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    function firstChild(curEle){
        var ary=this.getChildren(curEle);
        return ary[0];
    }
    function lastChild(curEle){
        var ary=this.getChildren(curEle);
        return ary[ary.length-1];
    }
    function appendChild(parent,newEle){
        parent.appendChild(newEle);
    }
    function prependChild(parent,newEle){
        var first=this.firstChild(parent);
        if(first){
            parent.insertBefore(newEle,first)
        }else{
            parent.appendChild(newEle)
        }
    }
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle)
    }
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex)
        }else{
            oldEle.parentNode.appendChild(newEle)
        }
    }


    return {
        makeArray: makeArray,
        jsonParse: jsonParse,
        win: win,
        offset: offset,
        rnd: rnd,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css,
        getChildren: getChildren,
        prev:prev,
        next:next,
        prevAll:prevAll,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        index:index,
        firstChild:firstChild,
        lastChild:lastChild,
        appendChild:appendChild,
        prependChild:prependChild,
        insertBefore:insertBefore,
        insertAfter:insertAfter
    }

})();