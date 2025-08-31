import { IElementScope } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class ScriptElement extends CustomElement {
    protected script_: HTMLScriptElement | null;
    src: string;
    constructor();
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostAttributesProcessPostfix_(): void;
}
export declare function ScriptElementCompact(): void;
