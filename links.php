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
    }
    .container {
      margin: 30px 0;
    }
    .container a, .container h2 {
      max-width: 600px;
      margin: 0 auto;
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
    .container li:hover { background: #f5f5f5; }
    .container a {
      display: block;
      font-size: 18px;
      line-height: 1.3;
      padding: 0.7em 0;
      color: #000;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      text-transform: capitalize;
      font-weight: 300;
      text-decoration: none;
    }
    .container a:hover {
      color: #FF00FF;
      font-style: italic;
    }
  </style>
</head>
<body>

<div class="container">
  <h2>All Links</h2>
  <ul>
  <?php
  $dir = realpath(dirname(__FILE__));
  // Open a known directory, and proceed to read its contents
  if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
      while (($file = readdir($dh)) !== false) {
        if(strpos($file, '.php') || strpos($file, '.html') && $file !== 'links.php') {
          $filename = (strpos($file, '.php'))? str_replace(".php","",$file) : str_replace(".html","",$file);
          echo '<li><a href="' . $file . '" target="_blank">' . $filename . '</a></li>';
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