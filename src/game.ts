class GameSettings {
    decks: number;
    cashStart: number;
    admin: boolean;

    constructor(iDecks: number = 6, iCash: number = 2000, iAdmin: boolean = true) {
        this.decks = iDecks;
        this.cashStart = iCash;
        this.admin = iAdmin
    }

    toJSON(): string { //Slight misnomer but it makes sense to me.  Returns JSON String, not actual object
        return JSON.stringify({ 'decks': this.decks, 'cashStart': this.cashStart, 'admin': this.admin });
    }

    update(inSettings: string | null): void { //Fast way to update settings variable from session storage
        if (typeof inSettings === 'string') {
            var temp = JSON.parse(inSettings);
            this.decks = temp.decks;
            this.cashStart = temp.cashStart;
            this.admin = temp.admin;
        }
    }
}

const backOfCard: string = "./src/imgs/card_back.png";

const suits = ["Clubs", "Diamonds", "Spades", "Hearts"] as const;
type Suit = typeof suits[number]; //Weird way of doing it but allows mes to iterate through so.

const values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"] as const;
type Value = typeof values[number];

type Owner = "DEALER" | "PLAYER";

class Card {
    value: Value;
    suit: Suit;
    visible: Boolean = true;

    constructor(inValue: Value, inSuit: Suit) {
        this.value = inValue;
        this.suit = inSuit;
    }

    toString(): string { //Override to string.
        return this.value + " of " + this.suit;
    }

    static genCard(): Card {
        return new Card(values[Math.floor(Math.random() * (values.length - 1))], suits[Math.floor(Math.random() * (suits.length - 1))]);
    }

    static genCards(cNum: number): Card[] | null {
        if (cNum < 0) { return null; }
        var outCards: Card[] = new Array<Card>(cNum);
        for (let i = 0; i < cNum; i++) {
            outCards[i] = Card.genCard();
        }
        return outCards;
    }

    imgPath(): string {
        return (this.visible ? ('./src/imgs/' + (this.value + '_of_' + this.suit).toLowerCase() + '.png') : (backOfCard));
    }
}

class Pile {
    maxSize: number;
    currentSize: number;
    cards: Card[];

    constructor(inSize: number) {
        this.maxSize = inSize
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }

    pop(): Card | undefined {
        if (this.currentSize <= 0) {
            return;
        }
        this.currentSize--;
        return this.cards.pop();
    }

    add(input: Card[] | Pile | null): Pile {
        if (input instanceof Pile) {
            if (this.currentSize + input.currentSize <= this.maxSize) {
                input.cards.forEach((inCard: Card) => {
                    this.push(inCard);
                });
            }
        } else if (input != null) {
            if (this.currentSize + input.length <= this.maxSize) {
                input.forEach((inCard: Card) => {
                    this.push(inCard);
                });
            }
        }
        return this;
    }

    deal(): Card | undefined {
        let returnVal = this.cards.pop();
        if (returnVal instanceof Card) {
            this.currentSize--;
        }
        return returnVal;
    }

    push(inCard: Card): Pile {
        if (this.currentSize < this.maxSize) {
            this.currentSize++;
            this.cards[this.currentSize - 1] = inCard;
        }
        return this;
    }

    shuffle(): Pile {
        if (this.currentSize == 0) { return this; }
        var cIndex: number = this.currentSize - 1;
        var rIndex: number;
        while (cIndex != 0) {
            rIndex = Math.floor(Math.random() * cIndex);
            [this.cards[cIndex], this.cards[rIndex]] = [this.cards[rIndex], this.cards[cIndex]];
            cIndex--;
        }
        return this;
    }

    toString(): string {
        if (this.currentSize == 0) return '';
        var s: string = "";
        for (let i = 0; i < this.currentSize; i++) {
            s += this.cards[i].toString() + "\n";
        }
        return s;
    }

    toStringList(): string {
        if (this.currentSize == 0) return '';
        var s: string = "";
        for (let i = 0; i < this.currentSize - 1; i++) {
            s += this.cards[i].toString() + ", "
        }
        s += "and " + this.cards[this.currentSize - 1].toString();
        return s;
    }

