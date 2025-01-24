import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after' | 'replacebefore' | 'replaceafter';
export declare class XhrElement extends CustomElement {
    protected loaded_: boolean;
    protected src_: any;
    protected clearOn_: any;
    protected insertedElements_: Array<Element> | null;
    target: HTMLElement | null;
    transitionScope: HTMLElement | null;
    mode: XhrModeType;
    always: boolean;
    transition: boolean;
    directives: boolean;
    beforeremove: string;
    beforeinsert: string;
    afterremove: string;
    afterinsert: string;
    aftertransition: string;
    UpdateSrcProperty(value: string): void;
    UpdateClearOnProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected Fetch_(): void;
    protected HandleData_(data: string): void;
    protected Clear_(): void;
}
export declare function XhrElementCompact(): void;
