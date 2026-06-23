// Значения баланса и темы //
let balance = 200;
let currentTheme = 'dark';

// База данных дропа по контейнерам
const containersData = {
    germany: {
        title: "Германия", cost: 10000,
        items: [
            { name: "Volkswagen Polo", price: 5000, img: "images/cars/vw_polo.png" },
            { name: "Opel Astra", price: 6000, img: "images/cars/opel_astra.png" },
            { name: "Audi A3", price: 7000, img: "images/cars/audi_a3.png" },
            { name: "BMW 3 Series (E90)", price: 8000, img: "images/cars/bmw_3.png" },
            { name: "Mercedes-Benz C-Class", price: 9000, img: "images/cars/mercedes_c.png" },
            { name: "Volkswagen Golf GTI", price: 10000, img: "images/cars/vw_golf.png" },
            { name: "Audi A6", price: 11000, img: "images/cars/audi_a6.png" },
            { name: "BMW M3", price: 12000, img: "images/cars/bmw_m3.png" },
            { name: "Mercedes-Benz E-Class", price: 15000, img: "images/cars/mercedes_e.png" },
            { name: "Porsche 911 Carrera", price: 20000, img: "images/cars/porsche_911.png" },
            { name: "BMW M5 F90", price: 25000, img: "images/cars/bmw_m5.png" }
        ]
    },
    dubai: {
        title: "Дубай", cost: 20000,
        items: [
            { name: "Toyota Camry", price: 15000, img: "images/cars/toyota_camry.png" },
            { name: "Nissan Patrol", price: 16000, img: "images/cars/nissan_patrol.png" },
            { name: "Lexus LX 570", price: 17000, img: "images/cars/l// Значения баланса и темы //
let balance = 200;
let currentTheme = 'dark';

// База данных бизнесов игрока
let playerBusinesses = [];
function loadBusinesses() {
    if (localStorage.getItem('user_businesses')) {
        try {
            playerBusinesses = JSON.parse(localStorage.getItem('user_businesses')) || [];
        } catch (e) {
            playerBusinesses = [];
        }
    }
}

// База данных дропа по контейнерам (Оригинал со скриншотов + Особые)
const containersData = {
    germany: {
        title: "Германия", cost: 10000,
        items: [
            { name: "Volkswagen Polo", price: 5000, img: "images/cars/vw_polo.png" },
            { name: "Opel Astra", price: 6000, img: "images/cars/opel_astra.png" },
            { name: "Audi A3", price: 7000, img: "images/cars/audi_a3.png" },
            { name: "BMW 3 Series (E90)", price: 8000, img: "images/cars/bmw_3.png" },
            { name: "Mercedes-Benz C-Class", price: 9000, img: "images/cars/mercedes_c.png" },
            { name: "Volkswagen Golf GTI", price: 10000, img: "images/cars/vw_golf.png" },
            { name: "Audi A6", price: 11000, img: "images/cars/audi_a6.png" },
            { name: "BMW M3", price: 12000, img: "images/cars/bmw_m3.png" },
            { name: "Mercedes-Benz E-Class", price: 15000, img: "images/cars/mercedes_e.png" },
            { name: "Porsche 911 Carrera", price: 20000, img: "images/cars/porsche_911.png" },
            { name: "BMW M5 F90", price: 25000, img: "images/cars/bmw_m5.png" }
        ]
    },
    dubai: {
        title: "Дубай", cost: 20000,
        items: [
            { name: "Toyota Camry", price: 15000, img: "images/cars/toyota_camry.png" },
            { name: "Nissan Patrol", price: 16000, img: "images/cars/nissan_patrol.png" },
            { name: "Lexus LX 570", price: 17000, img: "images/cars/lexus_lx.png" },
            { name: "Mercedes-Benz G-Class", price: 18000, img: "images/cars/gelandewagen.png" },
            { name: "Audi R8", price: 19000, img: "images/cars/audi_r8.png" },
            { name: "Porsche Cayenne", price: 20000, img: "images/cars/porsche_cayenne.png" },
            { name: "McLaren 570S", price: 21000, img: "images/cars/mclaren_570s.png" },
            { name: "Ferrari Portofino", price: 22000, img: "images/cars/ferrari_portofino.png" },
            { name: "Lamborghini Huracan", price: 23000, img: "images/cars/lambo_huracan.png" },
            { name: "Rolls-Royce Cullinan", price: 40000, img: "images/cars/rr_cullinan.png" }
        ]
    },
    italy: {
        title: "Италия", cost: 50000,
        items: [
            { name: "Fiat 500", price: 30000, img: "images/cars/fiat_500.png" },
            { name: "Alfa Romeo Giulia", price: 35000, img: "images/cars/alfa_giulia.png" },
            { name: "Maserati Ghibli", price: 40000, img: "images/cars/maserati_ghibli.png" },
            { name: "Ferrari Roma", price: 45000, img: "images/cars/ferrari_roma.png" },
            { name: "Lamborghini Urus", price: 50000, img: "images/cars/lambo_urus.png" },
            { name: "Ferrari F8 Tributo", price: 60000, img: "images/cars/ferrari_f8.png" },
            { name: "Lamborghini Aventador", price: 70000, img: "images/cars/lambo_aventador.png" },
            { name: "Maserati GranTurismo", price: 100000, img: "images/cars/maserati_gt.png" },
            { name: "Bugatti Divo", price: 200000, img: "images/cars/bugatti_divo.png" }
        ]
    },
    dip_germany: {
        title: "Дип. Германия", cost: 1000000, isVip: true,
        items: [
            { name: "Smart Fortwo Brabus", price: 50000, img: "images/cars/smart_brabus.png", type: "worst" },
            { name: "Volkswagen Touareg", price: 600000, img: "images/cars/vw_touareg.png", type: "loss" },
            { name: "Audi Q7", price: 700000, img: "images/cars/audi_q7.png", type: "loss" },
            { name: "BMW X5 M", price: 800000, img: "images/cars/bmw_x5m.png", type: "loss" },
            { name: "Mercedes-Benz E63 AMG", price: 900000, img: "images/cars/mercedes_e63.png", type: "loss" },
            { name: "Porsche Panamera GTS", price: 1000000, img: "images/cars/porsche_panamera.png", type: "zero" },
            { name: "Audi RS7 Sportback", price: 1100000, img: "images/cars/audi_rs7.png", type: "profit" },
            { name: "Mercedes-Benz S-Class W223", price: 1200000, img: "images/cars/mercedes_s223.png", type: "profit" },
            { name: "Porsche 911 Turbo S", price: 1300000, img: "images/cars/porsche_911turbo.png", type: "profit" },
            { name: "Bentley Continental GT", price: 2000000, img: "images/cars/bentley_continental.png", type: "jackpot" }
        ]
    },
    dip_dubai: {
        title: "Дип. Дубай", cost: 2000000, isVip: true,
        items: [
            { name: "Renault Twizy", price: 75000, img: "images/cars/renault_twizy.png", type: "worst" },
            { name: "Lexus GX 460", price: 1200000, img: "images/cars/lexus_gx.png", type: "loss" },
            { name: "Nissan GT-R R35", price: 1400000, img: "images/cars/nissan_gtr.png", type: "loss" },
            { name: "Mercedes-Benz AMG GT", price: 1600000, img: "images/cars/mercedes_amggt.png", type: "loss" },
            { name: "Lamborghini Huracan STO", price: 1800000, img: "images/cars/lambo_sto.png", type: "loss" },
            { name: "Ferrari SF90 Stradale", price: 2000000, img: "images/cars/ferrari_sf90.png", type: "zero" },
            { name: "Aston Martin DBS", price: 2100000, img: "images/cars/aston_dbs.png", type: "profit" },
            { name: "Rolls-Royce Ghost", price: 2200000, img: "images/cars/rr_ghost.png", type: "profit" },
            { name: "Bugatti Veyron", price: 2300000, img: "images/cars/bugatti_veyron.png", type: "profit" },
            { name: "McLaren P1", price: 2500000, img: "images/cars/mclaren_p1.png", type: "profit" },
            { name: "Tesla Cybertruck", price: 4000000, img: "images/cars/tesla_cybertruck.png", type: "jackpot" }
        ]
    },
    dip_italy: {
        title: "Дип. Италия", cost: 5000000, isVip: true,
        items: [
            { name: "Старый ВАЗ-2104 с рынка", price: 100000, img: "images/cars/vaz_2104.png", type: "worst" },
            { name: "Maserati Levante", price: 3000000, img: "images/cars/maserati_levante.png", type: "loss" },
            { name: "Alfa Romeo Giulia GTA", price: 3500000, img: "images/cars/alfa_giulia_gta.png", type: "loss" },
            { name: "Ferrari 488 Pista", price: 4000000, img: "images/cars/ferrari_pista.png", type: "loss" },
            { name: "Lamborghini Aventador SVJ", price: 4500000, img: "images/cars/lambo_svj.png", type: "loss" },
            { name: "Ferrari LaFerrari", price: 5000000, img: "images/cars/ferrari_laferrari.png", type: "zero" },
            { name: "Maserati MC20", price: 5300000, img: "images/cars/maserati_mc20.png", type: "profit" },
            { name: "Lamborghini Sian", price: 5600000, img: "images/cars/lambo_sian.png", type: "profit" },
            { name: "Ferrari Daytona SP3", price: 5800000, img: "images/cars/ferrari_sp3.png", type: "profit" },
            { name: "Pagani Zonda Cinque", price: 20000000, img: "images/cars/pagani_zonda.png", type: "jackpot" }
        ]
    },
    // Особые контейнеры используют строго твои машины + редкие слоты
    special_germany: {
        title: "Особая Германия", cost: 100000,
        items: [
            { name: "Volkswagen Golf GTI", price: 10000, img: "images/cars/vw_golf.png" },
            { name: "Porsche 911 Carrera", price: 20000, img: "images/cars/porsche_911.png" },
            { name: "BMW M5 F90", price: 25000, img: "images/cars/bwm_m5.png" },
            { name: "Слот для Маленького Бизнеса", price: 30000, type: "slot_small", img: "images/items/slot_small.png" }
        ]
    },
    special_dubai: {
        title: "Особый Дубай", cost: 500000,
        items: [
            { name: "Porsche Cayenne", price: 20000, img: "images/cars/porsche_cayenne.png" },
            { name: "Lamborghini Huracan", price: 23000, img: "images/cars/lambo_huracan.png" },
            { name: "Rolls-Royce Cullinan", price: 40000, img: "images/cars/rr_cullinan.png" },
            { name: "Слот для Среднего Бизнеса", price: 60000, type: "slot_dubai", img: "images/items/slot_dubai.png" }
        ]
    },
    special_italy: {
        title: "Особая Италия", cost: 1000000,
        items: [
            { name: "Ferrari F8 Tributo", price: 60000, img: "images/cars/ferrari_f8.png" },
            { name: "Maserati GranTurismo", price: 100000, img: "images/cars/maserati_gt.png" },
            { name: "Bugatti Divo", price: 200000, img: "images/cars/bugatti_divo.png" },
            { name: "Слот для Крупного Бизнеса", price: 150000, type: "slot_italy", img: "images/items/slot_italy.png" }
        ]
    },
    // Официальные 5 позиций налогов по твоему ТЗ
    tax_container: {
        title: "Налоговый Контейнер", cost: 45000,
        items: [
            { name: "Налог 0%", value: 0, label: "Ультра-джекпот", styleClass: "bg-drop-jackpot", textClass: "text-jackpot" },
            { name: "Налог 7%", value: 7, label: "Выгодно", styleClass: "bg-drop-profit", textClass: "profit" },
            { name: "Налог 8%", value: 8, label: "Хорошо", styleClass: "bg-drop-profit", textClass: "profit" },
            { name: "Налог 20%", value: 20, label: "Слив / Проиграш", styleClass: "bg-drop-loss", textClass: "loss" },
            { name: "Налог 25%", value: 25, label: "Жесткий минус", styleClass: "bg-drop-worst", textClass: "loss" }
        ]
    }
};

let pendingTaxValue = null;

window.onload = function() {
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        container.style = "position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
        document.body.appendChild(container);
    }

    if (localStorage.getItem('user_balance')) {
        balance = parseFloat(localStorage.getItem('user_balance')) || 0;
    } else {
        balance = 200;
    }

    if (localStorage.getItem('theme') === 'light') {
        currentTheme = 'light';
        document.body.className = 'light-theme';
    } else {
        currentTheme = 'dark';
        document.body.className = 'dark-theme';
    }

    loadBusinesses();
    checkDailyTaxReset(); // Проверка на сброс налога каждый день при входе
    updateBalanceDisplay();
};

// Функция проверки наступления нового дня для обнуления налогов
function checkDailyTaxReset() {
    let todayStr = new Date().toDateString();
    let lastTaxDate = localStorage.getItem('last_tax_container_date');
    
    if (lastTaxDate && lastTaxDate !== todayStr) {
        // Если день изменился, сбрасываем налоги всех бизнесов до 10%
        if (playerBusinesses.length > 0) {
            playerBusinesses.forEach(b => {
                b.currentTax = 10;
                b.tax = 10;
            });
            localStorage.setItem('user_businesses', JSON.stringify(playerBusinesses));
            alert("⏰ Наступил новый день! Ваши временные налоговые ставки сброшены до стандартных 10%.");
        }
    }
}

function updateBalanceDisplay() {
    let el = document.getElementById('user-balance');
    if (el) el.innerText = balance.toLocaleString('ru-RU');
}

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceDisplay();
}

function switchCategory(categoryName) {
    document.querySelectorAll('.container-section').forEach(section => section.style.display = 'none');
    let targetSection = document.getElementById(`section-${categoryName}`);
    if (targetSection) targetSection.style.display = 'block';

    document.querySelectorAll('.category-tab-btn').forEach(btn => btn.classList.remove('active'));
    let activeTab = document.getElementById(`tab-${categoryName}`);
    if (activeTab) activeTab.classList.add('active');
}

function showNotification(msg, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) return;
    
    let toast = document.createElement('div');
    toast.style = "background: #2a2a35; color: #fff; padding: 12px 20px; border-radius: 8px; font-weight: 600; min-width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-left: 5px solid #2ed573;";
    if (type === 'danger') toast.style.borderLeftColor = '#ff4757';
    if (type === 'warning') toast.style.borderLeftColor = '#ffca28';
    
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}

function openContainer(type) {
    loadBusinesses();

    // ЖЕСТКАЯ ПРОВЕРКА ДЛЯ НАЛОГОВОГО КОНТЕЙНЕРА
    if (type === 'tax_container') {
        if (!playerBusinesses || playerBusinesses.length === 0) {
            alert("У вас нет бизнеса, поэтому вы не можете открыть этот контейнер!");
            return;
        }

        let todayStr = new Date().toDateString();
        if (localStorage.getItem('last_tax_container_date') === todayStr) {
            alert("Вы уже открывали налоговый контейнер сегодня. Приходите завтра!");
            return;
        }
    }

    const container = containersData[type];
    if (!container) return;

    if (balance < container.cost) {
        showNotification(`Недостаточно средств! Нужно: ${container.cost.toLocaleString('ru-RU')} ₽`, "danger");
        return;
    }

    balance -= container.cost;
    saveBalance();

    const idx = Math.floor(Math.random() * container.items.length);
    const drop = container.items[idx];
    let dropZone = document.getElementById('drop-container');
    
    dropZone.className = "drop-zone";

    // 1. ЕСЛИ ЭТО НАЛОГОВЫЙ ДРОП
    if (type === 'tax_container') {
        pendingTaxValue = drop.value;
        localStorage.setItem('last_tax_container_date', new Date().toDateString());

        dropZone.classList.add(drop.styleClass);
        dropZone.innerHTML = `
            <div class="win-card">
                <div class="win-title" style="font-size: 24px;">Выбит: <span class="${drop.textClass}">${drop.name}</span></div>
                <p style="margin: 5px 0; font-weight: bold;">Статус: ${drop.label}</p>
                <p style="font-size: 14px; opacity: 0.8;">Сейчас откроется меню обязательного применения налога к вашему предприятию.</p>
            </div>
        `;

        setTimeout(() => {
            openRequiredTaxModal();
        }, 1500);
        return;
    }

    // 2. ЕСЛИ ЭТО ВЫПАДЕНИЕ СЛОТОВ БИЗНЕСА ИЗ ОСОБЫХ КОНТЕЙНЕРОВ
    if (drop.type === "slot_dubai") {
        localStorage.setItem('slot_dubai', 'true');
        dropZone.className = "drop-zone bg-drop-jackpot";
        dropZone.innerHTML = `
            <div class="win-card">
                <div class="win-title text-jackpot">🔥 ПРЕМИУМ ДРОП!</div>
                <div class="win-cost" style="font-size: 18px; font-weight: bold;">Разблокирован: ${drop.name}</div>
            </div>
        `;
        showNotification("Успешно! Открыт слот расширения бизнеса.", "success");
        return;
    }

    if (drop.type === "slot_italy") {
        localStorage.setItem('slot_italy', 'true');
        dropZone.className = "drop-zone bg-drop-jackpot";
        dropZone.innerHTML = `
            <div class="win-card">
                <div class="win-title text-jackpot">👑 ИМПЕРСКИЙ ДРОП!</div>
                <div class="win-cost" style="font-size: 18px; font-weight: bold;">Разблокирован: ${drop.name}</div>
            </div>
        `;
        showNotification("Успешно! Открыт крупный слот расширения бизнеса.", "success");
        return;
    }

    // 3. ЛОГИКА ДЛЯ МАШИН (ОБЫЧНЫЕ / VIP)
    let diff = drop.price - container.cost;
    let resultText = "";
    let resultClass = "";

    if (container.isVip) {
        if (drop.type === "worst") { dropZone.classList.add('bg-drop-worst'); resultClass = "loss"; resultText = "Жесткий минус"; }
        else if (drop.type === "loss") { dropZone.classList.add('bg-drop-loss'); resultClass = "loss"; resultText = `В минус (${diff.toLocaleString('ru-RU')} ₽)`; }
        else if (drop.type === "zero") { dropZone.classList.add('bg-drop-zero'); resultClass = "text-warning"; resultText = "В ноль"; }
        else if (drop.type === "profit") { dropZone.classList.add('bg-drop-profit'); resultClass = "profit"; resultText = `В плюс (+${diff.toLocaleString('ru-RU')} ₽)`; }
        else if (drop.type === "jackpot") { dropZone.classList.add('bg-drop-jackpot'); resultClass = "text-jackpot"; resultText = "👑 ДЖЕКПОТ!"; }
    } else {
        if (diff > 0) { dropZone.classList.add('bg-drop-profit'); resultClass = "profit"; resultText = `Окупаемость (+${diff.toLocaleString('ru-RU')} ₽)`; }
        else if (diff === 0) { dropZone.classList.add('bg-drop-zero'); resultClass = "text-warning"; resultText = "Окупился в ноль"; }
        else { dropZone.classList.add('bg-drop-loss'); resultClass = "loss"; resultText = `Убыток (${diff.toLocaleString('ru-RU')} ₽)`; }
    }

    dropZone.innerHTML = `
        <div class="win-card">
            <div class="win-title">Выпало: ${drop.name}</div>
            <div class="win-cost">Автопродажа за: <span style="color: #2ed573;">${drop.price.toLocaleString('ru-RU')} ₽</span></div>
            <div class="${resultClass}" style="font-size: 15px; font-weight: bold; margin-top: 5px;">Итог: ${resultText}</div>
        </div>
    `;

    balance += drop.price;
    saveBalance();
    showNotification(`Получено: ${drop.name}`, "success");
}

// Принудительное модальное окно выбора бизнеса для налога (БЕЗ КНОПКИ ЗАКРЫТЬ)
function openRequiredTaxModal() {
    loadBusinesses();
    
    let modal = document.getElementById('tax-select-modal');
    if (!modal) return;

    let desc = document.getElementById('tax-modal-desc');
    if (desc) desc.innerText = `Вы выбили Налог ${pendingTaxValue}%. Выберите бизнес для обязательного применения:`;

    let listContainer = document.getElementById('tax-businesses-list');
    listContainer.innerHTML = "";

    playerBusinesses.forEach((biz, index) => {
        let btn = document.createElement('button');
        btn.style = "background: #2a2a35; color: #fff; border: 1px solid #333; padding: 12px; text-align: left; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: bold; transition: background 0.2s; width:100%;";
        let currentTaxVal = biz.currentTax !== undefined ? biz.currentTax : 10;
        btn.innerText = `${biz.name} (Текущий налог: ${currentTaxVal}%)`;
        
        btn.onmouseover = () => btn.style.background = '#3f3f4e';
        btn.onmouseout = () => btn.style.background = '#2a2a35';
        
        btn.onclick = () => {
            applyTargetTax(index);
        };
        listContainer.appendChild(btn);
    });

    modal.style.display = 'flex';
    // Отключаем закрытие по клику мимо окна
    modal.onclick = (e) => { e.stopPropagation(); };
}

function applyTargetTax(index) {
    if (!playerBusinesses[index]) return;

    playerBusinesses[index].currentTax = pendingTaxValue;
    playerBusinesses[index].tax = pendingTaxValue;

    localStorage.setItem('user_businesses', JSON.stringify(playerBusinesses));
    
    alert(`Налог для бизнеса "${playerBusinesses[index].name}" изменен на постоянные ${pendingTaxValue}% до конца дня!`);
    
    document.getElementById('tax-select-modal').style.display = 'none';
    pendingTaxValue = null;
}

function showContent(type) {
    const container = containersData[type];
    if (!container) return;

    let modal = document.getElementById('content-modal');
    let list = document.getElementById('modal-list');
    let title = document.getElementById('modal-title');

    title.innerText = `Состав: ${container.title}`;
    list.innerHTML = "";

    container.items.forEach(item => {
        let li = document.createElement('li');
        li.style = "padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; font-size: 14px;";
        let displayPrice = item.price ? `${item.price.toLocaleString('ru-RU')} ₽` : "Уникальный Эффект";
        li.innerHTML = `<span>${item.name}</span> <span style="color: #2ed573; font-weight:600;">${displayPrice}</span>`;
        list.appendChild(li);
    });

    modal.style.display = 'flex';
}

function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        document.body.className = 'light-theme';
        localStorage.setItem('theme', 'light');
    } else {
        currentTheme = 'dark';
        document.body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark');
    }
}exus_lx.png" },
            { name: "Mercedes-Benz G-Class", price: 18000, img: "images/cars/gelandewagen.png" },
            { name: "Audi R8", price: 19000, img: "images/cars/audi_r8.png" },
            { name: "Porsche Cayenne", price: 20000, img: "images/cars/porsche_cayenne.png" },
            { name: "McLaren 570S", price: 21000, img: "images/cars/mclaren_570s.png" },
            { name: "Ferrari Portofino", price: 22000, img: "images/cars/ferrari_portofino.png" },
            { name: "Lamborghini Huracan", price: 23000, img: "images/cars/lambo_huracan.png" },
            { name: "Rolls-Royce Cullinan", price: 40000, img: "images/cars/rr_cullinan.png" }
        ]
    },
    italy: {
        title: "Италия", cost: 50000,
        items: [
            { name: "Fiat 500", price: 30000, img: "images/cars/fiat_500.png" },
            { name: "Alfa Romeo Giulia", price: 35000, img: "images/cars/alfa_giulia.png" },
            { name: "Maserati Ghibli", price: 40000, img: "images/cars/maserati_ghibli.png" },
            { name: "Ferrari Roma", price: 45000, img: "images/cars/ferrari_roma.png" },
            { name: "Lamborghini Urus", price: 50000, img: "images/cars/lambo_urus.png" },
            { name: "Ferrari F8 Tributo", price: 60000, img: "images/cars/ferrari_f8.png" },
            { name: "Lamborghini Aventador", price: 70000, img: "images/cars/lambo_aventador.png" },
            { name: "Maserati GranTurismo", price: 100000, img: "images/cars/maserati_gt.png" },
            { name: "Bugatti Divo", price: 200000, img: "images/cars/bugatti_divo.png" }
        ]
    },
    dip_germany: {
        title: "Дип. Германия", cost: 1000000, isVip: true,
        items: [
            { name: "Smart Fortwo Brabus", price: 50000, img: "images/cars/smart_brabus.png", type: "worst" },
            { name: "Volkswagen Touareg", price: 600000, img: "images/cars/vw_touareg.png", type: "loss" },
            { name: "Audi Q7", price: 700000, img: "images/cars/audi_q7.png", type: "loss" },
            { name: "BMW X5 M", price: 800000, img: "images/cars/bmw_x5m.png", type: "loss" },
            { name: "Mercedes-Benz E63 AMG", price: 900000, img: "images/cars/mercedes_e63.png", type: "loss" },
            { name: "Porsche Panamera GTS", price: 1000000, img: "images/cars/porsche_panamera.png", type: "zero" },
            { name: "Audi RS7 Sportback", price: 1100000, img: "images/cars/audi_rs7.png", type: "profit" },
            { name: "Mercedes-Benz S-Class W223", price: 1200000, img: "images/cars/mercedes_s223.png", type: "profit" },
            { name: "Porsche 911 Turbo S", price: 1300000, img: "images/cars/porsche_911turbo.png", type: "profit" },
            { name: "Bentley Continental GT", price: 2000000, img: "images/cars/bentley_continental.png", type: "jackpot" }
        ]
    },
    dip_dubai: {
        title: "Дип. Дубай", cost: 2000000, isVip: true,
        items: [
            { name: "Renault Twizy", price: 75000, img: "images/cars/renault_twizy.png", type: "worst" },
            { name: "Lexus GX 460", price: 1200000, img: "images/cars/lexus_gx.png", type: "loss" },
            { name: "Nissan GT-R R35", price: 1400000, img: "images/cars/nissan_gtr.png", type: "loss" },
            { name: "Mercedes-Benz AMG GT", price: 1600000, img: "images/cars/mercedes_amggt.png", type: "loss" },
            { name: "Lamborghini Huracan STO", price: 1800000, img: "images/cars/lambo_sto.png", type: "loss" },
            { name: "Ferrari SF90 Stradale", price: 2000000, img: "images/cars/ferrari_sf90.png", type: "zero" },
            { name: "Aston Martin DBS", price: 2100000, img: "images/cars/aston_dbs.png", type: "profit" },
            { name: "Rolls-Royce Ghost", price: 2200000, img: "images/cars/rr_ghost.png", type: "profit" },
            { name: "Bugatti Veyron", price: 2300000, img: "images/cars/bugatti_veyron.png", type: "profit" },
            { name: "McLaren P1", price: 2500000, img: "images/cars/mclaren_p1.png", type: "profit" },
            { name: "Tesla Cybertruck", price: 4000000, img: "images/cars/tesla_cybertruck.png", type: "jackpot" }
        ]
    },
    dip_italy: {
        title: "Дип. Италия", cost: 5000000, isVip: true,
        items: [
            { name: "Старый ВАЗ-2104 с рынка", price: 100000, img: "images/cars/vaz_2104.png", type: "worst" },
            { name: "Maserati Levante", price: 3000000, img: "images/cars/maserati_levante.png", type: "loss" },
            { name: "Alfa Romeo Giulia GTA", price: 3500000, img: "images/cars/alfa_giulia_gta.png", type: "loss" },
            { name: "Ferrari 488 Pista", price: 4000000, img: "images/cars/ferrari_pista.png", type: "loss" },
            { name: "Lamborghini Aventador SVJ", price: 4500000, img: "images/cars/lambo_svj.png", type: "loss" },
            { name: "Ferrari LaFerrari", price: 5000000, img: "images/cars/ferrari_laferrari.png", type: "zero" },
            { name: "Maserati MC20", price: 5300000, img: "images/cars/maserati_mc20.png", type: "profit" },
            { name: "Lamborghini Sian", price: 5600000, img: "images/cars/lambo_sian.png", type: "profit" },
            { name: "Ferrari Daytona SP3", price: 5800000, img: "images/cars/ferrari_sp3.png", type: "profit" },
            { name: "Pagani Zonda Cinque", price: 20000000, img: "images/cars/pagani_zonda.png", type: "jackpot" }
        ]
    }
};

