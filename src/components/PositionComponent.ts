import { Component } from "ecsy";
import { Vector2, Vector2Type } from "../types/Vector2Type";

interface IPropTypes {
  value: Vector2;
}

export class PositionComponent extends Component<IPropTypes> {
  static schema = {
    value: { type: Vector2Type },
  };

  value: Vector2;
}
