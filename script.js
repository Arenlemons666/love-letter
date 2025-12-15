const envelope = document.getElementById("envelope");
const envelopeBtn = document.getElementById("envelopeBtn");

const pageImg = document.getElementById("pageImg");
const pageIndicator = document.getElementById("pageIndicator");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");

const loveOverlay = document.getElementById("loveOverlay");

const bgMusic = document.getElementById("bgMusic");
const audioGate = document.getElementById("audioGate");

const sfxOpen = document.getElementById("sfxOpen");
const sfxFlip = document.getElementById("sfxFlip");
const sfxClick = document.getElementById("sfxClick");

const pages = [
  "assets/page 1.jpg",
  "assets/page 2.jpg",
  "assets/page 3.jpg",
  "assets/page 4.jpg",
  "assets/page 5.jpg"
];

let index = 0;
let opened = false;
let finished = false;

function render(){
  if (!pageImg) return;

  pageImg.src = pages[index];
  pageImg.alt = `Letter page ${index + 1}`;

  // These may be hidden by CSS, but keep safe updates
  if (pageIndicator) pageIndicator.textContent = `${index + 1} / ${pages.length}`;

  if (backBtn) backBtn.disabled = index === 0 || finished;
  if (nextBtn) nextBtn.disabled = index === pages.length - 1 || finished;

  if (restartBtn) restartBtn.hidden = true;
}

function play(audio){
  if(!audio) return;
  try{
    audio.currentTime = 0;
    audio.play().catch(()=>{});
  }catch(_){}
}

async function tryAutoplay(){
  if(!bgMusic) return;
  try{
    bgMusic.volume = 0.4;
    await bgMusic.play();
  }catch{
    if (audioGate) audioGate.hidden = false;
    window.addEventListener("pointerdown", enableMusic, { once:true });
    window.addEventListener("keydown", enableMusicKey, { once:true });
  }
}

function enableMusic(){
  if (audioGate) audioGate.hidden = true;
  if (bgMusic) bgMusic.play().catch(()=>{});
}

function enableMusicKey(e){
  if (e.key === "Enter" || e.key === " ") enableMusic();
}

function openEnvelope(){
  if(opened || finished) return;
  opened = true;
  envelope.classList.add("is-open");
  document.body.classList.add("letter-open");
  play(sfxOpen);
}

function finale(){
  if (finished) return;
  finished = true;

  // Close the envelope
  envelope.classList.remove("is-open");
  document.body.classList.remove("letter-open");
  play(sfxClick);

  // After it closes, show "Te amo"
  setTimeout(() => {
    if (loveOverlay) {
      loveOverlay.classList.add("show");
      loveOverlay.setAttribute("aria-hidden", "false");
    }
  }, 700);

  // Lock navigation (safe if buttons exist)
  if (backBtn) backBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
}

function nextPage(){
  if (!opened || finished) return;

  if(index < pages.length - 1){
    index++;
    play(sfxFlip);
    render();
  }
}

function prevPage(){
  if (!opened || finished) return;

  if(index > 0){
    index--;
    play(sfxFlip);
    render();
  }
}

// Open envelope
if (envelopeBtn) envelopeBtn.onclick = () => openEnvelope();

// Click page to advance; click on page 5 triggers finale
if (pageImg) {
  pageImg.onclick = () => {
    if (!opened || finished) return;

    if (index === pages.length - 1) {
      finale();
      return;
    }
    nextPage();
  };
}

// Optional keyboard support (doesn't change UI)
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !opened) openEnvelope();
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

// Init
render();
tryAutoplay();
