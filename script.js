// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ И СИСТЕМА ИНИЦИАЛИЗАЦИИ
// ==========================================
let balance = 200;
let currentTheme = 'dark';

let minesGameState = { active: false, isGameOver: true, bet: 0, minesCount: 3, board: Array(25).fill(false), revealedCount: 0, currentMultiplier: 1.0 };
let crashInterval;
let crashState = { running: false, isStage: 'bet', bet: 0, currentMultiplier: 1.00, crashPoint: 0, hasBailed: false };
let isCoinSpinning = false;
let isWheelFortuneSpinning = false;
let isRouletteSpinning = false;
let isRouletteGameOver = false;

window.onload = function() {
    // Создаем контейнер для уведомлений
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    // Загрузка баланса
    if (!localStorage.getItem('has_visited')) {
        localStorage.setItem('has_visited', 'true');
        balance = 200;
        saveBalance();
    } else {
        balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    }
    
    // Загрузка темы
    if (localStorage.getItem('theme')) {
        currentTheme = localStorage.getItem('theme');
        document.body.className = currentTheme + '-theme';
    }

    // Запуск таймеров
    setInterval(updateDonateButtonsTimers, 1000);
    setInterval(updateBonusTimer, 1000); 

    // Обновление интерфейса
    updateBalanceUI();
    updateBonusTimer();
    
    if (typeof generateRouletteTape === "function") generateRouletteTape(); 
    if (typeof updateDiceValues === "function") updateDiceValues(); 
    if (typeof drawWheelGraphics === "function") drawWheelGraphics(); 
};

// ==========================================
// СИСТЕМНЫЕ ФУНКЦИИ И ИНТЕРФЕЙС
// ==========================================
function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceUI();
}

function updateBalanceUI() {
    const displays = document.querySelectorAll('.balance-amount');
    displays.forEach(el => {
        el.innerText = balance.toFixed(2);
    });
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Функции управления окнами и темами
function closeDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    if (modal) {
        modal.classList.remove('active');
        showNotification("Добро пожаловать в симулятор!", "success");
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        currentTheme = 'light';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        currentTheme = 'dark';
    }
    localStorage.setItem('theme', currentTheme);
}

function switchTab(tabId) {
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById(`game-${tabId}`);
    if (targetSection) targetSection.classList.add('active');

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function updateBonusTimer() {
    const bonusBtn = document.getElementById('claim-bonus-btn');
    if (!bonusBtn) return;
    const nextBonus = localStorage.getItem('next_bonus_time');
    const now = Date.now();

    if (!nextBonus || now >= parseInt(nextBonus)) {
        bonusBtn.disabled = false;
        bonusBtn.innerText = "Получить бонус";
    } else {
        bonusBtn.disabled = true;
        const diff = parseInt(nextBonus) - now;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        bonusBtn.innerText = `Бонус через ${mins}м ${secs}с`;
    }
}

function claimBonus() {
    const nextBonus = localStorage.getItem('next_bonus_time');
    const now = Date.now();
    if (nextBonus && now < parseInt(nextBonus)) return;

    const bonusAmount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    balance += bonusAmount;
    saveBalance();
    
    localStorage.setItem('next_bonus_time', now + 300000); // 5 минут кд
    showNotification(`Получен ежедневный бонус +${bonusAmount} ₽!`, "success");
    updateBonusTimer();
}

// ==========================================
// РЕЖИМ 1: МИНЫ (MINES)
// ==========================================
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
    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка или мало средств!", "danger"); return; }
    if (isNaN(count) || count < 1 || count > 24) { showNotification("Мин должно быть от 1 до 24!", "danger"); return; }

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
    crashState = { running: false, isStage: 'bet', bet: 0, currentMultiplier: 1.00, crashPoint: 0, hasBailed: false };
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
// РЕЖИМ 3: ДАЙС (DICE)
// ==========================================
function updateDiceValues() {
    const chanceInput = document.getElementById('dice-chance');
    if(!chanceInput) return;
    const chance = parseFloat(chanceInput.value);
    document.getElementById('dice-chance-val').innerText = chance;

    const multiplier = parseFloat((95 / chance).toFixed(2));
    document.getElementById('dice-multiplier').innerText = `x${multiplier}`;

    const bet = parseFloat(document.getElementById('dice-bet').value) || 0;
    document.getElementById('dice-payout').innerText = (bet * multiplier).toFixed(2);
    document.getElementById('dice-less-range').innerText = chance.toFixed(2);
    document.getElementById('dice-more-range').innerText = (99.99 - chance).toFixed(2);
}

function playDice(direction) {
    const betInput = document.getElementById('dice-bet');
    const bet = parseFloat(betInput.value);
    const chance = parseFloat(document.getElementById('dice-chance').value);
    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }

    balance -= bet;
    saveBalance();

    const resultRoll = parseFloat((Math.random() * 100).toFixed(2));
    document.getElementById('dice-roll-result').innerText = resultRoll.toFixed(2);
    const multiplier = 95 / chance;
    let isWin = false;
    if (direction === 'less' && resultRoll <= chance) {
        isWin = true;
    } else if (direction === 'more' && resultRoll >= (99.99 - chance)) {
        isWin = true;
    }

    if (isWin) {
        const winAmount = bet * multiplier;
        balance += winAmount;
        saveBalance();
        document.getElementById('dice-status').innerText = `🎉 Победа! Выпало число ${resultRoll}. Получено +${winAmount.toFixed(2)} ₽`;
        showNotification(`Дайс: Победа +${winAmount.toFixed(2)} ₽!`, "success");
    } else {
        document.getElementById('dice-status').innerText = `Проигрыш! Выпало число ${resultRoll}. Попробуйте еще раз.`;
        showNotification("Дайс: Проигрыш.", "danger");
    }
    updateDiceValues();
}

