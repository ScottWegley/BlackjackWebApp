"use strict";
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
let settings = new BlackjackSettings();
window.addEventListener('load', () => {
    startIndex();
});
function startIndex() {
    var _a;
    if (sessionStorage.getItem('blackjacksettings') === null) {
        console.log('Settings do not exist');
        settings = new BlackjackSettings();
        sessionStorage.setItem('blackjacksettings', settings.toJSON());
    }
    else {
        console.log('Settings already exist');
        settings.update(sessionStorage.getItem('blackjacksettings'));
    }
    document.getElementById('inDecks').value = settings.decks.toString();
    document.getElementById('inCash').value = settings.cashStart.toString();
    document.getElementById('inAdmin').checked = settings.admin;
    console.log(settings);
    (_a = document.getElementById('formSettings')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (ev) => {
        ev.preventDefault();
        if (validateSettings()) {
            settings.decks = document.getElementById('inDecks').valueAsNumber;
            settings.cashStart = document.getElementById('inCash').valueAsNumber;
            settings.admin = document.getElementById('inAdmin').checked;
            sessionStorage.setItem('blackjacksettings', settings.toJSON());
            window.location.href = './game.html';
        }
    });
}
function validateSettings() {
    console.log('validating');
    if (document.getElementById('inDecks').valueAsNumber * document.getElementById('inCash').valueAsNumber <= 0) {
        return false;
    }
    return true;
}
