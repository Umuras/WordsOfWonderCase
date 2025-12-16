export default class LevelData {
  constructor(config) {
    this.letters = [];
    this.words = [];
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
  }

  isCorrectWord(word) {
    return this.words.some((w) => w.word === word);
  }

  getWordData(word) {
    return this.words.find((w) => w.word === word);
  }
}
