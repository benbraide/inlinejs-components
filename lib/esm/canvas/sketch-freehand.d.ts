import { ISketchPluginParams } from "../types";
import { SketchLinePlugin } from "./sketch-line-plugin";
export declare class SketchFreehand extends SketchLinePlugin {
    constructor();
    HandleDraw({ offsetX, offsetY }: ISketchPluginParams): void;
}
export declare function SketchFreehandCompact(): void;
