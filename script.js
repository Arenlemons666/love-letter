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
  pageIndicator.textContent = `${index+1} / ${pages.length}`;
  backBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length-1;
  restartBtn.hidden = index !== pages.length-1;
}

function play(audio){
  if(!audio) return;
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

async function tryAutoplay(){
  try{
    bgMusic.volume = 0.4;
    await bgMusic.play();
  }catch{
    audioGate.hidden = false;
    window.addEventListener("pointerdown", enableMusic, { once:true });
  }
}

function enableMusic(){
  audioGate.hidden = true;
  bgMusic.play().catch(()=>{});
}

envelopeBtn.onclick = () => {
  if(opened) return;
  opened = true;
  envelope.classList.add("is-open");
  play(sfxOpen);
};

pageImg.onclick = () => {
  if(index < pages.length-1){
    index++;
    play(sfxFlip);
    render();
  }
};

nextBtn.onclick = () => {
  index++;
  play(sfxFlip);
  render();
};

backBtn.onclick = () => {
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
  if(e.key==="Enter" && !opened) envelopeBtn.click();
  if(e.key==="ArrowRight") nextBtn.click();
  if(e.key==="ArrowLeft") backBtn.click();
};

render();
tryAutoplay();

