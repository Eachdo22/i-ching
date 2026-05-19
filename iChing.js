function boldLabel(text) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = text;
    p.appendChild(strong);
    return p;
}

// tossCount and lineTypes track the six coin tosses that build one hexagram
let tossCount = 0;
let lineTypes = []; // raw sums (6–9) for each line, used to identify changing lines
let biNum = [];     // binary digits (0=yin, 1=yang) per line, bottom to top, for hexagram lookup

function askQuestion() {
    const userQuestion = document.getElementById("userQuestion").value;
    if (userQuestion.trim() === "") {
        alert("Please enter a question.");
        return;
    } else {
        document.getElementById("askP").textContent = "Your question: " + userQuestion;
        document.getElementById("userQuestion").style.display = "none";
        document.getElementById("askButton").style.display = "none";
        document.getElementById("tossContainer").style.display = "grid";
    }
}

// Returns 3 (heads/yang) or 2 (tails/yin); biased below 0.5 to weight yin slightly heavier
function randomBoolean() {
    if (Math.random() < .45) {
        return 3;
    } else {
        return 2;
    }
}

function coinToss() {
    let threeCoins = [];
    for (let i = 0; i < 3; i++) {
        threeCoins.push(randomBoolean());
    }
    // Each coin is 2 or 3, so the sum of three coins falls in the range 6–9
    const csum = threeCoins.reduce((a, b) => a + b, 0);
    // 6 = old yin (changes to yang), 7 = stable yang, 8 = stable yin, 9 = old yang (changes to yin)
    // rBi is the binary value of the line's *current* state: yin=0, yang=1
    const lineMap = {
        6: { name: "Changing Yin",  img: "img/yin6.png",  rBi: 0 },
        7: { name: "Stable Yang",   img: "img/yang7.png", rBi: 1 },
        8: { name: "Stable Yin",    img: "img/yin8.png",  rBi: 0 },
        9: { name: "Changing Yang", img: "img/yang9.png", rBi: 1 }
    };
    const { name, img, rBi } = lineMap[csum];
    return {
        text: `${name} (${threeCoins[0]}+${threeCoins[1]}+${threeCoins[2]}=${csum})`,
        img: img,
        number: csum,
        rBi: rBi
    };
}

// Lines are displayed newest-on-top so they read bottom-to-top (line 1 at the bottom)
function createLineElement(toss) {
    const lineDiv = document.getElementById("lineValues");
    const container = document.createElement("div");
    container.classList.add("lineContainer");
    const lineElement = document.createElement("p");
    lineElement.textContent = toss.text;
    lineElement.classList.add("lineText");
    const imgElement = document.createElement("img");
    imgElement.src = toss.img;
    container.appendChild(imgElement);
    container.appendChild(lineElement);
    lineDiv.prepend(container); // prepend so each new line appears above the previous one
}

function divinationResult() {
    // hexagramData uses the top line as the MSB, so biNum (bottom-first) must be reversed
    // before joining into a binary string and parsing to an integer for lookup
    const reverseBi = [...biNum].reverse().join(""); // spread to avoid mutating the module-level biNum
    const syBi = parseInt(reverseBi, 2);

    // hexagramData is a global object loaded from hexagrams.js; each entry has a `sy` field
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

    // Sums 6 (old yin) and 9 (old yang) are the two changing line types
    const lineNames = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    const hasChanging = lineTypes.some(t => t === 6 || t === 9);
    if (!hasChanging) return;

    const changingContainer = document.getElementById("changingLinesContainer");

    changingContainer.appendChild(boldLabel("Changing Lines"));

    // When every line changes, tradition uses a single special reading instead of per-line entries
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

    // Derive the secondary hexagram by flipping each changing line (yin↔yang, i.e. 0↔1)
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

// A hexagram requires exactly 6 lines; guard against extra button presses
function handleToss() {
    if (tossCount >= 6) return;
    const result = coinToss();
    lineTypes.push(result.number);
    biNum.push(result.rBi);
    createLineElement(result);
    tossCount++;
    const togo = 6 - tossCount;
    document.getElementById("tossBtnMessage").textContent = ` ${togo} to go.`;
    if (tossCount === 6) {
        divinationResult();
    }
}
