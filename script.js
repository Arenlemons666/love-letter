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

const bgMusic = document.getElementById("bgMusic");

// Your current filenames (with spaces), placed directly inside /assets/
const pages = [
  { src: "assets/page 1.jpg", alt: "Letter page 1" },
  { src: "assets/page 2.jpg", alt: "Letter page 2" },
  { src: "assets/page 3.jpg", alt: "Letter page 3" },
  { src: "assets/page 4.jpg", alt: "Letter page 4" },
  { src: "assets/page 5.jpg", alt: "Letter page 5" },
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

function fadeInMusic(audio, targetVolume = 0.4, durationMs = 2500) {
  if (!audio) return;

  try {
    audio.volume = 0;
  } catch (_) {}

  audio.play().catch(() => {});

  const steps = 40;
  const stepTime = Math.max(10, Math.floor(durationMs / steps));
  const volStep = targetVolume / steps;

  let currentStep = 0;
  const timer = setInterval(() => {
    currentStep += 1;
    try {
      audio.volume = Math.min(targetVolume, audio.volume + volStep);
    } catch (_) {}

    if (currentStep >= steps) clearInterval(timer);
  }, stepTime);
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

  // Start background music only after user interaction
  fadeInMusic(bgMusic, 0.4, 2500);

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

envelopeBtn.addEventListener("click", () => {
  if (!isOpen) openEnvelope();
  else safePlay(sfxClick);
});

pageImg.addEventListener("click", () => {
  if (!isOpen) return;
  if (index < pages.length - 1) nextPage();
  else safePlay(sfxClick);
});

nextBtn.addEventListener("click", nextPage);
backBtn.addEventListener("click", backPage);
restartBtn.addEventListener("click", restart);

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
