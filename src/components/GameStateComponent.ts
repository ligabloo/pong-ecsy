import { Component, Types } from "ecsy";

interface IPropTypes {
  player1Points: number;
  player2Points: number;
  pressedKeyCodes: number[];
}

export class GameStateComponent extends Component<IPropTypes> {
  static schema = {
    player1Points: { type: Types.Number },
    player2Points: { type: Types.Number },
    pressedKeyCodes: { type: Types.Array },
  };
  player1Points: number;
  player2Points: number;
  pressedKeyCodes: number[];
}
