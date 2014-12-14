var Card = require("./Card");
var Dealer = require("./Dealer");
function Table(){
	this.dealer;
	this.players = [];
	this.MAX_PLAYERS = 6;
	this.MIN_PLAYERS = 2;
	this.TABLE_SIZE = 11;
	this.table = [];
	this.totalPoints = {};
	this.gameStarted = false;
	this.dealed = false;
	this.admin;
	
	for (var i = 0; i < this.TABLE_SIZE; i++) {
	    this.table[i] = [];
	}

	Table.prototype.init = function(game) {
		this.dealer = game.dealer;
		this.MAX_PLAYERS = game.MAX_PLAYERS;
		this.MIN_PLAYERS = game.MIN_PLAYERS;	
		this.TABLE_SIZE = game.tableSize;
		gameStarted = true;
		this.table[5][5] = game.centerCard;
	};
	
	Table.prototype.addPlayer = function(player){
		console.log("Table.addPlayer( "+player.getName()+" )");
		this.totalPoints[player.getName()] = 0;
		this.players.push(player);
	};
	
	Table.prototype.removePlayer = function(p){
		console.log("Table.removePlayer( "+p.getName()+" )");
		var found = false;
		var i = 0;
		while (!found && i < this.players.length){
			var player = this.players[i];
			if (player.getName() == p.getName()){
				found = true;
				this.players.splice(i,1);
			}
			i++;
		}
	};
	
	Table.prototype.getPlayers = function() {
		console.log("Table.getPlayers() -> "+this.players);
		return this.players;
	};
	Table.prototype.existsPlayer = function(name){
		var player = this.getPlayerByName(name);
		console.log("Table.existsPlayer("+name+") = "+(player ? player.getName() : "No Existe!"));
		if (player)
			return true;
		else
			return false;
	};
	Table.prototype.getDealer = function(){
		return this.dealer;
	};			
	Table.prototype.deal = function() {
		if (this.dealer) {
			this.dealed = true;
			this.players = this.dealer.deal(this.players);
			for (var index in this.players) {
				var cards = this.players[index].getCards();
				for (var i in cards) {
					var card = cards[i];
					var position = card.getPosition();
					this.table[position.posx][position.posy] = card;
				}
			}
		}
		else{
			console.log("Error: it is not possible to deal because there is no dealer created.");
		}
	};
	Table.prototype.clean = function() {
		this.dealed = false;
		for (var player in this.players) {
			this.players[player].removeCards();
		}
	};
	Table.prototype.getPlayerByName = function(name){
		var ret;
		for (var i in this.players){
			if (this.players[i].getName() == name){
				ret = this.players[i];
			}
		}
		console.log("Table.getPlayerByName("+name+") <- "+ret);
		return ret;
	};
	Table.prototype.getPlayedCards = function(){
		var playedCards = [];
		for (var i = 0; i < this.TABLE_SIZE; i++) {
			for (var j = 0; j < this.TABLE_SIZE; j++) {
	 	   		if (this.table[i][j] && this.table[i][j].isUp()) {
	 	   			console.log("Played Card "+this.table[i][j]+"at "+i+","+j);
	 	   			playedCards.push(this.table[i][j]);
	 	   		}
	 		}
		}	
		return playedCards;	
	};
	Table.prototype.getPlayerCards = function(playerName){
		var player = this.getPlayerByName(playerName);
		return player.getCards();
	};
	Table.prototype.getCardsUp = function(){
		return this.cardsUp;
	};
	Table.prototype.isFull = function(){
		if (this.getPlayers().length >= this.MAX_PLAYERS)
			return true;
		else
			return false;
	};
	Table.prototype.calculatePoints = function(){
		var ret = {};
		for (var i in this.players){
			var player = this.players[i];
			console.log("El valor de this.players[i] :" + player);
			var points = player.calculatePoints();
			ret[player.getName()] = points;
			console.log("Player "+player+" has "+points+" points.");
			this.totalPoints[player.getName()] += points;
		}
		return ret;
	};
	Table.prototype.getTotalPoints = function(){
		return this.totalPoints;
	};
	Table.prototype.setGameStarted = function(value) {
		this.gameStarted = value;
	};
	Table.prototype.getGameStarted = function() {
		return this.gameStarted;
	};
	Table.prototype.isDealed = function() {
		return this.dealed;
	};
	Table.prototype.setAdmin = function(arg) {
		this.admin = arg;
	};
	Table.prototype.getAdmin = function() {
		return this.admin;
	};
	Table.prototype.turnOverCard = function(posx, posy, player) {
		var error = null;
		if (posx >= 0 && posx<this.TABLE_SIZE && posy >= 0 && posy<this.TABLE_SIZE) {
			
			if (this.table[posx][posy].getOwner() == player) {
				if (!this.table[posx][posy].isUp()) {
					this.table[posx][posy].turnOver();
				}
				else {
					error = "Invalid params in turnOverCard function, card is already up";
					
				}
			}
			else {
				error = "Invalid params in turnOverCard function, player is not owner of the card";	
			}
		}
		else {
			error = "Invalid params in turnOverCard function, table max size is "+ this.TABLE_SIZE;
		}
		if (error ) 
			console.log(error);		
		return error;
	};
};

module.exports = Table;
console.log("Table loaded!!");