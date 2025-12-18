import { Container, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../index";
const CELL_SIZE = 64;
const SLOT_GAP = 8;

export default class Slot extends Container {
  constructor(gridX, gridY) {
    super();
    this.gridX = gridX;
    this.gridY = gridY;

    this.pixelX = 0;
    this.pixelY = 0;

    this.filled = false;
    this.slotSprite = null;

    this.calculatePixelPosition();
    this.createBackground();
    this.setPosition();
  }

  calculatePixelPosition() {
    this.pixelX = this.gridX * (CELL_SIZE + SLOT_GAP);
    this.pixelY = this.gridY * (CELL_SIZE + SLOT_GAP);
  }

  createBackground() {
    this.slotSprite = Sprite.from("slot");
    this.slotSprite.width = CELL_SIZE;
    this.slotSprite.height = CELL_SIZE;
    this.slotSprite.anchor.set(0.5);
    this.addChild(this.slotSprite);
  }

  setPosition() {
    this.x = this.pixelY;
    this.y = this.pixelX;
  }

  setLetter(letter) {
    if (this.filled) return;

    this.filled = true;

    const text = new Text(letter, {
      fontFamily: "GameFont",
      fontSize: 44,
      fill: 0xffffff,
      align: "center",
      fontWeight: "bold",
    });
    this.slotSprite.tint = 0xf39c12;
    text.anchor.set(0.5);
    this.addChild(text);
  }
}
