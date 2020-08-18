import { Vector2 } from "../types";

export class VectorMath {
  static add(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y);
  }

  static multiply(a: Vector2, b: Vector2 | number): Vector2 {
    if (b instanceof Vector2) {
      return new Vector2(a.x * b.x, a.y * b.y);
    } else {
      return new Vector2(a.x * b, a.y * b);
    }
  }
}
