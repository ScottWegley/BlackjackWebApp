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
const backOfCard = "./src/imgs/card_back.png";
const suits = ["Clubs", "Diamonds", "Spades", "Hearts"];
const values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
class Card {
    constructor(inValue, inSuit) {
        this.visible = true;
        this.value = inValue;
        this.suit = inSuit;
    }
    toString() {
        return this.value + " of " + this.suit;
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
    imgPath() {
        return (this.visible ? ('./src/imgs/' + (this.value + '_of_' + this.suit).toLowerCase() + '.png') : (backOfCard));
    }
}
class Pile {
    constructor(inSize) {
        this.maxSize = inSize;
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }
    pop() {
        if (this.currentSize <= 0) {
            return;
        }
        this.currentSize--;
        return this.cards.pop();
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
    toString() {
        if (this.currentSize == 0)
            return '';
        var s = "";
        for (let i = 0; i < this.currentSize; i++) {
            s += this.cards[i].toString() + "\n";
        }
        return s;
    }
    toStringList() {
        if (this.currentSize == 0)
            return '';
        var s = "";
        for (let i = 0; i < this.currentSize - 1; i++) {
            s += this.cards[i].toString() + ", ";
        }
        s += "and " + this.cards[this.currentSize - 1].toString();
        return s;
    }
    details() {
        return "Pile<" + this.currentSize + "/" + this.maxSize + ">";
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
    constructor(div, owner) {
        super(1);
        this.enabled = true;
        this.value = [0, 0];
        this.div = div;
        this.owner = owner;
    }
    pop() {
        let returnVal = super.pop();
        if (returnVal instanceof Card) {
            return returnVal;
        }
        this.updateValue();
        return;
    }
    push(inCard) {
        if (this.currentSize == this.maxSize) {
            this.maxSize++;
        }
        super.push(inCard);
        this.updateValue();
        return this;
    }
    evaluate() {
        this.updateValue();
        if (this.value[0] == this.value[1]) {
            return this.value[0];
        }
        else if (this.value[0] > this.value[1] && this.value[0] <= 21) {
            return this.value[0];
        }
        else {
            return this.value[1];
        }
    }
    toString() {
        if (this.currentSize == 0)
            return '';
        let s = 'Hand Values: ' + ((this.value[0] == this.value[1]) ? this.value[0] : this.value[0] + ', ' + this.value[1]);
        return s + '\n' + super.toString();
    }
    updateValue() {
        this.value = [0, 0];
        this.cards.forEach((x) => {
            switch (x.value) {
                case 'Ace':
                    this.value[0] += 1;
                    this.value[1] += 11;
                    break;
                case 'Two':
                    this.value[0] += 2;
                    this.value[1] += 2;
                    break;
                case 'Three':
                    this.value[0] += 3;
                    this.value[1] += 3;
                    break;
                case 'Four':
                    this.value[0] += 4;
                    this.value[1] += 4;
                    break;
                case 'Five':
                    this.value[0] += 5;
                    this.value[1] += 5;
                    break;
                case 'Six':
                    this.value[0] += 6;
                    this.value[1] += 6;
                    break;
                case 'Seven':
                    this.value[0] += 7;
                    this.value[1] += 7;
                    break;
                case 'Eight':
                    this.value[0] += 8;
                    this.value[1] += 8;
                    break;
                case 'Nine':
                    this.value[0] += 9;
                    this.value[1] += 9;
                    break;
                default:
                    this.value[0] += 10;
                    this.value[1] += 10;
            }
        });
    }
}
let iSettings;
let dealerPile, discardPile;
let currentMoney, currentBet;
let dealerHand, playerHand1, playerHand2;
let hands;
let roundStarted;
let btnBet;
let inBet;
let btnStand, btnHit, btnDD, btnSplit, btnSurrender;
let admin1, admin2, admin3, admin4;
let gStarted, rStarted, pDealer, pPlayer1, pPlayer2;
window.addEventListener('load', () => {
    startGame();
});
function startGame() {
    iSettings = new GameSettings();
    iSettings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(iSettings.toJSON());
    roundStarted = false;
    admin1 = document.getElementById('btnAdmin1');
    admin2 = document.getElementById('btnAdmin2');
    admin3 = document.getElementById('btnAdmin3');
    admin4 = document.getElementById('btnAdmin4');
    btnStand = document.getElementById('btnStand');
    btnHit = document.getElementById('btnHit');
    btnDD = document.getElementById('btnDD');
    btnSplit = document.getElementById('btnSplit');
    btnSurrender = document.getElementById('btnSurrender');
    gStarted = document.getElementById('gStarted');
    rStarted = document.getElementById('rStarted');
    admin1.addEventListener('click', () => { adminOne(); });
    admin2.addEventListener('click', () => { adminTwo(); });
    admin3.addEventListener('click', () => { adminThree(); });
    admin4.addEventListener('click', () => { adminFour(); });
    var chkAdmin = document.getElementById('chkAdmin');
    chkAdmin.addEventListener('change', () => {
        iSettings.admin = chkAdmin.checked;
        updateDisplay();
    });
    btnBet = document.getElementById('btnBet');
    inBet = document.getElementById('inBet');
    btnBet.addEventListener('click', () => {
        currentBet = parseInt(inBet.value);
        if (currentBet <= 0 || currentBet > currentMoney || isNaN(currentBet)) {
            inBet.value = '0';
            return;
        }
        else {
            roundStarted = true;
            currentMoney -= currentBet;
            inBet.value = currentBet.toString();
            dealHands();
        }
    });
    btnSplit.addEventListener('click', () => {
        playerHand2.enabled = true;
        playerHand2.push(playerHand1.pop());
        updateDisplay();
    });
    dealerHand = new Hand(document.getElementById('dealerHand'), 'DEALER');
    playerHand1 = new Hand(document.getElementById('playerHand1'), 'PLAYER');
    playerHand2 = new Hand(document.getElementById('playerHand2'), 'PLAYER');
    pDealer = document.getElementById('pDealer');
    pPlayer1 = document.getElementById('pPlayer1');
    pPlayer2 = document.getElementById('pPlayer2');
    playerHand2.enabled = false;
    hands = [dealerHand, playerHand1, playerHand2];
    currentMoney = iSettings.cashStart;
    currentBet = 0;
    gameSetup();
    updateDisplay();
}
function adminOne() {
    dealerWin();
}
function adminTwo() {
    playerWin();
}
function adminThree() {
}
function adminFour() {
}
function gameSetup() {
    dealerPile = new Pile(52 * iSettings.decks);
    discardPile = new Pile(dealerPile.maxSize);
    for (let i = 0; i < iSettings.decks; i++) {
        dealerPile.add(new Deck());
    }
    dealerPile.shuffle();
}
function dealHands() {
    if (dealerPile.currentSize <= 4) {
        while (discardPile.currentSize > 0) {
            dealerPile.push(discardPile.pop());
        }
    }
    hands.forEach((h) => {
        if (h.enabled) {
            h.push(dealerPile.deal()).push(dealerPile.deal());
        }
    });
    dealerHand.cards[0].visible = false;
    checkForBlackjack();
    updateDisplay();
    return;
}
function checkForBlackjack() {
    if (dealerHand.evaluate() == 21) {
        dealerWin();
        return;
    }
    if (playerHand1.evaluate() == 21) {
        playerWin(true);
        return;
    }
}
function dealerWin() {
    alert("The dealer wins this round with a " + dealerHand.evaluate().toString() + " from a " + dealerHand.toStringList() + "!");
    prepNextRound();
}
function playerWin(blackjack) {
    let winningHand = ((playerHand1.evaluate() > playerHand2.evaluate()) ? playerHand1 : playerHand2);
    let spoils = ((blackjack) ? 2.5 * currentBet : 2 * currentBet);
    alert("You win $" + spoils.toLocaleString() + " this round with a " + winningHand.evaluate().toString() + " from " + winningHand.toStringList() + "!");
    currentMoney += spoils;
    prepNextRound();
}
function prepNextRound() {
    currentBet = 0;
    roundStarted = false;
    hands.forEach((h) => {
        while (!(h.currentSize == 0)) {
            discardPile.push(h.pop());
        }
    });
    playerHand2.enabled = false;
    updateDisplay();
}
function updateDisplay() {
    Array.from(document.getElementsByClassName("admin")).forEach((ele) => {
        let myEle = ele;
        myEle.style.display = (iSettings.admin ? 'inline-block' : 'none');
    });
    hands.forEach((h) => {
        h.div.style.display = (h.enabled ? 'inline-block' : 'none');
        h.div.replaceChildren();
        h.cards.forEach((c) => {
            let outImg = document.createElement('img');
            outImg.src = c.imgPath();
            outImg.style.width = '55px';
            outImg.style.height = '80px';
            if (!c.visible) {
                outImg.setAttribute('id', 'hiddenImg');
            }
            h.div.appendChild(outImg);
        });
    });
    btnStand.style.display = (roundStarted ? 'inline-block' : 'none');
    btnHit.style.display = (roundStarted ? 'inline-block' : 'none');
    btnDD.style.display = ((roundStarted && currentMoney > currentBet) ? 'inline-block' : 'none');
    btnSplit.style.display = ((roundStarted && !playerHand2.enabled) ? 'inline-block' : 'none');
    btnSurrender.style.display = (roundStarted ? 'inline-block' : 'none');
    pDealer.textContent = pPlayer1.textContent = pPlayer2.textContent = '';
    if (dealerHand.evaluate() != 0) {
        pDealer.textContent = 'DHand \n' + dealerHand.toString();
    }
    if (playerHand1.evaluate() != 0) {
        pPlayer1.textContent = 'P1Hand \n' + playerHand1.toString();
    }
    if (playerHand2.evaluate() != 0) {
        pPlayer2.textContent = 'P2Hand \n' + playerHand2.toString();
    }
    btnBet.disabled = inBet.disabled = roundStarted;
    rStarted.textContent = "Round Started: " + roundStarted.valueOf();
    document.getElementById('playerMoney').innerText = "$" + currentMoney.toLocaleString();
    document.getElementById('inBet').value = currentBet.toLocaleString();
    document.getElementById('chkAdmin').checked = iSettings.admin;
}
