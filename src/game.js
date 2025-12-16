import gsap, { Power0 } from "gsap";
import { Container, Sprite, Text } from "pixi.js";
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

    this.tray = new Tray(this.levelData.letters, 185, 572, this);
    this.wordCircle = new WordCircle();

    this.addChild(this.tray.container);
    this.addChild(this.wordCircle.container);
    this.wordCircle.container.x = GAME_WIDTH * 0.5;
    this.wordCircle.container.y = GAME_HEIGHT * 0.55;

    this.eventMode = "static";
    this.isDragging = false;

    this.on("pointerdown", this.onPointerDown.bind(this));
    this.on("pointerup", this.onPointerUp.bind(this));
    this.on("pointerupoutside", this.onPointerUp.bind(this));
    this.on("pointermove", this.onPointerMove.bind(this));
  }

  onPointerDown(event) {
    this.isDragging = true;

    console.log("pointer down");
  }

  onPointerUp() {
    this.isDragging = false;

    this.currentWord.forEach((tile) => {
      tile.selected = false;
    });

    this.currentWord = [];
    this.wordCircle.update(this.currentWord);
    console.log("pointer up");
  }

  onPointerMove(event) {
    if (!this.isDragging) return;

    const pos = event.data.getLocalPosition(this);

    this.checkLetterCollison(pos.x, pos.y);

    console.log("moving");
  }

  init() {
    this.createBackground();
    let board = new Board(this.levelData);
    this.addChild(board);
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
    const suffleButton = Sprite.from("suffle");
    suffleButton.width = 40;
    suffleButton.height = 40;
    suffleButton.alpha = 0.8;
    suffleButton.anchor.set(0.5);
    suffleButton.x = GAME_WIDTH * 0.5;
    suffleButton.y = GAME_HEIGHT - 200;
    this.addChild(suffleButton);
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
}