// ==========================================
// РЕЖИМ 4: МОНЕТКА (COINFLIP)
// ==========================================
function playCoinflip(chosenSide) {
    if (isCoinSpinning) return;
    const betInput = document.getElementById('coinflip-bet');
    const bet = parseFloat(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }

    balance -= bet;
    saveBalance();

    isCoinSpinning = true;
    document.getElementById('coinflip-status').innerText = "Монетка подброшена...";
    const randSide = Math.random() < 0.5 ? 'heads' : 'tails';
    const coin = document.getElementById('coin');
    let extraDegrees = randSide === 'heads' ? 1440 : 1620;
    coin.style.transition = "transform 2s cubic-bezier(0.1, 0.8, 0.1, 1)";
    coin.style.transform = `rotateY(${extraDegrees}deg)`;
    setTimeout(() => {
        if (chosenSide === randSide) {
            const winAmount = bet * 2;
            balance += winAmount;
            saveBalance();
            document.getElementById('coinflip-status').innerText = `🎉 Выпал ${randSide === 'heads' ? 'Орёл' : 'Решка'}. Вы угадали! +${winAmount.toFixed(2)} ₽`;
            showNotification(`Монетка: Выиграно ${winAmount.toFixed(2)} ₽!`, "success");
        } else {
            document.getElementById('coinflip-status').innerText = `Увы! Выпал ${randSide === 'heads' ? 'Орёл' : 'Решка'}. Спин неудачный.`;
            showNotification("Монетка: Проигрыш.", "danger");
        }
        
        setTimeout(() => {
            coin.style.transition = "none";
            coin.style.transform = randSide === 'heads' ? "rotateY(0deg)" : "rotateY(180deg)";
            isCoinSpinning = false;
        }, 500);

    }, 2000);
}

