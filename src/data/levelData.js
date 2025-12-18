export default class LevelData {
  constructor(config) {
    this.letters = [];
    this.words = [];
    this.hasTutorial = false;
    this.tutorialWords = [];
    this.init(config);
  }

  init(config) {
    this.letters = config.lvlLetters.split(",");
    const allWordsProperties = config.lvlWords.split("|");

    this.words = allWordsProperties.map((wordProps) => {
      let props = wordProps.split(",");
      return {
        x: Number(props[0]),
        y: Number(props[1]),
        word: props[2],
        direction: props[3],
        length: props[2].length,
      };
    });

    if (config.tutorial) {
      this.hasTutorial = config.tutorial;

      for (let i = 0; i < this.words.length; i++) {
        this.tutorialWords.push(this.words[i].word);
      }
    }
  }

  isCorrectWord(word) {
    return this.words.some((w) => w.word === word);
  }

  getWordData(word) {
    return this.words.find((w) => w.word === word);
  }

  updateTutorialWords(addedWords) {
    addedWords.forEach((word) => {
      if (this.tutorialWords.includes(word)) {
        this.tutorialWords = this.tutorialWords.filter((t) => t !== word);
      }
    });
  }
}
