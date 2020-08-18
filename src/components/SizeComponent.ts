import { Component } from "ecsy";
import { Vector2Type, Vector2 } from "../types";

interface IPropTypes {
  value: Vector2;
}

export class SizeComponent extends Component<IPropTypes> {
  static schema = {
    value: { type: Vector2Type },
  };

  value: Vector2;
}