// ==========================================
// РЕЖИМ 5: КОЛЕСО ФОРТУНЫ (WHEEL)
// ==========================================
const wheelSectors = {
    low: [
        {txt: 'x1.2', val: 1.2, col: '#2ed573'}, {txt: 'x1.5', val: 1.5, col: '#1e90ff'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x1.2', val: 1.2, col: '#2ed573'},
        {txt: 'x2.0', val: 2.0, col: '#ffa502'}, {txt: 'x1.2', val: 1.2, col: '#2ed573'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x1.5', val: 1.5, col: '#1e90ff'}
    ],
    medium: [
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x2.0', val: 2.0, col: '#2ed573'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x3.0', val: 3.0, col: '#1e90ff'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x5.0', val: 5.0, col: '#ffa502'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x2.0', val: 2.0, col: '#2ed573'}
    ],
    high: [
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x0.0', val: 0.0, col: '#7f8c8d'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x10.', val: 10.0, col: '#1e90ff'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x0.0', val: 0.0, col: '#7f8c8d'},
        {txt: 'x0.0', val: 0.0, col: '#7f8c8d'}, {txt: 'x50.', val: 50.0, col: '#ff4757'}
    ]
};

function drawWheelGraphics() {
    const canvas = document.getElementById('wheel-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const risk = document.getElementById('wheel-risk').value;
    const sectors = wheelSectors[risk];

    const size = canvas.offsetWidth || 300;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = center - 10;
    const numSectors = sectors.length;
    const arc = Math.PI * 2 / numSectors;
    ctx.clearRect(0, 0, size, size);

    sectors.forEach((sec, i) => {
        let angle = i * arc;
        ctx.fillStyle = sec.col;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, angle, angle + arc, false);
        ctx.lineTo(center, center);
        ctx.fill();
        ctx.strokeStyle = '#2a2a35';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(11, size / 21)}px Segoe UI`;
        ctx.translate(center, center);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillText(sec.txt, radius - 15, 5);
        ctx.restore();
    });

    ctx.fillStyle = '#141418';
    ctx.beginPath();
    ctx.arc(center, center, size / 12, 0, Math.PI * 2);
    ctx.fill();
}

function spinWheelFortune() {
    if (isWheelFortuneSpinning) return;
    const betInput = document.getElementById('wheel-bet');
    const bet = parseFloat(betInput.value);
    const risk = document.getElementById('wheel-risk').value;
    const sectors = wheelSectors[risk];

    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }

    balance -= bet;
    saveBalance();

    isWheelFortuneSpinning = true;
    document.getElementById('wheel-status').innerText = "Барабан крутится...";

    const numSectors = sectors.length;
    const arc = 360 / numSectors;
    const targetSectorIndex = Math.floor(Math.random() * numSectors);
    const targetSector = sectors[targetSectorIndex];
    let targetAngle = 270 - (targetSectorIndex * arc + arc / 2);
    let finalRotation = (5 * 360) + targetAngle;

    const canvas = document.getElementById('wheel-canvas');
    canvas.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)";
    canvas.style.transform = `rotate(${finalRotation}deg)`;
    setTimeout(() => {
        const winAmount = bet * targetSector.val;
        if(targetSector.val > 0) {
            balance += winAmount;
            saveBalance();
            document.getElementById('wheel-status').innerText = `🎉 Успех! Колесо выдало ${targetSector.txt}. Приз: +${winAmount.toFixed(2)} ₽!`;
            showNotification(`Колесо: Победа +${winAmount.toFixed(2)} ₽!`, "success");
        } else {
            document.getElementById('wheel-status').innerText = `Проигрыш! Выпал сектор ${targetSector.txt}. Попробуйте еще раз.`;
            showNotification("Колесо: Сектор х0.", "danger");
        }

        setTimeout(() => {
            canvas.style.transition = "none";
            let normAngle = targetAngle < 0 ? 360 + targetAngle : targetAngle;
            canvas.style.transform = `rotate(${normAngle}deg)`;
            isWheelFortuneSpinning = false;
        }, 400);
    }, 4100);
}

// ==========================================
// РЕЖИМ 6: РУЛЕТКА (ROULETTE)
// ==========================================
const rouletteOrder = ['green', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red'];

function generateRouletteTape() {
    const tape = document.getElementById('roulette-tape');
    if(!tape) return;
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
    if (isRouletteGameOver) { resetRouletteTable(); return; }
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
    const container = document.querySelector('.roulette-wheel-container');
    const containerWidth = container.offsetWidth;
    const targetCellIndex = 45 + Math.floor(Math.random() * 15);
    const winningColor = rouletteOrder[targetCellIndex % 15];
    const cellWidth = 80;
    const offset = (targetCellIndex * cellWidth) - (containerWidth / 2) + (cellWidth / 2);
    
    tape.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)";
    tape.style.transform = `translateX(-${offset}px)`;
    const buttonsContainer = document.querySelector('#game-roulette .bet-buttons');
    setTimeout(() => {
        let multiplier = 0;
        if(chosenColor === winningColor) {
            multiplier = (chosenColor === 'green') ? 14 : 2;
            const winnings = bet * multiplier;
            balance += winnings;
            saveBalance();
            document.getElementById('roulette-status').innerText = `🎉 Выпал цвет: ${winningColor}. Выиграно ${winnings.toFixed(2)} ₽!`;
            showNotification(`Рулетка: Победа +${winnings.toFixed(2)} ₽`, "success");
        } else {
            document.getElementById('roulette-status').innerText = `Проигрыш. Выпал цвет: ${winningColor}.`;
            showNotification(`Рулетка, увы: цвет ${winningColor}`, "danger");
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
    const buttonsContainer = document.querySelector('#game-roulette .bet-buttons');
    buttonsContainer.innerHTML = `
        <button onclick="placeRouletteBet('red')" class="btn btn-danger">Красное (x2)</button>
        <button onclick="placeRouletteBet('green')" class="btn btn-success">Зеленое (x14)</button>
        <button onclick="placeRouletteBet('black')" class="btn btn-dark">Черное (x2)</button>
    `;
}

// ==========================================
// РЕЖИМ 7: СЛОТЫ (SLOTS)
// ==========================================
const slotSymbols = ['🍒', '🍋', '🍉', '🍇', '💎', '7️⃣'];
function spinSlots() {
    const betInput = document.getElementById('slots-bet');
    const bet = parseFloat(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка или мало средств!", "danger"); return; }

    balance -= bet;
    saveBalance();
    document.getElementById('slots-status').innerText = "Слоты крутятся...";
    
    let intervals = [];
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
