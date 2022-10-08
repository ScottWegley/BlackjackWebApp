"use strict";
let settings;
window.addEventListener('load', () => {
    startIndex();
});
function startIndex() {
    if (sessionStorage.getItem('blackjacksettings') === null) {
        console.log('Settings do not exist');
        settings = new BlackjackSettings();
        sessionStorage.setItem('blackjacksettings', settings.toJSON());
    }
    else {
        console.log('Settings already exist');
        settings = new BlackjackSettings();
        settings.update(sessionStorage.getItem('blackjacksettings'));
        console.log(sessionStorage.getItem('blackjacksettings'));
        console.log(settings);
    }
}
class BlackjackSettings {
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
