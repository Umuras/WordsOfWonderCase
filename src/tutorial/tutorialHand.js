import gsap from "gsap";
import { Container, Sprite } from "pixi.js";

export default class TutorialHand extends Container {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.handSprite = Sprite.from("hand");
    this.handSprite.anchor.set(0.2, 0.1);
    this.handSprite.scale.set(0.45);

    this.addChild(this.handSprite);

    this.alpha = 0;
  }

  async moveTo(x, y) {
    return gsap.to(this, {
      x,
      y,
      alpha: 1,
      duration: 1,
      ease: "power2.out",
    });
  }

  fadeOut() {
    return gsap.to(this.scale, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }

  reset() {
    gsap.killTweensOf(this);
    this.alpha = 0;
    this.scale.set(1);
  }
}
