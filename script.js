const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue = null;

// Items array
const items = [
    { name: "anjing", image: "anjing.png" },
    { name: "anjinglaut", image: "anjinglaut.png" },
    { name: "ayam", image: "ayam.png" },
    { name: "banteng", image: "banteng.png" },
    { name: "bebek", image: "bebek.png" },
    { name: "beruang", image: "beruang.png" },
    { name: "besar", image: "besar.png" },
    { name: "burunghantu", image: "burunghantu.png" },
    { name: "domba", image: "domba.png" },
    { name: "embe", image: "embe.png" },
    { name: "gajah", image: "gajah.png" },
    { name: "hawimau", image: "hawimau.png" },
    { name: "kambing", image: "kambing.png" },
    { name: "kodok", image: "kodok.png" },
    { name: "kucing", image: "kucing.png" },
    { name: "kuda", image: "kuda.png" },
    { name: "merak", image: "merak.png" },
    { name: "monyet", image: "monyet.png" },
    { name: "penguin", image: "penguin.png" },
    { name: "puyuh", image: "puyuh.png" },
    { name: "sapi", image: "sapi.png" },
    { name: "tupai", image: "tupai.png" },
    { name: "babi", image: "babi.png" },
    { name: "siput", image: "siput.png" },
    { name: "rubah", image: "rubah.png" },
    { name: "naga", image: "naga.png" },
    { name: "kepiting", image: "kepiting.png" },
    { name: "lobster", image: "lobster.png" },
    { name: "jerapah", image: "jerapah.png" },
    { name: "camar", image: "camar.png" },
    { name: "lebah", image: "lebah.png" },
    { name: "kelinci", image: "kelinci.png" },
];

// Initial Time
let seconds = 0,
    minutes = 0;
// Initial Moves and Win Count
let movesCount = 0,
    winCount = 0;

// Timer function
const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
};

// Moves function
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (size = 8) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2; // misal 4x4 -> 8 pasang
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

// Generate matrix and render card HTML
const matrixGenerator = (cardValues, size = 8) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues]; // double for pairs
    cardValues.sort(() => Math.random() - 0.5); // shuffle
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
    gameContainer.style.gridTemplateRows = `repeat(${size}, auto)`;

    for (let i = 0; i < size * size; i++) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card-container");
        cardDiv.setAttribute("data-card-value", cardValues[i].name);

        // front side (before flip)
        const cardBefore = document.createElement("div");
        cardBefore.classList.add("card-before");
        cardBefore.textContent = "?";

        // back side (after flip)
        const cardAfter = document.createElement("div");
        cardAfter.classList.add("card-after");
        const img = document.createElement("img");
        img.src = cardValues[i].image;
        img.alt = cardValues[i].name;
        img.style.width = "70%";
        img.style.height = "70%";
        cardAfter.appendChild(img);

        cardDiv.appendChild(cardBefore);
        cardDiv.appendChild(cardAfter);

        gameContainer.appendChild(cardDiv);
    }

    // Add click event to cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (
                !card.classList.contains("matched") &&
                !card.classList.contains("flipped") &&
                secondCard === false
            ) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue === secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        secondCard = false;
                        winCount += 1;
                        // Win condition
                        if (winCount === cardValues.length / 2) {
                            result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

// Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    winCount = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

// Stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

// Initialize values and functions
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
};