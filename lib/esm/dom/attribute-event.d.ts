import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class AttributeEventElement extends CustomElement {
    target: HTMLElement | null;
    context: HTMLElement | null;
    type: Array<string> | string;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function AttributeEventElementCompact(): void;
