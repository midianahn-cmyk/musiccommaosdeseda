
/* =====================================================
   PLAYER DE MÚSICA PARA BLOGGER
   Criadora: Com Mãos de Seda
   © 2026 Com Mãos de Seda
   ===================================================== */

(function () {
  'use strict';

  // Evita criar o player duas vezes
  if (document.getElementById('player')) return;

  function iniciarPlayer() {
    if (!document.body || document.getElementById('player')) return;

    const playlist = [
      {
        title: '🎵🎵🎵🎵🎵 Música: Halloween Background Music!',
        src: 'https://cdn.pixabay.com/download/audio/2025/10/25/audio_4c93605c85.mp3'
      },
      {
        title: '🎵🎵🎵🎵🎵 Música: Scary Halloween!',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/07/audio_2acf8121d9.mp3'
      },
      {
        title: '🎵🎵🎵🎵🎵 Música: Haunted Halloween!',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/07/audio_ec04afa464.mp3'
      },
      {
        title: "🎵🎵🎵🎵🎵 Música: Mystical Halloween's!",
        src: 'https://cdn.pixabay.com/download/audio/2023/05/25/audio_705b820a4d.mp3'
      },
      {
        title: '🎵🎵🎵🎵🎵 Música: Halloween Party!',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/08/audio_a04ff34238.mp3'
      },
      {
        title: '🎵🎵🎵🎵🎵 Música: Happy Halloween!',
        src: 'https://cdn.pixabay.com/download/audio/2026/09/29/audio_17f34a0473.mp3'
      }
    ];

    // Armazenamento seguro
    function ler(chave, padrao) {
      try {
        const valor = localStorage.getItem(chave);
        return valor === null ? padrao : valor;
      } catch (e) {
        return padrao;
      }
    }

    function gravar(chave, valor) {
      try {
        localStorage.setItem(chave, valor);
      } catch (e) {}
    }

    const numeroSalvo = parseInt(ler('playerCur', '0'), 10);
    let cur = Number.isFinite(numeroSalvo)
      ? Math.max(0, Math.min(numeroSalvo, playlist.length - 1))
      : 0;

    let savedTime = Math.max(0, parseFloat(ler('playerTime', '0')) || 0);
    let savedVolume = parseFloat(ler('playerVol', '0.07'));

    if (!Number.isFinite(savedVolume)) savedVolume = 0.07;
    savedVolume = Math.max(0, Math.min(1, savedVolume));

    // CSS criado pelo próprio JavaScript
    const style = document.createElement('style');
    style.textContent = `
      #player {
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 6px;
        height: 48px;
        background:
          linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)),
          url("https://img.magnific.com/premium-photo/birthday-background-copy-space_1036998-318769.jpg")
          center/cover no-repeat;
        border-top: 2px solid rgba(255,255,255,.3);
        padding: 5px 10px;
        color: white;
        font-family: Merienda, sans-serif;
        z-index: 2147483000;
        box-shadow: 0 -3px 12px rgba(0,0,0,.4);
        overflow: hidden;
        justify-content: space-between;
      }

      #player * { box-sizing: border-box; }

      #player button {
        background: transparent;
        border: none;
        color: black;
        font-size: 17px;
        line-height: 1;
        padding: 5px;
        cursor: pointer;
        flex-shrink: 0;
      }

      #player button:hover {
        color: #ff69b4;
      }

      #player button:focus-visible {
        outline: 2px solid #ff69b4;
        outline-offset: 2px;
      }

      #player .drag-handle {
        cursor: grab;
        font-size: 17px;
        padding: 5px;
        flex-shrink: 0;
        user-select: none;
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
        line-height: 1;
        color: black;
        animation: scrollPingPong 18s linear infinite alternate;
      }

      #player .controls {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }

      #player .right-area {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        padding-right: 50px;
        flex-shrink: 0;
      }

      #player .credit {
        font-size: 10.5px;
        white-space: nowrap;
        background: linear-gradient(90deg,#61ff4c,#ff6ec4,#000);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-decoration: none;
      }

      #player input[type="range"] {
        width: 75px;
        min-width: 35px;
        height: 4px;
        padding: 0;
        cursor: pointer;
        accent-color: #ff69b4;
      }

      #player #audio {
        display: none;
      }

      @keyframes scrollPingPong {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      @media (max-width: 768px) {
        #player {
          height: 48px;
          gap: 4px;
          padding: 5px;
          justify-content: center;
        }

        #player #trackNameContainer,
        #player .right-area,
        #player .drag-handle,
        #player #closeBtn {
          display: none;
        }

        #player .controls {
          gap: 10px;
        }

        #player button {
          font-size: 22px;
          padding: 5px 8px;
        }
      }
    `;

    document.head.appendChild(style);

    // O HTML do player é criado automaticamente
    const player = document.createElement('div');
    player.id = 'player';

    player.innerHTML = `
      <button id="closeBtn" type="button"
        aria-label="Fechar player" title="Fechar por 24 horas">×</button>

      <div class="drag-handle" id="dragHandle"
        title="Arraste para mover" aria-label="Mover player">⠿</div>

      <span aria-hidden="true" style="color:transparent">♫</span>

      <div class="controls">
        <button id="prev" type="button" aria-label="Música anterior">⏮</button>
        <button id="play" type="button" aria-label="Reproduzir">▶</button>
        <button id="pause" type="button" aria-label="Pausar">⏸</button>
        <button id="next" type="button" aria-label="Próxima música">⏭</button>
        <button id="stop" type="button" aria-label="Parar">⏹</button>
      </div>

      <span aria-hidden="true" style="color:transparent">♫</span>

      <div id="trackNameContainer">
        <div id="trackName">Música carregando...</div>
      </div>

      <div class="right-area">
        <a class="credit"
          href="https://www.commaosdesedaoficial.com/2024/10/AudioPlayInfinito.html"
          target="_blank" rel="noopener noreferrer">
          🎵 Faça seu Play Gratuito agora!
        </a>
        <input id="volume" type="range" min="0" max="1"
          step="0.01" value="0.07" aria-label="Volume">
        <input id="progress" type="range" min="0" max="100"
          step="0.1" value="0" aria-label="Progresso da música">
      </div>
    `;

    document.body.appendChild(player);

    const audio = document.createElement('audio');
    audio.id = 'audio';
    audio.preload = 'metadata';
    player.appendChild(audio);

    const $ = id => player.querySelector('#' + id);

    const playBtn = $('play');
    const pauseBtn = $('pause');
    const stopBtn = $('stop');
    const nextBtn = $('next');
    const prevBtn = $('prev');
    const volumeSlider = $('volume');
    const progress = $('progress');
    const dragHandle = $('dragHandle');
    const closeBtn = $('closeBtn');
    const trackName = $('trackName');

    audio.volume = savedVolume;
    volumeSlider.value = String(savedVolume);

    function ocultoPor24Horas() {
      const hideUntil = parseInt(ler('playerHideUntil', '0'), 10) || 0;
      return Date.now() < hideUntil;
    }

    if (ocultoPor24Horas()) {
      player.style.display = 'none';
    }

    function salvarEstado() {
      gravar('playerCur', String(cur));
      gravar('playerTime', String(audio.currentTime || 0));
      gravar('playerVol', String(audio.volume));
    }

    function carregarMusica(tocar, zerarTempo) {
      audio.src = playlist[cur].src;
      trackName.textContent = playlist[cur].title;
      progress.value = 0;
      audio.load();

      if (!zerarTempo && savedTime > 0) {
        const tempo = savedTime;
        savedTime = 0;

        audio.addEventListener('loadedmetadata', function restaurar() {
          audio.removeEventListener('loadedmetadata', restaurar);

          if (Number.isFinite(audio.duration)) {
            audio.currentTime = Math.min(tempo, audio.duration);
          }

          if (tocar) {
            audio.play().catch(function () {});
          }
        });
      } else if (tocar) {
        audio.play().catch(function () {});
      }
    }

    playBtn.addEventListener('click', function () {
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(function () {});
    });

    pauseBtn.addEventListener('click', function () {
      audio.pause();
      salvarEstado();
    });

    stopBtn.addEventListener('click', function () {
      audio.pause();
      audio.currentTime = 0;
      progress.value = 0;
      salvarEstado();
    });

    nextBtn.addEventListener('click', function () {
      cur = (cur + 1) % playlist.length;
      savedTime = 0;
      carregarMusica(true, true);
      salvarEstado();
    });

    prevBtn.addEventListener('click', function () {
      cur = (cur - 1 + playlist.length) % playlist.length;
      savedTime = 0;
      carregarMusica(true, true);
      salvarEstado();
    });

    volumeSlider.addEventListener('input', function () {
      audio.volume = Number(volumeSlider.value);
      salvarEstado();
    });

    audio.addEventListener('timeupdate', function () {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String(
          (audio.currentTime / audio.duration) * 100
        );
      }
      salvarEstado();
    });

    progress.addEventListener('input', function () {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
          (Number(progress.value) / 100) * audio.duration;
      }
    });

    closeBtn.addEventListener('click', function () {
      audio.pause();
      player.style.display = 'none';
      gravar('playerHideUntil', String(Date.now() + 86400000));
    });

    // Arrastar o player com o mouse ou toque
    let arrastando = false;
    let dx = 0;
    let dy = 0;

    dragHandle.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;

      arrastando = true;
      const r = player.getBoundingClientRect();
      dx = e.clientX - r.left;
      dy = e.clientY - r.top;

      player.style.left = r.left + 'px';
      player.style.top = r.top + 'px';
      player.style.right = 'auto';
      player.style.bottom = 'auto';

      try {
        dragHandle.setPointerCapture(e.pointerId);
      } catch (err) {}

      e.preventDefault();
    });

    dragHandle.addEventListener('pointermove', function (e) {
      if (!arrastando) return;

      const maxX = window.innerWidth - player.offsetWidth;
      const maxY = window.innerHeight - player.offsetHeight;

      const x = Math.max(0, Math.min(e.clientX - dx, maxX));
      const y = Math.max(0, Math.min(e.clientY - dy, maxY));

      player.style.left = x + 'px';
      player.style.top = y + 'px';
    });

    function pararArraste() {
      arrastando = false;
    }

    dragHandle.addEventListener('pointerup', pararArraste);
    dragHandle.addEventListener('pointercancel', pararArraste);

    audio.addEventListener('ended', function () {
      cur = (cur + 1) % playlist.length;
      savedTime = 0;
      carregarMusica(true, true);
      salvarEstado();
    });

    // O navegador pode bloquear reprodução automática.
    // A reprodução é tentada após a primeira interação.
    let primeiraInteracao = false;

    function iniciarAudio() {
      if (primeiraInteracao) return;
      primeiraInteracao = true;

      if (ocultoPor24Horas()) return;

      audio.play().catch(function () {
        // O usuário ainda pode apertar o botão Play.
      });
    }

    document.addEventListener('pointerdown', iniciarAudio, {
      once: true,
      passive: true
    });

    document.addEventListener('keydown', iniciarAudio, {
      once: true
    });

    carregarMusica(false, false);
  }

  if (document.body) {
    iniciarPlayer();
  } else {
    document.addEventListener('DOMContentLoaded', iniciarPlayer, {
      once: true
    });
  }
})();
