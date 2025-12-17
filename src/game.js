import gsap, { Power0 } from "gsap";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import LevelData from "./data/levelData";
import Board from "./game/board";
import WordCircle from "./game/wordCircle";
import Tray from "./game/tray";
import GameOverScreen from "./game/gameOverScreen";
import { Levels } from "./data/levels";

export default class Game extends Container {
  constructor() {
    super();
    this.currentWord = [];
    this.currentLevel = 0;
    this.levelData = new LevelData({
      lvlLetters: Levels[this.currentLevel].letters,
      lvlWords: Levels[this.currentLevel].words,
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
    this.lettersCircle = Sprite.from("circle");
    this.lettersCircle.width = 220;
    this.lettersCircle.height = 220;
    this.lettersCircle.anchor.set(0.5);
    this.lettersCircle.x = GAME_WIDTH * 0.5;
    this.lettersCircle.y = GAME_HEIGHT - 200;
    this.lettersCircle.alpha = 0.6;
    this.addChild(this.lettersCircle);
  }

  createSuffleButton() {
    const shuffleButton = Sprite.from("shuffle");

    shuffleButton.anchor.set(0.5);
    shuffleButton.scale.set(2);

    shuffleButton.x = 0;
    shuffleButton.y = this.lettersCircle.width * 0.5 - 20;

    shuffleButton.eventMode = "static";
    shuffleButton.cursor = "pointer";
    shuffleButton.on("pointerdown", () => this.shuffleLetters());

    this.lettersCircle.addChild(shuffleButton);
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
    this.playButton = Sprite.from("playbutton");
    this.playButton.width = 210;
    this.playButton.height = 60;
    this.playButton.anchor.set(0.5);
    this.playButton.x = GAME_WIDTH * 0.5;
    this.playButton.y = GAME_HEIGHT - 40;

    const text = new Text("PLAY NOW!", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    text.anchor.set(0.5);
    this.playButton.addChild(text);

    gsap.to(this.playButton, {
      pixi: {
        scale: 1,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "easeInOut",
    });

    this.addChild(this.playButton);
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
  }

  onPointerUp() {
    this.isDragging = false;

    const word = this.getCurrentWordString();

    if (word.length < 2) {
      this.resetCurrentWord();
      return;
    }

    if (this.levelData.isCorrectWord(word)) {
      this.onCorrectWord(word);
    } else {
      this.onAlreadyFoundOrWrongWord();
    }
  }

  onPointerMove(event) {
    if (!this.isDragging) return;

    const pos = event.data.getLocalPosition(this);

    this.checkLetterCollison(pos.x, pos.y);
    this.drawLineToPointer(pos.x, pos.y);
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
      if (this.board.addedWords.size === this.levelData.words.length) {
        this.resetCurrentWord();
        this.endGame().then(() => {
          const gameOverScreen = new GameOverScreen("LEVEL COMPLETE");
          this.addChild(gameOverScreen);
        });
      } else {
        this.resetCurrentWord();
      }
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

  endGame() {
    const targets = [this.lettersCircle, this.tray.container];
    const animations = [];

    this.board.slotsList.forEach((slot) => {
      animations.push(
        new Promise((resolve) => {
          gsap.to(slot.scale, {
            x: 0,
            y: 0,
            duration: 0.75,
            ease: "circ.out",
            onComplete: resolve,
          });
        })
      );
    });

    targets.forEach((t) => {
      animations.push(
        new Promise((resolve) => {
          gsap.to(t.scale, {
            x: 0,
            y: 0,
            duration: 0.75,
            ease: "circ.out",
            onComplete: resolve,
          });
        })
      );
    });
    this.playButton.visible = false;

    return Promise.all(animations);
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
