import { Scene } from "./Scene";
import { createBall } from "../entities";
import { Vector2 } from "../types/Vector2Type";
import { Random } from "../utils";
import { Entity } from "ecsy";

export class BallsScene extends Scene {
  balls: Entity[] = [];

  load(): void {
    const NUMBER_OF_BALLS = 500;
    for (let i = 0; i < NUMBER_OF_BALLS; i++) {
      this.balls[i] = createBall(
        this.world,
        new Vector2(
          Random.getRandomArbitrary(0, this.canvas.width),
          Random.getRandomArbitrary(0, this.canvas.height)
        ),
        Random.getRandomDirection(),
        10,
        10
      );
    }
  }
  unload(): void {
    this.balls.forEach((ball) => ball.remove());
  }
}
