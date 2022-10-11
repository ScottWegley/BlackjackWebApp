class GameSettings {
    decks: number;
    cashStart: number;
    admin: boolean;

    constructor(iDecks: number = 6, iCash: number = 2000, iAdmin: boolean = true) {
        this.decks = iDecks;
        this.cashStart = iCash;
        this.admin = iAdmin
    }

    toJSON(): string {
        return JSON.stringify({ 'decks': this.decks, 'cashStart': this.cashStart, 'admin': this.admin });
    }

    update(inSettings: string | null): void {
        if (typeof inSettings === 'string') {
            var temp = JSON.parse(inSettings);
            this.decks = temp.decks;
            this.cashStart = temp.cashStart;
            this.admin = temp.admin;
        }
    }
}

const enum Suit {
    CLUB = "Club",
    DIAMOND = "Diamond",
    SPADE = "Spade",
    HEART = "Heart"
}

const enum Value {
    ACE = "Ace",
    TWO = "Two",
    THREE = "Three",
    FOUR = "Four",
    FIVE = "Five",
    SIX = "Six",
    SEVEN = "Seven",
    EIGHT = "Eight",
    NINE = "Nine",
    TEN = "Ten",
    JACK = "Jack",
    QUEEN = "Queen",
    KING = "King"
}

class Card {
    suit: Suit;
    value: Value;

    constructor(inSuit: Suit, inValue: Value) {
        this.suit = inSuit;
        this.value = inValue;
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

    gameLoop();
}

function gameLoop(): void{
    while (active) {
        
    }
}