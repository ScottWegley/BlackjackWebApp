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

class Card {
    value: Value;
    suit: Suit;
    visible: Boolean = true;

    constructor(inValue: Value, inSuit: Suit) {
        this.value = inValue;
        this.suit = inSuit;
    }

    toString = (): string => { //Override to string.
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

    toString = (): string => {
        var s: string = "";
        for (let i = 0; i < this.currentSize; i++) {
            s += this.cards[i].toString() + "\n";
        }
        return s;
    }

    details = (): string => {
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

    constructor(div: HTMLDivElement) {
        super(1);
        this.value = [0, 0];
        this.div = div;
    }

    push(inCard: Card): Pile {
        if (this.currentSize == this.maxSize) {
            this.maxSize++;
        }
        super.push(inCard);
        return this;
    }

    updateValue(): void {

    }
}

//let active: boolean = true;
let iSettings: GameSettings;
let dealerPile: Pile, discardPile: Pile;
let currentMoney: number, currentBet: number;
let dealerHand: Hand, playerHand1: Hand, playerHand2: Hand;
let hands: Hand[];
let gameStarted: boolean;
let roundStarted: boolean;
let btnBet: HTMLButtonElement;
let inBet: HTMLInputElement;
let btnStand:HTMLButtonElement, btnHit:HTMLButtonElement, btnDD:HTMLButtonElement, btnSplit:HTMLButtonElement, btnSurrender:HTMLButtonElement;
let admin1: HTMLButtonElement, admin2: HTMLButtonElement, admin3: HTMLButtonElement, admin4: HTMLButtonElement;
let gStarted: HTMLElement, rStarted: HTMLElement, pDealer:HTMLElement, pPlayer1:HTMLElement, pPlayer2:HTMLElement;

window.addEventListener('load', () => {
    startGame();
})

function startGame(): void {
    iSettings = new GameSettings();
    iSettings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(iSettings.toJSON());

    gameStarted = false;
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
            if (!gameStarted) {
                gameStarted = true;
                gameSetup();
            }
            roundStarted = true;
            currentMoney -= currentBet;
            inBet.value = currentBet.toString();
            updateDisplay();
        }
    });

    inBet.addEventListener('change', () => {
        if (roundStarted) {
            inBet.value = currentBet.toString();
        }
    });

    dealerHand = new Hand(document.getElementById('dealerHand') as HTMLDivElement);
    playerHand1 = new Hand(document.getElementById('playerHand1') as HTMLDivElement);
    playerHand2 = new Hand(document.getElementById('playerHand2') as HTMLDivElement);

    pDealer = document.getElementById('pDealer') as HTMLElement;
    pPlayer1 = document.getElementById('pPlayer1') as HTMLElement;
    pPlayer2 = document.getElementById('pPlayer2') as HTMLElement;

    playerHand2.enabled = false;

    hands = [dealerHand, playerHand1, playerHand2];

    currentMoney = iSettings.cashStart;
    currentBet = 0;

    updateDisplay();

}

function adminOne(): void {


}

function adminTwo(): void {

}

function adminThree(): void {

}

function adminFour(): void {

}

function gameSetup(): void {

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

function initialDeal(): void {
    hands.forEach((h: Hand) => {
        if (h.enabled) {
            let toDeal = dealerPile.deal()!;
            h.push(toDeal);
            h.div.replaceChildren();
            let outImg = document.createElement('img');
            outImg.src = cardToPath(toDeal);
            h.div.appendChild(outImg);
        }
    });
}

function cardToPath(inCard: Card): string {
    let base = './src/imgs/';
    return base + inCard.toString().toLowerCase().replace(" ", "_") + '.png';
}

function updateDisplay(): void {
    Array.from(document.getElementsByClassName("admin")).forEach((ele: Element) => {
        let myEle = ele as HTMLElement;
        myEle.style.display = (iSettings.admin ? 'inline-block' : 'none');
    });
    
    hands.forEach((h: Hand) => {
        h.div.style.display = (h.enabled ? 'inline-block' : 'none');
    });

    btnStand.style.display = (roundStarted ? 'inline-block' : 'none');
    btnHit.style.display = (roundStarted ? 'inline-block' : 'none');
    btnDD.style.display = ((roundStarted && currentMoney > currentBet) ? 'inline-block' : 'none');
    btnSplit.style.display = ((roundStarted && !playerHand2.enabled) ? 'inline-block' : 'none');
    btnSurrender.style.display = (roundStarted ? 'inline-block' : 'none');

    btnBet.disabled = roundStarted;
    (document.getElementById('playerMoney') as HTMLElement).innerText = "$" + currentMoney.toLocaleString();
    (document.getElementById('inBet') as HTMLInputElement).value = currentBet.toLocaleString();
    (document.getElementById('chkAdmin') as HTMLInputElement).checked = iSettings.admin;
}