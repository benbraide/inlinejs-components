import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class ProcessElement extends CustomElement {
    protected callback_: (() => void) | null;
    protected active_: boolean;
    UpdateActiveProperty(value: boolean): void;
    constructor();
    ProcessDirectivesCallback(callback: () => void): void;
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function ProcessElementCompact(): void;