    details(): string {
        return "Pile<" + this.currentSize + "/" + this.maxSize + ">";
    }
}

class Deck extends Pile {
    constructor() {
        super(52);
        values.forEach(tValue => {
            suits.forEach(tSuit => {
                this.push(new Card(tValue, tSuit));
            })
        })
    }
}

class Hand extends Pile {
    value: number[];
    div: HTMLDivElement;
    enabled: boolean = true;
    owner: Owner;
    busted: boolean = false;

    constructor(div: HTMLDivElement, owner: Owner) {
        super(1);
        this.value = [0, 0];
        this.div = div;
        this.owner = owner;
    }

    pop(): Card | undefined {
        let returnVal = super.pop();
        if (returnVal instanceof Card) {
            return returnVal;
        }
        if (this.evaluate() <= 21) this.busted = false;
        return;
    }

    push(inCard: Card): Pile {
        if (this.currentSize == this.maxSize) {
            this.maxSize++;
        }
        super.push(inCard);
        if (this.evaluate() > 21) this.busted = true;
        return this;
    }

    evaluate(): number {
        this.updateValue();
        if (Math.max(this.value[0], this.value[1]) <= 21) {
            return Math.max(this.value[0], this.value[1]);
        }
        return Math.min(this.value[0], this.value[1]);
    }

    toString(): string {
        if (this.currentSize == 0) return '';
        let s: string = 'Hand Values: ' + ((this.value[0] == this.value[1]) ? this.value[0] : this.value[0] + ', ' + this.value[1]);

        return s + '\n' + super.toString();
    }

