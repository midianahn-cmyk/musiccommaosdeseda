
/* =====================================================
   PLAYER DE MÚSICA PARA BLOGGER
   Criadora: Com Mãos de Seda
   Site: https://www.commaosdesedaoficial.com
   © 2026 Com Mãos de Seda
   Arquivo: player.js
   ===================================================== */

(function () {
  'use strict';

  function iniciarPlayer() {
    const player = document.getElementById('player');
    const audio = document.getElementById('audio');

    if (!player || !audio) return;

    // Evita inicializar o mesmo player duas vezes.
    if (player.dataset.playerIniciado === 'true') return;
    player.dataset.playerIniciado = 'true';

    const botaoPlay = document.getElementById('play');
    const botaoPause = document.getElementById('pause');
    const botaoStop = document.getElementById('stop');
    const botaoNext = document.getElementById('next');
    const botaoPrev = document.getElementById('prev');
    const botaoFechar = document.getElementById('closeBtn');
    const alcaArrastar = document.getElementById('dragHandle');
    const nomeMusica = document.getElementById('trackName');
    const controleVolume = document.getElementById('volume');
    const progresso = document.getElementById('progress');

    const playlist = [
      {
        title: '🎵 Música 1',
        src: 'https://cdn.pixabay.com/download/audio/2025/10/25/audio_4c93605c85.mp3'
      },
      {
        title: '🎵 Música 2',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/07/audio_2acf8121d9.mp3'
      },
      {
        title: '🎵 Música 3',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/07/audio_ec04afa464.mp3'
      },
      {
        title: '🎵 Música 4',
        src: 'https://cdn.pixabay.com/download/audio/2023/05/25/audio_705b820a4d.mp3'
      },
      {
        title: '🎵 Música 5',
        src: 'https://cdn.pixabay.com/download/audio/2026/10/08/audio_a04ff34238.mp3'
      },
      {
        title: '🎵 Música 6',
        src: 'https://cdn.pixabay.com/download/audio/2026/09/29/audio_17f34a0473.mp3'
      }
    ];

    const CHAVE_OCULTAR = 'playerHideUntil';
    const CHAVE_MUSICA = 'playerCur';
    const CHAVE_TEMPO = 'playerTime';
    const CHAVE_VOLUME = 'playerVol';

    let musicaAtual = 0;
    let arrastando = false;

    function salvar(chave, valor) {
      try {
        localStorage.setItem(chave, String(valor));
      } catch (erro) {
        // O player continua funcionando se o armazenamento estiver bloqueado.
      }
    }

    function ler(chave, padrao) {
      try {
        const valor = localStorage.getItem(chave);
        return valor === null ? padrao : valor;
      } catch (erro) {
        return padrao;
      }
    }

    function ocultarPlayer() {
      player.style.display = 'none';
      audio.pause();

      salvar(CHAVE_OCULTAR, Date.now() + 24 * 60 * 60 * 1000);
    }

    // Respeita o fechamento por 24 horas.
    const ocultarAte = Number(ler(CHAVE_OCULTAR, '0'));

    if (ocultarAte > Date.now()) {
      player.style.display = 'none';
      audio.pause();
      return;
    } else if (ocultarAte) {
      salvar(CHAVE_OCULTAR, '0');
    }

    function atualizarNome() {
      if (nomeMusica) {
        nomeMusica.textContent = playlist[musicaAtual].title;
      }
    }

    function carregarMusica(indice, iniciarReproducao) {
      musicaAtual = (indice + playlist.length) % playlist.length;

      audio.pause();
      audio.src = playlist[musicaAtual].src;
      audio.load();

      salvar(CHAVE_MUSICA, musicaAtual);
      salvar(CHAVE_TEMPO, 0);

      if (progresso) progresso.value = 0;

      atualizarNome();

      if (iniciarReproducao) {
        const promessa = audio.play();

        if (promessa && promessa.catch) {
          promessa.catch(function () {
            // Alguns navegadores exigem um clique do visitante para tocar.
          });
        }
      }
    }

    function reproduzir() {
      if (!audio.src) {
        carregarMusica(musicaAtual, false);
      }

      const promessa = audio.play();

      if (promessa && promessa.catch) {
        promessa.catch(function () {
          // A reprodução pode exigir interação do visitante.
        });
      }
    }

    function pausar() {
      audio.pause();
      salvar(CHAVE_TEMPO, audio.currentTime || 0);
    }

    function parar() {
      audio.pause();

      try {
        audio.currentTime = 0;
      } catch (erro) {
        // O áudio pode ainda não estar pronto.
      }

      if (progresso) progresso.value = 0;
      salvar(CHAVE_TEMPO, 0);
    }

    function proximaMusica() {
      carregarMusica(musicaAtual + 1, true);
    }

    function musicaAnterior() {
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      carregarMusica(musicaAtual - 1, true);
    }

    if (botaoPlay) {
      botaoPlay.addEventListener('click', reproduzir);
    }

    if (botaoPause) {
      botaoPause.addEventListener('click', pausar);
    }

    if (botaoStop) {
      botaoStop.addEventListener('click', parar);
    }

    if (botaoNext) {
      botaoNext.addEventListener('click', proximaMusica);
    }

    if (botaoPrev) {
      botaoPrev.addEventListener('click', musicaAnterior);
    }

    if (botaoFechar) {
      botaoFechar.addEventListener('click', ocultarPlayer);
    }

    // Volume: padrão baixo, com restauração da preferência.
    const volumeSalvo = Number(ler(CHAVE_VOLUME, '0.07'));
    audio.volume = Number.isFinite(volumeSalvo)
      ? Math.min(1, Math.max(0, volumeSalvo))
      : 0.07;

    if (controleVolume) {
      controleVolume.value = audio.volume;

      controleVolume.addEventListener('input', function () {
        audio.volume = Number(controleVolume.value);
        salvar(CHAVE_VOLUME, audio.volume);
      });
    }

    // Atualiza a barra de progresso.
    audio.addEventListener('timeupdate', function () {
      if (!progresso || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }

      if (!arrastando) {
        progresso.value = (audio.currentTime / audio.duration) * 100;
      }

      salvar(CHAVE_TEMPO, audio.currentTime || 0);
    });

    if (progresso) {
      progresso.addEventListener('input', function () {
        arrastando = true;
      });

      progresso.addEventListener('change', function () {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          audio.currentTime =
            (Number(progresso.value) / 100) * audio.duration;
        }

        arrastando = false;
      });
    }

    // Passa automaticamente para a próxima música.
    audio.addEventListener('ended', proximaMusica);

    // Restaura a música e o ponto em que parou.
    const indiceSalvo = Number(ler(CHAVE_MUSICA, '0'));

    if (
      Number.isInteger(indiceSalvo) &&
      indiceSalvo >= 0 &&
      indiceSalvo < playlist.length
    ) {
      musicaAtual = indiceSalvo;
    }

    atualizarNome();
    audio.src = playlist[musicaAtual].src;
    audio.load();

    audio.addEventListener('loadedmetadata', function restaurarTempo() {
      const tempoSalvo = Number(ler(CHAVE_TEMPO, '0'));

      if (
        Number.isFinite(tempoSalvo) &&
        tempoSalvo > 0 &&
        Number.isFinite(audio.duration) &&
        tempoSalvo < audio.duration
      ) {
        audio.currentTime = tempoSalvo;
      }
    }, { once: true });

    // Permite arrastar o player com o mouse ou toque.
    if (alcaArrastar) {
      let inicioX = 0;
      let inicioY = 0;
      let posicaoX = 0;
      let posicaoY = 0;

      alcaArrastar.addEventListener('pointerdown', function (evento) {
        if (evento.button !== undefined && evento.button !== 0) return;

        arrastando = false;
        inicioX = evento.clientX;
        inicioY = evento.clientY;

        const retangulo = player.getBoundingClientRect();
        posicaoX = retangulo.left;
        posicaoY = retangulo.top;

        alcaArrastar.setPointerCapture?.(evento.pointerId);
      });

      alcaArrastar.addEventListener('pointermove', function (evento) {
        if (!alcaArrastar.hasPointerCapture?.(evento.pointerId)) return;

        const deslocamentoX = evento.clientX - inicioX;
        const deslocamentoY = evento.clientY - inicioY;

        if (Math.abs(deslocamentoX) > 2 || Math.abs(deslocamentoY) > 2) {
          arrastando = true;
        }

        if (arrastando) {
          const limiteX = Math.max(0, window.innerWidth - player.offsetWidth);
          const limiteY = Math.max(0, window.innerHeight - player.offsetHeight);

          const novaEsquerda = Math.min(
            limiteX,
            Math.max(0, posicaoX + deslocamentoX)
          );

          const novoTopo = Math.min(
            limiteY,
            Math.max(0, posicaoY + deslocamentoY)
          );

          player.style.left = novaEsquerda + 'px';
          player.style.top = novoTopo + 'px';
          player.style.right = 'auto';
          player.style.bottom = 'auto';
        }
      });

      function finalizarArraste() {
        arrastando = false;
      }

      alcaArrastar.addEventListener('pointerup', finalizarArraste);
      alcaArrastar.addEventListener('pointercancel', finalizarArraste);
      alcaArrastar.addEventListener('lostpointercapture', finalizarArraste);
    }

    // O áudio só começa após uma interação do visitante,
    // para evitar bloqueios automáticos do navegador.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarPlayer);
  } else {
    iniciarPlayer();
  }
})();
