import { CustomElement } from "@benbraide/inlinejs-element";
export declare class CodeElement extends CustomElement {
    context: HTMLElement | null;
    name: string;
    watch: string;
    template: boolean;
    effect: boolean;
    constructor();
    protected HandlePostAttributesProcessPostfix_(): void;
}
export declare function CodeElementCompact(): void;
