import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class CodeElement extends CustomElement {
    context: HTMLElement | null;
    name: string;
    watch: string;
    template: boolean;
    effect: boolean;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function CodeElementCompact(): void;
