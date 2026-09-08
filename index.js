
import * as functions from './functions.js';

let startTime;
let intervalId;
let currentParticipant = null;

const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    newParticipant(name, phone);
});

const participantNameDisplay = document.getElementById('participantName');
const timerDisplay = document.getElementById('timer');

const startStopButton = document.getElementById('startStopButton');
startStopButton.addEventListener('click', function () {
    if (startStopButton.textContent === 'Start') {
        startTimer();
    } else {
        stopTimer();
    }
});

function getHighscores() {
    return functions.getParticipants().sort((a, b) => a.time - b.time).slice(0, 10);
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
    const totalParticipants = functions.getParticipants().length;
    const totalParticipantsP = document.createElement('p');
    totalParticipantsP.textContent = 'Totalt antall deltakere: ' + totalParticipants;
    document.getElementById('highscore').appendChild(totalParticipantsP);
}

function updateResultText(text) {
    const resultText = document.getElementById('resultText');
    if (resultText) {
        resultText.textContent = text;
    }
}

function startTimer() {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 100);
    document.getElementById('startStopButton').textContent = 'Stopp';
    document.addEventListener('keydown', (event) => {
        if (event.repeat) return; // Ignore repeated events
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            stopTimer();
        }
    },
    { once: true });
}

function updateTimer() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = `${elapsedTime.toFixed(2)} sekunder`;
}

function stopTimer() {
    timerDisplay.textContent = '';
    functions.showSection('result');
    clearInterval(intervalId);
    const elapsedTime = (Date.now() - startTime) / 1000;
    functions.addParticipant(currentParticipant.name, currentParticipant.phone, elapsedTime);
    const allTimes = functions.getAllTimes();
    const position = allTimes.findIndex(p => p.name === currentParticipant?.name && p.phone === currentParticipant?.phone) + 1;
    updateResultText(`Ditt resultat: ${elapsedTime} sekunder. Du er på ${position}. plass!`);
    startStopButton.textContent = 'Start';
    startStopButton.hidden = true;
    setTimeout(initPage, 5000);
}

function checkDuplicateParticipant(phone) {
    const participants = functions.getParticipants();
    const count = participants.filter( p => p.phone === phone).length;
    if (count > 1) {
        return true;
    }
    else return false;

}

function newParticipant(name, phone) {
    if (!name || !phone) {
        alert('Vennligst fyll inn både navn og mobilnummer.');
        return;
    }
    if (checkDuplicateParticipant(phone)) {
        alert('Denne deltakeren er allerede registrert 2 ganger.');
        return;
    }
    timerDisplay.textContent = '0 sekunder';
    functions.hideSection('start-screen');
    functions.hideSection('info');
    currentParticipant = { name, phone };
    registrationForm.reset();
    participantNameDisplay.textContent = `Deltager: ${name}`;
    functions.showSection('competition');
    startStopButton.textContent = 'Start';
    startStopButton.hidden = false;
    startStopButton.focus();
    document.addEventListener('keydown', (event) => {
        if (event.repeat) return; // Ignore repeated events
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            startTimer();
        }
        if (event.code === 'Escape') {
            event.preventDefault();
            initPage();
        }
    },
    { once: true });
}

function initPage() {
    functions.hideSection('competition');
    functions.hideSection('result');
    functions.showSection('info');
    functions.showSection('start-screen');
    document.getElementById('name').focus();
    updateResultText('');
    updateHighscoreList();
}

initPage();