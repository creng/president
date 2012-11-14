// ------------------
//      HELPERS
// ------------------

var ranks = [
	'Two', 'Three', 'Four', 
	'Five', 'Six', 'Seven', 
	'Eight', 'Nine', 'Ten', 
	'Jack', 'Queen', 'King', 'Ace'
];

var suits = [
	'Spades',
	'Hearts',
	'Clubs',
	'Diamonds'
];

function sortCards(a, b){
	if ( a.value < b.value ) { return -1; }
	else if ( a.value > b.value ) { return 1; }
	else { return 0; }
}

function validateHand (rank, hand) {
	var handRank = hand[0].rank;
	for (var i = 0; i < hand.length; i++) {
		if ( hand[i].rank != handRank || hand[i].rank < rank){
			return false;
		}
	}
	return true;
}

// ------------------
//       CARD
// ------------------

function Card (num) {
	this.value = num;
	this.rank = ranks[Math.floor(num / 4)];
	this.suit = suits[num % 4];
}

Card.prototype.toString = function () {
	return ( this.rank + ' of ' + this.suit );
}

Card.prototype.toValue = function () {
	return this.value;
}

// ------------------
//       DECK
// ------------------

function Deck () {
	this.size = 52;
	this.cards = [];
	for (var i = 0; i < this.size; i++) {
		this.cards[i] = new Card(i);
	}
}

Deck.prototype.shuffle = function () {
	var size = this.size;
	if ( size === 0 ) { return; }
	while ( --size ) {
		var temp = Math.floor( Math.random() * (size + 1) );
		var tempCard = this.cards[ temp ];
		this.cards[temp] = this.cards[size];
		this.cards[size] = tempCard;
	}
}

Deck.prototype.deal = function () {
	var card = this.cards[0];
	this.cards.splice(0, 1);
	this.size--;
	return card;
}

Deck.prototype.toString = function () {
	var msg = '### Deck Begin ###\n';
	for (var i = 0; i < this.size; i++){
		msg += this.cards[i].toString() + '\n';
	}
	return ( msg += '### Deck End ###' );
}

// ------------------
//      PLAYER
// ------------------

function Player (name) {
	this.rank = -1;
	this.name = name;
	this.hand = [];
}

Player.prototype.addHand = function (hand) {
	this.hand = this.hand.concat(hand);
}

Player.prototype.sortHand = function () {
	this.hand.sort(sortCards);
}

// ------------------
//       TABLE
// ------------------

function Table () {
	this.size = 0;
	this.cards = [];
	this.currentCards = [];
}

Table.prototype.addHand = function (hand) {
	this.size += hand.length;
	this.cards = this.cards.concat(hand);
	this.currentCards = hand;
}

Table.prototype.clear = function () {
	this.currentCards = [];
	this.cards = [];
	this.size = 0;
}

Table.prototype.displayCards = function () {
	for (var i = 0; i < this.currentCards.length; i++){
		console.log(this.currentCards[i].toString());
	}
}

// ------------------
//       GAME
// ------------------

function Game (players) {
	this.players = players;
	this.finishedPlayers = [];
	this.deck = new Deck();
	this.table = new Table();
	this.currentPlayer = 0;
}

Game.prototype.deal = function () {
	this.deck.shuffle();
	for (var i = 0; i < this.deck.size; i++) {
		this.players[i % this.players.length].addHand( [ this.deck.cards[i] ] );
	}
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].sortHand();
	}
}

// Add cards to the table and update current player
Game.prototype.turn = function (hand, clear) {
	if ( !hand ) { return false; }

	var currentCards = this.table.currentCards;
	var rank;
	if ( currentCards.length === 0 ) { rank = hand[0].rank; }
	else { rank = currentCards[0].rank; }

	if ( ( hand.length + currentCards.length === 4 ) || currentCards.length === hand.length || ( currentCards.length === 0 && hand.length < 5 ) ){
		if ( validateHand(rank, hand) ) {
			this.table.addHand(hand);
			for (var i = 0; i < hand.length; i++) {
				this.players[this.currentPlayer].hand.splice(
					this.players[this.currentPlayer].hand.indexOf(hand[i]), 1
				);
			};
			if ( !clear )
				this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
			return true;
		}
		return false;
	}
	return false;
}

var Kevin = new Player('Kevin');
var Alex = new Player('Alex');
var Ed = new Player('Ed');
var Joan = new Player('Joan');

var players = [Kevin, Alex, Ed, Joan];

var x = new Game(players);
x.deal();
console.log(Kevin);
x.turn([ Kevin.hand[0] ], false);
console.log(x.table);
console.log(Kevin);

// console.log(Kevin);
// console.log(Alex);
// console.log(Ed);
// console.log(Joan);

// HANDLER FOR CLEAR FUNCTOIN SETS YOU AS THE CURRENT PLAYER



// var d = new Deck();

// for (var i = 0; i < 52; i++){
// 	var x = d.deal();
// 	console.log(x.toString());
// 	console.log(d.size);
// }

// console.log(d.toString());
// d.shuffle();
// console.log(d.toString());
