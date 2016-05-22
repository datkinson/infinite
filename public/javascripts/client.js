var socket = io('/');
socket.on('clientUpdate', function (data) {
  console.log(data);
});

socket.on('playerMove', function (amount) {
  var player = $('.player');
  var playerCurrentPossition = player[0].offsetLeft;
  var newPosition = 0;
  if (typeof playerCurrentPossition === 'undefined') {
    newPosition = amount;
  } else {
    var newPosition = playerCurrentPossition + amount;
  }
  player.offset( { left: newPosition } );
});

socket.on('ping', function (message) {
  console.log('ping: ', message);
});

console.log('Initialised');
