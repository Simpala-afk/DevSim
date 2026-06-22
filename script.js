// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ И СИСТЕМА ИНИЦИАЛИЗАЦИИ
// ==========================================
let balance = 0;

window.onload = function() {
    setInterval(updateDonateButtonsTimers, 1000);
    // Создаем контейнер для кастомных уведомлений, если его нет
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    // Проверка первого захода
    if (!localStorage.getItem('has_visited')) {
        localStorage.setItem('has_visited', 'true');
        balance = 200;
        saveBalance();
    } else {
        balance = parseFloat(localStorage.getItem('user_balance')) || 0;
    }
    updateBalanceUI();
    updateBonusTimer();
    setInterval(updateBonusTimer, 1000); 
    generateRouletteTape(); 
};

// Кастомное стильное уведомление взамен alert()
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Плавное появление и исчезновение
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceUI();
}

function updateBalanceUI() {
    document.getElementById('balance-val').innerText = balance.toFixed(2);
}

function closeDisclaimer() {
    document.getElementById('disclaimer-modal').classList.remove('active');
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle-btn');
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        btn.innerText = "🌙 Тёмная тема";
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        btn.innerText = "☀️ Светлая тема";
    }
}

function switchTab(game, buttonElement) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    document.querySelectorAll('.game-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`game-${game}`).classList.add('active');
}

// Система ежечасного бонуса
function claimBonus() {
    const nextBonusTime = localStorage.getItem('next_bonus_time');
    const now = Date.now();
    if (!nextBonusTime || now >= nextBonusTime) {
        balance += 50;
        saveBalance();
        const oneHourLater = now + 3600000; 
        localStorage.setItem('next_bonus_time', oneHourLater);
        updateBonusTimer();
        showNotification("Вы получили ежечасный бонус 50 рублей!", "success");
    }
}

function updateBonusTimer() {
    const btn = document.getElementById('bonus-btn');
    const nextBonusTime = localStorage.getItem('next_bonus_time');
    const now = Date.now();
    if (!nextBonusTime || now >= nextBonusTime) {
        btn.disabled = false;
        btn.innerText = "Бонус (50₽)";
    } else {
        btn.disabled = true;
        const diff = nextBonusTime - now;
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        btn.innerText = `${minutes}м ${seconds}с`;
    }
}

// ==========================================
// РЕЖИМ 1: МИНЫ (MINES)
// ==========================================
let minesGameState = {
    active: false,
    isGameOver: false,
    bet: 0,
    minesCount: 0,
    board: [], 
    revealedCount: 0,
    currentMultiplier: 1.00
};

