// Значения баланса и темы //
let balance = 200;
let currentTheme = 'dark';

// База данных дропа по контейнерам
const containersData = {
    germany: {
        title: "Германия",
        cost: 10000,
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
        title: "Дубай",
        cost: 20000,
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
        title: "Италия",
        cost: 50000,
        items: [
            { name: "Fiat 500", price: 30000, img: "images/cars/fiat_500.png" },
            { name: "Alfa Romeo Giulia", price: 35000, img: "images/cars/alfa_giulia.png" },
            { name: "Maserati Ghibli", price: 40000, img: "images/cars/maserati_ghibli.png" },
            { name: "Ferrari Roma", price: 45000, img: "images/cars/ferrari_roma.png" },
            { name: "Lamborghini Urus", price: 50000, img: "images/cars/lambo_urus.png" },
            { name: "Ferrari F8 Tributo", price: 60000, img: "images/cars/ferrari_f8.png" },
            { name: "Lamborghini Aventador", price: 70000, img: "images/cars/lambo_aventador.png" },
            { name: "Maserati GranTurismo", price: 100000, img: "images/cars/maserati_gt.png" }, // Из пожеланий
            { name: "Bugatti Divo", price: 200000, img: "images/cars/bugatti_divo.png" } // Из пожеланий
        ]
    }
};

// Инициализация при загрузке страницы
window.onload = function() {
    // Контейнер уведомлений
    if (!document.getElementById('notification-container')) {
        let container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    // Синхронизация баланса из localStorage
    balance = parseFloat(localStorage.getItem('user_balance')) || 200;
    updateBalanceUI();

    // Синхронизация темы
    currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);
};

function saveBalance() {
    localStorage.setItem('user_balance', balance.toFixed(2));
}

function updateBalanceUI() {
    document.getElementById('user-balance').innerText = Math.floor(balance).toLocaleString('ru-RU');
}

// Переключение темы
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

// Система кастомных уведомлений (копирует главную страницу)
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

// ОТКРЫТИЕ КОНТЕЙНЕРА
function openContainer(type) {
    const container = containersData[type];
    if (!container) return;

    if (balance < container.cost) {
        showNotification("Недостаточно средств для покупки контейнера!", "danger");
        return;
    }

    // Списываем стоимость контейнера
    balance -= container.cost;
    saveBalance();
    updateBalanceUI();

    const dropContainer = document.getElementById('drop-container');
    dropContainer.innerHTML = `
        <div style="font-size: 50px; animation: spin 1s infinite linear;">📦</div>
        <p style="margin-top: 15px; font-weight: 600;">Контейнер ${container.title} вскрывается автогеном...</p>
    `;

    // Имитация открывания (задержка 1.2 секунды для азарта)
    setTimeout(() => {
        // Рандомный выбор машины из пула контейнера
        const randomIndex = Math.floor(Math.random() * container.items.length);
        const car = container.items[randomIndex];

        // Начисляем стоимость машины на баланс
        balance += car.price;
        saveBalance();
        updateBalanceUI();

        // Считаем ушел в плюс или в минус
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

        // Выводим результат на экран
        dropContainer.innerHTML = `
            <div class="win-card">
                <img src="${car.img}" alt="${car.name}" class="win-car-img" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(car.name)}'">
                <div class="win-title">${car.name}</div>
                <div class="win-cost">Стоимость продажи: <span>${car.price.toLocaleString('ru-RU')} ₽</span></div>
                <div class="win-cost ${resultClass}" style="font-size: 16px; margin-top: 5px; font-weight: bold;">Итог: ${resultText}</div>
            </div>
        `;

        if (diff >= 0) {
            showNotification(`Вы выбили ${car.name} и ушли в плюс!`, "success");
        } else {
            showNotification(`Вы выбили ${car.name}. Окуп не удался.`, "info");
        }

    }, 1200);
}
function showContent(type) {
    const container = containersData[type];
    const modal = document.getElementById('content-modal');
    const list = document.getElementById('modal-list');
    const title = document.getElementById('modal-title');

    title.innerText = `Состав: ${container.title}`;
    list.innerHTML = '';

    container.items.forEach(item => {
        const li = document.createElement('li');
        li.style.padding = "8px 0";
        li.style.borderBottom = "1px solid var(--border-color)";
        li.innerHTML = `<strong>${item.name}</strong> — <span style="color:var(--success)">${item.price.toLocaleString()} ₽</span>`;
        list.appendChild(li);
    });

    modal.style.display = 'flex';
}
