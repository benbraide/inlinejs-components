import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { ISketchPlugin, SketchDrawStageType } from "../types";
export declare class Sketch extends CustomElement {
    protected shadow_: HTMLCanvasElement | null;
    protected ctx_: CanvasRenderingContext2D | null;
    protected isDrawing_: boolean;
    protected plugins_: Record<string, Array<ISketchPlugin>>;
    plugin: Array<string> | string;
    disabled: boolean;
    UpdateWidthProperty(value: number): void;
    UpdateHeightProperty(value: number): void;
    constructor();
    GetContext(): CanvasRenderingContext2D | null;
    GetNative(): HTMLCanvasElement | null;
    GetBlob(type?: string): Promise<Blob | null> | null;
    GetDataUrl(type?: string): string;
    AddPlugin(plugin: ISketchPlugin): void;
    RemovePlugin(plugin: ISketchPlugin): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined): void;
    protected InitializeShadow_(): void;
    protected BeginDraw_(offsetX: number, offsetY: number): void;
    protected EndDraw_(offsetX: number, offsetY: number): void;
    protected Draw_(offsetX: number, offsetY: number): void;
    protected CallPlugins_(stage: SketchDrawStageType, offsetX: number, offsetY: number): void;
}
export declare function SketchCompact(): void;
