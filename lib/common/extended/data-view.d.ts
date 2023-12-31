import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class DataViewElement extends CustomElement {
    protected codeElement_: HTMLElement | null;
    protected classPrefix_: string;
    protected value_: any;
    UpdateClassPrefixProperty(value: string): void;
    UpdateValueProperty(value: any): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected CreateClassName_(name: string): string;
    protected Refresh_(): void;
    protected RenderValue_(value: any): HTMLSpanElement | HTMLElement[];
    protected CreateSpanValue_(value: string, className: string | Array<string> | null): HTMLSpanElement;
}
export declare function DataViewElementCompact(): void;
