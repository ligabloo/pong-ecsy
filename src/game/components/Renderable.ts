import { Component, Types } from "ecsy";
import { Vector2, Vector2Type } from "../types/Vector2Type";

interface IPropTypes {
  primitive: string;
  position: Vector2;
  isEnabled: boolean;
}

export class Renderable extends Component<IPropTypes> {
  static schema = {
    primitive: { type: Types.String, default: "box" },
    position: { type: Vector2Type, default: new Vector2() },
    isEnabled: { type: Types.Boolean, default: true },
  };

  primitive: string;
  position: Vector2;
  isEnabled: boolean;
}
