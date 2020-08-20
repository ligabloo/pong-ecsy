import { System } from "ecsy";
import {
  CanvasContextComponent,
  PositionComponent,
  CollisionBoxComponent,
  SizeComponent,
} from "../components";
import { BoxCollision, VectorMath } from "../utils";

export class CollisionSystem extends System {
  static queries = {
    canvas: { components: [CanvasContextComponent] },
    collidables: { components: [CollisionBoxComponent, SizeComponent] },
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

      const size = entity.getComponent<SizeComponent>(SizeComponent);

      // Clear collisions from past frame
      collider.collidingEntities = [];

      // Check collision against stage Y
      if (position.value.y > canvas.height - size.value.y) {
        collider.wallCollision.y = 1;
      } else if (position.value.y < 0) {
        collider.wallCollision.y = -1;
      } else {
        collider.wallCollision.y = 0;
      }

      // Check collision against stage X
      if (position.value.x > canvas.width - size.value.x) {
        collider.wallCollision.x = 1;
      } else if (position.value.x < 0) {
        collider.wallCollision.x = -1;
      } else {
        collider.wallCollision.x = 0;
      }

      // Check collision between entities
      collidables
        .filter((b) => b.id != entity.id)
        .forEach((b) => {
          const collidingSize = b.getComponent<SizeComponent>(SizeComponent);
          const collidingPosition = b.getComponent<PositionComponent>(
            PositionComponent
          );

          if (
            BoxCollision.isColliding(
              { dimensions: size.value, position: position.value },
              {
                dimensions: collidingSize.value,
                position: collidingPosition.value,
              }
            )
          ) {
            collider.collidingEntities.push(b);
          }
        });
    });
  }
}
