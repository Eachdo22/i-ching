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

// return a random boolean value, with a 45% chance of being true and a 55% chance of being false
function randomBoolean() {
    if(Math.random() < .45) {
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
    let bi;
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

function divinationResult() {
    const reverseBi = [...biNum].reverse().join("");
    const syBi = parseInt(reverseBi, 2);

    let hexagram = null;
    let hexagramKey = null;
    for (const key in hexagramData) {
        if (hexagramData[key].sy === syBi) {
            hexagram = hexagramData[key];
            hexagramKey = key;
            break;
        }
    }
    if (!hexagram) return;

    document.getElementById("tossContainer").style.display = "none";

    const imgEl = document.getElementById("hexagramImage");
    imgEl.src = hexagram.png;
    imgEl.alt = hexagram.name;
    document.getElementById("hexagramName").textContent = `${hexagramKey}. ${hexagram.name}`;
    document.getElementById("hexagramOverallImage").textContent = hexagram["overall image"];
    document.getElementById("hexagramImageDescription").textContent = hexagram["image description"];
    document.getElementById("hexagramJudgement").textContent = hexagram.judgement;
    document.getElementById("hexagramJudgementDescription").textContent = hexagram["judgement description"];
    document.getElementById("hexagramContainer").style.display = "block";

    const lineNames = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    const hasChanging = lineTypes.some(t => t === 6 || t === 9);
    if (!hasChanging) return;

    const changingContainer = document.getElementById("changingLinesContainer");

    function boldLabel(text) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = text;
        p.appendChild(strong);
        return p;
    }

    changingContainer.appendChild(boldLabel("Changing Lines"));

    if (lineTypes.every(t => t === 6 || t === 9)) {
        const entry = hexagram.changing["all"];
        if (entry) {
            const p = document.createElement("p");
            p.textContent = entry.text;
            changingContainer.appendChild(p);
        }
    } else {
        lineTypes.forEach((type, i) => {
            if (type !== 6 && type !== 9) return;
            const entry = hexagram.changing[lineNames[i]];
            if (!entry) return;
            changingContainer.appendChild(boldLabel(`${lineNames[i]} line`));
            const p = document.createElement("p");
            p.textContent = entry.text;
            changingContainer.appendChild(p);
        });
    }

    const newBiNum = biNum.map((bit, i) =>
        (lineTypes[i] === 6 || lineTypes[i] === 9) ? 1 - bit : bit
    );
    const newSyBi = parseInt([...newBiNum].reverse().join(""), 2);

    for (const key in hexagramData) {
        if (hexagramData[key].sy !== newSyBi) continue;
        const newHex = hexagramData[key];

        changingContainer.appendChild(boldLabel(`Changes to: ${key}. ${newHex.name}`));

        const newImg = document.createElement("img");
        newImg.src = newHex.png;
        newImg.alt = newHex.name;
        changingContainer.appendChild(newImg);

        changingContainer.appendChild(boldLabel("Overall Image"));
        const newOverallImage = document.createElement("p");
        newOverallImage.textContent = newHex["overall image"];
        changingContainer.appendChild(newOverallImage);
        const newImageDesc = document.createElement("p");
        newImageDesc.textContent = newHex["image description"];
        changingContainer.appendChild(newImageDesc);
        break;
    }
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
        divinationResult();
    }
}