import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";
export declare class SketchLinePlugin extends SketchPlugin {
    color: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
    constructor(name?: string);
    HandleBeginDraw({ offsetX, offsetY }: ISketchPluginParams): void;
    HandleEndDraw(params: ISketchPluginParams): void;
}
