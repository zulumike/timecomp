
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

function getBestTime() {
    const participants = functions.getParticipants();
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

function startTimer() {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 100);
    document.getElementById('startStopButton').textContent = 'Stopp';
}

function updateTimer() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = `${elapsedTime.toFixed(2)} sekunder`;
}

function stopTimer() {
    timerDisplay.textContent = '0 sekunder';
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
    // functions.hideSection('competition');
}

function newParticipant(name, phone) {
    if (!name || !phone) {
        alert('Vennligst fyll inn både navn og mobilnummer.');
        return;
    }
    timerDisplay.textContent = '0 sekunder';
    functions.hideSection('registration');
    functions.hideSection('highscore');
    currentParticipant = { name, phone };
    registrationForm.reset();
    participantNameDisplay.textContent = `Deltager: ${name}`;
    functions.showSection('competition');
    startStopButton.textContent = 'Start';
    startStopButton.hidden = false;
}

function initPage() {
    functions.hideSection('competition');
    functions.hideSection('result');
    functions.showSection('registration');
    functions.showSection('highscore');
    updateResultText('');
    updateHighscoreList();
}

initPage();