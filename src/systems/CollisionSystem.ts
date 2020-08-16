import { System } from "ecsy";
import { CanvasContext, Position, Collidable, Movement } from "../components";
import { VectorMath } from "../utils";

export class CollisionSystem extends System {
  static queries = {
    canvas: { components: [CanvasContext] },
    collidables: { components: [Collidable] },
  };

  execute(): void {
    const canvasEntity = this.queries.canvas.results[0];
    const collidables = this.queries.collidables.results;

    // Get canvas dimensions
    const canvas = canvasEntity.getComponent<CanvasContext>(CanvasContext);

    collidables.forEach((entity) => {
      // Get entity components
      const collision = entity.getMutableComponent<Collidable>(Collidable);
      const position = entity.getMutableComponent<Position>(Position);

      // Check collision against stage Y
      if (position.value.y > canvas.height - collision.box.y) {
        collision.wallCollision.y = 1;
      } else if (position.value.y < 0 + collision.box.y) {
        collision.wallCollision.y = -1;
      } else {
        collision.wallCollision.y = 0;
      }

      // Check collision against stage X
      if (position.value.x > canvas.width - collision.box.x) {
        collision.wallCollision.x = 1;
      } else if (position.value.x < 0 + collision.box.x) {
        collision.wallCollision.x = -1;
      } else {
        collision.wallCollision.x = 0;
      }

      // TODO: Check collision between entities
    });
  }
}
