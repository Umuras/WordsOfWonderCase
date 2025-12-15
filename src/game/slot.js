import { Container, Sprite } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../index";
const CELL_SIZE = 72;

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
    this.pixelX = this.gridX * CELL_SIZE;
    this.pixelY = this.gridY * CELL_SIZE;
  }

  createBackground() {
    let slotSprite = Sprite.from("slot_empty");
    slotSprite.width = CELL_SIZE;
    slotSprite.height = CELL_SIZE;
    slotSprite.anchor.set(0.5);
    slotSprite.x = CELL_SIZE / 2 + 20;
    slotSprite.y = CELL_SIZE / 2 + 10;
    console.log("slotSprite", slotSprite);
    this.addChild(slotSprite);
  }

  setPosition() {
    this.x = this.pixelY;
    this.y = this.pixelX;
  }
}
