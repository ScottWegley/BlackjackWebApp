"use strict";
let settings;
window.addEventListener('load', () => {
    startIndex();
});
function startIndex() {
    if (sessionStorage.getItem('settings') === null) {
        console.log("No settings exist");
        console.log(settings);
        settings = new BlackjackSettings();
        console.log(settings);
    }
}
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
