<script type="text/javascript">
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "assets/svg/icons.svg", true);
  ajax.send();
  ajax.onload = function(e) {
    var div = document.createElement("div");
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  }
</script>
