import { System } from "ecsy";
import {
  CanvasContextComponent,
  PositionComponent,
  CollidableComponent,
} from "../components";
import { BoxCollision, VectorMath } from "../utils";

export class CollisionSystem extends System {
  static queries = {
    canvas: { components: [CanvasContextComponent] },
    collidables: { components: [CollidableComponent] },
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
      const collider = entity.getMutableComponent<CollidableComponent>(
        CollidableComponent
      );
      const position = entity.getMutableComponent<PositionComponent>(
        PositionComponent
      );

      const colliderPosition = VectorMath.add(
        position.value,
        collider.originOffset
      );

      // Clear collisions from past frame
      collider.collidingEntities = [];

      // Check collision against stage Y
      if (colliderPosition.y > canvas.height - collider.box.y) {
        collider.wallCollision.y = 1;
      } else if (colliderPosition.y < 0) {
        collider.wallCollision.y = -1;
      } else {
        collider.wallCollision.y = 0;
      }

      // Check collision against stage X
      if (colliderPosition.x > canvas.width - collider.box.x) {
        collider.wallCollision.x = 1;
      } else if (colliderPosition.x < 0 + collider.box.x) {
        collider.wallCollision.x = -1;
      } else {
        collider.wallCollision.x = 0;
      }

      // Check collision between entities
      collidables
        .filter((b) => b.id != entity.id)
        .forEach((b) => {
          const bCollision = b.getComponent<CollidableComponent>(
            CollidableComponent
          );
          const bPosition = b.getComponent<PositionComponent>(
            PositionComponent
          );

          const bColliderPosition = VectorMath.add(
            bPosition.value,
            bCollision.originOffset
          );

          if (
            BoxCollision.isColliding(
              { dimensions: collider.box, position: colliderPosition },
              { dimensions: bCollision.box, position: bColliderPosition }
            )
          ) {
            collider.collidingEntities.push(b);
          }
        });
    });
  }
}
