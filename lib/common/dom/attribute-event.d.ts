import { CustomElement } from "@benbraide/inlinejs-element";
export declare class AttributeEventElement extends CustomElement {
    target: HTMLElement | null;
    context: HTMLElement | null;
    type: Array<string> | string;
    constructor();
    protected HandlePostAttributesProcessPostfix_(): void;
}
export declare function AttributeEventElementCompact(): void;
