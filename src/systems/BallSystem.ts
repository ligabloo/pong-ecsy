import { System } from "ecsy";
import {
  Ball,
  Paddle,
  CanvasContext,
  Movement,
  Position,
  Radius,
  Size,
} from "../components";
import { Vector2 } from "../types/Vector2Type";
import { getRandomDirection } from "../utils";

export class BallSystem extends System {
  static queries = {
    canvas: { components: [CanvasContext] },
    ball: { components: [Ball] },
    paddles: { components: [Paddle] },
  };

  execute(delta: number, time: number): void {
    const canvasEntity = this.queries.canvas.results[0];
    const balls = this.queries.ball.results;
    const paddles = this.queries.paddles.results;

    // Get canvas dimensions
    const canvas = canvasEntity.getComponent<CanvasContext>(CanvasContext);

    balls.forEach((ball) => {
      // Get Ball movement and position components
      const movement = ball.getMutableComponent<Movement>(Movement);
      const position = ball.getMutableComponent<Position>(Position);
      const radius = ball.getComponent<Radius>(Radius);

      // If ball movement is not enabled, skip this
      if (!movement.isEnabled) return;

      // If the ball collides with ceilings, invert Y direction
      if (
        position.value.y < radius.value ||
        position.value.y > canvas.height - radius.value
      ) {
        movement.direction.y = -movement.direction.y;
        position.value.y += movement.direction.y;
      }

      // If the ball collides with the side walls, reset ball position
      if (
        position.value.x < radius.value ||
        position.value.x > canvas.width - radius.value
      ) {
        position.value = new Vector2(canvas.width / 2, canvas.height / 2);
        movement.direction = getRandomDirection();
      }

      const appliedMovement = movement.direction
        .clone()
        .multiplyByNumber(movement.velocity)
        .multiplyByNumber(delta);

      position.value.add(appliedMovement);
    });
  }
}
