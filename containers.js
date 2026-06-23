// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (СИНХРОНИЗАЦИЯ С LOCALSTORAGE)
// ==========================================
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
            { name: "Porsche Cayman", price: 25000, img: "images/cars/porsche_cayman.png" },
            { name: "Audi R8", price: 50000, img: "images/cars/audi_r8.png", type: "jackpot" }
        ]
    },
    japan: {
        title: "Япония", cost: 25000,
        items: [
            { name: "Nissan Almera", price: 10000, img: "images/cars/nissan_almera.png" },
            { name: "Mitsubishi Lancer", price: 13000, img: "images/cars/mitsubishi_lancer.png" },
            { name: "Toyota Corolla", price: 16000, img: "images/cars/toyota_corolla.png" },
            { name: "Mazda 6", price: 20000, img: "images/cars/mazda_6.png" },
            { name: "Subaru Impreza WRX", price: 25000, img: "images/cars/subaru_impreza.png" },
            { name: "Honda Civic Type R", price: 30000, img: "images/cars/honda_civic.png" },
            { name: "Toyota Camry", price: 35000, img: "images/cars/toyota_camry.png" },
            { name: "Nissan GT-R R34", price: 60000, img: "images/cars/nissan_gtr34.png" },
            { name: "Toyota Supra A80", price: 75000, img: "images/cars/toyota_supra.png" },
            { name: "Lexus LFA", price: 150000, img: "images/cars/lexus_lfa.png", type: "jackpot" }
        ]
    },
    usa: {
        title: "США", cost: 75000,
        items: [
            { name: "Ford Focus", price: 30000, img: "images/cars/ford_focus.png" },
            { name: "Chevrolet Cruze", price: 35000, img: "images/cars/chevrolet_cruze.png" },
            { name: "Dodge Dart", price: 42000, img: "images/cars/dodge_dart.png" },
            { name: "Ford Mustang V6", price: 60000, img: "images/cars/ford_mustang.png" },
            { name: "Chevrolet Camaro SS", price: 75000, img: "images/cars/chevrolet_camaro.png" },
            { name: "Dodge Challenger SRT", price: 90000, img: "images/cars/dodge_challenger.png" },
            { name: "Jeep Grand Cherokee Trackhawk", price: 130000, img: "images/cars/jeep_trackhawk.png" },
            { name: "Chevrolet Corvette C8", price: 180000, img: "images/cars/corvette_c8.png" },
            { name: "Ford GT", price: 350000, img: "images/cars/ford_gt.png", type: "jackpot" }
        ]
    },
    dubai: {
        title: "Дубай (Премиум)", cost: 250000,
        items: [
            { name: "Nissan Patrol", price: 100000, img: "images/cars/nissan_patrol.png" },
            { name: "Mercedes-Benz G63 AMG", price: 180000, img: "images/cars/mercedes_g63.png" },
            { name: "Porsche 911 Turbo S", price: 250000, img: "images/cars/porsche_911.png" },
            { name: "Ferrari F8 Tributo", price: 320000, img: "images/cars/ferrari_f8.png" },
            { name: "Lamborghini Huracan", price: 350000, img: "images/cars/lambo_huracan.png" },
            { name: "McLaren 720S", price: 400000, img: "images/cars/mclaren_720s.png" },
            { name: "Rolls-Royce Cullinan", price: 550000, img: "images/cars/rr_cullinan.png" },
            { name: "Bugatti Chiron", price: 1200000, img: "images/cars/bugatti_chiron.png", type: "jackpot" }
        ]
    }
};

// База данных магазинов предприятий (Маркетплейс)
const businessDatabase = {
    small: [
        { id: "b_kiosk", name: "Уличный Киоск", cost: 15000, income: 40, desc: "Продажа кофе и быстрых закусок. Приносит небольшой пассивный доход." },
        { id: "b_carwash", name: "Автомойка Self-Service", cost: 45000, income: 130, desc: "Автоматическая мойка. Требует мало внимания, стабильный поток клиентов." },
        { id: "b_barber", name: "Барбершоп 'TopCut'", cost: 90000, income: 280, desc: "Стильная парикмахерская. Хороший доход за счёт постоянных клиентов." }
    ],
    medium: [
        { id: "b_rest", name: "Семейный Ресторан", cost: 250000, income: 850, desc: "Уютное заведение европейской кухни. Высокая маржинальность." },
        { id: "b_hotel", name: "Мини-Отель на 15 мест", cost: 600000, income: 2200, desc: "Гостиничный бизнес в центре города. Стабильный доход круглый год." },
        { id: "b_fitness", name: "Фитнес-Центр 'StrongBody'", cost: 1200000, income: 4800, desc: "Современный зал с тренажерами и пулом тренеров." }
    ],
    large: [
        { id: "b_factory", name: "Завод Микроэлектроники", cost: 5000000, income: 22000, desc: "Высокотехнологичное производство чипов. Огромный пассивный доход." },
        { id: "b_mall", name: "Торгово-Развлекательный Центр", cost: 15000000, income: 75000, desc: "Сдача площадей в аренду топовым брендам и кинотеатрам." },
        { id: "b_oil", name: "Нефтяная Вышка 'Black Gold'", cost: 50000000, income: 280000, desc: "Добыча сырья стратегического назначения. Корпоративный уровень прибыли." }
    ]
};

