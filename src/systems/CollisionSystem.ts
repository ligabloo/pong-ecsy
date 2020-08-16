import { System } from "ecsy";
import {
  CanvasContextComponent,
  PositionComponent,
  CollidableComponent,
} from "../components";
import { BoxCollision } from "../utils";

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

    collidables.forEach((a) => {
      // Get entity components
      const aCollision = a.getMutableComponent<CollidableComponent>(
        CollidableComponent
      );
      const aPosition = a.getMutableComponent<PositionComponent>(
        PositionComponent
      );

      // Clear collisions from past frame
      aCollision.collidingEntities = [];

      // Check collision against stage Y
      if (aPosition.value.y > canvas.height - aCollision.box.y) {
        aCollision.wallCollision.y = 1;
      } else if (aPosition.value.y < 0) {
        aCollision.wallCollision.y = -1;
      } else {
        aCollision.wallCollision.y = 0;
      }

      // Check collision against stage X
      if (aPosition.value.x > canvas.width - aCollision.box.x) {
        aCollision.wallCollision.x = 1;
      } else if (aPosition.value.x < 0 + aCollision.box.x) {
        aCollision.wallCollision.x = -1;
      } else {
        aCollision.wallCollision.x = 0;
      }

      // Check collision between entities
      collidables
        .filter((b) => b.id != a.id)
        .forEach((b) => {
          const bCollision = b.getComponent<CollidableComponent>(
            CollidableComponent
          );
          const bPosition = b.getComponent<PositionComponent>(
            PositionComponent
          );

          if (
            BoxCollision.isColliding(
              { dimensions: aCollision.box, position: aPosition.value },
              { dimensions: bCollision.box, position: bPosition.value }
            )
          ) {
            aCollision.collidingEntities.push(b);
          }
        });
    });
  }
}
