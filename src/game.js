import gsap, { Power0 } from "gsap";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import LevelData from "./data/levelData";
import Board from "./game/board";
import WordCircle from "./game/wordCircle";
import Tray from "./game/tray";

export default class Game extends Container {
  constructor() {
    super();
    this.currentWord = [];
    this.levelData = new LevelData({
      lvlLetters: "G,O,D,L",
      lvlWords: "0,0,GOLD,H|0,0,GOD,V|2,0,DOG,H|0,2,LOG,V",
    });
    this.init();

    this.tray = new Tray(
      this.levelData.letters,
      GAME_WIDTH * 0.5,
      GAME_HEIGHT - 200,
      this
    );
    this.wordCircle = new WordCircle();

    this.addChild(this.tray.container);
    this.addChild(this.wordCircle.container);
    this.wordCircle.container.x = GAME_WIDTH * 0.5;
    this.wordCircle.container.y = GAME_HEIGHT * 0.55;

    this.eventMode = "static";
    this.isDragging = false;

    this.line = new Graphics();
    this.addChild(this.line);

    this.on("pointerdown", this.onPointerDown.bind(this));
    this.on("pointerup", this.onPointerUp.bind(this));
    this.on("pointerupoutside", this.onPointerUp.bind(this));
    this.on("pointermove", this.onPointerMove.bind(this));
  }

  init() {
    this.createBackground();
    this.board = new Board(this.levelData);
    this.addChild(this.board);
    this.createLettersCircle();
    this.createSuffleButton();
    this.createPlayButton();
  }

  createBackground() {
    const bg = Sprite.from("background");
    bg.width = GAME_WIDTH;
    bg.height = GAME_HEIGHT;
    bg.anchor.set(0.5);
    bg.scale.set(0.5);
    bg.x = GAME_WIDTH * 0.5;
    bg.y = GAME_HEIGHT * 0.5;
    this.addChild(bg);
  }

  createLettersCircle() {
    const lettersCircle = Sprite.from("circle");
    lettersCircle.width = 220;
    lettersCircle.height = 220;
    lettersCircle.anchor.set(0.5);
    lettersCircle.x = GAME_WIDTH * 0.5;
    lettersCircle.y = GAME_HEIGHT - 200;
    lettersCircle.alpha = 0.6;
    this.addChild(lettersCircle);
  }

  createSuffleButton() {
    const suffleButton = Sprite.from("shuffle");
    suffleButton.width = 40;
    suffleButton.height = 40;
    suffleButton.alpha = 0.8;
    suffleButton.anchor.set(0.5);
    suffleButton.x = GAME_WIDTH * 0.5;
    suffleButton.y = GAME_HEIGHT - 200;
    suffleButton.eventMode = "static";
    suffleButton.cursor = "pointer";

    suffleButton.on("pointerdown", () => this.shuffleLetters());

    this.addChild(suffleButton);
  }

  shuffleLetters() {
    const letters = this.tray.container.children;
    const radius = this.tray.radius;
    const total = letters.length;

    const angles = [];
    for (let i = 0; i < total; i++) {
      angles.push((i * Math.PI * 2) / total - Math.PI / 2);
    }

    for (let i = angles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [angles[i], angles[j]] = [angles[j], angles[i]];
    }

    letters.forEach((tile, i) => {
      const angle = angles[i];
      const newX = Math.cos(angle) * radius;
      const newY = Math.sin(angle) * radius;

      gsap.to(tile, {
        x: newX,
        y: newY,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }

  createPlayButton() {
    const playButton = Sprite.from("playbutton");
    playButton.width = 210;
    playButton.height = 60;
    playButton.anchor.set(0.5);
    playButton.x = GAME_WIDTH * 0.5;
    playButton.y = GAME_HEIGHT - 40;

    const text = new Text("PLAY NOW!", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    text.anchor.set(0.5);
    playButton.addChild(text);

    gsap.to(playButton, {
      pixi: {
        scale: 1,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "easeInOut",
    });

    this.addChild(playButton);
  }

  selectLetter(tile) {
    this.currentWord.push(tile);
    this.wordCircle.update(this.currentWord);
    this.drawLine();
  }

  checkLetterCollison(x, y) {
    this.tray.container.children.forEach((tile) => {
      if (tile.selected) return;

      const bounds = tile.getBounds();

      if (
        x >= bounds.x &&
        x <= bounds.x + bounds.width &&
        y >= bounds.y &&
        y <= bounds.y + bounds.height
      ) {
        tile.select();
      }
    });
  }

  drawLine() {
    this.line.clear();

    if (this.currentWord.length === 0) return;

    this.line.lineStyle(6, 0xf39c12, 1);

    this.currentWord.forEach((tile, index) => {
      const globalPos = tile.getGlobalPosition();

      if (index === 0) {
        this.line.moveTo(globalPos.x, globalPos.y);
      } else {
        this.line.lineTo(globalPos.x, globalPos.y);
      }
    });
  }

  drawLineToPointer(x, y) {
    if (this.currentWord.length === 0) return;

    this.line.clear();
    this.line.lineStyle(6, 0xf39c12, 1);

    this.currentWord.forEach((tile, index) => {
      const globalPos = tile.getGlobalPosition();

      if (index === 0) {
        this.line.moveTo(globalPos.x, globalPos.y);
      } else {
        this.line.lineTo(globalPos.x, globalPos.y);
      }
    });

    this.line.lineTo(x, y);
  }

  onPointerDown(event) {
    this.isDragging = true;

    console.log("pointer down");
  }

  onPointerUp() {
    this.isDragging = false;

    const word = this.getCurrentWordString();
    console.log("Formed word:", word);

    if (word.length < 2) {
      this.resetCurrentWord();
      return;
    }

    if (this.levelData.isCorrectWord(word)) {
      this.onCorrectWord(word);
    } else {
      this.onAlreadyFoundOrWrongWord();
    }
    console.log("pointer up");
  }

  onPointerMove(event) {
    if (!this.isDragging) return;

    const pos = event.data.getLocalPosition(this);

    this.checkLetterCollison(pos.x, pos.y);
    this.drawLineToPointer(pos.x, pos.y);

    console.log("moving");
  }

  getCurrentWordString() {
    return this.currentWord.map((tile) => tile.letter).join("");
  }

  onCorrectWord(word) {
    const wordData = this.levelData.getWordData(word);

    if (!wordData) {
      this.resetCurrentWord();
      return;
    }

    if (this.board.addedWords.has(word)) {
      this.onAlreadyFoundOrWrongWord();
      return;
    }

    this.board.placeWord(wordData, this.wordCircle).then(() => {
      this.resetCurrentWord();
    });
  }

  onAlreadyFoundOrWrongWord() {
    gsap
      .fromTo(
        this.wordCircle.container,
        {
          x: this.wordCircle.container.x - 10,
        },
        {
          x: this.wordCircle.container.x + 10,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
        }
      )
      .then(() => {
        this.resetCurrentWord();
      });
  }

  resetCurrentWord() {
    this.wordCircle.container.x = GAME_WIDTH * 0.5;
    this.currentWord.forEach((tile) => {
      tile.reset();
    });
    this.currentWord = [];
    this.wordCircle.update(this.currentWord);
    this.line.clear();
  }
}
