import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types/Vector2Type";

interface IPropTypes {
  direction: Vector2;
  velocity: number;
  isEnabled: boolean;
}

export class Movement extends Component<IPropTypes> {
  static schema = {
    direction: { type: Vector2Type, default: new Vector2() },
    velocity: { type: Types.Number, default: 0 },
    isEnabled: { type: Types.Boolean, default: true },
  };

  direction: Vector2;
  velocity: number;
  isEnabled: boolean;
}
