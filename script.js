const envelopeBtn = document.getElementById("envelopeBtn");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");

const pageImg = document.getElementById("pageImg");
const pageIndicator = document.getElementById("pageIndicator");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const sfxOpen = document.getElementById("sfxOpen");
const sfxFlip = document.getElementById("sfxFlip");
const sfxClick = document.getElementById("sfxClick");

// Tus archivos con espacio: "page 1.jpg", etc.
const pages = [
  { src: "assets/page 1.jpg", alt: "Carta - Página 1" },
  { src: "assets/page 2.jpg", alt: "Carta - Página 2" },
  { src: "assets/page 3.jpg", alt: "Carta - Página 3" },
  { src: "assets/page 4.jpg", alt: "Carta - Página 4" },
  { src: "assets/page 5.jpg", alt: "Carta - Página 5" },
];


let isOpen = false;
let index = 0;

function safePlay(audioEl) {
  if (!audioEl) return;
  try {
    audioEl.currentTime = 0;
    audioEl.play();
  } catch (_) {}
}

function preloadImages() {
  pages.forEach(p => {
    const img = new Image();
    img.src = p.src;
  });
}

function renderPage() {
  const p = pages[index];
  pageImg.src = p.src;
  pageImg.alt = p.alt;

  pageIndicator.textContent = `${index + 1} / ${pages.length}`;

  backBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;

  const atEnd = index === pages.length - 1;
  restartBtn.hidden = !atEnd;
}

function openEnvelope() {
  if (isOpen) return;
  isOpen = true;

  envelope.classList.add("is-open");
  letter.setAttribute("aria-hidden", "false");

  safePlay(sfxOpen);

  index = 0;
  renderPage();
}

function nextPage() {
  if (!isOpen) return;
  if (index >= pages.length - 1) return;
  index += 1;
  safePlay(sfxFlip);
  renderPage();
}

function backPage() {
  if (!isOpen) return;
  if (index <= 0) return;
  index -= 1;
  safePlay(sfxFlip);
  renderPage();
}

function restart() {
  if (!isOpen) return;
  index = 0;
  safePlay(sfxClick);
  renderPage();
}

// Click sobre (abre)
envelopeBtn.addEventListener("click", () => {
  if (!isOpen) {
    openEnvelope();
  } else {
    safePlay(sfxClick);
  }
});

// Click en la carta (avanza)
pageImg.addEventListener("click", () => {
  if (!isOpen) return;
  if (index < pages.length - 1) nextPage();
  else safePlay(sfxClick);
});

nextBtn.addEventListener("click", nextPage);
backBtn.addEventListener("click", backPage);
restartBtn.addEventListener("click", restart);

// Teclado
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (!isOpen) openEnvelope();
  }
  if (!isOpen) return;

  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") backPage();
});

preloadImages();
renderPage();
