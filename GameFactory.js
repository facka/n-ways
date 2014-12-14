var Card = require("./Card");
var Dealer = require("./Dealer");
var NWaysDealer = require("./NWaysDealer");
function GameFactory(){
	
	this.createNWays = function () {
		var cards = [];
		var table_size = 11;
		var index = 0;
		var centerCard;
		for (var i = 0; i < table_size ; i++){
			for (var j = 0; j < table_size ; j++){
				var points = Math.abs(5 - i) + Math.abs(5 - j);
				var up= false;
				if (!(i == 5 && j == 5)) {
					cards[index] = new Card("card"+index,i,j,points,null,up);
				}
				else {
					up = true;
					cards[index] = new Card("card"+index,i,j,points,null,up);
					centerCard = cards[index];
				}
				console.log("Creating card: "+index+ ", in position "+i+","+j+" -> points = "+points);
				index++;
			}
		}
		
		
		var dealer = new NWaysDealer(cards);
		console.log("NWays game created!!"+dealer.toString());
		return {
			dealer : dealer,
			maxPlayers : 6,
			minPlayers : 2,
			centerCard: centerCard,
			tableSize: table_size
		};
	};
	
	GameFactory.prototype.create = function() {
		return this.createNWays();
		
	};
};

module.exports = GameFactory;
console.log("GameFactory loaded!!");