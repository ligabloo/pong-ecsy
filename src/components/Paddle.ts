import { Component, Types } from "ecsy";

interface IPropTypes {
  playerIndex: number;
}

export class Paddle extends Component<IPropTypes> {
  static schema = {
    playerIndex: { type: Types.Number },
  };

  playerIndex: number;
}
