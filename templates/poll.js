module.exports = (function () {/*
 <script type='text/javascript'>
  function longpoll() {
  var req = new XMLHttpRequest()
  req.open('GET', document.URL, true)
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
    if (req.status == 200) {
      document.open()
      document.write(req.responseText)
      document.close()
    } else {
      document.getElementById('notify').innerHTML = 'not connected'
    }
  }
 }
  req.send(null)
 }
 setTimeout(longpoll, 300);
</script>
 */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];