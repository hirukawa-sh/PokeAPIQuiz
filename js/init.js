const API_BASE = "https://pokeapi.co/api/v2";

const generationDefinitions = [
  {
    id: 1,
    name: "第1世代",
    titles: [
      {
        id: "red-blue",
        name: "赤・緑・青",
        versionGroup: "red-blue",
        versions: ["red", "blue"],
      },
      {
        id: "yellow",
        name: "ピカチュウ",
        versionGroup: "yellow",
        versions: ["yellow"],
      },
    ],
  },
  {
    id: 2,
    name: "第2世代",
    titles: [
      {
        id: "gold-silver",
        name: "金・銀",
        versionGroup: "gold-silver",
        versions: ["gold", "silver"],
      },
      {
        id: "crystal",
        name: "クリスタル",
        versionGroup: "crystal",
        versions: ["crystal"],
      },
    ],
  },
  {
    id: 3,
    name: "第3世代",
    titles: [
      {
        id: "ruby-sapphire",
        name: "ルビー・サファイア",
        versionGroup: "ruby-sapphire",
        versions: ["ruby", "sapphire"],
      },
      {
        id: "emerald",
        name: "エメラルド",
        versionGroup: "emerald",
        versions: ["emerald"],
      },
      {
        id: "firered-leafgreen",
        name: "ファイアレッド・リーフグリーン",
        versionGroup: "firered-leafgreen",
        versions: ["firered", "leafgreen"],
      },
    ],
  },
  {
    id: 4,
    name: "第4世代",
    titles: [
      {
        id: "diamond-pearl",
        name: "ダイヤモンド・パール",
        versionGroup: "diamond-pearl",
        versions: ["diamond", "pearl"],
      },
      {
        id: "platinum",
        name: "プラチナ",
        versionGroup: "platinum",
        versions: ["platinum"],
      },
      {
        id: "heartgold-soulsilver",
        name: "ハートゴールド・ソウルシルバー",
        versionGroup: "heartgold-soulsilver",
        versions: ["heartgold", "soulsilver"],
      },
    ],
  },
  {
    id: 5,
    name: "第5世代",
    titles: [
      {
        id: "black-white",
        name: "ブラック・ホワイト",
        versionGroup: "black-white",
        versions: ["black", "white"],
      },
      {
        id: "black-2-white-2",
        name: "ブラック2・ホワイト2",
        versionGroup: "black-2-white-2",
        versions: ["black-2", "white-2"],
      },
    ],
  },
  {
    id: 6,
    name: "第6世代",
    titles: [
      {
        id: "x-y",
        name: "X・Y",
        versionGroup: "x-y",
        versions: ["x", "y"],
      },
      {
        id: "omega-ruby-alpha-sapphire",
        name: "オメガルビー・アルファサファイア",
        versionGroup: "omega-ruby-alpha-sapphire",
        versions: ["omega-ruby", "alpha-sapphire"],
      },
    ],
  },
  {
    id: 7,
    name: "第7世代",
    titles: [
      {
        id: "sun-moon",
        name: "サン・ムーン",
        versionGroup: "sun-moon",
        versions: ["sun", "moon"],
      },
      {
        id: "ultra-sun-ultra-moon",
        name: "ウルトラサン・ウルトラムーン",
        versionGroup: "ultra-sun-ultra-moon",
        versions: ["ultra-sun", "ultra-moon"],
      },
      {
        id: "lets-go-pikachu-eevee",
        name: "Let's Go! ピカチュウ・Let's Go! イーブイ",
        versionGroup: "lets-go-pikachu-lets-go-eevee",
        versions: ["lets-go-pikachu", "lets-go-eevee"],
      },
    ],
  },
  {
    id: 8,
    name: "第8世代",
    titles: [
      {
        id: "sword-shield",
        name: "ソード・シールド",
        versionGroup: "sword-shield",
        versions: ["sword", "shield"],
      },
      {
        id: "brilliant-diamond-shining-pearl",
        name: "ブリリアントダイヤモンド・シャイニングパール",
        versionGroup: "brilliant-diamond-shining-pearl",
        versions: ["brilliant-diamond", "shining-pearl"],
      },
      {
        id: "legends-arceus",
        name: "Pokémon LEGENDS アルセウス",
        versionGroup: "legends-arceus",
        versions: ["legends-arceus"],
      },
    ],
  },
  {
    id: 9,
    name: "第9世代",
    titles: [
      {
        id: "scarlet-violet",
        name: "スカーレット・バイオレット",
        versionGroup: "scarlet-violet",
        versions: ["scarlet", "violet"],
      },
    ],
  },
];

