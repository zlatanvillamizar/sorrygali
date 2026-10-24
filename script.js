// ---------- 1. TÍTULO PALABRA POR PALABRA ----------
const titleEl = document.getElementById('title');
const words = ["oa,", "se", "que", "la", "cagué", "¿me", "perdonas?"];

words.forEach((word, i) => {
  const span = document.createElement('span');
  span.textContent = word + " ";
  if (word === "perdonas?") span.classList.add('accent');
  span.style.animationDelay = (0.9 + i * 0.12) + "s";
  titleEl.appendChild(span);
});

// ---------- 2. REFERENCIAS ----------
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const card = document.getElementById('card');
const menuCard = document.getElementById('menuCard');
const bgImage = document.getElementById('bgImage');

// ---------- 3. ESTADO DEL BOTÓN "NO" ----------
let escapeCount = 0;
let currentScale = 1;
const MIN_SCALE = 0.5;
const SCALE_STEP = 0.05;

const noLabels = [
  "No D:", "Daleee perdoname :(", "No seas cruel ;(", "Bueno, duraremos aquí un buen rato",
  "¿En serio? :c", "Piénsalo bien...", "Te prometo que cambio", "No me dejes así",
  "Solo un click, ¿no?", "Porfa, dale al Sí", "Me estás rompiendo el corazón",
  "Ya, en serio, dale al Sí", "No puedo dejar que digas No", "Esto es infinito :b",
  "Ríndete, el Sí es más bonito", "Te lo pido de rodillas", "No te cuesta nada :(",
  "Daleee, solo un Sí", "Sabes que quieres decir que Sí", "Y si mejor me perdonas y ya?",
  "Llevamos aquí 5 minutos...", "Mi orgullo está en juego", "Prometo no volver a hacerlo",
  "Vamos, que sí se puede", "Dale al Sí y te dejo en paz",
];

// ---------- 4. POSICIONAMIENTO SEGURO ----------
function setPosition(x, y) {
  const rect = noBtn.getBoundingClientRect();
  noBtn.style.left = (x - rect.width / 2) + "px";
  noBtn.style.top = (y - rect.height / 2) + "px";
  noBtn.style.transform = `scale(${currentScale})`;
}

function getSafeZone() {
  const cardRect = card.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const yesCenterX = yesRect.left - cardRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top - cardRect.top + yesRect.height / 2;

  const verticalPadding = noRect.height + 20;
  const minY = yesCenterY - verticalPadding;
  const maxY = yesCenterY + verticalPadding;

  const minX = noRect.width / 2 + 16;
  const maxX = cardRect.width - noRect.width / 2 - 16;

  return { minX, maxX, minY, maxY, yesCenterX, yesCenterY, yesRect };
}

function placeNoInitially() {
  const cardRect = card.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const yesCenterX = yesRect.left - cardRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top - cardRect.top + yesRect.height / 2;

  const gap = 14;
  const rightX = yesCenterX + yesRect.width / 2 + gap + noRect.width / 2;
  const cardInnerRight = cardRect.width - 20;

  let targetX, targetY;
  if (rightX + noRect.width / 2 <= cardInnerRight) {
    targetX = rightX;
    targetY = yesCenterY;
  } else {
    targetX = yesCenterX;
    targetY = yesCenterY + yesRect.height / 2 + gap + noRect.height / 2;
  }
  setPosition(targetX, targetY);
}

function generateCandidates() {
  const { minX, maxX, minY, maxY, yesCenterX, yesCenterY, yesRect } = getSafeZone();
  const noRect = noBtn.getBoundingClientRect();
  const minDistFromYes = Math.max(noRect.width, yesRect.width) * 0.85;
  
  const w = noRect.width;
  const h = noRect.height;

  const candidates = [
    { x: yesCenterX - yesRect.width / 2 - w / 2 - 12, y: yesCenterY }, 
    { x: yesCenterX + yesRect.width / 2 + w / 2 + 12, y: yesCenterY }, 
    { x: yesCenterX - yesRect.width / 2 - w / 2 - 12, y: yesCenterY - h }, 
    { x: yesCenterX + yesRect.width / 2 + w / 2 + 12, y: yesCenterY - h }, 
    { x: yesCenterX - yesRect.width / 2 - w / 2 - 12, y: yesCenterY + h }, 
    { x: yesCenterX + yesRect.width / 2 + w / 2 + 12, y: yesCenterY + h }, 
  ];

  return candidates.filter(c => {
    if (c.x < minX || c.x > maxX) return false;
    if (c.y < minY || c.y > maxY) return false;
    if (Math.hypot(c.x - yesCenterX, c.y - yesCenterY) < minDistFromYes) return false;
    return true;
  });
}

