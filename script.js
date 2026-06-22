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
        updateThemeButtonUI();
    }

    updateBalanceUI();
    updateBonusTimer();
    updateDonateButtonsTimers();
    
    // Интервалы обновления таймеров раз в секунду
    setInterval(updateBonusTimer, 1000); 
    setInterval(updateDonateButtonsTimers, 1000); 

    generateRouletteTape(); 
    updateDiceValues(); 
    drawWheelGraphics(); 
};

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
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
    const el = document.getElementById('balance-val');
    if (el) el.innerText = balance.toFixed(2);
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = currentTheme + '-theme';
    localStorage.setItem('theme', currentTheme);
    updateThemeButtonUI();
}

function updateThemeButtonUI() {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
        btn.innerText = currentTheme === 'dark' ? "☀️ Светлая тема" : "🌙 Тёмная тема";
    }
}

function openDonateModal() { document.getElementById('donate-modal').classList.add('active'); }
function closeDonateModal() { document.getElementById('donate-modal').classList.remove('active'); }

// ==========================================
// ОБНОВЛЕННЫЙ ТАЙМЕР БОНУСА (Блокировка на 1 ЧАС)
// ==========================================
function updateBonusTimer() {
    const bonusBtn = document.getElementById('bonus-btn');
    if (!bonusBtn) return;
    
    const nextBonus = localStorage.getItem('next_bonus_time');
    const now = Date.now();

    if (!nextBonus || now >= parseInt(nextBonus)) {
        bonusBtn.disabled = false;
        bonusBtn.innerText = "Бонус (50₽)";
        bonusBtn.style.opacity = "1";
        bonusBtn.style.cursor = "pointer";
    } else {
        bonusBtn.disabled = true;
        bonusBtn.style.opacity = "0.5"; // Превращаем в серую/тусклую
        bonusBtn.style.cursor = "not-allowed";
        
        const diff = parseInt(nextBonus) - now;
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        
        if (hours > 0) {
            bonusBtn.innerText = `КД: ${hours}ч ${mins}м`;
        } else {
            bonusBtn.innerText = `КД: ${mins}м ${secs}с`;
        }
    }
}

function claimBonus() {
    const nextBonus = localStorage.getItem('next_bonus_time');
    const now = Date.now();
    if (nextBonus && now < parseInt(nextBonus)) return;

    const bonusAmount = 50; 
    balance += bonusAmount;
    saveBalance();
    
    localStorage.setItem('next_bonus_time', now + 3600000); // 1 час КД
    showNotification(`Получен бонус +${bonusAmount} ₽!`, "success");
    updateBonusTimer();
}

// ==========================================
// ОБНОВЛЕННЫЙ ДОНАТ (Серый цвет при блокировке)
// ==========================================
function triggerDonate(amount) {
    const now = Date.now();
    const nextTime = localStorage.getItem(`next_donate_${amount}`);
    if (nextTime && now < parseInt(nextTime)) return;

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
            btn.style.opacity = "1"; // Обычное состояние кнопок
            btn.style.cursor = "pointer";
            
            if (amount === 10) btn.innerText = "+10 ₽ (Раз в 10 сек)";
            if (amount === 100) btn.innerText = "+100 ₽ (Раз в 1 мин)";
            if (amount === 500) btn.innerText = "+500 ₽ (Раз в 1 час)";
            if (amount === 1000) btn.innerText = "+1000 ₽ (Раз в 2 часа)";
        } else {
            btn.disabled = true;
            btn.style.opacity = "0.4"; // Делаем серыми на КД
            btn.style.cursor = "not-allowed"; // Запрещающий курсор
            
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
    if (isNaN(count) || count < 1 || count > 24) { showNotification("Мин должно быть от 1 до 24!`, `danger"); return; }

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
        let idx = Math.floor(Math.random() * 25);
        if(!minesGameState.board[idx]) {
            minesGameState.board[idx] = true;
            deployed++;
        }
    }

    betInput.disabled = true;
    countInput.disabled = true;
    startBtn.innerText = "Забрать 0.00 ₽";
    startBtn.className = "btn btn-success";
    document.getElementById('mines-status').innerText = "Игра началась! Ищите кристаллы.";

    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for(let i=0; i<25; i++) {
        let cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.index = i;
        cell.onclick = () => clickMinesCell(i, cell);
        grid.appendChild(cell);
    }
}