    updateValue(): void {
        this.value = [0, 0]
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

class HandManager {
    h1: Hand;
    h2: Hand;
    ch: Hand;
    first: boolean;

    constructor(h1: Hand, h2: Hand) {
        this.h1 = h1;
        this.h2 = h2;
        this.ch = h1;
        this.first = true;
    }

    update(): void {
        if (this.first && this.h2.enabled && !this.h2.busted) {
            this.ch = this.h2;
            this.first = false;
            return;
        }
        else if (!this.first && !this.h1.busted) {
            this.ch = this.h1;
            this.first = true;
            return;
        }
        return;
    }
}


let iSettings: GameSettings;
let dealerPile: Pile, discardPile: Pile;
let currentMoney: number, currentBets: number[];
let dealerHand: Hand, playerHand1: Hand, playerHand2: Hand;
let hm: HandManager;
let hands: Hand[];
let roundStarted: boolean;
let btnBet: HTMLButtonElement;
let inBet: HTMLInputElement;
let btnStand: HTMLButtonElement, btnHit: HTMLButtonElement, btnDD: HTMLButtonElement, btnSplit: HTMLButtonElement, btnSurrender: HTMLButtonElement;
let admin1: HTMLButtonElement, admin2: HTMLButtonElement, admin3: HTMLButtonElement, admin4: HTMLButtonElement;
let gStarted: HTMLElement, rStarted: HTMLElement, pDealer: HTMLElement, pPlayer1: HTMLElement, pPlayer2: HTMLElement, bet2: HTMLElement;

window.addEventListener('load', () => {
    startGame();
})

function startGame(): void {
    iSettings = new GameSettings();
    iSettings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(iSettings.toJSON());

    roundStarted = false;

    admin1 = document.getElementById('btnAdmin1') as HTMLButtonElement;
    admin2 = document.getElementById('btnAdmin2') as HTMLButtonElement;
    admin3 = document.getElementById('btnAdmin3') as HTMLButtonElement;
    admin4 = document.getElementById('btnAdmin4') as HTMLButtonElement;

    btnStand = document.getElementById('btnStand') as HTMLButtonElement;
    btnHit = document.getElementById('btnHit') as HTMLButtonElement;
    btnDD = document.getElementById('btnDD') as HTMLButtonElement;
    btnSplit = document.getElementById('btnSplit') as HTMLButtonElement;
    btnSurrender = document.getElementById('btnSurrender') as HTMLButtonElement;

    gStarted = document.getElementById('gStarted') as HTMLElement;
    rStarted = document.getElementById('rStarted') as HTMLElement;

    bet2 = document.getElementById('bet2') as HTMLElement;

    admin1.addEventListener('click', () => { adminOne() });
    admin2.addEventListener('click', () => { adminTwo() });
    admin3.addEventListener('click', () => { adminThree() });
    admin4.addEventListener('click', () => { adminFour() });

    var chkAdmin: HTMLInputElement = document.getElementById('chkAdmin') as HTMLInputElement;

    chkAdmin.addEventListener('change', () => {
        iSettings.admin = chkAdmin.checked;
        updateDisplay();
    });

    btnBet = document.getElementById('btnBet') as HTMLButtonElement;
    inBet = document.getElementById('inBet') as HTMLInputElement;
    inBet.value = '0';

    btnBet.addEventListener('click', () => {
        if (isNaN(parseInt(inBet.value)) || parseInt(inBet.value) <= 0 || parseInt(inBet.value) > currentMoney) {
            inBet.value = '0';
            return;
        } else {
            currentBets[0] = parseInt(inBet.value);
            roundStarted = true;
            currentMoney -= currentBets[0];
            dealHands();
        }
    });

    btnSplit.addEventListener('click', () => {
        playerHand2.enabled = true;
        playerHand2.push(playerHand1.pop()!);
        currentMoney -= currentBets[0];
        currentBets[1] = currentBets[0];
        dealTo(playerHand1);
        dealTo(playerHand2);
        updateDisplay();
    });

    btnHit.addEventListener('click', () => {
        dealTo(hm.ch);
        updateDisplay();
        if (hm.ch.busted) {
            setTimeout(() => { alert('Busted') }, 185);
            if (hm.first) {
                if (playerHand2.enabled) {
                    hm.update();
                    updateDisplay();
                } else {
                    setTimeout(() => { dealerWin(); }, 185);
                    return;
                }
            } else {
                dealerResolve();
            }
        }
    });

    btnStand.addEventListener('click', () => {
        if (hm.first) {
            if (playerHand2.enabled) {
                hm.update();
                updateDisplay();
            } else {
                dealerResolve();
            }
        } else {
            dealerResolve();
        }
    });

    btnSurrender.addEventListener('click', () => {
        hm.ch.busted = true;
        currentBets[(+ !hm.first)] = 0;
        if (hm.first) {
            if (playerHand2.enabled) {
                hm.update();
                updateDisplay();
            } else {
                dealerWin();
            }
        } else {
            dealerResolve();
        }
    });

    btnDD.addEventListener('click', () => {
        currentMoney -= currentBets[(+ !hm.first)];
        console.log(currentMoney);
        currentBets[(+ !hm.first)] *= 2;
        console.log(currentBets[(+ !hm.first)]);
        dealTo(hm.ch);
        updateDisplay();
        if (hm.ch.busted) {
            setTimeout(() => { alert('Busted') }, 185);
            if (hm.first) {
                if (playerHand2.enabled) {
                    hm.update();
                } else {
                    setTimeout(() => { dealerWin() }, 185);
                    return;
                }
            } else {
                dealerResolve();
            }
        } else {
            if(hm.first){
                if(playerHand2.enabled){
                    hm.update();
                } else {
                    dealerResolve();
                }
            } else {
                dealerResolve();
            }
        }
        updateDisplay();
    });


    dealerHand = new Hand(document.getElementById('dealerHand') as HTMLDivElement, 'DEALER');
    playerHand1 = new Hand(document.getElementById('playerHand1') as HTMLDivElement, 'PLAYER');
    playerHand2 = new Hand(document.getElementById('playerHand2') as HTMLDivElement, 'PLAYER');

    pDealer = document.getElementById('pDealer') as HTMLElement;
    pPlayer1 = document.getElementById('pPlayer1') as HTMLElement;
    pPlayer2 = document.getElementById('pPlayer2') as HTMLElement;

    playerHand2.enabled = false;

    hands = [dealerHand, playerHand1, playerHand2];

    currentMoney = iSettings.cashStart;
    currentBets = [0, 0];

    hm = new HandManager(playerHand1, playerHand2);

    gameSetup();

    updateDisplay();

}

function adminOne(): void {
    dealerWin();
}

function adminTwo(): void {
    playerWin();
}

function adminThree(): void {

}

function adminFour(): void {

}

function dealTo(h: Hand, i?: number): void {
    if (typeof i != 'number') { i = 1; }
    if (dealerPile.currentSize <= 1) {
        while (discardPile.currentSize > 0) {
            dealerPile.push(discardPile.pop()!);
        }
    }
    if (i > 0) { h.push(dealerPile.deal()!); }
    else { return; }
    dealTo(h, --i);
}

function gameSetup(): void {
    dealerPile = new Pile(52 * iSettings.decks);
    discardPile = new Pile(dealerPile.maxSize);
    for (let i = 0; i < iSettings.decks; i++) {
        dealerPile.add(new Deck());
    }

    dealerPile.shuffle();
}

function dealHands(): void {
    hands.forEach((h: Hand) => {
        if (h.enabled) {
            dealTo(h, 2);
        }
    });
    dealerHand.cards[0].visible = false;

    updateDisplay();
    setTimeout(() => { checkForBlackjack() }, 185);

    return;
}

function checkForBlackjack(): void {
    if (dealerHand.evaluate() == 21) {
        dealerWin();
        return;
    }
    if (playerHand1.evaluate() == 21) {
        playerWinHand1(true);
        return;
    }
    return;
}

function dealerWin(): void {
    alert("The dealer wins this round with a " + dealerHand.evaluate().toString() + " from a " + dealerHand.toStringList() + "!");
    prepNextRound();
}

function playerWin(): void {
    if (!playerHand1.busted) { playerWinHand1(); }
    if (!playerHand2.busted && playerHand2.enabled) { playerWinHand2(); }
}

function playerWinHand1(blackjack?: boolean): void {
    let spoils: number = ((blackjack) ? 2.5 * currentBets[0] : 2 * currentBets[0]);
    alert("You win $" + spoils.toLocaleString() + " this round with a " + playerHand1.evaluate().toString() + " from " + playerHand1.toStringList() + "!");
    currentMoney += spoils;
    if(blackjack) prepNextRound();
}

function playerWinHand2(): void {
    let spoils: number = 2 * currentBets[1];
    alert("You win $" + spoils.toLocaleString() + " this round with a " + playerHand2.evaluate().toString() + " from " + playerHand2.toStringList() + "!");
    currentMoney += spoils;
}

function pushHand1(): void {
    alert('You pushed with the dealer with a ' + playerHand1.evaluate().toString() + " from " + playerHand1.toStringList() + "!")
}

function pushHand2(): void {
    alert('You pushed with the dealer with a ' + playerHand2.evaluate().toString() + " from " + playerHand2.toStringList() + "!")
}

function prepNextRound(): void {
    currentBets = [0, 0];
    inBet.value = '0';
    roundStarted = false;
    hands.forEach((h: Hand) => {
        while (!(h.currentSize == 0)) {
            discardPile.push(h.pop()!);
            discardPile.cards[discardPile.currentSize - 1].visible = true;
        }
    });
    playerHand2.enabled = false;
    hm.ch = playerHand1;
    hm.first = true;
    updateDisplay();
}

function dealerResolve() {

    dealerHand.cards[0].visible = true;
    updateDisplay();
    while (dealerHand.evaluate() < 17) {
        dealTo(dealerHand);
        updateDisplay();
    }
    setTimeout(() => { evalAllHands() }, 185);

}

function evalAllHands(): void {
    let dealerWins = true;
    if (dealerHand.busted) {
        dealerWins = false;
        playerWin();
    }
    if (playerHand1.evaluate() == dealerHand.evaluate()) {
        pushHand1();
        dealerWins = false;
    }
    if (playerHand1.evaluate() > dealerHand.evaluate() && !playerHand1.busted) {
        playerWinHand1();
        dealerWins = false;
    }
    if (playerHand2.enabled && !playerHand2.busted) {
        if (dealerHand.evaluate() == playerHand2.evaluate()) {
            pushHand2();
            dealerWins = false;
        }
        if (playerHand2.evaluate() > dealerHand.evaluate()) {
            playerWinHand2();
            dealerWins = false;
        }
    }

    if (dealerWins) dealerWin();
    else prepNextRound();
    return;
}

function updateDisplay(): void {
    Array.from(document.getElementsByClassName("admin")).forEach((ele: Element) => {
        let myEle = ele as HTMLElement;
        myEle.style.display = (iSettings.admin ? 'inline-block' : 'none');
    });

    hands.forEach((h: Hand) => {
        h.div.style.display = (h.enabled ? 'inline-block' : 'none');
        h.div.replaceChildren();
        h.cards.forEach((c: Card) => {
            let outImg: HTMLImageElement = document.createElement('img');
            outImg.src = c.imgPath();
            outImg.style.width = '55px';
            outImg.style.height = '80px';
            outImg.style.paddingTop = '5px';
            outImg.style.paddingBottom = '1px';
            if (!c.visible) { outImg.setAttribute('id', 'hiddenImg'); }
            h.div.appendChild(outImg);
        });
    });

    btnStand.style.display = (roundStarted ? 'inline-block' : 'none');
    btnHit.style.display = (roundStarted ? 'inline-block' : 'none');
    btnDD.style.display = ((roundStarted && currentMoney > currentBets[(+ !hm.first)]) ? 'inline-block' : 'none');
    btnSplit.style.display = ((currentMoney >= currentBets[0] && roundStarted && !playerHand2.enabled && playerHand1.currentSize == 2 && (playerHand1.cards[0].value == playerHand1.cards[1].value || (new Array('Ten', 'Jack', 'Queen', 'King').includes(playerHand1.cards[0].value) && new Array('Ten', 'Jack', 'Queen', 'King').includes(playerHand1.cards[1].value)))) ? 'inline-block' : 'none');
    btnSurrender.style.display = (roundStarted ? 'inline-block' : 'none');
    playerHand1.div.style.display = (roundStarted ? 'inline-block' : 'none');

    bet2.style.display = (playerHand2.enabled ? 'inline-block' : 'none');

    playerHand1.div.style.marginRight = playerHand2.div.style.marginLeft = (playerHand2.enabled ? '5px' : '0px');

    if (roundStarted) {
        (playerHand1.div.firstElementChild as HTMLElement).style.paddingLeft = (playerHand1.div.lastElementChild as HTMLElement).style.paddingRight = '5px';
        if (playerHand2.enabled) {
            (playerHand2.div.firstElementChild as HTMLElement).style.paddingLeft = (playerHand2.div.lastElementChild as HTMLElement).style.paddingRight = '5px';
        }
    }

    playerHand1.div.style.borderColor = playerHand2.div.style.borderColor = 'white';
    (hm.first ? playerHand1.div.style.borderColor = 'green' : playerHand2.div.style.borderColor = 'green');

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

    while (pDealer.offsetHeight < Math.max(pPlayer1.offsetHeight, pPlayer2.offsetHeight)) {
        pDealer.textContent += '\n';
    }

    while (pPlayer1.offsetHeight < Math.max(pDealer.offsetHeight, pPlayer2.offsetHeight)) {
        pPlayer1.textContent += '\n';
    }

    while (pPlayer2.offsetHeight < Math.max(pPlayer1.offsetHeight, pDealer.offsetHeight)) {
        pPlayer2.textContent += '\n';
    }

    inBet.value = (roundStarted ? currentBets[0].toLocaleString() : inBet.value);
    btnBet.disabled = inBet.disabled = roundStarted;
    bet2.textContent = '2nd Bet: $' + currentBets[1].toLocaleString();

    rStarted.textContent = "Round Started: " + roundStarted.valueOf();

    (document.getElementById('playerMoney') as HTMLElement).innerText = "$" + currentMoney.toLocaleString();
    (document.getElementById('chkAdmin') as HTMLInputElement).checked = iSettings.admin;
}
