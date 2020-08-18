import { Vector2 } from "../types";

export class Random {
  static getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  static getMinusOrPlusOne() {
    return Random.getRandomArbitrary(0, 1) < 0.5 ? -1 : 1;
  }

  static getRandomDirection() {
    return new Vector2(Random.getMinusOrPlusOne(), Random.getMinusOrPlusOne());
  }
}
