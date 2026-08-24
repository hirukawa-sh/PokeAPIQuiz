const { createApp } = Vue;

const API_BASE = "https://pokeapi.co/api/v2";

/*
 * 出題範囲の定義。
 *
 * 「世代」を親、
 * 「ゲームタイトル」を子として管理します。
 *
 * ここではタイトル単位の出題範囲として、
 * PokeAPIの version データを利用します。
 */
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

const pokemonCache = new Map();
const speciesCache = new Map();
const moveCache = new Map();
const versionPokemonCache = new Map();

createApp({
  data() { return {
    screen:'settings', generations:generationDefinitions,
    selectedTitles:['red-blue','yellow'], generationCheckboxRefs:{},
    pokemonList:[], currentQuestion:null, questionHistory:new Set(),
    questionPokemonHistory:[], questionNumber:0, score:0, answeredCount:0,
    answered:false, isCorrect:false, loading:false, errorMessage:'', settingsError:''
  }; },
  mounted(){ this.$nextTick(()=>this.generations.forEach(g=>this.updateGenerationCheckboxState(g.id))); },
  methods:{
    setGenerationCheckboxRef(id,el){if(el){this.generationCheckboxRefs[id]=el;this.updateGenerationCheckboxState(id);}},
    updateGenerationCheckboxState(id){const g=this.generations.find(x=>x.id===id),c=this.generationCheckboxRefs[id];if(!g||!c)return;const n=this.selectedTitleCount(g);c.indeterminate=n>0&&n<g.titles.length;},
    selectedTitleCount(g){return g.titles.filter(t=>this.selectedTitles.includes(t.id)).length;},
    isGenerationFullySelected(g){return g.titles.length>0&&this.selectedTitleCount(g)===g.titles.length;},
    toggleGeneration(g){const ids=g.titles.map(t=>t.id);if(this.isGenerationFullySelected(g))this.selectedTitles=this.selectedTitles.filter(x=>!ids.includes(x));else this.selectedTitles=[...new Set([...this.selectedTitles,...ids])];},
    selectAll(){this.selectedTitles=this.generations.flatMap(g=>g.titles.map(t=>t.id));},
    clearAll(){this.selectedTitles=[];},
    getSelectedTitleDefinitions(){return this.generations.flatMap(g=>g.titles).filter(t=>this.selectedTitles.includes(t.id));},
    randomItem(a){return a[Math.floor(Math.random()*a.length)];},
    shuffleArray(a){return [...a].sort(()=>Math.random()-0.5);},

    async startQuiz(){
      if(!this.selectedTitles.length){this.settingsError='少なくとも1つの出題範囲を選択してください。';return;}
      this.settingsError='';this.errorMessage='';this.loading=true;this.screen='quiz';
      this.questionHistory=new Set();this.questionPokemonHistory=[];this.questionNumber=0;this.score=0;this.answeredCount=0;this.answered=false;
      try{const ids=await this.fetchSelectedPokemonIds();if(!ids.length)throw new Error('選択された出題範囲にポケモンがありません。');this.pokemonList=this.shuffleArray(ids).map(id=>({id}));await this.nextQuestion();}
      catch(e){console.error(e);this.errorMessage=e.message||'データ取得エラーが発生しました。';}
      finally{this.loading=false;}
    },
    async fetchSelectedPokemonIds(){const result=new Set();for(const title of this.getSelectedTitleDefinitions()){const ids=await this.fetchVersionPokemonIds(title);ids.forEach(id=>result.add(id));}return [...result];},
    async fetchVersionPokemonIds(title){
      if(versionPokemonCache.has(title.id))return versionPokemonCache.get(title.id);
      const r=await fetch(`${API_BASE}/version-group/${title.versionGroup}`);if(!r.ok)throw new Error(`Version Group API error: ${r.status}`);const g=await r.json();const ids=new Set();
      for(const p of g.pokedexes||[]){const pr=await fetch(p.url);if(!pr.ok)continue;const d=await pr.json();for(const e of d.pokemon_entries||[]){const m=e.pokemon_species.url.match(/\/(?:pokemon|pokemon-species)\/(\d+)\/$/);if(m)ids.add(Number(m[1]));}}
      const out=[...ids];versionPokemonCache.set(title.id,out);return out;
    },
    async fetchPokemon(id){
      if(pokemonCache.has(id))return pokemonCache.get(id);
      const r=await fetch(`${API_BASE}/pokemon/${id}`);if(!r.ok)throw new Error(`Pokemon API error: ${r.status}`);const d=await r.json();const name=await this.fetchJapaneseName(id);
      const p={id,name,image:d.sprites?.other?.['official-artwork']?.front_default||d.sprites?.front_default,shinyImage:d.sprites?.other?.['official-artwork']?.front_shiny||d.sprites?.front_shiny,cries:{latest:d.cries?.latest||null,legacy:d.cries?.legacy||null},abilities:(d.abilities||[]).map(x=>x.ability.name),types:(d.types||[]).map(x=>x.type.name),moves:(d.moves||[]).map(x=>x.move.name)};pokemonCache.set(id,p);return p;
    },
    async fetchJapaneseName(id){if(speciesCache.has(id))return speciesCache.get(id);const r=await fetch(`${API_BASE}/pokemon-species/${id}`);if(!r.ok)throw new Error(`Species API error: ${r.status}`);const d=await r.json();const n=d.names?.find(x=>x.language.name==='ja')?.name||d.name;speciesCache.set(id,n);return n;},
    async fetchJapaneseMoveName(id){if(moveCache.has(id))return moveCache.get(id);const r=await fetch(`${API_BASE}/move/${id}`);if(!r.ok)return id;const d=await r.json();const n=d.names?.find(x=>x.language.name==='ja')?.name||id;moveCache.set(id,n);return n;},
    async fetchJapaneseAbilityName(id){if(moveCache.has('a:'+id))return moveCache.get('a:'+id);const r=await fetch(`${API_BASE}/ability/${id}`);if(!r.ok)return id;const d=await r.json();const n=d.names?.find(x=>x.language.name==='ja')?.name||id;moveCache.set('a:'+id,n);return n;},
    async getDifferentPokemon(id){const a=this.pokemonList.filter(p=>p.id!==id);return a.length?this.fetchPokemon(this.randomItem(a).id):null;},

    async createQuestion(p){
      const n=Math.floor(Math.random()*7);
      if(n===0)return await this.createNameQuestion(p);
      if(n===1)return await this.createTypeQuestion(p);
      if(n===2)return await this.createAbilityQuestion(p);
      if(n===3)return await this.createMoveQuestion(p);
      if(n===4)return await this.createCryQuestion(p);
      if(n===5)return await this.createSilhouetteQuestion(p);
      return await this.createShinyQuestion(p);
    },
    async createNameQuestion(p){const truth=Math.random()<.5;let name=p.name;if(!truth){const o=await this.getDifferentPokemon(p.id);if(o)name=o.name;}return{typeLabel:'ポケモン名',pokemonId:p.id,pokemonImage:p.image,pokemonName:p.name,text:`このポケモンは「${name}」である。`,correctAnswer:name===p.name,explanation:`このポケモンは「${p.name}」です。`};},
    createTypeQuestion(p){const names={normal:'ノーマル',fire:'ほのお',water:'みず',electric:'でんき',grass:'くさ',ice:'こおり',fighting:'かくとう',poison:'どく',ground:'じめん',flying:'ひこう',psychic:'エスパー',bug:'むし',rock:'いわ',ghost:'ゴースト',dragon:'ドラゴン',dark:'あく',steel:'はがね',fairy:'フェアリー'};const truth=Math.random()<.5;const type=truth?this.randomItem(p.types):this.randomItem(Object.keys(names).filter(x=>!p.types.includes(x)));return{typeLabel:'タイプ',pokemonId:p.id,pokemonImage:p.image,pokemonName:p.name,text:`${p.name}は「${names[type]}タイプ」である。`,correctAnswer:p.types.includes(type),explanation:`${p.name}のタイプは「${p.types.map(x=>names[x]).join('・')}」です。`};},
    async createAbilityQuestion(p){
      if(!p.abilities.length)return this.createTypeQuestion(p);
      const truth=Math.random()<.5;
      let a=this.randomItem(p.abilities);
      if(!truth){
        const o=await this.getDifferentPokemon(p.id);
        if(!o?.abilities?.length)return this.createTypeQuestion(p);
        const c=o.abilities.filter(x=>!p.abilities.includes(x));
        if(!c.length)return this.createTypeQuestion(p);
        a=this.randomItem(c);
      }
      const name=await this.fetchJapaneseAbilityName(a);
      const actual=await Promise.all(p.abilities.map(x=>this.fetchJapaneseAbilityName(x)));
      return{
        typeLabel:'とくせい',
        pokemonId:p.id,
        pokemonImage:p.image,
        pokemonName:p.name,
        text:`${p.name}のとくせいの1つは「${name}」である。`,
        correctAnswer:p.abilities.includes(a),
        explanation:`${p.name}のとくせいは「${actual.join('」「')}」です。`
      };
    },
    async createMoveQuestion(p){
      if(!p.moves.length)return this.createTypeQuestion(p);
      const truth=Math.random()<.5;
      let m=this.randomItem(p.moves);
      if(!truth){
        const o=await this.getDifferentPokemon(p.id);
        if(!o?.moves?.length)return this.createTypeQuestion(p);
        const c=o.moves.filter(x=>!p.moves.includes(x));
        if(!c.length)return this.createTypeQuestion(p);
        m=this.randomItem(c);
      }
      const name=await this.fetchJapaneseMoveName(m);
      const canLearn=p.moves.includes(m);
      return{
        typeLabel:'おぼえるわざ',
        pokemonId:p.id,
        pokemonImage:p.image,
        pokemonName:p.name,
        text:`${p.name}は「${name}」をおぼえる。`,
        correctAnswer:canLearn,
        explanation:canLearn
          ?`「${name}」を${p.name}は覚えます。`
          :`「${name}」を${p.name}は覚えません。`
      };
    },
    async createCryQuestion(p){const cry=p.cries.latest||p.cries.legacy;if(!cry)return this.createTypeQuestion(p);const truth=Math.random()<.5;let name=p.name;if(!truth){const o=await this.getDifferentPokemon(p.id);if(o)name=o.name;}return{typeLabel:'鳴き声',pokemonId:p.id,pokemonImage:null,pokemonName:p.name,text:`この鳴き声は「${name}」のものである。`,correctAnswer:truth,explanation:`この鳴き声は「${p.name}」のものです。`,cryUrl:cry,isCryQuestion:true};},
    async createSilhouetteQuestion(p){const truth=Math.random()<.5;let name=p.name;if(!truth){const o=await this.getDifferentPokemon(p.id);if(o)name=o.name;}return{typeLabel:'シルエット',pokemonId:p.id,pokemonImage:p.image,pokemonName:p.name,text:`このシルエットは「${name}」である。`,correctAnswer:truth,explanation:`このポケモンは「${p.name}」です。`,isSilhouetteQuestion:true};},
    async createShinyQuestion(p){if(!p.shinyImage)return this.createTypeQuestion(p);const truth=Math.random()<.5;let name=p.name;if(!truth){const o=await this.getDifferentPokemon(p.id);if(o)name=o.name;}return{typeLabel:'色ちがい',pokemonId:p.id,pokemonImage:p.shinyImage,pokemonName:p.name,text:`この色ちがいは「${name}」のものである。`,correctAnswer:truth,explanation:`これは「${p.name}」の実際の色ちがい画像です。`,isShinyQuestion:true};},

    async nextQuestion(){this.answered=false;this.isCorrect=false;try{this.currentQuestion=await this.createUniqueQuestion();this.questionNumber++;}catch(e){console.error(e);this.errorMessage='問題の作成中にエラーが発生しました。';}},
    async createUniqueQuestion(){for(let i=0;i<30;i++){const stub=this.randomItem(this.pokemonList),p=await this.fetchPokemon(stub.id),q=await this.createQuestion(p),id=this.getQuestionId(q);if(!this.questionHistory.has(id)){this.questionHistory.add(id);this.questionPokemonHistory.push(p.id);return q;}}throw new Error('新しい問題を作成できませんでした。');},
    getQuestionId(q){return[q.typeLabel,q.pokemonId,q.text,q.cryUrl||'',q.pokemonImage||''].join('|');},
    getPokemonQuestionCount(id){return this.questionPokemonHistory.filter(x=>x===id).length;},
    answer(v){if(this.answered||!this.currentQuestion)return;const selected=v===true||v==='true'||v===1||v==='1';const correct=this.currentQuestion.correctAnswer===true||this.currentQuestion.correctAnswer==='true'||this.currentQuestion.correctAnswer===1||this.currentQuestion.correctAnswer==='1';this.answered=true;this.isCorrect=selected===correct;this.answeredCount++;if(this.isCorrect)this.score++;},
    backToSettings(){this.screen='settings';}
  }
}).mount('#app');
