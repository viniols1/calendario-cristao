const liturgicalData = {
    "2025-11-28": { 
        saint: "Sta. Catarina Labouré", 
        color: "green", 
        type: "Tempo Comum", 
        reading: "Apocalipse 20,1-4.11-21,2",
        psalm: "Eis a morada de Deus entre os homens.",
        moon: "Crescente",
        fasting: false 
    },
    "2025-12-08": { 
        saint: "Imaculada Conceição", 
        color: "gold", 
        type: "Solenidade", 
        reading: "Lucas 1, 26-38",
        psalm: "Cantai ao Senhor um cântico novo, porque ele fez maravilhas.",
        moon: "Cheia",
        fasting: false
    },
    "2025-12-25": { 
        saint: "Natal do Senhor", 
        color: "gold", 
        type: "Solenidade", 
        reading: "João 1, 1-18",
        psalm: "Os confins do universo contemplaram a salvação do nosso Deus.",
        moon: "Minguante",
        fasting: false
    },
    "2026-03-29": {
        saint: "Paixão do Senhor",
        color: "red",
        type: "Tríduo Pascal",
        reading: "João 18, 1-19",
        psalm: "Meu Deus, meu Deus, por que me abandonastes?",
        moon: "Cheia",
        fasting: true
    },
    "default": { 
        saint: "Féria", 
        color: "green", 
        type: "Tempo Comum", 
        reading: "Leitura do saltério do dia.",
        psalm: "O Senhor é o pastor que me conduz; não me falta coisa alguma.",
        moon: "Nova",
        fasting: false
    }
};

const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const monthYearElement = document.getElementById('monthYear');
const daysGrid = document.getElementById('daysGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Painel
const infoPanel = document.getElementById('infoPanel');
const panelDate = document.getElementById('panelDate');
const panelWeekday = document.getElementById('panelWeekday');
const panelSaint = document.getElementById('panelSaint');
const panelLitType = document.getElementById('panelLitType');
const panelReading = document.getElementById('panelReading');
const panelPrayer = document.getElementById('panelPrayer');
const seasonProgress = document.getElementById('seasonProgress');
const fastingIcon = document.getElementById('fastingIcon');
const moonLabel = document.getElementById('moonLabel');
const moonVisual = document.getElementById('moonVisual');
const clockTime = document.getElementById('clock-time');

let currentDate = new Date();

startBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    startClock();
});

function startClock() {
    function update() {
        const now = new Date();
        clockTime.textContent = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    }
    update();
    setInterval(update, 1000);
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
    monthYearElement.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

    daysGrid.innerHTML = "";

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        daysGrid.appendChild(document.createElement('div'));
    }

    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        
        const currentLoopDate = new Date(year, month, i);
        const yearStr = currentLoopDate.getFullYear();
        const monthStr = String(currentLoopDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(currentLoopDate.getDate()).padStart(2, '0');
        const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
        
        const data = liturgicalData[dateKey] || liturgicalData["default"];

        dayDiv.innerHTML = `
            <div class="liturgy-dot" style="color: var(--color-${data.color})"></div>
            <span class="day-number">${i}</span>
            <span class="day-tag">${data.saint}</span>
        `;

        dayDiv.addEventListener('click', () => {
            document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
            dayDiv.classList.add('active');
            updatePanel(currentLoopDate, data, i, lastDay);
        });

        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('active');
            updatePanel(currentLoopDate, data, i, lastDay);
        }

        daysGrid.appendChild(dayDiv);
    }
}

function updatePanel(date, data, dayNumber, totalDays) {
    const container = document.querySelector('.selected-day-info');
    container.style.opacity = '0.5';

    setTimeout(() => {
        container.style.opacity = '1';
        
        panelDate.textContent = date.getDate();
        panelWeekday.textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
        panelSaint.textContent = data.saint;
        panelLitType.textContent = data.type;
        panelReading.textContent = `"${data.reading}"`;
        panelPrayer.textContent = data.psalm;
        
        const colorVar = `var(--color-${data.color})`;
        panelLitType.style.color = colorVar;
        panelLitType.style.borderColor = colorVar;
        seasonProgress.style.backgroundColor = colorVar;
        
        const progressPercentage = (dayNumber / totalDays) * 100;
        seasonProgress.style.width = `${progressPercentage}%`;

        if (data.fasting) {
            fastingIcon.style.display = 'inline-block';
        } else {
            fastingIcon.style.display = 'none';
        }

        updateMoonVisual(data.moon);

    }, 150);
}

function updateMoonVisual(phase) {
    moonLabel.textContent = phase;
    moonVisual.style.backgroundColor = 'transparent';
    moonVisual.style.border = 'none';
    moonVisual.style.boxShadow = 'none';

    if (phase === "Cheia") {
        moonVisual.style.backgroundColor = '#fff';
        moonVisual.style.boxShadow = '0 0 15px rgba(255,255,255,0.6)';
    } else if (phase === "Nova") {
        moonVisual.style.border = '1px solid #444';
    } else if (phase === "Crescente") {
        moonVisual.style.boxShadow = 'inset 10px 0px 0 0 #fff';
        moonVisual.style.transform = 'rotate(-15deg)';
    } else if (phase === "Minguante") {
        moonVisual.style.boxShadow = 'inset -10px 0px 0 0 #fff';
        moonVisual.style.transform = 'rotate(15deg)';
    } else {
        moonVisual.style.border = '1px solid #666';
        moonVisual.style.backgroundColor = 'rgba(255,255,255,0.1)';
    }
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);