function nextSafePosition() {
  const candidates = generateCandidates();
  if (candidates.length === 0) {
    const { minX, maxX, minY, maxY } = getSafeZone();
    return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
  }

  const cardRect = card.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const currentX = noRect.left - cardRect.left + noRect.width / 2;
  const currentY = noRect.top - cardRect.top + noRect.height / 2;

  const sorted = candidates.slice().sort((a, b) => {
    const da = Math.hypot(a.x - currentX, a.y - currentY);
    const db = Math.hypot(b.x - currentX, b.y - currentY);
    return db - da;
  });

  const top = sorted.slice(0, Math.min(3, sorted.length));
  return top[Math.floor(Math.random() * top.length)];
}

function flee() {
  escapeCount++;
  if (currentScale > MIN_SCALE) currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
  const target = nextSafePosition();
  setPosition(target.x, target.y);
  const idx = Math.min(escapeCount, noLabels.length - 1);
  noBtn.textContent = noLabels[idx];
}

window.addEventListener('load', () => setTimeout(placeNoInitially, 50));
window.addEventListener('resize', () => { if (escapeCount === 0) placeNoInitially(); });

// ---------- 5. DETECCIÓN DE DEDO ----------
function checkTouchProximity(clientX, clientY) {
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(clientX - cx, clientY - cy);
  if (dist < Math.max(rect.width, rect.height) / 2 + 60) flee();
}

card.addEventListener('touchmove', (e) => {
  for (let i = 0; i < e.touches.length; i++) checkTouchProximity(e.touches[i].clientX, e.touches[i].clientY);
}, { passive: true });

card.addEventListener('mousemove', (e) => { if (e.buttons === 1) checkTouchProximity(e.clientX, e.clientY); });

function handleDirectContact(e) { e.preventDefault(); e.stopPropagation(); flee(); }
noBtn.addEventListener('touchstart', handleDirectContact, { passive: false });
noBtn.addEventListener('mousedown', handleDirectContact);
noBtn.addEventListener('click', handleDirectContact);

// ---------- 6. FASE 2: EL SÍ Y LOS MODALES ----------
const allModals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');
const songAudio = document.getElementById('songAudio');

yesBtn.addEventListener('click', () => {
  card.style.display = 'none';
  menuCard.style.display = 'block';
  bgImage.classList.add('visible');
  burstConfetti();
});

document.querySelectorAll('.sticker').forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const modal = document.getElementById(targetId);
    if (modal) {
      modal.classList.add('active');
      
      // Si es la carta final, encendemos la canción
      if (targetId === 'modal-long-letter' && songAudio) {
        songAudio.currentTime = 0;
        songAudio.play().catch(e => console.log("El navegador bloqueó el autoplay:", e));
      }
    }
  });
});

// Cerrar modales con la X
closeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    modal.classList.remove('active');
    // Pausar la canción al cerrar el modal de la carta
    if (modal.id === 'modal-long-letter' && songAudio) {
      songAudio.pause();
    }
  });
});

// Cerrar modales tocando el fondo oscuro
allModals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      if (modal.id === 'modal-long-letter' && songAudio) {
        songAudio.pause();
      }
    }
  });
});

// ---------- 7. CONFETI ----------
function burstConfetti() {
  const colors = ['#8b7cff', '#ff7aa8', '#4bd6ff', '#ffffff', '#b8a6ff', '#a8e6cf'];
  const count = window.innerWidth < 500 ? 20 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: fixed; width: ${6 + Math.random() * 8}px; height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      border: 1px solid rgba(0,0,0,0.1);
      left: 50%; top: 50%; pointer-events: none; z-index: 99; opacity: 1;
      transition: transform 1.2s cubic-bezier(0.15, 0.6, 0.4, 1), opacity 1.2s ease;
    `;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist - 60;

    requestAnimationFrame(() => {
      p.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg)`;
      p.style.opacity = '0';
    });

    setTimeout(() => p.remove(), 1400);
  }
}