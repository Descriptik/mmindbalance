// Relaxation Timer
let timerInterval;
let seconds = 0;
const audio = new Audio();

function startTimer() {
    stopTimer();
    const music = document.getElementById('musicSelect').value;
    if (music) {
        audio.src = `${music}.mp3`; // Assume we have these files
        audio.play();
    }
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    audio.pause();
    seconds = 0;
    document.getElementById('timer').textContent = '00:00';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.getElementById('customMusic').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio.src = URL.createObjectURL(file);
    }
});

// Chatbot
function sendMessage() {
    const input = document.getElementById('chatInput');
    const display = document.getElementById('chatDisplay');
    const message = input.value.trim();
    
    if (message) {
        display.innerHTML += `<p>You: ${message}</p>`;
        display.innerHTML += `<p>Bot: Thanks for sharing! How do you feel about that?</p>`;
        input.value = '';
        display.scrollTop = display.scrollHeight;
        updateProgress();
    }
}

// Goals and Chart
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Progress',
            data: [],
            borderColor: '#3498db',
            tension: 0.1
        }]
    }
});

let goals = [];

function addGoal() {
    const input = document.getElementById('goalInput');
    const goal = input.value.trim();
    if (goal) {
        goals.push({ text: goal, completed: false });
        input.value = '';
        updateGoalsList();
        updateProgress();
    }
}

function updateGoalsList() {
    const list = document.getElementById('goalsList');
    list.innerHTML = goals.map((goal, index) => `
        <div>
            <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${index})">
            ${goal.text}
        </div>
    `).join('');
}

function toggleGoal(index) {
    goals[index].completed = !goals[index].completed;
    updateProgress();
}

// Calendar
let events = [];

function addEvent() {
    const input = document.getElementById('eventInput');
    const date = document.getElementById('eventDate');
    if (input.value && date.value) {
        events.push({ text: input.value, date: date.value });
        input.value = '';
        date.value = '';
        updateCalendar();
    }
}

function updateCalendar() {
    const display = document.getElementById('calendarDisplay');
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    display.innerHTML = events.map(event => `
        <div>${event.date}: ${event.text}</div>
    `).join('');
}

// Progress
function updateProgress() {
    const completedGoals = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;
    const percentage = totalGoals > 0 ? (completedGoals / totalGoals * 100).toFixed(1) : 0;
    
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    
    const now = new Date();
    progressChart.data.labels.push(now.toLocaleDateString());
    progressChart.data.datasets[0].data.push(percentage);
    progressChart.update();
    
    const history = document.getElementById('progressHistory');
    history.innerHTML += `<div>${now.toLocaleString()}: ${percentage}%</div>`;
}
