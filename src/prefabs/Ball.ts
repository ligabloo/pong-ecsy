import {
  BallComponent,
  CollisionBoxComponent,
  MovementComponent,
  RenderComponent,
  PositionComponent,
  SizeComponent,
} from "../components";
import { World } from "ecsy";
import { Vector2 } from "../types";

export function createBall(
  world: World,
  position: Vector2,
  direction: Vector2,
  radius: number,
  velocity: number
) {
  return world
    .createEntity()
    .addComponent(BallComponent, {
      initialPosition: position,
      initialVelocity: velocity,
    })
    .addComponent(RenderComponent, {
      primitive: "circle",
    })
    .addComponent(MovementComponent, {
      direction,
      velocity,
    })
    .addComponent(PositionComponent, {
      value: position,
    })
    .addComponent(SizeComponent, { value: new Vector2(radius * 2, radius * 2) })
    .addComponent(CollisionBoxComponent);
}
