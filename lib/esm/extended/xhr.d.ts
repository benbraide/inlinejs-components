import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after';
export declare class XhrElement extends CustomElement {
    protected loaded_: boolean;
    protected src_: string;
    target: HTMLElement | null;
    mode: XhrModeType;
    always: boolean;
    UpdateSrcProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected Fetch_(): void;
    protected HandleData_(data: string): void;
}
export declare function XhrElementCompact(): void;
