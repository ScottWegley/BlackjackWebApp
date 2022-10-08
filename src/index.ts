let settings: BlackjackSettings;

window.addEventListener('load', () => {
    startIndex();
}); 


function startIndex(): void {
    if(sessionStorage.getItem('settings') === null){ //Only true if page loads for the first time because we load the default settings
        console.log("No settings exist");
        console.log(settings);
        settings = new BlackjackSettings();
        console.log(settings);
    }
}

class BlackjackSettings {
    decks: number = 6;
    cashStart: number = 2000;
    admin: boolean = true;

    constructor(iDecks?:number, iCash?:number, iAdmin?:boolean){
        if(typeof iDecks === 'undefined' || typeof iCash === 'undefined' || typeof iAdmin === 'undefined'){
            return;
        }
        else{
            this.decks = iDecks;
            this.cashStart = iCash;
            this.admin = iAdmin;
        }
    }
}