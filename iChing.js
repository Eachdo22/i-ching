

var askDiv = document.getElementById("questionSection");

//hide the tossing div until the question is asked
var tossDiv = document.getElementById("throwingSection");
tossDiv.style.display = "none";

//show the tossing div and hide the asking div when the question is asked
const questionForm = document.querySelector("questionForm");
questionForm.addEventListener("submit", function(event) {
    event.preventDefault();
    askDiv.style.display = "none";
    tossDiv.style.display = "block";
});

// return a random boolean value, with a 30% chance of being true and a 70% chance of being false
function randomBoolean() {
    if(Math.random() < .3) {
        return 3;
    } else {
        return 2;
    }
} 
// simulate tossing three coins and return the corresponding I Ching line type
function coinToss() {
    let threeCoins = [];
    for(let i= 0; i<3; i++) {
        threeCoins.push(randomBoolean()); 
        }
    let csum = threeCoins.reduce((a, b) => a + b, 0);
    let lName;
    if(csum === 6) {
        lName = "Changing Yin";
    } else if(csum === 7) {
        lName = "Stable Yang";
    } else if(csum === 8) {
        lName = "Stable Yin";
    } else if(csum === 9) {
        lName = "Changing Yang";
    }
    return `${lName} (${threeCoins[0]}+${threeCoins[1]}+${threeCoins[2]}=${csum})`;
}

console.log(coinToss());