import {
  BallComponent,
  CollidableComponent,
  MovementComponent,
  RenderComponent,
  PositionComponent,
  RadiusComponent,
} from "../components";
import { World } from "ecsy";
import { Vector2 } from "../types/Vector2Type";

export function createBall(
  world: World,
  position: Vector2,
  direction: Vector2,
  velocity: number,
  radius: number
) {
  return world
    .createEntity()
    .addComponent(BallComponent)
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
    .addComponent(RadiusComponent, { value: radius })
    .addComponent(CollidableComponent, { box: new Vector2(10, 10) });
}
