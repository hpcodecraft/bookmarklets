<?php

  $bookmarklet = 'Rulr';

  if($_SERVER['SERVER_NAME'] == 'localhost') {
    $version = 'local';
    $baseURL = 'http://localhost:8888/Github/bookmarklets';
  }
  else {
    $version = 'live';
    $baseURL = 'https://hpcodecraft.me/bookmarklets';
  }
  
?>
<!DOCTYPE html>
<html>
  <head>
    <title><?=$bookmarklet?></title>
    <style type="text/css">
      body, textarea {
        font-family: Verdana, sans-serif;
      }

      ul {
        list-style-type: none;
      }

      input {
        width: 400px;
        border: 1px solid #000;
      }

      textarea {
        width: 400px;
        height: 300px;
        border: 1px solid #000;
      }
    </style>
  </head>
  <body>
    <div>
      drag the link to your bookmarks bar to install the <b><?=$version?></b> version<br>
      <a href="javascript:(function(){var body=document.getElementsByTagName('body')[0],script=document.createElement('script');script.type='text/javascript';script.src='<?=$baseURL?>/rulr/Rulr-<?=$version?>.js?' + Math.floor(Math.random()*99999);body.appendChild(script);})(); void 0">
        <?=$bookmarklet?> - <?=$version?>
      </a>
    </div>
  </body>
</html>
