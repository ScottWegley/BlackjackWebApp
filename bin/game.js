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
class Card {
    constructor(inSuit, inValue) {
        this.toString = () => {
            return this.value + " of " + this.suit;
        };
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
