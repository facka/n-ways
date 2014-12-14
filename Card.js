function Card(id_,posx_,posy_,points_,owner_,up_) {
	this.id = id_;
	this.posx = posx_;
	this.posy = posy_;
	this.up = up_;
	this.points = points_;
	this.owner = owner_;
};
	
Card.prototype.turnOver = this.turnOver = function() {	
	this.up = this.up ? false : true;
};
Card.prototype.turnDown = function() {
	this.up = false;
};
Card.prototype.turnUp = function() {
	this.up = true;
};
Card.prototype.hide = function() {
	
};
Card.prototype.show = function() {
	
};
Card.prototype.moveTo = function(x,y) {
	this.posx = x;
	this.posy = y;
};
Card.prototype.move = function(offsetX,offsetY) {
	this.posy += offsetY;
	this.posx += offsetX;
};
Card.prototype.getId = function() {
	return this.id;
};
Card.prototype.getPosition = function() {
	return {posx: this.posx, posy: this.posy};
};
Card.prototype.getPoints = function() {
	return this.points;
};
Card.prototype.getOwner = function() {
	return this.owner;
};
Card.prototype.setOwner = function(player) {
	this.owner = player;
};
Card.prototype.isUp = function() {
	return this.up;
};
Card.prototype.toString = function() {
	return this.id;
}	
Card.prototype.toJSON = function() {
	return { id : this.id,
			 posx: this.posx,
			 posy: this.posy,
			 up: this.up,
			 points: this.points,
			 owner: this.owner
		   };
}
module.exports = Card;
console.log("Card loaded!!");