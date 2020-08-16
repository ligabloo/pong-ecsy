import { System } from "ecsy";
import {
  CanvasContextComponent,
  PositionComponent,
  CollidableComponent,
  MovementComponent,
  BallComponent,
  RadiusComponent,
} from "../components";

export class BallSystem extends System {
  static queries = {
    canvas: { components: [CanvasContextComponent] },
    balls: { components: [BallComponent] },
  };

  execute(): void {
    const balls = this.queries.balls.results;

    balls.forEach((entity) => {
      // Get entity components
      const collision = entity.getComponent<CollidableComponent>(
        CollidableComponent
      );
      const radius = entity.getComponent<RadiusComponent>(RadiusComponent);
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );
      const movement = entity.getMutableComponent<MovementComponent>(
        MovementComponent
      );

      if (collision.wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
        movement.velocity += 0.3;
        position.value.y =
          position.value.y + (radius.value / 2) * movement.direction.y;
      }

      if (collision.wallCollision.x !== 0) {
        movement.direction.x = -movement.direction.x;
        position.value.x =
          position.value.x + (radius.value / 2) * movement.direction.x;
      }

      if (collision.collidingIds.length) {
        movement.direction.x = -movement.direction.x;
      }
    });
  }
}
