import { Component, Types } from "ecsy";

interface IPropTypes {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export class CanvasContextComponent extends Component<IPropTypes> {
  static schema = {
    ctx: { type: Types.Ref },
    width: { type: Types.Number },
    height: { type: Types.Number },
  };

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}
