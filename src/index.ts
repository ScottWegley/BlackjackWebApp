let settings: BlackjackSettings;

window.addEventListener('load', () => {
    startIndex();
});


function startIndex(): void {
    if (sessionStorage.getItem('blackjacksettings') === null) { //If settings not in storage, create settings and store
        console.log('Settings do not exist');
        settings = new BlackjackSettings();
        sessionStorage.setItem('blackjacksettings', settings.toJSON());
    } else {
        console.log('Settings already exist');
        settings = new BlackjackSettings();
        settings.update(sessionStorage.getItem('blackjacksettings'));
        console.log(sessionStorage.getItem('blackjacksettings'));
        console.log(settings);
    }
}

class BlackjackSettings {
    decks: number;
    cashStart: number;
    admin: boolean;

    constructor(iDecks: number = 6, iCash: number = 2000, iAdmin: boolean = true) {
        this.decks = iDecks;
        this.cashStart = iCash;
        this.admin = iAdmin
    }

    toJSON(): string {
        return JSON.stringify({'decks': this.decks, 'cashStart': this.cashStart, 'admin':this.admin});
    }

    update(inSettings: string | null): void{
        if(typeof inSettings === 'string'){
            var temp = JSON.parse(inSettings);
            this.decks = temp.decks;
            this.cashStart = temp.cashStart;
            this.admin = temp.admin;
        }
    } 
}