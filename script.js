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
    if (localStorage.getItem('theme') === 'light') {
        currentTheme = 'light';
        document.body.className = 'light-theme';
        document.getElementById('theme-toggle-btn').innerText = '🌙 Тёмная тема';
    } else {
        currentTheme = 'dark';
        document.body.className = 'dark-theme';
        document.getElementById('theme-toggle-btn').innerText = '☀️ Светлая тема';
    }

    updateBalanceDisplay();
    initMinesBoard();
    drawWheelInit();
    initRouletteCarousel();

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ БИЗНЕСА
    // ==========================================
    renderMarket();
    renderMyBusinesses();
    
    // Запускаем таймер пассивной прибыли (каждые 10 секунд бизнесы копят деньги на склад)
    setInterval(processPassiveIncome, 10000);

    // Восстанавливаем таймеры на кнопках доната при загрузке страницы, если они активны
    restoreDonateTimers();
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    let el = document.getElementById('balance-val');
    if (el) el.innerText = balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Переключение вкладок главной страницы
function switchTab(tabId, btn) {
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    let targetSection = document.getElementById(tabId);
    if (targetSection) targetSection.classList.add('active');

    document.querySelectorAll('.sidebar .nav-btn').forEach(b => b.classList.remove('active'));
    if (btn && btn.classList.contains('nav-btn')) {
        btn.classList.add('active');
    }

    // Если перешли в "Мой бизнес", сразу обновляем состояние складов
    if (tabId === 'game-my-business') {
        renderMyBusinesses();
    }
}

function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        document.body.className = 'light-theme';
        localStorage.setItem('theme', 'light');
        document.querySelectorAll('#theme-toggle-btn').forEach(b => b.innerText = '🌙 Тёмная тема');
    } else {
        currentTheme = 'dark';
        document.body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark');
        document.querySelectorAll('#theme-toggle-btn').forEach(b => b.innerText = '☀️ Светлая тема');
    }
}

function showNotification(msg, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) return;
    let toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 300);
    }, 4000);
}

function openDonateModal() { 
    document.getElementById('donate-modal').style.display = 'flex'; 
    restoreDonateTimers(); // Обновляем состояние кнопок при открытии модалки
}
function closeDonateModal() { document.getElementById('donate-modal').style.display = 'none'; }


// ==========================================
// ОБНОВЛЕННАЯ СИСТЕМА ДОНАТА С ТАЙМЕРАМИ НА КНОПКАХ
// ==========================================

// Конфигурация кулдаунов и дефолтных текстов для кнопок (согласовано с твоим index.html)
const donateConfigs = {
    10: { cd: 10000, text: "+10 ₽ (Раз в 10 сек)", storageKey: "donate_limit_10" },
    100: { cd: 60000, text: "+100 ₽ (Раз в 1 мин)", storageKey: "donate_limit_100" },
    500: { cd: 3600000, text: "+500 ₽ (Раз в 1 час)", storageKey: "donate_limit_500" },
    1000: { cd: 0, text: "+1000 ₽ (Раз в 2 часа)", storageKey: "donate_limit_1000" } // Сделали без КД на кнопку, как ты просил
};

// Функция запуска отсчета КД прямо на кнопке
function startButtonCooldown(amount, timeLeftMs) {
    const config = donateConfigs[amount];
    const btn = document.getElementById(`donate-${amount}`); // Сверяется с твоими id="donate-10" и т.д.
    if (!btn) return;

    btn.disabled = true;
    
    let timeLeftSec = Math.ceil(timeLeftMs / 1000);
    
    if (timeLeftSec > 60) {
        let minutes = Math.floor(timeLeftSec / 60);
        let seconds = timeLeftSec % 60;
        btn.innerText = `⏳ Подождите: ${minutes}м ${seconds}с`;
    } else {
        btn.innerText = `⏳ Подождите: ${timeLeftSec}с`;
    }

    const interval = setInterval(() => {
        const now = Date.now();
        const lastTime = parseInt(localStorage.getItem(config.storageKey)) || 0;
        const passed = now - lastTime;
        const remaining = config.cd - passed;

        if (remaining <= 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.innerText = config.text;
        } else {
            let remSec = Math.ceil(remaining / 1000);
            if (remSec > 60) {
                let m = Math.floor(remSec / 60);
                let s = remSec % 60;
                btn.innerText = `⏳ Подождите: ${m}м ${s}с`;
            } else {
                btn.innerText = `⏳ Подождите: ${remSec}с`;
            }
        }
    }, 1000);
}

