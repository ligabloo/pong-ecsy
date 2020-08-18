import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types";

interface IPropTypes {
  initialPosition: Vector2;
  initialVelocity: number;
}

export class BallComponent extends Component<IPropTypes> {
  static schema = {
    initialPosition: { type: Vector2Type },
    initialVelocity: { type: Types.Number },
  };

  initialPosition: Vector2;
  initialVelocity: number;
}
