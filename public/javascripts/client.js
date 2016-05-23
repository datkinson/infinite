var socket = io('/');
var information = {
  width: $(document).width(),
  height: $(document).height()
};
var viewOffset = 0;
var playerPosition = 0;

function sendClientInformation() {
  socket.emit('clientInformation', information);
}

function renderPlayer() {
  var player = $('.player');
  var newPosition = playerPosition - viewOffset;
  player.offset( { left: newPosition } );
}
socket.on('clientUpdate', function (data) {
  console.log(data);
});

socket.on('playerMove', function (location) {
  playerPosition = location;
  console.log('step');
  renderPlayer();
});

socket.on('ping', function (message) {
  console.log('ping: ', message);
});

socket.on('requestClientInformation', function(message) {
  console.log(message);
  sendClientInformation();
});

socket.on('playerUpdate', function(serverPlayer) {
  console.log(serverPlayer);
});

socket.on('offsetUpdate', function(offset) {
  viewOffset = offset;
  renderPlayer();
});

console.log('Initialised');
