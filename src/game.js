import gsap, { Power0 } from "gsap";
import { Container, Sprite } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import LevelData from "./data/levelData";

export default class Game extends Container {
  constructor() {
    super();
    this.levelData = new LevelData({
      lvlLetters: "G,O,D,L",
      lvlWords: "0,0,GOLD,H|0,0,GOD,V|2,0,DOG,H|0,2,LOG,V",
    });
    this.init();
  }

  init() {
    let sprite = Sprite.from("logo");
    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    this.addChild(sprite);
    sprite.x = GAME_WIDTH * 0.5;
    sprite.y = GAME_HEIGHT * 0.5;

    gsap.to(sprite, {
      pixi: {
        scale: 0.6,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut",
    });
  }
}
