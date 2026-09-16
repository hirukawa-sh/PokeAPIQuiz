import {
  generationDefinitions,
  questionTypeDefinitions
} from "./init.js";

import {
  initMethods
} from "./init.js";

import {
  questionMethods
} from "./question.js";

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      loadingPokemonData: false,
      loadingNextQuestion: false,
      screen: "title",
      gameMode: null,
      certificationLevel: null,
      certificationLevelName: "",
      certificationQuestionCount: 0,
      certificationQuestionTypes: [],
      certificationFinished: false,
      timerSeconds: 10,
      timerId: null,
      timeoutOccurred: false,
      generations: generationDefinitions,
      questionTypes: questionTypeDefinitions,
      selectedQuestionTypes: questionTypeDefinitions.map(type => type.id),
      comparisonDifficulty: "intermediate",
      selectedTitles: [
        "red-blue",
        "yellow"
      ],
      generationCheckboxRefs: {},
      pokemonList: [],
      currentQuestion: null,
      questionHistory: new Set(),
      questionPokemonHistory: [],
      questionNumber: 0,
      score: 0,
      answeredCount: 0,
      answered: false,
      isCorrect: false,
      loading: false,
      errorMessage: "",
      settingsError: ""
    };
  },

  mounted() {
    this.startBackgroundAnimation();
    this.$nextTick(() => {
      this.generations.forEach(
        generation =>
          this.updateGenerationCheckboxState(generation.id)
      );
    });
  },

  methods: {
    startBackgroundAnimation() {
      if (
        window.BackgroundAnimation &&
        typeof window.BackgroundAnimation.start === "function"
      ) {
        window.BackgroundAnimation.start();
      }
    },

    stopBackgroundAnimation() {
      if (
        window.BackgroundAnimation &&
        typeof window.BackgroundAnimation.stop === "function"
      ) {
        window.BackgroundAnimation.stop();
      }
    },




    selectFreeMode() {
      this.gameMode = "free";
      this.screen = "settings";
    },

    selectCertificationMode() {
      this.gameMode = "certification";
      this.screen = "certificationLevels";
    },

    returnToTitle() {
      this.stopQuestionTimer();
      this.gameMode = null;
      this.certificationFinished = false;
      this.screen = "title";
    },

    getCertificationShareText() {
      const count = this.certificationQuestionCount;
      const correct = this.score;
      const passed = count > 0 && correct / count >= 0.7;

      return [
        "ポケモン○×クイズ",
        `検定モード　${this.certificationLevelName}`,
        `${correct}/${count}問正解！`,
        passed ? "合格しました！" : "今回は不合格でした。",
        "#ポケモンクイズ"
      ].join("\n");
    },

    shareToX() {
      const text = this.getCertificationShareText();
      const url = window.location.href;
      const shareUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text) +
        "&url=" +
        encodeURIComponent(url);

      window.open(shareUrl, "_blank", "noopener,noreferrer");
    },

    shareToLine() {
      const text =
        this.getCertificationShareText() +
        "\n" +
        window.location.href;
      const shareUrl =
        "https://line.me/R/share?text=" +
        encodeURIComponent(text);

      window.location.href = shareUrl;
    },


    ...initMethods,
    ...questionMethods,

    backToSettings() {
      this.stopQuestionTimer();
      this.screen = "settings";
    }
  }
});

app.mount("#app");
