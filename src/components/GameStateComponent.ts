import { Component, Types } from "ecsy";
import { GameState } from "../types/enums";
import { Player, PlayerType } from "../types";

interface IPropTypes {
  state: GameState;
  player1: Player;
  player2: Player;
  pressedKeyCodes: number[];
}

export class GameStateComponent extends Component<IPropTypes> {
  static schema = {
    state: { type: Types.Number, default: GameState.Waiting },
    player1: { type: PlayerType },
    player2: { type: PlayerType },
    pressedKeyCodes: { type: Types.Array },
  };

  state: GameState;
  player1: Player;
  player2: Player;
  pressedKeyCodes: number[];
}
