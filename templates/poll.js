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
    } else if (req.status == 304) {
    longpoll()
    } else {
      document.getElementById('notify').innerHTML = 'not connected'
    }
  }
 }
  req.send(null)
 }
 document.onload = longpoll()
</script>
 */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];