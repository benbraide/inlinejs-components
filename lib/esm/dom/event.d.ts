import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class EventElement extends CustomElement {
    target: HTMLElement | typeof globalThis | null;
    context: HTMLElement | null;
    type: string;
    once: boolean;
    prevent: boolean;
    stop: boolean;
    stopImmediate: boolean;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function EventElementCompact(): void;
