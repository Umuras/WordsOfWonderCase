import { Container, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "..";

export default class LetterTile extends Container {
  constructor(letter, x, y, game) {
    super();
    this.letter = letter;
    this.selected = false;
    this.game = game;

    this.init();

    this.x = x;
    this.y = y;
    this.interactive = true;
    this.buttonMode = true;
    this.on("pointerdown", () => this.select());
  }

  init() {
    const letterText = new Text(this.letter, {
      fill: 0xf39c12,
      align: "center",
      fontWeight: "bold",
      fontFamily: "GameFont",
      fontSize: 48,
    });
    this.addChild(letterText);
  }

  select() {
    if (!this.selected) {
      this.selected = true;
      this.game.selectLetter(this);
    }
  }
}