function clickMinesCell(idx, cellEl) {
    if(!minesGameState.active || minesGameState.isGameOver) return;
    if(cellEl.innerText !== '') return;

    if(minesGameState.board[idx]) {
        cellEl.className = 'mine-cell revealed-mine';
        cellEl.innerText = '💣';
        endMinesGame(false);
    } else {
        cellEl.className = 'mine-cell revealed-gem';
        cellEl.innerText = '💎';
        minesGameState.revealedCount++;
        
        let n = 25;
        let m = minesGameState.minesCount;
        let r = minesGameState.revealedCount;
        
        let mult = 1.0;
        for(let i=0; i<r; i++) {
            mult *= (n - i) / (n - m - i);
        }
        mult *= 0.96; // Комиссия симулятора
        minesGameState.currentMultiplier = mult;

        let currentTake = minesGameState.bet * mult;
        document.getElementById('mines-start-btn').innerText = `Забрать ${currentTake.toFixed(2)} ₽ (x${mult.toFixed(2)})`;

        if(r === (25 - m)) {
            endMinesGame(true);
        }
    }
}

function endMinesGame(isWin) {
    minesGameState.active = false;
    minesGameState.isGameOver = true;
    
    const startBtn = document.getElementById('mines-start-btn');
    const betInput = document.getElementById('mines-bet');
    const countInput = document.getElementById('mines-count');

    // Открываем всё поле
    const cells = document.querySelectorAll('.mine-cell');
    cells.forEach((c, i) => {
        if(c.innerText === '') {
            if(minesGameState.board[i]) {
                c.className = 'mine-cell revealed-mine';
                c.style.opacity = '0.5';
                c.innerText = '💣';
            } else {
                c.className = 'mine-cell revealed-gem';
                c.style.opacity = '0.5';
                c.innerText = '💎';
            }
        }
    });

    if(isWin) {
        let prize = minesGameState.bet * minesGameState.currentMultiplier;
        balance += prize;
        saveBalance();
        document.getElementById('mines-status').innerText = `Победа! Вы забираете ${prize.toFixed(2)} ₽!`;
        showNotification(`Вы выиграли ${prize.toFixed(2)} ₽!`, "success");
    } else {
        document.getElementById('mines-status').innerText = `Взрыв! Ставка потеряна.`;
        showNotification(`Вы проиграли ставку`, "danger");
    }

    startBtn.innerText = "Сбросить поле";
    startBtn.className = "btn btn-secondary";
}

document.getElementById('mines-start-btn').onclick = function() {
    if(minesGameState.active && !minesGameState.isGameOver) {
        endMinesGame(true);
    } else {
        startMinesGame();
    }
};

