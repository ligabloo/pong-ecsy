import { Component, Types, Entity } from "ecsy";
import { Vector2, Vector2Type } from "../types";

interface IPropTypes {
  wallCollision: Vector2;
  collidingEntities: Entity[];
}

export class CollisionBoxComponent extends Component<IPropTypes> {
  static schema = {
    wallCollision: { type: Vector2Type },
    collidingEntities: { type: Types.Array },
  };
  wallCollision: Vector2;
  collidingEntities: Entity[];
}
