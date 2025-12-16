import gsap from "gsap";
import * as PIXI from "pixi.js";

export default class WordCircle {
  constructor() {
    this.container = new PIXI.Container();

    this.bgRectangle = new PIXI.Graphics();
    this.lettersContainer = new PIXI.Container();

    this.container.addChild(this.bgRectangle);
    this.container.addChild(this.lettersContainer);
  }

  update(currentWord) {
    this.clear();
    if (currentWord.length === 0) return;

    this.drawLetters(currentWord);
    this.drawBackground(currentWord.length);
    this.animateIn();
  }

  clear() {
    this.bgRectangle.clear();
    this.lettersContainer.removeChildren();
  }

  drawLetters(currentWord) {
    currentWord.forEach((tile, index) => {
      const letterText = new PIXI.Text(tile.letter, {
        fontSize: 44,
        fill: 0xffffff,
        fontWeight: "bold",
      });

      letterText.anchor.set(0.5);

      letterText.x = index * 32;
      letterText.y = 0;

      this.lettersContainer.addChild(letterText);
    });
    this.container.pivot.x = this.container.width / 2;
  }

  drawBackground() {
    const paddingX = 20;
    const paddingY = 12;

    const bounds = this.lettersContainer.getLocalBounds();

    this.bgRectangle.beginFill(0xf36c12);
    this.bgRectangle.drawRoundedRect(
      bounds.x - paddingX,
      bounds.y - paddingY,
      bounds.width + paddingX * 2,
      bounds.height + paddingY * 2,
      20
    );
    this.bgRectangle.endFill();
  }

  animateIn() {
    this.container.scale.set(0.85);
    gsap.to(this.container.scale, {
      x: 1,
      y: 1,
      duration: 0.15,
      ease: "back.out(2)",
    });
  }
}
