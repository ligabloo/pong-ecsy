import { createType, copyCopyable, cloneClonable } from "ecsy";

export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy(source: Vector2) {
    this.x = source.x;
    this.y = source.y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}

export const Vector2Type = createType({
  name: "Vector2",
  default: new Vector2(),
  copy: copyCopyable,
  clone: cloneClonable,
});
