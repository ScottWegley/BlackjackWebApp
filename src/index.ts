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

let settings: BlackjackSettings = new BlackjackSettings();

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
        settings.update(sessionStorage.getItem('blackjacksettings'));
    }
    (document.getElementById('inDecks') as HTMLInputElement).value = settings.decks.toString();
    (document.getElementById('inCash') as HTMLInputElement).value = settings.cashStart.toString();
    (document.getElementById('inAdmin') as HTMLInputElement).checked = settings.admin;
    console.log(settings)
    var form = (document.getElementById('formSettings') as HTMLFormElement);
    form.addEventListener('submit', (ev: SubmitEvent) => {
        ev.preventDefault();
        if (validateSettings()) {
            settings.decks = (document.getElementById('inDecks') as HTMLInputElement).valueAsNumber;
            settings.cashStart = (document.getElementById('inCash') as HTMLInputElement).valueAsNumber;
            settings.admin = (document.getElementById('inAdmin') as HTMLInputElement).checked;
            sessionStorage.setItem('blackjacksettings', settings.toJSON());
            window.location.href = './game.html'
        }
    });
}

function validateSettings(): boolean {
    console.log('validating')
    if ((document.getElementById('inDecks') as HTMLInputElement).valueAsNumber * (document.getElementById('inCash') as HTMLInputElement).valueAsNumber <= 0) {
        return false;
    }
    return true;
}