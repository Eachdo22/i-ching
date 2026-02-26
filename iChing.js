
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
    let c1 = randomBoolean();
    let c2 = randomBoolean();
    let c3 = randomBoolean();
    let csum = c1 + c2 + c3;
    if(csum === 6) {
        return "Changing Yin";
    } else if(csum === 7) {
        return "Stable Yang";
    } else if(csum === 8) {
        return "Stable Yin";
    } else if(csum === 9) {
        return "Changing Yang";
    }
}
toss1 = coinToss()
console.log(toss1);