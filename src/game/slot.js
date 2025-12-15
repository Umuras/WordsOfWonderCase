import { Container, Sprite } from "pixi.js";
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

    this.calculatePixelPosition();
    this.createBackground();
    this.setPosition();
  }

  calculatePixelPosition() {
    this.pixelX = this.gridX * (CELL_SIZE + SLOT_GAP);
    this.pixelY = this.gridY * (CELL_SIZE + SLOT_GAP);
  }

  createBackground() {
    let slotSprite = Sprite.from("slot_empty");
    slotSprite.width = CELL_SIZE;
    slotSprite.height = CELL_SIZE;
    slotSprite.anchor.set(0.5);
    console.log("slotSprite", slotSprite);
    this.addChild(slotSprite);
  }

  setPosition() {
    this.x = this.pixelY;
    this.y = this.pixelX;
  }
}
