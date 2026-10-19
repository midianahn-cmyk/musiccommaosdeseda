
/* =====================================================
   INSTALADOR DO PLAYER MUSICAL
   Criadora: Com Mãos de Seda
   © 2026 Com Mãos de Seda
   ===================================================== */

(function () {
  'use strict';

  const base =
    'https://cdn.jsdelivr.net/gh/midianahn-cmyk/musiccommaosdeseda@main/';

  // Evita instalar o player duas vezes.
  if (window.__playerMusicalInstalando) return;
  window.__playerMusicalInstalando = true;

  function instalarCSS() {
    if (document.querySelector('link[data-player-musical-css]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'player.css';
    link.setAttribute('data-player-musical-css', 'true');
    document.head.appendChild(link);
  }

  function carregarJavaScript() {
    if (document.querySelector('script[data-player-musical-js]')) return;

    const script = document.createElement('script');
    script.src = base + 'player.js';
    script.setAttribute('data-player-musical-js', 'true');
    document.body.appendChild(script);
  }

  function instalarPlayer() {
    if (document.getElementById('player')) {
      instalarCSS();
      carregarJavaScript();
      return;
    }

    fetch(base + 'player.html')
      .then(function (resposta) {
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar player.html');
        }
        return resposta.text();
      })
      .then(function (html) {
        const container = document.createElement('div');
        container.id = 'player-musical-container';
        container.innerHTML = html;
        document.body.appendChild(container);

        instalarCSS();
        carregarJavaScript();
      })
      .catch(function (erro) {
        console.error('Erro ao instalar o Player Musical:', erro);
        window.__playerMusicalInstalando = false;
      });
  }

  function iniciar() {
    if (!document.body || !document.head) {
      window.__playerMusicalInstalando = false;
      return;
    }

    instalarPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