// ==========================================
// РЕЖИМ 2: КРАШ (CRASH)
// ==========================================
function startCrash() {
    if (crashState.running) return;

    const betInput = document.getElementById('crash-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        showNotification("Неверная ставка или мало средств!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    crashState.running = true;
    crashState.bet = bet;
    crashState.currentMultiplier = 1.00;
    crashState.hasBailed = false;
    
    // Алгоритм генерации точки падения
    let e = Math.random();
    if (e < 0.03) {
        crashState.crashPoint = 1.00; 
    } else {
        crashState.crashPoint = 0.99 / (1 - Math.random());
        if (crashState.crashPoint < 1.00) crashState.crashPoint = 1.00;
    }

    betInput.disabled = true;
    const actionBtn = document.getElementById('crash-btn');
    actionBtn.innerText = "Забрать (x1.00)";
    actionBtn.className = "btn btn-success";
    
    const display = document.getElementById('crash-mult');
    display.className = "crash-multiplier";
    display.innerText = "1.00x";

    let startTime = Date.now();
    
    crashInterval = setInterval(() => {
        let elapsed = (Date.now() - startTime) / 1000;
        // Экспоненциальный рост графика
        let current = Math.pow(Math.E, 0.06 * elapsed);
        crashState.currentMultiplier = current;

        if (current >= crashState.crashPoint) {
            clearInterval(crashInterval);
            display.innerText = crashState.crashPoint.toFixed(2) + "x";
            display.className = "crash-multiplier crashed";
            document.getElementById('crash-status').innerText = `Крашнуло на ${crashState.crashPoint.toFixed(2)}x`;
            showNotification(`Краш на ${crashState.crashPoint.toFixed(2)}x`, "danger");
            resetCrashUI();
        } else {
            display.innerText = current.toFixed(2) + "x";
            if (!crashState.hasBailed) {
                let possibleWin = crashState.bet * current;
                actionBtn.innerText = `Забрать ${possibleWin.toFixed(2)} ₽ (x${current.toFixed(2)})`;
            }
        }
    }, 50);
}

function bailCrash() {
    if (!crashState.running || crashState.hasBailed) return;
    
    crashState.hasBailed = true;
    let prize = crashState.bet * crashState.currentMultiplier;
    balance += prize;
    saveBalance();
    
    document.getElementById('crash-status').innerText = `Вы успешно забрали ${prize.toFixed(2)} ₽!`;
    showNotification(`Выигрыш: ${prize.toFixed(2)} ₽!`, "success");
    
    const actionBtn = document.getElementById('crash-btn');
    actionBtn.innerText = "Ожидаем краша...";
    actionBtn.className = "btn btn-secondary";
    actionBtn.disabled = true;
}

function resetCrashUI() {
    crashState.running = false;
    document.getElementById('crash-bet').disabled = false;
    const actionBtn = document.getElementById('crash-btn');
    actionBtn.innerText = "Взлететь";
    actionBtn.className = "btn btn-primary";
    actionBtn.disabled = false;
}

document.getElementById('crash-btn').onclick = function() {
    if (crashState.running) {
        bailCrash();
    } else {
        startCrash();
    }
};

// ==========================================
// РЕЖИМ 3: ДАЙС (DICE)
// ==========================================
function updateDiceValues() {
    const min = parseInt(document.getElementById('dice-range-min').value) || 0;
    const max = parseInt(document.getElementById('dice-range-max').value) || 100;
    
    if(min < 0) document.getElementById('dice-range-min').value = 0;
    if(max > 100) document.getElementById('dice-range-max').value = 100;

    let count = 0;
    for(let i=0; i<=100; i++) {
        if(i >= min && i <= max) count++;
    }

    let winChance = (count / 101) * 100;
    let multiplier = winChance > 0 ? (98 / winChance) : 0;

    document.getElementById('dice-chance').innerText = winChance.toFixed(2) + "%";
    document.getElementById('dice-mult').innerText = multiplier.toFixed(2) + "x";
}

document.getElementById('dice-range-min').oninput = updateDiceValues;
document.getElementById('dice-range-max').oninput = updateDiceValues;

function playDice() {
    const betInput = document.getElementById('dice-bet');
    const bet = parseFloat(betInput.value);
    const min = parseInt(document.getElementById('dice-range-min').value);
    const max = parseInt(document.getElementById('dice-range-max').value);

    if (isNaN(bet) || bet <= 0 || bet > balance) { showNotification("Неверная ставка!", "danger"); return; }
    if (min > max || min < 0 || max > 100) { showNotification("Неверные диапазоны чисел!", "danger"); return; }

    balance -= bet;
    saveBalance();

    let roll = Math.floor(Math.random() * 101);
    document.getElementById('dice-cube-val').innerText = roll;

    let count = 0;
    for(let i=0; i<=100; i++) { if(i >= min && i <= max) count++; }
    let winChance = (count / 101) * 100;
    let multiplier = 98 / winChance;

    if (roll >= min && roll <= max) {
        let prize = bet * multiplier;
        balance += prize;
        saveBalance();
        document.getElementById('dice-status').innerText = `Выпало ${roll}. Победа (+${prize.toFixed(2)} ₽)`;
        showNotification(`Дайс победа: +${prize.toFixed(2)} ₽`, "success");
    } else {
        document.getElementById('dice-status').innerText = `Выпало ${roll}. Проигрыш`;
        showNotification("Проигрыш в Дайс", "danger");
    }
}

// ==========================================
// ИГРА 4: МОНЕТКА (COINFLIP)
// ==========================================
function playCoin(targetSide) {
    if (isCoinSpinning) return;

    const betInput = document.getElementById('coin-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        showNotification("Неверная ставка!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isCoinSpinning = true;
    const coin = document.getElementById('coin');
    coin.className = ''; 

    let rand = Math.random();
    let outcome = rand < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
        if (outcome === 'heads') {
            coin.classList.add('spin-heads');
        } else {
            coin.classList.add('spin-tails');
        }
    }, 20);

    setTimeout(() => {
        isCoinSpinning = false;
        if (outcome === targetSide) {
            let prize = bet * 1.96;
            balance += prize;
            saveBalance();
            document.getElementById('coin-status').innerText = `Победа! Выпало ${outcome === 'heads'?'Орёл':'Решка'} (+${prize.toFixed(2)} ₽)`;
            showNotification("Монетка: Удвоение!", "success");
        } else {
            document.getElementById('coin-status').innerText = `Не повезло. Выпало ${outcome === 'heads'?'Орёл':'Решка'}`;
            showNotification("Потеря ставки в Монетке", "danger");
        }
    }, 1220);
}

