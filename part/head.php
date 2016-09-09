<?php
  $file = basename($_SERVER['PHP_SELF']);
  $pagename = str_replace(".php","",$file); 
?>
<!doctype html>
<!--[if (IE 8)&!(IEMobile)]><html class="no-js lt-ie10 lt-ie9" lang="en"><![endif]-->
<!--[if (IE 9)&!(IEMobile)]><html class="no-js lt-ie10" lang="en"><![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>site title</title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="HandheldFriendly" content="True">
	<meta name="MobileOptimized" content="320">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">

	<!-- favicons -->

	<!-- Prerendering pages: be careful with this option -->
	<!-- <link rel="prerender" href="http://css-tricks.com"> -->

	<!-- Subresources:  -->
	<!-- Identify the resources that are the highest priority and should be requested before prefetched items -->
	<!-- <link rel="subresource" href="styles.css"> -->
	
	<!-- Prefetch DNS for external assets -->
	<!-- <link href="https://fontastic.s3.amazonaws.com" rel="dns-prefetch"> -->

	<!-- Preconnect for dynamic request URLs -->
	<!-- <link href='https://fonts.gstatic.com' rel='preconnect' crossorigin> -->
	
	<!-- Prefetch Resourses -->
	<!-- <link href="sprite.png" rel="prefetch"> -->
	<!-- <link href="http://mydomain.com/my-next-page.htm" rel="prerender"> -->

	<!--[if (!IE 8)&(!IE 7)]><!-->
		<!-- loadcss:js -->
	  <script>function onloadCSS(e,n){function t(){!o&&n&&(o=!0,n.call(e))}var o;e.addEventListener&&e.addEventListener("load",t),e.attachEvent&&e.attachEvent("onload",t),"isApplicationInstalled"in navigator&&"onloadcssdefined"in e&&e.onloadcssdefined(t)}!function(e){"use strict";var n=function(n,t,o){function a(e){return l.body?e():void setTimeout(function(){a(e)})}function d(){r.addEventListener&&r.removeEventListener("load",d),r.media=o||"all"}var i,l=e.document,r=l.createElement("link");if(t)i=t;else{var s=(l.body||l.getElementsByTagName("head")[0]).childNodes;i=s[s.length-1]}var f=l.styleSheets;r.rel="stylesheet",r.href=n,r.media="only x",a(function(){i.parentNode.insertBefore(r,t?i:i.nextSibling)});var c=function(e){for(var n=r.href,t=f.length;t--;)if(f[t].href===n)return e();setTimeout(function(){c(e)})};return r.addEventListener&&r.addEventListener("load",d),r.onloadcssdefined=c,c(d),r};"undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this);</script>
	  <!-- endinject -->
		<script>
			var stylesheet = loadCSS('assets/css/main.css');
	    onloadCSS( stylesheet, function() {
	      var expires = new Date(+new Date + (7 * 24 * 60 * 60 * 1000)).toUTCString();
	      document.cookie = 'mainCSS=true; expires='+ expires;
	    });
		</script>
		<!-- critical:css -->
		<style>/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block}audio:not([controls]){display:none;height:0}progress{vertical-align:baseline}template,[hidden]{display:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}dfn{font-style:italic}h1{font-size:2em;margin:0.67em 0}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}svg:not(:root){overflow:hidden}code,kbd,pre,samp{font-family:monospace, monospace;font-size:1em}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}button,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:bold}button,input{overflow:visible}button,select{text-transform:none}button,html [type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}textarea{overflow:auto}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}[type="search"]::-webkit-search-cancel-button,[type="search"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-input-placeholder{color:inherit;opacity:0.54}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}html{font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;touch-action:manipulation}html,body{min-width:320px;overflow-x:hidden}img,video{max-width:100%;height:auto}iframe{max-width:100%}figure img{display:block}img.full{width:100%;display:block}@media \0screen{img{width:auto}}[class^="icon-"]::before,[class*=" icon-"]::before,[class^="icon-"]:before,[class*=" icon-"]:before{display:none}button:focus,input:focus,select:focus,textarea:focus{outline:0}label{cursor:pointer}select{-webkit-appearance:none}figure,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,p{margin:0}dl,ul,ol{padding:0}ol,ul{list-style:none}a{text-decoration:none;color:inherit}.hidden-checkbox{position:absolute;left:-10000px}.ad{display:-webkit-box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-ms-flex-align:center;margin:0 auto 1.25em}.ad>*{margin:auto}.lt-ie10 .ad{text-align:center;white-space:nowrap}.lt-ie10 .ad:before{content:'';display:inline-block;height:100%;vertical-align:middle;margin-right:-.25em}.lt-ie10 .ad>*{display:inline-block;vertical-align:middle;white-space:normal}svg path,svg circle,svg ellipse,svg polygon,svg polyline{vector-effect:non-scaling-stroke}

