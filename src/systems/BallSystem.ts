import { System } from "ecsy";
import {
  PositionComponent,
  CollidableComponent,
  MovementComponent,
  BallComponent,
  RadiusComponent,
  GameStateComponent,
} from "../components";
import { Random } from "../utils";
import { Vector2 } from "../types";
import { GameState } from "../types/enums";

export class BallSystem extends System {
  static queries = {
    gameState: { components: [GameStateComponent] },
    balls: { components: [BallComponent] },
  };

  execute(): void {
    const gameStateEntity = this.queries.gameState.results[0];
    const balls = this.queries.balls.results;

    const gameState = gameStateEntity.getMutableComponent<GameStateComponent>(
      GameStateComponent
    );

    balls.forEach((entity) => {
      // Get entity components
      const { wallCollision, collidingEntities } = entity.getComponent<
        CollidableComponent
      >(CollidableComponent);
      const radius = entity.getComponent<RadiusComponent>(RadiusComponent);
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );
      const movement = entity.getMutableComponent<MovementComponent>(
        MovementComponent
      );

      if (wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
        movement.velocity += 0.2;
        position.value.y =
          position.value.y + (radius.value / 2) * movement.direction.y;
      }

      if (wallCollision.x !== 0) {
        const { initialPosition, initialVelocity } = entity.getComponent<
          BallComponent
        >(BallComponent);
        position.value = initialPosition;
        movement.velocity = initialVelocity;
        movement.direction = new Vector2(
          movement.direction.x,
          Random.getMinusOrPlusOne()
        );

        gameState[wallCollision.x == 1 ? "player1" : "player2"].score++;
        gameState.state = GameState.Waiting;
      }

      if (collidingEntities.length) {
        movement.direction.x = -movement.direction.x;
        position.value.x =
          position.value.x + (radius.value / 2) * movement.direction.x;
      }
    });
  }
}
