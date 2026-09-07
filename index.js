

registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;

    newParticipant(name, mobile);
});

startButton = document.getElementById('startButton');
stopButton = document.getElementById('stopButton');

function showSection(sectionId) {
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.hidden = false;
    }
}

function hideSection(sectionId) {
    // Hide the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.hidden = true;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function clearData(key) {
    localStorage.removeItem(key);
}

function addParticipant(name, phone, time) {
    const participants = loadData('participants') || [];
    participants.push({ name,
        phone,
        time,
        created: new Date().toISOString() });
    saveData('participants', participants);
}

function getParticipants() {
    return loadData('participants') || [];
}

function clearParticipants() {
    clearData('participants');
}

function getHighscores() {
    return getParticipants().sort((a, b) => a.time - b.time).slice(0, 10);
}

function drawRandomWinner() {
    const participants = getParticipants();
    if (participants.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
}

function getBestTime() {
    const participants = getParticipants();
    if (participants.length === 0) return null;
    return participants.reduce((best, participant) => {
        return participant.time < best.time ? participant : best;
    }, participants[0]);
}

function updateHighscoreList() {
    const highscoreList = document.getElementById('highscoreList');
    if (!highscoreList) return; 
    highscoreList.innerHTML = '';
    getHighscores().forEach(participant => {
        const li = document.createElement('li');
        li.textContent = `${participant.name}: ${participant.time}`;
        highscoreList.appendChild(li);
    });
}

function updateResultText(text) {
    const resultText = document.getElementById('resultText');
    if (resultText) {
        resultText.textContent = text;
    }
}

//Denne må fikses. FLytte logikk ut av denne funksjonen. og globalt kanskje.

function newParticipant(name, mobile) {
    let startTime;
    let intervalId;

    function startTimer() {
        startTime = Date.now();
        intervalId = setInterval(updateTimer, 100);
        document.getElementById('startButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
    }

    function stopTimer() {
        clearInterval(intervalId);
        const elapsedTime = (Date.now() - startTime) / 1000;
        addParticipant(name, mobile, elapsedTime);
        updateHighscoreList();
        updateResultText(`Ditt resultat: ${elapsedTime} sekunder`);
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    }

function initPage() {
    showSection('registration');
    showSection('highscore');
}
    