import * as PIXI from "pixi.js";

export default class WordCircle {
  constructor() {
    this.container = new PIXI.Container();
  }

  update(currentWord) {
    this.container.removeChildren();

    currentWord.forEach((tile, index) => {
      const letterSprite = new PIXI.Text(tile.letter, {
        fontSize: 44,
        fill: 0xffffff,
        fontWeight: "bold",
      });

      letterSprite.anchor.set(0.5);

      letterSprite.x = index * 32;
      letterSprite.y = 0;

      this.container.addChild(letterSprite);
    });

    this.container.pivot.x = this.container.width / 2;
  }
}
