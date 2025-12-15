const envelope = document.getElementById("envelope");
const envelopeBtn = document.getElementById("envelopeBtn");

const pageImg = document.getElementById("pageImg");
const pageIndicator = document.getElementById("pageIndicator");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");

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

function render(){
  pageImg.src = pages[index];
  pageImg.alt = `Letter page ${index + 1}`;
  pageIndicator.textContent = `${index + 1} / ${pages.length}`;

  backBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;
  restartBtn.hidden = index !== pages.length - 1;
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

envelopeBtn.onclick = () => {
  if(opened) return;
  opened = true;
  envelope.classList.add("is-open");
  play(sfxOpen);
};

pageImg.onclick = () => {
  if(index < pages.length - 1){
    index++;
    play(sfxFlip);
    render();
  }else{
    play(sfxClick);
  }
};

nextBtn.onclick = () => {
  if (index >= pages.length - 1) return;
  index++;
  play(sfxFlip);
  render();
};

backBtn.onclick = () => {
  if (index <= 0) return;
  index--;
  play(sfxFlip);
  render();
};

restartBtn.onclick = () => {
  index = 0;
  play(sfxClick);
  render();
};

window.onkeydown = e => {
  if(e.key === "Enter" && !opened) envelopeBtn.click();
  if(e.key === "ArrowRight") nextBtn.click();
  if(e.key === "ArrowLeft") backBtn.click();
};

render();
tryAutoplay();
