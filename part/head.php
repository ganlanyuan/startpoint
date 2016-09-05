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
	  <!-- endinject -->
		<script>
			var stylesheet = loadCSS('assets/css/main.css');
	    onloadCSS( stylesheet, function() {
	      var expires = new Date(+new Date + (7 * 24 * 60 * 60 * 1000)).toUTCString();
	      document.cookie = 'mainCSS=true; expires='+ expires;
	    });
		</script>
		<!-- critical:css -->
		<!-- endinject -->
		<noscript><link rel="stylesheet" href="assets/css/main.css"></noscript>
	<!--<![endif]-->

	<!-- svg4everybody:js -->
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
	<!-- endinject -->

	<!--[if (lt IE 9)]>
		<link rel="stylesheet" href="assets/css/full.css">	

		<script src="assets/js/html5.js"></script>
		<script src="assets/js/ie.js"></script>
		
		<link href="http://externalcdn.com/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
		<link href="assets/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
		<script src="assets/cross-domain/respond.proxy.js"></script>	
	<![endif]-->
</head>
