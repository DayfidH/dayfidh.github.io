const songs = [
    { name: "Disease", rating: 1500 },
    { name: "Abracadabra", rating: 1500 },
    { name: "Garden of Eden", rating: 1500 },
    { name: "Perfect Celebrity", rating: 1500 },
    { name: "Can't Stop The High", rating: 1500 },
    { name: "Vanish Into You", rating: 1500 },
    { name: "Killah (feat. Gesaffelstein)", rating: 1500 },
    { name: "ZombieBoy", rating: 1500 },
    { name: "LoveDrug", rating: 1500 },
    { name: "How Bad Do U Want Me", rating: 1500 },
    { name: "Kill For Love", rating: 1500 },
    { name: "Don't Call Tonight", rating: 1500 },
    { name: "Shadow of a Man", rating: 1500 },
    { name: "The Beast", rating: 1500 },
    { name: "Blade of Grass", rating: 1500 },
    { name: "Die With a Smile (feat. Bruno Mars)", rating: 1500 }
];
const K = 32;
let currentPair = [];
let comparisonsCount = 0;
const maxComparisons = 10;

function expectedScore(r1, r2) {
    return 1 / (1 + Math.pow(10, (r2 - r1)/400));
}

function updateRatings(winner, loser) {
    const expWinner = expectedScore(winner.rating, loser.rating);
    const expLoser = expectedScore(loser.rating, winner.rating);
    winner.rating = winner.rating + K * (1 - expWinner);
    loser.rating = loser.rating + K * (0 - expLoser);
}

function pickPair() {
    const idx1 = Math.floor(Math.random() * songs.length);
    let idx2;
    do {
        idx2 = Math.floor(Math.random() * songs.length);
    } while (idx2 === idx1);
    currentPair = [songs[idx1], songs[idx2]];
}

function updateDuelUI() {
    document.getElementById("song1").textContent = currentPair[0].name;
    document.getElementById("song2").textContent = currentPair[1].name;
}

function nextDuel() {
    pickPair();
    updateDuelUI();
}

document.getElementById("song1").addEventListener("click", () => {
    if (comparisonsCount < maxComparisons) {
        updateRatings(currentPair[0], currentPair[1]);
        comparisonsCount++;
        updateRankingUI(); // Update ranking immediately after selection
        if (comparisonsCount >= maxComparisons) {
            document.getElementById("song1").disabled = true;
            document.getElementById("song2").disabled = true;
            promptForUsername(); // Prompt for username when comparison is over
        } else {
            nextDuel();
        }
    }
});

document.getElementById("song2").addEventListener("click", () => {
    if (comparisonsCount < maxComparisons) {
        updateRatings(currentPair[1], currentPair[0]);
        comparisonsCount++;
        updateRankingUI(); // Update ranking immediately after selection
        if (comparisonsCount >= maxComparisons) {
            document.getElementById("song1").disabled = true;
            document.getElementById("song2").disabled = true;
            promptForUsername(); // Prompt for username when comparison is over
        } else {
            nextDuel();
        }
    }
});

function updateRankingUI() {
    const progressText = `Comparisons: ${comparisonsCount} / ${maxComparisons}`;
    const sorted = songs.slice().sort((a, b) => b.rating - a.rating);
    const rankingList = `<h2>Ranking</h2><ol>${sorted.map(s => `<li>${s.name} (Rating: ${s.rating.toFixed(0)})</li>`).join('')}</ol>`;
    document.getElementById("ranking").innerHTML = `<p>${progressText}</p>` + rankingList;
}

function promptForUsername() {
    const username = prompt("Enter your username:");
    if (username) {
        generateRankingImage(username);
    }
}

function generateRankingImage(username) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/stats.jpg";
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`${username}'s MAYHEM Ranking`, 50, 50);
        const sorted = songs.slice().sort((a, b) => b.rating - a.rating);
        sorted.forEach((song, index) => {
            ctx.fillText(`${index + 1}. ${song.name} (Rating: ${song.rating.toFixed(0)})`, 50, 100 + index * 30);
        });
        const dataURL = canvas.toDataURL("image/png");
        const imgElement = document.createElement("img");
        imgElement.src = dataURL;
        imgElement.alt = `${username}'s MAYHEM Ranking`;
        const container = document.getElementById("generated-image-container");
        container.innerHTML = ""; // Clear previous image if any
        container.appendChild(imgElement);
    };
}

updateRankingUI();
nextDuel();

let usingVideo = true;
document.getElementById("toggleBackground").addEventListener("click", () => {
    const video = document.getElementById("background-video");
    if (usingVideo) {
        video.pause();
        video.currentTime = 0; // Set to the first frame
        usingVideo = false;
    } else {
        video.play();
        usingVideo = true;
    }
});
