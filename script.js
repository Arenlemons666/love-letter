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
  pageImg.src = pages[index];
  pageImg.alt = `Letter page ${index + 1}`;
  pageIndicator.textContent = `${index + 1} / ${pages.length}`;

  backBtn.disabled = index === 0 || finished;
  nextBtn.disabled = index === pages.length - 1 || finished;
  restartBtn.hidden = true; // you asked not to change anything else: keep it hidden always now
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
  bgMusic.play().catch(()=>{});
}

function enableMusicKey(e){
  if (e.key === "Enter" || e.key === " ") enableMusic();
}

function openEnvelope(){
  if(opened || finished) return;
  opened = true;
  envelope.classList.add("is-open");
  document.body.classList.add("letter-open"); // ✅ NEW
  play(sfxOpen);
}

function finale(){
  if (finished) return;
  finished = true;

  // Close the envelope
  envelope.classList.remove("is-open");
  play(sfxClick);

  // After it closes, show "Te amo"
  setTimeout(() => {
    if (loveOverlay) {
      loveOverlay.classList.add("show");
      loveOverlay.setAttribute("aria-hidden", "false");
    }
  }, 700);

  // Lock navigation
  backBtn.disabled = true;
  nextBtn.disabled = true;
}

function nextPage(){
  if (!opened || finished) return;

  if(index < pages.length - 1){
    index++;
    play(sfxFlip);
    render();

    // If we just arrived at the last page, auto-finale after a short moment
    if (index === pages.length - 1) {
      setTimeout(finale, 900);
    }
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

envelopeBtn.onclick = () => openEnvelope();

pageImg.onclick = () => {
  // click image turns page; if already last, do nothing
  if (index < pages.length - 1) nextPage();
};

nextBtn.onclick = () => nextPage();
backBtn.onclick = () => prevPage();

window.onkeydown = (e) => {
  if(e.key === "Enter" && !opened) openEnvelope();
  if(e.key === "ArrowRight") nextPage();
  if(e.key === "ArrowLeft") prevPage();
};

// Init
render();
tryAutoplay();

