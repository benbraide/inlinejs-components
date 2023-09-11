import { SketchLineTool } from "./sketch-line-tool";
export declare class SketchLine extends SketchLineTool {
    constructor();
    protected HandleDraw_(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void;
}
export declare function SketchLineCompact(): void;
