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

createApp({
  data() {
    return {
      loadingPokemonData: false,
      loadingNextQuestion: false,
      screen: "settings",
      generations: generationDefinitions,
      questionTypes: questionTypeDefinitions,
      selectedQuestionTypes: questionTypeDefinitions.map(type => type.id),
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
    this.$nextTick(() => {
      this.generations.forEach(
        generation =>
          this.updateGenerationCheckboxState(generation.id)
      );
    });
  },

  methods: {
    ...initMethods,
    ...questionMethods,

    backToSettings() {
      this.screen = "settings";
    }
  }
}).mount("#app");
