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
const suits = ["Clubs", "Diamonds", "Spades", "Hearts"];
const values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
class Card {
    constructor(inValue, inSuit) {
        this.toString = () => {
            return this.value + " of " + this.suit;
        };
        this.value = inValue;
        this.suit = inSuit;
    }
}
class Pile {
    constructor(inSize) {
        this.maxSize = inSize;
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }
    add(inCard) {
        if (this.currentSize < this.maxSize) {
            this.cards.push(inCard);
            this.currentSize++;
            return true;
        }
        else {
            return false;
        }
    }
    shuffle() {
    }
    static shuffle() {
    }
}
class Deck extends Pile {
    constructor() {
        super(52);
        values.forEach(tValue => {
            suits.forEach(tSuit => {
                this.cards.push(new Card(tValue, tSuit));
            });
        });
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
    var admin1 = document.getElementById('btnAdmin1');
    var admin2 = document.getElementById('btnAdmin2');
    var admin3 = document.getElementById('btnAdmin3');
    var admin4 = document.getElementById('btnAdmin4');
    admin1.addEventListener('click', () => { testOne(); });
    admin2.addEventListener('click', () => { testTwo(); });
    admin3.addEventListener('click', () => { testThree(); });
    admin4.addEventListener('click', () => { testFour(); });
    gameLoop();
}
function testOne() {
}
function testTwo() {
}
function testThree() {
}
function testFour() {
}
function gameLoop() {
    while (active) {
    }
}
