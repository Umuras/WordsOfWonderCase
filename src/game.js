import gsap, { Power0 } from "gsap";
import { Container, Sprite } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import LevelData from "./data/levelData";
import Board from "./game/board";

export default class Game extends Container {
  constructor() {
    super();
    this.levelData = new LevelData({
      lvlLetters: "G,O,D,L",
      lvlWords: "0,0,GOLD,H|0,0,GOD,V|2,0,DOG,H|0,2,LOG,V",
    });
    this.initBackground();
    this.init();
  }

  initBackground() {
    const bg = Sprite.from("background");
    bg.width = GAME_WIDTH;
    bg.height = GAME_HEIGHT;
    bg.anchor.set(0.5);
    bg.scale.set(0.5);
    bg.x = GAME_WIDTH * 0.5;
    bg.y = GAME_HEIGHT * 0.5;
    this.addChild(bg);
  }

  init() {
    let board = new Board(this.levelData);
    this.addChild(board);
  }
}
