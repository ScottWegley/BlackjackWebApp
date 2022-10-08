"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let settings;
window.addEventListener('load', () => {
    startIndex();
});
function startIndex() {
    if (sessionStorage.getItem('settings') === null) {
        console.log("No settings exist");
    }
}
