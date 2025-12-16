import { Container } from "pixi.js";
import LetterTile from "./letterTile";

export default class Tray {
  constructor(letters, x, y, game) {
    this.container = new Container();

    this.container.x = x;
    this.container.y = y;

    this.radius = 65;

    this.init(letters, game);
  }

  init(letters, game) {
    const stepAngle = (Math.PI * 2) / letters.length;

    letters.forEach((letter, i) => {
      const angle = i * stepAngle - Math.PI / 2;

      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      const tile = new LetterTile(letter, x, y, game);
      this.container.addChild(tile);
    });
  }
}
