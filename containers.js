// ===========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ИНТЕГРАЦИЯ С LOCALSTORAGE)
// ===========================================
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
    },
    biz_slots: {
        title: "Бизнес-Слот", cost: 50000,
        items: [
            { name: "Слот: Малый бизнес", type: "slot_small", img: "images/slots/small.png", price: 0 },
            { name: "Слот: Средний бизнес", type: "slot_medium", img: "images/slots/medium.png", price: 0 },
            { name: "Слот: Крупный бизнес", type: "slot_large", img: "images/slots/large.png", price: 0 }
        ]
    }
};

// Запуск при загрузке страницы
window.onload = function() {
    balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    currentTheme = localStorage.getItem('user_theme') || 'dark';

    document.body.className = currentTheme + '-theme';
    updateBalanceDisplay();
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toString());
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

    const dropContainer = document.getElementById('container-drop-result');
    if (dropContainer) {
        dropContainer.innerHTML = `<div class="spinner-loader">Крутим контейнер...</div>`;
    }

    document.getElementById('content-modal').style.display = 'flex';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const item = container.items[randomIndex];

        let resultText = "";
        let resultClass = "";

        // Проверяем: это авто или слот бизнеса
        if (type === 'biz_slots') {
            // ЛОГИКА ДРОПА СЛОТОВ
            let slotsData = JSON.parse(localStorage.getItem('player_business_slots')) || { small: 0, medium: 0, large: 0 };
            
            if (item.type === 'slot_small') { slotsData.small += 1; resultText = "Получен слот Малого бизнеса!"; }
            if (item.type === 'slot_medium') { slotsData.medium += 1; resultText = "Получен слот Среднего бизнеса!"; }
            if (item.type === 'slot_large') { slotsData.large += 1; resultText = "Получен слот Крупного бизнеса!"; }
            
            localStorage.setItem('player_business_slots', JSON.stringify(slotsData));
            resultClass = "text-jackpot";

            showNotification(`🎉 Отлично! Вы выбили: ${item.name}`, "success");
        } else {
            // ЛОГИКА ДРОПА МАШИН
            balance += item.price;
            saveBalance();
            updateBalanceDisplay();

            let diff = item.price - container.cost;
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

            if (item.type === "jackpot") {
                resultClass = "text-jackpot";
                showNotification(`🔥 ОФИГЕТЬ! Вы выбили ГЛАВНЫЙ КУШ: ${item.name}!`, "success");
            } else if (diff >= 0) {
                showNotification(`Вы выбили ${item.name} и получили деньги!`, "success");
            } else {
                showNotification(`Выпал транспорт ${item.name}.`, "error");
            }
        }

        if (dropContainer) {
            dropContainer.innerHTML = `
                <div class="win-card">
                    <img src="${item.img}" alt="${item.name}" class="win-car-img" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(item.name)}'">
                    <div class="win-title">${item.name}</div>
                    ${item.price > 0 ? `<div class="win-cost">Стоимость продажи: <span>${item.price.toLocaleString('ru-RU')} ₽</span></div>` : ''}
                    <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 5px; font-weight: bold;">Итог: ${resultText}</div>
                </div>
            `;
        }
    }, 2500);
}

function previewContainer(type) {
    const container = containersData[type];
    if (!container) return;

    const dropContainer = document.getElementById('container-drop-result');
    if (!dropContainer) return;

    let equalChance = (100 / container.items.length).toFixed(1);
    let htmlContent = `<div style="width:100%; max-height:300px; overflow-y:auto; padding-right:5px;">
                        <p style="font-size:13px; opacity:0.7; margin-bottom:10px; text-align:left;">Шанс выбить предмет: ${equalChance}%.</p>
                        <div style="display:flex; flex-direction:column; gap:8px;">`;

    container.items.forEach(item => {
        htmlContent += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color, #3a3a4a);">
                <div style="font-weight: 600; font-size: 15px; color: #fff;">${item.name}</div>
                <div style="font-size: 15px; font-weight: 700; color: #2ecc71;">${item.price > 0 ? item.price.toLocaleString('ru-RU') + ' ₽' : 'Слот'}</div>
            </div>
        `;
    });

    htmlContent += `</div></div>`;
    dropContainer.innerHTML = htmlContent;
    document.getElementById('content-modal').style.display = 'flex';
}

function closeContainerModal() {
    document.getElementById('content-modal').style.display = 'none';
}

function showNotification(text, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

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
}