// Функция проверки всех таймеров (вызывается при загрузке и открытии окна)
function restoreDonateTimers() {
    const now = Date.now();
    Object.keys(donateConfigs).forEach(amount => {
        const config = donateConfigs[amount];
        if (config.cd === 0) return; // Пропускаем 1000 ₽, так как она без КД

        const lastTime = parseInt(localStorage.getItem(config.storageKey)) || 0;
        const passed = now - lastTime;

        if (passed < config.cd) {
            startButtonCooldown(amount, config.cd - passed);
        } else {
            const btn = document.getElementById(`donate-${amount}`);
            if (btn) {
                btn.disabled = false;
                btn.innerText = config.text;
            }
        }
    });
}

function triggerDonate(amount) {
    let now = Date.now();
    let config = donateConfigs[amount];

    if (!config) return;

    // Если кулдаун есть, проверяем его работоспособность
    if (config.cd > 0) {
        let lastTime = parseInt(localStorage.getItem(config.storageKey)) || 0;
        if (now - lastTime < config.cd) {
            return;
        }
    }

    // Начисляем баланс
    balance += amount;
    saveBalance();
    
    // Сохраняем время клика (только если у кнопки есть лимит времени)
    if (config.cd > 0) {
        localStorage.setItem(config.storageKey, now.toString());
        startButtonCooldown(amount, config.cd);
    }
    
    // Красивое уведомление об успехе
    showNotification(`Баланс виртуально пополнен на +${amount} ₽!`, "success");
    // closeDonateModal(); // Закомментировано — окно больше НЕ закрывается!
}


function claimBonus() {
    let now = Date.now();
    let lastBonus = parseInt(localStorage.getItem('last_bonus_time')) || 0;
    if (now - lastBonus < 60000) {
        let diff = Math.ceil((60000 - (now - lastBonus)) / 1000);
        showNotification(`Бонус уже получен! Перезарядка: ${diff} сек.`, "danger");
        return;
    }
    balance += 50;
    saveBalance();
    localStorage.setItem('last_bonus_time', now.toString());
    showNotification("Вы получили ежедневный бонус +50.00 ₽!", "success");
}

// ==========================================
// ЛОГИКА ИГРЫ: МИНЫ (MINES)
// ==========================================
function initMinesBoard() {
    let grid = document.getElementById('mines-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'mines-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => clickMinesCell(i));
        grid.appendChild(cell);
    }
}

