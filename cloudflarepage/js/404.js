// === 404 CTF FLAG GENERATOR ===
// Generates a random CTF-style flag on each 404 page visit
//
// CLOUDFLARE WORKERS SETUP:
// In your Worker script, add this catch-all before the final fetch:
//
//   const response = await fetch(request);
//   if (response.status === 404) {
//     return new Response(404_HTML, { status: 404, headers: { 'Content-Type': 'text/html' } });
//   }
//   return response;
//
// Or for SPA-style routing, serve index.html and let the 404 page
// be a standalone page: https://applicationsecurity.pentest1214.workers.dev/404.html

// --- MATRIX RAIN BACKGROUND (reused from main.js) ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
const fontSize = 14;
const drops = [];
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    columns = Math.floor(width / fontSize);
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        if (Math.random() > 0.95) ctx.fillStyle = '#00d4ff';
        else if (Math.random() > 0.98) ctx.fillStyle = '#ffffff';
        else ctx.fillStyle = '#ff3e3e';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

resizeCanvas();
setInterval(drawMatrix, 50);
window.addEventListener('resize', resizeCanvas);

// --- SHOW REQUESTED URL ---
const badUrl = document.getElementById('bad-url');
if (badUrl) {
    badUrl.textContent = window.location.href;
}

// --- FLAG GENERATOR ---
function generateFlag() {
    const githubId = 'https://www.linkedin.com/in/aditya-singh-9ab9b81aa';
    const linkedinId = 'https://github.com/adityasingh108';

    // Combine and base64 encode
    const combined = `${githubId}:${linkedinId}`;
    const base64 = btoa(combined);

    // Random hex suffix (6 chars) so flag is "random" each time
    const randomHex = Array.from({length: 6}, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // Build the flag
    return `flag{${base64}_${randomHex}}`;
}

function displayFlag() {
    const flagDisplay = document.getElementById('flag-display');
    if (!flagDisplay) return;

    const flag = generateFlag();
    let i = 0;

    // Typing effect for the flag
    flagDisplay.textContent = '';
    function typeFlag() {
        if (i < flag.length) {
            flagDisplay.textContent += flag.charAt(i);
            i++;
            setTimeout(typeFlag, 40);
        } else {
            // Add glow effect after typing completes
            flagDisplay.style.textShadow = '0 0 15px rgba(0, 255, 65, 0.6)';
        }
    }

    // Delay start to simulate "decoding"
    setTimeout(typeFlag, 2500);
}

displayFlag();

// --- CONSOLE EASTER EGG ---
console.log('%c[404 - ACCESS DENIED]', 'color: #ff3e3e; font-size: 16px; font-weight: bold;');
console.log('%c> Path not found: ' + window.location.pathname, 'color: #8888a0; font-size: 12px;');
console.log('%c> A flag was left behind. Check the page.', 'color: #00ff41; font-size: 11px;');
