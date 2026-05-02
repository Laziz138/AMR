let queue = [];
let isRunning = false;

// 2-bosqich: Posilka qo'shish
function addParcel() {
    const zone = document.getElementById('zoneSelect').value;
    const id = Math.floor(1000 + Math.random() * 9000);
    queue.push({ id, zone });
    
    updateUI();
    writeLog(`Yangi posilka qo'shildi: #${id} -> ${zone}`);
}

// 3-bosqich: Navbatni vizuallashtirish
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

// 4-bosqich: Robotni ishga tushirish
async function startRobot() {
    if (isRunning || queue.length === 0) return;
    
    isRunning = true;
    const statusEl = document.getElementById('robotStatus');
    statusEl.innerText = "ISHCHIBOR";
    statusEl.style.color = "#f59e0b";

    // 6-bosqich: Uzluksiz sikl
    while (queue.length > 0) {
        const current = queue.shift();
        updateUI();
        await processStep(current);
    }

    isRunning = false;
    statusEl.innerText = "KUTISHDA";
    statusEl.style.color = "#6366f1";
    writeLog("✅ Barcha vazifalar yakunlandi.");
}
// startRobot funksiyasi ichiga qo'shing:
const startBtn = document.querySelector('.btn-start');
startBtn.disabled = true; // Ish boshlanganda tugmani o'chirish
startBtn.style.opacity = '0.5';

// while sikli tugagandan keyin:
startBtn.disabled = false; // Ish tugagach yoqish
startBtn.style.opacity = '1';

// 5-bosqich: Robotning asosiy harakat logikasi
async function processStep(p) {
    const steps = [
        { m: "Robot INPUT nuqtasiga kelyapti...", t: 1500 },
        { m: `📦 #${p.id} posilkasi yuklandi.`, t: 1000 },
        { m: `🚚 Zona ${p.zone} ga harakatlanmoqda...`, t: 2500 },
        { m: `🏁 Posilka #${p.id} yetkazildi.`, t: 1000 }
    ];

    for (const step of steps) {
        writeLog(step.m);
        await new Promise(r => setTimeout(r, step.t));
    }
}

// 7-bosqich: Jarayonni kuzatish (Loglar)
function writeLog(msg) {
    const win = document.getElementById('logWindow');
    const now = new Date().toLocaleTimeString();
    win.innerHTML += `<div class="log-entry"><span style="color:#64748b">${now}</span> ${msg}</div>`;
    win.scrollTop = win.scrollHeight;
}