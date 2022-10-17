class GameSettings {
    decks: number;
    cashStart: number;
    admin: boolean;

    constructor(iDecks: number = 6, iCash: number = 2000, iAdmin: boolean = true) {
        this.decks = iDecks;
        this.cashStart = iCash;
        this.admin = iAdmin
    }

    toJSON(): string { //SLight misnomer but it makes sense to me.  Returns JSON String, not actual object
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


const suits = ["Clubs", "Diamonds", "Spades", "Hearts"] as const;
type Suit = typeof suits[number]; //Weird way of doing it but allows mes to iterate through so.

const values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"] as const;
type Value = typeof values[number];

class Card {
    value: Value;
    suit: Suit;

    constructor(inValue: Value, inSuit: Suit) {
        this.value = inValue;
        this.suit = inSuit;
    }

    toString = (): string => { //Override to string.
        return this.value + " of " + this.suit;
    }
}

abstract class Pile {
    maxSize: number;
    currentSize: number;
    cards: Card[];

    constructor(inSize: number) {
        this.maxSize = inSize
        this.cards = new Array(this.maxSize);
        this.currentSize = 0;
    }

    add(inCard: Card): boolean {
        if (this.currentSize < this.maxSize) {
            this.cards.push(inCard);
            this.currentSize++;
            return true;
        } else {
            return false;
        }
    }

    shuffle(): void {
        if(this.currentSize == 0) {return;}
        var cIndex:number = this.currentSize;
        var rIndex: number;
        while(cIndex != 0){
            rIndex = Math.floor(Math.random() * cIndex);
            cIndex--;
            [this.cards[cIndex], this.cards[rIndex]] = [this.cards[rIndex], this.cards[cIndex]];
        }
    }
}

class Deck extends Pile {

    constructor() {
        super(52);
        values.forEach(tValue => {
            suits.forEach(tSuit => {
                this.cards.push(new Card(tValue, tSuit));
            })
        })
    }

}

let active: boolean = false;

window.addEventListener('load', () => {
    startGame();
})

function startGame(): void {
    var settings = new GameSettings();
    settings.update(sessionStorage.getItem('blackjacksettings'));
    console.log(settings.toJSON());

    var admin1: HTMLButtonElement = document.getElementById('btnAdmin1') as HTMLButtonElement;
    var admin2: HTMLButtonElement = document.getElementById('btnAdmin2') as HTMLButtonElement;
    var admin3: HTMLButtonElement = document.getElementById('btnAdmin3') as HTMLButtonElement;
    var admin4: HTMLButtonElement = document.getElementById('btnAdmin4') as HTMLButtonElement;

    admin1.addEventListener('click', () => { testOne() });
    admin2.addEventListener('click', () => { testTwo() });
    admin3.addEventListener('click', () => { testThree() });
    admin4.addEventListener('click', () => { testFour() });

    gameLoop();
}

function testOne(): void {

}

function testTwo(): void {

}

function testThree(): void {

}

function testFour(): void {

}

function gameLoop(): void {
    while (active) {

    }
}