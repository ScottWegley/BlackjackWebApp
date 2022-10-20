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
            outCards[i] = Card.genCard();
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
        this.details = () => {
            return "Pile<" + this.currentSize + "/" + this.maxSize + ">";
        };
        this.maxSize = inSize;
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }
    add(input) {
        if (input instanceof Pile) {
            if (this.currentSize + input.currentSize <= this.maxSize) {
                input.cards.forEach((inCard) => {
                    this.push(inCard);
                });
            }
        }
        else if (input != null) {
            if (this.currentSize + input.length <= this.maxSize) {
                input.forEach((inCard) => {
                    this.push(inCard);
                });
            }
        }
        return this;
    }
    deal() {
        let returnVal = this.cards.pop();
        if (returnVal instanceof Card) {
            this.currentSize--;
        }
        return returnVal;
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
class Hand extends Pile {
    constructor(div) {
        super(1);
        this.enabled = true;
        this.value = [0];
        this.div = div;
    }
    push(inCard) {
        if (this.currentSize == this.maxSize) {
            this.maxSize++;
        }
        super.push(inCard);
        return this;
    }
    updateValue() {
    }
}
let iSettings;
let dealerPile, discardPile;
let currentMoney, currentBet;
let dealerHand, playerHand1, playerHand2;
let hands;
let backOfCard = "./src/data/imgs/card_back.png";
window.addEventListener('load', () => {
    startGame();
});
function startGame() {
    iSettings = new GameSettings();
    iSettings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(iSettings.toJSON());
    var admin1 = document.getElementById('btnAdmin1');
    var admin2 = document.getElementById('btnAdmin2');
    var admin3 = document.getElementById('btnAdmin3');
    var admin4 = document.getElementById('btnAdmin4');
    dealerHand = new Hand(document.getElementById('dealerHand'));
    playerHand1 = new Hand(document.getElementById('playerHand1'));
    playerHand2 = new Hand(document.getElementById('playerHand2'));
    playerHand2.enabled = false;
    hands = [dealerHand, playerHand1, playerHand2];
    admin1.addEventListener('click', () => { adminOne(); });
    admin2.addEventListener('click', () => { adminTwo(); });
    admin3.addEventListener('click', () => { adminThree(); });
    admin4.addEventListener('click', () => { adminFour(); });
    var chkAdmin = document.getElementById('chkAdmin');
    chkAdmin.addEventListener('change', () => {
        iSettings.admin = chkAdmin.checked;
        updateDisplay();
    });
    gameSetup();
}
function adminOne() {
}
function adminTwo() {
}
function adminThree() {
}
function adminFour() {
}
function gameSetup() {
    currentMoney = iSettings.cashStart;
    currentBet = 0;
    updateDisplay();
    dealerPile = new Pile(52 * iSettings.decks);
    discardPile = new Pile(dealerPile.maxSize);
    for (let i = 0; i < iSettings.decks; i++) {
        dealerPile.add(new Deck());
    }
    dealerPile.shuffle();
    initialDeal();
}
function initialDeal() {
    hands.forEach((h) => {
        if (h.enabled) {
            let toDeal = dealerPile.deal();
            h.push(toDeal);
            h.div.replaceChildren();
            let outImg = document.createElement('img');
            outImg.src = cardToPath(toDeal);
            h.div.appendChild(outImg);
        }
    });
}
function cardToPath(inCard) {
    let base = './src/imgs/';
    return base + inCard.toString().toLowerCase().replace(" ", "_") + '.png';
}
function updateDisplay() {
    Array.from(document.getElementsByClassName("admin")).forEach((ele) => {
        let myEle = ele;
        myEle.style.display = (iSettings.admin ? 'inline-block' : 'none');
    });
    hands.forEach((h) => {
        h.div.style.display = (h.enabled ? 'inline-block' : 'none');
    });
    document.getElementById('playerMoney').innerText = "$" + currentMoney.toLocaleString();
    document.getElementById('inBet').value = currentBet.toLocaleString();
    document.getElementById('chkAdmin').checked = iSettings.admin;
}
