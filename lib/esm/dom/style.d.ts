import { IElementScope } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class StyleElement extends CustomElement {
    protected style_: HTMLStyleElement | HTMLLinkElement | null;
    src: string;
    constructor();
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostAttributesProcessPostfix_(): void;
}
export declare function StyleElementCompact(): void;