window.onload = function() {
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    updateBalanceUI();
    currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
}

function updateBalanceUI() {
    document.getElementById('user-balance').innerText = Math.floor(balance).toLocaleString('ru-RU');
}

function toggleTheme() {
    currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    const body = document.getElementById('app-body');
    const btn = document.getElementById('theme-btn');
    if (theme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        if(btn) btn.innerText = "☀️ Тема";
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if(btn) btn.innerText = "🌙 Тема";
    }
}

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
    }, 4000);
}

function showSecretAlert() {
    showNotification("Содержимое дипломатического контейнера засекречено! Полагайтесь на удачу.", "info");
}

function showContent(type) {
    // Показывает состав только для обычных контейнеров
    if (type.startsWith('dip_')) return;
    
    const container = containersData[type];
    const modal = document.getElementById('content-modal');
    const list = document.getElementById('modal-list');
    
    document.getElementById('modal-title').innerText = `Состав: ${container.title}`;
    list.innerHTML = '';
    
    container.items.forEach(item => {
        list.innerHTML += `<li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;"><span>${item.name}</span> <b style="color: var(--success);">${item.price.toLocaleString('ru-RU')} ₽</b></li>`;
    });
    
    modal.style.display = 'flex';
}

function resetDropZoneClasses(dropZone) {
    dropZone.classList.remove('bg-drop-worst', 'bg-drop-loss', 'bg-drop-zero', 'bg-drop-profit', 'bg-drop-jackpot');
}

