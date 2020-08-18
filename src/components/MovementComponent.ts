import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types";

interface IPropTypes {
  direction: Vector2;
  velocity: number;
  isEnabled: boolean;
}

export class MovementComponent extends Component<IPropTypes> {
  static schema = {
    direction: { type: Vector2Type },
    velocity: { type: Types.Number },
    isEnabled: { type: Types.Boolean, default: true },
  };

  direction: Vector2;
  velocity: number;
  isEnabled: boolean;
}
