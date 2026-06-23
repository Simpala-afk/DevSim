// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ПОЛНАЯ СИНХРОНИЗАЦИЯ С INDEX)
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
    }
};

// Запуск при загрузке страницы контейнеров
window.onload = function() {
    // Создаем контейнер для уведомлений, если его нет
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    // Загрузка баланса строго в соответствии с типом данных в script.js
    balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    
    // Синхронизация ключа темы с главной страницей ('theme' вместо 'user_theme')
    currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = currentTheme + '-theme';

    updateBalanceDisplay();
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    const el = document.getElementById('balance-val');
    if (el) {
        el.innerText = balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// ==========================================
// ОСНОВНАЯ ЛОГИКА КОНТЕЙНЕРОВ
// ==========================================
function openContainer(type) {
    const container = containersData[type];
    if (!container) {
        alert("Ошибка: Логика контейнера не найдена!");
        return;
    }

    if (balance < container.cost) {
        showNotification("Недостаточно денег для открытия этого контейнера!", "error");
        return;
    }

    // Списание средств
    balance -= container.cost;
    saveBalance();

    const dropContainer = document.getElementById('container-drop-result');
    if (dropContainer) {
        dropContainer.innerHTML = `<div class="spinner-loader">Крутим контейнер...</div>`;
    }

    // Показываем модальное окно (id="content-modal" должно соответствовать разметке в containers.html)
    const modal = document.getElementById('content-modal');
    if (modal) modal.style.display = 'flex';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const item = container.items[randomIndex];

        // Начисление стоимости выпавшего автомобиля на баланс
        balance += item.price;
        saveBalance();

        let diff = item.price - container.cost;
        let resultText = "";
        let resultClass = "";

        if (diff > 0) {
            resultText = `В ПЛЮСЕ НА +${diff.toLocaleString('ru-RU')} ₽`;
            resultClass = "text-success";
            showNotification(`🎉 Вы выбили ${item.name} и ушли в плюс!`, "success");
        } else if (diff === 0) {
            resultText = "ВЫШЛИ В НОЛЬ";
            resultClass = "text-info";
            showNotification(`Вы выбили ${item.name}. Вышли ровно в ноль.`, "info");
        } else {
            resultText = `В МИНУСЕ НА ${Math.abs(diff).toLocaleString('ru-RU')} ₽`;
            resultClass = "text-danger";
            showNotification(`Выпал транспорт ${item.name}. Продано в минус.`, "error");
        }

        if (dropContainer) {
            dropContainer.innerHTML = `
                <div class="win-card" style="text-align: center; padding: 15px;">
                    <img src="${item.img}" alt="${item.name}" class="win-car-img" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(item.name)}'">
                    <div class="win-title" style="font-size: 18px; font-weight: bold; margin-top: 10px;">${item.name}</div>
                    <div class="win-cost" style="margin-top: 5px;">Стоимость автоматической продажи: <span style="color: #2ecc71; font-weight: bold;">${item.price.toLocaleString('ru-RU')} ₽</span></div>
                    <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 8px; font-weight: bold;">Итог: ${resultText}</div>
                </div>
            `;
        }
    }, 2000);
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
                <div style="font-size: 15px; font-weight: 700; color: #2ecc71;">${item.price.toLocaleString('ru-RU')} ₽</div>
            </div>
        `;
    });

    htmlContent += `</div></div>`;
    dropContainer.innerHTML = htmlContent;
    
    const modal = document.getElementById('content-modal');
    if (modal) modal.style.display = 'flex';
}

function closeContainerModal() {
    const modal = document.getElementById('content-modal');
    if (modal) modal.style.display = 'none';
}

function showNotification(text, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notif = document.createElement('div');
    // Соответствие классам стилей из основного проекта (notification-success / notification-error)
    notif.className = `notification notification-${type}`;
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
    localStorage.setItem('theme', currentTheme);
    document.body.className = currentTheme + '-theme';
}
