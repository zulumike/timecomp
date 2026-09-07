
import * as functions from '../functions.js';

const drawWinnerButton = document.getElementById('drawWinnerButton');
const resetButton = document.getElementById('resetButton');
const winnerResultDiv = document.getElementById('winnerResult');
const allTimesListUl = document.getElementById('allTimesList');

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
            winnerResultDiv.textContent = `${participant.name} ble slettet.`;
            updateAllTimesList();
        });

        li.appendChild(text);
        li.appendChild(deleteButton);
        allTimesListUl.appendChild(li);
    });
}

drawWinnerButton.addEventListener('click', () => {
    const winner = functions.drawRandomWinner();
    if (!winner) {
        winnerResultDiv.textContent = 'Ingen deltagere er registrert.';
        return;
    }

    winnerResultDiv.textContent = `Vinner: ${winner.name} (${winner.phone}) - ${winner.time.toFixed(2)} sekunder`;
});

resetButton.addEventListener('click', () => {
    if (!confirm('Er du sikker på at du vil nullstille konkurransen? Dette kan ikke angres.')) {
        return;
    }
    functions.clearParticipants();
    winnerResultDiv.textContent = 'Konkurransen er nullstilt.';
    updateAllTimesList();
});

updateAllTimesList();