// ==========================================
// ИГРА 5: КОЛЕСО ФОРТУНЫ (WHEEL)
// ==========================================
const wheelSectors = [
    { text: "x0.00", mult: 0.0, color: "#ff4757" },
    { text: "x2.00", mult: 2.0, color: "#2ed573" },
    { text: "x0.50", mult: 0.5, color: "#ffa502" },
    { text: "x1.50", mult: 1.5, color: "#5352ed" },
    { text: "x0.00", mult: 0.0, color: "#ff4757" },
    { text: "x5.00", mult: 5.0, color: "#10ac84" },
    { text: "x0.50", mult: 0.5, color: "#ffa502" },
    { text: "x2.00", mult: 2.0, color: "#2ed573" }
];

function drawWheelGraphics() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hw = canvas.width / 2;
    const arc = (2 * Math.PI) / wheelSectors.length;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    wheelSectors.forEach((sec, i) => {
        let angle = i * arc;
        ctx.fillStyle = sec.color;
        ctx.beginPath();
        ctx.moveTo(hw, hw);
        ctx.arc(hw, hw, hw - 4, angle, angle + arc, false);
        ctx.lineTo(hw, hw);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px Arial";
        ctx.translate(hw, hw);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillText(sec.text, hw - 25, 6);
        ctx.restore();
    });
}

function spinWheel() {
    if (isWheelFortuneSpinning) return;

    const betInput = document.getElementById('wheel-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        showNotification("Неверная ставка!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isWheelFortuneSpinning = true;
    const canvas = document.getElementById('wheel-canvas');

    let totalSectors = wheelSectors.length;
    let targetSectorIndex = Math.floor(Math.random() * totalSectors);
    let sectorArc = 360 / totalSectors;

    let targetAngleDegrees = (totalSectors - targetSectorIndex) * sectorArc - (sectorArc / 2);
    let fullSpins = 5 * 360; 
    let finalRotationDegrees = fullSpins + targetAngleDegrees - 90; 

    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.2, 1)";
    canvas.style.transform = `rotate(${finalRotationDegrees}deg)`;

    setTimeout(() => {
        isWheelFortuneSpinning = false;
        canvas.style.transition = "none";
        let normRotation = finalRotationDegrees % 360;
        canvas.style.transform = `rotate(${normRotation}deg)`;

        let sec = wheelSectors[targetSectorIndex];
        let prize = bet * sec.mult;
        balance += prize;
        saveBalance();

        if (sec.mult > 1) {
            document.getElementById('wheel-status').innerText = `Результат: ${sec.text}. Вы выиграли +${prize.toFixed(2)} ₽!`;
            showNotification(`Колесо: +${prize.toFixed(2)} ₽!`, "success");
        } else if (sec.mult > 0) {
            document.getElementById('wheel-status').innerText = `Результат: ${sec.text}. Возврат части средств: ${prize.toFixed(2)} ₽`;
            showNotification("Колесо: Частичный возврат", "info");
        } else {
            document.getElementById('wheel-status').innerText = `Результат: ${sec.text}. Попытайте удачу снова!`;
            showNotification("Колесо: Сектор ноль", "danger");
        }
    }, 4050);
}

// ==========================================
// ИГРА 6: РУЛЕТКА (ROULETTE)
// ==========================================
const rouletteCellsLayout = [
    { n: 0, c: 'green' }, { n: 32, c: 'red' }, { n: 15, c: 'black' }, { n: 19, c: 'red' }, { n: 4, c: 'black' },
    { n: 21, c: 'red' }, { n: 2, c: 'black' }, { n: 25, c: 'red' }, { n: 17, c: 'black' }, { n: 34, c: 'red' },
    { n: 6, c: 'black' }, { n: 27, c: 'red' }, { n: 13, c: 'black' }, { n: 36, c: 'red' }, { n: 11, c: 'black' },
    { n: 30, c: 'red' }, { n: 8, c: 'black' }, { n: 23, c: 'red' }, { n: 10, c: 'black' }, { n: 5, c: 'red' },
    { n: 24, c: 'black' }, { n: 16, c: 'red' }, { n: 33, c: 'black' }, { n: 1, c: 'red' }, { n: 20, c: 'black' },
    { n: 14, c: 'red' }, { n: 31, c: 'black' }, { n: 9, c: 'red' }, { n: 22, c: 'black' }, { n: 18, c: 'red' },
    { n: 29, c: 'black' }, { n: 7, c: 'red' }, { n: 28, c: 'black' }, { n: 12, c: 'red' }, { n: 35, c: 'black' },
    { n: 3, c: 'red' }, { n: 26, c: 'black' }
];
let rouletteStripData = [];

