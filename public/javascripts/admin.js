var socket = io('/');
var timer;

$('.start').click(function() {
  timer = window.setInterval(function() {socket.emit('movePlayer', 10);}, 100);
});
$('.stop').click(function() {
  window.clearInterval(timer);
});
