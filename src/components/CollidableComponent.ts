import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types/Vector2Type";

interface IPropTypes {
  box: Vector2;
  wallCollision: Vector2;
  collidingIds: number[];
}

export class CollidableComponent extends Component<IPropTypes> {
  static schema = {
    box: { type: Vector2Type },
    wallCollision: { type: Vector2Type },
    collidingIds: { type: Types.Array },
  };
  box: Vector2;
  wallCollision: Vector2;
  collidingIds: number[];
}
