import { System } from "ecsy";
import {
  CanvasContextComponent,
  PositionComponent,
  CollisionBoxComponent,
} from "../components";
import { BoxCollision, VectorMath } from "../utils";

export class CollisionSystem extends System {
  static queries = {
    canvas: { components: [CanvasContextComponent] },
    collidables: { components: [CollisionBoxComponent] },
  };

  execute(): void {
    const canvasEntity = this.queries.canvas.results[0];
    const collidables = this.queries.collidables.results;

    // Get canvas dimensions
    const canvas = canvasEntity.getComponent<CanvasContextComponent>(
      CanvasContextComponent
    );

    collidables.forEach((entity) => {
      // Get entity components
      const collider = entity.getMutableComponent<CollisionBoxComponent>(
        CollisionBoxComponent
      );
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );

      // Clear collisions from past frame
      collider.collidingEntities = [];

      // Check collision against stage Y
      if (position.value.y > canvas.height - collider.box.y) {
        collider.wallCollision.y = 1;
      } else if (position.value.y < 0) {
        collider.wallCollision.y = -1;
      } else {
        collider.wallCollision.y = 0;
      }

      // Check collision against stage X
      if (position.value.x > canvas.width - collider.box.x) {
        collider.wallCollision.x = 1;
      } else if (position.value.x < 0 + collider.box.x) {
        collider.wallCollision.x = -1;
      } else {
        collider.wallCollision.x = 0;
      }

      // Check collision between entities
      collidables
        .filter((b) => b.id != entity.id)
        .forEach((b) => {
          const bCollision = b.getComponent<CollisionBoxComponent>(
            CollisionBoxComponent
          );
          const bPosition = b.getComponent<PositionComponent>(
            PositionComponent
          );

          if (
            BoxCollision.isColliding(
              { dimensions: collider.box, position: position.value },
              { dimensions: bCollision.box, position: bPosition.value }
            )
          ) {
            collider.collidingEntities.push(b);
          }
        });
    });
  }
}
