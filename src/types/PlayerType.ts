import { createType, copyCopyable, cloneClonable } from "ecsy";

export class Player {
  element: HTMLElement;
  score: number;

  constructor(element = null, score = 0) {
    this.element = element;
    this.score = score;
  }

  copy(source: Player) {
    this.score = source.score;
    this.element = source.element;
    return this;
  }

  clone() {
    return new Player(this.element, this.score);
  }
}

export const PlayerType = createType({
  name: "Player",
  default: new Player(),
  copy: copyCopyable,
  clone: cloneClonable,
});
