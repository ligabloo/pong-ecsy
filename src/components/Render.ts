import { Component, Types } from "ecsy";

interface IPropTypes {
  primitive: string;
  isEnabled: boolean;
}

export class Render extends Component<IPropTypes> {
  static schema = {
    primitive: { type: Types.String, default: "box" },
    isEnabled: { type: Types.Boolean, default: true },
  };

  primitive: string;
  isEnabled: boolean;
}
