import { System } from "ecsy";
import {
  PositionComponent,
  CollisionBoxComponent,
  MovementComponent,
  BallComponent,
  GameStateComponent,
  SizeComponent,
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
        CollisionBoxComponent
      >(CollisionBoxComponent);
      const size = entity.getComponent<SizeComponent>(SizeComponent);
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );
      const movement = entity.getMutableComponent<MovementComponent>(
        MovementComponent
      );

      if (collidingEntities.length) {
        // Since we know there will only one colliding paddle at a time,
        // we can simply grab the first element
        const paddle = collidingEntities[0];

        const paddlePosition = paddle.getComponent<PositionComponent>(
          PositionComponent
        );

        const paddleSize = paddle.getComponent<SizeComponent>(SizeComponent);

        movement.direction.x = -movement.direction.x;

        position.value.x =
          paddlePosition.value.x + paddleSize.value.x * movement.direction.x;
      }

      if (wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
        movement.velocity += 0.2;
        position.value.y =
          position.value.y + (size.value.x / 2) * movement.direction.y;
      }

      if (wallCollision.x !== 0) {
        const { initialPosition, initialVelocity } = entity.getComponent<
          BallComponent
        >(BallComponent);
        movement.velocity = initialVelocity;
        position.value = initialPosition;
        movement.direction = new Vector2(
          movement.direction.x,
          Random.getMinusOrPlusOne()
        );

        gameState[wallCollision.x == 1 ? "player1" : "player2"].score++;
        gameState.state = GameState.Waiting;
      }
    });
  }
}
