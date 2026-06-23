// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ПОЛНАЯ СИНХРОНИЗАЦИЯ С INDEX)
// ==========================================
let balance = 200;
let currentTheme = 'dark';

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
    // Исправленный id элемента баланса под containers.html
    const el = document.getElementById('user-balance');
    if (el) {
        el.innerText = balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

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

        balance += item.price;
        saveBalance();

        let diff = item.price - container.cost;
        let resultText = "";
        let resultClass = "";

        if (diff > 0) {
            resultText = `В ПЛЮСЕ НА +${diff.toLocaleString('ru-RU')} ₽`;
            resultClass = "text-success";
            showNotification(`🎉 Вы выбили ${item.name} в плюс!`, "success");
        } else if (diff === 0) {
            resultText = "ВЫШЛИ В НОЛЬ";
            resultClass = "text-info";
            showNotification(`Вы выбили ${item.name}. В ноль.`, "info");
        } else {
            resultText = `В МИНУСЕ НА ${Math.abs(diff).toLocaleString('ru-RU')} ₽`;
            resultClass = "text-danger";
            showNotification(`Выпал транспорт ${item.name}. Продано в минус.`, "error");
        }

        if (dropResultZone) {
            dropResultZone.innerHTML = `
                <div class="win-card" style="text-align: center; padding: 10px;">
                    <img src="${item.img}" alt="${item.name}" class="win-car-img" onerror="this.src='https://placehold.co/500x250/2a2a35/ffffff?text=${encodeURIComponent(item.name)}'">
                    <div class="win-title">${item.name}</div>
                    <div class="win-cost">Авто-продажа: <span style="color: #2ecc71;">${item.price.toLocaleString('ru-RU')} ₽</span></div>
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
        htmlContent += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <div style="font-size: 14px; color: #fff;">${item.name}</div>
                <div style="font-size: 14px; font-weight: 700; color: #2ecc71;">${item.price.toLocaleString('ru-RU')} ₽</div>
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
