import { Container, Sprite, Text } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "..";
import gsap from "gsap";

export default class GameOverScreen extends Container {
  constructor(text) {
    super();
    this.createTitle(text);
    this.createGlobe();
    this.createPlayButton();
  }

  createTitle(textValue) {
    const title = new Text(textValue, {
      fontFamily: "GameFont",
      fontSize: 42,
      fill: 0xffffff,
      fontWeight: "bold",
    });

    title.x = GAME_WIDTH * 0.5;
    title.y = 120;
    title.anchor.set(0.5);

    this.addChild(title);
  }

  createGlobe() {
    const globe = Sprite.from("globe");

    globe.anchor.set(0.5);
    globe.x = GAME_WIDTH * 0.5;
    globe.y = GAME_HEIGHT * 0.5;

    globe.scale.set(0.35);

    this.addChild(globe);
  }

  createPlayButton() {
    const playButton = Sprite.from("playbutton");
    playButton.width = 210;
    playButton.height = 60;
    playButton.anchor.set(0.5);
    playButton.x = GAME_WIDTH * 0.5;
    playButton.y = GAME_HEIGHT - 200;

    const text = new Text("PLAY NOW!", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    text.anchor.set(0.5);
    playButton.addChild(text);

    gsap.to(playButton, {
      pixi: {
        scale: 1,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "easeInOut",
    });

    this.addChild(playButton);
  }
}
