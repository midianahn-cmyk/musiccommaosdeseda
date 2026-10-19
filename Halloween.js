<!-- 🎵🎵🎵🎵🎵🎵🎵 Player Blogger INÍCIO -->
<style>
#player {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  max-height: 48px;
  background:
    linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.0)),
    url(&quot;https://img.magnific.com/premium-photo/birthday-background-copy-space_1036998-318769.jpg&quot;) center/cover no-repeat;
  border-top: 2px solid rgba(255,255,255,0.3);
  padding: 5px 10px;
  color: white;
  font-family: &#39;Merienda&#39;, sans-serif;
  z-index: 99999 !important;
  box-shadow: 0 -3px 12px rgba(0,0,0,0.4);
  overflow: hidden;
  justify-content: space-between;
}
#player #trackNameContainer {
  flex: 3;
  min-width: 0;
  overflow: hidden;
}
#player #trackName {
  display: inline-block;
  white-space: nowrap;
  font-weight: bold;
  font-size: 12.8px;
  animation: scrollPingPong 18s linear infinite alternate;
  color: black;
  line-height: 1;
}
#player button {
  background: transparent;
  border: none;
  color: black;
  font-size: 17px;
  padding: 3px 5px;
  cursor: pointer;
  transition: all 0.2s;
}
#player button:hover {
  color: pink;
  transform: scale(1.18);
  font-size: 17px;
}
#player .drag-handle {
  cursor: grab;
  font-size: 17px;
  padding: 3px 6px;
}
#player input[type=&quot;range&quot;] {
  -webkit-appearance: none;
  height: 4px;
  background: linear-gradient(90deg,#61ff4c,#ff6ec4,#ffffff);
  border-radius: 5px;
}
#player input[type=&quot;range&quot;]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #ff69b4;
  border-radius: 50%;
}
#player .credit {
  font-size: 10.5px;
  white-space: nowrap;
  background: linear-gradient(90deg,#61ff4c,#ff6ec4,#000000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
#player .right-area {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding-right: 50px;
}
@keyframes scrollPingPong {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (max-width: 768px) {
  #player {
    height: 42px;
    gap: 4px;
    padding: 5px 6px;
  }
  #player #trackNameContainer {
    min-width: 80px;
  }
  #player .credit {
    display: none;
  }
  #player #volume,
  #player #progress {
    width: 60px;
  }
}
@media (max-width: 768px) {
  #player #trackNameContainer,
  #player .right-area,
  #player .drag-handle,
  #player #closeBtn {
    display: none;
  }
  #player {
    justify-content: center;
    height: 42px;
    padding: 5px;
  }
  #player .controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  #player button {
    font-size: 22px;
    padding: 4px 8px;
  }
}
</style>

<div id='player'>
  <button id='closeBtn'><i class='fa fa-close'/></button>
  <div class='drag-handle' id='dragHandle'><i class='fa fa-arrows-alt'/></div>

  <div><i class='fa fa-music' style='font-size:14px;color:transparent'/></div>

  <div class='controls'>
    <button id='prev'>&#9198;</button>
    <button id='play'>&#9654;</button>
    <button id='pause'>&#9208;</button>
    <button id='next'>&#9197;</button>
    <button id='stop'>&#9209;</button>
  </div>

  <div><i class='fa fa-music' style='font-size:14px;color:transparent'/></div>

  <div id='trackNameContainer'>
    <div id='trackName'>Música Carregando...</div>
  </div>

  <div class='right-area'>
    <a class='credit' href='https://www.commaosdesedaoficial.com/2024/10/AudioPlayInfinito.html' target='_blank'>🎵 Faça seu Play Gratuito agora!</a>
    <div><i class='fa fa-music' style='font-size:14px;color:transparent'/></div>
    <input class='volume' id='volume' max='1' min='0' step='0.01' type='range' value='0.07'/>
    <input id='progress' max='100' min='0' type='range' value='0'/>
  </div>
</div>

<audio id='audio'/>