// Хранилище слотов и бизнесов игрока
let playerBusinessData = {
    slots: { small: 0, medium: 0, large: 0 },
    owned: []
};

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    // Загрузка баланса с ПРАВИЛЬНЫМ КЛЮЧОМ
    balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    currentTheme = localStorage.getItem('user_theme') || 'dark';
    
    // Загружаем данные о бизнесах
    if (localStorage.getItem('player_business_data')) {
        playerBusinessData = JSON.parse(localStorage.getItem('player_business_data'));
    } else {
        saveBusinessData();
    }

    document.body.className = currentTheme + '-theme';
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.innerText = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    
    updateBalanceDisplay();
    renderMarket();
    renderMyBusinesses();
}

function saveBalance() {
    localStorage.setItem('user_balance', balance.toString());
}

function saveBusinessData() {
    localStorage.setItem('player_business_data', JSON.stringify(playerBusinessData));
}

function updateBalanceDisplay() {
    const el = document.getElementById('balance-val');
    if (el) {
        el.innerText = balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// ==========================================
// СИСТЕМА ОТКРЫТИЯ КОНТЕЙНЕРОВ
// ==========================================
function openContainer(type) {
    const container = containersData[type];
    if (!container) return;

    if (balance < container.cost) {
        showNotification("Недостаточно денег для открытия этого контейнера!", "error");
        return;
    }

    balance -= container.cost;
    saveBalance();
    updateBalanceDisplay();

    const modalTitle = document.getElementById('modal-container-title');
    if (modalTitle) modalTitle.innerText = `Открытие контейнера: ${container.title}`;

    const dropContainer = document.getElementById('container-drop-result');
    if (dropContainer) {
        dropContainer.innerHTML = `<div class="spinner-loader" style="font-weight: bold; color: #ffa502;">🔄 Идет разгрузка контейнера на склад...</div>`;
    }

    const modal = document.getElementById('container-open-modal');
    if (modal) modal.style.display = 'flex';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const car = container.items[randomIndex];
        
        balance += car.price;
        saveBalance();
        updateBalanceDisplay();

        let diff = car.price - container.cost;
        let resultText = "";
        let resultClass = "";

        if (diff > 0) {
            resultText = `В ПЛЮСЕ НА +${diff.toLocaleString('ru-RU')} ₽`;
            resultClass = "text-success";
        } else if (diff === 0) {
            resultText = "ВЫШЛИ В НОЛЬ";
            resultClass = "text-info";
        } else {
            resultText = `В МИНУСЕ НА ${diff.toLocaleString('ru-RU')} ₽`;
            resultClass = "text-danger";
        }

        if (car.type === "jackpot") {
            resultClass = "text-jackpot";
        }

        if (dropContainer) {
            dropContainer.innerHTML = `
                <div class="win-card" style="text-align:center;">
                    <img src="${car.img}" alt="${car.name}" class=\"win-car-img\" style="max-width:100%; border-radius:8px; margin-bottom:15px;" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(car.name)}'">
                    <div class="win-title" style="font-size: 20px; font-weight:bold; margin-bottom:5px;">${car.name}</div>
                    <div class="win-cost" style="font-size:16px;">Стоимость авто: <span style="color:#2ecc71; font-weight:bold;">${car.price.toLocaleString('ru-RU')} ₽</span></div>
                    <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 5px; font-weight: bold;">Итог: ${resultText}</div>
                </div>
            `;
        }

        if (diff > 0) {
            if (car.type === "jackpot") {
                showNotification(`🔥 ОФИГЕТЬ! Вы выбили ГЛАВНЫЙ КУШ: ${car.name}!`, "success");
            } else {
                showNotification(`Вы выбили ${car.name} и ушли в плюс!`, "success");
            }
        } else if (diff === 0) {
            showNotification(`Вы выбили ${car.name}. Вышли ровно в ноль.`, \"info\");
        } else {
            showNotification(`Выпал транспорт ${car.name}. Убыток: ${Math.abs(diff).toLocaleString('ru-RU')} ₽`, "error");
        }
    }, 2500);
}

function closeContainerModal() {
    const modal = document.getElementById('container-open-modal');
    if (modal) modal.style.display = 'none';
}

function previewContainer(type) {
    const container = containersData[type];
    if (!container) return;

    const modalTitle = document.getElementById('modal-container-title');
    if (modalTitle) modalTitle.innerText = `Содержимое контейнера: ${container.title}`;

    const dropContainer = document.getElementById('container-drop-result');
    if (!dropContainer) return;

    let equalChance = (100 / container.items.length).toFixed(1);
    let htmlContent = `<div style="width:100%; max-height:300px; overflow-y:auto; padding-right:5px;">
                        <p style="font-size:13px; opacity:0.7; margin-bottom:10px; text-align:left;">Шанс выпадения любого предмета из этого контейнера одинаковый и равен ${equalChance}%.</p>
                        <div style="display:flex; flex-direction:column; gap:8px;">`;

    container.items.forEach(car => {
        let badgeColor = "var(--border-color, #3a3a4a)";
        let textColor = "#fff";
        
        if (car.type === "jackpot") {
            badgeColor = "#ffca28";
            textColor = "#000";
        } else if (car.price > container.cost) {
            badgeColor = "rgba(46, 204, 113, 0.2)";
            textColor = "#2ecc71";
        } else if (car.price < container.cost) {
            badgeColor = "rgba(231, 76, 60, 0.1)";
            textColor = "#e74c3c";
        }

        htmlContent += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color, #3a3a4a);">
                <div style="font-weight: 600; font-size: 15px; color: #fff;">${car.name}</div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 15px; font-weight: 700; color: #2ecc71;">${car.price.toLocaleString('ru-RU')} ₽</div>
                    <div style="font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 6px; background: ${badgeColor}; color: ${textColor};">
                        ${car.type === "jackpot" ? "ДЖЕКПОТ" : (car.price >= container.cost ? "ОКУП" : "СЛИВ")}
                    </div>
                </div>
            </div>
        `;
    });

    htmlContent += `</div></div>`;
    dropContainer.innerHTML = htmlContent;

    const modal = document.getElementById('container-open-modal');
    if (modal) modal.style.display = 'flex';
}

// ==========================================
// СИСТЕМА ПОКУПКИ И УПРАВЛЕНИЯ БИЗНЕСОМ
// ==========================================
function renderMarket() {
    ['small', 'medium', 'large'].forEach(tier => {
        const container = document.getElementById(`cat-${tier}`);
        if (!container) return;
        
        container.innerHTML = "";
        let currentSlots = playerBusinessData.slots[tier] || 0;
        let activeInTier = playerBusinessData.owned.filter(b => b.tier === tier).length;

        businessDatabase[tier].forEach(biz => {
            const card = document.createElement('div');
            card.className = "biz-card";
            
            card.innerHTML = `
                <div>
                    <div class="biz-title">${biz.name}</div>
                    <div class="biz-price">${biz.cost.toLocaleString('ru-RU')} ₽</div>
                    <div class="biz-info">${biz.desc}<br><br><b>Доход:</b> +${biz.income} ₽ / 10 сек.</div>
                </div>
                <button onclick="buyBusiness('${tier}', '${biz.id}')" class="btn btn-primary" style="width:100%; margin-top:10px;">Купить предприятие</button>
            `;
            container.appendChild(card);
        });
    });
    updateBusinessHeaders();
}

function renderMyBusinesses() {
    const container = document.getElementById('my-business-content-area');
    if (!container) return;

    container.innerHTML = "";

    if (!playerBusinessData.owned || playerBusinessData.owned.length === 0) {
        container.innerHTML = `
            <div class="empty-business-state">
                <h3 style="margin-bottom: 10px;">💼 У вас пока нет действующих предприятий</h3>
                <p style="font-size: 14px; opacity:0.8; max-width:500px; margin: 0 auto 20px auto;">
                    Вы можете выиграть свободные слоты на владение малым, средним или крупным бизнесом в порту, открывая контейнеры, а затем приобрести предприятие в магазине.
                </p>
                <button onclick="switchTab('game-buy-business', null)" class="btn btn-primary">Перейти в магазин предприятий 🛒</button>
            </div>
        `;
        return;
    }

    const grid = document.createElement('div');
    grid.className = "business-category-section active";
    grid.style.display = "grid";

    playerBusinessData.owned.forEach((biz, index) => {
        let tierName = biz.tier === 'small' ? "Малый" : (biz.tier === 'medium' ? "Средний" : "Крупный");
        const card = document.createElement('div');
        card.className = "biz-card";
        card.innerHTML = `
            <div>
                <div style="font-size:11px; text-transform:uppercase; font-weight:bold; opacity:0.6; margin-bottom:5px;">${tierName} бизнес</div>
                <div class="biz-title">${biz.name}</div>
                <div class="biz-info">
                    💵 <b>Доходность:</b> +${biz.income} ₽ / 10 сек<br>
                    📊 <b>Налоговая ставка:</b> <span style="color:#ff4757; font-weight:bold;">${biz.tax}%</span><br>
                    📦 <b>Склад готовой продукции:</b> ${biz.products} / 10 000 единиц
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">
                <button onclick="collectBusinessProfit(${index})" class="btn btn-success" style="width:100%; font-weight:600;">Разгрузить склад (+${Math.floor(biz.products * 0.5)} ₽)</button>
                <button onclick="sellBusiness(${index})" class="btn btn-secondary" style="width:100%; font-size:12px; opacity:0.8;">Продать за 50% стоимости</button>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
    updateBusinessHeaders();
}

function buyBusiness(tier, id) {
    const template = businessDatabase[tier].find(b => b.id === id);
    if (!template) return;

    let currentSlots = playerBusinessData.slots[tier] || 0;
    let activeInTier = playerBusinessData.owned.filter(b => b.tier === tier).length;

    if (activeInTier >= currentSlots) {
        showNotification(`У вас нет свободных слотов для покупки бизнеса категории "${tier === 'small' ? 'Малый' : tier === 'medium' ? 'Средний' : 'Крупный'}"! Выбейте слоты в контейнерах.`, "error");
        return;
    }

    if (balance < template.cost) {
        showNotification("Недостаточно средств для покупки этого предприятия!", "error");
        return;
    }

    balance -= template.cost;
    saveBalance();
    updateBalanceDisplay();

    playerBusinessData.owned.push({
        id: template.id,
        name: template.name,
        tier: tier,
        income: template.income,
        cost: template.cost,
        tax: 10,
        products: 0
    });
    
    saveBusinessData();
    renderMarket();
    renderMyBusinesses();

    showNotification(`🎉 Поздравляем! Вы приобрели предприятие "${template.name}"!`, "success");
}

function collectBusinessProfit(index) {
    const biz = playerBusinessData.owned[index];
    if (!biz) return;

    let profit = Math.floor(biz.products * 0.5);
    if (profit <= 0) {
        showNotification("На складе пусто! Пока нечего разгружать.", "info");
        return;
    }

    let netProfit = profit * (1 - (biz.tax / 100));

    balance += netProfit;
    biz.products = 0;

    saveBalance();
    updateBalanceDisplay();
    saveBusinessData();
    renderMyBusinesses();

    showNotification(`Вы разгрузили склад и получили чистую прибыль: +${Math.floor(netProfit).toLocaleString('ru-RU')} ₽ (Налог: ${biz.tax}%)`, "success");
}

function sellBusiness(index) {
    const biz = playerBusinessData.owned[index];
    if (!biz) return;

    let refund = Math.floor(biz.cost * 0.5);
    balance += refund;
    saveBalance();
    updateBalanceDisplay();

    showNotification(`Предприятие "${biz.name}" успешно ликвидировано и продано за ${refund.toLocaleString('ru-RU')} ₽! Слот освобожден.`, "info");

    playerBusinessData.owned.splice(index, 1);
    saveBusinessData();
    renderMarket();
    renderMyBusinesses();
}

function updateBusinessHeaders() {
    ['small', 'medium', 'large'].forEach(tier => {
        const total = playerBusinessData.slots[tier] || 0;
        const active = playerBusinessData.owned.filter(b => b.tier === tier).length;
    });
}

// ==========================================
// ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
function showNotification(text, type = 'success') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerText = text;
    container.appendChild(notif);

    setTimeout(() => { notif.classList.add('show'); }, 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => { notif.remove(); }, 300);
    }, 4000);
}

function toggleTheme() {
    currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    localStorage.setItem('user_theme', currentTheme);
    document.body.className = currentTheme + '-theme';
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.innerText = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
}

function switchTab(tabId, btnElement) {
    document.querySelectorAll('.game-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(tabId);
    if (targetSection) targetSection.classList.add('active');

    if (btnElement) {
        const parent = btnElement.parentElement;
        if (parent) {
            parent.querySelectorAll('.btn').forEach(b => b.style.border = "none");
        }
    }
}

function switchBusinessMarketTab(catId, btnElement) {
    document.querySelectorAll('.business-category-section').forEach(sec => sec.classList.remove('active'));
    const targetCat = document.getElementById(catId);
    if (targetCat) targetCat.classList.add('active');

    if (btnElement && btnElement.parentElement) {
        btnElement.parentElement.querySelectorAll('.b-tab-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
}

function returnToMainDashboard() {
    window.location.href = "index.html";
}
