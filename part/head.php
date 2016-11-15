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

	<link rel="stylesheet" href="assets/css/main.css">
	<!-- svg4everybody:js -->
	<script>!function(e,t){"function"==typeof define&&define.amd?define([],function(){return e.svg4everybody=t()}):"object"==typeof exports?module.exports=t():e.svg4everybody=t()}(this,function(){function e(e,t){if(t){var n=document.createDocumentFragment(),i=!e.getAttribute("viewBox")&&t.getAttribute("viewBox");i&&e.setAttribute("viewBox",i);for(var a=t.cloneNode(!0);a.childNodes.length;)n.appendChild(a.firstChild);e.appendChild(n)}}function t(t){t.onreadystatechange=function(){if(4===t.readyState){var n=t._cachedDocument;n||(n=t._cachedDocument=document.implementation.createHTMLDocument(""),n.body.innerHTML=t.responseText,t._cachedTarget={}),t._embeds.splice(0).map(function(i){var a=t._cachedTarget[i.id];a||(a=t._cachedTarget[i.id]=n.getElementById(i.id)),e(i.svg,a)})}},t.onreadystatechange()}function n(n){function i(){for(var n=0;n<v.length;){var d=v[n],s=d.parentNode;if(s&&/svg/i.test(s.nodeName)){var l=d.getAttribute("xlink:href");if(a){var u=document.createElement("img");u.style.cssText="display:inline-block;",u.setAttribute("width",s.getAttribute("width")||s.clientWidth),u.setAttribute("height",s.getAttribute("height")||s.clientHeight),u.src=r(l,s,d),s.replaceChild(u,d)}else if(c&&(!o.validate||o.validate(l,s,d))){s.removeChild(d);var h=l.split("#"),b=h.shift(),f=h.join("#");if(b.length){var p=g[b];p||(p=g[b]=new XMLHttpRequest,p.open("GET",b),p.send(),p._embeds=[]),p._embeds.push({svg:s,id:f}),t(p)}else e(s,document.getElementById(f))}}else++n}m(i,67)}var a,r,o=Object(n);r=o.fallback||function(e){return e.replace(/\?[^#]+/,"").replace("#",".").replace(/^\./,"")+".png"+(/\?[^#]+/.exec(e)||[""])[0]},a="nosvg"in o?o.nosvg:/\bMSIE [1-8]\b/.test(navigator.userAgent),a&&(document.createElement("svg"),document.createElement("use"));var c,d=/\bMSIE [1-8]\.0\b/,s=/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,l=/\bAppleWebKit\/(\d+)\b/,u=/\bEdge\/12\.(\d+)\b/;c="polyfill"in o?o.polyfill:d.test(navigator.userAgent)||s.test(navigator.userAgent)||(navigator.userAgent.match(u)||[])[1]<10547||(navigator.userAgent.match(l)||[])[1]<537;var g={},m=window.requestAnimationFrame||setTimeout,v=document.getElementsByTagName("use");c&&i()}return n});</script>
	<!-- endinject -->
  <script>
  	svg4everybody({
  		polyfill: true,
	    fallback: function (src, svg, use) {
        // src: current xlink:href String 
        // svg: current SVG Element 
        // use: current USE Element 

        return src.replace('sprites.svg#', 'fallback/') + '.png';
	    }
  	});
  </script>
	<!-- modernizr:js -->
	<!-- endinject -->

	<!--[if (lt IE 9)]>
		<script src="assets/js/html5shiv.js"></script>
		<script src="assets/js/go-native.ie8.js"></script>
		
		<link href="http://externalcdn.com/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
		<link href="assets/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
		<script src="assets/cross-domain/respond.proxy.js"></script>	
	<![endif]-->
</head>
