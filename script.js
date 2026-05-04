let queue = [];
let isRunning = false;

// Posilka qo'shish funksiyasi
function addParcel() {
    const idInput = document.getElementById('parcelIdInput');
    const zoneSelect = document.getElementById('zoneSelect');
    
    const id = idInput.value.trim();
    const zone = zoneSelect.value;

    if (id === "") {
        alert("Iltimos, posilka ID raqamini kiriting!");
        return;
    }

    queue.push({ id, zone });
    
    updateUI();
    writeLog(`Yangi posilka qo'shildi: #${id} -> ${zone}`);

    // Inputni tozalash
    idInput.value = "";
    idInput.focus();
}

// Navbatni yangilash
function updateUI() {
    const list = document.getElementById('queueList');
    list.innerHTML = queue.map(p => `
        <div class="queue-item">
            <span>📦 #${p.id}</span>
            <span style="color:#a855f7">Zona ${p.zone}</span>
        </div>
    `).join('');
    document.getElementById('queueCount').innerText = queue.length;
}

// Robotni ishga tushirish
async function startRobot() {
    if (isRunning || queue.length === 0) return;
    
    isRunning = true;
    const statusEl = document.getElementById('robotStatus');
    const startBtn = document.querySelector('.btn-start');

    // Tugmani bloklash
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    statusEl.innerText = "ISHCHIBOR";
    statusEl.style.color = "#f59e0b";

    while (queue.length > 0) {
        const current = queue.shift();
        updateUI();
        await processStep(current);
    }

    // Robot ishini tugatdi
    isRunning = false;
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    statusEl.innerText = "KUTISHDA";
    statusEl.style.color = "#6366f1";
    writeLog("✅ Barcha vazifalar yakunlandi.");
}

// Robotning harakat qadamlari
async function processStep(p) {
    const steps = [
        { m: `🤖 Robot #${p.id} posilka uchun INPUTga boryapti...`, t: 1500 },
        { m: `📦 #${p.id} posilkasi olindi.`, t: 1000 },
        { m: `🚚 Zona ${p.zone} ga harakatlanmoqda...`, t: 2500 },
        { m: `🏁 Posilka #${p.id} manzilga yetkazildi.`, t: 1000 }
    ];

    for (const step of steps) {
        writeLog(step.m);
        await new Promise(r => setTimeout(r, step.t));
    }
}

// Log yozish funksiyasi
function writeLog(msg) {
    const win = document.getElementById('logWindow');
    const now = new Date().toLocaleTimeString();
    win.innerHTML += `<div class="log-entry"><span style="color:#64748b">${now}</span> ${msg}</div>`;
    win.scrollTop = win.scrollHeight;
}