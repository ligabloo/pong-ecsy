import { System } from "ecsy";
import {
  CollisionBoxComponent,
  MovementComponent,
  PaddleComponent,
  GameStateComponent,
} from "../components";

import { PlayerSchemeKeys } from "../types/enums";

export class PaddleSystem extends System {
  static queries = {
    paddles: { components: [PaddleComponent] },
    gameState: { components: [GameStateComponent] },
  };

  playersControlSchemes = {
    0: {
      up: PlayerSchemeKeys.W,
      down: PlayerSchemeKeys.S,
    },
    1: {
      up: PlayerSchemeKeys.ArrowUp,
      down: PlayerSchemeKeys.ArrowDown,
    },
  };

  execute(): void {
    const paddles = this.queries.paddles.results;
    const gameStateEntity = this.queries.gameState.results[0];
    const gameState = gameStateEntity.getComponent<GameStateComponent>(
      GameStateComponent
    );

    paddles.forEach((entity) => {
      // Get entity components
      const paddle = entity.getComponent<PaddleComponent>(PaddleComponent);
      const movement = entity.getMutableComponent<MovementComponent>(
        MovementComponent
      );
      const collision = entity.getComponent<CollisionBoxComponent>(
        CollisionBoxComponent
      );

      // Get control scheme according to player index
      const paddleControlScheme = this.playersControlSchemes[
        paddle.playerIndex
      ];

      // Reset movement to 0;
      movement.direction.y = 0;

      // Check for up/down movement
      if (
        gameState.pressedKeyCodes.includes(paddleControlScheme.up) &&
        collision.wallCollision.y != -1
      )
        movement.direction.y -= 1;

      if (
        gameState.pressedKeyCodes.includes(paddleControlScheme.down) &&
        collision.wallCollision.y != 1
      )
        movement.direction.y += 1;
    });
  }
}
