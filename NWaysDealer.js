var Dealer = require("./Dealer");
function NWaysDealer(cards_){
	Dealer.call(this);
	console.log("Creating N-Ways dealer");
	this.cards = cards_;
};

NWaysDealer.prototype = new Dealer();

NWaysDealer.prototype.constructor = NWaysDealer;

NWaysDealer.prototype.deal = function(players) {
	this.stack = this.cards;
	this.shuffle();
	var cardsXPlayer = (this.stack.length - 1) / players.length;
	for (var i = 0; i < cardsXPlayer; ){
		for (p in players) {
			var card = this.takeCardFromTop();
			if (card) {
				if (card.isUp()) {//if up is the center card
					card = this.takeCardFromTop();
				}
				players[p].takeCard(card);
				card.setOwner(players[p].getName());
			}
		}
		i++;
	}
	return players;
};

NWaysDealer.prototype.toString = function(){
	return "NWays  Dealer"
};

module.exports = NWaysDealer;
console.log("NWaysDealer loaded!!");