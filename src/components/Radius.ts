import { Component, Types } from "ecsy";

interface IPropTypes {
  value: number;
}

export class Radius extends Component<IPropTypes> {
  static schema = {
    value: { type: Types.Number },
  };

  value: number;
}
