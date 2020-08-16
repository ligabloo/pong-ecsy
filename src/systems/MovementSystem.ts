import { System } from "ecsy";
import { CanvasContext, Movement, Position } from "../components";
import { VectorMath } from "../utils";

export class MovementSystem extends System {
  static queries = {
    movable: { components: [Movement, Position] },
  };

  execute(delta: number): void {
    const movables = this.queries.movable.results;

    movables.forEach((entity) => {
      // Get entity movement and position components
      const movement = entity.getMutableComponent<Movement>(Movement);
      const position = entity.getMutableComponent<Position>(Position);

      // If entity movement is not enabled, skip this
      if (!movement.isEnabled) return;

      let appliedMovement = VectorMath.multiply(
        movement.direction,
        movement.velocity
      );
      appliedMovement = VectorMath.multiply(appliedMovement, delta);

      position.value = VectorMath.add(position.value, appliedMovement);
    });
  }
}
