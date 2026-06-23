// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ПОЛНАЯ СИНХРОНИЗАЦИЯ С INDEX)
// ==========================================
let balance = 200;
let currentTheme = 'dark';

// ПОЛНАЯ ОРИГИНАЛЬНАЯ БАЗА ДАННЫХ КОНТЕЙНЕРОВ
const containersData = {
    // --- ОБЫЧНЫЕ ---
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

    // --- ДИПЛОМАТИЧЕСКИЕ ---
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

    // --- ОСОБЫЕ ---
    special_germany: {
        title: "Особая Германия", cost: 25000,
        items: [
            { name: "Volkswagen Golf GTI", price: 10000, img: "images/cars/vw_golf.png" },
            { name: "Porsche 911 Carrera", price: 20000, img: "images/cars/porsche_911.png" },
            { name: "BMW M5 F90", price: 25000, img: "images/cars/bmw_m5.png" },
            { name: "Слот для Малого Бизнеса", price: 40000, type: "slot_germany", img: "images/items/slot_germany.png" }
        ]
    },
    special_dubai: {
        title: "Особый Дубай", cost: 50000,
        items: [
            { name: "Porsche Cayenne", price: 20000, img: "images/cars/porsche_cayenne.png" },
            { name: "Lamborghini Huracan", price: 23000, img: "images/cars/lambo_huracan.png" },
            { name: "Rolls-Royce Cullinan", price: 40000, img: "images/cars/rr_cullinan.png" },
            { name: "Слот для Среднего Бизнеса", price: 80000, type: "slot_dubai", img: "images/items/slot_dubai.png" }
        ]
    },
    special_italy: {
        title: "Особая Италия", cost: 120000,
        items: [
            { name: "Ferrari F8 Tributo", price: 60000, img: "images/cars/ferrari_f8.png" },
            { name: "Maserati GranTurismo", price: 100000, img: "images/cars/maserati_gt.png" },
            { name: "Bugatti Divo", price: 200000, img: "images/cars/bugatti_divo.png" },
            { name: "Слот для Крупного Бизнеса", price: 150000, type: "slot_italy", img: "images/items/slot_italy.png" }
        ]
    },

    // --- НАЛОГОВЫЕ ---
    tax_container: {
        title: "Налоговый Контейнер", cost: 45000,
        items: [
            { name: "Налог 0%", value: 0, label: "Ультра-джекпот", type: "tax_bonus", img: "images/bonus/tax_0.png" },
            { name: "Налог 7%", value: 7, label: "Выгодно", type: "tax_bonus", img: "images/bonus/tax_7.png" },
            { name: "Налог 8%", value: 8, label: "Хорошо", type: "tax_bonus", img: "images/bonus/tax_8.png" },
            { name: "Налог 15%", value: 15, label: "Слив", type: "tax_bonus", img: "images/bonus/tax_15.png" },
            { name: "Налог 25%", value: 25, label: "Жесткий минус", type: "tax_bonus", img: "images/bonus/tax_25.png" }
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
    currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = currentTheme + '-theme';

    updateBalanceDisplay();
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    const el = document.getElementById('user-balance');
    if (el) {
        el.innerText = balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// ==========================================
// ГЛАВНЫЙ МЕХАНИЗМ ОТКРЫТИЯ
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

    const dropResultZone = document.getElementById('container-drop-result');
    if (dropResultZone) {
        dropResultZone.innerHTML = `<div class="spinner-loader" style="font-size: 18px; font-weight: bold; padding: 40px; color: #ffa502;">🚢 Разгрузка контейнера...</div>`;
    }

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const item = container.items[randomIndex];

        let resultText = "";
        let resultClass = "";

        // 1. Механика Налогового Бонуса
        if (item.type === "tax_bonus") {
            resultText = `ВЫБИТ НАЛОГ: ${item.value}% (${item.label})!`;
            resultClass = item.value <= 8 ? "text-success" : "text-danger";
            
            localStorage.setItem('pending_tax_coupon', item.value.toString());
            showNotification(`🔥 Налоговый контейнер: Выпал налог ${item.value}%! Примените в управлении бизнесом.`, item.value <= 8 ? "success" : "info");
            
        // 2. Механика Выпадения Бизнес-Слота
        } else if (item.type && item.type.startsWith("slot_")) {
            balance += item.price; // Дополнительно даем утешительный баланс за слот
            saveBalance();
            
            resultText = `ВЫПАЛ ${item.name.toUpperCase()}!`;
            resultClass = "text-success";
            
            // Сохраняем информацию о выигранном слоте в localStorage для главной страницы
            let wonSlots = JSON.parse(localStorage.getItem('won_business_slots')) || [];
            wonSlots.push(item.type);
            localStorage.setItem('won_business_slots', JSON.stringify(wonSlots));
            
            showNotification(`🎉 ОФИГЕТЬ! Вы выиграли ${item.name}! Он добавлен в доступные активы на главной!`, "success");
            
        // 3. Механика Обычного Автомобиля (Авто-продажа)
        } else {
            balance += item.price;
            saveBalance();

            let diff = item.price - container.cost;
            if (diff > 0) {
                resultText = `В ПЛЮСЕ НА +${diff.toLocaleString('ru-RU')} ₽`;
                resultClass = "text-success";
                showNotification(`🎉 Вы выбили ${item.name} в плюс!`, "success");
            } else if (diff === 0) {
                resultText = "ВЫШЛИ В НОЛЬ";
                resultClass = "text-info";
                showNotification(`Вы выбили ${item.name}. Сделка в ноль.`, "info");
            } else {
                resultText = `В МИНУСЕ НА ${Math.abs(diff).toLocaleString('ru-RU')} ₽`;
                resultClass = "text-danger";
                showNotification(`Выпал транспорт ${item.name}. Продано в минус.`, "error");
            }

            if (item.type === "jackpot") {
                resultClass = "text-jackpot";
                showNotification(`🔥 ОФИГЕТЬ! ВЫ ВЫБИЛИ ГЛАВНЫЙ КУШ: ${item.name}!`, "success");
            }
        }

        if (dropResultZone) {
            dropResultZone.innerHTML = `
                <div class="win-card" style="text-align: center; padding: 10px;">
                    <img src="${item.img}" alt="${item.name}" class="win-car-img" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(item.name)}'">
                    <div class="win-title">${item.name}</div>
                    ${item.price ? `<div class="win-cost">Компенсация/Продажа: <span style="color: #2ecc71;">${item.price.toLocaleString('ru-RU')} ₽</span></div>` : ''}
                    <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 5px; font-weight: bold;">Итог: ${resultText}</div>
                </div>
            `;
        }
    }, 2000);
}

function previewContainer(type) {
    const container = containersData[type];
    if (!container) return;

    const previewList = document.getElementById('container-preview-list');
    if (!previewList) return;

    let equalChance = (100 / container.items.length).toFixed(1);
    let htmlContent = `<div style="max-height:300px; overflow-y:auto; padding-top: 10px;">
                        <p style="font-size:13px; opacity:0.7; margin-bottom:10px;">Шанс на каждый предмет: ${equalChance}%</p>
                        <div style="display:flex; flex-direction:column; gap:8px;">`;

    container.items.forEach(item => {
        let displayCost = item.price ? `${item.price.toLocaleString('ru-RU')} ₽` : `Изменение налога`;
        htmlContent += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <div style="font-size: 14px; color: #fff;">${item.name} ${item.label ? `(${item.label})` : ''}</div>
                <div style="font-size: 14px; font-weight: 700; color: #2ecc71;">${displayCost}</div>
            </div>
        `;
    });

    htmlContent += `</div></div>`;
    previewList.innerHTML = htmlContent;
    
    document.getElementById('content-modal').style.display = 'flex';
}

function closeContainerModal() {
    document.getElementById('content-modal').style.display = 'none';
}

function switchCategory(cat) {
    document.querySelectorAll('.container-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
    
    const targetSection = document.getElementById(`section-${cat}`);
    const targetTab = document.getElementById(`tab-${cat}`);
    
    if (targetSection) targetSection.style.display = 'block';
    if (targetTab) targetTab.classList.add('active');
}

function showNotification(text, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.style.cssText = "position: fixed; top: 20px; right: 20px; background: #2f3542; color: #fff; padding: 12px 20px; border-radius: 6px; z-index: 9999; margin-bottom: 10px; border-left: 5px solid #ffa502; box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
    
    if(type === 'success') notif.style.borderColor = '#2ecc71';
    if(type === 'error') notif.style.borderColor = '#e74c3c';
    
    notif.innerText = text;
    container.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 3500);
}

function toggleTheme() {
    currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    document.body.className = currentTheme + '-theme';
}
