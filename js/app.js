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
      this.gameMode = null;
      this.screen = "title";
    },


    ...initMethods,
    ...questionMethods,

    backToSettings() {
      this.screen = "settings";
    }
  }
});

app.mount("#app");
