import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";
export declare class SketchEraser extends SketchPlugin {
    radius: number;
    constructor();
    HandleDraw({ offsetX, offsetY }: ISketchPluginParams): void;
}
export declare function SketchEraserCompact(): void;