/*# sourceMappingURL=../sourcemap/critical.css.map */
</style>
		<!-- endinject -->
		<noscript><link rel="stylesheet" href="assets/css/main.css"></noscript>
	<!--<![endif]-->

	<!-- svg4everybody:js -->
	<script>!function(e,t){"function"==typeof define&&define.amd?define([],function(){return e.svg4everybody=t()}):"object"==typeof exports?module.exports=t():e.svg4everybody=t()}(this,function(){function e(e,t){if(t){var n=document.createDocumentFragment(),i=!e.getAttribute("viewBox")&&t.getAttribute("viewBox");i&&e.setAttribute("viewBox",i);for(var a=t.cloneNode(!0);a.childNodes.length;)n.appendChild(a.firstChild);e.appendChild(n)}}function t(t){t.onreadystatechange=function(){if(4===t.readyState){var n=t._cachedDocument;n||(n=t._cachedDocument=document.implementation.createHTMLDocument(""),n.body.innerHTML=t.responseText,t._cachedTarget={}),t._embeds.splice(0).map(function(i){var a=t._cachedTarget[i.id];a||(a=t._cachedTarget[i.id]=n.getElementById(i.id)),e(i.svg,a)})}},t.onreadystatechange()}function n(n){function i(){for(var n=0;n<v.length;){var d=v[n],s=d.parentNode;if(s&&/svg/i.test(s.nodeName)){var l=d.getAttribute("xlink:href");if(a){var u=document.createElement("img");u.style.cssText="display:inline-block;",u.setAttribute("width",s.getAttribute("width")||s.clientWidth),u.setAttribute("height",s.getAttribute("height")||s.clientHeight),u.src=r(l,s,d),s.replaceChild(u,d)}else if(c&&(!o.validate||o.validate(l,s,d))){s.removeChild(d);var h=l.split("#"),b=h.shift(),f=h.join("#");if(b.length){var p=g[b];p||(p=g[b]=new XMLHttpRequest,p.open("GET",b),p.send(),p._embeds=[]),p._embeds.push({svg:s,id:f}),t(p)}else e(s,document.getElementById(f))}}else++n}m(i,67)}var a,r,o=Object(n);r=o.fallback||function(e){return e.replace(/\?[^#]+/,"").replace("#",".").replace(/^\./,"")+".png"+(/\?[^#]+/.exec(e)||[""])[0]},a="nosvg"in o?o.nosvg:/\bMSIE [1-8]\b/.test(navigator.userAgent),a&&(document.createElement("svg"),document.createElement("use"));var c,d=/\bMSIE [1-8]\.0\b/,s=/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,l=/\bAppleWebKit\/(\d+)\b/,u=/\bEdge\/12\.(\d+)\b/;c="polyfill"in o?o.polyfill:d.test(navigator.userAgent)||s.test(navigator.userAgent)||(navigator.userAgent.match(u)||[])[1]<10547||(navigator.userAgent.match(l)||[])[1]<537;var g={},m=window.requestAnimationFrame||setTimeout,v=document.getElementsByTagName("use");c&&i()}return n});</script>
	<!-- endinject -->
  <script>
  	svg4everybody({
	    fallback: function (src, svg, use) {
        // src: current xlink:href String 
        // svg: current SVG Element 
        // use: current USE Element 

        return 'assets/svg/fallback/' + src.replace('#', '') + '.png';
	    }
  	});
  </script>
	<!-- modernizr:js -->
	<script>!function(n,e,s){function o(n,e){return typeof n===e}function a(){var n,e,s,a,t,l,c;for(var u in i)if(i.hasOwnProperty(u)){if(n=[],e=i[u],e.name&&(n.push(e.name.toLowerCase()),e.options&&e.options.aliases&&e.options.aliases.length))for(s=0;s<e.options.aliases.length;s++)n.push(e.options.aliases[s].toLowerCase());for(a=o(e.fn,"function")?e.fn():e.fn,t=0;t<n.length;t++)l=n[t],c=l.split("."),1===c.length?f[c[0]]=a:(!f[c[0]]||f[c[0]]instanceof Boolean||(f[c[0]]=new Boolean(f[c[0]])),f[c[0]][c[1]]=a),r.push((a?"":"no-")+c.join("-"))}}function t(n){var e=c.className,s=f._config.classPrefix||"";if(u&&(e=e.baseVal),f._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");e=e.replace(o,"$1"+s+"js$2")}f._config.enableClasses&&(e+=" "+s+n.join(" "+s),u?c.className.baseVal=e:c.className=e)}var i=[],l={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(n,e){var s=this;setTimeout(function(){e(s[n])},0)},addTest:function(n,e,s){i.push({name:n,fn:e,options:s})},addAsyncTest:function(n){i.push({name:null,fn:n})}},f=function(){};f.prototype=l,f=new f;var r=[],c=e.documentElement,u="svg"===c.nodeName.toLowerCase();a(),t(r),delete l.addTest,delete l.addAsyncTest;for(var p=0;p<f._q.length;p++)f._q[p]();n.Modernizr=f}(window,document);</script>
	<!-- endinject -->

	<!--[if (lt IE 9)]>
		<link rel="stylesheet" href="assets/css/full.css">	

		<script src="assets/js/html5shiv.js"></script>
		<script src="assets/js/go-native.ie8.js"></script>
		
		<link href="http://externalcdn.com/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
		<link href="assets/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
		<script src="assets/cross-domain/respond.proxy.js"></script>	
	<![endif]-->
</head>
