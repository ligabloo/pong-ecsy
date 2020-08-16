import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types/Vector2Type";

interface IPropTypes {
  box: Vector2;
  wallCollision: Vector2;
}

export class Collidable extends Component<IPropTypes> {
  static schema = {
    box: { type: Vector2Type, default: new Vector2() },
    wallCollision: { type: Vector2Type, default: new Vector2() },
  };
  box: Vector2;
  wallCollision: Vector2;
}
