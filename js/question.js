export const questionMethods = {
  async createQuestion(pokemon) {
    const selectedTypes = this.selectedQuestionTypes || [
      "name",
      "type",
      "ability",
      "move",
      "cry",
      "silhouette",
      "shiny"
    ];

    const type = this.randomItem(selectedTypes);

    if (type === "name") {
      return await this.createNameQuestion(pokemon);
    }
    else if (type === "type") {
      return await this.createTypeQuestion(pokemon);
    }
    else if (type === "ability") {
      return await this.createAbilityQuestion(pokemon);
    }
    else if (type === "move") {
      return await this.createMoveQuestion(pokemon);
    }
    else if (type === "cry") {
      return await this.createCryQuestion(pokemon);
    }
    else if (type === "silhouette") {
      return await this.createSilhouetteQuestion(pokemon);
    }
    else if (type === "shiny") {
      return await this.createShinyQuestion(pokemon);
    }

    return await this.createNameQuestion(pokemon);
  },

  async createNameQuestion(pokemon) {
    const truth = Math.random() < 0.5;
    let name = pokemon.name;

    if (!truth) {
      const other = await this.getDifferentPokemon(pokemon.id);

      if (other) {
        name = other.name;
      }
    }

    return {
      typeLabel: "ポケモン名",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text: `このポケモンは「${name}」である。`,
      correctAnswer: name === pokemon.name,
      explanation: `このポケモンは「${pokemon.name}」です。`
    };
  },

  createTypeQuestion(pokemon) {
    const names = {
      normal: "ノーマル",
      fire: "ほのお",
      water: "みず",
      electric: "でんき",
      grass: "くさ",
      ice: "こおり",
      fighting: "かくとう",
      poison: "どく",
      ground: "じめん",
      flying: "ひこう",
      psychic: "エスパー",
      bug: "むし",
      rock: "いわ",
      ghost: "ゴースト",
      dragon: "ドラゴン",
      dark: "あく",
      steel: "はがね",
      fairy: "フェアリー"
    };

    const truth = Math.random() < 0.5;
    const type = truth
      ? this.randomItem(pokemon.types)
      : this.randomItem(
          Object.keys(names).filter(
            type => !pokemon.types.includes(type)
          )
        );

    return {
      typeLabel: "タイプ",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text: `${pokemon.name}は「${names[type]}タイプ」である。`,
      correctAnswer: pokemon.types.includes(type),
      explanation:
        `${pokemon.name}のタイプは「${
          pokemon.types.map(type => names[type]).join("・")
        }」です。`
    };
  },

  async createAbilityQuestion(pokemon) {
    if (!pokemon.abilities.length) {
      return this.createTypeQuestion(pokemon);
    }

    const truth = Math.random() < 0.5;
    let ability = this.randomItem(pokemon.abilities);

    if (!truth) {
      const other = await this.getDifferentPokemon(pokemon.id);

      if (!other?.abilities?.length) {
        return this.createTypeQuestion(pokemon);
      }

      const candidates = other.abilities.filter(
        item => !pokemon.abilities.includes(item)
      );

      if (!candidates.length) {
        return this.createTypeQuestion(pokemon);
      }

      ability = this.randomItem(candidates);
    }

    const name = await this.fetchJapaneseAbilityName(ability);
    const actual = await Promise.all(
      pokemon.abilities.map(
        item => this.fetchJapaneseAbilityName(item)
      )
    );

    return {
      typeLabel: "とくせい",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text:
        `${pokemon.name}のとくせいの1つは「${name}」である。`,
      correctAnswer: pokemon.abilities.includes(ability),
      explanation:
        `${pokemon.name}のとくせいは「${actual.join("」「")}」です。`
    };
  },

  async createMoveQuestion(pokemon) {
    if (!pokemon.moves.length) {
      return this.createTypeQuestion(pokemon);
    }

    const truth = Math.random() < 0.5;
    let move = this.randomItem(pokemon.moves);

    if (!truth) {
      const other = await this.getDifferentPokemon(pokemon.id);

      if (!other?.moves?.length) {
        return this.createTypeQuestion(pokemon);
      }

      const candidates = other.moves.filter(
        item => !pokemon.moves.includes(item)
      );

      if (!candidates.length) {
        return this.createTypeQuestion(pokemon);
      }

      move = this.randomItem(candidates);
    }

    const name = await this.fetchJapaneseMoveName(move);
    const canLearn = pokemon.moves.includes(move);

    return {
      typeLabel: "おぼえるわざ",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text: `${pokemon.name}は「${name}」をおぼえる。`,
      correctAnswer: canLearn,
      explanation: canLearn
        ? `「${name}」を${pokemon.name}は覚えます。`
        : `「${name}」を${pokemon.name}は覚えません。`
    };
  },

  async createCryQuestion(pokemon) {
    const cry =
      pokemon.cries.latest ||
      pokemon.cries.legacy;

    if (!cry) {
      return this.createTypeQuestion(pokemon);
    }

    const truth = Math.random() < 0.5;
    let name = pokemon.name;

    if (!truth) {
      const other = await this.getDifferentPokemon(pokemon.id);

      if (other) {
        name = other.name;
      }
    }

    return {
      typeLabel: "鳴き声",
      pokemonId: pokemon.id,
      pokemonImage: null,
      pokemonName: pokemon.name,
      text: `この鳴き声は「${name}」のものである。`,
      correctAnswer: truth,
      explanation:
        `この鳴き声は「${pokemon.name}」のものです。`,
      cryUrl: cry,
      isCryQuestion: true
    };
  },

  async createSilhouetteQuestion(pokemon) {
    const truth = Math.random() < 0.5;
    let name = pokemon.name;

    if (!truth) {
      const other = await this.getDifferentPokemon(pokemon.id);

      if (other) {
        name = other.name;
      }
    }

    return {
      typeLabel: "シルエット",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text: `このシルエットは「${name}」である。`,
      correctAnswer: truth,
      explanation:
        `このポケモンは「${pokemon.name}」です。`,
      isSilhouetteQuestion: true,
      silhouetteFilter: "brightness(0) contrast(1.2)"
    };
  },

  async createShinyQuestion(pokemon) {
    if (!pokemon.shinyImage || !pokemon.image) {
      return this.createTypeQuestion(pokemon);
    }

    const truth = Math.random() < 0.5;

    if (truth) {
      return {
        typeLabel: "色ちがい",
        pokemonId: pokemon.id,
        pokemonImage: pokemon.shinyImage,
        pokemonName: pokemon.name,
        text:
          `この「${pokemon.name}」の色ちがいは実際に登場する。`,
        correctAnswer: true,
        explanation:
          `「${pokemon.name}」には、この色ちがいが実際に存在します。`,
        isShinyQuestion: true,
        shinyFilter: ""
      };
    }

    const filters = [
      "hue-rotate(70deg) saturate(1.8)",
      "hue-rotate(140deg) saturate(1.7)",
      "hue-rotate(210deg) saturate(1.8)",
      "hue-rotate(280deg) saturate(1.7)",
      "hue-rotate(330deg) saturate(1.6)",
      "saturate(2.2) brightness(1.15)",
      "hue-rotate(45deg) saturate(1.5) brightness(1.1)",
      "hue-rotate(180deg) saturate(1.6) brightness(0.95)"
    ];

    const filter = this.randomItem(filters);

    return {
      typeLabel: "色ちがい",
      pokemonId: pokemon.id,
      pokemonImage: pokemon.image,
      pokemonName: pokemon.name,
      text:
        `この「${pokemon.name}」の色ちがいは実際に登場する。`,
      correctAnswer: false,
      explanation:
        `これは「${pokemon.name}」の通常色に色調整を加えた架空の色ちがいです。` +
        "実際の色ちがいではありません。",
      isShinyQuestion: true,
      shinyFilter: filter
    };
  },

  async nextQuestion() {
    this.loadingNextQuestion = true;
    this.answered = false;
    this.isCorrect = false;

    try {
      this.currentQuestion =
        await this.createUniqueQuestion();
      this.questionNumber++;
    }
catch (error) {
      console.error(error);
      this.errorMessage =
        "問題の作成中にエラーが発生しました。";
    }
finally {
      this.loadingNextQuestion = false;
    }
  },

  async createUniqueQuestion() {
    for (let i = 0; i < 30; i++) {
      const stub = this.randomItem(this.pokemonList);
      const pokemon = await this.fetchPokemon(stub.id);
      const question = await this.createQuestion(pokemon);
      const id = this.getQuestionId(question);

      if (
        !this.selectedQuestionTypes.includes(
          this.getQuestionTypeId(question)
        )
      ) {
        continue;
      }

      if (!this.questionHistory.has(id)) {
        this.questionHistory.add(id);
        this.questionPokemonHistory.push(pokemon.id);

        return question;
      }
    }

    throw new Error(
      "新しい問題を作成できませんでした。"
    );
  },

  getQuestionTypeId(question) {
    const map = {
      "ポケモン名": "name",
      "タイプ": "type",
      "とくせい": "ability",
      "おぼえるわざ": "move",
      "鳴き声": "cry",
      "シルエット": "silhouette",
      "色ちがい": "shiny"
    };

    return map[question.typeLabel] || "";
  },

  getQuestionId(question) {
    return [
      question.typeLabel,
      question.pokemonId,
      question.text,
      question.cryUrl || "",
      question.pokemonImage || ""
    ].join("|");
  },

  getPokemonQuestionCount(id) {
    return this.questionPokemonHistory.filter(
      pokemonId => pokemonId === id
    ).length;
  },

  answer(value) {
    if (this.answered || !this.currentQuestion) {
      return;
    }

    const selected =
      value === true ||
      value === "true" ||
      value === 1 ||
      value === "1";

    const correct =
      this.currentQuestion.correctAnswer === true ||
      this.currentQuestion.correctAnswer === "true" ||
      this.currentQuestion.correctAnswer === 1 ||
      this.currentQuestion.correctAnswer === "1";

    this.answered = true;
    this.isCorrect = selected === correct;
    this.answeredCount++;

    if (this.isCorrect) {
      this.score++;
    }
  }
};