function startMinesGame() {
    const startBtn = document.getElementById('mines-start-btn');
    const betInput = document.getElementById('mines-bet');
    const countInput = document.getElementById('mines-count');

    if (minesGameState.isGameOver) {
        document.getElementById('mines-grid').innerHTML = '';
        startBtn.innerText = "Играть";
        startBtn.className = "btn btn-primary";
        betInput.disabled = false;
        countInput.disabled = false;
        document.getElementById('mines-status').innerText = "Установите ставку и начните игру";
        minesGameState.isGameOver = false;
        return;
    }

    const bet = parseFloat(betInput.value);
    const count = parseInt(countInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка или недостаточно средств!", "danger"); return; }
    if (isNaN(count) || count < 1 || count > 24) { showNotification("Количество мин должно быть от 1 до 24!", "danger"); return; }

    balance -= bet;
    saveBalance();

    minesGameState = {
        active: true,
        isGameOver: false,
        bet: bet,
        minesCount: count,
        board: Array(25).fill(false),
        revealedCount: 0,
        currentMultiplier: 1.00
    };

    let deployed = 0;
    while(deployed < count) {
        let index = Math.floor(Math.random() * 25);
        if(!minesGameState.board[index]) {
            minesGameState.board[index] = true;
            deployed++;
        }
    }

    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for(let i=0; i<25; i++) {
        let cell = document.createElement('div');
        cell.classList.add('mine-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => clickMineCell(i));
        grid.appendChild(cell);
    }

    startBtn.disabled = true;
    document.getElementById('mines-cashout-btn').disabled = false;
    betInput.disabled = true;
    countInput.disabled = true;
    updateMinesUI();
}

function clickMineCell(index) {
    if(!minesGameState.active) return;
    const cell = document.getElementById('mines-grid').children[index];
    if(cell.classList.contains('safe') || cell.classList.contains('exploded')) return;

    if(minesGameState.board[index]) {
        cell.classList.add('exploded');
        cell.innerText = "💣";
        endMinesGame(false);
    } else {
        cell.classList.add('safe');
        cell.innerText = "💎";
        minesGameState.revealedCount++;
        let n = 25 - minesGameState.revealedCount + 1;
        let m = n - minesGameState.minesCount;
        minesGameState.currentMultiplier *= (n / m);

        updateMinesUI();
        if(minesGameState.revealedCount === (25 - minesGameState.minesCount)) {
            cashoutMines();
        }
    }
}

// Система ежечасного бонуса и обновления интерфейса мин
function updateMinesUI() {
    const status = document.getElementById('mines-status');
    const cashoutBtn = document.getElementById('mines-cashout-btn');
    if(minesGameState.active) {
        status.innerText = `Множитель: ${minesGameState.currentMultiplier.toFixed(2)}x`;
        cashoutBtn.innerText = `Забрать ${(minesGameState.bet * minesGameState.currentMultiplier).toFixed(2)} ₽`;
    }
}

function cashoutMines() {
    if(!minesGameState.active) return;
    const winAmount = minesGameState.bet * minesGameState.currentMultiplier;
    balance += winAmount;
    saveBalance();
    showNotification(`Выиграно ${winAmount.toFixed(2)} ₽!`, "success");
    document.getElementById('mines-status').innerText = `Вы выиграли ${winAmount.toFixed(2)} ₽!`;
    endMinesGame(true);
}

function endMinesGame(isWin) {
    minesGameState.active = false;
    minesGameState.isGameOver = true;

    const startBtn = document.getElementById('mines-start-btn');
    startBtn.disabled = false;
    startBtn.innerText = "Новая игра";
    startBtn.className = "btn btn-secondary";

    document.getElementById('mines-cashout-btn').disabled = true;
    const gridCells = document.getElementById('mines-grid').children;
    for(let i=0; i<25; i++) {
        if(minesGameState.board[i]) {
            if(!gridCells[i].classList.contains('exploded')) {
                gridCells[i].innerText = "💣";
                gridCells[i].style.color = "var(--danger)";
            }
        }
    }
    if(!isWin) {
        document.getElementById('mines-status').innerText = "Взрыв! Ставка проиграна.";
        showNotification("Взрыв! Ставка проиграна.", "danger");
    }
}

// ==========================================
// РЕЖИМ 2: КРАШ (CRASH)
// ==========================================
let crashInterval;
let crashState = {
    running: false,
    isStage: 'bet', 
    bet: 0,
    currentMultiplier: 1.00,
    crashPoint: 0,
    hasBailed: false
};

function handleCrashAction() {
    const btn = document.getElementById('crash-btn');
    const betInput = document.getElementById('crash-bet');

    if (crashState.isStage === 'bet' && !crashState.running) {
        const bet = parseFloat(betInput.value);
        if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }

        balance -= bet;
        saveBalance();

        let rand = Math.random();
        let crashPoint = 1.01;
        if (rand > 0.08) {
            crashPoint = parseFloat((1.01 + (Math.random() * 3)).toFixed(2));
        }
        
        crashState = {
            running: true,
            isStage: 'game',
            bet: bet,
            currentMultiplier: 1.00,
            crashPoint: crashPoint,
            hasBailed: false
        };

        btn.innerText = "Забрать";
        btn.className = "btn btn-success";
        betInput.disabled = true;
        document.getElementById('crash-status').innerText = "График плавно растет...";

        crashInterval = setInterval(() => {
            crashState.currentMultiplier = parseFloat((crashState.currentMultiplier + 0.01).toFixed(2));
            document.getElementById('crash-multiplier').innerText = `${crashState.currentMultiplier.toFixed(2)}x`;

            if(crashState.currentMultiplier >= crashState.crashPoint) {
                clearInterval(crashInterval);
                triggerCrashExplosion();
            }
        }, 1000);

    } else if (crashState.isStage === 'game' && crashState.running) {
        if(crashState.hasBailed) return;
        crashState.hasBailed = true;
        
        const winAmount = crashState.bet * crashState.currentMultiplier;
        balance += winAmount;
        saveBalance();
        
        const msg = `Забрано: ${winAmount.toFixed(2)} ₽ (x${crashState.currentMultiplier.toFixed(2)})`;
        document.getElementById('crash-status').innerText = msg;
        showNotification(msg, "success");

        crashState.isStage = 'skip';
        btn.innerText = "Пропустить ожидание";
        btn.className = "btn btn-bonus"; 

    } else if (crashState.isStage === 'skip') {
        clearInterval(crashInterval);
        document.getElementById('crash-multiplier').innerText = `💥 БУМ! ${crashState.crashPoint.toFixed(2)}x`;
        document.getElementById('crash-multiplier').style.color = "var(--danger)";
        document.getElementById('crash-status').innerText = `Игра завершена искусственно. Максимум был: ${crashState.crashPoint.toFixed(2)}x.`;
        crashState.isStage = 'reset';
        btn.innerText = "Новая игра";
        btn.className = "btn btn-secondary";

    } else if (crashState.isStage === 'reset') {
        forceResetCrash();
    }
}

function triggerCrashExplosion() {
    document.getElementById('crash-multiplier').innerText = `💥 БУМ! ${crashState.crashPoint.toFixed(2)}x`;
    document.getElementById('crash-multiplier').style.color = "var(--danger)";
    document.getElementById('crash-status').innerText = `Крашнулось на ${crashState.crashPoint.toFixed(2)}x.`;
    showNotification(`Краш на ${crashState.crashPoint.toFixed(2)}x!`, "danger");
    crashState.running = false;
    crashState.isStage = 'reset';
    const btn = document.getElementById('crash-btn');
    btn.innerText = "Новая игра";
    btn.className = "btn btn-secondary";
}

function forceResetCrash() {
    clearInterval(crashInterval);
    crashState = {
        running: false,
        isStage: 'bet',
        bet: 0,
        currentMultiplier: 1.00,
        crashPoint: 0,
        hasBailed: false
    };
    const btn = document.getElementById('crash-btn');
    btn.innerText = "Ставка";
    btn.className = "btn btn-primary";
    btn.disabled = false;
    
    document.getElementById('crash-bet').disabled = false;
    document.getElementById('crash-multiplier').innerText = "1.00x";
    document.getElementById('crash-multiplier').style.color = "#fff";
    document.getElementById('crash-status').innerText = "Ожидание ставки...";
}

// ==========================================
// РЕЖИМ 3: РУЛЕТКА (ROULETTE)
// ==========================================
const rouletteOrder = ['green', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red'];
let isRouletteSpinning = false;
let isRouletteGameOver = false; 

function generateRouletteTape() {
    const tape = document.getElementById('roulette-tape');
    tape.innerHTML = '';
    for(let repeat = 0; repeat < 6; repeat++) {
        rouletteOrder.forEach((color, index) => {
            let cell = document.createElement('div');
            cell.className = `roulette-cell cell-${color}`;
            cell.innerText = index;
            tape.appendChild(cell);
        });
    }
    tape.style.transform = `translateX(-110px)`;
}

function placeRouletteBet(chosenColor) {
    if (isRouletteGameOver) {
        resetRouletteTable();
        return;
    }
    if(isRouletteSpinning) return;

    const betInput = document.getElementById('roulette-bet');
    const bet = parseFloat(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }
    
    balance -= bet;
    saveBalance();
    isRouletteSpinning = true;
    betInput.disabled = true;
    document.getElementById('roulette-status').innerText = "Колесо крутится...";

    const tape = document.getElementById('roulette-tape');
    const targetCellIndex = 45 + Math.floor(Math.random() * 15);
    const winningColor = rouletteOrder[targetCellIndex % 15];
    const cellWidth = 80; 
    const offset = (targetCellIndex * cellWidth) - 300 + (cellWidth / 2);

    tape.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)";
    tape.style.transform = `translateX(-${offset}px)`;

    const buttonsContainer = document.querySelector('.bet-buttons');

    setTimeout(() => {
        let multiplier = 0;
        if(chosenColor === winningColor) {
            multiplier = (chosenColor === 'green') ? 14 : 2;
            const winnings = bet * multiplier;
            balance += winnings;
            saveBalance();
            document.getElementById('roulette-status').innerText = `🎉 Выпал цвет: ${winningColor}. Выиграно ${winnings.toFixed(2)} ₽!`;
            showNotification(`Победа! +${winnings.toFixed(2)} ₽`, "success");
        } else {
            document.getElementById('roulette-status').innerText = `Проигрыш. Выпал цвет: ${winningColor}.`;
            showNotification(`Увы, выпал цвет: ${winningColor}`, "danger");
        }
        isRouletteSpinning = false;
        isRouletteGameOver = true; 
        buttonsContainer.innerHTML = `<button onclick="resetRouletteTable()" class="btn btn-secondary" style="width: 100%;">Новая игра (Сбросить поле)</button>`;
    }, 4100);
}

function resetRouletteTable() {
    isRouletteGameOver = false;
    isRouletteSpinning = false;
    
    document.getElementById('roulette-bet').disabled = false;
    document.getElementById('roulette-status').innerText = "Выберите сумму и нажмите на цвет";
    
    const tape = document.getElementById('roulette-tape');
    tape.style.transition = "none";
    tape.style.transform = `translateX(-110px)`;

    const buttonsContainer = document.querySelector('.bet-buttons');
    buttonsContainer.innerHTML = `
        <button onclick="placeRouletteBet('red')" class="btn btn-danger">Красное (x2)</button>
        <button onclick="placeRouletteBet('green')" class="btn btn-success">Зеленое (x14)</button>
        <button onclick="placeRouletteBet('black')" class="btn btn-dark">Черное (x2)</button>
    `;
}

// ==========================================
// РЕЖИМ 4: СЛОТЫ (SLOTS)
// ==========================================
const slotSymbols = ['🍒', '🍋', '🍉', '🍇', '💎', '7️⃣'];

function spinSlots() {
    const betInput = document.getElementById('slots-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка или недостаточно средств!", "danger"); return; }

    balance -= bet;
    saveBalance();

    document.getElementById('slots-status').innerText = "Слоты крутятся...";
    
    let intervals = [];
    let counter = 0;

    function randomizeReel(reelId) {
        let reel = document.getElementById(reelId);
        let randIndex = Math.floor(Math.random() * slotSymbols.length);
        reel.innerText = slotSymbols[randIndex];
    }

    intervals.push(setInterval(() => randomizeReel('reel-1'), 100));
    intervals.push(setInterval(() => randomizeReel('reel-2'), 100));
    intervals.push(setInterval(() => randomizeReel('reel-3'), 100));

    setTimeout(() => { clearInterval(intervals[0]); }, 1000);
    setTimeout(() => { clearInterval(intervals[1]); }, 1500);
    setTimeout(() => { 
        clearInterval(intervals[2]); 
        checkSlotsResult(bet);
    }, 2000);
}

function checkSlotsResult(bet) {
    const r1 = document.getElementById('reel-1').innerText;
    const r2 = document.getElementById('reel-2').innerText;
    const r3 = document.getElementById('reel-3').innerText;
    const status = document.getElementById('slots-status');

    if (r1 === r2 && r2 === r3) {
        let multiplier = 5;
        if (r1 === '💎') multiplier = 10;
        if (r1 === '7️⃣') multiplier = 25;

        const winAmount = bet * multiplier;
        balance += winAmount;
        saveBalance();

        status.innerText = `🎉 ДЖЕКПОТ! 3 в ряд [${r1}]. Вы выиграли ${winAmount.toFixed(2)} ₽ (x${multiplier})!`;
        showNotification(`Слоты: Выигрыш ${winAmount.toFixed(2)} ₽!`, "success");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const winAmount = bet * 1.5;
        balance += winAmount;
        saveBalance();
        status.innerText = `👍 Хорошо! 2 одинаковых символа. Выиграно ${winAmount.toFixed(2)} ₽ (x1.5)`;
        showNotification(`Слоты: Выигрыш ${winAmount.toFixed(2)} ₽!`, "success");
    } else {
        status.innerText = "Увы, совпадений нет. Попробуйте еще раз!";
        showNotification("Слоты: Нет совпадений.", "danger");
    }
}

// ==========================================
// СИСТЕМА ВИРТУАЛЬНОГО ДОНАТА
// ==========================================
function openDonateModal() {
    document.getElementById('donate-modal').classList.add('active');
    updateDonateButtonsTimers();
}

function closeDonateModal() {
    document.getElementById('donate-modal').classList.remove('active');
}

function triggerDonate(amount) {
    const now = Date.now();
    let cooldown = 10000; 
    if (amount === 100) cooldown = 60000;
    if (amount === 500) cooldown = 3600000;
    if (amount === 1000) cooldown = 7200000;

    balance += amount;
    saveBalance();

    localStorage.setItem(`next_donate_${amount}`, now + cooldown);
    showNotification(`Баланс виртуально пополнен на +${amount} ₽!`, "success");
    updateDonateButtonsTimers();
}

function updateDonateButtonsTimers() {
    const now = Date.now();
    const amounts = [10, 100, 500, 1000];

    amounts.forEach(amount => {
        const btn = document.getElementById(`donate-${amount}`);
        if (!btn) return;

        const nextTime = localStorage.getItem(`next_donate_${amount}`);

        if (!nextTime || now >= parseInt(nextTime)) {
            btn.disabled = false;
            if (amount === 10) btn.innerText = "+10 ₽ (Раз в 10 сек)";
            if (amount === 100) btn.innerText = "+100 ₽ (Раз в 1 мин)";
            if (amount === 500) btn.innerText = "+500 ₽ (Раз в 1 час)";
            if (amount === 1000) btn.innerText = "+1000 ₽ (Раз в 2 часа)";
        } else {
            btn.disabled = true;
            const diff = parseInt(nextTime) - now;

            if (diff > 60000) {
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                btn.innerText = `Подождите: ${mins}м ${secs}с`;
            } else {
                const secs = Math.ceil(diff / 1000);
                btn.innerText = `Подождите: ${secs}с`;
            }
        }
    });
}
