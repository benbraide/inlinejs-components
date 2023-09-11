import { SketchPlugin } from "./sketch-plugin";
export declare class SketchHistory extends SketchPlugin {
    protected index_: number;
    protected entries_: string[];
    protected isSaved_: boolean;
    protected savedBeforeUndo_: boolean;
    size: number;
    constructor();
    HandleBeginDraw(): void;
    HandleEndDraw(): void;
    Undo(): void;
    Redo(): void;
    Reset(): void;
    protected Save_(): void;
}
export declare function SketchHistoryCompact(): void;
