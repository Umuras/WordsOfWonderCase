import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "..";
import gsap from "gsap";

export default class LetterTile extends Container {
  constructor(letter, x, y, game) {
    super();
    this.letter = letter;
    this.selected = false;
    this.game = game;

    this.bgCircle = null;

    this.init();

    this.x = x;
    this.y = y;

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => this.select());
  }

  init() {
    this.letterText = new Text(this.letter, {
      fill: 0xf39c12,
      align: "center",
      fontWeight: "bold",
      fontFamily: "GameFont",
      fontSize: 48,
    });
    this.letterText.anchor.set(0.5);

    this.letterText.x = 0;
    this.letterText.y = 0;
    this.addChild(this.letterText);
  }

  select() {
    if (this.selected) return;

    this.selected = true;

    this.createBackgroundCircle();
    this.letterText.style.fill = 0xffffff;

    this.game.selectLetter(this);
  }

  createBackgroundCircle() {
    this.bgCircle = new Graphics();

    this.bgCircle.beginFill(0xf39c12);
    this.bgCircle.drawCircle(0, 0, 36);
    this.bgCircle.endFill();

    this.addChildAt(this.bgCircle, 0);
  }

  reset() {
    this.selected = false;

    if (this.bgCircle) {
      this.removeChild(this.bgCircle);
      this.bgCircle.destroy();
      this.bgCircle = null;
    }
    this.letterText.style.fill = 0xf39c12;
  }
}
