"use strict";
class BlackjackSettings {
    constructor(iDecks, iCash, iAdmin) {
        this.decks = 6;
        this.cashStart = 2000;
        this.admin = true;
        if (typeof iDecks === 'undefined' || typeof iCash === 'undefined' || typeof iAdmin === 'undefined') {
            return;
        }
        else {
            this.decks = iDecks;
            this.cashStart = iCash;
            this.admin = iAdmin;
        }
    }
}
