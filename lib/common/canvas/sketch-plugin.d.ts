import { CustomElement } from "@benbraide/inlinejs-element";
import { ISketchPlugin, ISketchPluginParams } from "../types";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class SketchPlugin extends CustomElement implements ISketchPlugin {
    protected canvas_: HTMLCanvasElement | null;
    name: string;
    disabled: boolean;
    constructor(name?: string);
    GetName(): string;
    SetCanvas(canvas: HTMLCanvasElement | null): void;
    Handle({ stage, ...rest }: ISketchPluginParams): boolean | void;
    HandleBeginDraw(params: ISketchPluginParams): void | boolean;
    HandleEndDraw(params: ISketchPluginParams): void;
    HandleDraw(params: ISketchPluginParams): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined): void;
}
