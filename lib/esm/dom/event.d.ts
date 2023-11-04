import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class EventElement extends CustomElement {
    target: HTMLElement | typeof globalThis | Document | null;
    context: HTMLElement | null;
    type: Array<string> | string;
    once: boolean;
    prevent: boolean;
    stop: boolean;
    stopImmediate: boolean;
    window: boolean;
    document: boolean;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function EventElementCompact(): void;
