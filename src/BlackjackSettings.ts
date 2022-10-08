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