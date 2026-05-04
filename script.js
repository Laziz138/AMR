let queue = [];
let isRunning = false;

function addParcel() {
    const idInput = document.getElementById('parcelIdInput');
    const zoneSelect = document.getElementById('zoneSelect');
    const id = idInput.value.trim();
    const zone = zoneSelect.value;

    if (id === "") {
        alert("Iltimos, ID kiriting!");
        return;
    }

    // QR Kod yaratish
    const canvas = document.getElementById('qrCanvas');
    QRCode.toCanvas(canvas, id, { width: 120, margin: 2 }, function (error) {
        if (error) console.error(error);
        document.getElementById('qr-section').style.display = 'block';
    });

    queue.push({ id, zone });
    updateUI();
    writeLog(`📦 Yangi posilka qo'shildi: #${id} -> ${zone}`);
    idInput.value = "";
    idInput.focus();
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
    if (isRunning || queue.length === 0) return;
    
    isRunning = true;
    const statusEl = document.getElementById('robotStatus');
    const startBtn = document.querySelector('.btn-start');

    startBtn.disabled = true;
    statusEl.innerText = "ISHCHIBOR";
    statusEl.style.color = "#f59e0b";

    while (queue.length > 0) {
        const current = queue.shift();
        updateUI();
        await processStep(current);
    }

    isRunning = false;
    startBtn.disabled = false;
    statusEl.innerText = "KUTISHDA";
    statusEl.style.color = "#6366f1";
    writeLog("✅ Vazifalar yakunlandi.");
}

async function processStep(p) {
    const steps = [
        { m: `🤖 Robot INPUT nuqtasiga keldi.`, t: 1000 },
        { m: `🔍 QR kod skaner qilinmoqda: #${p.id}...`, t: 1500 },
        { m: `📦 Posilka #${p.id} yuklandi.`, t: 1000 },
        { m: `🚚 Zona ${p.zone} ga olib ketilmoqda...`, t: 2500 },
        { m: `🏁 Manzilga yetkazildi: Zona ${p.zone}`, t: 1000 }
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