document.getElementById('mines-start-btn')?.addEventListener('click', function() {
    if (minesGameState.active) {
        collectMinesWin();
        return;
    }

    let betInput = document.getElementById('mines-bet');
    let countInput = document.getElementById('mines-count');
    let bet = parseFloat(betInput.value) || 0;
    let count = parseInt(countInput.value) || 3;

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма ставки!", "danger");
        return;
    }
    if (count < 1 || count > 24) {
        showNotification("Количество мин должно быть от 1 до 24!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    minesGameState = { active: true, isGameOver: false, bet: bet, minesCount: count, board: Array(25).fill(false), revealedCount: 0, currentMultiplier: 1.0 };

    let placed = 0;
    while (placed < count) {
        let r = Math.floor(Math.random() * 25);
        if (!minesGameState.board[r]) {
            minesGameState.board[r] = true;
            placed++;
        }
    }

    betInput.disabled = true;
    countInput.disabled = true;
    this.innerText = 'Забрать выигрыш (x1.00)';
    this.className = 'btn btn-success';

    document.querySelectorAll('.mines-cell').forEach(c => {
        c.className = 'mines-cell';
        c.innerText = '';
    });
    document.getElementById('mines-status').innerText = 'Игра началась! Ищите безопасные ячейки.';
    showNotification(`Игра началась! Ставка: ${bet} ₽. Мин на поле: ${count}`, "info");
});

function clickMinesCell(idx) {
    if (!minesGameState.active || minesGameState.isGameOver) return;
    let grid = document.getElementById('mines-grid');
    let cell = grid.children[idx];
    if (cell.classList.contains('revealed') || cell.classList.contains('mine')) return;

    if (minesGameState.board[idx]) {
        cell.classList.add('mine');
        cell.innerText = '💥';
        endMinesGame(false);
    } else {
        cell.classList.add('revealed');
        cell.innerText = '💎';
        minesGameState.revealedCount++;

        let safeCellsTotal = 25 - minesGameState.minesCount;
        let nextMult = calculateMinesMultiplier(minesGameState.minesCount, minesGameState.revealedCount);
        minesGameState.currentMultiplier = nextMult;

        document.getElementById('mines-start-btn').innerText = `Забрать (+${(minesGameState.bet * nextMult).toFixed(2)} ₽)`;

        if (minesGameState.revealedCount === safeCellsTotal) {
            endMinesGame(true);
        } else {
            document.getElementById('mines-status').innerText = `Ячейка открыта! Текущий коэффициент: x${nextMult.toFixed(2)}`;
        }
    }
}

function calculateMinesMultiplier(mines, revealed) {
    let m = 1.0;
    for (let i = 0; i < revealed; i++) {
        m *= (25 - i) / (25 - mines - i);
    }
    return m * 0.97;
}

function collectMinesWin() {
    if (!minesGameState.active || minesGameState.isGameOver) return;
    endMinesGame(true);
}

function endMinesGame(isWin) {
    minesGameState.isGameOver = true;
    minesGameState.active = false;

    let betInput = document.getElementById('mines-bet');
    let countInput = document.getElementById('mines-count');
    let startBtn = document.getElementById('mines-start-btn');

    betInput.disabled = false;
    countInput.disabled = false;
    startBtn.innerText = 'Играть';
    startBtn.className = 'btn btn-primary';

    let grid = document.getElementById('mines-grid');
    for (let i = 0; i < 25; i++) {
        let cell = grid.children[i];
        if (minesGameState.board[i]) {
            if (!cell.classList.contains('mine')) {
                cell.classList.add('mine-hidden');
                cell.innerText = '💣';
            }
        }
    }

    if (isWin) {
        let prize = minesGameState.bet * minesGameState.currentMultiplier;
        balance += prize;
        saveBalance();
        document.getElementById('mines-status').innerText = `🎉 Выигрыш! Вы забрали +${prize.toFixed(2)} ₽ (x${minesGameState.currentMultiplier.toFixed(2)})`;
        showNotification(`Мины: Победа! Получено +${prize.toFixed(2)} ₽`, "success");
    } else {
        document.getElementById('mines-status').innerText = `💥 БУМ! Вы наступили на мину. Ставка ${minesGameState.bet.toFixed(2)} ₽ сгорела.`;
        showNotification(`Мины: Поражение! Слив -${minesGameState.bet.toFixed(2)} ₽`, "danger");
    }
}

// ==========================================
// ЛОГИКА ИГРЫ: КРАШ (CRASH)
// ==========================================
document.getElementById('crash-btn')?.addEventListener('click', function() {
    if (crashState.running) {
        if (!crashState.hasBailed) {
            crashBailout();
        }
        return;
    }

    let betInput = document.getElementById('crash-bet');
    let bet = parseFloat(betInput.value) || 0;

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма ставки!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    crashState = { running: true, isStage: 'fly', bet: bet, currentMultiplier: 1.00, crashPoint: generateCrashPoint(), hasBailed: false };

    betInput.disabled = true;
    this.innerText = 'Забрать выигрыш (x1.00)';
    this.className = 'btn btn-success';
    document.getElementById('crash-status').innerText = 'График растет! Успей вовремя среагировать!';

    let display = document.getElementById('crash-mult');
    display.style.color = 'var(--text-color)';

    crashInterval = setInterval(updateCrashFrame, 65);
});

function generateCrashPoint() {
    let e = Math.random();
    if (e < 0.04) return 1.00; 
    return Math.max(1.01, parseFloat((0.01 + 0.99 / (Math.random() + 0.001)).toFixed(2)));
}

function updateCrashFrame() {
    if (!crashState.running) return;

    if (crashState.currentMultiplier >= crashState.crashPoint) {
        clearInterval(crashInterval);
        document.getElementById('crash-mult').innerText = `Crash x${crashState.crashPoint.toFixed(2)}`;
        document.getElementById('crash-mult').style.color = 'var(--danger)';
        document.getElementById('crash-status').innerText = `📈 График рухнул на отметке x${crashState.crashPoint.toFixed(2)}. Ставка слита.`;
        showNotification(`Краш: График лопнул! -${crashState.bet.toFixed(2)} ₽`, "danger");

        resetCrashControls();
        return;
    }

    let speed = 0.01 + (crashState.currentMultiplier * 0.004);
    crashState.currentMultiplier = parseFloat((crashState.currentMultiplier + speed).toFixed(2));

    document.getElementById('crash-mult').innerText = `${crashState.currentMultiplier.toFixed(2)}x`;

    if (!crashState.hasBailed) {
        let curWin = crashState.bet * crashState.currentMultiplier;
        document.getElementById('crash-btn').innerText = `Забрать (+${curWin.toFixed(2)} ₽)`;
    }
}

function crashBailout() {
    crashState.hasBailed = true;
    let prize = crashState.bet * crashState.currentMultiplier;
    balance += prize;
    saveBalance();

    document.getElementById('crash-status').innerText = `🎉 Успешно! Вы забрали выигрыш +${prize.toFixed(2)} ₽ на отметке x${crashState.currentMultiplier.toFixed(2)}`;
    showNotification(`Краш: Забрали +${prize.toFixed(2)} ₽!`, "success");

    let btn = document.getElementById('crash-btn');
    btn.innerText = 'Вы уже забрали кэш';
    btn.className = 'btn btn-secondary';
    btn.disabled = true;
}

function resetCrashControls() {
    crashState.running = false;
    let btn = document.getElementById('crash-btn');
    btn.innerText = 'Взлететь';
    btn.className = 'btn btn-primary';
    btn.disabled = false;
    document.getElementById('crash-bet').disabled = false;
}

// ==========================================
// ЛОГИКА ИГРЫ: ДАЙС (DICE)
// ==========================================
document.getElementById('dice-range-min')?.addEventListener('input', updateDicePredictions);
document.getElementById('dice-range-max')?.addEventListener('input', updateDicePredictions);

function updateDicePredictions() {
    let minInput = document.getElementById('dice-range-min');
    let maxInput = document.getElementById('dice-range-max');
    let min = parseInt(minInput.value) || 0;
    let max = parseInt(maxInput.value) || 0;

    if (min < 0) min = 0; if (min > 100) min = 100;
    if (max < 0) max = 0; if (max > 100) max = 100;
    if (min > max) { let t = min; min = max; max = t; }

    let count = max - min + 1;
    let chance = (count / 101) * 100;
    let mult = chance > 0 ? (98 / chance) : 0;

    document.getElementById('dice-chance').innerText = `${chance.toFixed(2)}%`;
    document.getElementById('dice-mult').innerText = `x${mult.toFixed(2)}`;
}

function playDice() {
    let bet = parseFloat(document.getElementById('dice-bet').value) || 0;
    let min = parseInt(document.getElementById('dice-range-min').value) || 0;
    let max = parseInt(document.getElementById('dice-range-max').value) || 0;

    if (min < 0) min = 0; if (min > 100) min = 100;
    if (max < 0) max = 0; if (max > 100) max = 100;
    if (min > max) { let t = min; min = max; max = t; }

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма вашей ставки!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    let roll = Math.floor(Math.random() * 101);
    document.getElementById('dice-cube-val').innerText = roll;

    let count = max - min + 1;
    let chance = (count / 101) * 100;
    let mult = 98 / chance;

    if (roll >= min && roll <= max) {
        let prize = bet * mult;
        balance += prize;
        saveBalance();
        document.getElementById('dice-status').innerText = `🎉 Выигрыш! Выпало число ${roll}. Вы получили +${prize.toFixed(2)} ₽`;
        showNotification(`Дайс: Выпало ${roll}! +${prize.toFixed(2)} ₽`, "success");
    } else {
        document.getElementById('dice-status').innerText = `📉 Проигрыш! Выпало число ${roll}, вне диапазона [${min}-${max}].`;
        showNotification(`Дайс: Выпало ${roll}! Слив -${bet.toFixed(2)} ₽`, "danger");
    }
}

// ==========================================
// ЛОГИКА ИГРЫ: МОНЕТКА (COINFLIP)
// ==========================================
function playCoin(choice) {
    if (isCoinSpinning) return;
    let bet = parseFloat(document.getElementById('coin-bet').value) || 0;

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма ставки!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isCoinSpinning = true;
    document.getElementById('coin-status').innerText = 'Монетка подбрасывается...';

    let coin = document.getElementById('coin');
    coin.style.animation = 'none';
    setTimeout(() => { coin.style.animation = 'flip 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'; }, 5);

    setTimeout(() => {
        let result = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.style.animation = 'none';

        if (result === 'heads') {
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coin.style.transform = 'rotateY(180deg)';
        }

        if (choice === result) {
            let prize = bet * 1.96;
            balance += prize;
            saveBalance();
            document.getElementById('coin-status').innerText = `🎉 Победа! Выпала верная сторона. Приз: +${prize.toFixed(2)} ₽`;
            showNotification(`Монетка: Угадали! +${prize.toFixed(2)} ₽`, "success");
        } else {
            document.getElementById('coin-status').innerText = `📉 Слив! Выпала противоположная сторона. Минус ${bet.toFixed(2)} ₽.`;
            showNotification(`Монетка: Промазали! -${bet.toFixed(2)} ₽`, "danger");
        }
        isCoinSpinning = false;
    }, 1400);
}

// ==========================================
// ЛОГИКА ИГРЫ: КОЛЕСО ФОРТУНЫ
// ==========================================
const wheelColors = ['#ff4757', '#2ed573', '#ffa502', '#1e90ff', '#2f3542', '#747d8c', '#5352ed', '#a4b0be'];
const wheelMults = [0, 2, 0.5, 3, 1, 1.5, 0, 5];

function drawWheelInit() {
    let canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    let size = 320; let center = size / 2;
    ctx.clearRect(0,0,size,size);

    for (let i = 0; i < 8; i++) {
        let angle = (Math.PI * 2) / 8;
        ctx.fillStyle = wheelColors[i];
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, center - 10, angle * i, angle * (i + 1));
        ctx.lineTo(center, center);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.translate(center, center);
        ctx.rotate(angle * i + angle / 2);
        ctx.fillText(`x${wheelMults[i]}`, center / 1.5, 6);
        ctx.restore();
    }
}

