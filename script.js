let queue = [];
let isRunning = false;

function addParcel() {
    const zone = document.getElementById('zoneSelect').value;
    const id = Math.floor(1000 + Math.random() * 9000);
    queue.push({ id, zone });
    
    updateUI();
    writeLog(`Yangi posilka qo'shildi: #${id} -> ${zone}`);
}

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

async function startRobot() {
    // 1. Tekshiruv: agar robot band bo'lsa yoki navbat bo'sh bo'lsa, funksiyadan chiqish
    if (isRunning || queue.length === 0) return;
    
    isRunning = true;
    const statusEl = document.getElementById('robotStatus');
    const startBtn = document.querySelector('.btn-start'); // Tugmani ushlab olish

    // 2. Tugmani o'chirish (Visual effect)
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    startBtn.style.cursor = 'not-allowed';
    statusEl.innerText = "ISHCHIBOR";
    statusEl.style.color = "#f59e0b";

    while (queue.length > 0) {
        const current = queue.shift();
        updateUI();
        await processStep(current);
    }

    // 3. Ish tugagach tugmani qayta yoqish
    isRunning = false;
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    startBtn.style.cursor = 'pointer';
    
    statusEl.innerText = "KUTISHDA";
    statusEl.style.color = "#6366f1";
    writeLog("✅ Barcha vazifalar yakunlandi.");
}

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

function writeLog(msg) {
    const win = document.getElementById('logWindow');
    const now = new Date().toLocaleTimeString();
    win.innerHTML += `<div class="log-entry"><span style="color:#64748b">${now}</span> ${msg}</div>`;
    win.scrollTop = win.scrollHeight;
}