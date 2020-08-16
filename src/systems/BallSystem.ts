import { System } from "ecsy";
import {
  CanvasContext,
  Position,
  Collidable,
  Movement,
  Ball,
  Radius,
} from "../components";

export class BallSystem extends System {
  static queries = {
    canvas: { components: [CanvasContext] },
    balls: { components: [Ball] },
  };

  execute(): void {
    const balls = this.queries.balls.results;

    balls.forEach((entity) => {
      // Get entity components
      const collision = entity.getComponent<Collidable>(Collidable);
      const movement = entity.getMutableComponent<Movement>(Movement);

      if (collision.wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
      }

      if (collision.wallCollision.x !== 0) {
        movement.direction.x = -movement.direction.x;
      }
    });
  }
}
