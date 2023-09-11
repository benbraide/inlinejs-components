import { SketchLineTool } from "./sketch-line-tool";
export declare class SketchCircle extends SketchLineTool {
    constructor();
    protected HandleDraw_(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void;
}
export declare function SketchCircleCompact(): void;
