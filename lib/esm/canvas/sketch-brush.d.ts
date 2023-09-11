import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";
export declare class SketchBrush extends SketchPlugin {
    radius: number;
    constructor();
    HandleDraw({ offsetX, offsetY }: ISketchPluginParams): void;
}
export declare function SketchBrushCompact(): void;
