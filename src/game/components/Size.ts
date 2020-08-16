import { Component } from "ecsy";
import { Vector2Type, Vector2 } from "../types/Vector2Type";

interface IPropTypes {
  value: Vector2;
}

export class Size extends Component<IPropTypes> {
  static schema = {
    value: { type: Vector2Type, default: new Vector2() },
  };

  value: Vector2;
}
