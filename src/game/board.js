import { Container } from "pixi.js";
import Slot from "./slot";

export default class Board extends Container {
  constructor(levelData) {
    super();
    this.levelData = levelData;
    this.slots = new Map();
    this.x = 100;
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

          console.log(`For ${wordProps.word}, (${gridX}, ${gridY})`);
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

          console.log(`For ${wordProps.word}, (${gridX}, ${gridY})`);
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
    return slot;
  }

  placeWord(wordData) {
    const { x, y, word, direction } = wordData;

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
}
