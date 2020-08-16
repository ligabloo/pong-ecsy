import { World } from "ecsy";
import { CanvasContext } from "../components";

export abstract class Scene {
  world: World;
  canvas: HTMLCanvasElement;
  constructor(world: World, canvas: HTMLCanvasElement) {
    this.world = world;
    this.canvas = canvas;
  }

  abstract load(): void;

  abstract unload(): void;
}
