<?php
  $file = basename($_SERVER['PHP_SELF']);
  $pagename = str_replace(".php","",$file); 
?>
<!doctype html>
<!--[if lt IE 7]><html class="no-js lt-ie10 lt-ie9 lt-ie8 lt-ie7" lang="en"><![endif]-->
<!--[if (IE 7)&!(IEMobile)]><html class="no-js lt-ie10 lt-ie9 lt-ie8" lang="en"><![endif]-->
<!--[if (IE 8)&!(IEMobile)]><html class="no-js lt-ie10 lt-ie9" lang="en"><![endif]-->
<!--[if (IE 9)&!(IEMobile)]><html class="no-js lt-ie10" lang="en"><![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="en"><!--<![endif]-->
<head>
	<!-- Change this to match your local server hostname and path -->
	<!-- <base href="http://localhost:8888/new/"> --><!--[if lte IE 6]></base><![endif]-->

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
	<!-- <meta http-equiv="cleartype" content="on"> -->
	<title>Site Title</title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="HandheldFriendly" content="True">
	<meta name="MobileOptimized" content="320">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

	<!-- favicons -->
	<link rel="shortcut icon" href="img/favicon.ico">
	<link rel="shortcut icon" href="img/favicon.png">
	<link rel="apple-touch-icon" href="img/touch_icon_60.png">
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/touch-icon_72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="img/touch_icon_76.png">
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/touch-icon_114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="img/touch_icon_120.png">
	<link rel="apple-touch-icon" sizes="152x152" href="img/touch_icon_152.png">
	<link rel="apple-touch-startup-image" href="img/splash.png">
	<!-- 152x152 img/touch_icon_152.png, 120x120 img/touch_icon_120.png, 114x114 img/touch-icon_114.png, 76x76 img/touch_icon_76.png, 72x72 img/touch-icon_72.png, 60x60 img/touch_icon_60.png, 32x32 img/favicon.png -->

	<!-- Prefetch DNS for external assets -->
	<link href="http://fonts.googleapis.com" rel="dns-prefetch">
	
	<!-- Prefetch Resourses -->
	<link href="sprite.png" rel="prefetch">
	<link href="webfont.woff" rel="prefetch">
	<link href="http://mydomain.com/my-next-page.htm" rel="prerender">

	<!-- css -->
	<link href='http://fonts.googleapis.com/css?family=Roboto:700,500' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="assets/css/site.css">

	<!-- javascript -->
	<!--[if (lt IE 9)]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<script src="assets/js/lib/ie.js"></script>
		
		<link href="http://externalcdn.com/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
		<link href="assets/js/lib/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
		<script src="assets/js/lib/cross-domain/respond.proxy.js"></script>	
	<![endif]-->
	<?php 
		if ($pagename == 'index') {
			echo '';
		} else {
			echo '';
		}
	?>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="assets/js/script.min.js"></script>
</head>