import { System } from "ecsy";
import {
  MovementComponent,
  PositionComponent,
  GameStateComponent,
} from "../components";
import { VectorMath } from "../utils";
import { GameState } from "../types/enums";

export class MovementSystem extends System {
  static queries = {
    gameState: { components: [GameStateComponent] },
    movable: { components: [MovementComponent, PositionComponent] },
  };

  execute(): void {
    const gameStateEntity = this.queries.gameState.results[0];
    const movables = this.queries.movable.results;

    const gameState = gameStateEntity.getComponent<GameStateComponent>(
      GameStateComponent
    );

    // If gamestate is not Running, skip movement logic
    if (gameState.state != GameState.Running) return;

    movables.forEach((entity) => {
      // Get entity movement and position components
      const movement = entity.getMutableComponent<MovementComponent>(
        MovementComponent
      );
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );

      // If entity movement is not enabled, skip this
      if (!movement.isEnabled) return;

      let appliedMovement = VectorMath.multiply(
        movement.direction,
        movement.velocity
      );

      position.value = VectorMath.add(position.value, appliedMovement);
    });
  }
}
