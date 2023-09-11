import { SketchLineTool } from "./sketch-line-tool";
export declare class SketchRectangle extends SketchLineTool {
    constructor();
    protected HandleDraw_(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void;
}
export declare function SketchRectangleCompact(): void;
