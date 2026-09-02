/*
 * background.js
 *
 * 背景ポケモンのキャッシュとポップアニメーションを担当します。
 * クイズの画面遷移や問題生成とは独立して動作します。
 */

(() => {
  const CONFIG = {
    sourceLimit: 151,
    cacheCount: 40,
    spawnInterval: 900,
    minDuration: 3000,
    maxDuration: 5500,
    minSize: 68,
    maxSize: 145,
    opacity: 0.24
  };

  const state = {
    pokemon: [],
    bubbles: [],
    timer: null,
    nextId: 1,
    initialized: false,
    starting: false
  };

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  async function loadPokemon() {
    if (state.initialized || state.starting) {
      return;
    }

    state.starting = true;

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${CONFIG.sourceLimit}&offset=0`
      );

      if (!response.ok) {
        throw new Error("背景ポケモン一覧の取得に失敗しました。");
      }

      const data = await response.json();

      const selected = [...data.results]
        .sort(() => Math.random() - 0.5)
        .slice(0, CONFIG.cacheCount);

      const loaded = await Promise.all(
        selected.map(async pokemon => {
          try {
            const detailResponse = await fetch(pokemon.url);

            if (!detailResponse.ok) {
              return null;
            }

            const detail = await detailResponse.json();

            const image =
              detail.sprites.other?.["official-artwork"]?.front_default ||
              detail.sprites.front_default;

            if (!image) {
              return null;
            }

            // 画像をブラウザ側へ先読みしておく。
            const imageObject = new Image();
            imageObject.src = image;

            return {
              id: detail.id,
              name: detail.name,
              image
            };
          }
          catch (error) {
            return null;
          }
        })
      );

      state.pokemon = loaded.filter(Boolean);
      state.initialized = state.pokemon.length > 0;
    }
    catch (error) {
      console.warn(
        "背景ポケモンの読み込みに失敗しました。",
        error
      );
    }
    finally {
      state.starting = false;
    }
  }

  function createContainer() {
    let container = document.querySelector(
      ".background-bubbles"
    );

    if (!container) {
      container = document.createElement("div");
      container.className = "background-bubbles";
      container.setAttribute("aria-hidden", "true");
      document.body.prepend(container);
    }

    return container;
  }

  function spawn() {
    if (!state.pokemon.length) {
      return;
    }

    const container = createContainer();
    const pokemon = randomItem(state.pokemon);
    const bubble = document.createElement("div");
    const image = document.createElement("img");

    const id = state.nextId++;
    const size =
      CONFIG.minSize +
      Math.random() * (CONFIG.maxSize - CONFIG.minSize);

    const duration =
      CONFIG.minDuration +
      Math.random() *
      (CONFIG.maxDuration - CONFIG.minDuration);

    bubble.className = "pokemon-bubble";
    bubble.dataset.id = id;
    bubble.style.left = `${5 + Math.random() * 90}%`;
    bubble.style.top = `${8 + Math.random() * 84}%`;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.animationDuration = `${duration}ms`;

    image.src = pokemon.image;
    image.alt = "";
    image.draggable = false;

    bubble.appendChild(image);
    container.appendChild(bubble);

    state.bubbles.push({
      id,
      element: bubble
    });

    window.setTimeout(() => {
      bubble.remove();

      state.bubbles = state.bubbles.filter(
        item => item.id !== id
      );
    }, duration + 300);
  }

  async function start() {
    await loadPokemon();

    if (!state.pokemon.length) {
      return;
    }

    if (state.timer) {
      return;
    }

    spawn();

    state.timer = window.setInterval(() => {
      spawn();
    }, CONFIG.spawnInterval);
  }

  function stop() {
    if (state.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  window.BackgroundAnimation = {
    start,
    stop
  };
})();
