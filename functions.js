export function showSection(sectionId) {
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.hidden = false;
    }
}

export function hideSection(sectionId) {
    // Hide the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.hidden = true;
    }
}

export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function clearData(key) {
    localStorage.removeItem(key);
}

export function getParticipants() {
    return loadData('participants') || [];
}

export function getAllTimes() {
    return getParticipants().sort((a, b) => a.time - b.time);
}

export function addParticipant(name, phone, time) {
    const participants = getParticipants();
    participants.push({ name, phone, time, created: new Date().toISOString() });
    saveData('participants', participants);
}

export function deleteParticipant(name, phone) {
    const participants = getParticipants().filter((participant) => {
        return !(participant.name === name && participant.phone === phone);
    });
    saveData('participants', participants);
}

export function clearParticipants() {
    clearData('participants');
}

export function drawRandomWinner() {
    const participants = getParticipants();
    if (participants.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
}