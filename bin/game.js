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
    static genCard() {
        return new Card(values[Math.floor(Math.random() * (values.length - 1))], suits[Math.floor(Math.random() * (suits.length - 1))]);
    }
    static genCards(cNum) {
        if (cNum < 0) {
            return null;
        }
        var outCards = new Array(cNum);
        for (let i = 0; i < cNum; i++) {
            outCards.push(Card.genCard());
        }
        return outCards;
    }
}
class Pile {
    constructor(inSize) {
        this.toString = () => {
            var s = "";
            for (let i = 0; i < this.currentSize; i++) {
                s += this.cards[i].toString() + "\n";
            }
            return s;
        };
        this.maxSize = inSize;
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }
    add(input) {
        if (input instanceof Pile) {
            if (this.currentSize + input.currentSize < this.maxSize) {
                input.cards.forEach((inCard) => {
                    this.push(inCard);
                });
            }
        }
        else if (input != null) {
            if (this.currentSize + input.length < this.maxSize) {
                input.forEach((inCard) => {
                    this.push(inCard);
                });
            }
        }
        return this;
    }
    push(inCard) {
        if (this.currentSize < this.maxSize) {
            this.currentSize++;
            this.cards[this.currentSize - 1] = inCard;
        }
        return this;
    }
    shuffle() {
        if (this.currentSize == 0) {
            return this;
        }
        var cIndex = this.currentSize - 1;
        var rIndex;
        while (cIndex != 0) {
            rIndex = Math.floor(Math.random() * cIndex);
            [this.cards[cIndex], this.cards[rIndex]] = [this.cards[rIndex], this.cards[cIndex]];
            cIndex--;
        }
        return this;
    }
}
class Deck extends Pile {
    constructor() {
        super(52);
        values.forEach(tValue => {
            suits.forEach(tSuit => {
                this.push(new Card(tValue, tSuit));
            });
        });
    }
}
let active = true;
let iSettings;
let dealerPile;
window.addEventListener('load', () => {
    startGame();
});
function startGame() {
    settings = new GameSettings();
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
    var myPile = new Pile(12);
    myPile.add(Card.genCards(13));
}
function testTwo() {
}
function testThree() {
}
function testFour() {
}
function gameLoop() {
    while (active) {
        active = false;
    }
}