function openContainer(type) {
    const container = containersData[type];
    if (!container) return;

    if (balance < container.cost) {
        showNotification("Недостаточно средств для покупки контейнера!", "danger");
        return;
    }

    balance -= container.cost;
    saveBalance();
    updateBalanceUI();

    const dropContainer = document.getElementById('drop-container');
    resetDropZoneClasses(dropContainer);
    
    dropContainer.innerHTML = `
        <div style="font-size: 50px; animation: spin 1s infinite linear;">💼</div>
        <p style="margin-top: 15px; font-weight: 600;">Вскрываем замок контейнера ${container.title}...</p>
    `;

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const car = container.items[randomIndex];

        balance += car.price;
        saveBalance();
        updateBalanceUI();

        const diff = car.price - container.cost;
        let resultClass = "profit";
        let resultText = `(+${diff.toLocaleString('ru-RU')} ₽)`;

        if (diff < 0) {
            resultClass = "loss";
            resultText = `(${diff.toLocaleString('ru-RU')} ₽)`;
        } else if (diff === 0) {
            resultClass = "";
            resultText = "(В ноль)";
        }

        // Логика изменения фона для Дипломатических контейнеров
        if (container.isVip) {
            if (car.type === "worst") {
                dropContainer.classList.add('bg-drop-worst');
            } else if (car.type === "loss") {
                dropContainer.classList.add('bg-drop-loss');
            } else if (car.type === "zero") {
                dropContainer.classList.add('bg-drop-zero');
            } else if (car.type === "profit") {
                dropContainer.classList.add('bg-drop-profit');
            } else if (car.type === "jackpot") {
                dropContainer.classList.add('bg-drop-jackpot');
                resultClass = "text-jackpot";
            }
        }

        dropContainer.innerHTML = `
            <div class="win-card">
                <img src="${car.img}" alt="${car.name}" class="win-car-img" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(car.name)}'">
                <div class="win-title">${car.name}</div>
                <div class="win-cost">Стоимость продажи: <span>${car.price.toLocaleString('ru-RU')} ₽</span></div>
                <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 5px; font-weight: bold;">Итог: ${resultText}</div>
            </div>
        `;

        if (diff > 0) {
            if (car.type === "jackpot") {
                showNotification(`🔥 ОФИГЕТЬ! Вы выбили ГЛАВНЫЙ КУШ: ${car.name}!`, "success");
            } else {
                showNotification(`Вы выбили ${car.name} и ушли в плюс!`, "success");
            }
        } else if (diff === 0) {
            showNotification(`Вы выбили ${car.name}. Вышли ровно в ноль.`, "info");
        } else {
            if (car.type === "worst") {
                showNotification(`💀 ПОЛНЫЙ СЛИВ! Вам выпал ${car.name}...`, "danger");
            } else {
                showNotification(`Вы выбили ${car.name}. Окуп не удался.`, "info");
            }
        }

    }, 1200);
}
