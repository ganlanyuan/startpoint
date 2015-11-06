/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-animation-cssanimations-csscalc-cssgradients-csstransforms-csstransforms3d-flexbox-flexboxlegacy-flexboxtweener-flexwrap-inlinesvg-multiplebgs-touchevents-cssclassprefix:no !*/
!function(e,t,n){function r(e,t){return typeof e===t}function s(){var e,t,n,s,i,o,a;for(var f in v)if(v.hasOwnProperty(f)){if(e=[],t=v[f],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)o=e[i],a=o.split("."),1===a.length?Modernizr[a[0]]=s:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=s),x.push((s?"":"no-")+a.join("-"))}}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):b?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function o(){var e=t.body;return e||(e=i(b?"svg":"body"),e.fake=!0),e}function a(e,n,r,s){var a,f,d,u,l="modernizr",p=i("div"),c=o();if(parseInt(r,10))for(;r--;)d=i("div"),d.id=s?s[r]:l+(r+1),p.appendChild(d);return a=i("style"),a.type="text/css",a.id="s"+l,(c.fake?c:p).appendChild(a),c.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),p.id=l,c.fake&&(c.style.background="",c.style.overflow="hidden",u=T.style.overflow,T.style.overflow="hidden",T.appendChild(c)),f=n(p,e),c.fake?(c.parentNode.removeChild(c),T.style.overflow=u,T.offsetHeight):p.parentNode.removeChild(p),!!f}function f(e,t){return!!~(""+e).indexOf(t)}function d(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(t,r){var s=t.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(d(t[s]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];s--;)i.push("("+d(t[s])+":"+r+")");return i=i.join(" or "),a("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function p(e,t,s,o){function a(){p&&(delete z.style,delete z.modElem)}if(o=r(o,"undefined")?!1:o,!r(s,"undefined")){var d=u(e,s);if(!r(d,"undefined"))return d}for(var p,c,m,h,g,v=["modernizr","tspan"];!z.style;)p=!0,z.modElem=i(v.shift()),z.style=z.modElem.style;for(m=e.length,c=0;m>c;c++)if(h=e[c],g=z.style[h],f(h,"-")&&(h=l(h)),z.style[h]!==n){if(o||r(s,"undefined"))return a(),"pfx"==t?h:!0;try{z.style[h]=s}catch(y){}if(z.style[h]!=g)return a(),"pfx"==t?h:!0}return a(),!1}function c(e,t){return function(){return e.apply(t,arguments)}}function m(e,t,n){var s;for(var i in e)if(e[i]in t)return n===!1?e[i]:(s=t[e[i]],r(s,"function")?c(s,n||t):s);return!1}function h(e,t,n,s,i){var o=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+_.join(o+" ")+o).split(" ");return r(t,"string")||r(t,"undefined")?p(a,t,s,i):(a=(e+" "+P.join(o+" ")+o).split(" "),m(a,t,n))}function g(e,t,r){return h(e,n,n,t,r)}var v=[],y={_version:"3.2.0",_config:{classPrefix:"no",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){v.push({name:e,fn:t,options:n})},addAsyncTest:function(e){v.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=y,Modernizr=new Modernizr;var x=[],w=y._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];y._prefixes=w;var T=t.documentElement,b="svg"===T.nodeName.toLowerCase(),C=y.testStyles=a;Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",w.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");C(r,function(e){n=9===e.offsetTop})}return n}),Modernizr.addTest("webanimations","animate"in i("div"));var S="Moz O ms Webkit",_=y._config.usePrefixes?S.split(" "):[];y._cssomPrefixes=_;var k={elem:i("modernizr")};Modernizr._q.push(function(){delete k.elem});var z={style:k.elem.style};Modernizr._q.unshift(function(){delete z.style});var P=y._config.usePrefixes?S.toLowerCase().split(" "):[];y._domPrefixes=P,y.testAllProps=h,y.testAllProps=g,Modernizr.addTest("cssanimations",g("animationName","a",!0)),Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=i("a");return n.style.cssText=e+w.join(t+e),!!n.style.length}),Modernizr.addTest("flexbox",g("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",g("boxDirection","reverse",!0)),Modernizr.addTest("flexboxtweener",g("flexAlign","end",!0)),Modernizr.addTest("flexwrap",g("flexWrap","wrap",!0)),Modernizr.addTest("cssgradients",function(){for(var e,t="background-image:",n="gradient(linear,left top,right bottom,from(#9f9),to(white));",r="",s=0,o=w.length-1;o>s;s++)e=0===s?"to ":"",r+=t+w[s]+"linear-gradient("+e+"left top, #9f9, white);";Modernizr._config.usePrefixes&&(r+=t+"-webkit-"+n);var a=i("a"),f=a.style;return f.cssText=r,(""+f.backgroundImage).indexOf("gradient")>-1}),Modernizr.addTest("multiplebgs",function(){var e=i("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&g("transform","scale(1)",!0)});var A="CSS"in e&&"supports"in e.CSS,E="supportsCSS"in e;Modernizr.addTest("supports",A||E),Modernizr.addTest("csstransforms3d",function(){var e=!!g("perspective","1px",!0),t=Modernizr._config.usePrefixes;if(e&&(!t||"webkitPerspective"in T.style)){var n,r="#modernizr{width:0;height:0}";Modernizr.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",C(r+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),Modernizr.addTest("inlinesvg",function(){var e=i("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)}),s(),delete y.addTest,delete y.addAsyncTest;for(var j=0;j<Modernizr._q.length;j++)Modernizr._q[j]();e.Modernizr=Modernizr}(window,document);