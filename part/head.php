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

	<!-- icon-font: for test only -->
	<!-- <link href="https://file.myfontastic.com/iuaokNqJ5MrEQHaALE3LVN/icons.css" rel="stylesheet"> -->

	<!-- critical css: for test only -->
	<!-- <link rel="stylesheet" href="assets/css/critical.css"> -->

	<!--[if (!IE 8)&(!IE 7)]><!-->
	<script>
		// loadcss
		// https://github.com/filamentgroup/loadCSS
		!function(e){"use strict";var n=function(n,t,o){function i(e){return d.body?e():void setTimeout(function(){i(e)})}function r(){a.addEventListener&&a.removeEventListener("load",r),a.media=o||"all"}var d=e.document,a=d.createElement("link"),l;if(t)l=t;else{var s=(d.body||d.getElementsByTagName("head")[0]).childNodes;l=s[s.length-1]}var f=d.styleSheets;a.rel="stylesheet",a.href=n,a.media="only x",i(function(){l.parentNode.insertBefore(a,t?l:l.nextSibling)});var u=function(e){for(var n=a.href,t=f.length;t--;)if(f[t].href===n)return e();setTimeout(function(){u(e)})};return a.addEventListener&&a.addEventListener("load",r),a.onloadcssdefined=u,u(r),a};"undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this);
		// onloadcss
		// https://github.com/filamentgroup/loadCSS
		function onloadCSS(n,a){function t(){!d&&a&&(d=!0,a.call(n))}var d;n.addEventListener&&n.addEventListener("load",t),n.attachEvent&&n.attachEvent("onload",t),"isApplicationInstalled"in navigator&&"onloadcssdefined"in n&&n.onloadcssdefined(t)}

		var stylesheet = loadCSS('assets/css/main.css');
    onloadCSS( stylesheet, function() {
      var expires = new Date(+new Date + (7 * 24 * 60 * 60 * 1000)).toUTCString();
      document.cookie = 'mainCSS=true; expires='+ expires;
    });
	</script>
	<style>
		/* inline critical styles go here*/
	</style>
	<noscript><link rel="stylesheet" href="assets/css/main.css"></noscript>
	<!--<![endif]-->
	<!--[if (lt IE 9)]><link rel="stylesheet" href="assets/css/full.css"><![endif]-->

	<!-- javascript -->
	<script>
	/*! modernizr 3.3.1 (Custom Build) | MIT *
	 */
	!function(e,n,o){function t(e,n){return typeof e===n}function s(){var e,n,o,s,a,i,r;for(var l in f)if(f.hasOwnProperty(l)){if(e=[],n=f[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(o=0;o<n.options.aliases.length;o++)e.push(n.options.aliases[o].toLowerCase());for(s=t(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?d[r[0]]=s:(!d[r[0]]||d[r[0]]instanceof Boolean||(d[r[0]]=new Boolean(d[r[0]])),d[r[0]][r[1]]=s),p.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,o=d._config.classPrefix||"";if(h&&(n=n.baseVal),d._config.enableJSClass){var t=new RegExp("(^|\\s)"+o+"no-js(\\s|$)");n=n.replace(t,"$1"+o+"js$2")}d._config.enableClasses&&(n+=" "+o+e.join(" "+o),h?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):h?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(h?"svg":"body"),e.fake=!0),e}function l(e,o,t,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(t,10))for(;t--;)f=i("div"),f.id=s?s[t]:d+(t+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=o(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var o=this;setTimeout(function(){n(o[e])},0)},addTest:function(e,n,o){f.push({name:e,fn:n,options:o})},addAsyncTest:function(e){f.push({name:null,fn:e})}},d=function(){};d.prototype=c,d=new d;var p=[],u=n.documentElement,h="svg"===u.nodeName.toLowerCase(),v=c._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];c._prefixes=v;var m=c.testStyles=l;d.addTest("touchevents",function(){var o;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)o=!0;else{var t=["@media (",v.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(t,function(e){o=9===e.offsetTop})}return o}),s(),a(p),delete c.addTest,delete c.addAsyncTest;for(var y=0;y<d._q.length;y++)d._q[y]();e.Modernizr=d}(window,document);
	</script>
	<!--[if (lt IE 9)]>
		<script src="assets/js/html5.js"></script>
		<script src="assets/js/ie.js"></script>
		
		<link href="http://externalcdn.com/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
		<link href="assets/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
		<script src="assets/cross-domain/respond.proxy.js"></script>	
	<![endif]-->
</head>