<script>
/* === PLAYER COMPLETO - 24 HORAS + AUTO PLAY CONTROLADO === */
const player = document.getElementById(&#39;player&#39;);
const audio = document.getElementById(&#39;audio&#39;);
const playBtn = document.getElementById(&#39;play&#39;);
const pauseBtn = document.getElementById(&#39;pause&#39;);
const stopBtn = document.getElementById(&#39;stop&#39;);
const nextBtn = document.getElementById(&#39;next&#39;);
const prevBtn = document.getElementById(&#39;prev&#39;);
const volumeSlider = document.getElementById(&#39;volume&#39;);
const progress = document.getElementById(&#39;progress&#39;);
const dragHandle = document.getElementById(&#39;dragHandle&#39;);
const closeBtn = document.getElementById(&#39;closeBtn&#39;);
const trackName = document.getElementById(&#39;trackName&#39;);

// ===== ESCONDER O PLAYER POR 24 HORAS =====
const hideUntil = parseInt(localStorage.getItem(&#39;playerHideUntil&#39;)) || 0;
if (Date.now() &lt; hideUntil) {
  player.style.display = &#39;none&#39;;
}


const playlist = [
  {
    title: &#39;🎵🎵🎵🎵🎵 Música: Halloween Background Music!&#39;,
    src: &#39;https://cdn.pixabay.com/download/audio/2025/10/25/audio_4c93605c85.mp3&#39;
  },
  {
    title: &#39;🎵🎵🎵🎵🎵 Música: Scary Halloween!&#39;,
    src: &#39;https://cdn.pixabay.com/download/audio/2026/10/07/audio_2acf8121d9.mp3&#39;
  },
  {
    title: &#39;🎵🎵🎵🎵🎵 Música: Haunted Halloween!&#39;,
    src: &#39;https://cdn.pixabay.com/download/audio/2026/10/07/audio_ec04afa464.mp3&#39;
  },
  {
    title: &quot;🎵🎵🎵🎵🎵 Música: Mystical Halloween&#39;s!&quot;,
    src: &#39;https://cdn.pixabay.com/download/audio/2023/05/25/audio_705b820a4d.mp3&#39;
  },
  {
    title: &#39;🎵🎵🎵🎵🎵 Música: Halloween Party!&#39;,
    src: &#39;https://cdn.pixabay.com/download/audio/2026/10/08/audio_a04ff34238.mp3&#39;
  },
  {
    title: &#39;🎵🎵🎵🎵🎵 Música: Happy Halloween!&#39;,
    src: &#39;https://cdn.pixabay.com/download/audio/2026/09/29/audio_17f34a0473.mp3&#39;
  }
];


let cur = parseInt(localStorage.getItem(&#39;playerCur&#39;)) || 0;
let savedTime = parseFloat(localStorage.getItem(&#39;playerTime&#39;)) || 0;
let savedVolume = parseFloat(localStorage.getItem(&#39;playerVol&#39;)) || 0.07;

audio.src = playlist[cur].src;
audio.load();
trackName.textContent = playlist[cur].title;
audio.volume = savedVolume;
audio.currentTime = savedTime;

function updateTrack() {
  audio.src = playlist[cur].src;
  audio.load();
  audio.currentTime = 0;
  audio.play().catch(function() {});
  trackName.textContent = playlist[cur].title;
}

function saveState() {
  localStorage.setItem(&#39;playerCur&#39;, cur);
  localStorage.setItem(&#39;playerTime&#39;, audio.currentTime);
  localStorage.setItem(&#39;playerVol&#39;, audio.volume);
}

playBtn.onclick = function() { audio.play().catch(function() {}); };
pauseBtn.onclick = function() { audio.pause(); };
stopBtn.onclick = function() { audio.pause(); audio.currentTime = 0; saveState(); };
nextBtn.onclick = function() { cur = (cur + 1) % playlist.length; updateTrack(); saveState(); };
prevBtn.onclick = function() { cur = (cur - 1 + playlist.length) % playlist.length; updateTrack(); saveState(); };
volumeSlider.oninput = function() { audio.volume = volumeSlider.value; saveState(); };

audio.addEventListener(&#39;timeupdate&#39;, function() {
  if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  saveState();
});

progress.addEventListener(&#39;input&#39;, function() {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
  saveState();
});

// ===== BOTÃO FECHAR - ESCONDE POR 24 HORAS =====
closeBtn.onclick = function() {
  player.style.display = &#39;none&#39;;
  audio.pause(); // para a música imediatamente
  localStorage.setItem(&#39;playerHideUntil&#39;, Date.now() + 24 * 60 * 60 * 1000);
};

// Drag
let isDrag = false, dx, dy;
const startDrag = function(e) {
  isDrag = true;
  const r = player.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  dx = cx - r.left;
  dy = cy - r.top;
  e.preventDefault();
};
const onDrag = function(e) {
  if (!isDrag) return;
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  let x = cx - dx, y = cy - dy;
  const maxX = window.innerWidth - player.offsetWidth;
  const maxY = window.innerHeight - player.offsetHeight;
  x = Math.min(Math.max(0, x), maxX);
  y = Math.min(Math.max(0, y), maxY);
  player.style.left = x + &#39;px&#39;;
  player.style.top = y + &#39;px&#39;;
  player.style.bottom = &#39;auto&#39;;
};
dragHandle.addEventListener(&#39;mousedown&#39;, startDrag);
dragHandle.addEventListener(&#39;touchstart&#39;, startDrag);
document.addEventListener(&#39;mouseup&#39;, function() { isDrag = false; });
document.addEventListener(&#39;touchend&#39;, function() { isDrag = false; });
document.addEventListener(&#39;mousemove&#39;, onDrag);
document.addEventListener(&#39;touchmove&#39;, onDrag);

audio.addEventListener(&#39;ended&#39;, function() {
  cur = (cur + 1) % playlist.length;
  updateTrack();
  saveState();
});

// ===== AUTO PLAY APÓS PRIMEIRA INTERAÇÃO =====
function iniciarAudio() {
  // Se estiver dentro das 24 horas de fechado, não toca
  const hideUntil = parseInt(localStorage.getItem(&#39;playerHideUntil&#39;)) || 0;
  if (Date.now() &lt; hideUntil) return;

  audio.load();
  const promessa = audio.play();
  if (promessa !== undefined) {
    promessa
      .then(function() {
        console.log(&#39;Áudio iniciado&#39;);
      })
      .catch(function(err) {
        console.log(&#39;Autoplay bloqueado:&#39;, err);
      });
  }
}
document.addEventListener(&#39;pointerdown&#39;, iniciarAudio, {once: true});
document.addEventListener(&#39;click&#39;, iniciarAudio, {once: true});
document.addEventListener(&#39;touchstart&#39;, iniciarAudio, {once: true});
document.addEventListener(&#39;keydown&#39;, iniciarAudio, {once: true});
</script>
<!-- 🎵🎵🎵🎵🎵🎵🎵 Player Blogger FINAL -->
