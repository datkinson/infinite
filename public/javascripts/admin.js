var socket = io('/');
var timer;

$('.start').click(function() {
  // timer = window.setInterval(function() {socket.emit('movePlayer', 20);}, 100);
  socket.emit('playerRun', 20);
});
$('.stop').click(function() {
  // window.clearInterval(timer);
  socket.emit('playerStop', true);
});
