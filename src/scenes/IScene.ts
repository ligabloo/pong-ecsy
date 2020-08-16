import { World } from "ecsy";

export interface IScene {
  load(world: World, canvas: HTMLCanvasElement): void;
  unload(): void;
}