const questionTypeDefinitions = [
  {
    id: "name",
    name: "ポケモン名"
  },
  {
    id: "type",
    name: "タイプ"
  },
  {
    id: "ability",
    name: "とくせい"
  },
  {
    id: "move",
    name: "おぼえるわざ"
  },
  {
    id: "cry",
    name: "鳴き声"
  },
  {
    id: "silhouette",
    name: "シルエット"
  },
  {
    id: "shiny",
    name: "色ちがい"
  },
  {
    id: "heightComparison",
    name: "身長比較"
  },
  {
    id: "weightComparison",
    name: "体重比較"
  }
];

const pokemonCache = new Map();
const speciesCache = new Map();
const moveCache = new Map();
const versionPokemonCache = new Map();

export {
  questionTypeDefinitions,
  API_BASE,
  generationDefinitions,
  pokemonCache,
  speciesCache,
  moveCache,
  versionPokemonCache
};

export const initMethods = {
  isQuestionTypeSelected(typeId) {
    return this.selectedQuestionTypes.includes(typeId);
  },

  toggleQuestionType(typeId) {
    if (this.selectedQuestionTypes.includes(typeId)) {
      this.selectedQuestionTypes =
        this.selectedQuestionTypes.filter(id => id !== typeId);
    }
else {
      this.selectedQuestionTypes = [
        ...this.selectedQuestionTypes,
        typeId
      ];
    }
  },

  selectAllQuestionTypes() {
    this.selectedQuestionTypes =
      this.questionTypes.map(type => type.id);
  },

  clearAllQuestionTypes() {
    this.selectedQuestionTypes = [];
  },

  goToQuestionTypeSelection() {
    if (!this.selectedTitles.length) {
      this.settingsError =
        "少なくとも1つの出題範囲を選択してください。";
      return;
    }

    this.settingsError = "";
    this.screen = "questionTypes";
  },


  setGenerationCheckboxRef(id, el) {
    if (el) {
      this.generationCheckboxRefs[id] = el;
      this.updateGenerationCheckboxState(id);
    }
  },

  updateGenerationCheckboxState(id) {
    const generation = this.generations.find(x => x.id === id);
    const checkbox = this.generationCheckboxRefs[id];

    if (!generation || !checkbox) {
      return;
    }

    const count = this.selectedTitleCount(generation);
    checkbox.indeterminate =
      count > 0 && count < generation.titles.length;
  },

  selectedTitleCount(generation) {
    return generation.titles.filter(title =>
      this.selectedTitles.includes(title.id)
    ).length;
  },

  isGenerationFullySelected(generation) {
    return generation.titles.length > 0 &&
      this.selectedTitleCount(generation) === generation.titles.length;
  },

  toggleGeneration(generation) {
    const ids = generation.titles.map(title => title.id);

    if (this.isGenerationFullySelected(generation)) {
      this.selectedTitles = this.selectedTitles.filter(
        id => !ids.includes(id)
      );
    }
else {
      this.selectedTitles = [
        ...new Set([
          ...this.selectedTitles,
          ...ids
        ])
      ];
    }
  },

  selectAll() {
    this.selectedTitles = this.generations.flatMap(generation =>
      generation.titles.map(title => title.id)
    );
  },

  clearAll() {
    this.selectedTitles = [];
  },

  getSelectedTitleDefinitions() {
    return this.generations
      .flatMap(generation => generation.titles)
      .filter(title => this.selectedTitles.includes(title.id));
  },

  randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  },

  async startQuiz() {
    if (!this.selectedTitles.length) {
      this.settingsError =
        "少なくとも1つの出題範囲を選択してください。";
      return;
    }

    this.settingsError = "";
    this.errorMessage = "";
    this.loading = true;
    this.loadingPokemonData = true;
    this.screen = "quiz";

    this.questionHistory = new Set();
    this.questionPokemonHistory = [];
    this.questionNumber = 0;
    this.score = 0;
    this.answeredCount = 0;
    this.answered = false;

    try {
      const ids = await this.fetchSelectedPokemonIds();

      if (!ids.length) {
        throw new Error(
          "選択された出題範囲にポケモンがありません。"
        );
      }

      this.pokemonList = this.shuffleArray(ids).map(id => ({ id }));

      await this.nextQuestion();
    }
catch (error) {
      console.error("Data loading error:", error);
      this.errorMessage =
        error.message || "データ取得エラーが発生しました。";
    }
finally {
      this.loadingPokemonData = false;
      this.loading = false;
    }
  },

  async fetchSelectedPokemonIds() {
    const result = new Set();

    for (const title of this.getSelectedTitleDefinitions()) {
      const ids = await this.fetchVersionPokemonIds(title);

      ids.forEach(id => result.add(id));
    }

    return [...result];
  },

  async fetchVersionPokemonIds(title) {
    if (versionPokemonCache.has(title.id)) {
      return versionPokemonCache.get(title.id);
    }

    const response = await fetch(
      `${API_BASE}/version-group/${title.versionGroup}`
    );

    if (!response.ok) {
      throw new Error(
        `Version Group API error: ${response.status}`
      );
    }

    const group = await response.json();
    const ids = new Set();

    for (const pokedex of group.pokedexes || []) {
      const pokedexResponse = await fetch(pokedex.url);

      if (!pokedexResponse.ok) {
        continue;
      }

      const data = await pokedexResponse.json();

      for (const entry of data.pokemon_entries || []) {
        const match =
          entry.pokemon_species.url.match(
            /\/(?:pokemon|pokemon-species)\/(\d+)(?:\/|$)/
          );

        if (match) {
          ids.add(Number(match[1]));
        }
      }
    }

    const result = [...ids];
    versionPokemonCache.set(title.id, result);

    return result;
  },

  async fetchPokemon(id) {
    if (pokemonCache.has(id)) {
      return pokemonCache.get(id);
    }

    const response = await fetch(
      `${API_BASE}/pokemon/${id}`
    );

    if (!response.ok) {
      throw new Error(
        `Pokemon API error: ${response.status}`
      );
    }

    const data = await response.json();
    const name = await this.fetchJapaneseName(id);

    const pokemon = {
      id,
      name,
      image:
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default,
      shinyImage:
        data.sprites?.other?.["official-artwork"]?.front_shiny ||
        data.sprites?.front_shiny,
      height: data.height,
      weight: data.weight,
      cries: {
        latest: data.cries?.latest || null,
        legacy: data.cries?.legacy || null
      },
      abilities: (data.abilities || [])
        .map(item => item.ability.name),
      types: (data.types || [])
        .map(item => item.type.name),
      moves: (data.moves || [])
        .map(item => item.move.name)
    };

    pokemonCache.set(id, pokemon);

    return pokemon;
  },

  async fetchJapaneseName(id) {
    if (speciesCache.has(id)) {
      return speciesCache.get(id);
    }

    const response = await fetch(
      `${API_BASE}/pokemon-species/${id}`
    );

    if (!response.ok) {
      throw new Error(
        `Species API error: ${response.status}`
      );
    }

    const data = await response.json();
    const name =
      data.names?.find(
        item => item.language.name === "ja"
      )?.name || data.name;

    speciesCache.set(id, name);

    return name;
  },

  async fetchJapaneseMoveName(id) {
    if (moveCache.has(id)) {
      return moveCache.get(id);
    }

    const response = await fetch(
      `${API_BASE}/move/${id}`
    );

    if (!response.ok) {
      return id;
    }

    const data = await response.json();
    const name =
      data.names?.find(
        item => item.language.name === "ja"
      )?.name || id;

    moveCache.set(id, name);

    return name;
  },

  async fetchJapaneseAbilityName(id) {
    const key = `a:${id}`;

    if (moveCache.has(key)) {
      return moveCache.get(key);
    }

    const response = await fetch(
      `${API_BASE}/ability/${id}`
    );

    if (!response.ok) {
      return id;
    }

    const data = await response.json();
    const name =
      data.names?.find(
        item => item.language.name === "ja"
      )?.name || id;

    moveCache.set(key, name);

    return name;
  },

  async getDifferentPokemon(id) {
    const candidates = this.pokemonList.filter(
      pokemon => pokemon.id !== id
    );

    if (!candidates.length) {
      return null;
    }

    return this.fetchPokemon(
      this.randomItem(candidates).id
    );
  }
};
