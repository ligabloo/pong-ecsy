import { Vector2 } from "../types";

interface IBoxStruct {
  position: Vector2;
  dimensions: Vector2;
}

export class BoxCollision {
  static isColliding(boxA: IBoxStruct, boxB: IBoxStruct): boolean {
    return (
      boxA.position.x < boxB.position.x + boxB.dimensions.x &&
      boxA.position.x + boxA.dimensions.x > boxB.position.x &&
      boxA.position.y < boxB.position.y + boxB.dimensions.y &&
      boxA.position.y + boxA.dimensions.y > boxB.position.y
    );
  }
}
