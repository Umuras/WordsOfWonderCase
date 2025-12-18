import gsap from "gsap";
import { Container, Graphics, Text } from "pixi.js";
import { GAME_WIDTH } from "..";
import TutorialHand from "./tutorialHand";

export default class TutorialController extends Container {
  constructor(game) {
    super();
    this.game = game;

    this.isRunning = false;
    this.words = [];
    this.wordIndex = 0;
    this.fakeCount = 0;
    this.maxFake = 2;
  }

  start(words) {
    if (this.isRunning || words.length === 0) return;

    this.isRunning = true;
    this.words = words;
    this.wordIndex = 0;
    this.fakeCount = 0;

    this.createHand();
    this.runCurrentWord();
  }

  stop() {
    this.isRunning = false;
    gsap.killTweensOf(this.hand);
    gsap.killTweensOf(this);
    this.removeChildren();
  }

  createHand() {
    this.hand = new TutorialHand();
    this.addChild(this.hand);
  }

  createHintUI(word) {
    if (this.hint) {
      this.hint.destroy();
    }

    const bg = new Graphics()
      .beginFill(0x2ecc71, 0.9)
      .drawRoundedRect(-160, -25, 320, 50, 12)
      .endFill();

    const text = new Text(`Connect the letters ${word}`, {
      fill: 0xffffff,
      fontSize: 18,
      fontWeight: "bold",
      align: "center",
    });

    text.anchor.set(0.5);

    this.hint = new Container();
    this.hint.addChild(bg, text);

    this.hint.x = GAME_WIDTH * 0.5;
    this.hint.y = this.game.board.y + this.game.board.height + 40;

    this.addChild(this.hint);
  }

  async runCurrentWord() {
    if (!this.isRunning) return;

    const word = this.words[this.wordIndex];
    this.createHintUI(word);

    const letters = this.game.tray.getTilesByWord(word);

    await this.fakeDraw(letters);
    this.fakeCount++;

    if (this.fakeCount < this.maxFake) {
      return this.runCurrentWord();
    }

    await gsap.to({}, { duration: 1 });

    this.game.forceCreateWord(word);

    this.fakeCount = 0;
    this.wordIndex++;

    if (this.wordIndex < this.words.length) {
      this.hint?.destroy();
      await gsap.to(
        {},
        {
          duration: 3,
          onComplete: () => {
            this.runCurrentWord();
          },
        }
      );
    } else {
      this.stop();
    }
  }

  async fakeDraw(letters) {
    this.hand.reset();

    for (const letter of letters) {
      if (!this.isRunning) return;
      const pos = letter.getGlobalPosition();
      await this.hand.moveTo(pos.x, pos.y);
    }

    await this.hand.fadeOut();
  }
}