function generateRouletteTape() {
    const tape = document.getElementById('roulette-container-tape');
    if (!tape) return;
    tape.innerHTML = '';
    rouletteStripData = [];
    
    // Дублируем ленту для создания бесконечной прокрутки
    for (let loop = 0; loop < 4; loop++) {
        rouletteCellsLayout.forEach(item => {
            rouletteStripData.push(item);
            let block = document.createElement('div');
            block.className = `roulette-cell cell-${item.c}`;
            block.innerText = item.n;
            tape.appendChild(block);
        });
    }
}

function placeRouletteBet(betOnType) {
    if (isRouletteSpinning) return;

    const betInput = document.getElementById('roulette-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        showNotification("Неверная ставка!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isRouletteSpinning = true;
    const tape = document.getElementById('roulette-container-tape');

    // Находим случайный индекс в 3-м дубле ленты
    let minIndex = rouletteCellsLayout.length * 2;
    let maxIndex = rouletteCellsLayout.length * 3 - 1;
    let targetGlobalIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

    let cellSize = 70; 
    let viewportWidth = 500; 
    let randomizeOffsetInsideCell = Math.floor(Math.random() * 50) + 10; 

    let finalScrollPosition = (targetGlobalIndex * cellSize) - (viewportWidth / 2) + randomizeOffsetInsideCell;

    tape.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)";
    tape.style.transform = `translateX(-${finalScrollPosition}px)`;

    setTimeout(() => {
        isRouletteSpinning = false;
        let winningItem = rouletteStripData[targetGlobalIndex];
        
        let multiplier = 0;
        let isWin = false;

        if (betOnType === winningItem.c) {
            isWin = true;
            multiplier = winningItem.c === 'green' ? 14 : 2;
        }

        if (isWin) {
            let prize = bet * multiplier;
            balance += prize;
            saveBalance();
            document.getElementById('roulette-status').innerText = `Выпало ${winningItem.n} (${winningItem.c==='red'?'Красное':winningItem.c==='black'?'Чёрное':'Зелёное'}). Победа! Получено +${prize.toFixed(2)} ₽`;
            showNotification(`Рулетка: +${prize.toFixed(2)} ₽`, "success");
        } else {
            document.getElementById('roulette-status').innerText = `Выпало ${winningItem.n} (${winningItem.c==='red'?'Красное':winningItem.c==='black'?'Чёрное':'Зелёное'}). Вы проиграли.`;
            showNotification("Ставка проиграла в рулетке", "danger");
        }

        // Возвращаем ленту в исходную позицию с теми же числами
        setTimeout(() => {
            tape.style.transition = "none";
            let lookAheadShift = finalScrollPosition % (rouletteCellsLayout.length * cellSize);
            let safetyResetPos = rouletteCellsLayout.length * cellSize * 1 + lookAheadShift;
            tape.style.transform = `translateX(-${safetyResetPos}px)`;
        }, 1500);

    }, 4100);
}

// ==========================================
// ИГРА 7: СЛОТЫ (SLOTS)
// ==========================================
const slotIcons = ['🍒', '🍋', '🍇', '🍉', '💎', '🎰'];

function spinSlots() {
    const betInput = document.getElementById('slots-bet');
    const bet = parseFloat(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        showNotification("Неверная ставка!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    let r1 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    let r2 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    let r3 = slotIcons[Math.floor(Math.random() * slotIcons.length)];

    document.getElementById('reel-1').innerText = r1;
    document.getElementById('reel-2').innerText = r2;
    document.getElementById('reel-3').innerText = r3;

    if (r1 === r2 && r2 === r3) {
        let mult = 5;
        if(r1 === '💎') mult = 15;
        if(r1 === '🎰') mult = 50;

        let prize = bet * mult;
        balance += prize;
        saveBalance();

        document.getElementById('slots-status').innerText = `🎉 ДЖЕКПОТ! 3 в ряд [${r1}]! Вы выиграли +${prize.toFixed(2)} ₽ (x${mult})`;
        showNotification(`Слоты: x${mult}! +${prize.toFixed(2)} ₽`, "success");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        let prize = bet * 1.5;
        balance += prize;
        saveBalance();
        document.getElementById('slots-status').innerText = `Частичное совпадение! Два символа одинаковы. Возврат +${prize.toFixed(2)} ₽`;
        showNotification("Слоты: Небольшой выигрыш", "info");
    } else {
        document.getElementById('slots-status').innerText = `Нет совпадений. Удачи в следующем спине!`;
        showNotification("Слоты: Без выигрыша", "danger");
    }
}