function spinWheel() {
    if (isWheelFortuneSpinning) return;
    let bet = parseFloat(document.getElementById('wheel-bet').value) || 0;

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма вашей ставки!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isWheelFortuneSpinning = true;
    document.getElementById('wheel-status').innerText = 'Колесо фортуны разгоняется...';

    let canvas = document.getElementById('wheel-canvas');
    let randSector = Math.floor(Math.random() * 8);

    let baseSpins = 5; 
    let sectorAngle = 360 / 8;
    let targetDeg = (baseSpins * 360) + (360 - (randSector * sectorAngle) - (sectorAngle / 2));

    canvas.style.transition = 'transform 3.5s cubic-bezier(0.075, 0.82, 0.165, 1)';
    canvas.style.transform = `rotate(${targetDeg}deg)`;

    setTimeout(() => {
        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(${targetDeg % 360}deg)`;

        let m = wheelMults[randSector];
        let prize = bet * m;
        balance += prize;
        saveBalance();

        if (m > 1) {
            document.getElementById('wheel-status').innerText = `🎉 Отлично! Множитель x${m}! Вы выиграли +${prize.toFixed(2)} ₽`;
            showNotification(`Колесо: Коэффициент x${m}! +${prize.toFixed(2)} ₽`, "success");
        } else if (m === 1) {
            document.getElementById('wheel-status').innerText = `🎡 Возврат ставки x1. На баланс возвращено +${prize.toFixed(2)} ₽`;
            showNotification(`Колесо: Множитель x1. В ноль.`, "info");
        } else {
            document.getElementById('wheel-status').innerText = `📉 Коэффициент x${m}. Ставка ${bet.toFixed(2)} ₽ потеряна частично или полностью.`;
            showNotification(`Колесо: Множитель x${m}! Минус средства.`, "danger");
        }
        isWheelFortuneSpinning = false;
    }, 3500);
}

// ==========================================
// ЛОГИКА ИГРЫ: РУЛЕТКА (ROULETTE)
// ==========================================
const rTapePattern = ['green','red','black','red','black','red','black','red','black','red','black','red','black','red','black'];
function initRouletteCarousel() {
    let tape = document.getElementById('roulette-container-tape');
    if (!tape) return;
    tape.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        rTapePattern.forEach(color => {
            let item = document.createElement('div');
            item.className = `roulette-cell c-${color}`;
            item.innerText = color === 'green' ? '0' : (color === 'red' ? '🟥' : '⬛');
            tape.appendChild(item);
        });
    }
}

function placeRouletteBet(colorChoice) {
    if (isRouletteSpinning) return;
    let bet = parseFloat(document.getElementById('roulette-bet').value) || 0;

    if (bet <= 0 || bet > balance) {
        showNotification("Неверная сумма вашей ставки!", "danger");
        return;
    }

    balance -= bet;
    saveBalance();

    isRouletteSpinning = true;
    document.getElementById('roulette-status').innerText = `Ставка принята на ${colorChoice === 'red' ? 'Красное' : (colorChoice === 'black' ? 'Чёрное' : 'Зелёное')}... Крутим!`;

    let tape = document.getElementById('roulette-container-tape');
    tape.style.transition = 'none';
    tape.style.transform = 'translateX(0px)';

    let targetIdx = 15 + Math.floor(Math.random() * 15);
    let cellWidth = 70; 
    let centerOffset = 210; 
    let finalShift = (targetIdx * cellWidth) - centerOffset + Math.floor(Math.random() * 40 + 15);

    setTimeout(() => {
        tape.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)';
        tape.style.transform = `translateX(-${finalShift}px)`;
    }, 20);

    setTimeout(() => {
        let actualColor = rTapePattern[targetIdx % 15];
        let isWin = actualColor === colorChoice;
        let mult = actualColor === 'green' ? 14 : 2;

        if (isWin) {
            let prize = bet * mult;
            balance += prize;
            saveBalance();
            document.getElementById('roulette-status').innerText = `🎉 Победа! Выпал цвет: ${actualColor.toUpperCase()} (x${mult}). Вы выиграли +${prize.toFixed(2)} ₽`;
            showNotification(`Рулетка: Выпал ${actualColor}! +${prize.toFixed(2)} ₽`, "success");
        } else {
            document.getElementById('roulette-status').innerText = `📉 Слив! Выпал цвет: ${actualColor.toUpperCase()}. Ваша ставка проиграла.`;
            showNotification(`Рулетка: Выпал ${actualColor}! Минус ставка.`, "danger");
        }
        isRouletteSpinning = false;
    }, 4050);
}

// ==========================================
// ЛОГИКА ИГРЫ: СЛОТЫ (SLOTS)
// ==========================================
const slotIcons = ['🍒', '🍋', '🍇', '🍊', '💎', '🎰'];
function spinSlots() {
    let bet = parseFloat(document.getElementById('slots-bet').value) || 0;

    if (bet <= 0 || bet > balance) {
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
        document.getElementById('slots-status').innerText = `🍒 Совпадение двух элементов! Небольшой выигрыш: +${prize.toFixed(2)} ₽ (x1.5)`;
        showNotification(`Слоты: Двойное совпадение! +${prize.toFixed(2)} ₽`, "success");
    } else {
        document.getElementById('slots-status').innerText = '📉 Комбинация не совпала. Попробуйте прокрутить барабан еще раз!';
        showNotification(`Слоты: Пусто! Слив -${bet.toFixed(2)} ₽`, "danger");
    }
}


// ==================================================================================
// НОВЫЙ ЭКОНОМИЧЕСКИЙ ДВИЖОК: СИСТЕМА ПРЕДПРИЯТИЙ (БИЗНЕСА)
// ==================================================================================

// База данных всех доступных бизнесов
const businessDatabase = {
    small: [
        { id: "shaurma", name: "Ларёк с шаурмой", cost: 150000, income: 4500, tax: 15, info: "Стартовая точка любого олигарха. Быстрая окупаемость." },
        { id: "shina", name: "Шиномонтаж «Подорожник»", cost: 300000, income: 9500, tax: 15, info: "Стабильный доход, особенно в сезон переобувки тачек." },
        { id: "minimarket", name: "Мини-маркет «Продукты»", cost: 600000, income: 20000, tax: 15, info: "Круглосуточный поток клиентов за товарами первой необходимости." },
        { id: "coffee", name: "Уютная Кофейня", cost: 1200000, income: 42000, tax: 15, info: "Продажа кофе с наценкой 400%. Прекрасный малый бизнес." },
        { id: "beauty", name: "Бьюти-студия", cost: 2500000, income: 90000, tax: 15, info: "Элитный салон красоты. Постоянная база лояльных клиентов." }
    ],
    medium: [
        { id: "autoservice", name: "Крупный Автосервис", cost: 6000000, income: 230000, tax: 20, info: "Требуется: Любой малый бизнес + Слот из Дубая. Серьёзный ремонт премиум машин." },
        { id: "nightclub", name: "Ночной Клуб «Neon»", cost: 12000000, income: 480000, tax: 20, info: "Требуется: Любой малый бизнес + Слот из Дубая. Элитный алкоголь и вечные тусовки." },
        { id: "fitness", name: "Фитнес-клуб «Сталь»", cost: 25000000, income: 1050000, tax: 20, info: "Требуется: Любой малый бизнес + Слот из Дубая. Годовые абонементы приносят горы кэша." },
        { id: "restaurant", name: "Ресторан высокой кухни", cost: 50000000, income: 2200000, tax: 20, info: "Требуется: Любой малый бизнес + Слот из Дубая. Повара со звездами Мишлен." },
        { id: "hotel", name: "Отель «Plaza»", cost: 100000000, income: 4600000, tax: 20, info: "Требуется: Любой малый бизнес + Слот из Дубая. Бизнес-класс номера премиум уровня." }
    ],
    large: [
        { id: "stroy", name: "Строительная компания", cost: 250000000, income: 12000000, tax: 25, info: "Требуется: Любой средний бизнес + Слот из Италии. Возведение небоскребов." },
        { id: "azs", name: "Сеть АЗС «Топливо-Икс»", cost: 500000000, income: 25000000, tax: 25, info: "Требуется: Любой средний бизнес + Слот из Италии. Монополия на бензин." },
        { id: "autosalon", name: "Автосалон гиперкаров", cost: 1000000000, income: 55000000, tax: 25, info: "Требуется: Любой средний бизнес + Слот из Италии. Продажа Бугатти и Макларенов." },
        { id: "port", name: "Международный Морской Порт", cost: 3000000000, income: 180000000, tax: 25, info: "Требуется: Любой средний бизнес + Слот из Италии. Логистический гигант империи." },
        { id: "casino", name: "Императорское Казино", cost: 10000000000, income: 650000000, tax: 25, info: "Требуется: Любой средний бизнес + Слот из Италии. Главное азартное дно этого города." }
    ]
};

// Загрузка массива купленных игроком предприятий из локального хранилища
let myBusinesses = JSON.parse(localStorage.getItem('user_businesses')) || [];

// Логика переключения под-вкладок (категорий) внутри Магазина Бизнесов
function switchBusinessMarketTab(catId, btnEl) {
    document.querySelectorAll('#game-buy-business .business-category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('#game-buy-business .b-tab-btn').forEach(b => b.classList.remove('active'));
    
    let targetContainer = document.getElementById(catId);
    if (targetContainer) targetContainer.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
}

// Полноценный выход на дефолтную главную страницу (Мины)
function returnToMainDashboard() {
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    document.getElementById('game-mines').classList.add('active');
    document.querySelectorAll('.sidebar .nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.sidebar .nav-btn').classList.add('active');
}

// Генерация карточек товаров в Магазине Бизнесов
function renderMarket() {
    const renderSection = (tier, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        
        businessDatabase[tier].forEach(biz => {
            const isOwned = myBusinesses.some(b => b.id === biz.id);
            container.innerHTML += `
                <div class="biz-card">
                    <div>
                        <div class="biz-title">${biz.name}</div>
                        <div class="biz-price">${biz.cost.toLocaleString('ru-RU')} ₽</div>
                        <div class="biz-info">
                            ${biz.info}<br><br>
                            <b>Доход:</b> +${biz.income.toLocaleString('ru-RU')} ₽ / 10 сек<br>
                            <b>Налог:</b> <span id="market-tax-${biz.id}">${biz.tax}%</span>
                        </div>
                    </div>
                    <button class="btn ${isOwned ? 'btn-secondary' : 'btn-success'}" 
                            ${isOwned ? 'disabled' : ''} 
                            onclick="buyBusinessClick('${tier}', '${biz.id}')">
                        ${isOwned ? '💼 Уже куплен' : '🛒 Купить бизнес'}
                    </button>
                </div>
            `;
        });
    };

    renderSection('small', 'cat-small');
    renderSection('medium', 'cat-medium');
    renderSection('large', 'cat-large');
}

// Обработчик кнопки покупки бизнеса
function buyBusinessClick(tier, bizId) {
    const biz = businessDatabase[tier].find(b => b.id === bizId);
    if (!biz) return;

    if (balance < biz.cost) {
        showNotification("Недостаточно денег для покупки этого бизнеса!", "danger");
        return;
    }

    // Условия для СРЕДНЕГО бизнеса
    if (tier === 'medium') {
        const hasSmall = myBusinesses.some(b => businessDatabase.small.some(s => s.id === b.id));
        const hasDubaiSlot = localStorage.getItem('slot_dubai') === 'true';
        
        if (!hasSmall) {
            showNotification("Ошибка! Сначала нужно купить хотя бы один Малый бизнес!", "danger");
            return;
        }
        if (!hasDubaiSlot) {
            showNotification("Ошибка! Нужен открытый Слот из Дубая (выбивается в контейнерах)!", "danger");
            return;
        }
    }

    // Условия для КРУПНОГО бизнеса
    if (tier === 'large') {
        const hasMedium = myBusinesses.some(b => businessDatabase.medium.some(m => m.id === b.id));
        const hasItalySlot = localStorage.getItem('slot_italy') === 'true';
        
        if (!hasMedium) {
            showNotification("Ошибка! Сначала нужно купить хотя бы один Средний бизнес!", "danger");
            return;
        }
        if (!hasItalySlot) {
            showNotification("Ошибка! Нужен открытый Слот из Италии (выбивается в контейнерах)!", "danger");
            return;
        }
    }

    // Списание денег и добавление в массив владения
    balance -= biz.cost;
    saveBalance();

    myBusinesses.push({
        id: biz.id,
        name: biz.name,
        tier: tier,
        baseIncome: biz.income,
        currentTax: biz.tax,
        storedProfit: 0
    });

    localStorage.setItem('user_businesses', JSON.stringify(myBusinesses));
    showNotification(`Поздравляем! Вы купили предприятие: "${biz.name}"`, "success");
    
    renderMarket();
    renderMyBusinesses();
}

// Генерация интерфейса вкладки "Мой Бизнес"
function renderMyBusinesses() {
    const container = document.getElementById('my-business-content-area');
    if (!container) return;

    if (myBusinesses.length === 0) {
        container.innerHTML = `
            <div class="empty-business-state">
                <h2>💼 У вас пока нет active бизнеса</h2>
                <p style="margin: 15px 0; opacity: 0.8;">Бизнес приносит колоссальную пассивную прибыль. Выбивайте скидки на налоги в портах контейнеров, чтобы зарабатывать ещё больше!</p>
                <button onclick="switchTab('game-buy-business')" class="btn btn-primary" style="padding: 12px 30px;">Перейти в магазин бизнесов 🛒</button>
            </div>
        `;
        return;
    }

    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">`;
    
    myBusinesses.forEach((biz, index) => {
        const cleanIncome = biz.baseIncome * (1 - (biz.currentTax / 100));

        html += `
            <div class="biz-card" style="text-align: left;">
                <div>
                    <div class="biz-title" style="font-size: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">💼 ${biz.name}</div>
                    <div style="font-size: 14px; margin: 15px 0; line-height: 1.6;">
                        • Базовая прибыль: <span style="color:var(--warning); font-weight:bold;">+${biz.baseIncome.toLocaleString('ru-RU')} ₽</span><br>
                        • Налоговая ставка: <span style="color:#ff4757; font-weight:bold;">${biz.currentTax}%</span><br>
                        • Чистый доход (за налог): <span style="color:var(--success); font-weight:bold;">+${Math.floor(cleanIncome).toLocaleString('ru-RU')} ₽</span><br>
                        • Накоплено на складе: <span style="color:#5352ed; font-weight:bold; font-size:16px;">${Math.floor(biz.storedProfit).toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <button class="btn btn-success" style="width:100%;" onclick="collectProfit(${index})" ${biz.storedProfit <= 0 ? 'disabled' : ''}>💰 Собрать прибыль</button>
                    <button class="btn btn-danger" style="width:100%; background:#ff4757; opacity:0.9;" onclick="sellBusiness(${index})">Продать за 50%</button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// Функция сбора накопленной прибыли со склада
function collectProfit(index) {
    if (!myBusinesses[index] || myBusinesses[index].storedProfit <= 0) return;
    
    const amount = myBusinesses[index].storedProfit;
    balance += amount;
    myBusinesses[index].storedProfit = 0;
    
    saveBalance();
    localStorage.setItem('user_businesses', JSON.stringify(myBusinesses));
    showNotification(`Вы разгрузили склад и забрали прибыль: +${Math.floor(amount).toLocaleString('ru-RU')} ₽`, "success");
    renderMyBusinesses();
}

// Функция продажи за 50% стоимости
function sellBusiness(index) {
    const biz = myBusinesses[index];
    if (!biz) return; // Опечатка полностью исправлена здесь!

    const dbBiz = businessDatabase[biz.tier].find(b => b.id === biz.id);
    const returnMoney = dbBiz ? dbBiz.cost / 2 : 0;

    balance += returnMoney;
    saveBalance();

    showNotification(`Бизнес "${biz.name}" успешно продан за ${returnMoney.toLocaleString('ru-RU')} ₽`, "info");
    
    myBusinesses.splice(index, 1);
    localStorage.setItem('user_businesses', JSON.stringify(myBusinesses));
    
    renderMarket();
    renderMyBusinesses();
}

// Фоновое начисление чистой прибыли раз в 10 секунд
function processPassiveIncome() {
    if (myBusinesses.length === 0) return;

    myBusinesses.forEach(biz => {
        const cleanIncome = biz.baseIncome * (1 - (biz.currentTax / 100));
        biz.storedProfit += cleanIncome;
    });

    localStorage.setItem('user_businesses', JSON.stringify(myBusinesses));
    
    // Если игрок сейчас смотрит на вкладку управления, обновляем счетчики
    let targetSection = document.getElementById('game-my-business');
    if (targetSection && targetSection.classList.contains('active')) {
        renderMyBusinesses();
    }
}
