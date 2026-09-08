
import * as functions from '../functions.js';

const toCompButton = document.getElementById('toCompetition');
toCompButton.addEventListener('click', () => {
    window.location.href = '../index.html';
});

const drawWinnerButton = document.getElementById('drawWinnerButton');
const resetButton = document.getElementById('resetButton');
const winnerResultDiv = document.getElementById('winnerResult');
const allTimesListUl = document.getElementById('allTimesList');
const editButton = document.getElementById('editButton');

editButton.addEventListener('click', () => {
    if (editButton.textContent === 'Vis deltakere') {
        functions.showSection('allTimes');
        editButton.textContent = 'Skjul deltakere';
    }
    else {
        functions.hideSection('allTimes');
        editButton.textContent = 'Vis deltakere';
    }
});

function updateAllTimesList() {
    const allTimes = functions.getAllTimes();
    allTimesListUl.innerHTML = '';
    allTimes.forEach((participant, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.gap = '12px';
        li.style.marginBottom = '8px';

        const text = document.createElement('span');
        text.textContent = `${index + 1}. ${participant.name} - ${participant.phone} - ${participant.time.toFixed(2)} sekunder`;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Slett';
        deleteButton.addEventListener('click', () => {
            if (!confirm(`Er du sikker på at du vil slette ${participant.name}?`)) {
                return;
            }
            functions.deleteParticipant(participant.name, participant.phone);
            updateAllTimesList();
        });

        li.appendChild(text);
        li.appendChild(deleteButton);
        allTimesListUl.appendChild(li);
    });
}

function animateDraw() {
    const participants = functions.getParticipants();
    if (participants.length === 0) {
        winnerResultDiv.textContent = 'Ingen deltagere er registrert.';
        return;
    }
    const display = document.getElementById('winnerDisplay');
    let delay = 10;
    let iterations = 0;
    function spin() {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        display.textContent = `${randomParticipant.name} (${randomParticipant.phone})`;
        iterations++;
        delay += 15;
        if (iterations < 40) {
            setTimeout(spin, delay);
        }
        else {
            functions.saveData('winner', randomParticipant);
            display.textContent = `Vinner: ${randomParticipant.name} (${randomParticipant.phone})`;
        }
    }
    spin();
}

drawWinnerButton.addEventListener('click', () => {
    const existingWinner = functions.loadData('winner');
    let newDraw = true;
    if (existingWinner) {
        newDraw = confirm('Det er allerede foretatt trekning, Vinner: ' + existingWinner.name + ' ' + existingWinner.phone + '. Vil du foreta ny trekning?')
    }
    if (!newDraw) {
        return;
    }
    const winner = functions.drawRandomWinner();
    if (!winner) {
        winnerResultDiv.textContent = 'Ingen deltagere er registrert.';
        return;
    }
    functions.showSection('winnerDisplay');
    animateDraw();
});

resetButton.addEventListener('click', () => {
    if (!confirm('Er du sikker på at du vil nullstille konkurransen? Dette kan ikke angres.')) {
        return;
    }
    functions.clearParticipants();
    functions.clearData('winner');
    winnerResultDiv.textContent = 'Konkurransen er nullstilt.';
    updateAllTimesList();
});

if (prompt('Skriv inn admin-passordet:') === functions.adminCode) {
    updateAllTimesList();
}
else {
    alert('Feil passord. Du har ikke tilgang til admin-siden.');
    window.location.href = '/';
}

function initPage() {
    functions.hideSection('allTimes');
    functions.hideSection('winnerDisplay');
    updateAllTimesList();
}

initPage();