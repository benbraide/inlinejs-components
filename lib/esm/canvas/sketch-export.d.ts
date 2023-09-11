import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class SketchExport extends SketchPlugin {
    protected hiddenInput_: HTMLInputElement | null;
    UpdateNameProperty(value: string): void;
    constructor();
    HandleEndDraw(params: ISketchPluginParams): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined): void;
}
export declare function SketchExportCompact(): void;
