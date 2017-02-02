<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Christian News on Christian Today</title>
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="HandheldFriendly" content="True">
  <meta name="MobileOptimized" content="320">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>Links</title>
  <style>
    body { margin: 0; }
    ul { 
      margin: 0;
      padding: 0;
    }
    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    h2 {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      text-transform: capitalize;
      font-size: 36px;
      text-transform: uppercase;
      margin-bottom: 1em !important;
    }
    .container {
      margin: 30px 0;
    }
    .container a > span, .container h2 {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
    .container a {
      display: block;
      font-size: 28px;
      line-height: 2.6;
      color: #000;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      text-transform: capitalize;
      font-weight: 100;
      letter-spacing: 1px;
      text-decoration: none;
    }
    .container a:hover {
      /*color: #FF00FF;*/
      font-weight: bold;
      /*font-style: italic;*/
      background: #f7f7f7;
    }
    .extension span:after {
      content: 'php';
      display: inline-block;
      text-transform: lowercase;
      font-size: 0.4em;
      margin-left: 0.5em;
      position: relative;
      top: -1em;
      color: #fff;
      font-weight: 300;
      background: #0080FF;
      line-height: 1.6;
      padding: 0 0.4em;
      border-radius: 2px;
      font-style: italic;
    }
    .php span:after {
      content: 'php';
      background: #3A91FF;
    }
    .html span:after {
      content: 'html';
      background: #84D830;
    }
  </style>
</head>
<body>

<div class="container">
  <h2>Coding Links</h2>
  <ul>
  <?php
  $dir = realpath(dirname(__FILE__));
  // Open a known directory, and proceed to read its contents
  if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
      while (($file = readdir($dh)) !== false) {
        $path = $dir . '/' . $file;
        if((strpos($file, '.php') || strpos($file, '.html')) && $file !== 'links.php') {
          $filename = pathinfo($path, PATHINFO_FILENAME);
          $fileextension = pathinfo($path, PATHINFO_EXTENSION);
          echo '<li class="extension ' . $fileextension . '"><a href="' . $file . '" target="_blank"><span>' . $filename . '</span></a></li>';
        }
      }
      closedir($dh);
    }
  }
  $file = basename($_SERVER['PHP_SELF']);
  ?>
  </ul>
</div>  

</body>
</html>