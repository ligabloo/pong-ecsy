import { Component, Types } from "ecsy";

interface IPropTypes {
  playerIndex: number;
}

export class PaddleComponent extends Component<IPropTypes> {
  static schema = {
    playerIndex: { type: Types.Number },
  };

  playerIndex: number;
}
