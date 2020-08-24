import { System } from "ecsy";
import { GameStateComponent } from "../components";
import { GameState, PlayerSchemeKeys } from "../types/enums";

export class GameSystem extends System {
  static queries = {
    gameState: {
      components: [GameStateComponent],
      listen: { added: true },
    },
  };

  execute(): void {
    const addedEntity = this.queries.gameState.added[0];

    if (addedEntity) {
      const { player1, player2 } = addedEntity.getMutableComponent<
        GameStateComponent
      >(GameStateComponent);

      player1.element = document.querySelector('[data-player="1"]');
      player2.element = document.querySelector('[data-player="2"]');

      return;
    }

    const entity = this.queries.gameState.results[0];

    const gameState = entity.getMutableComponent<GameStateComponent>(
      GameStateComponent
    );

    const stateSystems = {
      [GameState.Waiting]: this.waitingState,
      [GameState.Running]: this.runningState,
    };

    stateSystems[gameState.state](gameState);
  }

  waitingState(gameState: GameStateComponent) {
    const { player1, player2 } = gameState;
    player1.element.innerText = `${player1.score}`;
    player2.element.innerText = `${player2.score}`;

    const playerSchemeKeys = [
      PlayerSchemeKeys.ArrowUp,
      PlayerSchemeKeys.ArrowDown,
      PlayerSchemeKeys.W,
      PlayerSchemeKeys.S,
    ];

    if (
      playerSchemeKeys.some((keyCode) =>
        gameState.pressedKeyCodes.includes(keyCode)
      )
    ) {
      gameState.state = GameState.Running;
    }
  }

  runningState(gameState: GameStateComponent) {}
}
