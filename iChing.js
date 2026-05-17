// ask button
function askQuestion() {
    const userQuestion = document.getElementById("userQuestion").value;
    if(userQuestion.trim() === "") {
        alert("Please enter a question.");
        return;
    } else {
        document.getElementById("askP").innerHTML = "Your question: " + userQuestion;    
        document.getElementById("userQuestion").style.display = "none";
        document.getElementById("askButton").style.display = "none";
        document.getElementById("tossContainer").style.display = "grid";
    }
}

// return a random boolean value, with a 30% chance of being true and a 70% chance of being false
function randomBoolean() {
    if(Math.random() < .35) {
        return 3;
    } else {
        return 2;
    }
} 
// simulate tossing three coins and return the corresponding I Ching line type string, image and binary value (0 for yin, 1 for yang).
function coinToss() {
    let threeCoins = [];
    for(let i= 0; i<3; i++) {
        threeCoins.push(randomBoolean()); 
        }
    let csum = threeCoins.reduce((a, b) => a + b, 0);
    let lName = "";
    let lImg = "";
    if(csum === 6) {
        lName = "Changing Yin";
        lImg = "img/yin6.png";
        bi = 0;
    } else if(csum === 7) {
        lName = "Stable Yang";
        lImg = "img/yang7.png";
        bi = 1;
    } else if(csum === 8) {
        lName = "Stable Yin";
        lImg = "img/yin8.png";
        bi = 0;
    } else if(csum === 9) {
        lName = "Changing Yang";
        lImg = "img/yang9.png";
        bi = 1;
    }
    return {
        text:`${lName} (${threeCoins[0]}+${threeCoins[1]}+${threeCoins[2]}=${csum})`,
        img: lImg,
        number: csum,
        rBi: bi
    };      
}
// create a new div element for each line generated, containing the line type text and image, and prepend it to the lineValues div
function createLineElement(lineName) {
    const lineDiv = document.getElementById("lineValues");
    const container = document.createElement("div");
    container.classList.add("lineContainer");
    const lineElement = document.createElement("p");
    lineElement.textContent = lineName.text;
    lineElement.classList.add("lineText");
    
    const imgElement = document.createElement("img");
    imgElement.src = lineName.img;
    
    container.appendChild(imgElement);
    container.appendChild(lineElement);
    lineDiv.prepend(container);

}
//function makeBinary(biArray)
//    biArray.

function divinationResult() {
    // This function will be called after all 6 lines are generated
    // It will determine the hexagram based on the line types and display the result
    // You can use the line types to look up the corresponding hexagram in your Hexagrams.json file
    // Then display the hexagram name, image, judgement, and description in the hexagramContainer div
    let reverseBi = biNum.reverse().join("");
    let syBi = parseInt(reverseBi, 2);
    console.log(biNum);
    console.log(reverseBi);
    console.log(lineTypes)
    console.log(syBi);

}

let tossCount = 0;
let lineTypes = [];
let biNum = [];

function multipleFunctions() {
    if(tossCount >= 6) return;
    const result = coinToss();
    lineTypes.push(result.number);
    biNum.push(result.rBi);
    createLineElement(result);
    tossCount++;
    let togo = 6 - tossCount;
    document.getElementById("tossBtnMessage").textContent = ` ${togo} to go.`;
    if(tossCount === 6) {
        document.getElementById("tossButton").style.display = "none";
        document.getElementById("tossBtnMessage").style.display = "none";
        
        divinationResult();
    }
}
console.log();