import { Vector2 } from "./types/Vector2Type";

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function getMinusOrPlusOne() {
  return getRandomArbitrary(0, 1) < 0.5 ? -1 : 1;
}

export function getRandomDirection() {
  return new Vector2(getMinusOrPlusOne(), getMinusOrPlusOne());
}
