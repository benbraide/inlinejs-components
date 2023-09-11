export declare type SketchDrawStageType = 'begin' | 'end' | 'draw';
export interface ISketchPluginParams {
    stage: SketchDrawStageType;
    offsetX: number;
    offsetY: number;
}
export interface ISketchPlugin {
    GetName(): string;
    SetCanvas(canvas: HTMLCanvasElement | null): void;
    Handle(params: ISketchPluginParams): void;
}
