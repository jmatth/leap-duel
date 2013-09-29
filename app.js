
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var currentUsers = 0; //FIXME: less hackish way to handle this?
var playsers = [];

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Websockets

io.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
      if (currentUsers < 2) {
        currentUsers++;
        var player = players[currentUsers] = {
          id: currentUsers,
          socket: socket,
          state: 'ready',
          health: 100
        };

        socket.on('request-block', function(data){
          if (player.state === 'ready') {
            players[1].socket.emit('block', {player: player.id});
            players[2].socket.emit('block', {player: player.id});

            player.state = 'blocking';
            setTimeout(function(player){
              player.state = 'ready';
            }, 1000);
          }
        });

        socket.on('request-attack', function(data){
          if (player.state === 'ready') {
            players[1].socket.emit('attack', {player: player.id});
            players[2].socket.emit('attack', {player: player.id});

            player.state = 'attacking';
            setTimeout(function(player){
              //FIXME: check for hit on other player
              player.state = 'ready';
            }, 1000);
          }
        });
      }

      if (currentUsers >= 2) {
        players[1].emit('start');
        players[2].emit('start');
      }
    });
});
