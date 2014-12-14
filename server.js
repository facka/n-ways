var Player = require("./Player");
var Card = require("./Card");
var Dealer = require("./Dealer");
var Table = require("./Table");
var GameFactory = require("./GameFactory");
var LoginEvent = require("./LoginModule");
var Sockets = require("./Sockets");

//var Usergrid = require("usergrid");

/*var client = new Usergrid.client({
    orgName:'facka',
    appName:'cards',
    logging: false, //optional - turn on logging, off by default
});*/


var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  
server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/Menu.js', function (req, res) {
  res.sendfile(__dirname + '/Menu.js');
});

app.get('/Messages.js', function (req, res) {
  res.sendfile(__dirname + '/Messages.js');
});

app.get('/jquery.ui.touch-punch.min.js', function (req, res) {
  res.sendfile(__dirname + '/jquery.ui.touch-punch.min.js');
});

var table = new Table();  
var gameFactory = new GameFactory();
var partidas=new Array();
var playerSockets = new Sockets();

io.set('heartbeat interval', 5); //cambie este valor de 20 a 10 para que ande mas rapido.
io.set('heartbeat timeout', 10);  //determina el tiempo en el que el server se da cuenta que un cliente se desconecto
io.set('transports',[ 'xhr-polling' ]);
io.set("polling duration", 60);

io.sockets.on('connection', function (socket) {

  console.log("socket connected "+ socket.id);
  
  var loginEvent = new LoginEvent(socket, table, playerSockets);
  
  socket.on(loginEvent.getName(), function(data) {
	loginEvent.action(data,socket);//,client);
  });
  
  /*
  Starts the selected game
  */
  socket.on('startGame', function (data) {
  	if (data.player == table.getAdmin()) {
		var game = gameFactory.create();
		table.init(game);
		var playersName = [];
		var players = table.getPlayers();
		for (var i in players) {
			playersName.push(players[i].getName());
		}
		socket.emit("startGame",{players : playersName});	
		socket.broadcast.emit("startGame",{players : playersName});
		socket.emit("message","Game Started!");	
		socket.broadcast.emit("message","Game Started!");	
	}
  });  
  
  var sendCards = function(socket, table) {
  	var players = table.getPlayers();
  	var playedCards = table.getPlayedCards();
	for(var i in players){
		var name = players[i].getName();
		console.log("Emiting cards for player"+name);
		var cards = players[i].getCards();
		cards = cards.concat(playedCards);
		socket.emit(name+"Cards",{cards : cards});	
		socket.broadcast.emit(name+"Cards",{cards : cards});
	}
  };

  socket.on('deal', function (data) {
	if (!table.isDealed()){
		table.deal();
		sendCards(socket, table);	
	}
  });  

  socket.on('cardTurnedOver', function (data) {
	var result = table.turnOverCard(data.posx,data.posy,data.player);
	if (result != null) {
		socket.emit("invalidMovement",result);		
	}
	console.log("Card "+data.posx+","+data.posy+" played.");
	sendCards(socket, table);
  });
  
  
  socket.on('finishHand', function (data) {
	table.clean();
	socket.emit("finishHand",data);	
	socket.broadcast.emit("finishHand",data);	
	socket.emit("message","Round finished.");
	socket.broadcast.emit("message","Round finished.");	
  });
  
  socket.on('newGame', function (data) {
	table.clean();
	socket.emit("newGame",{});	
	socket.broadcast.emit("newGame",{});	
  });
  
  socket.on('message', function (message) {
	socket.emit("message",message);	
	socket.broadcast.emit("message",message);	
  });
  
  socket.on('disconnect', function () {
	var playerName = playerSockets.getName(socket);
	if (playerName) {
		socket.emit("message","User " + playerName + " has logged out");	
		socket.broadcast.emit("message","User " + playerName + " has logged out");	
	}
	playerSockets.removeSocket(socket.id);
	
  });
  
});
