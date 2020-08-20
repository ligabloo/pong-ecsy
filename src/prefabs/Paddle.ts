import { World } from "ecsy";
import {
  CollisionBoxComponent,
  MovementComponent,
  PaddleComponent,
  PositionComponent,
  RenderComponent,
  SizeComponent,
} from "../components";
import { Vector2 } from "../types";

export function createPaddle(
  world: World,
  playerIndex: number,
  position: Vector2,
  direction: Vector2,
  velocity: number,
  size: Vector2
) {
  return world
    .createEntity()
    .addComponent(PaddleComponent, { playerIndex })
    .addComponent(RenderComponent, {
      primitive: "rect",
    })
    .addComponent(MovementComponent, {
      direction,
      velocity,
    })
    .addComponent(PositionComponent, {
      value: position,
    })
    .addComponent(SizeComponent, { value: size })
    .addComponent(CollisionBoxComponent);
}
