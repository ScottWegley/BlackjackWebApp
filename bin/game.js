"use strict";
class GameSettings {
    constructor(iDecks = 6, iCash = 2000, iAdmin = true) {
        this.decks = iDecks;
        this.cashStart = iCash;
        this.admin = iAdmin;
    }
    toJSON() {
        return JSON.stringify({ 'decks': this.decks, 'cashStart': this.cashStart, 'admin': this.admin });
    }
    update(inSettings) {
        if (typeof inSettings === 'string') {
            var temp = JSON.parse(inSettings);
            this.decks = temp.decks;
            this.cashStart = temp.cashStart;
            this.admin = temp.admin;
        }
    }
}
var Suit;
(function (Suit) {
    Suit["CLUB"] = "Club";
    Suit["DIAMOND"] = "Diamond";
    Suit["SPADE"] = "Spade";
    Suit["HEART"] = "Heart";
})(Suit || (Suit = {}));
var Value;
(function (Value) {
    Value["ACE"] = "Ace";
    Value["TWO"] = "Two";
    Value["THREE"] = "Three";
    Value["FOUR"] = "Four";
    Value["FIVE"] = "Five";
    Value["SIX"] = "Six";
    Value["SEVEN"] = "Seven";
    Value["EIGHT"] = "Eight";
    Value["NINE"] = "Nine";
    Value["TEN"] = "Ten";
    Value["JACK"] = "Jack";
    Value["QUEEN"] = "Queen";
    Value["KING"] = "King";
})(Value || (Value = {}));
class Card {
    constructor(inSuit, inValue) {
        this.suit = inSuit;
        this.value = inValue;
    }
}
let active = false;
window.addEventListener('load', () => {
    startGame();
});
function startGame() {
    var settings = new GameSettings();
    settings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(settings.toJSON());
    gameLoop();
}
function gameLoop() {
    while (active) {
    }
}
