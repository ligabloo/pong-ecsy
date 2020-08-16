import { World } from "ecsy";
import {
  Collidable,
  Movement,
  Paddle,
  Position,
  Render,
  Size,
} from "../components";
import { Vector2 } from "../types/Vector2Type";

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
    .addComponent(Paddle, { playerIndex })
    .addComponent(Render, {
      primitive: "rect",
    })
    .addComponent(Movement, {
      direction,
      velocity,
    })
    .addComponent(Position, {
      value: position,
    })
    .addComponent(Size, { value: size })
    .addComponent(Collidable);
}
