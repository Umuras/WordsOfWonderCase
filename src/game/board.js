import { Container } from "pixi.js";
import Slot from "./slot";
import gsap from "gsap";
import { GAME_WIDTH } from "..";

export default class Board extends Container {
  constructor(levelData) {
    super();
    this.levelData = levelData;
    this.slots = new Map();
    this.slotsList = new Set();
    this.pivot.x = 100;
    this.x = GAME_WIDTH * 0.5;
    this.y = 120;
    this.drawSlots();
    this.addedWords = new Set();
  }

  drawSlots() {
    for (let w = 0; w < this.levelData.words.length; w++) {
      const wordProps = this.levelData.words[w];
      let gridX;
      let gridY;
      if (wordProps.direction === "V") {
        for (let i = 0; i < wordProps.length; i++) {
          gridX = wordProps.x + i;
          gridY = wordProps.y;

          const slot = this.createSlotIfNotExists(gridX, gridY);
          if (slot) {
            this.addChild(slot);
          } else {
            console.log(`Slot already exists at (${gridX}, ${gridY})`);
          }
        }
      } else {
        for (let i = 0; i < wordProps.length; i++) {
          gridX = wordProps.x;
          gridY = wordProps.y + i;

          const slot = this.createSlotIfNotExists(gridX, gridY);
          if (slot) {
            this.addChild(slot);
          } else {
            console.log(`Slot already exists at (${gridX}, ${gridY})`);
          }
        }
      }
    }
  }

  createSlotIfNotExists(gridX, gridY) {
    const key = `${gridX},${gridY}`;
    if (this.slots.has(key)) {
      return null;
    }
    const slot = new Slot(gridX, gridY);
    this.slots.set(key, slot);
    this.slotsList.add(slot);
    return slot;
  }

  async placeWord(wordData, wordCircle) {
    const { x, y, word, direction } = wordData;
    const { lettersContainer } = wordCircle;
    wordCircle.bgRectangle.clear();
    const animations = [];

    for (let i = 0; i < word.length; i++) {
      const slotX = direction === "V" ? x + i : x;
      const slotY = direction === "H" ? y + i : y;

      const slot = this.slots.get(`${slotX},${slotY}`);
      const letterTiles = lettersContainer.children;
      const targetPos = wordCircle.container.toLocal(slot.getGlobalPosition());

      animations.push(
        this.tweenTo(letterTiles[i], targetPos.x, targetPos.y, 0.6)
      );
    }
    await Promise.all(animations);

    for (let i = 0; i < word.length; i++) {
      const slotX = direction === "V" ? x + i : x;
      const slotY = direction === "H" ? y + i : y;
      const slot = this.slots.get(`${slotX},${slotY}`);
      if (!slot.filled) {
        slot.setLetter(word[i]);
      } else {
        console.log(`Slot at (${slotX}, ${slotY}) is already filled.`);
      }
    }

    this.addedWords.add(word);
  }

  async tweenTo(tile, targetX, targetY, duration) {
    return new Promise((resolve) => {
      gsap.to(tile, {
        x: targetX,
        y: targetY,
        duration: duration,
        onComplete: () => {
          resolve();
        },
      });
    });
  }
}
