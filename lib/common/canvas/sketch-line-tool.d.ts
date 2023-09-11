import { SketchTool } from "./sketch-tool";
import { ISketchPluginParams } from "../types";
export declare class SketchLineTool extends SketchTool {
    color: string;
    mode: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
    constructor(name?: string);
    HandleBeginDraw(params: ISketchPluginParams): void;
}
