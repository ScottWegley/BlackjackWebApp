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
        if (this.value[0] == this.value[1]) {
            return this.value[0];
        } else if (this.value[0] > this.value[1] && this.value[0] <= 21) {
            return this.value[0];
        }
        else {
            return this.value[1];
        }
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

//let active: boolean = true;
let iSettings: GameSettings;
let dealerPile: Pile, discardPile: Pile;
let currentMoney: number, currentBet: number;
let dealerHand: Hand, playerHand1: Hand, playerHand2: Hand;
let hands: Hand[];
let roundStarted: boolean;
let btnBet: HTMLButtonElement;
let inBet: HTMLInputElement;
let btnStand: HTMLButtonElement, btnHit: HTMLButtonElement, btnDD: HTMLButtonElement, btnSplit: HTMLButtonElement, btnSurrender: HTMLButtonElement;
let admin1: HTMLButtonElement, admin2: HTMLButtonElement, admin3: HTMLButtonElement, admin4: HTMLButtonElement;
let gStarted: HTMLElement, rStarted: HTMLElement, pDealer: HTMLElement, pPlayer1: HTMLElement, pPlayer2: HTMLElement;

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

    btnBet.addEventListener('click', () => {
        currentBet = parseInt(inBet.value);
        if (currentBet <= 0 || currentBet > currentMoney || isNaN(currentBet)) {
            inBet.value = '0';
            return;
        } else {
            roundStarted = true;
            currentMoney -= currentBet;
            inBet.value = currentBet.toString();
            dealHands();
        }
    });

    btnSplit.addEventListener('click', () => {
        playerHand2.enabled = true;
        playerHand2.push(playerHand1.pop()!);
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
    currentBet = 0;

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

function gameSetup(): void {
    dealerPile = new Pile(52 * iSettings.decks);
    discardPile = new Pile(dealerPile.maxSize);
    for (let i = 0; i < iSettings.decks; i++) {
        dealerPile.add(new Deck());
    }

    dealerPile.shuffle();
}

function dealHands(): void {
    if(dealerPile.currentSize <= 4) {
        while(discardPile.currentSize > 0){
            dealerPile.push(discardPile.pop()!);
        }
    }
    hands.forEach((h: Hand) => {
        if (h.enabled) {
            h.push(dealerPile.deal()!).push(dealerPile.deal()!);
        }
    });
    dealerHand.cards[0].visible = false;

    checkForBlackjack()

    updateDisplay();
    return;
}

function checkForBlackjack(): void {
    if (dealerHand.evaluate() == 21) {
        dealerWin();
        return;
    }
    if(playerHand1.evaluate() == 21){
        playerWin(true);
        return;
    }

}

function dealerWin(): void {
    alert("The dealer wins this round with a " + dealerHand.evaluate().toString() + " from a " + dealerHand.toStringList() + "!");
    prepNextRound();
}

function playerWin(blackjack?:boolean): void {
    let winningHand: Hand = ((playerHand1.evaluate() > playerHand2.evaluate()) ? playerHand1 : playerHand2);
    let spoils: number = ((blackjack) ? 2.5 * currentBet : 2 * currentBet)
    alert("You win $" + spoils.toLocaleString() + " this round with a " + winningHand.evaluate().toString() + " from " + winningHand.toStringList() + "!");
    currentMoney += spoils;
    prepNextRound();
}

function prepNextRound(): void {
    currentBet = 0;
    roundStarted = false;
    hands.forEach((h: Hand) => {
        while (!(h.currentSize == 0)) {
            discardPile.push(h.pop()!)
        }
    });
    playerHand2.enabled = false;
    updateDisplay();
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
            if (!c.visible) { outImg.setAttribute('id', 'hiddenImg'); }
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

    inBet.value = (roundStarted ? currentBet.toLocaleString() : inBet.value) ;
    btnBet.disabled = inBet.disabled = roundStarted;

    rStarted.textContent = "Round Started: " + roundStarted.valueOf();

    (document.getElementById('playerMoney') as HTMLElement).innerText = "$" + currentMoney.toLocaleString();
    (document.getElementById('chkAdmin') as HTMLInputElement).checked = iSettings.admin;
}