import defaultSettings from './settings.json';

let settings: string;

window.addEventListener('load', () => {
    startIndex();
}); 


function startIndex(): void {
    if(sessionStorage.getItem('settings') === null){
        console.log("No settings exist");
    }
}