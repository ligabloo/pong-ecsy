import { Scene } from "./Scene";
import { createBall, createPaddle } from "../entities";
import { Vector2 } from "../types/Vector2Type";
import { Random } from "../utils";
import { Entity } from "ecsy";

export class PongScene extends Scene {
  ball: Entity;
  paddle1: Entity;
  paddle2: Entity;

  load(): void {
    // Instantiate a circle entity on the middle of the canvas
    this.ball = createBall(
      this.world,
      new Vector2(this.canvas.width / 2, this.canvas.height / 2),
      Random.getRandomDirection(),
      10,
      10
    );

    // Instantiate paddles
    const paddleSize = new Vector2(20, 100);

    // Player 1
    this.paddle1 = createPaddle(
      this.world,
      0,
      new Vector2(10, this.canvas.height / 2 - paddleSize.y / 2),
      new Vector2(),
      10,
      paddleSize
    );

    // Player 2
    this.paddle2 = createPaddle(
      this.world,
      1,
      new Vector2(
        this.canvas.width - paddleSize.x - 10,
        this.canvas.height / 2 - paddleSize.y / 2
      ),
      new Vector2(),
      10,
      paddleSize
    );
  }
  unload(): void {
    this.ball.remove();
    this.paddle1.remove();
    this.paddle2.remove();
  }
}
