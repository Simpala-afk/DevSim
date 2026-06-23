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
            { name: "Tesla Cybertruck", price: 3000000, img: "images/cars/tesla_cybertruck.png", type: "jackpot" }
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
            { name: "Pagani Zonda Cinque", price: 7000000, img: "images/cars/pagani_zonda.png", type: "jackpot" }
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
