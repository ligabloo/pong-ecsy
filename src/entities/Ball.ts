import {
  Ball,
  Collidable,
  Movement,
  Render,
  Position,
  Radius,
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
    .addComponent(Ball)
    .addComponent(Render, {
      primitive: "circle",
    })
    .addComponent(Movement, {
      direction,
      velocity,
    })
    .addComponent(Position, {
      value: position,
    })
    .addComponent(Radius, { value: radius })
    .addComponent(Collidable, { box: new Vector2(10, 10) });
}
